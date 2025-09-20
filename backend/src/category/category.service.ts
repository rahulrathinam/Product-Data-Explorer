import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async listByNavigation(navigationSlug: string) {
    const navigation = await this.prisma.navigation.findUnique({
      where: { slug: navigationSlug },
    });
    if (!navigation) {
      throw new NotFoundException('Navigation not found');
    }
    return this.prisma.category.findMany({
      where: { navigationId: navigation.id, parentId: null },
      orderBy: { title: 'asc' },
      include: { children: true },
    });
  }
}








