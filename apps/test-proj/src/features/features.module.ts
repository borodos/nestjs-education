import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { AuthModule } from '../auth/auth.module';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { ProfilesModule } from './profiles/profiles.module';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { AvatarsModule } from './avatars/avatars.module';
import { BalanceModule } from './balance/balance.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ProfilesModule,
    RouterModule.register([
      {
        path: 'api',
        module: UserModule,
      },
      {
        path: 'api',
        module: ProfilesModule,
      },
      {
        path: 'api',
        module: AvatarsModule,
      },
      {
        path: 'api',
        module: BalanceModule,
      },
    ]),
    BalanceModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class FeaturesModule {}
