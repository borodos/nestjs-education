import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProfileDto } from '../../profiles/dto/create-profile.dto.js';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Логин пользователя',
    example: 'login_test',
  })
  @IsNotEmpty()
  login: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: '12345678',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Профиль пользователя',
  })
  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile: CreateProfileDto;
}
