import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token_hash, access_token, refresh_token } = body;

    if (!token_hash && !access_token) {
      return NextResponse.json(
        { error: "Токен не предоставлен" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // Если есть access_token, устанавливаем сессию напрямую
    if (access_token && refresh_token) {
      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error || !data.session) {
        return NextResponse.json(
          { error: "Недействительный токен или токен истек" },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true, session: data.session });
    }

    // Если есть token_hash, используем verifyOtp
    if (token_hash) {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash,
        type: "recovery",
      });

      if (error || !data.session) {
        return NextResponse.json(
          { error: "Недействительный токен или токен истек" },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true, session: data.session });
    }

    return NextResponse.json(
      { error: "Неверный формат токена" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}


