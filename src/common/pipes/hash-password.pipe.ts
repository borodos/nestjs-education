import { Injectable, PipeTransform } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HashPasswordPipe implements PipeTransform {
  constructor(private configService: ConfigService) {}

  transform(value: string) {
    const saltOrRounds = this.configService.getOrThrow<number>('saltOrRounds');
    return bcrypt.hash(value, saltOrRounds);
  }
}
