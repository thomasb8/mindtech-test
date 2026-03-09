# Mindtech – Mini Food Ordering System

NestJS + Next.js monorepo with JWT auth, PostgreSQL, and Prisma ORM.

## How to run

```bash
pnpm install
docker compose up -d db
cp api/.env.example api/.env
cp frontend/.env.example frontend/.env.local
cd api
npx prisma migrate deploy
npx prisma generate
pnpm build
pnpm seed
cd ..
pnpm dev
```

- API: http://localhost:3000
- Frontend: http://localhost:3001
- Swagger: http://localhost:3000/docs

## Production (API)

```bash
docker compose up -d
```
