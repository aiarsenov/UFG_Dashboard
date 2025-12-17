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
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "Не указан ID пользователя" }, { status: 400 });
    }

    const adminClient = createSupabaseAdminClient();

    // Удаляем профиль из таблицы profiles
    const { error: profileError } = await adminClient
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (profileError) {
      console.error("Error deleting profile:", profileError);
      // Продолжаем даже если профиль не найден
    }

    // Удаляем пользователя из auth.users через Admin API
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message || "Ошибка при удалении пользователя" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Пользователь успешно удалён" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
