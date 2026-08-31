import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AvatarsQueueProducer } from './producers/avatars-queue.producer';
import { AvatarsQueueProcessor } from './processors/avatars-queue.processor';
import { QUEUES_REPOSITORY } from '../../common/repositories/queues/queue-jobs.repository.interface';
import { QueueJobsRepository } from '../../common/repositories/queues/queue-jobs.repository';
import queues from './queues';
import { AVATARS_REPOSITORY } from '../../common/repositories/avatars/avatars.repository.interface';
import { AvatarRepository } from '../../common/repositories/avatars/avatars.repository';
import { UserBalanceQueueProducer } from './producers/user-balance-queue.producer';
import { UserBalanceQueueProcessor } from './processors/user-balance-queue.processor';

@Global()
@Module({
  imports: [BullModule.registerQueue(...queues)],
  providers: [
    AvatarsQueueProducer,
    AvatarsQueueProcessor,
    UserBalanceQueueProducer,
    UserBalanceQueueProcessor,
    {
      provide: QUEUES_REPOSITORY,
      useClass: QueueJobsRepository,
    },
    {
      provide: AVATARS_REPOSITORY,
      useClass: AvatarRepository,
    },
  ],
  exports: [AvatarsQueueProducer, UserBalanceQueueProducer],
})
export class QueuesModule {}
