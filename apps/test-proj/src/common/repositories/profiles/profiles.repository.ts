import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/databases/prisma/prisma.service';
import { IProfilesRepository } from './profiles.repository.interface';
import { CreateProfileDto } from '../../../features/profiles/dto/create-profile.dto';
import { UpdateProfileDTO } from '../../../features/profiles/dto/update-profile.dto';
import { Profile } from '../../../../../../generated/prisma/client';

@Injectable()
export class ProfilesRepository implements IProfilesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByUserId(userId: number): Promise<Profile | null> {
    return this.prismaService.profile.findUnique({
      where: { user_id: userId, deleted_at: null },
      include: {
        avatars: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  async findById(id: number): Promise<Profile | null> {
    return this.prismaService.profile.findUnique({
      where: { id, deleted_at: null },
      include: { avatars: true },
    });
  }

  async findAll(): Promise<Profile[]> {
    return this.prismaService.profile.findMany({
      where: { deleted_at: null },
      include: { avatars: true },
    });
  }

  async create(dto: CreateProfileDto): Promise<Profile> {
    return this.prismaService.profile.create({
      data: dto,
    });
  }

  async update(id: number, dto: UpdateProfileDTO): Promise<Profile> {
    return this.prismaService.profile.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: number): Promise<Profile> {
    return this.prismaService.profile.delete({
      where: { id },
    });
  }
}
