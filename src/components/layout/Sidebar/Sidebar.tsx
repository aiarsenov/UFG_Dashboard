"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { analytics } from "@/data/analytics";
import { tools } from "@/data/tools";

import "./Sidebar.scss";

import AsideMenu from "@/assets/icons/aside-menu.svg";

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
