# PromptLab Backend

RAG-powered document Q&A system with authentication.

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment variables in `.env`:

```env
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
JWT_SECRET=your-secret
CHROMA_URL=http://chroma:8000
```

3. Run database migrations:

```bash
pnpm drizzle-kit push
```

4. Create admin user:

```bash
pnpm create-admin
```

5. Start with Docker:

```bash
docker-compose up --build
```

## API Endpoints

### Auth

- `POST /auth/login` - Login (public)
- `POST /auth/create-user` - Create user (protected)
- `GET /auth/profile` - Get profile (protected)

### RAG

- `POST /query` - Query documents (protected)
- `DELETE /query/cleanup` - Cleanup old docs (protected)

### Health

- `GET /health` - Health check (public)
