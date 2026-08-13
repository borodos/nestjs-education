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
import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from '../../common/pipes/file-size-validation.pipe';
import { FileTypeValidationPipe } from '../../common/pipes/file-type-validation.pipe';
import type { Request } from 'express';
import { AvatarsService } from './avatars.service';
import { MAX_AVATAR_FILE_SIZE } from '../../constants';

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
