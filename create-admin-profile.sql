-- Создание профиля для админа
-- ВАЖНО: Сначала выполните add-banned-column.sql!

-- Создаем профиль для админа
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

-- Проверка, что профиль создан
SELECT * FROM public.profiles WHERE email = 'vasiliy_arsenov@bizan.pro';

