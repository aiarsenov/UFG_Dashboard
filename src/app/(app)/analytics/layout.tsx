import { ReactNode } from "react";
import { Subnav } from "@/components/layout/Subnav";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <div>
                <Subnav />
            </div>

            <div className="min-h-full flex flex-col">{children}</div>
        </>
    );
}
