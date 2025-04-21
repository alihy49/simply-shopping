import { IsEmail } from 'class-validator';

export class RegisterWithEmailDto {
  @IsEmail()
  email: string;
}
