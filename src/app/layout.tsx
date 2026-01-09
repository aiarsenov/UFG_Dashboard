import type { Metadata } from "next";

import "./globals.css";
import "../styles/reset.scss";
import "../styles/variables.scss";
import "../styles/connected-fonts.scss";
import "../styles/main.scss";

export const metadata: Metadata = {
    title: "UFG Dashboard",
    description: "UFG Analytics Dashboard",
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/favicon.ico",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
            <body className="antialiased">
                <div className="wrapper">{children}</div>
            </body>
        </html>
    );
}
