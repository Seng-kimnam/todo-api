import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class OrderTodosDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];
}
