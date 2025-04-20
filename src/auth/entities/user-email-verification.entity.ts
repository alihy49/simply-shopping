import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
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

  @Column({ unique: true })
  @IsString()
  uid: string;

  @Column()
  @IsString()
  pinCode: string;

  @Column({ default: false })
  @IsBoolean()
  isUsed: boolean;

  @Column()
  @IsDate()
  nextRequestTime: Date;

  @Column()
  @IsDate()
  expiresIn: Date;
}
