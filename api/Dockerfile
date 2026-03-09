FROM node:24-alpine3.22 AS dev
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
EXPOSE 3000
CMD ["pnpm", "start:dev"]

FROM dev AS builder
COPY . .
RUN pnpm build

FROM node:24-alpine3.22 AS runner
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
