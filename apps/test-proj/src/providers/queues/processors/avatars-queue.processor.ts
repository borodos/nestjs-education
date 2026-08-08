import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CustomLoggerService } from '../../logger/logger.service';
import { QUEUE_NAMES } from '../queues';
import { Inject } from '@nestjs/common';
import {
  type IQueueJobsRepository,
  QUEUES_REPOSITORY,
} from '../../../common/repositories/queues/queue-jobs.repository.interface';
import { QueueJobStatus } from '../../../../../../generated/prisma/enums';
import { InputJsonValue, JsonNull } from '@prisma/client/runtime/client';
import {
  AVATARS_REPOSITORY,
  type IAvatarsRepository,
} from '../../../common/repositories/avatars/avatars.repository.interface';
import { CreateAvatarDto } from '../../../features/avatars/dto/create-avatar.dto';

@Processor(QUEUE_NAMES.addAvatarToProfile)
export class AvatarsQueueProcessor extends WorkerHost {
  constructor(
    @Inject(QUEUES_REPOSITORY)
    private readonly queueJobsRepository: IQueueJobsRepository,
    private readonly logger: CustomLoggerService,

    @Inject(AVATARS_REPOSITORY)
    private readonly avatarRepository: IAvatarsRepository,
  ) {
    super();
    logger.setContext(AvatarsQueueProcessor.name);
  }

  async process(job: Job): Promise<any> {
    this.logger.log(
      `🎩 Обработка задачи - name: ${job.name}, queueName: ${job.queueName}, jobId: ${job.id}.`,
    );

    await this.avatarRepository.create(job.data as CreateAvatarDto);

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
