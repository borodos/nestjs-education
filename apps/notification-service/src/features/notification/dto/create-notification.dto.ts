import { IsInt, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsInt()
  currentUserId: number;

  @IsInt()
  toUserId: number;

  @IsInt()
  amount: number;

  @IsString()
  date: string;
}
