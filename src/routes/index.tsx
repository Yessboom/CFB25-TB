import { A, createAsync} from "@solidjs/router";
import Counter from "~/components/Counter";
import { getUser, logout } from "~/lib";

export default function Home() {
  const user = createAsync(() => getUser(), { deferStream: true });
  return (
    <main class="w-full p-4 space-y-2">
      <h2 class="font-bold text-3xl">Hello {user()?.username}</h2>
      
      <h3 class="font-bold text-xl">Message board</h3>
      <form action={logout} method="post">
        <button name="logout" type="submit">
          Logout
        </button>
      </form>
    </main>
  );
}
