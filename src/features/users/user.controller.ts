import {
  Controller,
  Get,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard.js';
import { QueryPaginateDto } from '../../common/dto/query-paginate.dto.js';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponsePaginationUsersDto } from './dto/response-pagination-users.dto.js';
import { ResponseUserDto } from './dto/response-user.dto.js';

@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAccessGuard)
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @ApiOperation({ summary: 'Список пользователей с пагинацией и поиском' })
  @ApiOkResponse({
    description: 'Получение пользователей с пагинацией',
    type: ResponsePaginationUsersDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Неавторизованное действие',
    example: 'Доступ запрещен!',
  })
  @Get()
  findAll(@Query() params: QueryPaginateDto) {
    return this.usersService.findAll(params);
  }

  @ApiOperation({ summary: 'Получение пользователя по id' })
  @ApiOkResponse({
    description: 'Получение пользователя',
    type: ResponseUserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Неавторизованное действие',
    example: 'Доступ запрещен!',
  })
  @ApiNotFoundResponse({
    description: 'Пользователь не найден',
    example: 'Пользователь не найден',
  })
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @ApiOperation({ summary: 'Удаление пользователя по id' })
  @ApiOkResponse({
    description: 'Удаление пользователя',
    type: ResponseUserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Неавторизованное действие',
    example: 'Доступ запрещен!',
  })
  @ApiNotFoundResponse({
    description: 'Пользователь не найден',
    example: 'Пользователь не найден',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
