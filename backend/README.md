# Backend — Hack25back (NestJS)

API em NestJS que atende a aplicação `hack25front` e integra serviços necessários.

## Requisitos
- Node.js 18+ (recomendado)
- pnpm (use a versão definida no monorepo)

## Instalação
Na raiz do monorepo já é possível instalar tudo via workspaces, mas localmente também funciona:
```bash
pnpm install
```

## Variáveis de Ambiente
Crie o arquivo `.env` a partir do exemplo e ajuste conforme necessário:
```bash
cp .env.example .env
```

## Executar em Desenvolvimento
```bash
pnpm start:dev
```
O servidor reinicia automaticamente a cada mudança de código.

## Build e Produção
```bash
pnpm build
pnpm start:prod
```

## Scripts Disponíveis
```bash
pnpm start        # inicia sem watch
pnpm start:dev    # modo desenvolvimento com watch
pnpm start:prod   # executa o build gerado (dist/main)
pnpm build        # gera build em dist/
pnpm lint         # executa eslint com correções
pnpm format       # formata código com prettier
pnpm test         # testes unitários
pnpm test:e2e     # testes end-to-end
pnpm test:cov     # cobertura de testes
```

## Testes
Para executar a suíte de testes unitários:
```bash
pnpm test
```
Para E2E:
```bash
pnpm test:e2e
```

## Observações
- Este projeto faz parte do monorepo e pode ser iniciado em paralelo ao frontend.
- Certifique-se de configurar o `.env` antes de executar em produção.

## Docker
Você pode construir e rodar apenas o backend com Docker, ignorando completamente o frontend.

### Build da imagem
Na raiz do monorepo, execute:
```bash
docker build -f backend/Dockerfile -t hack25back:latest ./backend
```

### Rodar o contêiner
Usando o arquivo de variáveis (ajuste conforme necessário):
```bash
docker run --rm \
  --env-file ./backend/.env \
  -p 3000:3000 \
  hack25back:latest
```

### Notas
- A imagem é multi-stage: compila o código (NestJS) e só leva as dependências de produção para o runtime.
- O contêiner expõe a porta `3000`. Ajuste `-p 3000:3000` se necessário.
- O `.env` não é incluso na imagem (por segurança). Forneça via `--env-file` ou variáveis `-e`.
