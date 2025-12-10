import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";

export async function GET() {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        // Получаем профиль из таблицы profiles
        let profile: any = null;
        try {
            const result = await supabase
                .from("profiles")
                .select("fio, email, is_admin")
                .eq("id", user.id)
                .single();

            if (!result.error) {
                profile = result.data;
            } else {
                // Если ошибка связана с отсутствием поля is_admin, пробуем без него
                const resultWithoutIsAdmin = await supabase
                    .from("profiles")
                    .select("fio, email")
                    .eq("id", user.id)
                    .single();

                if (!resultWithoutIsAdmin.error) {
                    profile = resultWithoutIsAdmin.data;
                }
            }
        } catch (err) {
            console.error("Error fetching profile:", err);
        }

        const fio = profile?.fio || null;
        const email = profile?.email || user.email || null;

        // Проверяем админа: либо в БД (is_admin), либо через email
        const isAdminFromDB = profile?.is_admin === true;
        const isAdminFromEmail = isAdminEmail(email);
        const isAdmin = isAdminFromDB || isAdminFromEmail;

        // Генерируем инициалы из ФИО
        let initials = "ИИ";
        if (fio) {
            const parts = fio.trim().split(/\s+/);
            if (parts.length >= 2) {
                const firstInitial = parts[0][0]?.toUpperCase() || "";
                const secondInitial = parts[1][0]?.toUpperCase() || "";
                initials = `${firstInitial}${secondInitial}`;
            } else if (parts.length === 1) {
                initials = parts[0][0]?.toUpperCase() || "ИИ";
            }
        } else if (email) {
            // Если нет ФИО, используем первые буквы email
            const emailParts = email.split("@")[0];
            if (emailParts.length >= 2) {
                initials = emailParts.substring(0, 2).toUpperCase();
            } else {
                initials = emailParts[0]?.toUpperCase() || "ИИ";
            }
        }

        return NextResponse.json({
            userData: { fio, email },
            initials,
            isAdmin,
        });
    } catch (error) {
        console.error("Error in /api/user/profile:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
