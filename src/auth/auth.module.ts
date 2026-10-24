import { ConfigService } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { User } from "../users/entities/user.entity";
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

@Module({
    imports: [PassportModule,
      TypeOrmModule.forFeature([User]),
      JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({
      secret: c.getOrThrow('JWT_SECRET'),
      signOptions: { expiresIn: '15m' },
      }),
      }),
    ],
    providers: [AuthService, JwtStrategy  ],
    controllers: [AuthController]
  }
)
export class AuthModule {}