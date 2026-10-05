# E-Classes API

API Express do sistema E-Classes usando Supabase como banco.

## 1. Configuração

1. Crie o projeto no Supabase.
2. Rode o arquivo `supabase.sql` no SQL Editor.
3. Copie `.env.example` para `.env`.
4. Preencha `SUPABASE_URL` e `SUPABASE_KEY` com a URL e a chave pública (anon/publishable) do projeto.
5. Execute:

```bash
npm install
npm start
```

A API ficará em `http://localhost:3000`.

## Rotas

- `/api/jogos`
- `/api/times`
- `/api/competidores`
- `/api/confrontos`

Todas possuem GET, GET por ID, POST, PUT e DELETE.
