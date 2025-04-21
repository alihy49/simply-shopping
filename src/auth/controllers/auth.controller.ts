import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterWithEmailDto } from '../dto/register-with-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-email')
  async registerWithEmailRouter(@Body() { email }: RegisterWithEmailDto) {
    return this.authService.registerWithEmail(email);
  }
}
