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
  const { error: accessError, user: currentUser } = await checkAdminAccess();
  if (accessError) {
    return NextResponse.json({ error: accessError }, { status: accessError === "Unauthorized" ? 401 : 403 });
  }

  try {
    const body = await request.json();
    const { userId, isAdmin } = body;

    if (userId === undefined || isAdmin === undefined) {
      return NextResponse.json({ error: "Неверные параметры" }, { status: 400 });
    }

    // Нельзя убрать права админа у самого себя
    if (currentUser && currentUser.id === userId && !isAdmin) {
      return NextResponse.json({ error: "Нельзя убрать права администратора у самого себя" }, { status: 400 });
    }

    const adminClient = createSupabaseAdminClient();

    // Сначала проверяем, существует ли поле is_admin
    // Пытаемся обновить поле is_admin
    const { error: updateError } = await adminClient
      .from("profiles")
      .update({ is_admin: isAdmin })
      .eq("id", userId);

    if (updateError) {
      // Если ошибка связана с отсутствием поля is_admin
      if (updateError.message?.includes('is_admin') || 
          updateError.message?.includes('column') ||
          updateError.message?.includes('schema cache')) {
        return NextResponse.json({ 
          error: "Поле is_admin не найдено в таблице profiles. Пожалуйста, выполните SQL-скрипт fix-add-is-admin-column.sql в Supabase.",
          details: updateError.message
        }, { status: 400 });
      }
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true,
      message: `Роль изменена на ${isAdmin ? "Админ" : "Пользователь"}`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Внутренняя ошибка сервера" }, { status: 500 });
  }
}

