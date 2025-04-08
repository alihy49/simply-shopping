import { IsNotEmpty, IsNumber, IsDate } from 'class-validator';

export class CreateFactorDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  total: number;

  @IsNotEmpty()
  @IsDate()
  date: Date;
}
