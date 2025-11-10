"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { Header } from "@/components/layout/Header/Header";

type AppShellProps = {
    children: ReactNode;
    title?: string;
};

export function AppShell({ children, title }: AppShellProps) {
    return (
        <>
            <Header title={title} />

            <div className="page">
                <div className="container main-container">
                    <Sidebar />

                    <main className="main">{children}</main>
                </div>
            </div>
        </>
    );
}
