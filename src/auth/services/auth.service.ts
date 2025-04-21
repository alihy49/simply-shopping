import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';

import { User } from 'src/user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { UserEmailVerification } from '../entities/user-email-verification.entity';
import { Exception } from 'src/common/exception';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEmailVerification)
    private readonly userEmailVerificationRepository: Repository<UserEmailVerification>,
    private readonly userService: UserService,
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
    const activeVerification = await this.userEmailVerificationRepository
      .createQueryBuilder('verification')
      .leftJoinAndSelect('verification.user', 'user')
      .where('user.id = :userId', { userId: user.id })
      .andWhere('verification.nextRequestTime > :now', { now: new Date() })
      .andWhere('verification.isUsed = :isUsed', { isUsed: false })
      .getOne();

    if (activeVerification) {
      const now = new Date();
      const diffBetweenTimes =
        activeVerification.nextRequestTime.getTime() - now.getTime();

      const totalSeconds = Math.floor(diffBetweenTimes / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      // Format to MM:SS
      const formattedDiffTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      throw Exception.TooManyRequests(
        `Please wait ${formattedDiffTime} before requesting again`,
      );
    }

    const userEmailVerification = await this.createUserEmailVerification(user);

    // TODO: sendEmail(email, pinCode)
    console.log('============>', email);

    return userEmailVerification.uid;
  }

  async createUserEmailVerification(
    user: User,
  ): Promise<UserEmailVerification> {
    const uid = crypto.randomBytes(16).toString('hex');
    const pinCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresIn = new Date(Date.now() + 10 * 60 * 1000);

    const userEmailVerification = this.userEmailVerificationRepository.create({
      user,
      uid,
      pinCode,
      expiresIn,
    });

    return this.userEmailVerificationRepository.save(userEmailVerification);
  }
}
