
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export interface JwtPayload {
  id: number;
  email: string;
  role: 'ADMIN' | 'USER' | 'MODERATOR';
  sub?: any;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['access_token'];

    if (!token) throw new UnauthorizedException('No token');

    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: 'ACCESS_SECRET' }) as JwtPayload;
      // Ensure payload includes id, email, and role
      if (!payload.id || !payload.email || !payload.role) {
        throw new UnauthorizedException('Invalid token payload');
      }
      request['user'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
