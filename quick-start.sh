#!/bin/bash

echo "🚀 Quick Start - Product Data Explorer"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install backend dependencies
echo "📦 Installing Backend Dependencies..."
cd backend
npm install

# Generate Prisma client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running Database Migrations..."
npx prisma migrate dev --name init

# Seed the database
echo "🌱 Seeding Database..."
npx prisma db seed

# Start backend
echo "🚀 Starting Backend Server..."
npm run start:dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 5

# Install frontend dependencies
echo "📦 Installing Frontend Dependencies..."
cd ../frontend
npm install

# Start frontend
echo "🚀 Starting Frontend Server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 Application Started Successfully!"
echo "======================================"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:4000"
echo "📊 Database: http://localhost:5555 (Prisma Studio)"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait
