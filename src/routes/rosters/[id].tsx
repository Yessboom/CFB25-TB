import { createResource, For, createEffect, createSignal } from "solid-js";
import { useParams } from "@solidjs/router";
import { getUserRosterById, updateRoster } from "../../lib/rosterApi";
import type { PlayerWithId, RosterData } from "../../types";
import { useAction } from "@solidjs/router";

export default function RosterDetailPage() {
  const params = useParams();
  const [roster, { refetch }] = createResource(() => params.id, getUserRosterById);
  const [editedRoster, setEditedRoster] = createSignal<RosterData | null>(null);
  const [editingPlayerId, setEditingPlayerId] = createSignal<string | null>(null);
  const updateRosterAction = useAction(updateRoster);

  createEffect(() => {
    if (roster.error) {
      console.error("Error loading roster:", roster.error);
    }

    if (roster()) {
      console.log("Roster data loaded:", roster());
      setEditedRoster(roster() || null);
    }
  });

  const getPlayers = (): PlayerWithId[] => {
    const data = editedRoster();
    if (!data) return [];

    console.log("Processing roster data:", data);

    try {
      return Object.entries(data).map(([id, player]) => ({
        ...player,
        id,
      })) as PlayerWithId[];
    } catch (error) {
      console.error("Error processing player data:", error);
      return [];
    }
  };

  const handleInputChange = (id: string, field: keyof PlayerWithId, value: string) => {
    setEditedRoster((prevRoster) => {
      if (!prevRoster) return prevRoster;
      const updatedPlayers = {
        ...prevRoster,
        [id]: {
          ...prevRoster[id],
          [field]: value,
        },
      };
      return updatedPlayers;
    });
  };

  const handleEditClick = (id: string) => {
    setEditingPlayerId(id);
  };

  const handleSaveClick = async (id: string) => {
    if (params.id && editedRoster()) {
      try {
        // Log the data being sent for debugging purposes
        console.log("Attempting to save roster with ID:", params.id);
        console.log("Payload size:", JSON.stringify(editedRoster()).length, "bytes");
  
        // Check if editedRoster is valid
        if (!editedRoster()) {
          throw new Error("Edited roster data is undefined");
        }
  
        
        await updateRosterAction([params.id, editedRoster()!]);
        setEditingPlayerId(null); // Exit edit mode
        alert("Roster updated successfully!");
      } catch (error) {
        console.error("Error updating roster:", error);
        alert("Failed to update roster.");
      }
    } else {
      console.error("Roster ID or edited roster data is missing");
    }
  };
  
  return (
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-4">Roster Detail</h2>
      <div class="mb-4 text-sm text-gray-500">ID: {params.id}</div>

      {roster.loading && <p>Loading roster...</p>}
      {roster.error && (
        <div class="text-red-600">
          <p>Failed to load roster.</p>
          <p class="text-sm">{roster.error.toString()}</p>
        </div>
      )}

      <ul class="space-y-2">
        <For each={getPlayers()}>
          {(player) => (
            <li class="border rounded p-2 shadow">
              <div class="flex justify-between items-center">
                {editingPlayerId() === player.id ? (
                  <input
                    type="text"
                    value={player.PLYR_FIRSTNAME}
                    onInput={(e) => handleInputChange(player.id, "PLYR_FIRSTNAME", e.currentTarget.value)}
                    class="border rounded p-1"
                  />
                ) : (
                  <span class="font-medium">{player.PLYR_FIRSTNAME} {player.PLYR_LASTNAME}</span>
                )}
                <span class="text-sm text-gray-500">{player.PLYR_POSITION}</span>
                {editingPlayerId() === player.id ? (
                  <button onClick={() => handleSaveClick(player.id)} class="text-blue-500 ml-2">
                    Save
                  </button>
                ) : (
                  <button onClick={() => handleEditClick(player.id)} class="text-blue-500 ml-2">
                    Edit
                  </button>
                )}
              </div>
              <div class="text-sm text-gray-700">
                OVR: {player.PLYR_OVERALLRATING} | Speed: {player.PLYR_SPEED} | Strength: {player.PLYR_STRENGTH}
              </div>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}