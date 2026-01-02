FROM node:20-alpine
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build
RUN mkdir -p chroma_db
EXPOSE 3000
CMD ["pnpm", "run", "start:prod"]