import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { Expose } from 'class-transformer';

export class TransferBodyDto {
  @Expose({ name: 'to_user_id' })
  @IsInt()
  @IsPositive()
  readonly toUserId: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  readonly amount: number;
}
