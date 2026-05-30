import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { REFRESH_COOKIE_NAME, refreshCookieOptions } from '../../constants.js';

@Injectable()
export class RefreshTokenCookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data: any) => {
        if (data?.refresh_token) {
          res.cookie(
            REFRESH_COOKIE_NAME,
            data.refresh_token,
            refreshCookieOptions,
          );

          const { refresh_token, ...rest } = data;
          return rest;
        }
        return data;
      }),
    );
  }
}
