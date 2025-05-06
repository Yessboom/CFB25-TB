import { createSignal, Show, For } from 'solid-js';
import type { PlayerData, AttributeDefinition } from '../types';
import { getPositionName, formatDevTrait, formatHeight } from '../lib/utils';

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

  // Group player attributes by category
  const attributeGroups: Record<string, AttributeDefinition[]> = {
    general: [
      { key: 'PLYR_FIRSTNAME', label: 'First Name' },
      { key: 'PLYR_LASTNAME', label: 'Last Name' },
      { key: 'PLYR_JERSEYNUM', label: 'Jersey Number' },
      { key: 'PLYR_AGE', label: 'Age' },
      { key: 'PLYR_HEIGHT', label: 'Height', format: formatHeight },
      { key: 'PLYR_WEIGHT', label: 'Weight' },
      { key: 'PLYR_HOME_TOWN', label: 'Hometown' },
      //{ key: 'PLYR_HOME_STATE', label: 'State', format: formatState }, #Not really needed
      //{ key: 'PLYR_COLLEGE', label: 'College', format: formatCollege }, #Not used in CFB
    ],

    physical: [
      { key: 'PLYR_SPEED', label: 'Speed' },
      { key: 'PLYR_ACCELERATION', label: 'Acceleration' },
      { key: 'PLYR_AGILITY', label: 'Agility' },
      { key: 'PLYR_STRENGTH', label: 'Strength' },
      { key: 'PLYR_AWARENESS', label: 'Awareness' },
      { key: 'PLYR_JUMPING', label: 'Jumping' },
      { key: 'PLYR_INJURY', label: 'Injury' },
      { key: 'PLYR_STAMINA', label: 'Stamina' },
      { key: 'PLYR_TOUGHNESS', label: 'Toughness' },
    ],


    ratings: [
      { key: 'PLYR_OVERALLRATING', label: 'Overall Rating' },
      { key: 'PLYR_SPEED', label: 'Speed' },
      { key: 'PLYR_ACCELERATION', label: 'Acceleration' },
      { key: 'PLYR_AGILITY', label: 'Agility' },
      { key: 'PLYR_STRENGTH', label: 'Strength' },
      { key: 'PLYR_AWARENESS', label: 'Awareness' },
      { key: 'PLYR_POTENTIAL', label: 'Potential' },
    ],
    skills: [
      { key: 'PLYR_CARRYING', label: 'Carrying' },
      { key: 'PLYR_CATCHING', label: 'Catching' },
      { key: 'PLYR_TACKLE', label: 'Tackle' },
      { key: 'PLYR_JUMPING', label: 'Jumping' },
      { key: 'PLYR_HITPOWER', label: 'Hit Power' },
      { key: 'PLYR_THROWPOWER', label: 'Throw Power' },
      { key: 'PLYR_THROWACCURACY', label: 'Throw Accuracy' },
      { key: 'PLYR_KICKPOWER', label: 'Kick Power' },
      { key: 'PLYR_KICKACCURACY', label: 'Kick Accuracy' },
    ],
    traits: [
      { key: 'PLYR_INJURY', label: 'Injury' },
      { key: 'PLYR_STAMINA', label: 'Stamina' },
      { key: 'PLYR_TOUGHNESS', label: 'Toughness' },
      { key: 'PLYR_TRAITDEVELOPMENT', label: 'Development Trait', format: formatDevTrait },
      { key: 'PLYR_MORALE', label: 'Morale' },
    ],
    contract: [
      //These are not used in CFB, but keeping them for future use
      { key: 'PLYR_CONTRACTYEARSLEFT', label: 'Contract Years Left' },
      { key: 'PLYR_VALIDTOTALSALARY', label: 'Total Salary' },
      { key: 'PLYR_VALIDSIGNBONUS', label: 'Signing Bonus' },
      { key: 'PLYR_SALARY1', label: 'Annual Salary' },
      { key: 'PLYR_VALIDCONTRACTLEN', label: 'Contract Length' },
    ]
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
          <h2 class="text-xl font-bold">
            {props.player?.PLYR_FIRSTNAME} {props.player?.PLYR_LASTNAME} 
            <span class="text-gray-500 ml-2">#{props.player?.PLYR_JERSEYNUM}</span>
          </h2>
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