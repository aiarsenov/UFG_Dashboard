"use client";

import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

type HeaderProps = {
  title?: string;
};

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-[#262654]">
      <div className="flex items-center gap-4">
        <Image src="/ufg-logo.svg" alt="UFG" width={110} height={20} />
        <Separator orientation="vertical" className="h-6 bg-white/20" />
        <h1 className="text-lg font-semibold opacity-90">
          {title ?? "Наименование открытого дашборда"}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 border border-white/20">
          <AvatarFallback>ИИ</AvatarFallback>
        </Avatar>
        <div className="leading-tight text-right">
          <div className="text-sm">Иванов Иван Иванович</div>
          <div className="text-xs opacity-70">ivan@yandex.ru</div>
        </div>
      </div>
    </header>
  );
}


