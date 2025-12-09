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
    // Пытаемся получить is_admin, но если поля нет, используем только базовые поля
    let profiles: any[] = [];
    let profilesError: any = null;
    
    try {
      const result = await adminClient
        .from("profiles")
        .select("id, fio, email, banned, approved, is_admin");
      
      if (result.error) {
        // Если ошибка связана с отсутствием поля is_admin, пробуем без него
        if (result.error.message?.includes('is_admin') || result.error.message?.includes('column')) {
          const resultWithoutIsAdmin = await adminClient
            .from("profiles")
            .select("id, fio, email, banned, approved");
          
          if (resultWithoutIsAdmin.error) {
            profilesError = resultWithoutIsAdmin.error;
          } else {
            profiles = resultWithoutIsAdmin.data || [];
          }
        } else {
          profilesError = result.error;
        }
      } else {
        profiles = result.data || [];
      }
    } catch (err: any) {
      // Если ошибка при запросе с is_admin, пробуем без него
      try {
        const result = await adminClient
          .from("profiles")
          .select("id, fio, email, banned, approved");
        
        if (result.error) {
          profilesError = result.error;
        } else {
          profiles = result.data || [];
        }
      } catch (err2: any) {
        profilesError = err2;
      }
    }

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      return NextResponse.json({ 
        error: profilesError.message || "Ошибка загрузки профилей",
        details: profilesError 
      }, { status: 500 });
    }

    // Объединяем данные
    const users = authUsers.users.map((authUser) => {
      const profile = profiles?.find((p) => p.id === authUser.id);
      const userEmail = authUser.email || "";
      // Проверяем админа: либо в БД (is_admin), либо в переменных окружения
      // Если поле is_admin отсутствует в профиле, используем только проверку через email
      const isAdminUser = (profile?.is_admin === true) || WHITELIST_ADMIN_EMAILS.includes(userEmail);
      
      return {
        id: authUser.id,
        email: userEmail,
        fio: profile?.fio || null,
        banned: profile?.banned || false,
        approved: profile?.approved || false,
        isAdmin: isAdminUser,
        created_at: authUser.created_at,
      };
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Внутренняя ошибка сервера" }, { status: 500 });
  }
}

