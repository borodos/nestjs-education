import * as PrismaClient from '@prisma/client/runtime/client';
import { IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';
import { QueueJobStatus } from '../../../../../../generated/prisma/enums';

export class UpdateQueueJobs {
  @IsOptional()
  @IsNotEmpty()
  status?: QueueJobStatus;

  @IsOptional()
  result?: PrismaClient.InputJsonValue;

  @IsOptional()
  failedReason?: string;

  @IsOptional()
  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  attempts?: number;
}
