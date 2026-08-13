import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

type JwtPayload = { sub: number; login: string };
type RefreshCookies = { refresh_token?: string };

const extractRefreshToken = (req: Request): string | null =>
  (req.cookies as RefreshCookies | undefined)?.refresh_token ?? null;

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractRefreshToken]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('jwtRefreshSecret'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    return {
      id: payload.sub,
      login: payload.login,
      refresh_token: extractRefreshToken(req) ?? undefined,
    };
  }
}
