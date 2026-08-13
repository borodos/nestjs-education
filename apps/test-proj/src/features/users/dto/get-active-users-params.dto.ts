import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class GetActiveUsersParamsDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  minAge: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  maxAge: number;
}
