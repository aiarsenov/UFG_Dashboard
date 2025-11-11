import { ReactNode } from "react";
// import { Subnav } from "@/components/Subnav/Subnav";

export default function Layout({ children }: { children: ReactNode }) {
    return <div className="min-h-full flex flex-col">{children}</div>;
}
