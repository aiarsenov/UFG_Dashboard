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
    const { userId, banned } = body;

    if (!userId || typeof banned !== "boolean") {
      return NextResponse.json({ error: "Неверные параметры" }, { status: 400 });
    }

    const adminClient = createSupabaseAdminClient();

    // Обновляем статус блокировки в profiles
    const { error: updateError } = await adminClient
      .from("profiles")
      .update({ banned })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    // Если блокируем, также блокируем в auth.users через Admin API
    if (banned) {
      const { error: banError } = await adminClient.auth.admin.updateUserById(userId, {
        ban_duration: "876000h", // ~100 лет (фактически навсегда)
      });

      if (banError) {
        console.error("Error banning user:", banError);
      }
    } else {
      // Разблокируем
      const { error: unbanError } = await adminClient.auth.admin.updateUserById(userId, {
        ban_duration: "0s",
      });

      if (unbanError) {
        console.error("Error unbanning user:", unbanError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Внутренняя ошибка сервера" }, { status: 500 });
  }
}

