import { Module } from '@nestjs/common';
import { PrismaModule } from './providers/databases/prisma/prisma.module';
import { FeaturesModule } from './features/features.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './configs/app.config';
import { BullModule } from '@nestjs/bullmq';
import { QueuesModule } from './providers/queues/queues.module';
import { CacheModule } from './providers/cache/cache.module';
import { SchedulerModule } from './providers/scheduler/scheduler.module';
import { LoggerModule } from '@app/logger';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: 'NOTIFICATIONS_CLIENT',
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'users-service',
                brokers: [configService.getOrThrow('kafkaBrokerUrl')],
              },
              producerOnlyMode: true,
            },
          }),
        },
      ],
    }),
  ],
})
export class AppModule {}
