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
    const activeVerification = await this.getActiveUserEmailVerification(user);

    if (activeVerification) {
      const formattedDiffTime = this.calculateTimeDifference(
        activeVerification.nextRequestTime,
      );

      throw Exception.TooManyRequests(
        `Please wait ${formattedDiffTime} before requesting again`,
      );
    }

    const userEmailVerification = await this.createUserEmailVerification(user);

    // TODO: Implement actual email sending logic (use a mail service)
    console.log('============>', email);

    return userEmailVerification.uid;
  }

  // Get the active email verification for a user
  async getActiveUserEmailVerification(
    user: User,
  ): Promise<UserEmailVerification | undefined> {
    return this.userEmailVerificationRepository
      .createQueryBuilder('verification')
      .leftJoinAndSelect('verification.user', 'user')
      .where('user.id = :userId', { userId: user.id })
      .andWhere('verification.nextRequestTime > :now', { now: new Date() })
      .andWhere('verification.isUsed = :isUsed', { isUsed: false })
      .getOne();
  }

  // Calculate the time difference in MM:SS format
  private calculateTimeDifference(nextRequestTime: Date): string {
    const now = new Date();
    const diffBetweenTimes = nextRequestTime.getTime() - now.getTime();

    const totalSeconds = Math.floor(diffBetweenTimes / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  // Create a new user email verification entry
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
