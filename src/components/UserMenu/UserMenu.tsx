"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { LogOut, LayoutDashboard } from "lucide-react";
import { isAdminEmail } from "@/lib/admin";

import "./UserMenu.scss";

type UserData = {
    userData: { fio: string | null; email: string | null };
    initials: string;
    isAdmin: boolean;
};

async function fetchUserDataFromAPI(): Promise<UserData | null> {
    try {
        const response = await fetch("/api/user/profile", {
            cache: "no-store",
            credentials: "include",
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching user data from API:", error);
        return null;
    }
}

async function fetchUserDataFromClient(): Promise<UserData> {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return {
            userData: { fio: null, email: null },
            initials: "ИИ",
            isAdmin: false,
        };
    }

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
    const isAdminFromDB = profile?.is_admin === true;
    const isAdminFromEmail = isAdminEmail(email);
    const isAdmin = isAdminFromDB || isAdminFromEmail;

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
        const emailParts = email.split("@")[0];
        if (emailParts.length >= 2) {
            initials = emailParts.substring(0, 2).toUpperCase();
        } else {
            initials = emailParts[0]?.toUpperCase() || "ИИ";
        }
    }

    return {
        userData: { fio, email },
        initials,
        isAdmin,
    };
}

export default function UserMenu() {
    const router = useRouter();
    const [userData, setUserData] = useState<{ fio: string | null; email: string | null } | null>(null);
    const [initials, setInitials] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadUserData() {
            setIsLoading(true);
            // Сначала пытаемся получить данные из API (быстрее, т.к. на сервере)
            const apiData = await fetchUserDataFromAPI();

            if (apiData) {
                setUserData(apiData.userData);
                setInitials(apiData.initials);
                setIsAdmin(apiData.isAdmin);
            } else {
                // Fallback к клиентскому способу
                const clientData = await fetchUserDataFromClient();
                setUserData(clientData.userData);
                setInitials(clientData.initials);
                setIsAdmin(clientData.isAdmin);
            }
            setIsLoading(false);
        }

        loadUserData();
    }, []);

    async function handleSignOut() {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
        router.push("/auth/login");
        router.refresh();
    }

    // Показываем компонент только когда данные загружены, чтобы избежать мерцания
    // Используем минимальный скелетон для предотвращения сдвига макета
    if (isLoading || initials === null) {
        return (
            <div className="user-menu" style={{ opacity: 0, pointerEvents: 'none' }}>
                <Avatar className="user-menu__avatar">
                    <AvatarFallback>ИИ</AvatarFallback>
                </Avatar>
                <div className="user-menu__text">
                    <div>Пользователь</div>
                    <span>email@example.com</span>
                </div>
            </div>
        );
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

            {isAdmin && (
                <button
                    onClick={() => router.push("/dashboard")}
                    className="user-menu__dashboard"
                    aria-label="Перейти в панель управления"
                    title="Панель управления"
                >
                    <LayoutDashboard size={20} />
                </button>
            )}

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
