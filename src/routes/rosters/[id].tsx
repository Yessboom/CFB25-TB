import { createResource, Index, createEffect, createSignal, onCleanup, createMemo, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { getUserRosterById, updateRoster } from "../../lib/rosterApi";
import type { PlayerWithId, RosterData } from "../../types";
import { useAction } from "@solidjs/router";
import PlayerDetailComponent from "../../components/PlayerDetailComponent";

export default function RosterDetailPage() {
  const params = useParams();
  const [roster] = createResource(() => params.id, getUserRosterById);
  const [editedRoster, setEditedRoster] = createSignal<RosterData | null>(null);
  const updateRosterAction = useAction(updateRoster);
  const saveTimeouts = new Map<string, number>(); 

  // load into our editable signal
  createEffect(() => {
    if (roster()) setEditedRoster(roster()!);
  });

  // derive an array of players for the list
  const players = createMemo(() => {
    const data = editedRoster();
    if (!data) return [] as PlayerWithId[];
    return Object.entries(data).map(([id, pl]) => ({ ...pl, id })) as PlayerWithId[];
  });

  // pick one to edit in the detail panel
  const [selectedPlayerId, setSelectedPlayerId] = createSignal<string | null>(null);
  const selectedPlayer = createMemo< PlayerWithId | null>(() => {
    const id = selectedPlayerId();
    const data = editedRoster();
    return id && data ? ({ id, ...data[id] } as PlayerWithId) : null;
  });

  const handleInputChange = (id: string, field: keyof PlayerWithId, value: string) => {
    setEditedRoster(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [id]: { ...prev[id], [field]: value }
      };
    });
  };

  onCleanup(() => saveTimeouts.forEach(clearTimeout));

  return (
    <div class="flex space-x-4 p-4">
      {/* Left column: click to select */}
      <ul class="w-1/3 space-y-2">
        <Index each={players()}>
          {pl => (
            <li
              class={`p-2 border rounded cursor-pointer ${
                selectedPlayerId() === pl().id ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedPlayerId(pl().id)}
            >
              {pl().PLYR_FIRSTNAME} {pl().PLYR_LASTNAME}
            </li>
          )}
        </Index>
      </ul>

      {/* Right column: edit form */}
      <div class="w-2/3 border p-4 rounded bg-white">
        <Show when={selectedPlayer()} fallback={<p>Select a player to edit</p>}>
          <PlayerDetailComponent
            player={selectedPlayer()!}
            editable
            onFieldChange={(key, val) => {
              handleInputChange(selectedPlayer()!.id, key as keyof PlayerWithId, val);
              // schedule auto-save
              const prev = saveTimeouts.get(selectedPlayer()!.id);
              if (prev) clearTimeout(prev);
              const tid = window.setTimeout(() => {
                updateRosterAction([params.id, editedRoster()!]);
              }, 2000);
              saveTimeouts.set(selectedPlayer()!.id, tid);
            }}
          />
        </Show>
      </div>
    </div>
  );
}