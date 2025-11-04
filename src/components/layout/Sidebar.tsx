"use client";

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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const analytics: NavItem[] = [
  { href: "/analytics/key-metrics", label: "Ключевые показатели", icon: LineChart },
  { href: "/analytics/scenario-analysis", label: "Сценарный анализ", icon: BarChartBig },
  { href: "/analytics/market-competitors", label: "Рынок и конкуренты", icon: TrendingUp },
  { href: "/analytics/sales-profit", label: "Продажи и прибыль", icon: ShoppingCart },
  { href: "/analytics/sales-funnel", label: "Воронка продаж", icon: ClipboardList },
  { href: "/analytics/ads-efficiency", label: "Эффективность рекламы", icon: Zap },
  { href: "/analytics/abc-xyz", label: "ABC / XYZ", icon: Grid3X3 },
];

const tools: NavItem[] = [
  { href: "/tools/unit-economics", label: "Юнит-экономика", icon: Calculator },
  { href: "/tools/supply-planning", label: "Планирование поставок", icon: Boxes },
  { href: "/tools/forecasting", label: "Прогнозирование", icon: Eye },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[270px] shrink-0 bg-white text-[#111] rounded-tr-2xl rounded-br-2xl m-2 p-5 space-y-4">
      <nav className="space-y-6">
        <div>
          <div className="text-sm font-semibold text-[#555] mb-3">Аналитика</div>
          <ul className="space-y-2">
            {analytics.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-orange-50",
                    pathname?.startsWith(item.href)
                      ? "text-[#ff6a2b]"
                      : "text-[#222]"
                  )}
                >
                  <item.icon className="h-5 w-5 opacity-80" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Separator className="bg-black/10" />

        <div>
          <div className="text-sm font-semibold text-[#555] mb-3">Инструменты</div>
          <ul className="space-y-2">
            {tools.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-orange-50",
                    pathname?.startsWith(item.href)
                      ? "text-[#ff6a2b]"
                      : "text-[#222]"
                  )}
                >
                  <item.icon className="h-5 w-5 opacity-80" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <button className="flex items-center gap-2 text-sm text-[#666] hover:text-[#111]">
        <span>Свернуть</span>
      </button>
    </aside>
  );
}


