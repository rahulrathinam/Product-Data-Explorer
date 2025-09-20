-- CreateTable
CREATE TABLE "Navigation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "lastScrapedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "navigationId" TEXT NOT NULL,
    "parentId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "productCount" INTEGER NOT NULL DEFAULT 0,
    "lastScrapedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Category_navigationId_fkey" FOREIGN KEY ("navigationId") REFERENCES "Navigation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" REAL,
    "currency" TEXT DEFAULT 'GBP',
    "imageUrl" TEXT,
    "sourceUrl" TEXT NOT NULL,
    "lastScrapedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ProductDetail" (
    "productId" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT,
    "specs" JSONB,
    "ratingsAvg" REAL DEFAULT 0,
    "reviewsCount" INTEGER DEFAULT 0,
    CONSTRAINT "ProductDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "author" TEXT,
    "rating" REAL,
    "text" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ScrapeJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "targetUrl" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "startedAt" DATETIME,
    "finishedAt" DATETIME,
    "errorLog" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ViewHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "sessionId" TEXT NOT NULL,
    "pathJson" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "_CategoryToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CategoryToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoryToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Navigation_slug_key" ON "Navigation"("slug");

-- CreateIndex
CREATE INDEX "Category_navigationId_idx" ON "Category"("navigationId");

-- CreateIndex
CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_navigationId_slug_key" ON "Category"("navigationId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sourceUrl_key" ON "Product"("sourceUrl");

-- CreateIndex
CREATE INDEX "Product_sourceId_idx" ON "Product"("sourceId");

-- CreateIndex
CREATE INDEX "Review_productId_idx" ON "Review"("productId");

-- CreateIndex
CREATE INDEX "ScrapeJob_status_idx" ON "ScrapeJob"("status");

-- CreateIndex
CREATE INDEX "ViewHistory_sessionId_idx" ON "ViewHistory"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToProduct_AB_unique" ON "_CategoryToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToProduct_B_index" ON "_CategoryToProduct"("B");
