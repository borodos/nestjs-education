import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Avatar, User } from '../../../generated/prisma/client.js';
import { QueryPaginateDto } from '../../common/dto/query-paginate.dto.js';
import { UserWhereInput } from '../../../generated/prisma/models/User.js';
import {
  ActiveUserRaw,
  type IUsersRepository,
  USERS_REPOSITORY,
} from '../../common/repositories/users/users.repository.interface.js';
import { PaginateService } from '../../common/services/paginate.service.js';
import { GetActiveUsersParamsDto } from './dto/get-active-users-params.dto.js';
import { CacheService } from '../../providers/cache/cache.service.js';
import { CustomLoggerService } from '../../providers/logger/logger.service.js';

export type ActiveUser = Omit<ActiveUserRaw, 'profile'> & {
  profile:
    | (Omit<NonNullable<ActiveUserRaw['profile']>, 'avatars'> & {
        avatar: Avatar | null;
      })
    | null;
};

@Injectable()
export class UserService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
    private readonly paginateService: PaginateService,
    private readonly cacheService: CacheService,
    private readonly logger: CustomLoggerService,
  ) {
    logger.setContext(UserService.name);
  }

  private key(params: Record<string, any>): string {
    const norm = Object.keys(params)
      .sort()
      .map((k) => `${k}=${params[k] ?? ''}`)
      .join('&');
    return `users:${norm}`;
  }

  async findAll(params: QueryPaginateDto) {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;

    let where: UserWhereInput = {
      deleted_at: null,
    };

    if (search) {
      where = {
        ...where,
        OR: [{ login: { contains: search, mode: 'insensitive' } }],
      };
    }

    const cacheKey = this.key({ ...params });
    let cacheData = await this.cacheService.get(cacheKey);

    if (!cacheData) {
      const { items, total } = await this.usersRepository.paginate({
        where,
        skip,
        take: limit,
        orderBy: { id: 'desc' },
        select: {
          id: true,
          login: true,
          profile: true,
          created_at: true,
          updated_at: true,
        },
      });

      cacheData = this.paginateService.formatPaginate(params, items, total);

      await this.cacheService.set(cacheKey, cacheData);
      this.logger.log('Данные добавлены в кэш.');
    }

    return cacheData;
  }

  async findById(id: number): Promise<unknown> {
    const cacheKey = `user:${id}`;
    let cacheData = await this.cacheService.get(cacheKey);

    if (!cacheData) {
      cacheData = await this.usersRepository.findById(id);

      if (!cacheData) throw new NotFoundException('Пользователь не найден!');

      await this.cacheService.set(cacheKey, cacheData);
      this.logger.log('Данные загружены в кэш.');
    }

    return cacheData;
  }

  async remove(id: number, authUser: Express.User | undefined): Promise<User> {
    if (authUser?.id !== id) {
      throw new BadRequestException('Можно удалить только свой аккаунт!');
    }

    return this.usersRepository.softDelete(id);
  }

  async getActiveUsers(data: GetActiveUsersParamsDto): Promise<ActiveUser[]> {
    const users = await this.usersRepository.getActive(
      data.minAge,
      data.maxAge,
    );

    return users.map(({ profile, ...user }) => {
      if (!profile) return { ...user, profile: null };

      const { avatars, ...profileRest } = profile;

      return {
        ...user,
        profile: { ...profileRest, avatar: avatars[0] ?? null },
      };
    });
  }
}
