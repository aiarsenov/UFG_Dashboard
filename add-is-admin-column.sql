-- Добавляем поле is_admin в таблицу profiles
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'is_admin') THEN
        ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Устанавливаем is_admin = true для существующих админов
UPDATE public.profiles
SET is_admin = true
WHERE email IN ('vasiliy_arsenov@bizan.pro', 'dmitry_kolesnikov@bizan.pro');


