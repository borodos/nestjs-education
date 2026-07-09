import * as AWS from '@aws-sdk/client-s3';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { IFileService } from '../files.adapter.js';
import { RemoveFilePayloadDto } from './dto/remove-file-payload.dto.js';
import { UploadFileResultDto } from './dto/upload-file-result.dto.js';
import { UploadFilePayloadDto } from './dto/upload-file-payload.dto.js';
import { S3Lib } from './constants/do-spaces-service-lib.constant.js';
import { UploadException } from './exceptions/upload.exception.js';
import { RemoveException } from './exceptions/remove.exception.js';
import {
  CreateBucketCommand,
  PutBucketPolicyCommand,
} from '@aws-sdk/client-s3';
import { CustomLoggerService } from '../../logger/logger.service.js';
import buckets from './constants/buckets.js';

@Injectable()
export class S3Service extends IFileService implements OnModuleInit {
  private readonly logger = new CustomLoggerService(S3Service.name);
  private readonly bucketName = buckets.MY_BUCKET;

  constructor(@Inject(S3Lib) private readonly S3: AWS.S3) {
    super();
  }

  async onModuleInit() {
    await this.createBucketIfNotExists();
    await this.makeBucketPublic();
  }

  async createBucketIfNotExists() {
    try {
      await this.S3.send(new CreateBucketCommand({ Bucket: this.bucketName }));
      this.logger.log(`Bucket '${this.bucketName}' создан.`);
    } catch (err: unknown) {
      const name = err instanceof Error ? err.name : undefined;
      if (
        name === 'BucketAlreadyOwnedByYou' ||
        name === 'BucketAlreadyExists'
      ) {
        this.logger.log(`Bucket '${this.bucketName}' уже сущестует.`);
      } else {
        this.logger.error('Ошибка создания bucket:', err);
        throw err;
      }
    }
  }

  async makeBucketPublic() {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicRead',
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${this.bucketName}/*`],
        },
      ],
    };

    const command = new PutBucketPolicyCommand({
      Bucket: this.bucketName,
      Policy: JSON.stringify(policy),
    });

    try {
      await this.S3.send(command);
      this.logger.log(`Bucket '${this.bucketName}' теперь публичный.`);
    } catch (err) {
      this.logger.error('Ошибка настройки политики для bucket:', err);
      throw err;
    }
  }

  async uploadFile(dto: UploadFilePayloadDto): Promise<UploadFileResultDto> {
    const { folder, file, name } = dto;
    const path = `${folder}/${name}`;

    this.logger.log('📁 Начало загрузки файла в bucket');

    return new Promise((resolve, reject) => {
      this.S3.putObject(
        {
          Bucket: this.bucketName,
          Key: path,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
        },
        (error: Error) => {
          if (!error) {
            this.logger.log('✅ Загрузка прошла успешно!');
            resolve({
              path,
            });
          } else {
            this.logger.error(`❌ Ошибка загрузки файла по пути: ${path}`);
            this.logger.error(error);
            reject(new UploadException(error.message));
          }
        },
      );
    });
  }

  async removeFile(dto: RemoveFilePayloadDto): Promise<void> {
    const { path } = dto;

    this.logger.log('🗑️ Начало удаление файла из bucket');

    return new Promise((resolve, reject) => {
      this.S3.deleteObject(
        {
          Bucket: this.bucketName,
          Key: path,
        },
        (error: Error) => {
          if (!error) {
            this.logger.log('✅ Удаление прошло успешно!');
            resolve();
          } else {
            this.logger.error(`❌ Ошибка удаления файла по пути: ${path}`);
            reject(new RemoveException(error.message));
          }
        },
      );
    });
  }
}
