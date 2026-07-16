import { Module } from '@nestjs/common';
import { PrismaModule } from './providers/databases/prisma/prisma.module.js';
import { FeaturesModule } from './features/features.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './configs/app.config.js';
import { LoggerModule } from './providers/logger/logger.module.js';
import { BullModule } from '@nestjs/bullmq';
import { QueuesModule } from './providers/queues/queues.module.js';
import { CacheModule } from './providers/cache/cache.module.js';
import { SchedulerModule } from './providers/scheduler/scheduler.module.js';

@Module({
  imports: [
    PrismaModule,
    FeaturesModule,
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.getOrThrow('redisHost'),
          port: configService.getOrThrow('redisPort'),
        },
      }),
      inject: [ConfigService],
    }),
    CacheModule,
    QueuesModule,
    SchedulerModule,
  ],
})
export class AppModule {}
