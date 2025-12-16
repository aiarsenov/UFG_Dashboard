-- Простой скрипт для добавления поля is_admin
-- Выполните этот скрипт в Supabase SQL Editor

-- Шаг 1: Добавляем поле is_admin (если его еще нет)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Шаг 2: Устанавливаем is_admin = true для существующих админов
UPDATE public.profiles
SET is_admin = true
WHERE email IN ('vasiliy_arsenov@bizan.pro', 'dmitry_kolesnikov@bizan.pro');

-- Шаг 3: Проверяем результат
SELECT id, email, fio, is_admin, approved, banned 
FROM public.profiles 
ORDER BY created_at DESC;


