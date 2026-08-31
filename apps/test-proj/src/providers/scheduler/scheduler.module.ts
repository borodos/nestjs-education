import { Global, Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { BullModule } from '@nestjs/bullmq';
import { SchedulerProcessor } from './scheduler.processor';

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
