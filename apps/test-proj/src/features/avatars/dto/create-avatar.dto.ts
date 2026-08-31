import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateAvatarDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly profileId: number;

  @IsString()
  @IsNotEmpty()
  readonly fileName: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly size: number;
}
