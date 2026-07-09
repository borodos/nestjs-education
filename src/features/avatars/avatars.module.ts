import { Module } from '@nestjs/common';
import { AvatarsController } from './avatars.controller.js';
import { AvatarsService } from './avatars.service.js';
import { FilesModule } from '../../providers/files/files.module.js';
import { PROFILES_REPOSITORY } from '../../common/repositories/profiles/profiles.repository.interface.js';
import { ProfilesRepository } from '../../common/repositories/profiles/profiles.repository.js';
import { AVATARS_REPOSITORY } from '../../common/repositories/avatars/avatars.repository.interface.js';
import { AvatarRepository } from '../../common/repositories/avatars/avatars.repository.js';

@Module({
  imports: [FilesModule],
  controllers: [AvatarsController],
  providers: [
    AvatarsService,
    {
      provide: PROFILES_REPOSITORY,
      useClass: ProfilesRepository,
    },
    {
      provide: AVATARS_REPOSITORY,
      useClass: AvatarRepository,
    },
  ],
})
export class AvatarsModule {}
