import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateTodoDto, TodoStatus } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

export interface FindTodosFilter {
  status?: TodoStatus;
  q?: string;
}

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async findAll(filter: FindTodosFilter = {}): Promise<Todo[]> {
    const qb = this.todoRepository
      .createQueryBuilder('todo')
      .orderBy('todo.position', 'ASC')
      .addOrderBy('todo.id', 'ASC');

    if (filter.status) {
      qb.andWhere('todo.status = :status', { status: filter.status });
    }

    if (filter.q) {
      qb.andWhere('todo.title ILIKE :q', { q: `%${filter.q}%` });
    }

    return await qb.getMany();
  }

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todoRepository.create(createTodoDto);

    if (todo.position === undefined || todo.position === null) {
      // New todos float to the top of the list.
      const raw = await this.todoRepository
        .createQueryBuilder('todo')
        .select('MIN(todo.position)', 'min')
        .getRawOne<{ min: number | null }>();

      const min = raw?.min;
      todo.position = min === null || min === undefined ? 0 : Number(min) - 1;
    }

    return await this.todoRepository.save(todo);
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id);
    Object.assign(todo, updateTodoDto);
    return await this.todoRepository.save(todo);
  }

  async bulkUpdate(ids: number[], status: TodoStatus): Promise<Todo[]> {
    await this.todoRepository.update({ id: In(ids) }, { status });
    return await this.todoRepository.find({
      where: { id: In(ids) },
      order: { position: 'ASC', id: 'ASC' },
    });
  }

  async reorder(ids: number[]): Promise<Todo[]> {
    const todos = await this.todoRepository.find({ where: { id: In(ids) } });
    const byId = new Map(todos.map((todo) => [todo.id, todo]));

    ids.forEach((id, index) => {
      const todo = byId.get(id);
      if (todo) {
        todo.position = index;
      }
    });

    return await this.todoRepository.save([...byId.values()]);
  }

  async remove(id: number): Promise<void> {
    const todo = await this.findOne(id);
    await this.todoRepository.remove(todo);
  }
}
