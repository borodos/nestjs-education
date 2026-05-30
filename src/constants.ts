import { CookieOptions } from 'express';

export const REFRESH_COOKIE_NAME = 'refresh_token';

export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/auth',
};
