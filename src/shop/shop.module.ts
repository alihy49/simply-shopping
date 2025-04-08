import { Module } from '@nestjs/common';
import { FactorController } from './controllers/factor.controller';

@Module({
  controllers: [FactorController],
  providers: [],
})
export class ShopModule {}
