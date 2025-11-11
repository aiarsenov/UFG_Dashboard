"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import "./Subnav.scss";

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
        <div className="tabs">
            <div className="tabs__list">
                {items.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "tabs__list-item",
                                active && "active"
                            )}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
