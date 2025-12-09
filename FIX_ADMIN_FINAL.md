# Финальная инструкция: Как зайти под админской учеткой

## ⚠️ Сначала исправьте триггер!

### Шаг 1: Исправьте триггер (ВАЖНО!)

1. Откройте **Supabase Dashboard** → **SQL Editor**
2. Нажмите **"New query"**
3. Скопируйте и выполните весь код из файла `fix-trigger.sql`:

```sql
-- Удаляем старый триггер
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;

-- Удаляем старую функцию
DROP FUNCTION IF EXISTS public.handle_updated_at();

-- Создаем новую функцию, которая работает только при UPDATE
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    -- Обновляем updated_at только если это UPDATE операция
    IF TG_OP = 'UPDATE' THEN
        NEW.updated_at = TIMEZONE('utc'::text, NOW());
        RETURN NEW;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создаем триггер только для UPDATE операций
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
```

4. Нажмите **"Run"**
5. Должно появиться "Success"

---

### Шаг 2: Добавьте колонку banned (если еще не добавлена)

1. В **SQL Editor** нажмите **"New query"**
2. Выполните:

```sql
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS banned BOOLEAN DEFAULT FALSE;
```

3. Нажмите **"Run"**

---

### Шаг 3: Проверьте, есть ли пользователь

1. В Supabase: **Authentication** → **Users**
2. Найдите `vasiliy_arsenov@bizan.pro`

**Если пользователя НЕТ** → переходите к Шагу 4  
**Если пользователь ЕСТЬ** → переходите к Шагу 5

---

### Шаг 4: Создайте пользователя (если его нет)

1. **Authentication** → **Users** → **Add user** → **Create new user**
2. Заполните:
   - **Email:** `vasiliy_arsenov@bizan.pro`
   - **Password:** придумайте пароль (минимум 6 символов)
   - **Auto Confirm User:** включите ✅
3. Нажмите **"Create user"**

---

### Шаг 5: Создайте профиль для админа

1. В **SQL Editor** нажмите **"New query"**
2. Скопируйте и выполните:

```sql
-- Создаем профиль (если его еще нет)
INSERT INTO public.profiles (id, email, fio, banned)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'fio', 'Администратор'),
    false
FROM auth.users
WHERE email = 'vasiliy_arsenov@bizan.pro'
AND NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.users.id
);

-- Обновляем профиль (если он уже существует)
UPDATE public.profiles
SET 
    email = (SELECT email FROM auth.users WHERE email = 'vasiliy_arsenov@bizan.pro'),
    fio = COALESCE(
        (SELECT raw_user_meta_data->>'fio' FROM auth.users WHERE email = 'vasiliy_arsenov@bizan.pro'),
        'Администратор'
    ),
    banned = false
WHERE email = 'vasiliy_arsenov@bizan.pro';
```

3. Нажмите **"Run"**
4. Должно появиться сообщение об успехе

---

### Шаг 6: Войдите на сайте

1. Откройте: https://ufg-dashboard.vercel.app/auth/login
2. Введите:
   - **Email:** `vasiliy_arsenov@bizan.pro`
   - **Пароль:** тот, который вы указали
3. Нажмите **"Войти"**

---

### Шаг 7: Проверьте доступ

После входа откройте:
- https://ufg-dashboard.vercel.app/dashboard — должна открыться страница с пользователями
- https://ufg-dashboard.vercel.app/admin — должна открыться админ-панель

---

## Порядок выполнения (кратко):

1. ✅ Исправить триггер (`fix-trigger.sql`)
2. ✅ Добавить колонку `banned`
3. ✅ Создать пользователя (если нет)
4. ✅ Создать профиль (`create-admin-simple.sql`)
5. ✅ Войти на сайте

Готово! 🎉


