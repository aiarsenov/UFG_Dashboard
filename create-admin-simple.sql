-- Простое создание профиля для админа (без конфликта с триггером)
-- ВАЖНО: Сначала выполните fix-trigger.sql!

-- Сначала проверяем, что пользователь существует
SELECT id, email FROM auth.users WHERE email = 'vasiliy_arsenov@bizan.pro';

-- Создаем профиль (используем простой INSERT без ON CONFLICT для первого раза)
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

-- Если профиль уже существует, обновляем его
UPDATE public.profiles
SET 
    email = (SELECT email FROM auth.users WHERE email = 'vasiliy_arsenov@bizan.pro'),
    fio = COALESCE(
        (SELECT raw_user_meta_data->>'fio' FROM auth.users WHERE email = 'vasiliy_arsenov@bizan.pro'),
        'Администратор'
    ),
    banned = false
WHERE email = 'vasiliy_arsenov@bizan.pro';

-- Проверка результата
SELECT * FROM public.profiles WHERE email = 'vasiliy_arsenov@bizan.pro';


