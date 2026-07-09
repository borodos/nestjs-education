import * as PrismaClient from '@prisma/client/runtime/client';
import { QueueJobStatus } from '../../../../generated/prisma/enums.js';
import { IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

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
