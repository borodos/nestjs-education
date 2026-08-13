import { Injectable } from '@nestjs/common';
import { IQueueJobsRepository } from './queue-jobs.repository.interface';
import { PrismaService } from '../../../providers/databases/prisma/prisma.service';
import { UpdateQueueJobs } from '../../dto/queue-jobs/update-queue-jobs.dto';
import { CreateQueueJobsDto } from '../../dto/queue-jobs/create-queue-jobs.dto';
import { QueueJob } from '../../../../../../generated/prisma/client';

@Injectable()
export class QueueJobsRepository implements IQueueJobsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async persist(data: CreateQueueJobsDto): Promise<QueueJob | null> {
    return this.prismaService.queueJob.create({
      data,
    });
  }

  async update(jobId: string, data: UpdateQueueJobs): Promise<QueueJob | null> {
    return this.prismaService.queueJob.update({
      where: { jobId: jobId },
      data,
    });
  }

  async delete(jobId: string): Promise<QueueJob | null> {
    return this.prismaService.queueJob.delete({
      where: { jobId: jobId },
    });
  }
}
