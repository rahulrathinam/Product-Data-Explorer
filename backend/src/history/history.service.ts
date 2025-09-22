import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async add(sessionId: string | undefined, path: string) {
    return this.prisma.viewHistory.create({
      data: {
        sessionId: sessionId ?? 'anon',
        pathJson: path,
      },
    });
  }

  async list() {
    return this.prisma.viewHistory.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}









