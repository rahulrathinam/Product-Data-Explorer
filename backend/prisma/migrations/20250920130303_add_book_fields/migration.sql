-- AlterTable
ALTER TABLE "Product" ADD COLUMN "author" TEXT;
ALTER TABLE "Product" ADD COLUMN "isbn" TEXT;
ALTER TABLE "Product" ADD COLUMN "publicationDate" DATETIME;
ALTER TABLE "Product" ADD COLUMN "publisher" TEXT;

-- CreateTable
CREATE TABLE "ScrapeCache" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "ScrapeCache_url_key" ON "ScrapeCache"("url");

-- CreateIndex
CREATE INDEX "ScrapeCache_expiresAt_idx" ON "ScrapeCache"("expiresAt");

-- CreateIndex
CREATE INDEX "Product_isbn_idx" ON "Product"("isbn");

-- CreateIndex
CREATE INDEX "Product_author_idx" ON "Product"("author");
