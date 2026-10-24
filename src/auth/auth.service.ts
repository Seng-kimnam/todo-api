import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  async issueTokens(user: User, res: Response) {
  const payload = { sub: user.id, role: user.role };
  const access = await this.jwt.signAsync(payload);
  const refresh = await this.jwt.signAsync(payload, {
  secret: this.refreshSecret, expiresIn: '7d',
  });
  await this.saveRefresh(user.id, refresh);
  res.cookie('refresh_token', refresh, cookieOpts);
  return { accessToken : access, refreshToken: refresh };
}}
