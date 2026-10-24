import { ConfigService } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { User } from "../users/entities/user.entity";
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
    imports: [PassportModule,
      TypeOrmModule.forFeature([User]),
      JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({
      secret: c.getOrThrow<string>('JWT_SECRET'),
      signOptions: { expiresIn: '20m' },
      }),
      }),
    ],
    providers: [AuthService, JwtStrategy  ],
    controllers: [AuthController],
    exports: [AuthService, JwtStrategy, JwtModule]
  }
)
export class AuthModule {}