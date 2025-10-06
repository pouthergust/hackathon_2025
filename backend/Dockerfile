# syntax=docker/dockerfile:1

# Etapa de build
FROM node:22-alpine AS builder
WORKDIR /app

# Instalar pnpm
RUN npm i -g pnpm

# Instalar dependências (usa lock se existir)
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

# Copiar código e construir
COPY . .
RUN pnpm build

# Etapa de runtime
FROM node:22-alpine AS runner
WORKDIR /app

RUN npm i -g pnpm
ENV NODE_ENV=production

# Instalar somente dependências de produção
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod

# Copiar artefatos de build
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]