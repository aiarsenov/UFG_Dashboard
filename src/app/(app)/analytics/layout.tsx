import { ReactNode } from "react";
import { Subnav } from "@/components/layout/Subnav";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="px-6 pt-6">
        <Subnav />
      </div>
      <div className="px-6 pb-6">{children}</div>
    </>
  );
}

