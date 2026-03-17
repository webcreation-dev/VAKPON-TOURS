import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userData: Partial<User>) {
    return this.authService.register(userData);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginData: { email: string; password: string }) {
    return this.authService.login(loginData.email, loginData.password);
  }
}
