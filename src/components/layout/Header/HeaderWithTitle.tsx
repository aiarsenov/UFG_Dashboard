"use client";

import { usePathname } from "next/navigation";
import { HeaderClient } from "./HeaderClient";
import { analytics } from "@/data/analytics";
import { tools } from "@/data/tools";

export function HeaderWithTitle() {
    const pathname = usePathname();
    const allItems = [...analytics, ...tools];
    const currentItem = allItems.find((item) => pathname.startsWith(item.href));
    const title = currentItem ? currentItem.label : "";

    return <HeaderClient title={title} />;
}

