# Исправление проблем с авторизацией

## Проблемы:
1. **"Email not confirmed"** - требуется подтверждение email после регистрации
2. **"otp_expired"** - ссылка для восстановления пароля истекает

## Решение 1: Отключить подтверждение email (для разработки)

### В Supabase Dashboard:
1. Перейдите в **Authentication** → **Sign In / Providers**
2. В разделе **"User Signups"** найдите **"Confirm email"**
3. **Отключите** переключатель "Confirm email"
4. Нажмите **"Save changes"**

Теперь пользователи смогут входить сразу после регистрации без подтверждения email.

## Решение 2: Настроить Email OTP Expiration

### В Supabase Dashboard:
1. Перейдите в **Authentication** → **Sign In / Providers**
2. Нажмите на **Email** провайдер (стрелка справа)
3. Найдите **"Email OTP Expiration"**
4. Увеличьте значение с `3600` (1 час) до `86400` (24 часа) или больше
5. Нажмите **"Save"**

## Решение 3: Настроить Redirect URLs

### В Supabase Dashboard:
1. Перейдите в **Authentication** → **URL Configuration**
2. В **"Site URL"** укажите: `https://ufg-dashboard.vercel.app`
3. В **"Redirect URLs"** добавьте:
   - `https://ufg-dashboard.vercel.app/auth/callback`
   - `https://ufg-dashboard.vercel.app/auth/reset`
   - `http://localhost:3000/auth/callback` (для локальной разработки)
   - `http://localhost:3000/auth/reset` (для локальной разработки)
4. Нажмите **"Save"**

## Альтернативное решение: Автоматическое подтверждение через код

Если вы хотите оставить подтверждение email, но автоматически подтверждать пользователей при регистрации через админку, используйте Admin API (уже реализовано в `/api/admin/create-user`).

## Проверка после настройки:

1. Зарегистрируйте нового пользователя на `/auth/register`
2. Попробуйте войти - должно работать без ошибки "Email not confirmed"
3. Запросите восстановление пароля на `/auth/forgot`
4. Проверьте письмо - ссылка должна работать и не истекать быстро

