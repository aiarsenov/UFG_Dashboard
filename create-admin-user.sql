-- Создание админской учетной записи
-- ВНИМАНИЕ: Замените 'vasiliy_arsenov@bizan.pro' на ваш админский email
-- Замените 'ваш_пароль_здесь' на желаемый пароль (минимум 6 символов)

-- Вариант 1: Создание через SQL (требует расширения pgcrypto)
-- Этот способ создаст пользователя напрямую в auth.users

-- Сначала нужно установить расширение (выполните один раз):
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Затем создайте пользователя:
-- INSERT INTO auth.users (
--     instance_id,
--     id,
--     aud,
--     role,
--     email,
--     encrypted_password,
--     email_confirmed_at,
--     raw_app_meta_data,
--     raw_user_meta_data,
--     created_at,
--     updated_at,
--     confirmation_token,
--     email_change,
--     email_change_token_new,
--     recovery_token
-- )
-- VALUES (
--     '00000000-0000-0000-0000-000000000000',
--     gen_random_uuid(),
--     'authenticated',
--     'authenticated',
--     'vasiliy_arsenov@bizan.pro',
--     crypt('ваш_пароль_здесь', gen_salt('bf')),
--     NOW(),
--     '{"provider":"email","providers":["email"]}',
--     '{"fio":"Администратор"}',
--     NOW(),
--     NOW(),
--     '',
--     '',
--     '',
--     ''
-- );

-- Вариант 2: РЕКОМЕНДУЕТСЯ - Создание через Supabase Dashboard
-- 1. Перейдите в Supabase Dashboard → Authentication → Users
-- 2. Нажмите "Add user" → "Create new user"
-- 3. Заполните:
--    - Email: vasiliy_arsenov@bizan.pro
--    - Password: ваш_пароль
--    - Auto Confirm User: включите (чтобы не требовалось подтверждение email)
-- 4. Нажмите "Create user"
-- 5. После создания пользователя выполните SQL ниже для создания профиля:

-- Создание профиля для админа (выполните после создания пользователя в Dashboard)
-- Замените 'USER_ID_HERE' на ID созданного пользователя (можно найти в Authentication → Users)
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


