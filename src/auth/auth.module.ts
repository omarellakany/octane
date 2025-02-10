import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { LoginHandler } from './handlers/login.handler';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [UserModule],
  providers: [JwtStrategy, JwtService, LoginHandler],
  controllers: [AuthController],
})
export class AuthModule {}
