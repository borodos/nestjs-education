import { Module } from '@nestjs/common';
import { AvatarsController } from './avatars.controller';
import { AvatarsService } from './avatars.service';
import { FilesModule } from '../../providers/files/files.module';
import { PROFILES_REPOSITORY } from '../../common/repositories/profiles/profiles.repository.interface';
import { ProfilesRepository } from '../../common/repositories/profiles/profiles.repository';
import { AVATARS_REPOSITORY } from '../../common/repositories/avatars/avatars.repository.interface';
import { AvatarRepository } from '../../common/repositories/avatars/avatars.repository';

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
