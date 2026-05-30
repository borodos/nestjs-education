import { IBaseRepository } from '../base.repository.interface.js';
import { Profile } from '../../../../generated/prisma/client.js';
import { CreateProfileDto } from '../../../features/profiles/dto/create-profile.dto.js';
import { UpdateProfileDTO } from '../../../features/profiles/dto/update-profile.dto.js';

export interface IProfilesRepository extends IBaseRepository<
  Profile,
  CreateProfileDto,
  UpdateProfileDTO
> {
  findByUserId(userId: number): Promise<Profile | null>;
}

export const PROFILES_REPOSITORY = Symbol('PROFILES_REPOSITORY');
