"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Subnav } from "@/components/layout/Subnav";

type AppShellProps = {
  children: ReactNode;
  title?: string;
};

export function AppShell({ children, title }: AppShellProps) {
  return (
    <div className="min-h-screen w-full bg-[#24244a] text-white">
      <Header title={title} />
      <Subnav />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 bg-[#f0f2f5] min-h-screen">{children}</main>
      </div>
    </div>
  );
}


