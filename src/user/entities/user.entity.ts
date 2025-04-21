import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsEnum,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Factor } from 'src/shop/entities/factor.entity';

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'string', nullable: false, unique: true })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  @IsOptional()
  @IsBoolean()
  isVerified: boolean;

  @Column({ type: 'string', nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password: string;

  @Column({ type: 'string', nullable: true })
  @IsString()
  @IsOptional()
  fullName: string;

  @Column({
    type: 'enum',
    nullable: true,
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;

  @Column({ type: 'string', nullable: true })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @OneToMany(() => Factor, (factor) => factor.user)
  factors: Factor[];
}
