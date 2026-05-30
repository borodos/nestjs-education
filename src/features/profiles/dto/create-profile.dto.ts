import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({
    example: 12,
    description: 'Возраст пользователя',
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  age: number;

  @ApiProperty({
    example: 'Какой-то текст',
    description: 'Описание профиля',
  })
  @IsNotEmpty()
  description: string;

  @ApiHideProperty()
  user_id: number;
}
