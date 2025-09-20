import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ScrapeModule } from './scrape/scrape.module';
import { NavigationModule } from './navigation/navigation.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [PrismaModule, ScrapeModule, NavigationModule, CategoryModule, ProductModule, HistoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
