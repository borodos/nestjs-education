import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE_NAMES } from '../queues';
import { Inject } from '@nestjs/common';
import {
  type IQueueJobsRepository,
  QUEUES_REPOSITORY,
} from '../../../common/repositories/queues/queue-jobs.repository.interface';
import { QueueJobStatus } from '../../../../../../generated/prisma/enums';
import { InputJsonValue, JsonNull } from '@prisma/client/runtime/client';
import { PrismaService } from '../../databases/prisma/prisma.service';
import { LoggerService } from '@app/logger';

@Processor(QUEUE_NAMES.userBalance)
export class UserBalanceQueueProcessor extends WorkerHost {
  constructor(
    @Inject(QUEUES_REPOSITORY)
    private readonly queueJobsRepository: IQueueJobsRepository,
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
  ) {
    super();
    logger.setContext(UserBalanceQueueProcessor.name);
  }

  async process(job: Job): Promise<any> {
    this.logger.log(
      `🎩 Обработка задачи - name: ${job.name}, queueName: ${job.queueName}, jobId: ${job.id}.`,
    );

    await this.prismaService.user.updateMany({
      data: {
        balance: 0,
      },
    });

    await this.queueJobsRepository.update(job.id as string, {
      status: QueueJobStatus.ACTIVE,
      attempts: job.attemptsMade,
    });
  }

  @OnWorkerEvent('completed')
  async handleCompleted(job: Job, result: any): Promise<any> {
    await this.queueJobsRepository.update(job.id as string, {
      result: (result ?? JsonNull) as InputJsonValue,
      status: QueueJobStatus.COMPLETED,
      attempts: job.attemptsMade,
    });

    this.logger.log(
      `🎩 Задача "${job.name}, jobId - ${job.id}" успешно завершена.`,
    );
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job) {
    await this.queueJobsRepository.update(job.id as string, {
      status: QueueJobStatus.FAILED,
      attempts: job.attemptsMade,
      failedReason: job.failedReason ?? null,
    });

    this.logger.log(
      `🎩 Задача "${job.name}, jobId - ${job.id}" не выполнилась. Ошибка: ${job.failedReason}`,
    );
  }
}
