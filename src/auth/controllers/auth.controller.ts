import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { EmailRegisterDto } from '../dto/email-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-email')
  registerWithEmailRouter(@Body() { email }: EmailRegisterDto) {
    return this.authService.registerWithEmail(email);
  }
}
