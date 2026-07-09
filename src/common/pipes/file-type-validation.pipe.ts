import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  private readonly fileTypes: string[];

  constructor(options: { types: string[] }) {
    this.fileTypes = options.types;
  }

  transform(value: Express.Multer.File): Express.Multer.File {
    if (!this.fileTypes.includes(value.mimetype)) {
      throw new BadRequestException('Неверный формат файла!');
    }

    return value;
  }
}
