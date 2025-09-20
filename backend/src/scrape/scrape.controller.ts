import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ScrapeService, ScrapeTargetType } from './scrape.service';
import { WorldOfBooksScraperService } from './worldofbooks-scraper.service';
import { SimpleWorldOfBooksScraperService } from './simple-worldofbooks-scraper.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('scrape')
export class ScrapeController {
  constructor(
    private readonly scrapeService: ScrapeService,
    private readonly worldOfBooksScraper: WorldOfBooksScraperService,
    private readonly simpleWorldOfBooksScraper: SimpleWorldOfBooksScraperService,
    private readonly prisma: PrismaService
  ) {}

  @Post()
  async startScrape(@Body() body: { url: string; type: ScrapeTargetType }) {
    return this.scrapeService.enqueueAndScrape(body.url, body.type);
  }

  @Get('demo')
  async startDemoScrape() {
    // Start demo scraping with sample data
    const demoUrls = [
      { url: 'https://example.com', type: 'navigation' as ScrapeTargetType },
      { url: 'https://example.com/categories', type: 'category' as ScrapeTargetType },
      { url: 'https://example.com/products', type: 'product' as ScrapeTargetType }
    ];

    const results = [];
    for (const demo of demoUrls) {
      const result = await this.scrapeService.enqueueAndScrape(demo.url, demo.type);
      results.push(result);
    }

    return { message: 'Demo scraping started', jobs: results };
  }

  @Post('worldofbooks')
  async scrapeWorldOfBooks() {
    return this.simpleWorldOfBooksScraper.scrapeWorldOfBooks();
  }

  @Get('worldofbooks/status')
  async getScrapingStatus() {
    const stats = await this.prisma.scrapeJob.groupBy({
      by: ['status'],
      _count: { status: true }
    });

    const recentJobs = await this.prisma.scrapeJob.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' }
    });

    return { stats, recentJobs };
  }

  @Post('worldofbooks/clear-cache')
  async clearCache() {
    await this.worldOfBooksScraper.clearExpiredCache();
    return { message: 'Cache cleared successfully' };
  }
}
