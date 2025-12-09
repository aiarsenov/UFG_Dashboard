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

    // Обновляем поле is_admin в таблице profiles
    const { error: updateError } = await adminClient
      .from("profiles")
      .update({ is_admin: isAdmin })
      .eq("id", userId);

    if (updateError) {
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

