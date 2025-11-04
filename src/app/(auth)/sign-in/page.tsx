"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Отправляем ссылку...");
    const supabase = createSupabaseBrowserClient();
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    if (error) setStatus(`Ошибка: ${error.message}`);
    else setStatus("Проверьте почту — мы отправили ссылку для входа.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#24244a] p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white rounded-xl p-6 space-y-4">
        <h1 className="text-lg font-semibold">Вход</h1>
        <label className="block text-sm">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="you@example.com"
          />
        </label>
        <Button type="submit" className="w-full">Получить ссылку</Button>
        {status && <p className="text-sm text-gray-600">{status}</p>}
      </form>
    </div>
  );
}


