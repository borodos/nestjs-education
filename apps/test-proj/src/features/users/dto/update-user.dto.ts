import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  login?: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  refresh_token?: string | null;
}
