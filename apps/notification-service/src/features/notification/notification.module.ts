import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from '../../gateway/notification/notification.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { NOTIFICATION_REPOSITORY } from '../../common/repositories/notification/notification.repository.interface';
import { NotificationRepository } from '../../common/repositories/notification/notification.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from '../../../../../mongodb/schemas/notifications.schema';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('jwtAccessSecret'),
      }),
    }),
    MongooseModule.forFeature([
      {
        name: Notification.name,
        schema: NotificationSchema,
      },
    ]),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationGateway,
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: NotificationRepository,
    },
  ],
})
export class NotificationModule {}
