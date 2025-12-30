import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const type = url.searchParams.get("type");
  const token_hash = url.searchParams.get("token_hash");
  
  if (error) {
    return NextResponse.redirect(new URL(`/auth/login?error=${error}`, url.origin));
  }

  const supabase = await createSupabaseServerClient();

  // Если это восстановление пароля (recovery)
  if (type === "recovery") {
    // Supabase может передавать токен в разных форматах:
    // 1. Как code - нужно обменять через exchangeCodeForSession
    // 2. Как token_hash - нужно использовать verifyOtp
    
    if (code) {
      // Обмениваем code на сессию
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError || !data.session) {
        console.error("Password reset exchange error:", exchangeError);
        return NextResponse.redirect(new URL("/auth/reset?error=invalid_or_expired", url.origin));
      }

      // Сессия установлена, редиректим на страницу сброса пароля
      return NextResponse.redirect(new URL("/auth/reset", url.origin));
    } else if (token_hash) {
      // Используем verifyOtp для token_hash
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: token_hash,
        type: "recovery",
      });

      if (verifyError || !data.session) {
        console.error("Password reset verify error:", verifyError);
        return NextResponse.redirect(new URL("/auth/reset?error=invalid_or_expired", url.origin));
      }

      // Сессия установлена, редиректим на страницу сброса пароля
      return NextResponse.redirect(new URL("/auth/reset", url.origin));
    } else {
      // Если нет токена, редиректим на страницу восстановления с ошибкой
      return NextResponse.redirect(new URL("/auth/reset?error=no_token", url.origin));
    }
  }
  
  if (!code) {
    return NextResponse.redirect(new URL("/auth/login?error=no_code", url.origin));
  }

  const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  
  if (exchangeError) {
    console.error("Auth exchange error:", exchangeError);
    return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent(exchangeError.message)}`, url.origin));
  }

  if (!data.session) {
    return NextResponse.redirect(new URL("/auth/login?error=no_session", url.origin));
  }

  // Если это подтверждение email после регистрации, редиректим на главную
  if (type === "signup" || type === "email") {
    return NextResponse.redirect(new URL("/", url.origin));
  }

  // По умолчанию редиректим на главную
  return NextResponse.redirect(new URL("/", url.origin));
}


