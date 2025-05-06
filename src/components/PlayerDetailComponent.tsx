import {
  createSignal,
  createEffect,
  createMemo,
  Show,
  For
} from "solid-js";
import type { PlayerData, AttributeDefinition } from "../types";
import { getPositionName, formatDevTrait, formatHeight } from "../lib/utils";
import { attributeGroups } from "~/lib/attributeGroups";

interface PlayerDetailProps {
  player: PlayerData & { id: string } | null;
  editable?: boolean;
  onFieldChange?: (field: string, newValue: string) => void;
}

export default function PlayerDetailComponent(props: PlayerDetailProps) {
  // 1) Top‐level categories → maps to one or more attributeGroups keys
  const categoryGroups: Record<string, string[]> = {
    Physical: ["physical"],
    //General: ["general"],
    DefensiveSkills: ["defensiveSkills"],
    //Ratings: ["ratings"],
    OffensiveSkills: [
      "receivingSkills",
      "runningBackSkills",
      "quarterbackSkills",
      "blockingSkills",
    ],
    SpecialTeams: ["kickingSkills"],
    Traits: ["traits"]
  };
  const categories = Object.keys(categoryGroups);

  const [selectedCategory, setSelectedCategory] =
    createSignal(categories[0]);
  const subGroups = createMemo(
    () => categoryGroups[selectedCategory()] || []
  );
  const [selectedSubGroup, setSelectedSubGroup] = createSignal(
    subGroups()[0] || ""
  );

  // whenever category changes, reset sub‐group to first
  createEffect(() => {
    const subs = subGroups();
    setSelectedSubGroup(subs[0] || "");
  });

  // finally derive the actual attributes to render
  const attributeList = createMemo<AttributeDefinition[]>(
    () => attributeGroups[selectedSubGroup()] || []
  );

  return (
    <Show when={props.player}>
      <div class="bg-white border p-4 rounded-lg shadow-sm">
        {/* Player name / jersey (editable or static) */}
        <div class="flex items-center justify-between mb-4">
          {props.editable && props.onFieldChange ? (
            <div class="flex items-center space-x-2">
              {/* First Name */}
              <input
                type="text"
                class="text-xl font-bold border-b border-gray-300 focus:outline-none"
                value={props.player?.PLYR_FIRSTNAME}
                onInput={(e) =>
                  props.onFieldChange!(
                    "PLYR_FIRSTNAME",
                    e.currentTarget.value
                  )
                }
              />
              {/* Last Name */}
              <input
                type="text"
                class="text-xl font-bold border-b border-gray-300 focus:outline-none"
                value={props.player?.PLYR_LASTNAME}
                onInput={(e) =>
                  props.onFieldChange!(
                    "PLYR_LASTNAME",
                    e.currentTarget.value
                  )
                }
              />
              {/* Jersey Number */}
              <span class="text-gray-500">#</span>
              <input
                type="number"
                class="text-xl font-bold border-b border-gray-300 w-16 focus:outline-none"
                value={props.player?.PLYR_JERSEYNUM}
                onInput={(e) =>
                  props.onFieldChange!(
                    "PLYR_JERSEYNUM",
                    e.currentTarget.value
                  )
                }
              />
            </div>
          ) : (
            <h2 class="text-xl font-bold">
              {props.player?.PLYR_FIRSTNAME} {props.player?.PLYR_LASTNAME}{" "}
              <span class="text-gray-500 ml-2">
                #{props.player?.PLYR_JERSEYNUM}
              </span>
            </h2>
          )}

          <div class="flex space-x-1">
            <div class="px-2 py-1 bg-blue-100 text-blue-800 rounded font-semibold text-sm">
              {getPositionName(props.player?.PLYR_POSITION || "")}
            </div>
            <div class="px-2 py-1 bg-green-100 text-green-800 rounded font-semibold text-sm">
              OVR {props.player?.PLYR_OVERALLRATING}
            </div>
          </div>
        </div>

        {/* Top‐level tabs */}
        <nav class="flex space-x-4 border-b mb-2">
          <For each={categories}>
            {(cat) => (
              <button
                class={`py-2 px-3 text-sm font-medium ${
                  selectedCategory() === cat
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            )}
          </For>
        </nav>

        {/* Sub‐tabs */}
        <Show when={subGroups().length > 1}>
          <nav class="flex space-x-4 border-b mb-4">
            <For each={subGroups()}>
              {(sg) => (
                <button
                  class={`py-1 px-2 text-sm ${
                    selectedSubGroup() === sg
                      ? "border-b-2 border-green-500 text-green-700"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setSelectedSubGroup(sg)}
                >
                  {sg.replace(/([A-Z])/g, " $1").trim()}
                </button>
              )}
            </For>
          </nav>
        </Show>

        {/* Tab content */}
        <div class="grid grid-cols-2 gap-x-8 gap-y-2">
          <For each={attributeList()}>
            {(attr) => {
              const raw = (props.player as any)[attr.key] ?? "";
              const display = attr.format?.(raw) ?? raw;
              return (
                <div
                  class="flex justify-between py-1 border-b"
                  data-key={attr.key}
                >
                  <span class="text-gray-600">{attr.label}:</span>
                  {props.editable && props.onFieldChange ? (
                    <input
                      class="border rounded px-1"
                      value={raw}
                      onInput={(e) =>
                        props.onFieldChange!(
                          attr.key,
                          e.currentTarget.value
                        )
                      }
                    />
                  ) : (
                    <span class="font-medium">{display || "N/A"}</span>
                  )}
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </Show>
  );
}