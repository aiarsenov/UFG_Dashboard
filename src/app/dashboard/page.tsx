import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getUserProfile() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("fio, email")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
  }

  return {
    user,
    profile: profile || { fio: null, email: user.email },
  };
}

export default async function DashboardPage() {
  const { user, profile } = await getUserProfile();

  return (
    <div className="min-h-screen bg-[#f0f2f5] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h1 className="text-2xl font-semibold mb-6">Дашборд</h1>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">ФИО</p>
              <p className="text-lg font-medium">{profile.fio || "Не указано"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-medium">{profile.email || user.email}</p>
            </div>
          </div>
          <div className="mt-6 flex gap-4">
            <Link href="/profile">
              <Button>Редактировать профиль</Button>
            </Link>
            <form action="/api/auth/signout" method="post">
              <Button type="submit" variant="outline">
                Выйти
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

