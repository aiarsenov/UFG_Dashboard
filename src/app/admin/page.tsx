import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminEmails } from "@/lib/config";
import AdminContent from "./AdminContent";

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
  if (!userEmail || !WHITELIST_ADMIN_EMAILS.includes(userEmail)) {
    redirect("/dashboard");
  }

  return user;
}

export default async function AdminPage() {
  await checkAdminAccess();

  return (
    <div className="min-h-screen bg-[#f0f2f5] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h1 className="text-2xl font-semibold mb-6">Админ-панель</h1>
          <AdminContent />
        </div>
      </div>
    </div>
  );
}

