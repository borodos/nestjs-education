import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../features/users/user.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { USERS_REPOSITORY } from '../common/repositories/users/users.repository.interface';
import { UsersRepository } from '../common/repositories/users/users.repository';
import { PROFILES_REPOSITORY } from '../common/repositories/profiles/profiles.repository.interface';
import { ProfilesRepository } from '../common/repositories/profiles/profiles.repository';
import { TokenService } from './token.service';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';

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
