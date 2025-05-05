import { createResource } from "solid-js";
import { getUserRosters } from "../../lib/rosterApi";
import { useNavigate } from "@solidjs/router";

export default function MyRostersPage() {
  const [rosters] = createResource(() => getUserRosters());
  const navigate = useNavigate();

  // Interface for roster objects
  interface Roster {
    id: string;
    name: string;
  }

  const handleEditClick = (rosterId: string): void => {
    console.log("Navigating to roster ID:", rosterId);
    console.log("Navigation path:", `/rosters/${rosterId}`);
    navigate(`/rosters/${rosterId}`);
  };

  return (
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-4">My Rosters</h2>
      
      {rosters.loading && <p>Loading rosters...</p>}
      {rosters.error && <p class="text-red-600">Failed to load rosters: {rosters.error.message}</p>}
      
      <ul>
        {rosters()?.map((roster) => (
          <li class="mb-2 p-2 border rounded flex justify-between items-center">
            <span>{roster.name}</span>
            <div>
              <span class="mr-2 text-gray-500">ID: {roster.id}</span>
              <button
                class="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => handleEditClick(roster.id)}
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}