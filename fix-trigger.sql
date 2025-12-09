-- Исправление триггера handle_updated_at
-- Проблема: триггер пытается обновить updated_at при INSERT, но это поле может отсутствовать

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


