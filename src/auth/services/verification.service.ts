import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

import { UserEmailVerification } from '../entities/user-email-verification.entity';
import { User } from 'src/user/entities/user.entity';
import { Exception } from 'src/common/exception';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(UserEmailVerification)
    private readonly userEmailVerificationRepository: Repository<UserEmailVerification>,
  ) {}

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

  async createUserEmailVerification(
    user: User,
  ): Promise<UserEmailVerification> {
    const uid = crypto.randomBytes(16).toString('hex');
    const pinCode = Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date();
    const expiresIn = new Date(now.getTime() + 10 * 60 * 1000);
    const nextRequestTime = new Date(now.getTime() + 2 * 60 * 1000);

    const userEmailVerification = this.userEmailVerificationRepository.create({
      user,
      uid,
      pinCode,
      expiresIn,
      nextRequestTime,
    });

    return this.userEmailVerificationRepository.save(userEmailVerification);
  }

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

  async verifyUserEmailVerification(
    emailVerificationUid: string,
    pinCode: string,
  ) {
    const verification = await this.userEmailVerificationRepository.findOne({
      where: { uid: emailVerificationUid },
      relations: ['user'],
    });

    if (
      !verification ||
      verification.isUsed ||
      verification.pinCode !== pinCode
    ) {
      throw Exception.BadRequest('Invalid evId or pinCode');
    }

    if (verification.expiresIn < new Date()) {
      throw Exception.BadRequest('Verification code has expired');
    }

    verification.isUsed = true;
    await this.userEmailVerificationRepository.save(verification);

    return verification.user;
  }
}
