import { api } from "~/utils/api";
import { useState, useEffect } from "react";

// TODO THIS PAGE WAS THROWN TOGETHER FOR A DEMO AND IS NOT THE BEST.
// NOTABLY, WE SHOULD ONLY BE UPDATING SECTORS THAT CHANGED AND NOT ALL OF THEM,
// BUT THIS IS A QUICK AND DIRTY SOLUTION FOR NOW.

export const TempSplitter = ({ firName }: { firName: string }) => {
  const currentAssignments =
    api.facilitydata.getGroupsWithSectorsFromFIR.useQuery({
      firName: firName,
    });

  const sectorList = api.facilitydata.getAllSectorFromFIR.useQuery({
    firName: firName,
  });

  const updateMutation =
    api.facilitydata.batchAssignGroupsToSectors.useMutation();

  // State to store the user's form data
  const [assignments, setAssignments] = useState<{
    [sectorId: string]: number;
  }>({});

  useEffect(() => {
    if (currentAssignments.isSuccess && sectorList.isSuccess) {
      // Create a lookup object from the current assignments
      const currentAssignmentLookup: { [key: string]: number } =
        currentAssignments.data.reduce((acc, group) => {
          return {
            ...acc,
            ...group.sectors.reduce((acc, sector) => {
              return {
                ...acc,
                [sector.sectorID]: group.uniqueGroupID,
              };
            }, {} as { [key: string]: number }),
          };
        }, {} as { [key: string]: number });

      // Use the lookup object to set the initial values for assignments
      setAssignments(
        sectorList.data.reduce((acc, sector) => {
          return {
            ...acc,
            [sector.sectorID]: currentAssignmentLookup[sector.sectorID] || 0,
          };
        }, {} as { [key: string]: number })
      );
    }
  }, [currentAssignments.isSuccess, sectorList.isSuccess]);

  const handleUpdate = () => {
    const assignmentsArray = Object.entries(assignments).map(
      ([sectorId, groupId]) => ({
        sectorId,
        groupId,
      })
    );

    updateMutation.mutate({
      firName,
      assignments: assignmentsArray,
    });
  };

  const handleSelectChange =
    (sectorId: string) => (event: React.ChangeEvent<HTMLSelectElement>) => {
      setAssignments((prev) => ({
        ...prev,
        [sectorId]: Number(event.target.value),
      }));
    };

  return (
    <div className="p-8 text-white">
      <div>
        <h1>Current assignments:</h1>
        <ul>
          {currentAssignments.data?.map((group) => (
            <li key={group.groupName}>
              {group.groupName}:{" "}
              {group.sectors.map((sector) => sector.sectorLabel).join(", ")}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col justify-between ">
        <h1>Update assignments:</h1>
        {sectorList.data?.map((sector) => (
          <div key={sector.sectorID}>
            <label className="pr-2">{sector.sectorLabel}</label>
            <select
              className="text-black"
              value={assignments[sector.sectorID] || ""}
              onChange={handleSelectChange(sector.sectorID)}
            >
              <option className="" value="">
                Select group
              </option>
              {currentAssignments.data?.map((group) => (
                <option key={group.groupName} value={group.uniqueGroupID}>
                  {group.groupName}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button
          className="border-2 font-bold"
          disabled={updateMutation.isLoading}
          onClick={handleUpdate}
        >
          {updateMutation.isLoading ? "Updating..." : "Update"}
        </button>
        {updateMutation.isSuccess && <div>Update successful!</div>}
      </div>
    </div>
  );
};
