"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [fio, setFio] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    if (password !== confirmPassword) {
      setStatus("Пароли не совпадают");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setStatus("Пароль должен быть не менее 6 символов");
      setLoading(false);
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          fio: fio,
        },
      },
    });

    if (error) {
      setStatus(`Ошибка: ${error.message}`);
      setLoading(false);
    } else {
      // Проверяем, нужно ли подтверждение email
      if (data.user && !data.session) {
        // Email требует подтверждения
        setStatus("Регистрация успешна! Проверьте почту и подтвердите email.");
        setLoading(false);
      } else if (data.session) {
        // Email уже подтвержден или подтверждение отключено
        setStatus("Регистрация успешна! Перенаправляем...");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1000);
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#24244a] p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold mb-4">Регистрация</h1>
        <label className="block text-sm">
          ФИО
          <input
            required
            type="text"
            value={fio}
            onChange={(e) => setFio(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="Иванов Иван Иванович"
            disabled={loading}
          />
        </label>
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
        <label className="block text-sm">
          Подтвердите пароль
          <input
            required
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="••••••••"
            disabled={loading}
          />
        </label>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Регистрация..." : "Зарегистрироваться"}
        </Button>
        {status && (
          <p className={`text-sm ${status.includes("Ошибка") ? "text-red-600" : "text-green-600"}`}>
            {status}
          </p>
        )}
        <div className="text-sm text-center">
          <p className="text-gray-600">
            Уже есть аккаунт?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

