import { IBaseRepository } from '../base.repository.interface';
import { CreateProfileDto } from '../../../features/profiles/dto/create-profile.dto';
import { UpdateProfileDTO } from '../../../features/profiles/dto/update-profile.dto';
import { Profile } from '../../../../../../generated/prisma/client';

export interface IProfilesRepository extends IBaseRepository<
  Profile,
  CreateProfileDto,
  UpdateProfileDTO
> {
  findByUserId(userId: number): Promise<Profile | null>;
}

export const PROFILES_REPOSITORY = Symbol('PROFILES_REPOSITORY');
