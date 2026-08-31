import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  private readonly maxSizeInBytes: number;

  constructor(options: { maxSize: number }) {
    this.maxSizeInBytes = options.maxSize;
  }

  transform(value: Express.Multer.File): Express.Multer.File {
    if (value.size > this.maxSizeInBytes) {
      throw new BadRequestException('Размер файла не должен превышать 10 Мб!');
    }

    return value;
  }
}
