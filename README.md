# Hackathon NASA — Monorepo

Este repositório é um monorepo contendo dois projetos:
- `backend/` — API em NestJS (Node.js)
- `frontend/` — Aplicação Angular (com suporte a SSR)

## Visão Geral
- Backend expõe serviços e integrações necessários para a aplicação.
- Frontend entrega a interface do usuário, com build e execução via Angular CLI e SSR opcional.
- Gerenciamento de pacotes com `pnpm` usando workspaces.

## Estrutura
```
.
├── backend/        # API NestJS
├── frontend/       # App Angular (SPA + SSR opcional)
└── package.json    # Workspaces e configurações gerais
```

## Pré-requisitos
- Node.js 18+ (recomendado)
- `pnpm` (este repo usa `pnpm@10.17.0`)

Instale o pnpm caso não tenha:
```bash
npm i -g pnpm
```

## Instalação
Na raiz do projeto:
```bash
pnpm install
```
Isso instala as dependências de `backend` e `frontend` via workspaces.

## Execução
- Backend (NestJS):
  ```bash
  cd backend
  pnpm start:dev
  ```
- Frontend (Angular):
  ```bash
  cd frontend
  pnpm start
  ```

Para rodar ambos ao mesmo tempo, use dois terminais, um para cada comando acima.

## Variáveis de Ambiente (Backend)
O backend utiliza variáveis de ambiente. Na pasta `backend/`:
```bash
cp .env.example .env
# edite .env conforme necessário
```

## Build de Produção
- Backend:
  ```bash
  cd backend
  pnpm build
  pnpm start:prod
  ```
- Frontend:
  ```bash
  cd frontend
  pnpm build
  ```
Os artefatos serão gerados em `dist/` de cada projeto.

## SSR do Frontend (Opcional)
Após gerar o build SSR, você pode servir o app com:
```bash
cd frontend
pnpm build
pnpm run serve:ssr:hack25front
```

## Testes
- Backend:
  ```bash
  cd backend
  pnpm test
  ```
- Frontend:
  ```bash
  cd frontend
  pnpm test
  ```

## Scripts Úteis
- `backend/`: `start`, `start:dev`, `start:prod`, `build`, `test`, `test:e2e`, `lint`, `format`
- `frontend/`: `start`, `build`, `watch`, `test`, `serve:ssr:hack25front`

## Autor
Sexto Quasar

## Licença
ISC