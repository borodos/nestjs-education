import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from '../../common/pipes/file-size-validation.pipe.js';
import { FileTypeValidationPipe } from '../../common/pipes/file-type-validation.pipe.js';
import type { Request } from 'express';
import { AvatarsService } from './avatars.service.js';
import { MAX_AVATAR_FILE_SIZE } from '../../constants.js';

@UseGuards(JwtAccessGuard)
@Controller('profiles/avatars')
export class AvatarsController {
  constructor(private readonly avatarsService: AvatarsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  addAvatar(
    @Req() req: Request,
    @UploadedFile(
      new FileSizeValidationPipe({ maxSize: MAX_AVATAR_FILE_SIZE }),
      new FileTypeValidationPipe({ types: ['image/png', 'image/jpeg'] }),
    )
    file: Express.Multer.File,
  ) {
    return this.avatarsService.addAvatarToProfile(req.user, file);
  }

  @Delete(':id/delete')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.avatarsService.deleteAvatar(id);
  }
}
