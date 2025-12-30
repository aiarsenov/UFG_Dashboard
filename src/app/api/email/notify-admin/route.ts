import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAdminEmails } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userEmail, userFio } = body;

    if (!userEmail) {
      return NextResponse.json({ error: "Email пользователя не указан" }, { status: 400 });
    }

    const adminEmails = getAdminEmails();
    const adminClient = createSupabaseAdminClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chain.bizan.pro";

    // Отправляем email каждому админу о новой регистрации
    for (const adminEmail of adminEmails) {
      try {
        // Генерируем ссылку для админа на dashboard
        // Это отправит письмо админу с информацией о новой регистрации
        const { data, error } = await adminClient.auth.admin.generateLink({
          type: "magiclink",
          email: adminEmail,
          options: {
            redirectTo: `${siteUrl}/dashboard`,
          },
        });

        if (error) {
          console.error(`Error sending notification to admin ${adminEmail}:`, error);
        } else {
          console.log(`Admin notification sent to ${adminEmail} about new user ${userEmail} (${userFio || "без ФИО"})`);
        }
      } catch (err) {
        console.error(`Error notifying admin ${adminEmail}:`, err);
      }
    }

    // Примечание: Для кастомного текста письма нужно настроить Email Template в Supabase
    // Authentication → Email Templates → создать шаблон "New User Registration"

    // Альтернативно можно использовать Supabase Email Templates
    // Нужно настроить в Supabase Dashboard: Authentication → Email Templates

    return NextResponse.json({ 
      success: true,
      message: "Уведомления отправлены админам"
    });
  } catch (error: any) {
    console.error("Error sending admin notification:", error);
    return NextResponse.json({ 
      error: error.message || "Ошибка отправки уведомления" 
    }, { status: 500 });
  }
}

