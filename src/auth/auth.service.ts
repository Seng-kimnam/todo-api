import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
@Injectable()
export class AuthService {
  private readonly refreshSecret: string;

  constructor(private readonly jwt: JwtService ,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {
    const refreshSecret =
      process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET;

    if (!refreshSecret) {
      throw new Error(
        'JWT_REFRESH_SECRET or JWT_SECRET must be configured to issue refresh tokens',
      );
    }

    this.refreshSecret = refreshSecret;
  }

  async issueTokens(user: User, res: Response) {
    const payload = { sub: user.id, role: user.role };
    const access = await this.jwt.signAsync(payload);
    const refresh = await this.jwt.signAsync(payload, {
      secret: this.refreshSecret,
      expiresIn: '7d',
    });
    res.cookie('refresh_token', refresh, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { accessToken: access, refreshToken: refresh };
  }

    async useRefresh(token: string): Promise<User> {
      try {
        const payload = await this.jwt.verifyAsync<{ sub: string }>(token, {
          secret: this.refreshSecret,
        });

        return await this.findOneByOrFail({ id: payload.sub });
      } catch {
        throw new UnauthorizedException('Invalid refresh token');
      }
    }

    findOneByOrFail(where: FindOptionsWhere<User>) {
      return this.userRepository.findOneByOrFail(where);
    }
  async validate(email: string, pw: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email: email.toLowerCase() })
      .getOne();

    if (!user?.passwordHash || !(await argon2.verify(user.passwordHash, pw))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
  async existsBy(where: FindOptionsWhere<User>) {
    return this.userRepository.existsBy({ ...where });
  }
  async save(user: Partial<User>) {
    return this.userRepository.save(user);
  }
}
