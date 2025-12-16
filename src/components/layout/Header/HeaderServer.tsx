import Link from "next/link";
import Image from "next/image";
import UserMenuWrapper from "../../UserMenu/UserMenuWrapper";
import "./Header.scss";

type HeaderServerProps = {
    title?: string;
};

export function HeaderServer({ title }: HeaderServerProps) {
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

                <UserMenuWrapper />
            </div>
        </header>
    );
}
