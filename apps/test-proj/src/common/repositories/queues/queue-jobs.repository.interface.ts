import { UpdateQueueJobs } from '../../dto/queue-jobs/update-queue-jobs.dto';
import { CreateQueueJobsDto } from '../../dto/queue-jobs/create-queue-jobs.dto';
import { QueueJob } from '../../../../../../generated/prisma/client';

export interface IQueueJobsRepository {
  persist(data: CreateQueueJobsDto): Promise<QueueJob | null>;
  update(jobId: string, data: UpdateQueueJobs): Promise<QueueJob | null>;
  delete(jobId: string): Promise<QueueJob | null>;
}

export const QUEUES_REPOSITORY = Symbol('QUEUES_REPOSITORY');
