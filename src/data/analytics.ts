import BarChart from "@/assets/icons/bar-chart.svg";
import ClipboardList from "@/assets/icons/clipboard-list.svg";
import LineChart from "@/assets/icons/line-chart.svg";
import Note from "@/assets/icons/note.svg";
import ShoppingCart from "@/assets/icons/shopping-cart.svg";
import TrendingUp from "@/assets/icons/trending-up.svg";
import Zap from "@/assets/icons/zap.svg";

export interface NavItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

export const analytics: NavItem[] = [
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
