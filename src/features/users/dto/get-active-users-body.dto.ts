import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class GetActiveUsersBodyDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  minAge: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  maxAge: number;
}
