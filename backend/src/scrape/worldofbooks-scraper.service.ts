import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PlaywrightCrawler, Dataset } from 'crawlee';
import { chromium } from 'playwright';

@Injectable()
export class WorldOfBooksScraperService {
  private readonly logger = new Logger(WorldOfBooksScraperService.name);
  private readonly baseUrl = 'https://www.worldofbooks.com';
  private readonly rateLimitDelay = 2000; // 2 seconds between requests
  private readonly cacheExpiryHours = 24;

  constructor(private prisma: PrismaService) {}

  async scrapeWorldOfBooks(): Promise<{ message: string; stats: any }> {
    this.logger.log('Starting World of Books scraping...');
    
    const stats = {
      navigationItems: 0,
      categories: 0,
      products: 0,
      productDetails: 0,
      errors: 0
    };

    try {
      // 1. Scrape navigation
      await this.scrapeNavigation(stats);
      
      // 2. Scrape categories
      await this.scrapeCategories(stats);
      
      // 3. Scrape products
      await this.scrapeProducts(stats);
      
      // 4. Scrape product details
      await this.scrapeProductDetails(stats);

      this.logger.log('World of Books scraping completed', stats);
      return { message: 'Scraping completed successfully', stats };
    } catch (error) {
      this.logger.error('World of Books scraping failed:', error);
      stats.errors++;
      throw error;
    }
  }

  private async scrapeNavigation(stats: any) {
    this.logger.log('Scraping navigation...');
    
    const crawler = new PlaywrightCrawler({
      launchContext: {
        launchOptions: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      },
      async requestHandler({ page, request }) {
        await page.goto(request.url, { waitUntil: 'networkidle' });
        
        // Extract navigation items
        const navigationItems = await page.evaluate(() => {
          const items: Array<{ title: string; href: string; slug: string }> = [];
          const navSelectors = [
            'nav a[href*="/books"]',
            'nav a[href*="/categories"]',
            '.main-nav a',
            '.navigation a',
            '.header-nav a'
          ];
          
          navSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
              const text = el.textContent?.trim();
              const href = el.getAttribute('href');
              if (text && href && text.length > 2 && text.length < 50) {
                items.push({
                  title: text,
                  href: href.startsWith('http') ? href : `https://www.worldofbooks.com${href}`,
                  slug: text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                });
              }
            });
          });
          
          return [...new Map(items.map(item => [item.slug, item])).values()];
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
        
        stats.navigationItems = navigationItems.length;
      },
      maxRequestsPerCrawl: 1,
      requestHandlerTimeoutSecs: 30,
    });

    await crawler.run([this.baseUrl]);
    await this.delay(this.rateLimitDelay);
  }

  private async scrapeCategories(stats: any) {
    this.logger.log('Scraping categories...');
    
    const crawler = new PlaywrightCrawler({
      launchContext: {
        launchOptions: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      },
      async requestHandler({ page, request }) {
        await page.goto(request.url, { waitUntil: 'networkidle' });
        
        const categories = await page.evaluate(() => {
          const cats: Array<{ title: string; href: string; slug: string }> = [];
          const categorySelectors = [
            '.category-item',
            '.category-link',
            '.subcategory-item',
            'a[href*="/category/"]',
            'a[href*="/books/"]'
          ];
          
          categorySelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
              const text = el.textContent?.trim();
              const href = el.getAttribute('href');
              if (text && href && text.length > 2) {
                cats.push({
                  title: text,
                  href: href.startsWith('http') ? href : `https://www.worldofbooks.com${href}`,
                  slug: text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                });
              }
            });
          });
          
          return [...new Map(cats.map(cat => [cat.slug, cat])).values()];
        });

        // Get or create navigation
        let navigation = await this.prisma.navigation.findFirst();
        if (!navigation) {
          navigation = await this.prisma.navigation.create({
            data: {
              title: 'World of Books',
              slug: 'world-of-books',
              lastScrapedAt: new Date()
            }
          });
        }

        for (const cat of categories) {
          await this.prisma.category.upsert({
            where: { navigationId_slug: { navigationId: navigation.id, slug: cat.slug } },
            update: { lastScrapedAt: new Date() },
            create: {
              navigationId: navigation.id,
              title: cat.title,
              slug: cat.slug,
              productCount: 0,
              lastScrapedAt: new Date()
            }
          });
        }
        
        stats.categories = categories.length;
      },
      maxRequestsPerCrawl: 1,
      requestHandlerTimeoutSecs: 30,
    });

    await crawler.run([`${this.baseUrl}/books`]);
    await this.delay(this.rateLimitDelay);
  }

  private async scrapeProducts(stats: any) {
    this.logger.log('Scraping products...');
    
    const crawler = new PlaywrightCrawler({
      launchContext: {
        launchOptions: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      },
      async requestHandler({ page, request }) {
        try {
          await page.goto(request.url, { waitUntil: 'networkidle' });
          
          const products = await page.evaluate(() => {
            const prods: Array<{ title: string; author: string | null; price: number | null; imageUrl: string | null; productUrl: string; sourceId: string }> = [];
            const productSelectors = [
              '.product-item',
              '.book-item',
              '.product-card',
              '.book-card',
              '[data-testid*="product"]'
            ];
            
            productSelectors.forEach(selector => {
              document.querySelectorAll(selector).forEach(el => {
                const titleEl = el.querySelector('h3, h4, .title, .book-title, .product-title');
                const priceEl = el.querySelector('.price, .cost, .book-price');
                const imageEl = el.querySelector('img');
                const linkEl = el.querySelector('a');
                const authorEl = el.querySelector('.author, .book-author');
                
                if (titleEl && linkEl) {
                  const title = titleEl.textContent?.trim();
                  const price = priceEl?.textContent?.trim();
                  const imageUrl = imageEl?.getAttribute('src');
                  const productUrl = linkEl.getAttribute('href');
                  const author = authorEl?.textContent?.trim();
                  
                  if (title && productUrl) {
                    prods.push({
                      title,
                      author: author || null,
                      price: price ? parseFloat(price.replace(/[^\d.]/g, '')) : null,
                      imageUrl: imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `https://www.worldofbooks.com${imageUrl}`) : null,
                      productUrl: productUrl.startsWith('http') ? productUrl : `https://www.worldofbooks.com${productUrl}`,
                      sourceId: Buffer.from(productUrl).toString('base64').slice(0, 20)
                    });
                  }
                }
              });
            });
            
            return prods;
          });

          // Get a category to associate products with
          const category = await this.prisma.category.findFirst();
          if (category && products.length > 0) {
            for (const product of products) {
              try {
                await this.prisma.product.upsert({
                  where: { sourceUrl: product.productUrl },
                  update: { lastScrapedAt: new Date() },
                  create: {
                    sourceId: product.sourceId,
                    title: product.title,
                    author: product.author,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    sourceUrl: product.productUrl,
                    lastScrapedAt: new Date(),
                    categories: {
                      connect: { id: category.id }
                    }
                  }
                });
              } catch (error) {
                this.logger.error(`Failed to save product ${product.title}:`, error);
              }
            }
          } else if (!category) {
            this.logger.warn('No category found to associate products with');
          }
          
          stats.products = products.length;
        } catch (error) {
          this.logger.error(`Error processing ${request.url}:`, error);
        }
      },
      maxRequestsPerCrawl: 5,
      requestHandlerTimeoutSecs: 30,
    });

    // Scrape multiple product listing pages
    const productUrls = [
      `${this.baseUrl}/books`,
      `${this.baseUrl}/books/fiction`,
      `${this.baseUrl}/books/non-fiction`,
      `${this.baseUrl}/books/childrens-books`,
      `${this.baseUrl}/books/education`
    ];

    for (const url of productUrls) {
      await crawler.run([url]);
      await this.delay(this.rateLimitDelay);
    }
  }

  private async scrapeProductDetails(stats: any) {
    this.logger.log('Scraping product details...');
    
    const products = await this.prisma.product.findMany({
      where: { detail: null },
      take: 10 // Limit to avoid overwhelming the site
    });

    const crawler = new PlaywrightCrawler({
      launchContext: {
        launchOptions: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      },
      async requestHandler({ page, request }) {
        await page.goto(request.url, { waitUntil: 'networkidle' });
        
        const productDetail = await page.evaluate(() => {
          const description = document.querySelector('.description, .book-description, .product-description')?.textContent?.trim();
          const isbn = document.querySelector('[data-isbn], .isbn')?.textContent?.trim();
          const publisher = document.querySelector('.publisher, .book-publisher')?.textContent?.trim();
          const publicationDate = document.querySelector('.publication-date, .publish-date')?.textContent?.trim();
          
          return {
            description: description || null,
            isbn: isbn || null,
            publisher: publisher || null,
            publicationDate: publicationDate || null
          };
        });

        // Find the product by URL
        const product = await this.prisma.product.findFirst({
          where: { sourceUrl: request.url }
        });

        if (product) {
          await this.prisma.productDetail.upsert({
            where: { productId: product.id },
            update: {
              description: productDetail.description,
              ratingsAvg: Math.random() * 2 + 3, // Mock rating
              reviewsCount: Math.floor(Math.random() * 100)
            },
            create: {
              productId: product.id,
              description: productDetail.description,
              ratingsAvg: Math.random() * 2 + 3,
              reviewsCount: Math.floor(Math.random() * 100)
            }
          });

          // Update product with additional metadata
          await this.prisma.product.update({
            where: { id: product.id },
            data: {
              isbn: productDetail.isbn,
              publisher: productDetail.publisher,
              publicationDate: productDetail.publicationDate ? new Date(productDetail.publicationDate) : null
            }
          });
        }
      },
      maxRequestsPerCrawl: products.length,
      requestHandlerTimeoutSecs: 30,
    });

    const productUrls = products.map(p => p.sourceUrl);
    if (productUrls.length > 0) {
      await crawler.run(productUrls);
    }
    
    stats.productDetails = productUrls.length;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async clearExpiredCache(): Promise<void> {
    await this.prisma.scrapeCache.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  }
}
