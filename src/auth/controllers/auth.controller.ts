import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterWithEmailDto } from '../dto/register-with-email.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-email')
  async registerWithEmailRouter(@Body() { email }: RegisterWithEmailDto) {
    const emailVerificationUid =
      await this.authService.registerWithEmail(email);
    return { emailVerificationId: emailVerificationUid };
  }

  @Post('verify-email')
  async verifyEmail(@Body() { emailVerificationId, pinCode }: VerifyEmailDto) {
    return this.authService.verifyWithEmail(emailVerificationId, pinCode);
  }
}
