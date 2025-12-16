# Настройка переменных окружения на Vercel

Для правильной работы системы администрирования нужно настроить переменные окружения на Vercel.

## Необходимые переменные:

1. **ADMIN_EMAIL** (опционально, если не задана, используются дефолтные значения)
   - Значение: `vasiliy_arsenov@bizan.pro,dmitry_kolesnikov@bizan.pro`
   - Разделитель: запятая

2. **NEXT_PUBLIC_ADMIN_EMAILS** (для клиентской части)
   - Значение: `vasiliy_arsenov@bizan.pro,dmitry_kolesnikov@bizan.pro`
   - Разделитель: запятая

## Как настроить:

1. Зайдите в Vercel Dashboard
2. Выберите проект `ufg-dashboard`
3. Перейдите в Settings → Environment Variables
4. Добавьте или обновите переменные:
   - `ADMIN_EMAIL` = `vasiliy_arsenov@bizan.pro,dmitry_kolesnikov@bizan.pro`
   - `NEXT_PUBLIC_ADMIN_EMAILS` = `vasiliy_arsenov@bizan.pro,dmitry_kolesnikov@bizan.pro`
5. Выберите окружения: Production, Preview, Development
6. Сохраните и пересоберите проект

## Примечание:

Если переменные не заданы, система использует дефолтные значения из кода:
- `vasiliy_arsenov@bizan.pro`
- `dmitry_kolesnikov@bizan.pro`

Но для надежности лучше явно задать переменные окружения.


