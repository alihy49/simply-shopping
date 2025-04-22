import { Injectable } from '@nestjs/common';

import { User } from 'src/user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { Exception } from 'src/common/exception';
import { VerificationService } from './verification.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly verificationService: VerificationService,
  ) {}

  async registerWithEmail(email: string): Promise<string> {
    const user = await this.userService.findByEmail(email);

    if (user?.isVerified) {
      throw Exception.Forbidden('User already verified');
    }

    const newUser = user || (await this.userService.create(email));

    return this.sendPinCodeWithEmail(newUser, email);
  }

  async sendPinCodeWithEmail(user: User, email: string): Promise<string> {
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
    console.log(email, '============>', userEmailVerification.pinCode);

    return userEmailVerification.uid;
  }

  async verifyWithEmail(emailVerificationUid: string, pinCode: string) {
    const user = await this.verificationService.verifyUserEmailVerification(
      emailVerificationUid,
      pinCode,
    );

    if (!user) {
      // TODO: send an alert to admin operator

      // examples:
      // this.logger.error(`Verification failed: User not found for evId: ${evId}`);
      // await this.alertService.notifyAdmin(`Critical: No user found for evId: ${evId}`);

      throw Exception.BadRequest('Invalid verification details');
    }

    await this.userService.verify(user.id);

    return { message: 'Verified successfully' };
  }
}
