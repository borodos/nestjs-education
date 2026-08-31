import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { REFRESH_COOKIE_NAME, refreshCookieOptions } from '../../constants';

type WithRefreshToken = Record<string, unknown> & { refresh_token: string };

const hasRefreshToken = (data: unknown): data is WithRefreshToken =>
  typeof data === 'object' &&
  data !== null &&
  'refresh_token' in data &&
  typeof data.refresh_token === 'string';

@Injectable()
export class RefreshTokenCookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const res = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data: unknown) => {
        if (!hasRefreshToken(data)) return data;

        const { refresh_token, ...rest } = data;
        res.cookie(REFRESH_COOKIE_NAME, refresh_token, refreshCookieOptions);

        return rest;
      }),
    );
  }
}
