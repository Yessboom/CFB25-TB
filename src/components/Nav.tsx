import { useLocation } from "@solidjs/router";
import { JSXElement, createSignal, Show, onMount, createEffect } from "solid-js";
import { checkAuth, isLoggedIn, setIsLoggedIn } from "../routes/api/auth";

type NavLinkProps = {
  href: string;
  children: JSXElement;
};
function NavLink(props: NavLinkProps) {
  const location = useLocation();
  const active = (path: string) =>
    path === location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600";
  return (
    <li class={`border-b-2 ${active(props.href)} mx-1.5 sm:mx-6`}>
      <a href={props.href}>{props.children}</a>
    </li>
  );
}

export default function Nav() {
  const location = useLocation();
  // initial check
  onMount(checkAuth);

  // check when we navigate to Home page (which we do on login and logout!)
  createEffect(() => {
    if (location.pathname == "/") checkAuth();
  });



  return (
    <nav class="bg-sky-800">
      <ul class="container flex items-center p-3 text-gray-200">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/about">About</NavLink>

        <Show when={!isLoggedIn()}>
          <NavLink href="/login">Login</NavLink>
        </Show>

        <Show when={isLoggedIn()}>
          <NavLink href="/roster">Roster</NavLink>
          <NavLink href="/initRoster">Init Roster</NavLink>
          <NavLink href="/rosters/myRosters">My Rosters</NavLink>
        </Show>
      </ul>
    </nav>
  );
}
