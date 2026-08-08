import * as PrismaClient from '@prisma/client/runtime/client';
import { IsInt, IsJSON, IsString, IsUUID } from 'class-validator';

export class CreateQueueJobsDto {
  @IsUUID()
  jobId: string;

  @IsString()
  queueName: string;

  @IsString()
  jobName: string;

  @IsJSON()
  payload: PrismaClient.InputJsonValue;

  @IsInt()
  attempts: number;
}
