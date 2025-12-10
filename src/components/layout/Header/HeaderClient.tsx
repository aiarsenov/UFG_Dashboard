"use client";

import Link from "next/link";
import Image from "next/image";
import UserMenu from "../../UserMenu/UserMenu";
import "./Header.scss";

type HeaderClientProps = {
    title?: string;
};

export function HeaderClient({ title }: HeaderClientProps) {
    return (
        <header className="header">
            <div className="container header__container">
                <div className="header__row">
                    <Link
                        href="/"
                        className="image header__logo"
                        aria-label="Перейти на главную страницу"
                    >
                        <Image
                            src="/logo.png"
                            alt="Логотип United Fashion Group"
                            width={120}
                            height={26}
                        />
                    </Link>

                    <h1 className="header__title">
                        {title ?? "Наименование открытого дашборда"}
                    </h1>
                </div>

                <UserMenu />
            </div>
        </header>
    );
}
