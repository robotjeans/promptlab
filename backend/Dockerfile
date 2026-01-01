# Use official Node.js LTS image
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# ⬇️ COPY package.json FIRST (required for pnpm install)
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# ⬇️ THEN copy the rest of the source code
COPY . .

# Build the NestJS app
RUN pnpm run build

# Expose port
EXPOSE 3000

# Run the app
CMD ["pnpm", "run", "start:prod"]