import { createResource, createEffect, createSignal, onCleanup, createMemo, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { getUserRosterById, updateRoster } from "../../lib/rosterApi";
import type { PlayerWithId, RosterData } from "../../types";
import { useAction } from "@solidjs/router";
import PlayerDetailComponent from "../../components/PlayerDetailComponent";
import PlayerList from "../../components/PlayerList";

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
  
  // Stable function reference to prevent rendering issues
  const handleSelectPlayer = (id: string) => {
    setSelectedPlayerId(id);
  };
  
  const selectedPlayer = createMemo<PlayerWithId | null>(() => {
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
      {/* Left column: PlayerList component */}
      <div class="w-1/3">
        <PlayerList 
          players={players()} 
          selectedPlayerId={selectedPlayerId()} 
          onSelectPlayer={handleSelectPlayer}
        />
      </div>

      {/* Right column: edit form */}
      <div class="w-2/3 border p-4 rounded bg-white">
        <Show when={selectedPlayer()} fallback={<p>Select a player to edit</p>}>
          <PlayerDetailComponent
            player={selectedPlayer()!}
            editable
            onFieldChange={(key, val) => {
              handleInputChange(selectedPlayer()!.id, key as keyof PlayerWithId, val);

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