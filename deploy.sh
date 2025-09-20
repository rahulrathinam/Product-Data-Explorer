#!/bin/bash

echo "🚀 Deploying Product Data Explorer..."

# Build Backend
echo "📦 Building Backend..."
cd backend
npm install
npm run build
cd ..

# Build Frontend
echo "📦 Building Frontend..."
cd frontend
npm install
npm run build
cd ..

echo "✅ Build Complete!"
echo "🌐 Ready for deployment!"

# Instructions
echo ""
echo "📋 Deployment Instructions:"
echo "1. Upload the 'dist' folder (backend) and 'out' folder (frontend) to your hosting"
echo "2. Set up PostgreSQL database"
echo "3. Run: npx prisma migrate deploy"
echo "4. Run: npx prisma db seed"
echo "5. Configure environment variables"
echo ""
echo "🔗 Repository: https://github.com/rahulrathinam/Product-Data-Explorer-"