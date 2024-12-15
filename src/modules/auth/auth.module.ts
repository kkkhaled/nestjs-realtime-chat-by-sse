import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./Jwt-strategy.service";
import { PrismaService } from "src/prisma.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService,JwtStrategy,PrismaService],
    exports: [JwtStrategy],})
export class AuthModule {}