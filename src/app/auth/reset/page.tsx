"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    // Проверяем наличие ошибки в URL
    const error = searchParams.get("error");
    if (error) {
      if (error === "invalid_link") {
        setStatus("Неверная ссылка для сброса пароля");
      } else if (error === "invalid_or_expired") {
        setStatus("Ссылка недействительна или истекла. Запросите новую ссылку.");
      }
      return;
    }

    // Проверяем, есть ли активная сессия
    async function checkSession() {
      const supabase = createSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsValidSession(true);
      } else {
        // Проверяем hash в URL (Supabase передает токен в hash)
        const hash = window.location.hash;
        if (hash) {
          // Парсим hash для получения токена
          const params = new URLSearchParams(hash.substring(1));
          const access_token = params.get("access_token");
          const token_hash = params.get("token_hash");
          const type = params.get("type");
          
          if (type === "recovery") {
            // Если есть access_token, используем его для установки сессии
            if (access_token) {
              // Устанавливаем сессию через setSession
              const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                access_token,
                refresh_token: params.get("refresh_token") || "",
              });
              
              if (sessionError || !sessionData.session) {
                // Если setSession не сработал, пробуем verifyOtp с token_hash
                if (token_hash) {
                  const { data, error: verifyError } = await supabase.auth.verifyOtp({
                    token_hash,
                    type: "recovery",
                  });
                  
                  if (verifyError || !data.session) {
                    setStatus("Ссылка недействительна или истекла. Запросите новую ссылку.");
                  } else {
                    setIsValidSession(true);
                    window.history.replaceState(null, "", window.location.pathname);
                  }
                } else {
                  setStatus("Ссылка недействительна или истекла. Запросите новую ссылку.");
                }
              } else {
                setIsValidSession(true);
                window.history.replaceState(null, "", window.location.pathname);
              }
            } else if (token_hash) {
              // Пробуем verifyOtp с token_hash
              const { data, error: verifyError } = await supabase.auth.verifyOtp({
                token_hash,
                type: "recovery",
              });
              
              if (verifyError || !data.session) {
                setStatus("Ссылка недействительна или истекла. Запросите новую ссылку.");
              } else {
                setIsValidSession(true);
                window.history.replaceState(null, "", window.location.pathname);
              }
            } else if (!error) {
              setStatus("Ссылка для сброса пароля не найдена. Запросите новую ссылку.");
            }
          } else if (!error) {
            setStatus("Ссылка для сброса пароля не найдена. Запросите новую ссылку.");
          }
        } else if (!error) {
          setStatus("Ссылка для сброса пароля не найдена. Запросите новую ссылку.");
        }
      }
    }
    checkSession();
  }, [searchParams]);

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
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setStatus(`Ошибка: ${error.message}`);
      setLoading(false);
    } else {
      setStatus("Пароль успешно изменен! Перенаправляем...");
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1000);
    }
  }

  if (!isValidSession && !searchParams.get("error")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#24244a] p-6">
        <div className="w-full max-w-sm bg-white rounded-xl p-6 space-y-4">
          <h1 className="text-2xl font-semibold mb-4">Проверка ссылки...</h1>
          <p className="text-sm text-gray-600">Обрабатываем ссылку для сброса пароля...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#24244a] p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold mb-4">Новый пароль</h1>
        {!isValidSession && (
          <p className="text-sm text-red-600 mb-4">
            Ссылка недействительна или истекла. Запросите новую ссылку для сброса пароля.
          </p>
        )}
        <label className="block text-sm">
          Новый пароль
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="••••••••"
            disabled={loading || !isValidSession}
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
            disabled={loading || !isValidSession}
          />
        </label>
        <Button type="submit" className="w-full" disabled={loading || !isValidSession}>
          {loading ? "Сохранение..." : "Сохранить пароль"}
        </Button>
        {status && (
          <p className={`text-sm ${status.includes("Ошибка") || status.includes("недействительна") || status.includes("истекла") ? "text-red-600" : "text-green-600"}`}>
            {status}
          </p>
        )}
        {!isValidSession && (
          <div className="text-sm text-center">
            <Link href="/auth/forgot" className="text-blue-600 hover:underline">
              Запросить новую ссылку
            </Link>
          </div>
        )}
      </form>
    </div>
  );
}

export default function ResetPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#24244a]">Загрузка...</div>}>
      <ResetForm />
    </Suspense>
  );
}

