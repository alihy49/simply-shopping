import { Module } from '@nestjs/common';
import { FactorController } from './controllers/factor.controller';
import { ServicesService } from './services/services.service';

@Module({
  controllers: [FactorController],
  providers: [ServicesService],
})
export class ShopModule {}
