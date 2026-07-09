import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller.js';
import { ProfilesService } from './profiles.service.js';
import { PROFILES_REPOSITORY } from '../../common/repositories/profiles/profiles.repository.interface.js';
import { ProfilesRepository } from '../../common/repositories/profiles/profiles.repository.js';
import { AvatarsModule } from '../avatars/avatars.module.js';

@Module({
  imports: [AvatarsModule],
  controllers: [ProfilesController],
  providers: [
    ProfilesService,
    {
      provide: PROFILES_REPOSITORY,
      useClass: ProfilesRepository,
    },
  ],
})
export class ProfilesModule {}
