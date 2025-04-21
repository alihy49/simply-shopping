import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

import { UserEmailVerification } from '../entities/user-email-verification.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(UserEmailVerification)
    private readonly userEmailVerificationRepository: Repository<UserEmailVerification>,
  ) {}

  // Handle email verification creation
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

  // Handle getting active email verification
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

  // Handle time difference for verification (MM:SS)
  calculateTimeDifference(nextRequestTime: Date): string {
    const now = new Date();
    const diffBetweenTimes = nextRequestTime.getTime() - now.getTime();

    if (diffBetweenTimes < 0) {
      return '00:00';
    }

    const totalSeconds = Math.floor(diffBetweenTimes / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  // TODO: Implement SMS verification creation logic here
  async createUserSmsVerification(): Promise<any> {
    // TODO: Implement the logic for creating SMS verification (send SMS, generate code, etc.)
    return Promise.resolve('SMS verification logic will be implemented here');
  }

  // TODO: Implement check for active SMS verification
  async getActiveUserSmsVerification(): Promise<any> {
    // TODO: Implement the logic to check if there is an active SMS verification for the user
    return Promise.resolve(
      'SMS verification status logic will be implemented here',
    );
  }
}
