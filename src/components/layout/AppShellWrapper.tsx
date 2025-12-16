import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { HeaderServer } from "@/components/layout/Header/HeaderServer";
import { AppShellClient } from "./AppShellClient";

type AppShellWrapperProps = {
    children: ReactNode;
    title?: string;
};

export function AppShellWrapper({ children, title }: AppShellWrapperProps) {
    return (
        <>
            <HeaderServer title={title} />

            <div className="page">
                <div className="container main-container">
                    <Sidebar />

                    <main className="main">
                        <AppShellClient>{children}</AppShellClient>
                    </main>
                </div>
            </div>
        </>
    );
}
