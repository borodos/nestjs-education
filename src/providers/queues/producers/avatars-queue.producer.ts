import { Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, randomUUID } from 'bullmq';
import {
  type IQueueJobsRepository,
  QUEUES_REPOSITORY,
} from '../../../common/repositories/queues/queue-jobs.repository.interface.js';
import { QUEUE_NAMES } from '../queues.js';
import { CustomLoggerService } from '../../logger/logger.service.js';
import { ConfigService } from '@nestjs/config';
import { CreateAvatarDto } from '../../../features/avatars/dto/create-avatar.dto.js';

@Injectable()
export class AvatarsQueueProducer {
  constructor(
    @InjectQueue(QUEUE_NAMES.addAvatarToProfile)
    private readonly queue: Queue,

    @Inject(QUEUES_REPOSITORY)
    private readonly queueJobsRepository: IQueueJobsRepository,

    private readonly logger: CustomLoggerService,
    private readonly configService: ConfigService,
  ) {
    logger.setContext(AvatarsQueueProducer.name);
  }

  async addAvatarToProfile(data: CreateAvatarDto, idempotencyKey?: string) {
    const jobId = idempotencyKey ?? randomUUID();
    const jobName = 'add_avatar_to_profile';

    await this.queueJobsRepository.persist({
      jobId,
      queueName: QUEUE_NAMES.addAvatarToProfile,
      jobName: jobName,
      payload: JSON.stringify(data),
      attempts: 0,
    });

    try {
      await this.queue.add(jobName, data, {
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
