import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Factor } from '../../shop/entities/factor.entity';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 225, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 16, nullable: true, name: 'phone_number' })
  phoneNumber?: string;

  @Column({
    type: 'boolean',
    nullable: true,
    default: false,
    name: 'is_verified',
  })
  isVerified: boolean;

  @Column({ type: 'varchar', length: 225, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'last_name' })
  lastName: string;

  @Column({
    type: 'enum',
    nullable: true,
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @OneToMany(() => Factor, (factor) => factor.user)
  factors: Factor[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
