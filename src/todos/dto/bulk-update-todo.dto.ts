import { ArrayNotEmpty, IsArray, IsIn, IsInt } from 'class-validator';
import { TODO_STATUSES } from './create-todo.dto';

export type TodoStatus = (typeof TODO_STATUSES)[number];

export class BulkUpdateTodoDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];

  @IsIn(TODO_STATUSES)
  status: TodoStatus;
}
