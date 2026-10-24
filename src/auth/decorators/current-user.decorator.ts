import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type     AuthUser = {
  id: string;
  role: 'user' | 'admin';
};

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthUser =>
    ctx.switchToHttp().getRequest().user,
);
