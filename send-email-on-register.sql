-- Функция для отправки уведомления админу при регистрации нового пользователя
-- Это можно настроить через Supabase Database Webhooks или Edge Functions
-- Для простоты используем API route в приложении

-- Альтернативный вариант: использовать Supabase Database Webhooks
-- 1. В Supabase Dashboard → Database → Webhooks
-- 2. Создать новый webhook на таблицу profiles
-- 3. Event: INSERT
-- 4. HTTP Request: POST на ваш API endpoint /api/email/notify-admin

-- Или использовать триггер для вызова функции отправки email
-- Но проще всего использовать API route в Next.js (уже реализовано)



