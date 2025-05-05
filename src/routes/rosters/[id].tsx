import { createResource, For, createEffect } from "solid-js";
import { useParams } from "@solidjs/router";
import { getUserRosterById } from "../../lib/rosterApi";
import type { PlayerWithId } from "../../types";

export default function RosterDetailPage() {
  const params = useParams();
  
  console.log("Route params:", params);
  console.log("Roster ID from params:", params.id);

  const [roster, { refetch }] = createResource(() => params.id, getUserRosterById);
  
  createEffect(() => {
    if (roster.error) {
      console.error("Error loading roster:", roster.error);
    }
    
    if (roster()) {
      console.log("Roster data loaded:", roster());
    }
  });

  const getPlayers = () => {
    const data = roster();
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
              <div class="flex justify-between">
                <span class="font-medium">{player.PLYR_FIRSTNAME} {player.PLYR_LASTNAME}</span>
                <span class="text-sm text-gray-500">{player.PLYR_POSITION}</span>
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