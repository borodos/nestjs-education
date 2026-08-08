import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AvatarsQueueProducer } from './producers/avatars-queue.producer.js';
import { AvatarsQueueProcessor } from './processors/avatars-queue.processor.js';
import { QUEUES_REPOSITORY } from '../../common/repositories/queues/queue-jobs.repository.interface.js';
import { QueueJobsRepository } from '../../common/repositories/queues/queue-jobs.repository.js';
import queues from './queues.js';
import { AVATARS_REPOSITORY } from '../../common/repositories/avatars/avatars.repository.interface.js';
import { AvatarRepository } from '../../common/repositories/avatars/avatars.repository.js';
import { UserBalanceQueueProducer } from './producers/user-balance-queue.producer.js';
import { UserBalanceQueueProcessor } from './processors/user-balance-queue.processor.js';

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
