import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { UserEmailVerification } from '../entities/user-email-verification.entity';
import { Exception } from 'src/common/exception';
import { VerificationService } from './verification.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEmailVerification)
    private readonly userEmailVerificationRepository: Repository<UserEmailVerification>,
    private readonly userService: UserService,
    private readonly verificationService: VerificationService,
  ) {}

  async registerWithEmail(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);

    if (user?.isVerified) {
      throw Exception.Forbidden('User already verified');
    }

    const newUser = user || (await this.userService.createUser(email));

    await this.sendEmail(newUser, email);
  }

  async sendEmail(user: User, email: string): Promise<string> {
    const activeVerification =
      await this.verificationService.getActiveUserEmailVerification(user);

    if (activeVerification) {
      const formattedDiffTime =
        this.verificationService.calculateTimeDifference(
          activeVerification.nextRequestTime,
        );

      throw Exception.TooManyRequests(
        `Please wait ${formattedDiffTime} before requesting again`,
      );
    }

    const userEmailVerification =
      await this.verificationService.createUserEmailVerification(user);

    // TODO: Implement actual email sending logic (use a mail service)
    console.log('============>', email);

    return userEmailVerification.uid;
  }
}
