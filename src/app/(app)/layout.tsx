import { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";

export default async function AppLayout({ children }: { children: ReactNode }) {
  // Проверка авторизации теперь в middleware
  return <AppShell title="Наименование открытого дашборда">{children}</AppShell>;
}


