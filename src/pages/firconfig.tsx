import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { HonorModal } from "~/components/HonorModal";

const FIRConfig: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex h-screen w-full items-center justify-center border-2 bg-neutral-900">
      {!sessionData ? (
        <div className="flex h-screen w-1/2 flex-col items-center justify-center  p-2 font-mono text-neutral-50">
          <p className="text-center text-4xl font-bold text-red-800">
            AUTH REQUIRED
          </p>
          <div className="p-4" />
          <p className="text-center text-4xl">
            You must be logged in and posses valid credentials to view this
            page.
          </p>
          <div className="p-4" />
          <button
            className="border-2 p-2"
            onClick={sessionData ? () => void signOut() : () => void signIn()}
          >
            {sessionData ? "LOG OUT" : "LOG IN"}
          </button>
        </div>
      ) : (
        <>
          <HonorModal />
          <p className="text-white">
            TODO: Associate sectors with the sectors you expect to see in the
            sectordata file (add labels of sectors and such here)
          </p>
        </>
      )}
    </div>
  );
};

export default FIRConfig;
