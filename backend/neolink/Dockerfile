# Strapi Production Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev) for building
RUN npm ci

# Copy app files
COPY . .

# Build Strapi - this creates build/ directory, not dist/
RUN NODE_ENV=production npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files and install production deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy all necessary files from builder
COPY --from=builder /app ./

# Create uploads directory if it doesn't exist
RUN mkdir -p /app/public/uploads

# Set production environment
ENV NODE_ENV=production

# Expose Strapi port
EXPOSE 1337

# Start Strapi
CMD ["npm", "run", "start"]