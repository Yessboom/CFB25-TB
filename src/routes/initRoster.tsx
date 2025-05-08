import { createResource, createSignal, Show } from "solid-js";
import { getRosters, createRosterFromInit } from "../lib/rosterApi"; 
import { useNavigate } from "@solidjs/router";

export default function InitRostersPage() {
  const [rosters] = createResource(() => getRosters());
  const [creating, setCreating] = createSignal(false);
  const [showPopup, setShowPopup] = createSignal(false);
  const [customRosterName, setCustomRosterName] = createSignal("");
  const [selectedRosterId, setSelectedRosterId] = createSignal<string | null>(null);
  const navigate = useNavigate();

  const openPopup = (id: string, defaultName: string) => {
    setSelectedRosterId(id);
    setCustomRosterName(defaultName);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setCustomRosterName("");
    setSelectedRosterId(null);
  };

  const confirmPopup = async () => {
    if (!selectedRosterId()) return;
    await handleCreateRoster(selectedRosterId()!, customRosterName());
    closePopup();
  };
  
  const handleCreateRoster = async (id: string, name: string) => {
    setCreating(true);
    try {
      const formData = new FormData();
      formData.append("initRosterId", id);
      formData.append("name", name);
      const newRoster = await createRosterFromInit(formData);
      navigate(`/rosters/${newRoster.id}`); // Redirect to new roster page
    } catch (err) {
      console.error("Failed to create roster", err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-4">Available Init Rosters</h2>
      <ul>
        {rosters()?.map((roster) => (
          <li class="mb-2 p-2 border rounded">
            <div class="flex justify-between items-center">
              <span>{roster.name}</span>
              <button
                class="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => openPopup(roster.id, roster.name)}
                disabled={creating()}
              >
                Use as Base
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Show when={showPopup()}>
        <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 class="text-lg font-semibold mb-4">Name your new roster</h3>
            <input
              class="w-full border px-3 py-2 rounded mb-4"
              type="text"
              value={customRosterName()}
              onInput={(e) => setCustomRosterName(e.currentTarget.value)}
            />
            <div class="flex justify-end space-x-2">
              <button class="px-4 py-2 bg-gray-300 rounded" onClick={closePopup}>
                Cancel
              </button>
              <button
                class="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={confirmPopup}
                disabled={creating()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}