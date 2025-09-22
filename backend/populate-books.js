const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function populateBooks() {
  console.log('Starting to populate books...');
  
  try {
    // Get or create navigation
    const navigation = await prisma.navigation.upsert({
      where: { slug: 'world-of-books' },
      update: { lastScrapedAt: new Date() },
      create: {
        title: 'World of Books',
        slug: 'world-of-books',
        lastScrapedAt: new Date()
      }
    });
    console.log('Navigation created/updated');

    // Create categories
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
        update: { lastScrapedAt: new Date() },
        create: {
          navigationId: navigation.id,
          title: cat.title,
          slug: cat.slug,
          productCount: 10,
          lastScrapedAt: new Date()
        }
      });
    }
    console.log('Categories created/updated');

    // Book data for each category
    const bookCategories = {
      'fiction': [
        { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 12.99, isbn: '9780743273565', publisher: 'Scribner' },
        { title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 14.99, isbn: '9780061120084', publisher: 'J.B. Lippincott & Co.' },
        { title: 'Pride and Prejudice', author: 'Jane Austen', price: 11.99, isbn: '9780141439518', publisher: 'T. Egerton' },
        { title: 'The Catcher in the Rye', author: 'J.D. Salinger', price: 15.99, isbn: '9780316769174', publisher: 'Little, Brown and Company' },
        { title: '1984', author: 'George Orwell', price: 13.99, isbn: '9780451524935', publisher: 'Secker & Warburg' },
        { title: 'Lord of the Flies', author: 'William Golding', price: 13.49, isbn: '9780571056866', publisher: 'Faber and Faber' },
        { title: 'Animal Farm', author: 'George Orwell', price: 12.99, isbn: '9780451526342', publisher: 'Secker & Warburg' },
        { title: 'The Hobbit', author: 'J.R.R. Tolkien', price: 16.99, isbn: '9780547928227', publisher: 'Houghton Mifflin Harcourt' },
        { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', price: 24.99, isbn: '9780544003415', publisher: 'Houghton Mifflin Harcourt' },
        { title: 'The Chronicles of Narnia', author: 'C.S. Lewis', price: 19.99, isbn: '9780064471190', publisher: 'HarperCollins' }
      ],
      'non-fiction': [
        { title: 'Sapiens', author: 'Yuval Noah Harari', price: 16.99, isbn: '9780062316097', publisher: 'Harper' },
        { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', price: 18.99, isbn: '9780374533557', publisher: 'Farrar, Straus and Giroux' },
        { title: 'The Lean Startup', author: 'Eric Ries', price: 14.99, isbn: '9780307887894', publisher: 'Crown Business' },
        { title: 'Atomic Habits', author: 'James Clear', price: 17.99, isbn: '9780735211292', publisher: 'Avery' },
        { title: 'The 7 Habits of Highly Effective People', author: 'Stephen R. Covey', price: 15.99, isbn: '9780743269513', publisher: 'Free Press' },
        { title: 'How to Win Friends and Influence People', author: 'Dale Carnegie', price: 13.99, isbn: '9780671027032', publisher: 'Simon & Schuster' },
        { title: 'The Power of Now', author: 'Eckhart Tolle', price: 14.99, isbn: '9781577314806', publisher: 'New World Library' },
        { title: 'The Art of War', author: 'Sun Tzu', price: 11.99, isbn: '9781590309637', publisher: 'Shambhala' },
        { title: 'The 48 Laws of Power', author: 'Robert Greene', price: 19.99, isbn: '9780140280197', publisher: 'Penguin Books' },
        { title: 'The 4-Hour Workweek', author: 'Timothy Ferriss', price: 16.99, isbn: '9780307465351', publisher: 'Crown Publishing' }
      ],
      'childrens-books': [
        { title: 'Harry Potter and the Philosopher\'s Stone', author: 'J.K. Rowling', price: 13.99, isbn: '9780747532699', publisher: 'Bloomsbury' },
        { title: 'The Lion, the Witch and the Wardrobe', author: 'C.S. Lewis', price: 12.99, isbn: '9780064471046', publisher: 'HarperCollins' },
        { title: 'Matilda', author: 'Roald Dahl', price: 11.99, isbn: '9780142410370', publisher: 'Puffin' },
        { title: 'Charlotte\'s Web', author: 'E.B. White', price: 10.99, isbn: '9780061124952', publisher: 'HarperCollins' },
        { title: 'The BFG', author: 'Roald Dahl', price: 12.99, isbn: '9780142410387', publisher: 'Puffin' },
        { title: 'Charlie and the Chocolate Factory', author: 'Roald Dahl', price: 11.99, isbn: '9780142410318', publisher: 'Puffin' },
        { title: 'The Secret Garden', author: 'Frances Hodgson Burnett', price: 10.99, isbn: '9780142437063', publisher: 'Penguin Classics' },
        { title: 'Alice\'s Adventures in Wonderland', author: 'Lewis Carroll', price: 9.99, isbn: '9780141439761', publisher: 'Penguin Classics' },
        { title: 'The Wind in the Willows', author: 'Kenneth Grahame', price: 11.99, isbn: '9780143039959', publisher: 'Penguin Classics' },
        { title: 'Peter Pan', author: 'J.M. Barrie', price: 10.99, isbn: '9780141322575', publisher: 'Puffin' }
      ],
      'education': [
        { title: 'Python Crash Course', author: 'Eric Matthes', price: 24.99, isbn: '9781593279288', publisher: 'No Starch Press' },
        { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', price: 22.99, isbn: '9780596517748', publisher: 'O\'Reilly Media' },
        { title: 'Clean Code', author: 'Robert C. Martin', price: 26.99, isbn: '9780132350884', publisher: 'Prentice Hall' },
        { title: 'Design Patterns', author: 'Gang of Four', price: 28.99, isbn: '9780201633610', publisher: 'Addison-Wesley' },
        { title: 'You Don\'t Know JS', author: 'Kyle Simpson', price: 29.99, isbn: '9781491924464', publisher: 'O\'Reilly Media' },
        { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', price: 25.99, isbn: '9781593279509', publisher: 'No Starch Press' },
        { title: 'The Pragmatic Programmer', author: 'David Thomas', price: 27.99, isbn: '9780135957059', publisher: 'Addison-Wesley' },
        { title: 'Cracking the Coding Interview', author: 'Gayle Laakmann McDowell', price: 32.99, isbn: '9780984782857', publisher: 'CareerCup' },
        { title: 'System Design Interview', author: 'Alex Xu', price: 34.99, isbn: '9781736049112', publisher: 'ByteByteGo' },
        { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', price: 89.99, isbn: '9780262033848', publisher: 'MIT Press' }
      ],
      'science-fiction': [
        { title: 'Dune', author: 'Frank Herbert', price: 15.99, isbn: '9780441172719', publisher: 'Ace Books' },
        { title: 'The Foundation Trilogy', author: 'Isaac Asimov', price: 19.99, isbn: '9780553293357', publisher: 'Bantam Books' },
        { title: 'Neuromancer', author: 'William Gibson', price: 14.99, isbn: '9780441569595', publisher: 'Ace Books' },
        { title: 'The Martian', author: 'Andy Weir', price: 13.99, isbn: '9780553418026', publisher: 'Broadway Books' },
        { title: 'The Hitchhiker\'s Guide to the Galaxy', author: 'Douglas Adams', price: 12.99, isbn: '9780345391803', publisher: 'Del Rey' },
        { title: 'Ender\'s Game', author: 'Orson Scott Card', price: 14.99, isbn: '9780812550702', publisher: 'Tor Books' },
        { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', price: 15.99, isbn: '9780441478125', publisher: 'Ace Books' },
        { title: 'Hyperion', author: 'Dan Simmons', price: 16.99, isbn: '9780553283686', publisher: 'Bantam Books' },
        { title: 'Snow Crash', author: 'Neal Stephenson', price: 15.99, isbn: '9780553380958', publisher: 'Bantam Books' },
        { title: 'The Time Machine', author: 'H.G. Wells', price: 11.99, isbn: '9780486273819', publisher: 'Dover Publications' }
      ],
      'romance': [
        { title: 'The Notebook', author: 'Nicholas Sparks', price: 12.99, isbn: '9780446605231', publisher: 'Warner Books' },
        { title: 'Me Before You', author: 'Jojo Moyes', price: 14.99, isbn: '9780670026609', publisher: 'Viking Press' },
        { title: 'The Time Traveler\'s Wife', author: 'Audrey Niffenegger', price: 13.99, isbn: '9780156029438', publisher: 'Harcourt' },
        { title: 'Outlander', author: 'Diana Gabaldon', price: 16.99, isbn: '9780440212560', publisher: 'Dell Publishing' },
        { title: 'The Kiss Quotient', author: 'Helen Hoang', price: 15.99, isbn: '9780451490803', publisher: 'Berkley' },
        { title: 'The Hating Game', author: 'Sally Thorne', price: 14.99, isbn: '9780062439591', publisher: 'William Morrow' },
        { title: 'Red, White & Royal Blue', author: 'Casey McQuiston', price: 16.99, isbn: '9781250316776', publisher: 'St. Martin\'s Griffin' },
        { title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid', price: 15.99, isbn: '9781501139239', publisher: 'Atria Books' },
        { title: 'It Ends with Us', author: 'Colleen Hoover', price: 13.99, isbn: '9781501110368', publisher: 'Atria Books' },
        { title: 'The Spanish Love Deception', author: 'Elena Armas', price: 14.99, isbn: '9780593336821', publisher: 'Atria Books' }
      ],
      'mystery-thriller': [
        { title: 'Gone Girl', author: 'Gillian Flynn', price: 15.99, isbn: '9780307588364', publisher: 'Crown Publishing' },
        { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', price: 14.99, isbn: '9780307269751', publisher: 'Knopf' },
        { title: 'The Silent Patient', author: 'Alex Michaelides', price: 13.99, isbn: '9781250301697', publisher: 'Celadon Books' },
        { title: 'Sharp Objects', author: 'Gillian Flynn', price: 12.99, isbn: '9780307341556', publisher: 'Shaye Areheart Books' },
        { title: 'The Girl on the Train', author: 'Paula Hawkins', price: 14.99, isbn: '9781594634024', publisher: 'Riverhead Books' },
        { title: 'Big Little Lies', author: 'Liane Moriarty', price: 15.99, isbn: '9780399167065', publisher: 'Amy Einhorn Books' },
        { title: 'The Woman in the Window', author: 'A.J. Finn', price: 16.99, isbn: '9780062678416', publisher: 'William Morrow' },
        { title: 'The Couple Next Door', author: 'Shari Lapena', price: 13.99, isbn: '9780735221086', publisher: 'Pamela Dorman Books' },
        { title: 'The Silent Wife', author: 'A.S.A. Harrison', price: 14.99, isbn: '9780143123231', publisher: 'Penguin Books' },
        { title: 'Before I Go to Sleep', author: 'S.J. Watson', price: 13.99, isbn: '9780062060556', publisher: 'Harper' }
      ]
    };

    // Get all categories
    const allCategories = await prisma.category.findMany();
    let totalProducts = 0;

    // Add books to each category
    for (const category of allCategories) {
      const booksForCategory = bookCategories[category.slug] || [];
      console.log(`Adding ${booksForCategory.length} books to ${category.title}...`);
      
      for (const book of booksForCategory) {
        try {
          await prisma.product.upsert({
            where: { sourceUrl: `https://www.worldofbooks.com/books/${category.slug}/${book.title.toLowerCase().replace(/\s+/g, '-')}` },
            update: { lastScrapedAt: new Date() },
            create: {
              sourceId: `book_${category.slug}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              title: book.title,
              author: book.author,
              price: book.price,
              isbn: book.isbn,
              publisher: book.publisher,
              imageUrl: `https://picsum.photos/300/400?random=${Math.floor(Math.random() * 1000)}`,
              sourceUrl: `https://www.worldofbooks.com/books/${category.slug}/${book.title.toLowerCase().replace(/\s+/g, '-')}`,
              lastScrapedAt: new Date(),
              categories: {
                connect: { id: category.id }
              }
            }
          });
          totalProducts++;
        } catch (error) {
          console.error(`Failed to save book ${book.title} in ${category.slug}:`, error.message);
        }
      }
    }
    
    console.log(`Successfully added ${totalProducts} books across all categories!`);
    
    // Create product details and reviews for all products
    const allProducts = await prisma.product.findMany();
    console.log(`Creating details and reviews for ${allProducts.length} products...`);
    
    for (const product of allProducts) {
      try {
        await prisma.productDetail.upsert({
          where: { productId: product.id },
          update: {},
          create: {
            productId: product.id,
            description: `A captivating ${product.title} by ${product.author}. This book offers an engaging reading experience with well-developed characters and an intriguing plot. Perfect for book lovers who enjoy quality literature. The story will keep you hooked from beginning to end.`,
            ratingsAvg: Math.random() * 2 + 3, // 3-5 stars
            reviewsCount: Math.floor(Math.random() * 200) + 50
          }
        });

        // Add some sample reviews
        for (let i = 0; i < Math.floor(Math.random() * 3) + 2; i++) {
          await prisma.review.create({
            data: {
              productId: product.id,
              author: `Reader${Math.floor(Math.random() * 1000)}`,
              rating: Math.random() * 2 + 3,
              text: `Excellent book! ${product.title} by ${product.author} is a must-read. The writing is engaging and the story is compelling. Highly recommended!`
            }
          });
        }
      } catch (error) {
        console.error(`Failed to create details for ${product.title}:`, error.message);
      }
    }
    
    console.log('Database population completed successfully!');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateBooks();


