"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type SubnavItem = { href: string; label: string };

const competitorsItems: SubnavItem[] = [
  { href: "/analytics/market-competitors", label: "Динамика" },
  { href: "/analytics/market-competitors/compare", label: "Сравнение" },
  { href: "/analytics/market-competitors/details", label: "Детализация" },
];

export function Subnav() {
  const pathname = usePathname();

  // Отображаем сабнавигацию только в ветке "Рынок и конкуренты"
  const shouldShow = pathname?.startsWith("/analytics/market-competitors");
  if (!shouldShow) return null;

  const items = competitorsItems;

  return (
    <div className="bg-white rounded-xl mx-2 mt-2 px-6">
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


