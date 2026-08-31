import { IBaseRepository } from '../base.repository.interface';
import { CreateAvatarDto } from '../../../features/avatars/dto/create-avatar.dto';
import { UpdateAvatarDto } from '../../../features/avatars/dto/update-avatar.dto';
import { Avatar } from '../../../../../../generated/prisma/client';

export interface IAvatarsRepository extends IBaseRepository<
  Avatar,
  CreateAvatarDto,
  UpdateAvatarDto
> {
  softDelete(id: number): Promise<Avatar>;
  findByProfileId(profileId: number): Promise<Avatar[]>;
}

export const AVATARS_REPOSITORY = Symbol('AVATARS_REPOSITORY');
