# Etapa 1: Build NestJS y dependencias nativas
FROM node:22-bookworm-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci
RUN npm rebuild sqlite3 --build-from-source

COPY . .
RUN npm run build

# Limpiar dependencias de desarrollo conservando los binarios nativos compilados
RUN npm prune --omit=dev

# Etapa 2: Runner ligero en Node.js slim oficial (~150MB)
FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV PORT=3000
ENV NODE_ENV=production

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
RUN mkdir -p uploads

EXPOSE 3000
CMD ["node", "dist/main"]

