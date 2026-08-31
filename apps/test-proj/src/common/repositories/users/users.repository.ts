import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ActiveUserRaw,
  IUsersRepository,
  ResultUsersPaginate,
  UsersForBalanceOperation,
  UsersPaginate,
} from './users.repository.interface';
import { PrismaService } from '../../../providers/databases/prisma/prisma.service';
import { User } from '../../../../../../generated/prisma/client';
import { CreateUserDto } from '../../../features/users/dto/create-user.dto';
import { UpdateUserDto } from '../../../features/users/dto/update-user.dto';

@Injectable()
export class UsersRepository implements IUsersRepository {
  private COUNT_AVATARS_OF_ACTIVE_USERS = 2;

  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: number): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: { id, deleted_at: null },
    });
  }

  async findByLogin(login: string): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: { login, deleted_at: null },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prismaService.user.findMany({
      where: { deleted_at: null },
    });
  }

  async paginate(params: UsersPaginate): Promise<ResultUsersPaginate> {
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.user.findMany(params),
      this.prismaService.user.count({ where: params.where }),
    ]);

    return { items, total };
  }

  async create(dto: CreateUserDto): Promise<User> {
    return this.prismaService.user.create({
      data: {
        login: dto.login,
        password: dto.password,
        profile: {
          create: dto.profile,
        },
      },
    });
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    return this.prismaService.user.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: number): Promise<User> {
    return this.prismaService.user.delete({
      where: { id },
    });
  }

  async softDelete(id: number): Promise<User> {
    return this.prismaService.user.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        profile: {
          update: {
            data: {
              deleted_at: new Date(),
            },
          },
        },
      },
    });
  }

  async getActive(minAge: number, maxAge: number): Promise<ActiveUserRaw[]> {
    const groups = await this.prismaService.avatar.groupBy({
      by: ['profileId'],
      where: { deletedAt: null },
      having: {
        id: { _count: { equals: this.COUNT_AVATARS_OF_ACTIVE_USERS } },
      },
    });

    const profileIds = groups.map((g) => g.profileId);
    if (profileIds.length === 0) return [];

    return this.prismaService.user.findMany({
      where: {
        deleted_at: null,
        profile: {
          deleted_at: null,
          description: { not: '' },
          age: { gte: minAge, lte: maxAge },
          id: { in: profileIds },
        },
      },
      include: {
        profile: {
          include: {
            avatars: {
              where: { deletedAt: null },
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    });
  }

  async findUsersForBalanceOperation(
    toUserId: number,
    currentUserId: number,
  ): Promise<UsersForBalanceOperation> {
    if (toUserId === currentUserId) {
      throw new BadRequestException('Нельзя выполнить операцию с самим собой');
    }

    const users = await this.prismaService.user.findMany({
      where: {
        deleted_at: null,
        id: { in: [toUserId, currentUserId] },
      },
    });

    const toUser = users.find((user) => user.id === toUserId);
    const currentUser = users.find((user) => user.id === currentUserId);

    if (!toUser || !currentUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    return { toUser, currentUser };
  }

  async transferFunds(
    currentUserId: number,
    currentUserBalance: number,
    toUserId: number,
    toUserBalance: number,
  ): Promise<User[]> {
    return await this.prismaService.$transaction([
      this.prismaService.user.update({
        where: { id: currentUserId },
        data: { balance: currentUserBalance },
      }),
      this.prismaService.user.update({
        where: { id: toUserId },
        data: { balance: toUserBalance },
      }),
    ]);
  }
}
