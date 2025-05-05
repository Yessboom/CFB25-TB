import { createResource, createSignal } from "solid-js";
import { getRosters, createRosterFromInit } from "../lib/rosterApi"; 
import { useNavigate } from "@solidjs/router";

export default function InitRostersPage() {
  const [rosters] = createResource(() => getRosters());
  const [creating, setCreating] = createSignal(false);
  const navigate = useNavigate();

  const handleCreateRoster = async (id: string, name: string) => {
    setCreating(true);
    try {
      const formData = new FormData();
      formData.append("initRosterId", id);
      formData.append("name", `My ${name}`);
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
                onClick={() => handleCreateRoster(roster.id, roster.name)}
                disabled={creating()}
              >
                Use as Base
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
