import { IsString } from 'class-validator';

export class UserEmailVerificationDto {
  @IsString()
  uid: string;

  @IsString()
  pinCode: string;
}
