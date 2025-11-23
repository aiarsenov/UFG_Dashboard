-- Очистка всех пользователей из таблицы profiles
-- ВНИМАНИЕ: Это удалит все записи из таблицы profiles!

DELETE FROM public.profiles;

-- Также можно удалить всех пользователей из auth.users (используйте с осторожностью!)
-- DELETE FROM auth.users;

-- Если нужно только очистить profiles, но оставить пользователей в auth.users,
-- выполните только первую команду DELETE FROM public.profiles;

