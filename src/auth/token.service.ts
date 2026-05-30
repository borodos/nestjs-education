import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../../generated/prisma/client.js';
import * as bcrypt from 'bcrypt';
import {
  type IUsersRepository,
  USERS_REPOSITORY,
} from '../common/repositories/users/users.repository.interface.js';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async generateTokens(user: User) {
    const payload = { sub: user.id, login: user.login };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwtAccessSecret'),
        expiresIn: '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwtRefreshSecret'),
        expiresIn: '2h',
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async updateRefreshTokenHash(userId: number, refreshToken: string) {
    const hash = await bcrypt.hash(
      refreshToken,
      this.configService.getOrThrow('saltOrRounds'),
    );

    await this.usersRepository.update(userId, { refresh_token: hash });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user || !user.refresh_token) {
      throw new UnauthorizedException('Доступ запрещен!');
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refresh_token);
    if (!isMatch) {
      throw new UnauthorizedException('Доступ запрещен!');
    }

    const newTokens = await this.generateTokens(user);
    await this.updateRefreshTokenHash(user.id, newTokens.refresh_token);

    return newTokens;
  }

  async logout(userId: number) {
    await this.usersRepository.update(userId, { refresh_token: null });
  }
}
