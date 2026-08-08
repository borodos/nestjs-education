import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const AuthUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
