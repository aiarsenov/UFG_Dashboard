import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminEmails } from "@/lib/config";
import DashboardContent from "./DashboardContent";

const WHITELIST_ADMIN_EMAILS = getAdminEmails();

async function checkAdminAccess() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const userEmail = user.email;
  let isAdmin = userEmail && WHITELIST_ADMIN_EMAILS.includes(userEmail);
  
  // Если не админ по email, проверяем поле is_admin из БД
  if (!isAdmin && userEmail) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();
      
      isAdmin = profile?.is_admin === true;
    } catch (err) {
      // Если поле is_admin отсутствует, используем только проверку через email
      console.error("Error checking is_admin:", err);
    }
  }
  
  if (!isAdmin) {
    redirect("/");
  }

  return user;
}

export default async function DashboardPage() {
  await checkAdminAccess();

  return (
    <div className="min-h-screen bg-[#f0f2f5] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h1 className="text-2xl font-semibold mb-6">Дашборд - Управление пользователями</h1>
          <DashboardContent />
        </div>
      </div>
    </div>
  );
}
