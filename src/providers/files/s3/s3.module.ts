import * as AWS from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { S3Lib } from './constants/do-spaces-service-lib.constant.js';
import { S3Service } from './s3.service.js';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    S3Service,
    {
      provide: S3Lib,
      useFactory: (configService: ConfigService) => {
        return new AWS.S3({
          endpoint: configService.getOrThrow('minioStorageUrl'),
          region: 'ru-central1',
          credentials: {
            accessKeyId: configService.getOrThrow('minioUser'),
            secretAccessKey: configService.getOrThrow('minioPassword'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [S3Service, S3Lib],
})
export class S3Module {}
