import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ProfileForm from "./ProfileForm";

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

export default async function ProfilePage() {
  const { user, profile } = await getUserProfile();

  return (
    <div className="min-h-screen bg-[#f0f2f5] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h1 className="text-2xl font-semibold mb-6">Профиль</h1>
          <ProfileForm initialFio={profile.fio || ""} userEmail={profile.email || user.email || ""} />
        </div>
      </div>
    </div>
  );
}



