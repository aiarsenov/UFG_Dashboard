"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import "./Sidebar.scss";

import AsideMenu from "@/assets/icons/aside-menu.svg";
import BarChart from "@/assets/icons/bar-chart.svg";
import Boxes from "@/assets/icons/boxes.svg";
import Calculator from "@/assets/icons/calculator.svg";
import ClipboardList from "@/assets/icons/clipboard-list.svg";
import Eye from "@/assets/icons/eye.svg";
import LineChart from "@/assets/icons/line-chart.svg";
import Note from "@/assets/icons/note.svg";
import ShoppingCart from "@/assets/icons/shopping-cart.svg";
import TrendingUp from "@/assets/icons/trending-up.svg";
import Zap from "@/assets/icons/zap.svg";

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
        icon: BarChart,
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
    { href: "/analytics/abc-xyz", label: "ABC / XYZ", icon: Note },
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
                        <AsideMenu className="aside__icon" />
                    </div>
                    <span>Свернуть</span>
                </button>
            </div>
        </aside>
    );
}
