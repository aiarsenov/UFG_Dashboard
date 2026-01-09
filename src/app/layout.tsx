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
        icon: [
            { url: "/favicon.ico?v=2", sizes: "any" },
            { url: "/favicon.ico?v=2", type: "image/x-icon" },
        ],
        shortcut: "/favicon.ico?v=2",
        apple: "/favicon.ico?v=2",
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
