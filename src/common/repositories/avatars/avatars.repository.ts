import { CreateAvatarDto } from 'src/features/avatars/dto/create-avatar.dto.js';
import { UpdateAvatarDto } from 'src/features/avatars/dto/update-avatar.dto.js';
import { IAvatarsRepository } from './avatars.repository.interface.js';
import { Injectable } from '@nestjs/common';
import { Avatar } from '../../../../generated/prisma/client.js';
import { PrismaService } from '../../../providers/databases/prisma/prisma.service.js';

@Injectable()
export class AvatarRepository implements IAvatarsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByProfileId(profileId: number): Promise<Avatar[]> {
    return this.prismaService.avatar.findMany({
      where: { profileId: profileId, deletedAt: null },
    });
  }

  async findById(id: number): Promise<Avatar | null> {
    return this.prismaService.avatar.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async findAll(): Promise<Avatar[]> {
    return this.prismaService.avatar.findMany({
      where: { deletedAt: null },
    });
  }

  async create(data: CreateAvatarDto): Promise<Avatar> {
    return this.prismaService.avatar.create({
      data,
    });
  }

  async update(id: number, data: UpdateAvatarDto): Promise<Avatar> {
    return this.prismaService.avatar.update({
      where: { id },
      data,
    });
  }

  delete(): Promise<Avatar> {
    throw new Error('Method not implemented.');
  }

  async softDelete(id: number): Promise<Avatar> {
    return this.prismaService.avatar.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
