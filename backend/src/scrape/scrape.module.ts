import { Module } from '@nestjs/common';
import { ScrapeService } from './scrape.service';
import { ScrapeController } from './scrape.controller';
import { WorldOfBooksScraperService } from './worldofbooks-scraper.service';
import { SimpleWorldOfBooksScraperService } from './simple-worldofbooks-scraper.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ScrapeController],
  providers: [ScrapeService, WorldOfBooksScraperService, SimpleWorldOfBooksScraperService],
  exports: [ScrapeService, WorldOfBooksScraperService, SimpleWorldOfBooksScraperService],
})
export class ScrapeModule {}

