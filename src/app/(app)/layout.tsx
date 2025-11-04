import { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <AppShell title="Наименование открытого дашборда">{children}</AppShell>;
}


