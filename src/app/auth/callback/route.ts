import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  
  if (error) {
    return NextResponse.redirect(new URL(`/sign-in?error=${error}`, url.origin));
  }
  
  if (!code) {
    return NextResponse.redirect(new URL("/sign-in?error=no_code", url.origin));
  }

  const supabase = await createSupabaseServerClient();
  const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  
  if (exchangeError) {
    console.error("Auth exchange error:", exchangeError);
    return NextResponse.redirect(new URL(`/sign-in?error=${encodeURIComponent(exchangeError.message)}`, url.origin));
  }

  if (!data.session) {
    return NextResponse.redirect(new URL("/sign-in?error=no_session", url.origin));
  }

  return NextResponse.redirect(new URL("/analytics/market-competitors", url.origin));
}


