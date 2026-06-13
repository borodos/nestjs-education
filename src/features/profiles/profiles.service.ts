import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  type IProfilesRepository,
  PROFILES_REPOSITORY,
} from '../../common/repositories/profiles/profiles.repository.interface.js';
import { UpdateProfileDTO } from './dto/update-profile.dto.js';
import { Profile } from '../../../generated/prisma/client.js';

@Injectable()
export class ProfilesService {
  constructor(
    @Inject(PROFILES_REPOSITORY)
    private readonly profilesRepository: IProfilesRepository,
  ) {}

  async getMe(authUser: Express.User | undefined): Promise<Profile | null> {
    if (!authUser) {
      throw new UnauthorizedException('Доступ запрещен!');
    }

    return await this.profilesRepository.findByUserId(authUser.id);
  }

  async update(
    id: number,
    data: UpdateProfileDTO,
    authUser: Express.User | undefined,
  ): Promise<Profile | null> {
    const profile = await this.profilesRepository.findById(id);
    if (!profile) throw new NotFoundException('Профиль не найден!');

    if (authUser?.id !== profile.user_id) {
      throw new BadRequestException('Можно изменить только свой профиль!');
    }

    return await this.profilesRepository.update(id, data);
  }
}
