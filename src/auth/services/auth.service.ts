import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { UserEmailVerificationService } from './user-email-verification.service';
// import { User } from '../../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userEmailVerificationService: UserEmailVerificationService,
  ) {}

  async emailRegister(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);

    if (user) throw new ForbiddenException('User exist');
    else {
      const user = await this.userService.createUser(email);

      await this.userEmailVerificationService.createUserEmailVerification(
        user,
        email,
      );
    }
  }

  // async emailVerify(uid: string, pinCode: string): Promise<User> {}
}
