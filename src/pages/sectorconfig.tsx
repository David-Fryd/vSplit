import { type NextPage } from "next";

const SectorConfig: NextPage = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center border-2 bg-neutral-900">
      <div className="flex h-screen w-1/2 flex-col items-center justify-center  p-2 font-mono text-neutral-50">
        <p className="text-center text-4xl font-bold text-red-800">
          AUTH REQUIRED
        </p>
        <div className="p-4" />
        <p className="text-center text-4xl">
          You must be logged in and posses valid credentials to view this page.
        </p>
        <div className="p-4" />
        <button
          type="button"
          disabled={true}
          className="rounded-md bg-blue-600 px-3 py-2 text-xl font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-neutral-600"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default SectorConfig;
