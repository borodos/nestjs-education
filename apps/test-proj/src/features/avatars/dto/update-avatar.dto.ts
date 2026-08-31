import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateAvatarDto {
  @IsString()
  @IsOptional()
  readonly fileName?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  readonly size?: number;
}
