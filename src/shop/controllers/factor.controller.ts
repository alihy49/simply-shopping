import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FactorService } from '../services/factor.service';
import { CreateFactorDto } from '../dto/create-factor.dto';
import { Factor } from '../entities/factor.entity';

@Controller('factors')
export class FactorController {
  constructor(private readonly factorService: FactorService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() createFactorDto: CreateFactorDto): Promise<Factor> {
    return this.factorService.create(createFactorDto);
  }
}
