import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NavigationService {
  constructor(private readonly prisma: PrismaService) {}

  async listHeadings() {
    return this.prisma.navigation.findMany({
      orderBy: { title: 'asc' },
    });
  }
}







