import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getAdminEmails } from "@/lib/config";

const WHITELIST_ADMIN_EMAILS = getAdminEmails();

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                    supabaseResponse = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    supabaseResponse.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                },
                remove(name: string, options: any) {
                    request.cookies.set({
                        name,
                        value: "",
                        ...options,
                    });
                    supabaseResponse = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    supabaseResponse.cookies.set({
                        name,
                        value: "",
                        ...options,
                    });
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Если пользователь залогинен, редиректим с /auth/* на главную
    if (user && pathname.startsWith("/auth/")) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Если пользователь не залогинен, редиректим с защищенных маршрутов на /auth/login
    if (!user && (pathname.startsWith("/dashboard") || pathname.startsWith("/profile") || pathname.startsWith("/admin"))) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Проверка доступа к dashboard - только для админа
    if (user && pathname.startsWith("/dashboard")) {
        const userEmail = user.email;
        if (!userEmail || !WHITELIST_ADMIN_EMAILS.includes(userEmail)) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // Проверка доступа к админке
    if (user && pathname.startsWith("/admin")) {
        const userEmail = user.email;
        if (!userEmail || !WHITELIST_ADMIN_EMAILS.includes(userEmail)) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // Защита существующих маршрутов analytics и tools
    if (
        !user &&
        (pathname.startsWith("/analytics") || pathname.startsWith("/tools"))
    ) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Проверка одобрения пользователя для всех защищенных маршрутов (кроме админов)
    if (user && !pathname.startsWith("/auth/") && !pathname.startsWith("/dashboard") && !pathname.startsWith("/admin")) {
        const userEmail = user.email;
        const isAdmin = userEmail && WHITELIST_ADMIN_EMAILS.includes(userEmail);
        
        if (!isAdmin) {
            const { data: profile } = await supabase
                .from("profiles")
                .select("approved")
                .eq("id", user.id)
                .single();

            if (!profile?.approved) {
                // Пользователь не одобрен - редиректим на страницу ожидания
                if (pathname !== "/waiting-approval") {
                    return NextResponse.redirect(new URL("/waiting-approval", request.url));
                }
            }
        }
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
