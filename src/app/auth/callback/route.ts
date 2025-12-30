import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const type = url.searchParams.get("type");
  const token_hash = url.searchParams.get("token_hash");
  const token = url.searchParams.get("token"); // PKCE token из Supabase verify URL

  // Используем переменную окружения или определяем origin из заголовков
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    const forwardedHost = request.headers.get("x-forwarded-host");
    if (forwardedHost) {
      siteUrl = `https://${forwardedHost}`;
    } else {
      // Если это localhost в URL, используем production URL по умолчанию
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        siteUrl = 'https://chain.bizan.pro';
      } else {
        siteUrl = url.origin;
      }
    }
  }

  // Логируем все параметры для отладки
  console.log("Callback received:", {
    code: code ? "present" : "missing",
    token: token ? "present" : "missing",
    token_hash: token_hash ? "present" : "missing",
    type,
    error,
    fullUrl: url.toString(),
    siteUrl,
    origin: url.origin,
    forwardedHost: request.headers.get("x-forwarded-host")
  });

  const supabase = await createSupabaseServerClient();

  // Если есть ошибка, но это recovery и уже была успешная попытка, игнорируем
  if (error) {
    // Если это recovery и ошибка access_denied, возможно это повторный запрос после успешного обмена
    // Проверяем, есть ли уже активная сессия
    if (type === "recovery" && error === "access_denied") {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("Session exists despite error, redirecting to reset page", {
          userId: session.user?.id,
          email: session.user?.email
        });
        return NextResponse.redirect(new URL("/auth/reset", siteUrl));
      }
    }
    console.log("Redirecting to login with error:", error);
    return NextResponse.redirect(new URL(`/auth/login?error=${error}`, siteUrl));
  }

  // Если это восстановление пароля (recovery)
  if (type === "recovery") {
    console.log("=== RECOVERY CALLBACK START ===");
    console.log("URL params:", { code, token, token_hash, type, error });

    // Supabase может передавать токен в разных форматах:
    // 1. Как code - нужно обменять через exchangeCodeForSession
    // 2. Как token (PKCE) - нужно обменять через exchangeCodeForSession
    // 3. Как token_hash - нужно использовать verifyOtp (НО ЭТО УСТАРЕВШИЙ МЕТОД)

    // Используем code или token (PKCE токен работает как code)
    const recoveryCode = code || token;

    if (recoveryCode) {
      console.log("Using exchangeCodeForSession with:", recoveryCode.substring(0, 20) + "...");
      
      // Для PKCE токенов нужен code verifier, который хранится в браузере
      // Если это PKCE токен (начинается с pkce_ или это code без verifier), 
      // редиректим на reset page, где клиент обработает токен
      if (token && token.startsWith('pkce_')) {
        console.log("PKCE token detected, redirecting to reset page for client-side handling");
        return NextResponse.redirect(new URL(`/auth/reset?code=${recoveryCode}&type=recovery`, siteUrl));
      }
      
      // Обмениваем code/token на сессию
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(recoveryCode);

      if (exchangeError) {
        console.error("Password reset exchange error:", {
          message: exchangeError.message,
          status: exchangeError.status,
          code: exchangeError.code
        });
        
        // Если ошибка связана с PKCE (нужен code verifier), редиректим на reset page
        if (exchangeError.message?.includes('code verifier') || exchangeError.code === 'validation_failed') {
          console.log("PKCE code verifier required, redirecting to reset page");
          return NextResponse.redirect(new URL(`/auth/reset?code=${recoveryCode}&type=recovery`, siteUrl));
        }
        
        return NextResponse.redirect(new URL("/auth/reset?error=invalid_or_expired", siteUrl));
      }

      if (!data.session) {
        console.error("Password reset: No session after exchange");
        return NextResponse.redirect(new URL("/auth/reset?error=invalid_or_expired", siteUrl));
      }

      console.log("Password reset: Session established successfully", {
        userId: data.session.user?.id,
        email: data.session.user?.email
      });

      // Cookies должны быть установлены автоматически через createSupabaseServerClient
      // Создаем response с редиректом - cookies уже установлены через cookieStore
      const redirectResponse = NextResponse.redirect(new URL("/auth/reset", siteUrl));

      // Сессия установлена, редиректим на страницу сброса пароля
      return redirectResponse;
    } else if (token_hash) {
      console.log("WARNING: Using deprecated verifyOtp with token_hash");
      console.log("Token hash:", token_hash.substring(0, 20) + "...");
      // Используем verifyOtp для token_hash (устаревший метод, может не работать)
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: token_hash,
        type: "recovery",
      });

      if (verifyError) {
        console.error("Password reset verify error:", {
          message: verifyError.message,
          status: verifyError.status,
          code: verifyError.code
        });
        return NextResponse.redirect(new URL("/auth/reset?error=invalid_or_expired", siteUrl));
      }

      if (!data.session) {
        console.error("Password reset: No session after verifyOtp");
        return NextResponse.redirect(new URL("/auth/reset?error=invalid_or_expired", siteUrl));
      }

      console.log("Password reset: Session established successfully via verifyOtp");
      // Сессия установлена, редиректим на страницу сброса пароля
      return NextResponse.redirect(new URL("/auth/reset", siteUrl));
    } else {
      // Если нет токена, редиректим на страницу восстановления с ошибкой
      console.error("Password reset: No token provided (neither code nor token_hash)");
      return NextResponse.redirect(new URL("/auth/reset?error=no_token", siteUrl));
    }
  }

  if (!code) {
    return NextResponse.redirect(new URL("/auth/login?error=no_code", siteUrl));
  }

  const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("Auth exchange error:", exchangeError);
    return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent(exchangeError.message)}`, siteUrl));
  }

  if (!data.session) {
    return NextResponse.redirect(new URL("/auth/login?error=no_session", siteUrl));
  }

  // Если это подтверждение email после регистрации, редиректим на главную
  if (type === "signup" || type === "email") {
    return NextResponse.redirect(new URL("/", siteUrl));
  }

  // По умолчанию редиректим на главную
  return NextResponse.redirect(new URL("/", siteUrl));
}


