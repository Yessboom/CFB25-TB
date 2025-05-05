import { useLocation } from "@solidjs/router";
import { JSXElement, createSignal } from "solid-js";
import { getUser, logout } from "~/lib/index";


type NavLinkProps = {
  href: string;
  children: JSXElement;
}

function NavLink(props: NavLinkProps) {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname ? "border-sky-600" : "border-transparent hover:border-sky-600";
  return (
  <li class={`border-b-2 ${active(props.href)} mx-1.5 sm:mx-6`}>
    <a href={props.href}>{props.children}</a>
  </li>
  )
}
export default function Nav() {
  //const [isLoggedIn, setIsLoggedIn] = createSignal(getUser() !== undefined);
  return (
    <nav class="bg-sky-800">
      <ul class="container flex items-center p-3 text-gray-200">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/about">About</NavLink>
        <NavLink href="/roster">Roster</NavLink>
        <NavLink href="/initRoster">Init Roster</NavLink>  
        <NavLink href="/rosters/myRosters">my Roster</NavLink>      
        {/*{!isLoggedIn() && <NavLink href="/login">Login</NavLink>}*/}
        <NavLink href="/login">Login</NavLink>




      </ul>
    </nav>
  );
}