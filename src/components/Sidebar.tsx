import Link from "next/link";
import type { ReactNode } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

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

const SignInOutButton = ({ sessionData }: { sessionData: any }) => {
  return (
    <div className="m-0.5 flex h-12 items-center justify-center border-4 border-red-400 text-center text-lg ">
      <button
        className=""
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "LOG OUT" : "LOG IN"}
      </button>
    </div>
  );
};

export const Sidebar = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="sticky top-0 flex h-screen w-28 flex-col bg-neutral-900 font-mono text-neutral-100">
      <div className="h-full">
        <MapNav />
        <SettingsFlyout />
        <div className="p-2"></div>
        <p
          className={`text-md text-center font-bold ${
            sessionData ? "text-green-400" : "text-red-400"
          }`}
        >
          AUTH{!sessionData ? "\nREQUIRED" : "ED"}
        </p>
        {sessionData && (
          <p
            className={`text-center text-xs font-bold ${
              sessionData ? "text-green-400" : "text-red-400"
            }`}
          >
            {sessionData.user.name}
          </p>
        )}
        <div
          className={`m-1 border-2 ${
            sessionData ? "border-green-400" : "border-red-400"
          } px-0.5 py-0.5`}
        >
          {!sessionData && <SignInOutButton sessionData={sessionData} />}
          <QuickloadFlyout />
          <NavLink href="/sectorconfig">SECTOR CONFIG</NavLink>
          <NavLink href="/firconfig">FIR CONFIG</NavLink>
          {sessionData && <SignInOutButton sessionData={sessionData} />}
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
