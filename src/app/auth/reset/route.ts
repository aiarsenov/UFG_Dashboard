import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  
  // Supabase передает токен в hash, но на сервере мы получаем его через query параметры
  // или через специальный формат ссылки
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const access_token = url.searchParams.get("access_token");

  // Если токен передан через hash, нужно обработать его на клиенте
  // Но мы можем попробовать обработать через verifyOtp если есть token_hash
  if (token_hash && type === "recovery") {
    const supabase = await createSupabaseServerClient();
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash,
        type: "recovery",
      });

      if (error || !data.session) {
        console.error("Password reset error:", error);
        return NextResponse.redirect(new URL("/auth/reset?error=invalid_or_expired", url.origin));
      }

      // Сессия установлена, редиректим на страницу сброса пароля
      return NextResponse.redirect(new URL("/auth/reset", url.origin));
    } catch (error) {
      console.error("Password reset error:", error);
      return NextResponse.redirect(new URL("/auth/reset?error=invalid_or_expired", url.origin));
    }
  }

  // Если нет токена, просто редиректим на страницу reset
  return NextResponse.redirect(new URL("/auth/reset", url.origin));
}

