import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { EmailRegisterDto } from '../dto/email-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('email-register')
  async emailRegister(@Body() { email }: EmailRegisterDto) {
    return this.authService.emailRegister(email);
  }
}
