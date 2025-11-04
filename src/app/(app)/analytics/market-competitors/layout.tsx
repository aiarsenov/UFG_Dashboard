import { ReactNode } from "react";
import { Subnav } from "@/components/layout/Subnav";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="p-6 space-y-4">
      <div className="bg-white rounded-xl px-6">
        <div className="-mx-6">
          <Subnav />
        </div>
      </div>
      {children}
    </div>
  );
}


