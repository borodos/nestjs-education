import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Queue } from 'bullmq';
import { CustomLoggerService } from '../logger/logger.service.js';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class SchedulerService implements OnApplicationBootstrap {
  constructor(
    @InjectQueue('scheduler_queue')
    private readonly queue: Queue,

    private readonly logger: CustomLoggerService,
  ) {
    logger.setContext(SchedulerService.name);
  }
  async onApplicationBootstrap(): Promise<void> {
    await this.queue.upsertJobScheduler('nullify_balances_scheduler', {
      every: 10000,
    });

    this.logger.log(`Зарегистрирован планировщик nullify_balances_scheduler`);
  }
}
