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
  let isAdmin = userEmail && WHITELIST_ADMIN_EMAILS.includes(userEmail);
  
  // Если не админ по email, проверяем поле is_admin из БД
  if (!isAdmin && userEmail) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();
      
      isAdmin = profile?.is_admin === true;
    } catch (err) {
      // Если поле is_admin отсутствует или ошибка, используем только проверку через email
      console.error("Error checking is_admin:", err);
    }
  }
  
  if (!isAdmin) {
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

    // Отправляем уведомление пользователю об одобрении
    try {
      // Получаем ФИО пользователя
      const { data: profile } = await adminClient
        .from("profiles")
        .select("fio")
        .eq("id", userId)
        .single();

      const userFio = profile?.fio || "";

      // Отправляем email через API route
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "https://ufg-dashboard.vercel.app"}/api/email/send-approval`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          fio: userFio,
        }),
      });

      if (!emailResponse.ok) {
        console.error("Failed to send approval email");
      } else {
        console.log(`Approval email sent to ${email}`);
      }
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

