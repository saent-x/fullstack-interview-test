FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

FROM oven/bun:1 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG DATABASE_URL
ARG NODE_ENV
ENV DATABASE_URL=${DATABASE_URL}
ENV NODE_ENV=${NODE_ENV}

RUN bun run build
RUN bun run db:push --force

FROM oven/bun:1-slim AS runner
WORKDIR /app

ARG DATABASE_URL
ARG PORT
ENV DATABASE_URL=${DATABASE_URL}
ENV PORT=${PORT}

COPY --from=builder /app/build ./build
COPY --from=builder /app/data.db ./data.db

EXPOSE ${PORT}

CMD ["sh", "-c", "bun run ./build/index.js"]
