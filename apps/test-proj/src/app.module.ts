import { Module } from '@nestjs/common';
import { PrismaModule } from './providers/databases/prisma/prisma.module';
import { FeaturesModule } from './features/features.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './configs/app.config';
import { LoggerModule } from './providers/logger/logger.module';
import { BullModule } from '@nestjs/bullmq';
import { QueuesModule } from './providers/queues/queues.module';
import { CacheModule } from './providers/cache/cache.module';
import { SchedulerModule } from './providers/scheduler/scheduler.module';

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
