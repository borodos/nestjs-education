import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class ResponseUserDto {
  @ApiProperty({
    example: 1,
    description: 'ID пользователя',
  })
  @IsInt()
  @IsPositive()
  id: number;

  @ApiProperty({
    example: 'test_login',
    description: 'Логин пользователя',
  })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({
    example: 12,
    description: 'Возраст пользователя',
  })
  @ApiProperty({ example: '2026-05-29T17:24:56.436Z' })
  created_at: string;

  @ApiProperty({ example: '2026-05-29T17:24:56.436Z' })
  updated_at: string;

  @ApiProperty({ example: '2026-05-29T17:24:56.436Z' })
  deleted_at: string;
}
