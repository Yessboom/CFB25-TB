import { createSignal, Show, For, createEffect } from 'solid-js';
import type { PlayerData, AttributeDefinition } from '../types';
import { getPositionName, formatDevTrait, formatHeight } from '../lib/utils';
import { attributeGroups } from '~/lib/attributeGroups';

interface PlayerDetailProps {
  player: PlayerData & { id: string } | null;
  editable?: boolean;
  onFieldChange?: (field: string, newValue: string) => void;
}


const PlayerDetailComponent = (props: PlayerDetailProps) => {
  const [activeTab, setActiveTab] = createSignal<string>('general');

  // Keep it and use it instead of AttributeDefinition if something breaks
  type AttributeItem = {
    key: string;
    label: string;
    format?: (value: string | undefined) => string;
  };



  const tabs = [
    { id: 'physical', label: 'Physical' },
    { id: 'general', label: 'General' },
    { id: 'ratings', label: 'Ratings' },
    { id: 'skills', label: 'Skills' },
    { id: 'traits', label: 'Traits' },
    //{ id: 'contract', label: 'Contract' },  #Not used in CFB
  ];

  return (
    <Show when={props.player}>
      <div class="bg-white border p-4 rounded-lg shadow-sm">
        <div class="flex items-center justify-between mb-4">
        {props.editable && props.onFieldChange ? (
    <div class="flex items-center space-x-2">
      {/* First Name */}
      <input
        type="text"
        class="text-xl font-bold border-b border-gray-300 focus:outline-none"
        value={props.player?.PLYR_FIRSTNAME}
        onInput={e =>
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
        onInput={e =>
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
        onInput={e =>
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
              {getPositionName(props.player?.PLYR_POSITION || '')}
            </div>
            <div class="px-2 py-1 bg-green-100 text-green-800 rounded font-semibold text-sm">
              OVR {props.player?.PLYR_OVERALLRATING}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div class="border-b mb-4">
          <nav class="flex space-x-4">
            <For each={tabs}>
              {(tab) => (
                <button
                  class={`py-2 px-3 text-sm font-medium ${
                    activeTab() === tab.id
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              )}
            </For>
          </nav>
        </div>

        {/* Tab Content */}
        <div class="grid grid-cols-2 gap-x-8 gap-y-2">
          <For each={attributeGroups[activeTab()]}>
            {attr => {
              const raw = props.player ? (props.player as any)[attr.key] : "";
              const display = attr.format?.(raw) ?? raw;
              return (
                <div class="flex justify-between py-1 border-b" data-key={attr.key}>
                  <span class="text-gray-600">{attr.label}:</span>
                  {props.editable && props.onFieldChange ? (
                    <input
                      class="border rounded px-1"
                      value={raw}
                      onInput={e =>
                        props.onFieldChange!(attr.key, e.currentTarget.value)
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
};

export default PlayerDetailComponent;