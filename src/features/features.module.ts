import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { ProfilesModule } from './profiles/profiles.module.js';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor.js';

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
    ]),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class FeaturesModule {}
