import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AvatarsQueueProducer } from '../../providers/queues/producers/avatars-queue.producer.js';
import { uuidv7 } from 'uuidv7';
import { CustomLoggerService } from '../../providers/logger/logger.service.js';
import folders from '../../providers/files/s3/constants/folders.js';
import { IFileService } from '../../providers/files/files.adapter.js';
import { UploadFilePayloadDto } from '../../providers/files/s3/dto/upload-file-payload.dto.js';
import {
  type IProfilesRepository,
  PROFILES_REPOSITORY,
} from '../../common/repositories/profiles/profiles.repository.interface.js';
import { ConfigService } from '@nestjs/config';
import getAvatarPath from '../../common/utils/get-avatar-path.js';
import { Avatar, Profile } from '../../../generated/prisma/client.js';
import {
  AVATARS_REPOSITORY,
  type IAvatarsRepository,
} from '../../common/repositories/avatars/avatars.repository.interface.js';

@Injectable()
export class AvatarsService {
  private DEFAULT_COUNT_AVATARS = 5;

  constructor(
    private readonly avatarsQueueProducer: AvatarsQueueProducer,
    private readonly logger: CustomLoggerService,
    private readonly fileService: IFileService,
    private readonly configService: ConfigService,

    @Inject(AVATARS_REPOSITORY)
    private readonly avatarsRepository: IAvatarsRepository,

    @Inject(PROFILES_REPOSITORY)
    private readonly profilesRepository: IProfilesRepository,
  ) {
    logger.setContext(AvatarsService.name);
  }

  async addAvatarToProfile(
    authUser: Express.User | undefined,
    file: Express.Multer.File,
  ): Promise<object> {
    if (!authUser) {
      this.logger.error('Неавторизованный запрос!');
      throw new UnauthorizedException('Доступ запрещен!');
    }

    const profile: Profile | null = await this.profilesRepository.findByUserId(
      authUser.id,
    );

    if (!profile) {
      this.logger.error('Профиль пользователя не найден!');
      throw new NotFoundException('Профиль пользователя не найден!');
    }

    const avatars: Avatar[] = await this.avatarsRepository.findByProfileId(
      profile.id,
    );

    if (avatars.length >= this.DEFAULT_COUNT_AVATARS) {
      this.logger.error(
        `Профиль ID:${profile.id} имеет максимальное кол-во аватарок!`,
      );
      throw new ForbiddenException(
        `Профиль ID:${profile.id} имеет максимальное кол-во аватарок!`,
      );
    }

    const fileData: UploadFilePayloadDto = {
      name: `${authUser?.login}__avatar_${uuidv7()}`,
      file: file,
      folder: folders.avatars,
    };

    await this.fileService.uploadFile(fileData);

    await this.avatarsQueueProducer.addAvatarToProfile({
      profileId: profile.id,
      fileName: `${fileData.name}`,
      size: file.size,
    });

    return {
      path: getAvatarPath(
        this.configService.getOrThrow('minioStorageUrl'),
        fileData.name,
      ),
    };
  }

  async deleteAvatar(id: number): Promise<Avatar> {
    const avatar = await this.avatarsRepository.findById(id);

    if (!avatar) {
      this.logger.error('Аватар не найден!');
      throw new NotFoundException('Аватар не найден!');
    }

    await this.fileService.removeFile({
      path: `${folders.avatars}/${avatar.fileName}`,
    });

    return this.avatarsRepository.softDelete(id);
  }
}
