"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProfileFormProps {
  initialFio: string;
  userEmail: string;
}

export default function ProfileForm({ initialFio, userEmail }: ProfileFormProps) {
  const router = useRouter();
  const [fio, setFio] = useState(initialFio);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const supabase = createSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("Ошибка: пользователь не найден");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ fio: fio })
      .eq("id", user.id);

    if (error) {
      setStatus(`Ошибка: ${error.message}`);
      setLoading(false);
    } else {
      setStatus("Профиль успешно обновлен!");
      setLoading(false);
      router.refresh();
    }
  }

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Email</label>
        <input
          type="email"
          value={userEmail}
          disabled
          className="w-full rounded-md border px-3 py-2 bg-gray-100 text-gray-600"
        />
        <p className="text-xs text-gray-500 mt-1">Email нельзя изменить</p>
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">ФИО</label>
        <input
          required
          type="text"
          value={fio}
          onChange={(e) => setFio(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
          placeholder="Иванов Иван Иванович"
          disabled={loading}
        />
      </div>
      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Сохранение..." : "Сохранить"}
        </Button>
        <Button type="button" variant="outline" onClick={handleSignOut}>
          Выйти
        </Button>
      </div>
      {status && (
        <p className={`text-sm ${status.includes("Ошибка") ? "text-red-600" : "text-green-600"}`}>
          {status}
        </p>
      )}
      <div className="mt-4">
        <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
          ← Вернуться к дашборду
        </Link>
      </div>
    </form>
  );
}

