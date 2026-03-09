FROM node:24-alpine3.22 AS builder
WORKDIR /app/api
RUN npm install -g pnpm
COPY pnpm-lock.yaml pnpm-workspace.yaml ../
COPY api/package.json ./
RUN pnpm install --frozen-lockfile
COPY api/ .
RUN npx prisma generate
RUN pnpm build

FROM node:24-alpine3.22
WORKDIR /app/api
RUN npm install -g pnpm
COPY pnpm-lock.yaml pnpm-workspace.yaml ../
COPY api/package.json ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=builder /app/api/dist ./dist
COPY --from=builder /app/api/generated ./generated
EXPOSE 3000
CMD ["node", "dist/src/main"]
