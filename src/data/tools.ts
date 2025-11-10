import Boxes from "@/assets/icons/boxes.svg";
import Calculator from "@/assets/icons/calculator.svg";
import Eye from "@/assets/icons/eye.svg";

export interface NavItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

export const tools: NavItem[] = [
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
