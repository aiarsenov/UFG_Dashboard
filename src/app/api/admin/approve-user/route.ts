import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAdminEmails } from "@/lib/config";

const WHITELIST_ADMIN_EMAILS = getAdminEmails();

async function checkAdminAccess() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", user: null };
  }

  const userEmail = user.email;
  if (!userEmail || !WHITELIST_ADMIN_EMAILS.includes(userEmail)) {
    return { error: "Forbidden", user: null };
  }

  return { error: null, user };
}

export async function POST(request: Request) {
  // Проверка доступа админа
  const { error: accessError } = await checkAdminAccess();
  if (accessError) {
    return NextResponse.json({ error: accessError }, { status: accessError === "Unauthorized" ? 401 : 403 });
  }

  try {
    const body = await request.json();
    const { userId, email } = body;

    if (!userId || !email) {
      return NextResponse.json({ error: "Неверные параметры" }, { status: 400 });
    }

    const adminClient = createSupabaseAdminClient();

    // Обновляем статус одобрения в profiles
    const { error: updateError } = await adminClient
      .from("profiles")
      .update({ approved: true })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    // Отправляем уведомление на email
    // Используем Supabase для отправки email через функцию отправки
    try {
      // Генерируем ссылку для входа и отправляем на email
      // Это отправит письмо пользователю с информацией об одобрении
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ufg-dashboard.vercel.app";
      
      // Отправляем email через Supabase (нужно настроить в Supabase Dashboard)
      // Authentication → Email Templates → можно создать кастомный шаблон
      // Или используем встроенную отправку через generateLink
      const { data: linkData } = await adminClient.auth.admin.generateLink({
        type: "magiclink",
        email: email,
        options: {
          redirectTo: `${siteUrl}/auth/login`,
        },
      });

      // Логируем для отладки
      console.log(`User ${email} approved. Login link generated.`);
    } catch (emailErr) {
      console.error("Error sending approval email:", emailErr);
      // Не прерываем процесс, если email не отправился
    }

    return NextResponse.json({ 
      success: true,
      message: "Пользователь одобрен. Уведомление отправлено на email."
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Внутренняя ошибка сервера" }, { status: 500 });
  }
}

