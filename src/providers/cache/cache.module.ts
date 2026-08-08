import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cacheable } from 'cacheable';
import { createKeyv } from '@keyv/redis';
import { CacheService } from './cache.service.js';

@Global()
@Module({
  providers: [
    {
      inject: [ConfigService],
      provide: 'CACHE_INSTANCE',
      useFactory: (configService: ConfigService) => {
        const secondary = createKeyv(configService.getOrThrow('redisUrl'));
        return new Cacheable({
          secondary,
          ttl: configService.getOrThrow('defaultTTL'),
        });
      },
    },
    CacheService,
  ],
  exports: ['CACHE_INSTANCE', CacheService],
})
export class CacheModule {}
