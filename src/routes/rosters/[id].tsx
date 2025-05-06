import { createResource, Index, createEffect, createSignal, onCleanup, createMemo } from "solid-js";
import { useParams } from "@solidjs/router";
import { getUserRosterById, updateRoster } from "../../lib/rosterApi";
import type { PlayerWithId, RosterData } from "../../types";
import { useAction } from "@solidjs/router";


export default function RosterDetailPage() {
  const params = useParams();
  const [roster, { refetch }] = createResource(() => params.id, getUserRosterById);
  const [editedRoster, setEditedRoster] = createSignal<RosterData | null>(null);
  const updateRosterAction = useAction(updateRoster);
  const saveTimeouts = new Map<string, number>(); 

  createEffect(() => {
    if (roster.error) {
      console.error("Error loading roster:", roster.error);
    }

    if (roster()) {
      console.log("Roster data loaded:", roster());
      setEditedRoster(roster() || null);
    }
  });

  // Memoize the players array to prevent unnecessary recalculations
  const players = createMemo((): PlayerWithId[] => {
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
  });

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

  onCleanup(() => {
    // Clear any pending timeouts when component unmounts
    saveTimeouts.forEach((id) => clearTimeout(id));
  });
  
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
        <Index each={players()}>
          {(player) => (
            <li class="border rounded p-2 shadow">
              <input
                value={player().PLYR_FIRSTNAME}
                onInput={(e) => {
                  handleInputChange(player().id, "PLYR_FIRSTNAME", e.currentTarget.value);

                  const existing = saveTimeouts.get(player().id);
                  if (existing) clearTimeout(existing);

                  const timeoutId = window.setTimeout(async () => {
                    if (params.id && editedRoster()) {
                      try {
                        await updateRosterAction([params.id, editedRoster()!]);
                        console.log("Auto-saved:", player().id);
                      } catch (error) {
                        console.error("Auto-save failed:", error);
                      }
                    }
                  }, 3000);

                  saveTimeouts.set(player().id, timeoutId);
                }}
                class="font-medium border rounded p-1"
              />
              <span class="text-sm text-gray-500">{player().PLYR_POSITION}</span>
              <div class="text-sm text-gray-700">
                OVR: {player().PLYR_OVERALLRATING} | Speed: {player().PLYR_SPEED} | Strength: {player().PLYR_STRENGTH}
              </div>
            </li>
          )}
        </Index>
      </ul>
    </div>
  );
}