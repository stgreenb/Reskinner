/**
 * Role Modifiers for Draw Steel Monster Level Adjustment
 * Each role has a role modifier (for stamina calculation) and damage modifier
 */

export const ROLE_MODIFIERS = {
  ambusher: { role: 20, damage: 1 },
  artillery: { role: 10, damage: 1 },
  brute: { role: 30, damage: 1 },
  controller: { role: 10, damage: 0 },
  defender: { role: 30, damage: 0 },
  harrier: { role: 20, damage: 0 },
  hexer: { role: 10, damage: 0 },
  leader: { role: 0, damage: 1 },
  mount: { role: 20, damage: 0 },
  support: { role: 20, damage: 0 },
  elite: { role: 0, damage: 1 }
  // Note: leader and solo are both organizations and roles
};

/**
 * Organization Modifiers for Draw Steel Monster Level Adjustment
 * Multipliers for EV and stamina calculations
 */

export const ORGANIZATION_MODIFIERS = {
  'minion': 0.5,
  'horde': 0.5,
  'platoon': 1.0,
  'leader': 2.0,
  'elite': 2.0,
  'solo': 5.0
};

export const STAMINA_ONLY_MODIFIERS = {
  'minion': 0.125,
  'solo': 1.0  // This means "Stamina only"
};

/**
 * Tier Damage Modifiers for Draw Steel calculations
 */

export const TIER_DAMAGE_MODIFIERS = {
  1: 0.6,
  2: 1.1,
  3: 1.4
};
