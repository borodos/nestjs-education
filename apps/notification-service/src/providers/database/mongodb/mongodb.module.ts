import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@app/logger';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService, LoggerService],
      useFactory: (configService: ConfigService, logger: LoggerService) => ({
        uri: configService.getOrThrow('mongodbUrl'),
        onConnectionCreate: () => {
          logger.debug('Успешное подключение к MongoDB');
        },
      }),
    }),
  ],
})
export class MongodbModule {}
