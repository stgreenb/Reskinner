## Context
The Draw Steel system provides comprehensive mathematical formulas for adjusting monster levels, but these formulas involve multiple interdependent variables and special cases. The reskinner needs to implement these calculations accurately while providing a user-friendly interface that doesn't overwhelm GMs with the underlying complexity.

## Goals / Non-Goals
- **Goals**: 
  - Implement all 5 core calculation engines from Draw Steel monster adjustment rules
  - Provide intuitive UI for level, role, and organization selection
  - Apply calculations to all relevant actor system fields automatically
  - Preserve existing reskinner functionality
- **Non-Goals**:
  - Full monster creation from scratch (focus on adjusting existing monsters)
  - Advanced ability editing (stick to numerical adjustments)
  - Real-time validation against existing monster database

## Decisions
- **Decision: Collapsible Section Approach**
  - Add level adjustment as another collapsible section in existing form
  - Rationale: Maintains consistent UI pattern, doesn't increase initial form complexity
  - Alternatives considered: Separate tab, new modal window, multi-step wizard

- **Decision: Calculation Strategy**
  - Implement calculations as pure functions that take level/role/organization and return adjusted values
  - Rationale: Testable, reusable, and separates calculation logic from UI logic
  - Alternatives considered: Inline calculations in event handlers, stored calculation objects

- **Decision: Role/Organization Detection**
  - Default role/organization based on existing monster patterns when possible
  - Rationale: Reduces user workload while allowing manual override
  - Alternatives considered: Always require manual selection, attempt full auto-detection

## Risks / Trade-offs
- **Risk**: Complex formulas may produce unrealistic results for edge cases
  - **Mitigation**: Add validation warnings when results exceed typical ranges
- **Risk**: Current monster data may not have clear role/organization indicators
  - **Mitigation**: Provide tooltips with role descriptions and examples
- **Trade-off**: Full formula implementation vs. practical usability
  - **Balance**: Implement all core formulas but simplify advanced scenarios

## Migration Plan
1. **Phase 1**: Implement core calculation engines (EV, Stamina, Damage, Characteristics)
2. **Phase 2**: Add UI components and event handlers
3. **Phase 3**: Integrate with existing form submission logic
4. **Phase 4**: Add validation and user guidance features

## Resolved Design Decisions

### Level Detection Strategy
- **Decision**: Only offer level adjustment if `actor.system.details.level` exists
- **Rationale**: Existing monsters will always have level data; no fallback needed
- **Implementation**: Check for level existence, if missing → hide level adjustment section

### Validation Strategy  
- **Decision**: Defer complex validation rules to later iteration
- **Rationale**: Focus on core functionality first, add validation during testing phase
- **Implementation**: Basic validation only (level range 1-20) for initial release

### Ability Update Scope
- **Decision**: Start with signature ability damage updates only
- **Rationale**: Safest approach for initial implementation, can expand later
- **Implementation**: Update primary/signature ability damage values, flag for future expansion

### Role/Organization Detection
- **Decision**: Error out if base role/organization cannot be detected
- **Rationale**: Maintain data integrity, avoid calculations with missing inputs
- **Implementation**: Validate required data exists before showing level adjustment section

### Base Monster Data Detection Requirements
Before showing level adjustment section, validate:
- `actor.system.details.level` exists (required, integer 1-20)
- `actor.system.attributes.stamina` exists (required for reference)
- `actor.system.attributes.ev` exists (required for reference)

If ANY missing → hide section with error message: `"Level adjustment requires monster stat data that this actor lacks."`

### Validation Rules for Initial Release
- **Level**: Must be integer, range 1-20 (validate on input change)
- **Role**: Must be one of 12 defined roles (cannot be empty, validate on selection)
- **Organization**: Must be one of 8 defined org types (cannot be empty, validate on selection)
- **Error Handling**: Show clear error messages below invalid inputs
- **Success State**: Enable "Apply Level Adjustment" button only when all inputs valid

## Role and Organization Descriptions for Tooltips

### Role Descriptions (12 Roles)
- **Ambusher**: Melee warriors who slip by beefier heroes to reach squishy targets in back lines
- **Artillery**: Creatures who fight best from afar with powerful abilities at great distance
- **Brute**: Hardy creatures with lots of Stamina and damage, difficult to ignore and hard to escape
- **Controller**: Creatures who change battlefield with magic/psionics, reposition foes and alter terrain
- **Defender**: Tough creatures who take lots of damage and force enemies to attack them instead
- **Harrier**: Mobile warriors using hit-and-run tactics, maximize battlefield positioning
- **Hexer**: Specialists in debuffing enemies with conditions and other effects
- **Mount**: Mobile creatures meant to be ridden in combat, making riders more dangerous
- **Support**: Creatures who aid allies with buffs, healing, movement, or action options
- **Elite**: Functional opposite of minions, can stand up to 2 heroes of same level
- **Leader**: Powerful monster who buffs allies and grants additional actions, uses villain actions
- **Solo**: An encounter all on their own, can stand against 6 heroes of same level

### Organization Descriptions (8 Types)
- **Minion**: Weaker enemies made to die fast, threaten heroes en masse, support other monsters
- **Horde**: Hardier than minions, work in smaller groups, typically outnumber heroes 2:1
- **Platoon**: Highly organized, self-sufficient armies, one per hero threat level
- **Elite**: Hardy creatures, can stand up to 2 heroes of same level, high encounter value
- **Leader**: Powerful monster who buffs allies and grants actions, typically one per battle
- **Solo**: Complete encounter, can stand against 6 heroes of same level, special rules
- **Minion (Stamina only)**: Special minion variant with stamina-only calculations
- **Solo (Stamina only)**: Special solo variant with stamina-only calculations

### Role + Organization Interaction Notes
- **Leader**: Has no additional creature role (only Leader role)
- **Solo**: Has no additional creature role (only Solo role)
- **Elite**: Can be combined with other roles for +1 damage modifier (total +2)
- **Special Cases**: Minion and Solo organizations have stamina-only variants

## Preview Display Specification

### Preview Section Layout
The preview area should display calculated values in a clear, organized format:

```
📊 Level Adjustment Preview
─────────────────────────────
Current Level:   [current level]
Target Level:     [selected level]  
New EV:           [calculated EV]
New Stamina:      [calculated stamina]
Power Roll:       +[calculated bonus]
Characteristic:   +[calculated char]
Example Damage:   [Tier 1: X] [Tier 2: Y] [Tier 3: Z]
Status:           ✅ Ready to apply | ⚠️ Manual review advised
```

### Status Indicators
- **✅ Ready to apply**: All inputs valid, calculations complete
- **⚠️ Manual review advised**: Large level changes (±5+ levels) or extreme values
- **❌ Input errors**: Invalid selections, show error messages

## File Structure and Organization

### New Directory Structure
```
src/
├── reskinner-app.js              (modified: add level adjustment UI handlers)
├── calculators/                  (NEW directory)
│   ├── encounter-value.js        (EV calculation function)
│   ├── stamina.js                (Stamina calculation function)
│   ├── damage.js                 (Damage calculation function)
│   ├── characteristics.js        (Power roll & potencies)
│   ├── ability-scaling.js        (Multi-target damage adjustments)
│   └── index.js                  (Export all calculators)
├── constants/                    (NEW directory)
│   ├── modifiers.js              (Role & organization modifier constants)
│   └── helpers.js                (Echelon, tier mapping, utility functions)
├── module.js                     (maintained: no changes)
templates/
├── reskin-form.hbs               (modified: add level adjustment section)
src/
├── styles.css                    (modified: add styling for new controls)
lang/
├── en.json                       (modified: add localization keys)
```

### Module Organization Pattern
- **Constants**: Static data (modifiers, tier mappings) - no logic
- **Calculators**: Pure functions only - no side effects, easily testable
- **Helpers**: Utility functions (echelon calculation, validation)
- **UI Layer**: reskinner-app.js contains all UI logic and event handlers
- **Templates**: Handlebars only, no embedded JavaScript

## Migration Plan
1. **Phase 1**: Data foundations and level detection validation
2. **Phase 2**: Individual calculation engines (EV, Stamina, Damage, Characteristics, Ability Scaling)
3. **Phase 3**: UI components and styling
4. **Phase 4**: Event handlers and real-time preview
5. **Phase 5**: Form integration and signature ability updates
6. **Phase 6**: Localization, testing, and documentation
7. **Phase 7**: Future expansion - comprehensive ability updates and advanced validation

## Calculation Test Cases

### Example 1: EV for Level 5 Brute (Platoon)
- **Input**: level=5, organization='platoon'
- **Formula**: `((2 × 5) + 4) × 1.0`
- **Expected EV**: 14
- **Test**: `calculateEncounterValue(5, 'platoon') === 14`

### Example 2: EV for Level 3 Solo
- **Input**: level=3, organization='solo'
- **Formula**: `((2 × 3) + 4) × 6.0`
- **Expected EV**: 60
- **Test**: `calculateEncounterValue(3, 'solo') === 60`

### Example 3: Stamina for Level 7 Leader (Leader Organization)
- **Input**: level=7, role='leader', organization='leader'
- **Formula**: `((10 × 7) + 30) × 2.0`
- **Expected Stamina**: 200
- **Test**: `calculateStamina(7, 'leader', 'leader') === 200`

### Example 4: Damage for Level 4 Artillery (Tier 3)
- **Input**: level=4, damageModifier=1, tier=3, isStrike=false, characteristics=3, isHordeOrMinion=false
- **Formula**: `(4 + 4 + 1) × 1.4`
- **Expected Damage**: 10 (rounded up from 9.8)
- **Test**: `calculateDamage(4, 1, 3, false, 3, false) === 10`

### Example 5: Damage for Level 2 Minion (Tier 2)
- **Input**: level=2, damageModifier=0, tier=2, isStrike=true, characteristics=2, isHordeOrMinion=true
- **Formula**: `((4 + 2 + 0 + 2) × 1.1) ÷ 2`
- **Expected Damage**: 4 (rounded up from 3.85)
- **Test**: `calculateDamage(2, 0, 2, true, 2, true) === 4`

### Example 6: Characteristics for Level 6 Solo
- **Input**: level=6, isLeaderOrSolo=true
- **Echelon**: 2 (levels 6-8)
- **Base Power Roll**: 1 + 2 = 3
- **Solo Bonus**: +1 = 4 (max +5)
- **Expected**: 4
- **Test**: `calculateCharacteristics(6, true) === 4`

### Example 7: Echelon Boundary Tests
- **Input**: level=1 → Expected: 0
- **Input**: level=2 → Expected: 0  
- **Input**: level=3 → Expected: 1
- **Input**: level=5 → Expected: 1
- **Input**: level=6 → Expected: 2
- **Input**: level=8 → Expected: 2
- **Input**: level=9 → Expected: 3
- **Input**: level=10 → Expected: 3

## Function Architecture Patterns

### Pure Function Structure
```javascript
// Pattern: Pure function that calculates without side effects
export const calculateEncounterValue = (level, organization) => {
  const orgMod = ORGANIZATION_MODIFIERS[organization];
  if (!orgMod) throw new Error(`Unknown organization: ${organization}`);
  
  const ev = ((2 * level) + 4) * orgMod;
  return Math.ceil(ev);
};

// Test: Same inputs always produce same output
test('calculateEncounterValue is pure', () => {
  const result1 = calculateEncounterValue(5, 'platoon');
  const result2 = calculateEncounterValue(5, 'platoon');
  expect(result1).toBe(result2);
});
```

### Constants Pattern
```javascript
// Constants for role modifiers
export const ROLE_MODIFIERS = {
  ambusher: { role: 20, damage: 1 },
  artillery: { role: 10, damage: 1 },
  brute: { role: 30, damage: 1 },
  // ... all 12 roles
};

// Constants for organization modifiers
export const ORGANIZATION_MODIFIERS = {
  minion: 0.5,
  horde: 0.5,
  platoon: 1.0,
  leader: 2.0,
  elite: 2.0,
  solo: 6.0,
  'minion-stamina': 0.125,
  'solo-stamina': 5.0
};
```
