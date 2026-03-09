FROM node:24-alpine3.22 AS dev
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
EXPOSE 3001
CMD ["pnpm", "dev"]

FROM dev AS builder
COPY . .
RUN pnpm build

FROM node:24-alpine3.22 AS runner
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3001
ENV PORT=3001
CMD ["pnpm", "start"]
