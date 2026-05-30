import { Module } from '@nestjs/common';
import { PrismaModule } from './providers/databases/prisma/prisma.module.js';
import { FeaturesModule } from './features/features.module.js';
import { ConfigModule } from '@nestjs/config';
import appConfig from './configs/app.config.js';

@Module({
  imports: [
    PrismaModule,
    FeaturesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
  ],
})
export class AppModule {}
