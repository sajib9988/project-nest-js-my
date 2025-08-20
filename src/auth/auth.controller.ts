import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

@Post('login')
async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
  console.log('Login API called with:', loginDto); // Debug line
  
  const result = await this.authService.login(loginDto);
  console.log('Auth service returned:', result); // Debug line
  
  const { accessToken, refreshToken } = result;
  
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  });
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  });
  
  const response = {
    message: 'Login successful',
    accessToken,
    refreshToken
  };
  
  console.log('Controller final response:', response); // Debug line
  return response;
}



@Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['refresh_token'];
    const { accessToken } = await this.authService.refreshToken(token);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    return { message: 'Token refreshed' };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { message: 'Logged out' };
  }


}

