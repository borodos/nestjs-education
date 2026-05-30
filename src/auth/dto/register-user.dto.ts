import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateProfileDto } from '../../features/profiles/dto/create-profile.dto.js';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    example: 'test_login',
    description: 'Уникальный логин пользователя',
  })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({
    example: 'password',
    description: 'Пароль пользователя',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ type: () => CreateProfileDto, description: 'Данные профиля' })
  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile: CreateProfileDto;
}
