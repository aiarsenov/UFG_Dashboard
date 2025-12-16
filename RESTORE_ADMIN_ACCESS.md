# Восстановление доступа к админской учетке после очистки пользователей

## Проблема
После выполнения `clear-users.sql` все пользователи удаляются, включая админскую учетку. Нужно создать её заново.

## Решение: Создание админской учетки

### Способ 1: Через Supabase Dashboard (РЕКОМЕНДУЕТСЯ)

1. **Откройте Supabase Dashboard**
   - Перейдите в ваш проект
   - Откройте **Authentication** → **Users**

2. **Создайте нового пользователя**
   - Нажмите **"Add user"** → **"Create new user"**
   - Заполните форму:
     - **Email:** `vasiliy_arsenov@bizan.pro`
     - **Password:** введите желаемый пароль (минимум 6 символов)
     - **Auto Confirm User:** включите ✅ (чтобы не требовалось подтверждение email)
   - Нажмите **"Create user"**

3. **Создайте профиль для админа**
   - Откройте **SQL Editor**
   - Выполните SQL из файла `create-admin-user.sql` (часть "Вариант 2")
   - Или выполните этот SQL:
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

4. **Войдите в систему**
   - Откройте: https://ufg-dashboard.vercel.app/auth/login
   - Введите email: `vasiliy_arsenov@bizan.pro`
   - Введите пароль, который указали при создании
   - После входа вы автоматически получите доступ к `/dashboard` и `/admin`

### Способ 2: Через Admin API (если есть доступ к Service Role Key)

Если у вас есть доступ к Service Role Key, можно создать пользователя через API:

```bash
curl -X POST 'https://YOUR_PROJECT.supabase.co/auth/v1/admin/users' \
  -H "apikey: YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vasiliy_arsenov@bizan.pro",
    "password": "ваш_пароль",
    "email_confirm": true,
    "user_metadata": {
      "fio": "Администратор"
    }
  }'
```

Затем создайте профиль через SQL (как в Способе 1, шаг 3).

## Важно

- **Админский email:** `vasiliy_arsenov@bizan.pro` (настроен в `ADMIN_EMAIL`)
- После создания пользователя обязательно создайте запись в таблице `profiles`
- Если нужно изменить админский email, обновите переменную `ADMIN_EMAIL` в Vercel и `.env.local`

## Альтернатива: Не удалять админскую учетку

Если вы хотите очистить только обычных пользователей, но оставить админа, используйте этот SQL:

```sql
-- Удалить только обычных пользователей (не админа)
DELETE FROM public.profiles
WHERE email != 'vasiliy_arsenov@bizan.pro';

-- Или удалить из auth.users (будет удалено и из profiles из-за CASCADE)
DELETE FROM auth.users
WHERE email != 'vasiliy_arsenov@bizan.pro';
```



