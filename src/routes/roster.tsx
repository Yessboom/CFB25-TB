import type { RouteSectionProps } from "@solidjs/router";
import RosterPage from "../components/RosterPageWithDetail";

export default function RosterRoute(props: RouteSectionProps) {
  return (
    <main class="max-w-screen-xl mx-auto p-4">
      <RosterPage />
    </main>
  );
}
