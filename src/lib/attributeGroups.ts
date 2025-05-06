import type { PlayerData, AttributeDefinition } from '../types';
import { getPositionName, formatDevTrait, formatHeight, formatWeight } from '../lib/utils';



// Group player attributes by category
 
export const attributeGroups: Record<string, AttributeDefinition[]> = {
    general: [
      { key: 'PLYR_FIRSTNAME', label: 'First Name' },
      { key: 'PLYR_LASTNAME', label: 'Last Name' },
      { key: 'PLYR_JERSEYNUM', label: 'Jersey Number' },
      { key: 'PLYR_AGE', label: 'Age' },
      { key: 'PLYR_HEIGHT', label: 'Height', format: formatHeight },
      { key: 'PLYR_WEIGHT', label: 'Weight', format: formatWeight },
      { key: 'PLYR_HOME_TOWN', label: 'Hometown' },

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

    receivingSkills: [
      { key: 'PLYR_CATCHING', label: 'Catching' },
        { key: 'PLYR_CATCHINTRAFFIC', label: 'Catching in Traffic' },
        { key: 'PLYR_SPECTACULARCATCH', label: 'Spectacular Catch' },
        { key: 'PLYR_RELEASE', label: 'Release' },
        { key: 'PLYR_MEDROUTERUN', label: 'Medium Route Run' },
        { key: 'PLYR_SHORTROUTERUN', label: 'Short Route Run' },
        { key: 'PLYR_DEEPROUTERUN', label: 'Deep Route Run' },
    ],
    blockingSkills: [
      { key: 'PLYR_RUNBLOCK', label: 'Run Block' },
      { key: 'PLYR_PASSBLOCK', label: 'Pass Block' },
      { key: 'PLYR_IMPACTBLOCKING', label: 'Impact Blocking' },
      { key: 'PLYR_RUNBLOCKPOWER', label: 'Run Block Power' },
      { key: 'PLYR_RUNBLOCKFINESSE', label: 'Run Block Finesse' },
      { key: 'PLYR_PASSBLOCKPOWER', label: 'Pass Block Power' },
      { key: 'PLYR_PASSBLOCKFINESSE', label: 'Pass Block Finesse' },
      { key: 'PLYR_LEADBLOCK', label: 'Lead Block' },
    ],
    defensiveSkills: [
        { key: 'PLYR_TACKLE', label: 'Tackle' },
        { key: 'PLYR_BLOCKSHEDDING', label: 'Block Shedding' },
        { key: 'PLYR_POWERMOVES', label: 'Power Moves' },
        { key: 'PLYR_FINESSEMOVES', label: 'Finesse Moves' },
        { key: 'PLYR_PURSUIT', label: 'Pursuit' },
        { key: 'PLYR_PLAYRECOGNITION', label: 'Play Recognition' },
        { key: 'PLYR_ZONECOVERAGE', label: 'Zone Coverage' },
        { key: 'PLYR_MANCOVERAGE', label: 'Man Coverage' },
        { key: 'PLYR_PRESS', label: 'Press' },
        { key : 'PLYR_HITPOWER', label: 'Hit Power' },
    ],
    kickingSkills: [
      { key: 'PLYR_KICKPOWER', label: 'Kick Power' },
      { key: 'PLYR_KICKACCURACY', label: 'Kick Accuracy' },
      { key: 'PLYR_LONGSNAPRATING', label: 'Long Snap Rating' },
    ],
    quarterbackSkills: [
      { key: 'PLYR_THROWPOWER', label: 'Throw Power' },
      { key: 'PLYR_THROWACCURACY', label: 'Throw Accuracy' },
      { key: 'PLYR_THROWACCURACYSHORT', label: 'Throw Accuracy Short' },
      { key: 'PLYR_THROWACCURACYMID', label: 'Throw Accuracy Mid' },
      { key: 'PLYR_THROWACCURACYDEEP', label: 'Throw Accuracy Deep' },
      { key: 'PLYR_PLAYACTION', label: 'Play Action' },
      { key: 'PLYR_THROWONTHERUN', label: 'Throw on the Run' },
      { key: 'PLYR_BREAKSACK', label: 'Break Sack' },
      { key: 'PLYR_THROWUNDERPRESSURE', label: 'Throw Under Pressure' },

    ],
    runningBackSkills: [
      { key: 'PLYR_CARRYING', label: 'Carrying' },
      { key: 'PLYR_TRUCKING', label: 'Trucking' },
      { key: 'PLYR_BREAKTACKLE', label: 'Break Tackle' },
      { key: 'PLYR_JUKEMOVE', label: 'Juke Move' },
      { key: 'PLYR_SPINMOVE', label: 'Spin Move' },
      { key: 'PLYR_STIFFARM', label: 'Stiff Arm' },
      { key: 'PLYR_BCVISION', label: 'Ball Carrier Vision' },
      { key: 'PLYR_KICKRETURN', label: 'Kick Return' },
    ],

    traits: [
      { key: 'PLYR_INJURY', label: 'Injury' },
      { key: 'PLYR_STAMINA', label: 'Stamina' },
      { key: 'PLYR_TOUGHNESS', label: 'Toughness' },
      { key: 'PLYR_TRAITDEVELOPMENT', label: 'Development Trait', format: formatDevTrait },
      { key: 'PLYR_MORALE', label: 'Morale' },
      {key : "PLYR_RUNNINGSTYLE", label: "Running Style"},
    ],
    notUsed: [
      //These are not used in CFB, but keeping them for future use
      { key: 'PLYR_CONTRACTYEARSLEFT', label: 'Contract Years Left' },
      { key: 'PLYR_VALIDTOTALSALARY', label: 'Total Salary' },
      { key: 'PLYR_VALIDSIGNBONUS', label: 'Signing Bonus' },
      { key: 'PLYR_SALARY1', label: 'Annual Salary' },
      { key: 'PLYR_VALIDCONTRACTLEN', label: 'Contract Length' },
      { key: 'PLYR_FLAGPROBOWL', label: 'Flag Pro Bowl' },
      { key: 'PLYR_PREVTEAMID', label: 'Previous Team ID' },
      {key: 'PLYR_PERFORMLEVEL', label: 'Performance Level'},
      {key: 'PLYR_CONSECYEARSWITHTEAM', label: ' Consecutive years with team'},
      {key: 'PLYR_CAPTAINSPATCH', label: 'Captain Patch'},
      {key: 'PLYR_CAREERPHASE', label: 'Career Phase'},
      {key: 'PLYR_EGO', label: 'Ego'},
      { key: 'PLYR_ISCAPTAIN', label: 'Is Captain' },
      { key: 'PLYR_FATIGUE', label: 'Fatigue' },
      
      {key: "PLYR_COMMENT", label: "Comment"},
      {key: 'PLYR_POTENTIAL', label: 'Potential'},
      {key: 'PLYR_MIN_OVR', label: 'Minimum Overall'},
      { key: 'PLYR_HOME_STATE', label: 'State'  }, 
      { key: 'PLYR_COLLEGE', label: 'College' },



    ],
    aboutThePlayer: [
        { key: 'PLYR_PORTRAIT', label: 'Portrait' },
        { key: 'PLYR_SCHOOLYEAR', label: 'School Year' },
        { key: 'PLYR_IS_IMPACT_PLAYER', label: 'Is Impact Player' },
        { key: 'PLYR_REDSHIRTED', label: 'Redshirted' },
        { key: 'PLYR_CHARACTERBODYTYPE', label: 'Character Body Type (from 0 to 3)' },
        { key: 'PLYR_ROLE2', label: 'Sub-role in position' },
        { key: 'PLYR_PLAYERTYPE', label: 'Player Type (Sub role in position?)' },

        { key: 'PLYR_BIRTHDATE', label: 'Birthdate' },

        
        { key: 'PLYR_QBSTYLE', label: 'QB Style' },
        { key: 'PLYR_STANCE', label: 'Stance' },

        { key: 'PLYR_HANDEDNESS', label: 'Handedness' },
        { key: 'PLYR_MUSCLE', label: 'Muscle' },
        { key: 'PLYR_STYLE', label: 'Style' },

    ],

    unknown: [
        //I have no idea what these are, but they are in the game
        {key: 'PLYR_TOP', label: 'Top'},
        {key: 'PLYR_BOTTOM', label: 'Bottom'},
        {key: 'PLYR_VISMOVETYPE', label: 'Vis Move Type ??'},
        { key: "PLYR_SLEEVETEMPERATURE", label: "Sleeve Temperature" },
        { key: 'PLYR_RESERVEDUINT10', label: 'Reserved UINT 10' },
        { key: 'PLYR_ICON', label: 'Icon' },
        { key: 'PLYR_IS_GUEST_STAR', label: 'Is Guest Star' },
        { key: 'PLYR_PORTRAIT_SWAPPABLE_LIBRARY_PATH', label: 'Portrait Swappable Library Path' },
        { key: 'PLYR_PORTRAIT_FORCE_SILHOUETTE', label: 'Portrait Force Silhouette' },
        { key: 'PLYR_IS_EDIT_ALLOWED', label: 'Is Edit Allowed' },
        { key: 'PLYR_GENERICHEAD', label: 'Generic Head' },
        { key: 'PLYR_ASSETNAME', label: 'Asset Name' },
        { key: 'PLYR_RESERVED1', label: 'Reserved 1' },
        {key: 'PLYR_ORIGID', label: 'Original ID'},
        {key: 'PLYR_POSITION', label: 'Position'},






    ]


  };


