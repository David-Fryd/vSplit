import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import type { SyncFacilityDataReturn } from "~/utils/facilityData/server/syncFacilityData";

const Sync: NextPage = () => {
  const { data: sessionData } = useSession();

  // Create a mutation using the syncFacilityData procedure
  const syncMutation = api.facilitydata.syncFacilityData.useMutation();

  // Define the function to be called when the button is clicked
  const handleSync = () => {
    syncMutation.mutate();
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center border-2 bg-neutral-900 text-white">
      {(sessionData && sessionData?.user.ratingID >= 2) ||
      sessionData?.user.email == "admin_email_todo_get_from_env" ? (
        <>
          {/* Button that triggers the sync */}
          <button
            className="rounded-xl  border-2 border-white bg-neutral-500 p-2"
            onClick={handleSync}
            disabled={syncMutation.isLoading}
          >
            Sync Database
          </button>
          {syncMutation.isLoading && <p>Syncing...</p>}
          {syncMutation.error && (
            <p>Something went wrong! {syncMutation.error.message}</p>
          )}
          {syncMutation.data && (
            <p>
              Synced!{" "}
              {JSON.stringify(syncMutation.data /*as SyncFacilityDataReturn*/)}
            </p>
          )}
        </>
      ) : (
        <p>Sorry, you dont have permission to sync the database.</p>
      )}
    </div>
  );
};

export default Sync;
