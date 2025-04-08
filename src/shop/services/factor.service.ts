import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factor } from '../entities/factor.entity';
import { User } from '../../user/entities/user.entity';
import { CreateFactorDto } from '../dto/create-factor.dto';

@Injectable()
export class FactorService {
  constructor(
    @InjectRepository(Factor)
    private readonly factorRepository: Repository<Factor>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createFactorDto: CreateFactorDto): Promise<Factor> {
    const { userId, total, date } = createFactorDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const factor = this.factorRepository.create({ user, total, date });
    return await this.factorRepository.save(factor);
  }
}
