import { createSignal, createResource, For, Show } from 'solid-js';
import { getRosters, getRosterById } from '../lib/rosterAPI';
import PlayerDetailComponent from './PlayerDetailComponent';
import type { PlayerData } from '../types';
import { getPositionName } from '../lib/utils';

const RosterPage = () => {
  const [selectedRosterId, setSelectedRosterId] = createSignal<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = createSignal<(PlayerData & { id: string }) | null>(null);

  // Fetch all available rosters using the server query
  const [rosters] = createResource(async () => {
    try {
      return await getRosters();
    } catch (error) {
      console.error('Error fetching rosters:', error);
      return [];
    }
  });

  // Fetch the selected roster data using the server query
  const [rosterData] = createResource(
    // Only run the fetch when we have a valid roster ID
    () => selectedRosterId(),
    async (id: string) => {
      if (!id) return null;
      
      try {
        return await getRosterById(id);
      } catch (error) {
        console.error(`Error fetching roster with ID ${id}:`, error);
        return null;
      }
    }
  );

  // Convert player data to an array for rendering
  const players = () => {
    if (!rosterData()) return [];

    // Convert the roster JSON object to an array of players
    return Object.entries(rosterData() || {}).map(([playerId, playerData]) => ({
      id: playerId,
      ...playerData
    }));
  };

  // Handle player selection
  const handlePlayerSelect = (player: PlayerData & { id: string }) => {
    setSelectedPlayer(player);
  };

  return (
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-6">Team Roster Viewer</h1>

      {/* Roster Selection */}
      <div class="mb-6">
        <label class="block text-sm font-medium mb-2">Select Roster:</label>
        <Show when={!rosters.loading} fallback={<div>Loading rosters...</div>}>
          <select 
            class="w-full p-2 border rounded"
            onChange={(e: Event) => {
              const target = e.target as HTMLSelectElement;
              setSelectedRosterId(target.value || null);
              setSelectedPlayer(null); // Reset selected player when changing roster
            }}
            value={selectedRosterId() || ''}
          >
            <option value="">-- Select a roster --</option>
            <For each={rosters() || []}>
              {(roster) => (
                <option value={roster.id}>{roster.name}</option>
              )}
            </For>
          </select>
        </Show>
      </div>
      
      <Show when={selectedRosterId() && !rosterData.loading} fallback={
        selectedRosterId() ? <div>Loading player data...</div> : <div>Select a roster to view players</div>
      }>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player List Column */}
          <div class="lg:col-span-2">
            <h2 class="text-xl font-semibold mb-4">Players ({players().length})</h2>
            
            {/* Player Table */}
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white border">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="p-2 border">Name</th>
                    <th class="p-2 border">Jersey</th>
                    <th class="p-2 border">Position</th>
                    <th class="p-2 border">OVR</th>
                    <th class="p-2 border">Speed</th>
                    <th class="p-2 border">Strength</th>
                    <th class="p-2 border">Awareness</th>
                    <th class="p-2 border">Age</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={players()}>
                    {(player) => (
                      <tr 
                        class={`hover:bg-gray-50 cursor-pointer ${
                          selectedPlayer()?.id === player.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handlePlayerSelect(player)}
                      >
                        <td class="p-2 border">{player.PLYR_FIRSTNAME} {player.PLYR_LASTNAME}</td>
                        <td class="p-2 border text-center">{player.PLYR_JERSEYNUM}</td>
                        <td class="p-2 border text-center">{getPositionName(player.PLYR_POSITION)}</td>
                        <td class="p-2 border text-center">{player.PLYR_OVERALLRATING}</td>
                        <td class="p-2 border text-center">{player.PLYR_SPEED}</td>
                        <td class="p-2 border text-center">{player.PLYR_STRENGTH}</td>
                        <td class="p-2 border text-center">{player.PLYR_AWARENESS}</td>
                        <td class="p-2 border text-center">{player.PLYR_AGE}</td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Player Detail Column */}
          <div class="lg:col-span-1">
            <Show when={selectedPlayer()} fallback={
              <div class="bg-gray-50 p-6 rounded border text-center">
                <p class="text-gray-500">Select a player to view details</p>
              </div>
            }>
              <PlayerDetailComponent player={selectedPlayer()} />
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
};



export default RosterPage;