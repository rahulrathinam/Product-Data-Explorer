import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async listByCategory(categorySlug: string, page: number, limit: number) {
    const category = await this.prisma.category.findFirst({ where: { slug: categorySlug } });
    if (!category) throw new NotFoundException('Category not found');

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where: { categories: { some: { id: category.id } } },
        orderBy: { title: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where: { categories: { some: { id: category.id } } } }),
    ]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async getDetail(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { detail: true, reviews: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}









