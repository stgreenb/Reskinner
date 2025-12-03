/**
 * Helper functions for Draw Steel Monster Level Adjustment
 */

/**
 * Calculate echelon based on level (Draw Steel system)
 * @param {number} level - Monster level (1-10)
 * @returns {number} Echelon (0-3)
 */
export const calculateEchelon = (level) => {
  if (level <= 2) return 0;  // Levels 1-2: Echelon 0
  if (level <= 5) return 1;  // Levels 3-5: Echelon 1  
  if (level <= 8) return 2;  // Levels 6-8: Echelon 2
  return 3;                  // Levels 9-10: Echelon 3
};

/**
 * Validate if actor has required data for level adjustment
 * @param {Actor} actor - Foundry actor to validate
 * @returns {boolean} True if actor has required data
 */
export const validateActorData = (actor) => {
  // Check for Draw Steel monster structure first (priority)
  if (actor?.system?.monster) {
    // If the monster has level data in the Draw Steel structure, return true
    if (actor.system.monster.level !== undefined && 
        actor.system.monster.level !== null) {
      return true;
    }
  }
  
  // Try alternative paths for level data - prioritize Draw Steel structure
  const levelPaths = [
    // Draw Steel monster structure (highest priority)
    'system.monster.level',
    // Standard D&D5e structure
    'system.details.level',
    // Other common structures
    'system.level',
    'system.attributes.level',
    'level',
    'data?.level',
    'data?.details?.level',
    'data?.attributes?.level',
    // Draw Steel alternative structures
    'system.combat.level',
    'system.biography.level',
    'details?.level',
    'attributes?.level',
    // Nested combat structures
    'system.combat?.details.level',
    'system.combat?.challenge.level',
    'system.combat?.xp.level',
  ];
  
  for (const path of levelPaths) {
    const value = getNestedProperty(actor, path);
    if (value !== undefined) {
      return true;
    }
  }
  
  return false;
};

/**
 * Helper function to get nested property safely
 * @param {Object} obj - Object to search
 * @param {string} path - Dot-separated path (e.g., 'system.details.level')
 * @returns {*} Property value or undefined
 */
function getNestedProperty(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

/**
 * Check if a level value is within valid range
 * @param {number} level - Level to validate
 * @returns {boolean} True if valid (1-20)
 */
export const validateLevel = (level) => {
  return Number.isInteger(level) && level >= 1 && level <= 20;
};

/**
 * Round up to nearest whole number (Draw Steel standard)
 * @param {number} value - Value to round
 * @returns {number} Rounded up value
 */
export const roundUp = (value) => Math.ceil(value);
