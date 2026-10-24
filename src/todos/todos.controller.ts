import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto, TODO_STATUSES, TodoStatus } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { BulkUpdateTodoDto } from './dto/bulk-update-todo.dto';
import { OrderTodosDto } from './dto/order-todos.dto';
import { Todo } from './entities/todo.entity';

@Controller('api/todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  // 200 + list, supports ?status=DONE and ?q=milk 
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query('status') status?: string,
    @Query('q') q?: string,
  ): Promise<Todo[]> {
    let parsedStatus: TodoStatus | undefined;
    if (status !== undefined && status !== '') {
      if (!TODO_STATUSES.includes(status as TodoStatus)) {
        throw new BadRequestException(
          `Invalid status "${status}". Allowed: ${TODO_STATUSES.join(', ')}`,
        );
      }
      parsedStatus = status as TodoStatus;
    }

    return this.todosService.findAll({
      status: parsedStatus,
      q: q && q.trim() !== '' ? q.trim() : undefined,
    });
  }

  // 201 + new todo, or 400 (validation)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todosService.create(createTodoDto);
  }

  // 200 + updated todos. Declared before :id so "bulk" is not parsed as an id.
  @Patch('bulk')
  @HttpCode(HttpStatus.OK)
  bulkUpdate(@Body() bulkUpdateTodoDto: BulkUpdateTodoDto): Promise<Todo[]> {
    return this.todosService.bulkUpdate(
      bulkUpdateTodoDto.ids,
      bulkUpdateTodoDto.status,
    );
  }

  // 200 + reordered todos. Declared before :id so "order" is not parsed as an id.
  @Patch('order')
  @HttpCode(HttpStatus.OK)
  reorder(@Body() orderTodosDto: OrderTodosDto): Promise<Todo[]> {
    return this.todosService.reorder(orderTodosDto.ids);
  }

  // 200 + todo, or 404
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Todo> {
    return this.todosService.findOne(id);
  }

  // 200 + todo, or 404 (400 on validation)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todosService.update(id, updateTodoDto);
  }

  // 204 no content, or 404
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.todosService.remove(id);
  }
}
