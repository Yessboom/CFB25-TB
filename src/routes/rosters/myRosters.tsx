import { createResource, createSignal, Show, For, createEffect } from "solid-js";
import { getUserRosters, getUserRosterById, updateRosterName } from "../../lib/rosterApi";
import { useNavigate } from "@solidjs/router";
import PlayerDetailComponent from "../../components/PlayerDetailComponent";
import type { PlayerData } from "../../types";
import { getPositionName } from "../../lib/utils";

export default function MyRostersPage() {
  const [rosters, { refetch }] = createResource(() => getUserRosters());
  const [showPopup, setShowPopup] = createSignal(false);
  const [rosterName, setRosterName] = createSignal("");
  const [selectedRosterId, setSelectedRosterId] = createSignal<string | null>(null);
  const [previewRosterId, setPreviewRosterId] = createSignal<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = createSignal<(PlayerData & { id: string }) | null>(null);
  const [updating, setUpdating] = createSignal(false);
  const navigate = useNavigate();

  // Fetch the selected roster data for preview
  const [rosterData] = createResource(
    () => previewRosterId(),
    getUserRosterById
  );

  // Convert player data to an array for rendering
  const players = () => {
    if (!rosterData()) return [];
    return Object.entries(rosterData() || {}).map(([playerId, playerData]) => ({
      id: playerId,
      ...playerData
    }));
  };

  const openPopup = (id: string, name: string) => {
    setSelectedRosterId(id);
    setRosterName(name);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setRosterName("");
    setSelectedRosterId(null);
  };

  const confirmRenameRoster = async () => {
    if (!selectedRosterId()) return;
    setUpdating(true);
    try {
      await updateRosterName([selectedRosterId()!, rosterName()]);
      refetch();
      closePopup();
    } catch (error) {
      console.error("Rename failed:", error);
    } finally {
      setUpdating(false);
    }
  };
  
  const handleEditRoster = (id: string) => {
    navigate(`/rosters/${id}`);
  };

  const handlePreviewRoster = (id: string) => {
    setPreviewRosterId(id);
    setSelectedPlayer(null); // Reset selected player when changing preview
  };

  const handlePlayerSelect = (player: PlayerData & { id: string }) => {
    setSelectedPlayer(player);
  };

  return (
    <div class="p-6 w-full mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-gray-800">My Rosters</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Roster list column */}
        <div class="lg:col-span-1 bg-white p-5 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Your Rosters</h2>
          <Show when={!rosters.loading} fallback={<div class="py-4 text-center">Loading rosters...</div>}>
            <Show when={rosters()?.length} fallback={<div class="py-4 text-center text-gray-500">You don't have any rosters yet.</div>}>
              <div class="space-y-3">
                <For each={rosters() || []}>
                  {(roster) => (
                    <div class="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                      <div class="flex justify-between items-center mb-2">
                        <span class="font-medium text-gray-800">{roster.name}</span>
                      </div>
                      <div class="flex space-x-2 mt-2">
                        <button
                          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex-1 text-sm font-medium"
                          onClick={() => handleEditRoster(roster.id)}
                        >
                          Edit Roster
                        </button>
                        <button
                          class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition flex-1 text-sm font-medium"
                          onClick={() => handlePreviewRoster(roster.id)}
                        >
                          Show Roster
                        </button>
                      </div>
                      <button
                        class="w-full mt-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-200 transition text-sm font-medium"
                        onClick={() => openPopup(roster.id, roster.name)}
                      >
                        Rename
                      </button>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </Show>
          <Show when={rosters.error}>
            <div class="p-4 bg-red-50 text-red-700 rounded-lg mt-4">
              Failed to load rosters: {rosters.error.message}
            </div>
          </Show>
        </div>
        
        {/* Roster preview column */}
        <div class="lg:col-span-3">
          <Show when={previewRosterId()} fallback={
            <div class="bg-white p-8 rounded-lg shadow-md flex flex-col items-center justify-center h-full">
              <svg class="w-16 h-16 text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p class="text-gray-600 text-lg">Select "Show Roster" to preview player details</p>
            </div>
          }>
            <Show when={!rosterData.loading} fallback={<div class="p-4 text-center">Loading player data...</div>}>
              <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="flex items-center justify-between bg-gray-100 p-4 border-b">
                  <h2 class="text-xl font-semibold text-gray-800">
                    {rosters()?.find(r => r.id === previewRosterId())?.name || "Roster Preview"}
                  </h2>
                  <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {players().length} Players
                  </span>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-0">
                  {/* Player list */}
                  <div class="lg:col-span-2 overflow-auto max-h-[700px]">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50 sticky top-0">
                        <tr>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Jersey</th>
                          <th class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
                          <th class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">OVR</th>
                          <th class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <For each={players()}>
                          {(player) => (
                            <tr 
                              class={`hover:bg-gray-50 cursor-pointer ${
                                selectedPlayer()?.id === player.id ? 'bg-blue-50' : ''
                              }`}
                              onClick={() => handlePlayerSelect(player)}
                            >
                              <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800">
                                {player.PLYR_FIRSTNAME} {player.PLYR_LASTNAME}
                              </td>
                              <td class="px-2 py-2 whitespace-nowrap text-sm text-center text-gray-500">
                                {player.PLYR_JERSEYNUM}
                              </td>
                              <td class="px-2 py-2 whitespace-nowrap text-sm text-center text-gray-500">
                                {getPositionName(player.PLYR_POSITION)}
                              </td>
                              <td class="px-2 py-2 whitespace-nowrap text-sm text-center">
                                <span class={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                                  parseInt(player.PLYR_OVERALLRATING) >= 85 ? 'bg-green-100 text-green-800' :
                                  parseInt(player.PLYR_OVERALLRATING) >= 75 ? 'bg-blue-100 text-blue-800' :
                                  parseInt(player.PLYR_OVERALLRATING) >= 65 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {player.PLYR_OVERALLRATING}
                                </span>
                              </td>
                              <td class="px-2 py-2 whitespace-nowrap text-sm text-center text-gray-500">
                                {player.PLYR_AGE}
                              </td>
                            </tr>
                          )}
                        </For>
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Player detail */}
                  <div class="lg:col-span-2 border-l border-gray-200">
                    <Show when={selectedPlayer()} fallback={
                      <div class="p-6 text-center">
                        <p class="text-gray-500">Select a player to view details</p>
                      </div>
                    }>
                      <div class="p-4">
                        <PlayerDetailComponent player={selectedPlayer()} />
                      </div>
                    </Show>
                  </div>
                </div>
              </div>
            </Show>
          </Show>
        </div>
      </div>

      {/* Rename roster popup */}
      <Show when={showPopup()}>
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-lg shadow-lg w-96 max-w-md">
            <h3 class="text-xl font-semibold mb-2 text-gray-800">Rename Roster</h3>
            <p class="text-gray-600 mb-4">Enter a new name for this roster</p>
            <input
              class="w-full border border-gray-300 px-3 py-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              value={rosterName()}
              onInput={(e) => setRosterName(e.currentTarget.value)}
              placeholder="Roster name"
            />
            <div class="flex justify-end space-x-3">
              <button 
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                onClick={closePopup}
              >
                Cancel
              </button>
              <button
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                onClick={confirmRenameRoster}
                disabled={updating() || !rosterName().trim()}
              >
                {updating() ? 'Saving...' : 'Save Name'}
              </button>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}