"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    });

    if (error) {
      setStatus(`Ошибка: ${error.message}`);
      setLoading(false);
    } else {
      setStatus("Письмо с инструкциями отправлено на ваш email");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#24244a] p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold mb-4">Восстановление пароля</h1>
        <p className="text-sm text-gray-600 mb-4">
          Введите ваш email, и мы отправим ссылку для сброса пароля
        </p>
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
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Отправка..." : "Отправить"}
        </Button>
        {status && (
          <p className={`text-sm ${status.includes("Ошибка") ? "text-red-600" : "text-green-600"}`}>
            {status}
          </p>
        )}
        <div className="text-sm text-center">
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Вернуться к входу
          </Link>
        </div>
      </form>
    </div>
  );
}

