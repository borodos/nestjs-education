import { Module } from '@nestjs/common';
import { FeaturesModule } from './features/features.module';
import { LoggerModule } from '@app/logger';
import { ConfigModule } from '@nestjs/config';
import notificationServiceConfig from './configs/notification-service.config';
import { MongodbModule } from './providers/database/mongodb/mongodb.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [notificationServiceConfig],
    }),
    FeaturesModule,
    MongodbModule,
  ],
})
export class NotificationServiceModule {}
