import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity'; // Assuming you already have User entity

@Entity()
export class Factor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column({ type: 'decimal' })
  total: number;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @ManyToOne(() => User, (user) => user.factors, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
