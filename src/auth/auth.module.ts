import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserEmailVerification } from './entities/user-email-verification.entity';
import { UserModule } from 'src/user/user.module';
import { VerificationService } from './services/verification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEmailVerification]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret',
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, VerificationService],
})
export class AuthModule {}
