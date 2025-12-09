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
    const { fio, email, password } = body;

    if (!fio || !email || !password) {
      return NextResponse.json({ error: "Все поля обязательны" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Пароль должен быть не менее 6 символов" }, { status: 400 });
    }

    const adminClient = createSupabaseAdminClient();

    // Создаем пользователя через Admin API
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Автоматически подтверждаем email
      user_metadata: {
        fio: fio,
      },
    });

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    if (!newUser.user) {
      return NextResponse.json({ error: "Не удалось создать пользователя" }, { status: 500 });
    }

    // Создаем запись в profiles
    const { error: profileError } = await adminClient
      .from("profiles")
      .insert({
        id: newUser.user.id,
        email: email,
        fio: fio,
      });

    if (profileError) {
      // Если триггер handle_new_user уже создал профиль, это нормально
      console.log("Profile creation result:", profileError);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.user.id,
        email: newUser.user.email,
        fio: fio,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Внутренняя ошибка сервера" }, { status: 500 });
  }
}

