UFG Dashboard — Next.js (App Router) + Tailwind + shadcn/ui + Supabase.

## Быстрый старт

1. Установить зависимости:

```bash
npm ci
```

2. Создать `.env.local` по образцу `env.example` и заполнить:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

3. Запуск локально:

```bash
npm run dev
```

Откройте http://localhost:3000. Главная перенаправит в раздел аналитики.

## Деплой на Vercel

- Импорт проекта из GitHub (`aiarsenov/UFG_Dashboard`).
- Окружения: Production — `main`, PR — Preview.
- Переменные среды: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Архитектура

- `src/app/(auth)` — авторизация (`/sign-in`, magic link).
- `src/app/(app)` — защищённая зона, редирект на `/sign-in` при отсутствии сессии.
- `src/components/layout` — `AppShell` (хедер + сайдбар).
- `src/lib/supabase` — клиенты Supabase (server/client).

## Авторизация

- Supabase Auth (email magic link). После входа доступны все страницы раздела `/(app)`.

