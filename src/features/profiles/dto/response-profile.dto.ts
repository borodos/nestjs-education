import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class ResponseProfileDto {
  @ApiProperty({
    example: 1,
    description: 'ID профиля',
  })
  @IsInt()
  @IsPositive()
  id: number;

  @ApiProperty({
    example: 1,
    description: 'ID пользователя, к которому пренадлежит профиль',
  })
  @IsInt()
  @IsPositive()
  user_id: number;

  @ApiProperty({
    example: 12,
    description: 'Возраст',
  })
  @IsInt()
  @IsPositive()
  age: number;

  @ApiProperty({
    example: 'Какой-то текст',
    description: 'Описание профиля',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2026-05-29T17:24:56.436Z' })
  created_at: string;

  @ApiProperty({ example: '2026-05-29T17:24:56.436Z' })
  updated_at: string;

  @ApiProperty({ example: '2026-05-29T17:24:56.436Z' })
  deleted_at: string;
}
