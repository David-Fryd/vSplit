import { api } from "~/utils/api";
import { useState, useEffect } from "react";

// TODO THIS PAGE WAS THROWN TOGETHER FOR A DEMO AND IS NOT THE BEST.
// NOTABLY, WE SHOULD ONLY BE UPDATING SECTORS THAT CHANGED AND NOT ALL OF THEM,
// BUT THIS IS A QUICK AND DIRTY SOLUTION FOR NOW.

const hardcoded_presets: {
  name: string;
  assignments: { sectorID: string; uniqueGroupID: number }[];
}[] = [
  {
    // KEEP IN MIND THAT UNIQUEGROUPID != GROUPNAME
    name: "NY 4",
    assignments: [
      // groupName 05
      { sectorID: "15", uniqueGroupID: 13 },
      { sectorID: "05", uniqueGroupID: 13 },
      { sectorID: "20", uniqueGroupID: 13 },
      { sectorID: "32", uniqueGroupID: 13 },
      { sectorID: "37", uniqueGroupID: 13 },
      { sectorID: "52", uniqueGroupID: 13 },

      // groupName 36
      { sectorID: "36", uniqueGroupID: 12 },
      { sectorID: "09", uniqueGroupID: 12 },

      //groupName 19
      { sectorID: "18", uniqueGroupID: 9 },
      { sectorID: "19", uniqueGroupID: 9 },
      { sectorID: "51", uniqueGroupID: 9 },
      { sectorID: "58", uniqueGroupID: 9 },
      { sectorID: "59", uniqueGroupID: 9 },

      //groupName 12
      { sectorID: "12", uniqueGroupID: 11 },
      { sectorID: "17", uniqueGroupID: 11 },
      { sectorID: "54", uniqueGroupID: 11 },
    ],
  },
  {
    // KEEP IN MIND THAT UNIQUEGROUPID != GROUPNAME
    name: "NY 3",
    assignments: [
      // groupName 05
      { sectorID: "05", uniqueGroupID: 13 },
      { sectorID: "15", uniqueGroupID: 13 },
      { sectorID: "37", uniqueGroupID: 13 },
      { sectorID: "32", uniqueGroupID: 13 },
      { sectorID: "52", uniqueGroupID: 13 },

      // groupName 36
      { sectorID: "36", uniqueGroupID: 12 },
      { sectorID: "09", uniqueGroupID: 12 },
      { sectorID: "20", uniqueGroupID: 12 },

      //groupName 19
      { sectorID: "12", uniqueGroupID: 9 },
      { sectorID: "17", uniqueGroupID: 9 },
      { sectorID: "18", uniqueGroupID: 9 },
      { sectorID: "19", uniqueGroupID: 9 },
      { sectorID: "51", uniqueGroupID: 9 },
      { sectorID: "58", uniqueGroupID: 9 },
      { sectorID: "59", uniqueGroupID: 9 },
      { sectorID: "54", uniqueGroupID: 9 },
    ],
  },
  {
    // KEEP IN MIND THAT UNIQUEGROUPID != GROUPNAME
    name: "LGA Heavy FNO",
    assignments: [
      //groupName 19 id=9
      { sectorID: "18", uniqueGroupID: 9 },
      { sectorID: "19", uniqueGroupID: 9 },

      //groupName 17 id=14
      { sectorID: "17", uniqueGroupID: 14 },
      { sectorID: "51", uniqueGroupID: 14 },
      { sectorID: "58", uniqueGroupID: 14 },
      { sectorID: "59", uniqueGroupID: 14 },
      { sectorID: "54", uniqueGroupID: 14 },

      //groupName 12 id=11
      { sectorID: "12", uniqueGroupID: 11 },

      // groupName 36 id=12
      { sectorID: "36", uniqueGroupID: 12 },
      { sectorID: "09", uniqueGroupID: 12 },

      // groupName 05 id=13
      { sectorID: "05", uniqueGroupID: 13 },
      { sectorID: "15", uniqueGroupID: 13 },
      { sectorID: "37", uniqueGroupID: 13 },
      { sectorID: "32", uniqueGroupID: 13 },
      { sectorID: "52", uniqueGroupID: 13 },
      { sectorID: "20", uniqueGroupID: 13 },
    ],
  },
  // {
  //   // KEEP IN MIND THAT UNIQUEGROUPID != GROUPNAME
  //   name: "Phapple vs Earth",
  //   assignments: [
  //     //groupName 19 id=9
  //     { sectorID: "17", uniqueGroupID: 9 },
  //     { sectorID: "18", uniqueGroupID: 9 },
  //     { sectorID: "19", uniqueGroupID: 9 },
  //     { sectorID: "51", uniqueGroupID: 9 },
  //     { sectorID: "58", uniqueGroupID: 9 },
  //     { sectorID: "59", uniqueGroupID: 9 },

  //     //groupName 12 id=11
  //     { sectorID: "12", uniqueGroupID: 11 },
  //     { sectorID: "05", uniqueGroupID: 11 },
  //     { sectorID: "13", uniqueGroupID: 11 },
  //     { sectorID: "37", uniqueGroupID: 11 },
  //     { sectorID: "32", uniqueGroupID: 11 },
  //     { sectorID: "52", uniqueGroupID: 11 },
  //     { sectorID: "20", uniqueGroupID: 11 },
  //     { sectorID: "36", uniqueGroupID: 11 },
  //     { sectorID: "09", uniqueGroupID: 11 },
  //     { sectorID: "54", uniqueGroupID: 11 },
  //   ],
  // },
  {
    name: "AllGroup05",
    assignments: [
      // groupName 05
      { sectorID: "15", uniqueGroupID: 13 },
      { sectorID: "05", uniqueGroupID: 13 },
      { sectorID: "20", uniqueGroupID: 13 },
      { sectorID: "32", uniqueGroupID: 13 },
      { sectorID: "37", uniqueGroupID: 13 },
      { sectorID: "52", uniqueGroupID: 13 },
      { sectorID: "36", uniqueGroupID: 13 },
      { sectorID: "09", uniqueGroupID: 13 },
      { sectorID: "18", uniqueGroupID: 13 },
      { sectorID: "19", uniqueGroupID: 13 },
      { sectorID: "51", uniqueGroupID: 13 },
      { sectorID: "58", uniqueGroupID: 13 },
      { sectorID: "59", uniqueGroupID: 13 },
      { sectorID: "12", uniqueGroupID: 13 },
      { sectorID: "17", uniqueGroupID: 13 },
      { sectorID: "54", uniqueGroupID: 13 },
    ],
  },
];

export const TempSplitter = ({ firName }: { firName: string }) => {
  const currentAssignments =
    api.facilitydata.getGroupsWithSectorsFromFIR.useQuery({
      firName: firName,
    });

  // TODO: We have already retrieved the latest facility data in MainMap.tsx
  //       Do not make any new requests here, just figure out how to share
  //       the data from the MainMap to the TempSplitter. Is there somewhere
  //       higher up in the app we can store this?
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

  console.log("current assignments: ", currentAssignments.data);

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

  const loadPreset = (presetName: string) => {
    // Find the selected preset
    const preset = hardcoded_presets.find((p) => p.name === presetName);

    if (preset && sectorList.data) {
      // Create a lookup object from the preset assignments
      const presetAssignmentLookup: { [key: string]: number } =
        preset.assignments.reduce((acc, assignment) => {
          return {
            ...acc,
            [assignment.sectorID]: assignment.uniqueGroupID,
          };
        }, {} as { [key: string]: number });

      // Use the lookup object to set the values for assignments
      setAssignments(
        sectorList.data.reduce((acc, sector) => {
          return {
            ...acc,
            [sector.sectorID]: presetAssignmentLookup[sector.sectorID] || 0,
          };
        }, {} as { [key: string]: number })
      );
    }
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
        <h1>Load from preset:</h1>
        <select
          className="text-black"
          onChange={(event) => loadPreset(event.target.value)}
        >
          <option value="">Select preset</option>
          {hardcoded_presets.map((preset) => (
            <option key={preset.name} value={preset.name}>
              {preset.name}
            </option>
          ))}
        </select>
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
