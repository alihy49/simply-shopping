import { IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  emailVerificationId: string;

  @IsString()
  pinCode: string;
}
