import { Module } from '@nestjs/common';
import { FactorController } from './controllers/factor.controller';
import { FactorService } from './services/factor.service';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Factor } from './entities/factor.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Factor])],
  providers: [ProductService, FactorService],
  controllers: [ProductController, FactorController],
  exports: [ProductService, FactorService],
})
export class ShopModule {}
