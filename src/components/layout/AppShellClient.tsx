"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";

type AppShellClientProps = {
    children: ReactNode;
};

export function AppShellClient({ children }: AppShellClientProps) {
    return (
        <div className="page">
            <div className="container main-container">
                <Sidebar />

                <main className="main">{children}</main>
            </div>
        </div>
    );
}
