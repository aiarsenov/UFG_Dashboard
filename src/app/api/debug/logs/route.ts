import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminEmails } from "@/lib/config";

export async function GET(request: Request) {
  try {
    // Проверка доступа админа
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminEmails = getAdminEmails();
    if (!adminEmails.includes(user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Возвращаем информацию о том, где смотреть логи
    return NextResponse.json({
      message: "Логи можно посмотреть следующими способами:",
      methods: [
        {
          name: "SSH + PM2",
          command: "pm2 logs",
          description: "Подключитесь к серверу по SSH и выполните команду"
        },
        {
          name: "Консоль браузера",
          description: "Откройте DevTools (F12) → Console для клиентских логов"
        },
        {
          name: "Яндекс.Облако",
          description: "Консоль управления → Compute Cloud → ваш инстанс → Логи"
        }
      ],
      note: "Серверные логи (console.log в route handlers) видны только через PM2 или в консоли Яндекс.Облака"
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

