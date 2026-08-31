import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { HashPasswordPipe } from '../common/pipes/hash-password.pipe';
import { RegisterUserDto } from './dto/register-user.dto';
import { RefreshTokenCookieInterceptor } from '../common/interceptors/refresh-token-cookie.interceptor';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { AuthUser } from '../common/decorators/authuser.decorator';
import {
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthTokensResponseDto } from './dto/auth-tokens-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiCreatedResponse({
    description:
      'Access-токен создан и лежит в теле, refresh — в httpOnly-куке.',
    type: AuthTokensResponseDto,
    headers: {
      'Set-Cookie': {
        description: 'httpOnly-кука с refresh-токеном',
        schema: {
          type: 'string',
          example:
            'refresh_token=eyJhbGci...; HttpOnly; Path=/auth; SameSite=Strict',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Неверные данные',
    example: 'Неверный логин или пароль!',
  })
  @UseInterceptors(RefreshTokenCookieInterceptor)
  @Post('login')
  login(@Body() loginDTO: LoginUserDto) {
    return this.authService.login(loginDTO);
  }

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiCreatedResponse({
    description:
      'Пользователь создан. Access-токен в теле, refresh — в httpOnly-куке.',
    type: AuthTokensResponseDto,
    headers: {
      'Set-Cookie': {
        description: 'httpOnly-кука с refresh-токеном',
        schema: {
          type: 'string',
          example:
            'refresh_token=eyJhbGci...; HttpOnly; Path=/auth; SameSite=Strict',
        },
      },
    },
  })
  @ApiConflictResponse({
    description: 'Логин уже занят',
    example: 'Пользователь с таким логином уже существует!',
  })
  @UseInterceptors(RefreshTokenCookieInterceptor)
  @Post('register')
  register(
    @Body() registerUserDTO: RegisterUserDto,
    @Body('password', HashPasswordPipe) password: string,
  ) {
    return this.authService.register({
      ...registerUserDTO,
      password,
    });
  }

  @ApiOperation({ summary: 'Обновление пары access-token и refresh-token' })
  @ApiCreatedResponse({
    description:
      'Access-токен создан и лежит в теле, refresh — в httpOnly-куке.',
    type: AuthTokensResponseDto,
    headers: {
      'Set-Cookie': {
        description: 'httpOnly-кука с refresh-токеном',
        schema: {
          type: 'string',
          example:
            'refresh_token=eyJhbGci...; HttpOnly; Path=/auth; SameSite=Strict',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствует или истек срок действия refresh-токена',
  })
  @ApiCookieAuth('refresh_token')
  @UseInterceptors(RefreshTokenCookieInterceptor)
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(
    @AuthUser() user: { id: number; login: string; refresh_token: string },
  ) {
    return this.authService.refresh(user);
  }
}
