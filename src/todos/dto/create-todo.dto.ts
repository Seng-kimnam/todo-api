import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export const TODO_STATUSES = ['TODO', 'DONE'] as const;
export type TodoStatus = (typeof TODO_STATUSES)[number];

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsIn(TODO_STATUSES)
  status?: TodoStatus;

  @IsOptional()
  @IsBoolean()
  starred?: boolean;

  @IsOptional()
  @IsInt()
  position?: number;
}
