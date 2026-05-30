import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto.js';
import {
  type IUsersRepository,
  USERS_REPOSITORY,
} from '../common/repositories/users/users.repository.interface.js';
import { TokenService } from './token.service.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import * as bcrypt from 'bcrypt';
import { AuthTokensResponseDto } from './dto/auth-tokens-response.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,

    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}

  private async validateUser(login: string, password: string) {
    const user = await this.usersRepository.findByLogin(login);
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.hash(password, user.password);
    if (!isMatch) {
      return null;
    }

    return user;
  }

  async login(data: LoginUserDto): Promise<AuthTokensResponseDto> {
    const user = await this.validateUser(data.login, data.password);
    if (!user) {
      throw new UnauthorizedException('Неверный логин или пароль!');
    }

    const tokens = await this.tokenService.generateTokens(user);
    await this.tokenService.updateRefreshTokenHash(
      user.id,
      tokens.refresh_token,
    );

    return tokens;
  }

  async register(data: RegisterUserDto): Promise<AuthTokensResponseDto> {
    const existsUser = await this.usersRepository.findByLogin(data.login);

    if (existsUser) {
      throw new ConflictException(
        'Пользователь с таким логином уже существует!',
      );
    }

    const user = await this.usersRepository.create({
      login: data.login,
      password: data.password,
      profile: data.profile,
    });

    const tokens = await this.tokenService.generateTokens(user);
    await this.tokenService.updateRefreshTokenHash(
      user.id,
      tokens.refresh_token,
    );

    return tokens;
  }

  async refresh(user: {
    id: number;
    login: string;
    refresh_token: string;
  }): Promise<AuthTokensResponseDto> {
    return await this.tokenService.refreshTokens(user.id, user.refresh_token);
  }
}
