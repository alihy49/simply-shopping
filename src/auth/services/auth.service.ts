import { ForbiddenException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';

import { User } from 'src/user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { UserEmailVerification } from '../entities/user-email-verification.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEmailVerification)
    private readonly userEmailVerificationRepository: Repository<UserEmailVerification>,
    private readonly userService: UserService,
  ) {}

  async registerWithEmail(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (user) throw new ForbiddenException('User exist');
    else {
      const user = await this.userService.createUser(email);
      await this.createUserEmailVerification(user, email);
    }
  }

  // async emailVerify(uid: string, pinCode: string): Promise<User> {}

  async createUserEmailVerification(
    user: User,
    email: string,
  ): Promise<UserEmailVerification> {
    const uid = crypto.randomBytes(16).toString('hex');
    const pinCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresIn = new Date(Date.now() + 10 * 60 * 1000);

    console.log('============>', email);

    // TODO: send pinCode to email

    const userEmailVerification = this.userEmailVerificationRepository.create({
      user,
      uid,
      pinCode,
      expiresIn,
    });

    return this.userEmailVerificationRepository.save(userEmailVerification);
  }

  // async verifyPinCode(email: string, pinCode: string): Promise<boolean> {
  //   const verification = await this.verificationRepository
  //     .createQueryBuilder('verification')
  //     .leftJoin('verification.user', 'user')
  //     .where('user.email = :email', { email })
  //     .andWhere('verification.pinCode = :pinCode', { pinCode })
  //     .getOne();

  //   if (!verification || verification.expiresIn < new Date()) {
  //     return false; // Verification expired or invalid code
  //   }

  //   // Mark verification as used
  //   verification.isUsed = true;
  //   await this.verificationRepository.save(verification);

  //   return true;
  // }
}
