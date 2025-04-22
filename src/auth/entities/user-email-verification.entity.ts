import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { IsString, IsBoolean, IsDate } from 'class-validator';

@Entity()
export class UserEmailVerification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar', length: 32, unique: true })
  @IsString()
  uid: string;

  @Column({ type: 'varchar', length: 6 })
  @IsString()
  pinCode: string;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  isUsed: boolean;

  @Column({ type: 'timestamp' })
  @IsDate()
  nextRequestTime: Date;

  @Column({ type: 'timestamp' })
  @IsDate()
  expiresIn: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
