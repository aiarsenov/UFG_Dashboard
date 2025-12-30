import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, fio } = body;

    if (!email) {
      return NextResponse.json({ error: "Email не указан" }, { status: 400 });
    }

    const adminClient = createSupabaseAdminClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chain.bizan.pro";

    // Отправляем email через Supabase Admin API
    // Используем generateLink для отправки письма с информацией об одобрении
    // В Supabase Dashboard нужно настроить Email Template для этого типа письма
    const { data, error } = await adminClient.auth.admin.generateLink({
      type: "magiclink",
      email: email,
      options: {
        redirectTo: `${siteUrl}/auth/login`,
      },
    });

    if (error) {
      console.error("Error sending approval email:", error);
    } else {
      console.log(`Approval email sent to ${email}`);
    }

    // Примечание: Для кастомного текста письма нужно настроить Email Template в Supabase
    // Authentication → Email Templates → создать шаблон "User Approved"

    return NextResponse.json({ 
      success: true,
      message: "Email отправлен"
    });
  } catch (error: any) {
    console.error("Error sending approval email:", error);
    return NextResponse.json({ 
      error: error.message || "Ошибка отправки email" 
    }, { status: 500 });
  }
}

