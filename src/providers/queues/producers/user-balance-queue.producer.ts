import { Inject, Injectable } from '@nestjs/common';
import { Queue, randomUUID } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '../queues.js';
import {
  type IQueueJobsRepository,
  QUEUES_REPOSITORY,
} from '../../../common/repositories/queues/queue-jobs.repository.interface.js';
import { CustomLoggerService } from '../../logger/logger.service.js';
import { ConfigService } from '@nestjs/config';
import { InputJsonValue, JsonNull } from '@prisma/client/runtime/client';

@Injectable()
export class UserBalanceQueueProducer {
  constructor(
    @InjectQueue(QUEUE_NAMES.userBalance)
    private readonly queue: Queue,

    @Inject(QUEUES_REPOSITORY)
    private readonly queueJobsRepository: IQueueJobsRepository,

    private readonly logger: CustomLoggerService,
    private readonly configService: ConfigService,
  ) {
    logger.setContext(UserBalanceQueueProducer.name);
  }

  async nullifyBalances(idempotencyKey?: string) {
    const jobId = idempotencyKey ?? randomUUID();
    const jobName = 'nullify_balances';

    await this.queueJobsRepository.persist({
      jobId,
      queueName: QUEUE_NAMES.userBalance,
      jobName: jobName,
      payload: JsonNull as unknown as InputJsonValue,
      attempts: 0,
    });

    try {
      await this.queue.add(jobName, null, {
        jobId,
        attempts: this.configService.getOrThrow('defaultJobAttempts'),
      });
    } catch (e) {
      this.logger.error(e);
      await this.queueJobsRepository.delete(jobId);
      throw e;
    }
  }
}
