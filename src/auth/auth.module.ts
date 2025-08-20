
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, UsersService, PrismaService, AuthGuard],
  controllers: [AuthController]
})
export class AuthModule {}
