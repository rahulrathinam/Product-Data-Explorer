import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('by-category/:categorySlug')
  async listByCategory(
    @Param('categorySlug') categorySlug: string,
    @Query('page') page = '1',
    @Query('limit') limit = '24',
  ) {
    return this.productService.listByCategory(categorySlug, Number(page), Number(limit));
  }

  @Get('detail/:productId')
  async detail(@Param('productId') productId: string) {
    return this.productService.getDetail(productId);
  }
}








