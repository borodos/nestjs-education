import { Module } from '@nestjs/common';
import { FeaturesModule } from './features/features/features.module';

@Module({
  imports: [FeaturesModule],
})
export class NotificationServiceModule {}
