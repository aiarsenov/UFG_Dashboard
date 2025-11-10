"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    LineChart,
    BarChartBig,
    ShoppingCart,
    Zap,
    ClipboardList,
    TrendingUp,
    Grid3X3,
    Calculator,
    Boxes,
    Eye,
} from "lucide-react";

import { cn } from "@/lib/utils";

import "./Sidebar.scss";

type NavItem = {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
};

const analytics: NavItem[] = [
    {
        href: "/analytics/key-metrics",
        label: "Ключевые показатели",
        icon: LineChart,
    },
    {
        href: "/analytics/scenario-analysis",
        label: "Сценарный анализ",
        icon: BarChartBig,
    },
    {
        href: "/analytics/market-competitors",
        label: "Рынок и конкуренты",
        icon: TrendingUp,
    },
    {
        href: "/analytics/sales-profit",
        label: "Продажи и прибыль",
        icon: ShoppingCart,
    },
    {
        href: "/analytics/sales-funnel",
        label: "Воронка продаж",
        icon: ClipboardList,
    },
    {
        href: "/analytics/ads-efficiency",
        label: "Эффективность рекламы",
        icon: Zap,
    },
    { href: "/analytics/abc-xyz", label: "ABC / XYZ", icon: Grid3X3 },
];

const tools: NavItem[] = [
    {
        href: "/tools/unit-economics",
        label: "Юнит-экономика",
        icon: Calculator,
    },
    {
        href: "/tools/supply-planning",
        label: "Планирование поставок",
        icon: Boxes,
    },
    { href: "/tools/forecasting", label: "Прогнозирование", icon: Eye },
];

export function Sidebar() {
    const pathname = usePathname();

    const [menuState, setMenuState] = useState("open");

    return (
        <aside className={`aside ${menuState}`}>
            <nav className="aside__nav">
                <div className="aside__block">
                    <div className="aside__title">Аналитика</div>

                    <ul className="aside__list">
                        {analytics.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "aside__list-item",
                                        pathname?.startsWith(item.href)
                                            ? "active"
                                            : ""
                                    )}
                                >
                                    <item.icon className="aside__icon" />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="aside__block">
                    <div className="aside__title">Инструменты</div>

                    <ul className="aside__list">
                        {tools.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "aside__list-item",
                                        pathname?.startsWith(item.href)
                                            ? "text-[#ff6a2b]"
                                            : "text-[#222]"
                                    )}
                                >
                                    <item.icon className="aside__icon" />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            <div className="aside__footer">
                <button
                    className="aside__open-button"
                    title={
                        menuState == "open" ? "Свернуть меню" : "Раскрыть меню"
                    }
                    onClick={() =>
                        setMenuState((prev) =>
                            prev === "open" ? "minimized" : "open"
                        )
                    }
                >
                    <div className="aside__icon">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M7.97 2v20M14.97 9.44L12.41 12l2.56 2.56"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9z"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </div>
                    <span>Свернуть</span>
                </button>
            </div>
        </aside>
    );
}
