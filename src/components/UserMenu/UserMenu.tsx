"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

import "./UserMenu.scss";

export default function UserMenu() {
    const router = useRouter();
    const [userData, setUserData] = useState<{ fio: string | null; email: string | null } | null>(null);
    const [initials, setInitials] = useState("ИИ");

    useEffect(() => {
        async function fetchUserData() {
            const supabase = createSupabaseBrowserClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Получаем профиль из таблицы profiles
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("fio, email")
                    .eq("id", user.id)
                    .single();

                const fio = profile?.fio || null;
                const email = profile?.email || user.email || null;

                setUserData({ fio, email });

                // Генерируем инициалы из ФИО
                if (fio) {
                    const parts = fio.trim().split(/\s+/);
                    if (parts.length >= 2) {
                        const firstInitial = parts[0][0]?.toUpperCase() || "";
                        const secondInitial = parts[1][0]?.toUpperCase() || "";
                        setInitials(`${firstInitial}${secondInitial}`);
                    } else if (parts.length === 1) {
                        setInitials(parts[0][0]?.toUpperCase() || "ИИ");
                    }
                } else if (email) {
                    // Если нет ФИО, используем первые буквы email
                    const emailParts = email.split("@")[0];
                    if (emailParts.length >= 2) {
                        setInitials(emailParts.substring(0, 2).toUpperCase());
                    } else {
                        setInitials(emailParts[0]?.toUpperCase() || "ИИ");
                    }
                }
            }
        }

        fetchUserData();
    }, []);

    async function handleSignOut() {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
        router.push("/auth/login");
        router.refresh();
    }

    return (
        <div className="user-menu">
            <Avatar className="user-menu__avatar">
                <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div className="user-menu__text">
                <div>{userData?.fio || "Пользователь"}</div>
                <span>{userData?.email || "email@example.com"}</span>
            </div>

            <button
                onClick={handleSignOut}
                className="user-menu__logout"
                aria-label="Выйти из учетной записи"
                title="Выйти"
            >
                <LogOut size={20} />
            </button>
        </div>
    );
}
