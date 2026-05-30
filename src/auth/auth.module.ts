import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { UserModule } from '../features/users/user.module.js';
import { AuthService } from './auth.service.js';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy.js';
import { USERS_REPOSITORY } from '../common/repositories/users/users.repository.interface.js';
import { UsersRepository } from '../common/repositories/users/users.repository.js';
import { PROFILES_REPOSITORY } from '../common/repositories/profiles/profiles.repository.interface.js';
import { ProfilesRepository } from '../common/repositories/profiles/profiles.repository.js';
import { TokenService } from './token.service.js';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy.js';

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    TokenService,
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    {
      provide: USERS_REPOSITORY,
      useClass: UsersRepository,
    },
    {
      provide: PROFILES_REPOSITORY,
      useClass: ProfilesRepository,
    },
  ],
})
export class AuthModule {}
