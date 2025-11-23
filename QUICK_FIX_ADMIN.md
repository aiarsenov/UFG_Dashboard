# Быстрое восстановление доступа к админской учетке

## Проблема: Не могу зайти под `vasiliy_arsenov@bizan.pro`

### Решение: Создайте пользователя заново

#### Шаг 1: Проверьте в Supabase

1. Откройте **Supabase Dashboard** → **Authentication** → **Users**
2. Найдите `vasiliy_arsenov@bizan.pro`
3. Если его нет — переходите к Шагу 2

#### Шаг 2: Создайте пользователя

**Через Supabase Dashboard (самый простой способ):**

1. **Authentication** → **Users** → **Add user** → **Create new user**
2. Заполните:
   - **Email:** `vasiliy_arsenov@bizan.pro`
   - **Password:** придумайте пароль (минимум 6 символов, запомните его!)
   - **Auto Confirm User:** включите ✅ (важно!)
3. Нажмите **"Create user"**

#### Шаг 3: Создайте профиль

1. Откройте **SQL Editor** в Supabase
2. Выполните этот SQL:

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

#### Шаг 4: Войдите в систему

1. Откройте: https://ufg-dashboard.vercel.app/auth/login
2. Email: `vasiliy_arsenov@bizan.pro`
3. Пароль: тот, который вы указали в Шаге 2
4. После входа вы автоматически получите доступ к `/dashboard` и `/admin`

---

## Альтернатива: Зарегистрируйтесь через сайт

Если не хотите использовать Dashboard:

1. Откройте: https://ufg-dashboard.vercel.app/auth/register
2. Зарегистрируйтесь с email: `vasiliy_arsenov@bizan.pro`
3. Профиль создастся автоматически
4. Войдите на `/auth/login`

---

## Если все еще не работает

### Проверьте в Supabase SQL Editor:

```sql
-- Проверить пользователя
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

**Что должно быть:**
- Запись должна существовать
- `email_confirmed_at` должен быть не NULL (если включено подтверждение email)
- `banned_until` должен быть NULL
- `p.banned` должен быть `false` или NULL

### Если пользователь заблокирован:

```sql
-- Разблокировать пользователя
UPDATE auth.users 
SET banned_until = NULL 
WHERE email = 'vasiliy_arsenov@bizan.pro';

UPDATE public.profiles 
SET banned = false 
WHERE email = 'vasiliy_arsenov@bizan.pro';
```

---

## Важно

- Переменная `ADMIN_EMAIL` уже настроена правильно ✅
- После создания пользователя обязательно создайте профиль (Шаг 3)
- Если забыли пароль — используйте восстановление пароля на `/auth/forgot`

