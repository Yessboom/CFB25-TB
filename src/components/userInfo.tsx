import { createResource, Show } from "solid-js";
import { getUser, logout } from "../lib/index";
import { A } from "@solidjs/router";

function preloadUser() {
    const [user] = createResource(() => getUser());
    return user;
  }

export default function UserInfo() {
    const user = preloadUser();
  return (
    <div class="user-info">
      <Show when={!user.loading} fallback={<p>Loading user info...</p>}>
        <Show when={user()} fallback={<A href="/login">Login</A>}>
          <p>Logged in as: <strong>{user()?.username}</strong></p>
          <form action={logout} method="post">
            <button type="submit">Logout</button>
          </form>
        </Show>
      </Show>
    </div>
  );
}
