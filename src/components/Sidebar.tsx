import Link from "next/link";
import type { ReactNode } from "react";

const NavLink = ({ href, children }: { href: string; children: ReactNode }) => {
  return (
    <Link
      className="m-0.5 flex h-16 items-center justify-center border-4 text-center text-lg font-bold"
      href={href}
    >
      {children}
    </Link>
  );
};

const ExternalLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => {
  return (
    <a
      className="m-0.5 flex h-16 items-center justify-center border-4 text-center text-lg font-bold"
      href={href}
    >
      {children}
    </a>
  );
};

export const Sidebar = () => {
  return (
    <div className="flex h-screen w-28 flex-col bg-neutral-900 font-mono text-neutral-100">
      <NavLink href="/">MAP</NavLink>
      {/* <div className="p-4"></div>
      <p className="text-md text-center text-green-500">AUTH REQ</p> */}
      {/* <NavLink href="/">SECTOR CONFIG</NavLink> */}
      <NavLink href="/test">SECTOR CONFIG</NavLink>
      <ExternalLink href="https://github.com/David-Fryd/easy-flash">
        <p className="text-sm">Bugs & Feature Requests</p>
      </ExternalLink>
    </div>
  );
};
