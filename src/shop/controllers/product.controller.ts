import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(
    @Body() { name, price, description }: CreateProductDto,
  ): Promise<Product> {
    return this.productService.createProduct(name, price, description);
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }
}
