import { Module } from '@nestjs/common';
import { S3Module } from './s3/s3.module.js';
import { IFileService } from './files.adapter.js';
import { S3Service } from './s3/s3.service.js';

@Module({
  imports: [S3Module],
  providers: [
    {
      provide: IFileService,
      useClass: S3Service,
    },
  ],
  exports: [IFileService],
})
export class FilesModule {}
