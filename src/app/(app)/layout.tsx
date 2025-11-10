"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";

import { analytics } from "@/data/analytics";
import { tools } from "@/data/tools";

export default function AppLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const allItems = [...analytics, ...tools];

    const currentItem = allItems.find((item) => pathname.startsWith(item.href));

    const title = currentItem ? currentItem.label : "";

    return <AppShell title={title}>{children}</AppShell>;
}
