import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ description: 'Логин пользователя', example: 'test' })
  @IsNotEmpty()
  login: string;

  @ApiProperty({ description: 'Пароль пользователя', example: '123' })
  @IsNotEmpty()
  password: string;
}
