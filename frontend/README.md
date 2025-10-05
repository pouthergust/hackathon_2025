# Hack25front — Angular

Aplicação Angular gerada com [Angular CLI](https://github.com/angular/angular-cli) versão 20.3.4.

## Servidor de Desenvolvimento
Para iniciar o servidor local:
```bash
pnpm start
```
Acesse `http://localhost:4200/`. O app recarrega automaticamente ao alterar arquivos.

## Geração de Código (Scaffolding)
Para gerar um novo componente:
```bash
pnpm ng generate component nome-do-componente
```
Para ver todos os esquemas disponíveis:
```bash
pnpm ng generate --help
```

## Build
Para compilar o projeto:
```bash
pnpm build
```
Os artefatos serão gerados em `dist/`. O build de produção otimiza desempenho automaticamente.

## Testes Unitários
Para executar testes com [Karma](https://karma-runner.github.io):
```bash
pnpm test
```

## SSR (Server-Side Rendering)
Este projeto inclui suporte a SSR. Após o build, você pode servir a versão SSR com:
```bash
pnpm build
pnpm run serve:ssr:hack25front
```

## Dicas
- Este frontend faz parte do monorepo e pode ser executado em paralelo ao backend.
- Utilize `pnpm` para manter consistência com os workspaces.
