import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { LoggerService } from '@app/logger';

@Injectable()
export class SchedulerService implements OnApplicationBootstrap {
  constructor(
    @InjectQueue('scheduler_queue')
    private readonly queue: Queue,

    private readonly logger: LoggerService,
  ) {
    logger.setContext(SchedulerService.name);
  }
  async onApplicationBootstrap(): Promise<void> {
    await this.queue.upsertJobScheduler('nullify_balances_scheduler', {
      every: 100000,
    });

    this.logger.log(`Зарегистрирован планировщик nullify_balances_scheduler`);
  }
}
