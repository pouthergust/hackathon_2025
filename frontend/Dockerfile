# syntax=docker/dockerfile:1

# Etapa de build (SSR)
FROM node:22-alpine AS builder
WORKDIR /app

# Instalar pnpm
RUN npm i -g pnpm

# Instalar dependências com lockfile se houver
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

# Copiar código e construir (gera browser + server)
COPY . .
RUN pnpm build

# Etapa de runtime (SSR com Node)
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Instalar apenas dependências de produção necessárias ao server SSR
COPY package.json pnpm-lock.yaml* ./
RUN npm i -g pnpm && pnpm install --prod

# Copiar artefatos gerados
COPY --from=builder /app/dist ./dist

# A app SSR escuta por padrão em 4000 (ou via PORT)
EXPOSE 4000

# Comando para iniciar SSR
CMD ["node", "dist/hack25front/server/server.mjs"]