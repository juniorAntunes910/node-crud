# Node LTS — Debian slim (compatível com Prisma/OpenSSL)
FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma/
COPY prisma.config.ts ./
COPY app.js ./
COPY views ./views/

# prisma.config.ts exige DATABASE_URL; valor fictício só para gerar o client no build
RUN DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/dummy?schema=public" \
  npx prisma generate

EXPOSE 3000

# Na subida: aplica migrações e inicia o servidor (defina DATABASE_URL no run/compose)
CMD ["sh", "-c", "npx prisma migrate deploy && node app.js"]
