# Проверка и восстановление доступа к админской учетке

## Проблема: Не могу зайти под админской учеткой

### Шаг 1: Проверьте, существует ли пользователь в Supabase

1. Откройте **Supabase Dashboard** → **Authentication** → **Users**
2. Найдите пользователя с email: `vasiliy_arsenov@bizan.pro`
3. Если пользователя нет — нужно создать его (см. Шаг 2)
4. Если пользователь есть — проверьте его статус:
   - Email должен быть подтвержден (зеленая галочка)
   - Пользователь не должен быть заблокирован

### Шаг 2: Создание админской учетки (если её нет)

#### Вариант A: Через Supabase Dashboard (РЕКОМЕНДУЕТСЯ)

1. **Authentication** → **Users** → **Add user** → **Create new user**
2. Заполните:
   - **Email:** `vasiliy_arsenov@bizan.pro`
   - **Password:** введите желаемый пароль (минимум 6 символов)
   - **Auto Confirm User:** включите ✅
3. Нажмите **"Create user"**

4. **Создайте профиль:**
   - Откройте **SQL Editor**
   - Выполните:
   ```sql
   INSERT INTO public.profiles (id, email, fio, banned)
   SELECT 
       id,
       email,
       COALESCE(raw_user_meta_data->>'fio', 'Администратор'),
       false
   FROM auth.users
   WHERE email = 'vasiliy_arsenov@bizan.pro'
   ON CONFLICT (id) DO UPDATE
   SET 
       email = EXCLUDED.email,
       fio = COALESCE(EXCLUDED.fio, 'Администратор'),
       banned = false;
   ```

#### Вариант B: Через регистрацию на сайте

1. Откройте: https://ufg-dashboard.vercel.app/auth/register
2. Зарегистрируйтесь с email: `vasiliy_arsenov@bizan.pro`
3. После регистрации профиль создастся автоматически через триггер

### Шаг 3: Проверьте переменную окружения ADMIN_EMAIL

#### Локально:
1. Откройте `.env.local`
2. Проверьте, что есть строка:
   ```
   ADMIN_EMAIL=vasiliy_arsenov@bizan.pro
   ```
3. Если нет — добавьте её

#### В Vercel:
1. Откройте Vercel Dashboard → ваш проект → Settings → Environment Variables
2. Проверьте, что есть переменная `ADMIN_EMAIL` со значением `vasiliy_arsenov@bizan.pro`
3. Если нет — добавьте:
   ```bash
   echo "vasiliy_arsenov@bizan.pro" | vercel env add ADMIN_EMAIL production
   ```

### Шаг 4: Проверьте доступ к dashboard

1. Войдите на: https://ufg-dashboard.vercel.app/auth/login
2. Email: `vasiliy_arsenov@bizan.pro`
3. Пароль: тот, который вы указали при создании
4. После входа попробуйте открыть:
   - `/dashboard` — должен открыться
   - `/admin` — должен открыться

### Шаг 5: Если все еще не работает

#### Проверьте логи в браузере:
1. Откройте DevTools (F12)
2. Вкладка Console
3. Попробуйте войти и посмотрите на ошибки

#### Проверьте логи в Vercel:
1. Vercel Dashboard → ваш проект → Deployments
2. Откройте последний деплой → Functions → Logs
3. Посмотрите на ошибки

#### Проверьте в Supabase:
1. Authentication → Users → найдите вашего пользователя
2. Проверьте:
   - Email подтвержден?
   - Пользователь не заблокирован?
   - Есть ли запись в таблице `profiles`?

### Шаг 6: Сброс пароля (если забыли пароль)

1. Откройте: https://ufg-dashboard.vercel.app/auth/forgot
2. Введите email: `vasiliy_arsenov@bizan.pro`
3. Проверьте почту и перейдите по ссылке
4. Установите новый пароль

### Шаг 7: Альтернатива - изменить админский email

Если не можете восстановить доступ к `vasiliy_arsenov@bizan.pro`, можно использовать другой email:

1. Создайте нового пользователя с другим email (например, `admin@example.com`)
2. Обновите `ADMIN_EMAIL` в `.env.local` и Vercel
3. Или измените в `src/lib/config.ts`:
   ```typescript
   return ["ваш_новый@email.com"];
   ```

## Быстрая проверка

Выполните в Supabase SQL Editor:

```sql
-- Проверить, существует ли админ
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    u.banned_until,
    p.fio,
    p.banned
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'vasiliy_arsenov@bizan.pro';
```

Если записей нет — пользователь не существует, нужно создать (Шаг 2).
Если запись есть, но `email_confirmed_at` NULL — нужно подтвердить email.
Если `banned_until` не NULL — пользователь заблокирован.

