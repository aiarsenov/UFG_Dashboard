-- Добавление колонки banned в таблицу profiles
-- Выполните этот SQL ПЕРВЫМ, перед созданием профиля админа

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS banned BOOLEAN DEFAULT FALSE;

-- Проверка, что колонка добавлена
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles' 
AND column_name = 'banned';

