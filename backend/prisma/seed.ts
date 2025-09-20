import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create World of Books navigation
  const navigation = await prisma.navigation.upsert({
    where: { slug: 'world-of-books' },
    update: {},
    create: {
      title: 'World of Books',
      slug: 'world-of-books',
      lastScrapedAt: new Date()
    }
  });

  // Create book categories
  const categories = [
    { title: 'Fiction', slug: 'fiction' },
    { title: 'Non-Fiction', slug: 'non-fiction' },
    { title: 'Children\'s Books', slug: 'childrens-books' },
    { title: 'Education', slug: 'education' },
    { title: 'Science Fiction', slug: 'science-fiction' },
    { title: 'Romance', slug: 'romance' },
    { title: 'Mystery & Thriller', slug: 'mystery-thriller' }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { navigationId_slug: { navigationId: navigation.id, slug: cat.slug } },
      update: {},
      create: {
        navigationId: navigation.id,
        title: cat.title,
        slug: cat.slug,
        productCount: Math.floor(Math.random() * 50) + 10,
        lastScrapedAt: new Date()
      }
    });
  }

  // Create sample books
  const fictionCategory = await prisma.category.findFirst({
    where: { slug: 'fiction' }
  });

  if (fictionCategory) {
    const products = [
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 12.99, isbn: '9780743273565', publisher: 'Scribner', imageUrl: 'https://via.placeholder.com/300x400?text=The+Great+Gatsby' },
      { title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 14.99, isbn: '9780061120084', publisher: 'J.B. Lippincott & Co.', imageUrl: 'https://via.placeholder.com/300x400?text=To+Kill+a+Mockingbird' },
      { title: '1984', author: 'George Orwell', price: 13.99, isbn: '9780451524935', publisher: 'Secker & Warburg', imageUrl: 'https://via.placeholder.com/300x400?text=1984' },
      { title: 'Pride and Prejudice', author: 'Jane Austen', price: 11.99, isbn: '9780141439518', publisher: 'T. Egerton', imageUrl: 'https://via.placeholder.com/300x400?text=Pride+and+Prejudice' }
    ];

    for (const product of products) {
      await prisma.product.upsert({
        where: { sourceUrl: `https://www.worldofbooks.com/books/${product.title.toLowerCase().replace(/\s+/g, '-')}` },
        update: {},
        create: {
          sourceId: `book_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: product.title,
          author: product.author,
          price: product.price,
          isbn: product.isbn,
          publisher: product.publisher,
          imageUrl: product.imageUrl,
          sourceUrl: `https://www.worldofbooks.com/books/${product.title.toLowerCase().replace(/\s+/g, '-')}`,
          lastScrapedAt: new Date(),
          categories: {
            connect: { id: fictionCategory.id }
          }
        }
      });
    }
  }

  // Create product details for some products
  const products = await prisma.product.findMany({ take: 2 });
  for (const product of products) {
    await prisma.productDetail.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        description: `High-quality ${product.title} with advanced features and excellent performance. Perfect for everyday use and professional applications.`,
        ratingsAvg: Math.random() * 2 + 3, // 3-5 stars
        reviewsCount: Math.floor(Math.random() * 200) + 50
      }
    });

    // Add some sample reviews
    for (let i = 0; i < 3; i++) {
      await prisma.review.create({
        data: {
          productId: product.id,
          author: `User${Math.floor(Math.random() * 1000)}`,
          rating: Math.random() * 2 + 3,
          text: `Great product! ${product.title} exceeded my expectations. Highly recommended.`
        }
      });
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });






