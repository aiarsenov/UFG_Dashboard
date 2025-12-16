# Настройка Supabase для проекта

## 1. Создание таблицы profiles и триггера

### Шаг 1: Откройте SQL Editor в Supabase
1. Зайдите в ваш проект Supabase
2. Перейдите в **SQL Editor** (в левом меню)
3. Нажмите **New Query**

### Шаг 2: Выполните SQL скрипт
1. Скопируйте содержимое файла `supabase-setup.sql`
2. Вставьте в SQL Editor
3. Нажмите **Run** (или `Ctrl/Cmd + Enter`)

### Шаг 3: Проверка
После выполнения скрипта проверьте:
- Таблица `profiles` создана: **Table Editor** → `profiles`
- Триггер создан: **Database** → **Triggers** → должен быть `on_auth_user_created`

## 2. Структура таблицы profiles

Таблица должна содержать:
- `id` (UUID, PRIMARY KEY) - ссылка на `auth.users(id)`
- `fio` (TEXT) - ФИО пользователя
- `email` (TEXT) - email пользователя
- `created_at` (TIMESTAMP) - дата создания
- `updated_at` (TIMESTAMP) - дата обновления

## 3. Триггер handle_new_user

Триггер автоматически создаёт запись в `profiles` при регистрации нового пользователя через:
- Обычную регистрацию (`/auth/register`)
- Создание через админку (`/admin`)

## 4. Настройка админ-email

Админ-email настраивается через переменную окружения `ADMIN_EMAIL` или в коде.

По умолчанию используется: `admin@example.com`

Чтобы изменить:
1. Добавьте `ADMIN_EMAIL=ваш@email.com` в `.env.local`
2. Добавьте `ADMIN_EMAIL=ваш@email.com` в Vercel Environment Variables
3. Или измените `WHITELIST_ADMIN_EMAILS` в файлах:
   - `src/middleware.ts`
   - `src/app/admin/page.tsx`
   - `src/app/api/admin/create-user/route.ts`
   - `src/app/api/admin/users/route.ts`

## 5. Проверка работы

1. Зарегистрируйтесь на `/auth/register`
2. Проверьте, что в таблице `profiles` появилась запись
3. Войдите с админ-email на `/auth/login`
4. Перейдите на `/admin` - должна открыться админ-панель



