import { IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  evId: string;

  @IsString()
  pinCode: string;
}
