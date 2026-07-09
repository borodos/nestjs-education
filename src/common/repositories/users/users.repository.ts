import { Injectable } from '@nestjs/common';
import {
  ActiveUserRaw,
  IUsersRepository,
  ResultUsersPaginate,
  UsersPaginate,
} from './users.repository.interface.js';
import { PrismaService } from '../../../providers/databases/prisma/prisma.service.js';
import { User } from '../../../../generated/prisma/client.js';
import { CreateUserDto } from '../../../features/users/dto/create-user.dto.js';
import { UpdateUserDto } from '../../../features/users/dto/update-user.dto.js';

@Injectable()
export class UsersRepository implements IUsersRepository {
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
        id: { _count: { equals: 2 } },
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
}
