import { Module } from '@nestjs/common';
import { NotificationModule } from './notification/notification.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    NotificationModule,
    RouterModule.register([
      {
        path: 'api',
        module: NotificationModule,
      },
    ]),
  ],
})
export class FeaturesModule {}
