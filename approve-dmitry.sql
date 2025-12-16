-- Обновление профиля для dmitry_kolesnikov@bizan.pro
-- Устанавливаем approved = true и убеждаемся, что он не заблокирован

UPDATE public.profiles
SET 
    approved = true,
    banned = false
WHERE email = 'dmitry_kolesnikov@bizan.pro';

-- Проверяем результат
SELECT id, email, fio, approved, banned, created_at
FROM public.profiles
WHERE email = 'dmitry_kolesnikov@bizan.pro';


