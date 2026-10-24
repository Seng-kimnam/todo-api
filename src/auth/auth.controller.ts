import {
  Controller,
  Get,
  Post,
  HttpCode,
  Req,
  Res,
  UnauthorizedException,
  Body,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import type { Request, Response } from 'express';
import { SignupDto } from './dto/create-auth.dto';
import * as argon2 from 'argon2';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.authService.findOneByOrFail({ id: user.id });
  }

  // auth.controller.ts
  @Public() 
  @HttpCode(200)
  @Post('login')
    async login(@Body() dto : SignupDto,  @Res({ passthrough: true }) res: Response) {
    const u = await this.authService.validate(dto.email,dto.password);
    return this.authService.issueTokens(u, res);
  }
  @Public()
  @HttpCode(200)
  @Post('register')
  async signup(@Body() dto: SignupDto) {
    const email = dto.email.trim().toLowerCase();
    if (await this.authService.existsBy({ email }))
    throw new ConflictException('Email taken');
    const hash = await argon2.hash(dto.password);
    const user = await this.authService.save(
    { email, passwordHash: hash });
    return { id: user.id, email: user.email };
  }
  @Public()
  @HttpCode(200)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.refresh_token;
    if (!token) {
      throw new UnauthorizedException('Refresh token cookie is missing');
    }

    const user = await this.authService.useRefresh(token);
    return this.authService.issueTokens(user, res);
  }

  @HttpCode(204)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
  }
}
