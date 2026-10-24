import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC } from "./decorators/public.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
constructor(private r: Reflector) { super(); }
canActivate(ctx: ExecutionContext) {
const isPublic = this.r.getAllAndOverride(
IS_PUBLIC, [ctx.getHandler(), ctx.getClass()]);
return isPublic || super.canActivate(ctx);
}
}