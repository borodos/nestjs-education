import { QueueJob } from '../../../../generated/prisma/client.js';
import { UpdateQueueJobs } from '../../dto/queue-jobs/update-queue-jobs.dto.js';
import { CreateQueueJobsDto } from '../../dto/queue-jobs/create-queue-jobs.dto.js';

export interface IQueueJobsRepository {
  persist(data: CreateQueueJobsDto): Promise<QueueJob | null>;
  update(jobId: string, data: UpdateQueueJobs): Promise<QueueJob | null>;
  delete(jobId: string): Promise<QueueJob | null>;
}

export const QUEUES_REPOSITORY = Symbol('QUEUES_REPOSITORY');
