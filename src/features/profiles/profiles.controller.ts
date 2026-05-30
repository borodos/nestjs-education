import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service.js';
import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard.js';
import type { Request } from 'express';
import { UpdateProfileDTO } from './dto/update-profile.dto.js';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponseProfileDto } from './dto/response-profile.dto.js';

@ApiBearerAuth()
@UseGuards(JwtAccessGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @ApiOperation({ summary: 'Получение профиля авторизованного пользователя' })
  @ApiOkResponse({
    description: 'Получение профиля',
    type: ResponseProfileDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Неавторизованное действие',
    example: 'Доступ запрещен!',
  })
  @ApiNotFoundResponse({
    description: 'Профиль не найден',
    example: 'Профиль не найден',
  })
  @Get('me')
  me(@Req() req: Request) {
    return this.profilesService.getMe(req.user);
  }

  @ApiOperation({ summary: 'Обновление профиля по id' })
  @ApiOkResponse({
    description: 'Успешное обновление профиля',
    type: ResponseProfileDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Неавторизованное действие',
    example: 'Доступ запрещен!',
  })
  @ApiNotFoundResponse({
    description: 'Профиль не найден',
    example: 'Профиль не найден',
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileDto: UpdateProfileDTO,
  ) {
    return this.profilesService.update(id, updateProfileDto);
  }
}
