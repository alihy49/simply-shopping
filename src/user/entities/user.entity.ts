import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Factor } from '../../shop/entities/factor.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Factor, (factor) => factor.user)
  factors: Factor[];
}
