import { For } from "solid-js";
import type { PlayerWithId } from "../types";
import { getPositionName } from "../lib/utils";

interface PlayerListProps {
  players: PlayerWithId[];
  selectedPlayerId: string | null;
  onSelectPlayer: (id: string) => void;
}


export default function PlayerList(props: PlayerListProps) {
  return (
    <div class="overflow-auto max-h-[700px] w-full">
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
          <For each={props.players}>
            {(player) => (
              <tr
                class={`hover:bg-gray-50 cursor-pointer ${
                  props.selectedPlayerId === player.id ? "bg-blue-50" : ""
                }`}
                onClick={() => props.onSelectPlayer(player.id)}
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
                  <span
                    class={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                      parseInt(player.PLYR_OVERALLRATING) >= 85
                        ? "bg-green-100 text-green-800"
                        : parseInt(player.PLYR_OVERALLRATING) >= 75
                        ? "bg-blue-100 text-blue-800"
                        : parseInt(player.PLYR_OVERALLRATING) >= 65
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
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
  );
}
