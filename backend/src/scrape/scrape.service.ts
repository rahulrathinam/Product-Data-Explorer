import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

export type ScrapeTargetType = 'navigation' | 'category' | 'product' | 'product-detail';

@Injectable()
export class ScrapeService {
  private readonly logger = new Logger(ScrapeService.name);

  constructor(private prisma: PrismaService) {}

  async enqueueAndScrape(targetUrl: string, targetType: ScrapeTargetType): Promise<{ jobId: string }>{
    this.logger.log(`Enqueue scrape: ${targetType} -> ${targetUrl}`);
    
    // Create scrape job record
    const job = await this.prisma.scrapeJob.create({
      data: {
        targetUrl,
        targetType,
        status: 'queued'
      }
    });

    // Process immediately for demo purposes
    this.processScrapeJob(job.id, targetUrl, targetType);
    
    return { jobId: job.id };
  }

  private async processScrapeJob(jobId: string, targetUrl: string, targetType: ScrapeTargetType) {
    try {
      await this.prisma.scrapeJob.update({
        where: { id: jobId },
        data: { status: 'running', startedAt: new Date() }
      });

      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(targetUrl, { waitUntil: 'networkidle2' });
      
      const content = await page.content();
      await browser.close();

      const $ = cheerio.load(content);

      switch (targetType) {
        case 'navigation':
          await this.scrapeNavigation($, targetUrl);
          break;
        case 'category':
          await this.scrapeCategory($, targetUrl);
          break;
        case 'product':
          await this.scrapeProduct($, targetUrl);
          break;
        case 'product-detail':
          await this.scrapeProductDetail($, targetUrl);
          break;
      }

      await this.prisma.scrapeJob.update({
        where: { id: jobId },
        data: { status: 'completed', finishedAt: new Date() }
      });

    } catch (error) {
      this.logger.error(`Scrape job ${jobId} failed:`, error);
      await this.prisma.scrapeJob.update({
        where: { id: jobId },
        data: { 
          status: 'failed', 
          finishedAt: new Date(),
          errorLog: error.message 
        }
      });
    }
  }

  private async scrapeNavigation($: cheerio.CheerioAPI, url: string) {
    // Example: Scrape navigation from a typical e-commerce site
    const navigationItems: Array<{ title: string; slug: string; sourceUrl: string }> = [];
    
    $('nav a, .navigation a, .menu a').each((i, el) => {
      const $el = $(el);
      const title = $el.text().trim();
      const href = $el.attr('href');
      
      if (title && href && !title.includes('Home') && !title.includes('Login')) {
        navigationItems.push({
          title,
          slug: this.slugify(title),
          sourceUrl: href.startsWith('http') ? href : new URL(href, url).toString()
        });
      }
    });

    for (const item of navigationItems) {
      await this.prisma.navigation.upsert({
        where: { slug: item.slug },
        update: { lastScrapedAt: new Date() },
        create: {
          title: item.title,
          slug: item.slug,
          lastScrapedAt: new Date()
        }
      });
    }
  }

  private async scrapeCategory($: cheerio.CheerioAPI, url: string) {
    // Example: Scrape categories from a category page
    const categories: Array<{ title: string; slug: string; sourceUrl: string }> = [];
    
    $('.category, .subcategory, .product-category').each((i, el) => {
      const $el = $(el);
      const title = $el.text().trim();
      const href = $el.attr('href');
      
      if (title && href) {
        categories.push({
          title,
          slug: this.slugify(title),
          sourceUrl: href.startsWith('http') ? href : new URL(href, url).toString()
        });
      }
    });

    // For demo, create a sample navigation if none exists
    const navigation = await this.prisma.navigation.findFirst();
    if (!navigation) {
      const newNav = await this.prisma.navigation.create({
        data: {
          title: 'Sample Store',
          slug: 'sample-store',
          lastScrapedAt: new Date()
        }
      });
      
      for (const cat of categories) {
        await this.prisma.category.create({
          data: {
            navigationId: newNav.id,
            title: cat.title,
            slug: cat.slug,
            lastScrapedAt: new Date()
          }
        });
      }
    }
  }

  private async scrapeProduct($: cheerio.CheerioAPI, url: string) {
    // Example: Scrape products from a product listing page
    const products: Array<{ title: string; price: number | null; imageUrl: string | null; sourceUrl: string; sourceId: string }> = [];
    
    $('.product, .item, .product-item').each((i, el) => {
      const $el = $(el);
      const title = $el.find('.title, .name, h3, h4').text().trim();
      const price = $el.find('.price, .cost').text().trim();
      const imageUrl = $el.find('img').attr('src');
      const productUrl = $el.find('a').attr('href');
      
      if (title && productUrl) {
        products.push({
          title,
          price: this.parsePrice(price),
          imageUrl: imageUrl ? (imageUrl.startsWith('http') ? imageUrl : new URL(imageUrl, url).toString()) : null,
          sourceUrl: productUrl.startsWith('http') ? productUrl : new URL(productUrl, url).toString(),
          sourceId: this.generateSourceId(productUrl)
        });
      }
    });

    // Get a category to associate products with
    const category = await this.prisma.category.findFirst();
    if (category) {
      for (const product of products) {
        await this.prisma.product.upsert({
          where: { sourceUrl: product.sourceUrl },
          update: { lastScrapedAt: new Date() },
          create: {
            sourceId: product.sourceId,
            title: product.title,
            price: product.price,
            imageUrl: product.imageUrl,
            sourceUrl: product.sourceUrl,
            lastScrapedAt: new Date(),
            categories: {
              connect: { id: category.id }
            }
          }
        });
      }
    }
  }

  private async scrapeProductDetail($: cheerio.CheerioAPI, url: string) {
    // Example: Scrape detailed product information
    const title = $('h1, .product-title').text().trim();
    const description = $('.description, .product-description').text().trim();
    const price = $('.price, .cost').text().trim();
    
    if (title) {
      const product = await this.prisma.product.findFirst({
        where: { sourceUrl: url }
      });
      
      if (product) {
        await this.prisma.productDetail.upsert({
          where: { productId: product.id },
          update: {
            description,
            ratingsAvg: Math.random() * 5, // Mock rating
            reviewsCount: Math.floor(Math.random() * 100) // Mock review count
          },
          create: {
            productId: product.id,
            description,
            ratingsAvg: Math.random() * 5,
            reviewsCount: Math.floor(Math.random() * 100)
          }
        });
      }
    }
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private parsePrice(priceText: string): number | null {
    const match = priceText.match(/[\d,]+\.?\d*/);
    return match ? parseFloat(match[0].replace(/,/g, '')) : null;
  }

  private generateSourceId(url: string): string {
    return Buffer.from(url).toString('base64').slice(0, 20);
  }
}

