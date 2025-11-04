import { ReactNode } from "react";
import { Subnav } from "@/components/layout/Subnav";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="-mx-6 -mt-6 mb-6">
        <Subnav />
      </div>
      {children}
    </>
  );
}


