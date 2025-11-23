-- Очистка всех пользователей из таблицы profiles
-- ВНИМАНИЕ: Это удалит все записи из таблицы profiles!

-- Вариант 1: Удалить всех пользователей (включая админа)
-- DELETE FROM public.profiles;
-- DELETE FROM auth.users;

-- Вариант 2: Удалить только обычных пользователей, оставить админа (РЕКОМЕНДУЕТСЯ)
-- Замените 'vasiliy_arsenov@bizan.pro' на ваш админский email
DELETE FROM public.profiles
WHERE email != 'vasiliy_arsenov@bizan.pro';

DELETE FROM auth.users
WHERE email != 'vasiliy_arsenov@bizan.pro';

-- Если нужно удалить ВСЕХ пользователей (включая админа),
-- раскомментируйте строки ниже и закомментируйте вариант 2:
-- DELETE FROM public.profiles;
-- DELETE FROM auth.users;
-- 
-- После этого вам нужно будет создать админскую учетку заново!
-- См. файл RESTORE_ADMIN_ACCESS.md для инструкций

