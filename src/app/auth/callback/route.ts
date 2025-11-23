import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const type = url.searchParams.get("type");
  
  if (error) {
    return NextResponse.redirect(new URL(`/auth/login?error=${error}`, url.origin));
  }
  
  if (!code) {
    return NextResponse.redirect(new URL("/auth/login?error=no_code", url.origin));
  }

  const supabase = await createSupabaseServerClient();
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


