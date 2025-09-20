import { Controller, Get, Param, Query } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get(':navigationSlug')
  async listByNavigation(@Param('navigationSlug') navigationSlug: string) {
    return this.categoryService.listByNavigation(navigationSlug);
  }
}








