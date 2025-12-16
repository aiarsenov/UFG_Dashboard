-- Добавление колонки approved в таблицу profiles
-- Выполните этот SQL в Supabase SQL Editor

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT FALSE;

-- Админы автоматически одобрены (если нужно)
-- UPDATE public.profiles 
-- SET approved = true 
-- WHERE email = 'vasiliy_arsenov@bizan.pro';



