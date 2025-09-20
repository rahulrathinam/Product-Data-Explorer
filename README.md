# World of Books - Product Data Explorer

A comprehensive web scraping and data exploration platform specifically designed for World of Books (https://www.worldofbooks.com/). This project extracts and displays book data with a beautiful, modern interface.

## 🚀 Features

### ✅ **Complete Implementation**
- **Modern React Frontend** with Next.js 15 and Tailwind CSS
- **Robust Backend API** with NestJS and Prisma
- **World of Books Scraping** with Crawlee + Playwright
- **Beautiful UI** with smooth animations and loading states
- **Responsive Design** for all devices
- **Database Persistence** with SQLite
- **Ethical Scraping** with rate limiting and caching

### 📚 **Book-Specific Features**
- **Navigation Headings** from World of Books
- **Categories & Subcategories** with hierarchical structure
- **Product Tiles** with Title, Author, Price, Image, Product Link
- **Detailed Product Pages** with descriptions, reviews, ratings
- **Book Metadata** including ISBN, Publisher, Publication Date
- **Customer Reviews** and star ratings
- **Related Products** and recommendations

### 🛡️ **Ethical Scraping**
- **Rate Limiting** with 2-second delays between requests
- **Caching System** with 24-hour expiry
- **Deduplication** to prevent duplicate entries
- **Error Handling** with retries and exponential backoff
- **Respects robots.txt** and implements proper delays

## 🏗️ **Architecture**

```
├── frontend/          # Next.js 15 + React + Tailwind CSS
├── backend/           # NestJS + Prisma + SQLite
├── docker-compose.yml # PostgreSQL + Redis (optional)
└── README.md
```

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Product-data-explorer
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed

# Frontend
cd ../frontend
npm install
```

3. **Start the application**
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

4. **Access the application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000

## 📡 **API Endpoints**

### Navigation
- `GET /navigation` - List navigation headings
- `GET /categories/{slug}` - List categories by navigation

### Products
- `GET /products/by-category/{slug}` - List products by category
- `GET /products/detail/{id}` - Get product details

### Scraping
- `POST /scrape/worldofbooks` - Start World of Books scraping
- `GET /scrape/worldofbooks/status` - Get scraping status
- `POST /scrape/worldofbooks/clear-cache` - Clear expired cache

### History
- `GET /history` - Get browsing history
- `POST /history` - Track page visits

## 🗄️ **Database Schema**

### Core Models
- **Navigation** - Top-level navigation headings
- **Category** - Book categories and subcategories
- **Product** - Books with metadata (author, ISBN, publisher, etc.)
- **ProductDetail** - Detailed descriptions and ratings
- **Review** - Customer reviews and ratings
- **ScrapeJob** - Scraping job tracking
- **ScrapeCache** - Caching system for deduplication
- **ViewHistory** - User browsing history

## 🎨 **Frontend Features**

### Modern Design
- **Gradient backgrounds** and professional styling
- **Smooth animations** and hover effects
- **Loading states** with skeleton screens
- **Error handling** with user-friendly messages
- **Responsive grid layouts** for all screen sizes

### Book-Specific UI
- **Beautiful book cards** with covers and metadata
- **Detailed book pages** with complete information
- **Star ratings** and customer reviews
- **Author information** and book metadata
- **Price display** with currency formatting

## 🔧 **Scraping System**

### World of Books Integration
- **Crawlee + Playwright** for robust scraping
- **Multiple selectors** for different page layouts
- **Data extraction** for all book information
- **Image handling** with proper URL resolution
- **Error recovery** and retry mechanisms

### Data Processing
- **Deduplication** based on source URLs
- **Data validation** and cleaning
- **Relationship mapping** between entities
- **Cache management** with expiry
- **Batch processing** for efficiency

## 🚀 **Deployment**

### **Local Development**
```bash
# Start both servers
npm run dev:all
```

### **Production Deployment**

#### **Option 1: Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Set environment variables in Vercel dashboard
DATABASE_URL=your_postgresql_url
NEXT_PUBLIC_API_URL=your_backend_url
```

#### **Option 2: Railway**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Deploy
railway up
```

#### **Option 3: Docker**
```bash
# Build and run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

#### **Option 4: Manual Deployment**
```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd ../backend
npm run build

# Start production servers
npm run start:prod
```

### **Environment Variables**
Create `.env` file with:
```env
DATABASE_URL="postgresql://username:password@host:5432/worldofbooks"
REDIS_URL="redis://host:6379"
NEXT_PUBLIC_API_URL="https://your-backend-url.com"
PORT=4000
NODE_ENV="production"
```

### **Database Setup**
```bash
# Run migrations
npx prisma migrate deploy

# Seed database
npm run prisma:seed
```

## 📊 **Performance**

- **Fast loading** with optimized queries
- **Efficient caching** to reduce API calls
- **Smooth animations** with CSS transitions
- **Responsive design** for all devices
- **Error boundaries** for graceful failures

## 🛠️ **Development**

### Backend Development
```bash
cd backend
npm run start:dev    # Development server
npm run build        # Build for production
npm run test         # Run tests
```

### Frontend Development
```bash
cd frontend
npm run dev          # Development server
npm run build        # Build for production
npm run lint         # Lint code
```

### Database Management
```bash
cd backend
npx prisma studio    # Database GUI
npx prisma migrate   # Run migrations
npx prisma seed      # Seed database
```

## 📝 **API Documentation**

### Navigation API
```typescript
// Get all navigation items
GET /navigation
Response: Navigation[]

// Get categories for navigation
GET /categories/{navigationSlug}
Response: Category[]
```

### Product API
```typescript
// Get products by category
GET /products/by-category/{categorySlug}?page=1&limit=24
Response: { items: Product[], total: number, page: number, pages: number }

// Get product details
GET /products/detail/{productId}
Response: ProductDetail
```

### Scraping API
```typescript
// Start scraping
POST /scrape/worldofbooks
Response: { message: string, stats: any }

// Get scraping status
GET /scrape/worldofbooks/status
Response: { stats: any, recentJobs: ScrapeJob[] }
```

## 🔒 **Security & Ethics**

### Ethical Scraping
- **Rate limiting** with 2-second delays
- **Respects robots.txt** and terms of service
- **Caching** to avoid repeated requests
- **Error handling** with graceful failures
- **User agent** identification

### Data Protection
- **Input validation** on all endpoints
- **SQL injection** prevention with Prisma
- **CORS** configuration for security
- **Error sanitization** to prevent data leaks

## 🎯 **Acceptance Criteria**

### ✅ **Completed Requirements**
- [x] Landing loads navigation headings from World of Books
- [x] Drilldown loads categories/subcategories from World of Books  
- [x] Product grid displays real products scraped from World of Books
- [x] Product detail page includes description, reviews/ratings, recommendations
- [x] DB persists all scraped objects reliably
- [x] On-demand scrape can refresh a product/category
- [x] Frontend responsive and accessible baseline
- [x] README + deploy links + API docs present
- [x] Repo builds and runs with provided instructions

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

## 🆘 **Support**

For issues and questions:
1. Check the documentation above
2. Review the API endpoints
3. Check the database schema
4. Open an issue with detailed information

---

**Built with ❤️ for World of Books data exploration**#   P r o d u c t - D a t a - E x p l o r e r -  
 