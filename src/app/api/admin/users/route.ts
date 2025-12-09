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

export async function GET() {
  // Проверка доступа админа
  const { error: accessError } = await checkAdminAccess();
  if (accessError) {
    return NextResponse.json({ error: accessError }, { status: accessError === "Unauthorized" ? 401 : 403 });
  }

  try {
    const adminClient = createSupabaseAdminClient();

    // Получаем всех пользователей из auth.users
    const { data: authUsers, error: authError } = await adminClient.auth.admin.listUsers();

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // Получаем все профили
    const { data: profiles, error: profilesError } = await adminClient
      .from("profiles")
      .select("id, fio, email, banned, approved");

    if (profilesError) {
      return NextResponse.json({ error: profilesError.message }, { status: 500 });
    }

    // Объединяем данные
    const users = authUsers.users.map((authUser) => {
      const profile = profiles?.find((p) => p.id === authUser.id);
      const userEmail = authUser.email || "";
      return {
        id: authUser.id,
        email: userEmail,
        fio: profile?.fio || null,
        banned: profile?.banned || false,
        approved: profile?.approved || false,
        isAdmin: WHITELIST_ADMIN_EMAILS.includes(userEmail),
        created_at: authUser.created_at,
      };
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Внутренняя ошибка сервера" }, { status: 500 });
  }
}

