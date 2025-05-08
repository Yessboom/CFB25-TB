import { Index, createMemo } from "solid-js";
import type { PlayerWithId } from "../types";
import handle from "mqtt/lib/handlers/index";

interface PlayerListProps {
  players: PlayerWithId[];
  selectedPlayerId: string | null;
  onSelectPlayer: (id: string) => void;
}

export default function PlayerList(props: PlayerListProps) {
    const stablePlayers = createMemo(() => props.players);
    return (
        <ul class="w-full space-y-2">
          <Index each={stablePlayers()}>
            {(pl, index) => {
              // Memoize the click handler to prevent recreation on each render
              const handleClick = () => props.onSelectPlayer(pl().id);
              
              return (
                <li
                  class={`p-2 border rounded cursor-pointer ${
                    props.selectedPlayerId === pl().id ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                  onClick={handleClick}
                >
                  {pl().PLYR_FIRSTNAME} {pl().PLYR_LASTNAME}
                </li>
              );
            }}
          </Index>
        </ul>
      );
    }