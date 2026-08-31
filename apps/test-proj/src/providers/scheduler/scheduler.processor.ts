import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../databases/prisma/prisma.service';
import { LoggerService } from '@app/logger';

@Processor('scheduler_queue')
export class SchedulerProcessor extends WorkerHost {
  constructor(
    private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
  ) {
    super();
    logger.setContext(SchedulerProcessor.name);
  }

  async process(job: Job) {
    this.logger.log(
      `📋 Обработка запланированной задачи - name: ${job.name}, queueName: ${job.queueName}, jobId: ${job.id}.`,
    );

    await this.prismaService.user.updateMany({
      data: {
        balance: 0,
      },
    });
  }

  @OnWorkerEvent('completed')
  handleCompleted(job: Job) {
    this.logger.log(
      `📋 Запланнированная задача "${job.name}, jobId - ${job.id}" успешно завершена.`,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    this.logger.log(
      `📋 Запланнированная задача "${job.name}, jobId - ${job.id}" не выполнилась. Ошибка: ${job.failedReason}`,
    );
  }
}
