

// Helper function to convert position code to readable name
export function getPositionName(positionCode: string): string {
    const positions: Record<string, string> = {
      "0": "QB",
      "1": "HB",
      "2": "FB",
      "3": "WR",
      "4": "TE",
      "5": "LT",
      "6": "LG",
      "7": "C",
      "8": "RG",
      "9": "RT",
      "10": "LE",
      "11": "RE",
      "12": "DT",
      "13": "LOLB",
      "14": "MLB",
      "15": "ROLB",
      "16": "CB",
      "17": "FS",
      "18": "SS",
      "19": "K",
      "20": "P"
    };
  
    return positions[positionCode] || `POS(${positionCode})`;
  }

// Helper function to format height (convert inches to feet/inches)
export function formatHeight(inches: string | undefined): string {
    if (!inches) return "N/A";
    const inchesNum = parseInt(inches, 10);
    if (isNaN(inchesNum)) return inches;
    
    const feet = Math.floor(inchesNum / 12);
    const remainingInches = inchesNum % 12;
    const cm = Math.round(inchesNum * 2.54);
    //return `${feet}'${remainingInches}"`;
    return `${cm} cm`;
  }
  
  
// Helper function to format development trait
export function formatDevTrait(traitCode: string | undefined): string {
    if (!traitCode) return "N/A";
    
    const traits: Record<string, string> = {
      "0": "Normal",
      "1": "Impact",
      "2": "Star",
      "3": "Elite"
    };
    
    return traits[traitCode] || traitCode;
  }

  //Helper function to format weight
export function formatWeight(weight: string | undefined): string {
    if (!weight) return "N/A";
    const weightNum = parseInt(weight, 10);
    if (isNaN(weightNum)) return weight;
    
    const kg = Math.round((160+weightNum) * 0.453592);
    return `${kg} kg`;
  }