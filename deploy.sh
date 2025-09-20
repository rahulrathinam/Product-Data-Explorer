#!/bin/bash

# World of Books Deployment Script

echo "🚀 Starting World of Books deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Please run 'git init' first."
    exit 1
fi

# Add all files to git
echo "📁 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy World of Books application

- Complete book browsing system
- Modern UI with search and filtering
- Back navigation system
- 70+ books across 7 categories
- Responsive design
- Production ready"

# Push to main branch
echo "📤 Pushing to main branch..."
git push origin main

echo "✅ Deployment complete!"
echo "🌐 Your application should be available at your hosting provider's URL"
