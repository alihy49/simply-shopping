import { IsEmail } from 'class-validator';

export class EmailRegisterDto {
  @IsEmail()
  email: string;
}
