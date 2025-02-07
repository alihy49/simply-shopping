import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(
    @Body('name') name: string,
    @Body('price') price: number,
    @Body('description') description: string,
  ): Promise<Product> {
    return this.productService.createProduct(name, price, description);
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }
}
