import Link from "next/link";
import type { ReactNode } from "react";

const NavLink = ({ href, children }: { href: string; children: ReactNode }) => {
  return (
    <Link
      className="m-0.5 flex h-16 items-center justify-center border-4 text-center text-lg"
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
      className="m-0.5 flex h-16 items-center justify-center border-4 text-center text-lg "
      href={href}
    >
      {children}
    </a>
  );
};

const MapNav = () => {
  return (
    <Link
      className="m-0.5 flex h-20 items-center justify-center border-4 text-center text-lg"
      href={"/"}
    >
      MAP
    </Link>
  );
};

const SettingsFlyout = () => {
  return (
    <p className="m-0.5 flex h-16 items-center justify-center border-4 text-center text-lg ">
      DISPLAY SETTINGS
    </p>
  );
};

const QuickloadFlyout = () => {
  return (
    <p className="m-0.5 flex h-16 items-center justify-center border-4 text-center text-lg ">
      QUICK LOAD
    </p>
  );
};

export const Sidebar = () => {
  return (
    <div className="sticky top-0 flex h-screen w-28 flex-col bg-neutral-900 font-mono text-neutral-100">
      <div className="h-full">
        <MapNav />
        <SettingsFlyout />
        <div className="p-2"></div>
        <p className="text-md text-center font-bold text-red-400">AUTH REQ</p>
        <div className="m-1  border-2 border-red-400 px-0.5 py-0.5">
          {/* <NavLink href="/">SECTOR CONFIG</NavLink> */}
          <QuickloadFlyout />
          <NavLink href="/sectorconfig">SECTOR CONFIG</NavLink>
          <NavLink href="/firconfig">FIR CONFIG</NavLink>
        </div>
      </div>
      <div className="flex-1">
        <NavLink href="/about">ABOUT</NavLink>
        <NavLink href="/privacy">PRIVACY</NavLink>
        <ExternalLink href="https://github.com/David-Fryd/easy-flash">
          <p className="text-sm">BUGS & FEAT. REQS</p>
        </ExternalLink>
      </div>
    </div>
  );
};
