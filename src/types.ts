
export interface RosterEntry {
    id: string;
    name: string;
  }
  
  // Player data structure from roster JSON
  export interface PlayerData {
    PLYR_ID: string;
    PLYR_FIRSTNAME: string;
    PLYR_LASTNAME: string;
    PLYR_JERSEYNUM: string;
    PLYR_POSITION: string;
    PLYR_OVERALLRATING: string;
    PLYR_SPEED: string;
    PLYR_ACCELERATION: string;
    PLYR_STRENGTH: string;
    PLYR_AGILITY: string;
    PLYR_AWARENESS: string;
    PLYR_CATCHING: string;
    PLYR_CARRYING: string;
    PLYR_THROWPOWER: string;
    PLYR_THROWACCURACY: string;
    PLYR_KICKPOWER: string;
    PLYR_KICKACCURACY: string;
    PLYR_RUNBLOCK: string;
    PLYR_PASSBLOCK: string;
    PLYR_TACKLE: string;
    PLYR_JUMPING: string;
    PLYR_KICKRETURN: string;
    PLYR_INJURY: string;
    PLYR_STAMINA: string;
    PLYR_TOUGHNESS: string;
    PLYR_HEIGHT: string;
    PLYR_WEIGHT: string;
    PLYR_AGE: string;
    PLYR_CONTRACTYEARSLEFT: string;
    PLYR_HOME_TOWN?: string;
    PLYR_HOME_STATE?: string;
    PLYR_COLLEGE?: string;
    PLYR_TRAITDEVELOPMENT?: string;
    PLYR_POTENTIAL?: string;
    PLYR_HITPOWER?: string;
    PLYR_MORALE?: string;
    PLYR_VALIDTOTALSALARY?: string;
    PLYR_VALIDSIGNBONUS?: string;
    PLYR_SALARY1?: string;
    PLYR_VALIDCONTRACTLEN?: string;
    // Allow for any other player attributes that might be in the data
    [key: string]: string | number | boolean | undefined;

  }
  
  // Complete roster data structure
  export interface RosterData {
    [playerId: string]: PlayerData;
  }
  
  // InitRoster model as defined in your Prisma schema
  export interface InitRoster {
    id: string;
    name: string;
    dataRoster: RosterData;
    dataVisual: any; //TODO: Replace latter with the correct type
  }
  
  // Position code mapping
  export interface PositionMap {
    [code: string]: string;
  }
  
  // Attribute definition for displaying player details
  export interface AttributeDefinition {
    key: string;
    label: string;
    format?: (value: string) => string;
  }

  // Type for a player with ID included (for selection purposes)
export type PlayerWithId = PlayerData & { id: string };