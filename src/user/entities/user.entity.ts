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

  @Column({ type: 'varchar', length: 225, nullable: false, unique: true })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  @IsOptional()
  @IsBoolean()
  isVerified: boolean;

  @Column({ type: 'varchar', length: 225, nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsString()
  @IsOptional()
  firstName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsString()
  @IsOptional()
  lastName: string;

  @Column({
    type: 'enum',
    nullable: true,
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;

  @Column({ type: 'varchar', length: 16, nullable: true })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @OneToMany(() => Factor, (factor) => factor.user)
  factors: Factor[];
}
