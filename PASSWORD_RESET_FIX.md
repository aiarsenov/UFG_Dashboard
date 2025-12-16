# Исправление проблемы с восстановлением пароля

## Проблема
При переходе по ссылке для восстановления пароля получаем ошибку:
```json
{"code":403,"error_code":"otp_expired","msg":"Email link is invalid or has expired"}
```

## Решение

### 1. Настройка в Supabase Dashboard

1. Перейдите в **Authentication** → **URL Configuration**
2. В поле **"Site URL"** укажите: `https://ufg-dashboard.vercel.app`
3. В поле **"Redirect URLs"** добавьте:
   - `https://ufg-dashboard.vercel.app/auth/callback`
   - `https://ufg-dashboard.vercel.app/auth/reset`
   - `http://localhost:3000/auth/callback` (для локальной разработки)
   - `http://localhost:3000/auth/reset` (для локальной разработки)
4. Нажмите **"Save"**

### 2. Увеличение времени жизни токена

1. Перейдите в **Authentication** → **Sign In / Providers** → **Email**
2. Найдите **"Email OTP Expiration"**
3. Увеличьте значение с `3600` (1 час) до `86400` (24 часа) или больше
4. Нажмите **"Save"**

### 3. Проверка Email Templates

1. Перейдите в **Authentication** → **Email Templates**
2. Найдите шаблон **"Reset Password"**
3. Убедитесь, что в шаблоне используется правильный redirect URL:
   ```
   {{ .ConfirmationURL }}
   ```
4. Или используйте кастомный URL:
   ```
   https://ufg-dashboard.vercel.app/auth/callback?type=recovery&token_hash={{ .TokenHash }}
   ```

## Альтернативное решение

Если проблема сохраняется, можно использовать прямой обмен токена через API:

1. Supabase отправляет ссылку на свой домен: `https://wnjvicblfqdpjylhcpmg.supabase.co/auth/v1/verify?...`
2. Эта ссылка должна автоматически редиректить на указанный `redirect_to` URL
3. Убедитесь, что в настройках Supabase правильно указан `redirect_to`

## Проверка

После настройки:
1. Запросите восстановление пароля на `/auth/forgot`
2. Проверьте письмо - ссылка должна вести на ваш домен
3. Перейдите по ссылке - должна открыться форма сброса пароля



