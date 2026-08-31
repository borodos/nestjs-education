import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { PROFILES_REPOSITORY } from '../../common/repositories/profiles/profiles.repository.interface';
import { ProfilesRepository } from '../../common/repositories/profiles/profiles.repository';
import { AvatarsModule } from '../avatars/avatars.module';

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
