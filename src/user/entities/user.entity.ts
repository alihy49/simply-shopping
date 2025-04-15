import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsEnum,
  IsString,
  IsOptional,
} from 'class-validator';

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
