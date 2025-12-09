# Пошаговая инструкция: Как зайти под админской учеткой

## ⚠️ ВАЖНО: Сначала добавьте колонку banned!

### Шаг 1: Добавьте колонку banned в таблицу profiles

1. Откройте **Supabase Dashboard** → **SQL Editor**
2. Нажмите **"New query"**
3. Скопируйте и вставьте этот код:

```sql
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS banned BOOLEAN DEFAULT FALSE;
```

4. Нажмите **"Run"** (или Ctrl/Cmd + Enter)
5. Должно появиться сообщение "Success. No rows returned"

---

### Шаг 2: Проверьте, есть ли пользователь в Supabase

1. В Supabase слева: **Authentication** → **Users**
2. Найдите пользователя с email: `vasiliy_arsenov@bizan.pro`

**Если пользователя НЕТ** → переходите к Шагу 3  
**Если пользователь ЕСТЬ** → переходите к Шагу 4

---

### Шаг 3: Создайте пользователя (если его нет)

1. В разделе **Users** нажмите **"Add user"** → **"Create new user"**
2. Заполните форму:
   - **Email:** `vasiliy_arsenov@bizan.pro`
   - **Password:** придумайте пароль (минимум 6 символов, **запомните его!**)
   - **Auto Confirm User:** включите ✅ (галочка)
3. Нажмите **"Create user"**

---

### Шаг 4: Создайте профиль для админа

1. В Supabase: **SQL Editor** → **New query**
2. Скопируйте и вставьте этот код:

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

3. Нажмите **"Run"**
4. Должно появиться сообщение об успехе

---

### Шаг 5: Войдите на сайте

1. Откройте: https://ufg-dashboard.vercel.app/auth/login
2. Введите:
   - **Email:** `vasiliy_arsenov@bizan.pro`
   - **Пароль:** тот, который вы указали в Шаге 3
3. Нажмите **"Войти"**

---

### Шаг 6: Проверьте доступ

После входа попробуйте открыть:
- https://ufg-dashboard.vercel.app/dashboard — должна открыться страница с пользователями
- https://ufg-dashboard.vercel.app/admin — должна открыться админ-панель

Если открывается страница входа — проверьте Шаг 4 (профиль не создан).

---

## Если все еще не работает

### Проверьте в SQL Editor:

```sql
-- Проверить пользователя и профиль
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
- `p.fio` должен быть не NULL
- `p.banned` должен быть `false`

---

## Краткая версия (если пользователь уже есть)

1. **Добавьте колонку banned:**
   ```sql
   ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS banned BOOLEAN DEFAULT FALSE;
   ```

2. **Создайте профиль:**
   ```sql
   INSERT INTO public.profiles (id, email, fio, banned)
   SELECT id, email, COALESCE(raw_user_meta_data->>'fio', 'Администратор'), false
   FROM auth.users
   WHERE email = 'vasiliy_arsenov@bizan.pro'
   ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, fio = COALESCE(EXCLUDED.fio, 'Администратор'), banned = false;
   ```

3. **Войдите на сайте** с вашим паролем

Готово! 🎉


