"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isAdminEmail } from "@/lib/admin";
import Link from "next/link";

export default function WaitingApprovalPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function checkApproval() {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Админы всегда могут войти
        const isAdmin = isAdminEmail(user.email);
        
        if (isAdmin) {
          router.push("/");
          router.refresh();
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("approved")
          .eq("id", user.id)
          .single();

        if (profile?.approved) {
          router.push("/");
          router.refresh();
        } else {
          setChecked(true);
        }
      } else {
        router.push("/auth/login");
      }
    }

    checkApproval();
    // Проверяем каждые 5 секунд
    const interval = setInterval(checkApproval, 5000);
    return () => clearInterval(interval);
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#24244a]">
        <div className="text-white">Проверка статуса...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#24244a] p-6">
      <div className="w-full max-w-md bg-white rounded-xl p-6 text-center space-y-4">
        <h1 className="text-2xl font-semibold">Ожидание одобрения</h1>
        <p className="text-gray-600">
          Вашу регистрацию должен одобрить администратор. Пожалуйста, подождите.
        </p>
        <p className="text-sm text-gray-500">
          Вы получите уведомление на email после одобрения.
        </p>
        <div className="pt-4">
          <Link href="/auth/login" className="text-blue-600 hover:underline text-sm">
            Вернуться к входу
          </Link>
        </div>
      </div>
    </div>
  );
}

