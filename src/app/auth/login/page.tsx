"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isAdminEmail } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // При первой загрузке пробуем подставить сохранённый email
  useEffect(() => {
    try {
      const savedEmail = window.localStorage.getItem("ufg-remember-email");
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch {
      // localStorage может быть недоступен (SSR / приватный режим) — просто игнорируем
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatus(`Ошибка: ${error.message}`);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Обновляем localStorage в зависимости от флага "Запомнить меня"
      try {
        if (rememberMe) {
          window.localStorage.setItem("ufg-remember-email", email);
        } else {
          window.localStorage.removeItem("ufg-remember-email");
        }
      } catch {
        // Ничего страшного, если localStorage недоступен
      }

      // Проверяем, является ли пользователь админом
      const isAdmin = isAdminEmail(data.user.email);

      // Если не админ, проверяем одобрение
      if (!isAdmin) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("approved")
          .eq("id", data.user.id)
          .single();

        if (!profile?.approved) {
          await supabase.auth.signOut();
          setStatus("Вашу регистрацию должен одобрить администратор. Пожалуйста, подождите.");
          setLoading(false);
          return;
        }
      }
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#24244a] p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold mb-4">Вход</h1>
        <label className="block text-sm">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="you@example.com"
            disabled={loading}
          />
        </label>
        <label className="block text-sm">
          Пароль
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="••••••••"
            disabled={loading}
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={loading}
          />
          <span>Запомнить меня на этом устройстве</span>
        </label>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Вход..." : "Войти"}
        </Button>
        {status && (
          <p className={`text-sm ${status.includes("Ошибка") ? "text-red-600" : "text-gray-600"}`}>
            {status}
          </p>
        )}
        <div className="text-sm text-center space-y-2">
          <Link href="/auth/forgot" className="text-blue-600 hover:underline">
            Забыли пароль?
          </Link>
          <p className="text-gray-600">
            Нет аккаунта?{" "}
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

