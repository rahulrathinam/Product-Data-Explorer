# Use Node.js v20 (since NestJS 11 requires >=20)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Copy prisma folder
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Install NestJS CLI so "nest build" works
RUN npm install -g @nestjs/cli

# Copy the rest of the code
COPY . .

# Build the application
RUN npm run build

# Expose port (Render will respect PORT env variable)
EXPOSE 3000

# Start the app
CMD ["node", "dist/src/main.js"]
