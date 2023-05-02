import { Sidebar } from "~/components/Sidebar";
import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
