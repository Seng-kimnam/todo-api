import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
constructor(
    cfg: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
) {
    super({
    jwtFromRequest:
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: cfg.getOrThrow('JWT_SECRET'),
    });
}
    async validate(p: { sub: string; tokenVersion: number }) {
    const user = await this.userRepository.findOneBy({ id: p.sub });
    if (!user || user.refreshTokenVersion !== p.tokenVersion) {
        throw new UnauthorizedException('Token has been revoked');
    }

    return { id: p.sub }; // req.user
    }
}