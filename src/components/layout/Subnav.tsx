"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type SubnavItem = { href: string; label: string };

const getSubnavItems = (basePath: string): SubnavItem[] => [
    { href: basePath, label: "Динамика" },
    { href: `${basePath}/compare`, label: "Сравнение" },
    { href: `${basePath}/details`, label: "Детализация" },
];

export function Subnav() {
    const pathname = usePathname();

    // Определяем базовый путь для текущей страницы аналитики
    const analyticsPaths = [
        "/analytics/key-metrics",
        "/analytics/scenario-analysis",
        "/analytics/market-competitors",
        "/analytics/sales-profit",
        "/analytics/sales-funnel",
        "/analytics/ads-efficiency",
        "/analytics/abc-xyz",
    ];

    const currentBasePath = analyticsPaths.find((path) =>
        pathname?.startsWith(path)
    );

    if (!currentBasePath) return null;

    const items = getSubnavItems(currentBasePath);

    return (
        <div className="bg-white px-6">
            <div className="flex gap-6 text-sm">
                {items.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative py-4 text-[#6b7280] hover:text-[#111]",
                                active && "text-[#111]"
                            )}
                        >
                            {item.label}
                            {active && (
                                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff6a2b]" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
