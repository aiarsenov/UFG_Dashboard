import { ReactNode } from "react";
import { AppShellClient } from "@/components/layout/AppShellClient";
import { HeaderWithTitle } from "@/components/layout/Header/HeaderWithTitle";

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <HeaderWithTitle />
            <AppShellClient>{children}</AppShellClient>
        </>
    );
}
