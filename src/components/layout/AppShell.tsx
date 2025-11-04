"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

type AppShellProps = {
  children: ReactNode;
  title?: string;
};

export function AppShell({ children, title }: AppShellProps) {
  return (
    <div className="min-h-screen w-full bg-[#24244a] text-white">
      <Header title={title} />
      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar />
        <main className="flex-1 bg-[#f0f2f5] rounded-tl-2xl">{children}</main>
      </div>
    </div>
  );
}


