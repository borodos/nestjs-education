import { Global, Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service.js';
import { BullModule } from '@nestjs/bullmq';
import { SchedulerProcessor } from './scheduler.processor.js';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'scheduler_queue',
    }),
  ],
  providers: [SchedulerService, SchedulerProcessor],
})
export class SchedulerModule {}
