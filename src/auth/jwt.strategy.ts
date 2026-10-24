import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RoleType } from "../users/entities/user.entity";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
constructor(cfg: ConfigService) {
    super({
    jwtFromRequest:
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: cfg.getOrThrow('JWT_SECRET'),
    });
}
    validate(p: { sub: string; role: RoleType }) {
    return { id: p.sub, role: p.role }; // req.user
    }
}