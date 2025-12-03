## ADDED Requirements
### Requirement: Level Adjustment UI Section
The Reskinner window **SHALL** provide a collapsible "Level Adjustment" section with controls for target level, monster role, and organization selection.

#### Scenario: Balance Warning Display
- **WHEN** level adjustment section is first expanded
- **THEN** system displays a prominent warning message noting that level adjustments are approximations
- **AND** message advises GMs to review and adjust results for campaign balance
- **AND** warning acknowledges that unlike other reskinner features, this involves complex mechanical changes

#### Scenario: Expand Level Adjustment Section
- **WHEN** user clicks the "Level Adjustment" toggle button
- **THEN** the section expands to show level, role, and organization controls
- **AND** the toggle icon changes from right-pointing to down-pointing chevron

#### Scenario: Target Level Input
- **WHEN** level adjustment section is expanded
- **THEN** a numeric input field labeled "Target Level" is displayed
- **AND** the field is pre-filled with the current monster's detected level (if available)
- **AND** the input accepts values from 1 to 20

#### Scenario: Monster Role Selection
- **WHEN** level adjustment section is expanded
- **THEN** a dropdown labeled "Role" is displayed with 12 options:
- **AND** options include: Ambusher, Artillery, Brute, Controller, Defender, Harrier, Hexer, Mount, Support, Elite, Leader, Solo
- **AND** each option includes a tooltip with role description and typical characteristics

#### Scenario: Organization Selection
- **WHEN** level adjustment section is expanded
- **THEN** a dropdown labeled "Organization" is displayed with 8 options:
- **AND** options include: Minion, Horde, Platoon, Elite, Leader, Solo, Minion (Stamina only), Solo (Stamina only)
- **AND** each option includes tooltip with organization description and multiplier effects

### Requirement: Draw Steel Calculation Engine
The system **SHALL** implement all core calculation formulas from Draw Steel monster adjustment rules.

#### Scenario: Encounter Value Calculation
- **WHEN** user provides target level and organization
- **THEN** system calculates EV using: `((2 x Level) + 4) x Organization Modifier`
- **AND** result is rounded up to nearest whole number
- **AND** for minions, EV represents four minions together

#### Scenario: Stamina Calculation
- **WHEN** user provides target level, role, and organization
- **THEN** system calculates base stamina using: `((10 x Level) + Role Modifier) x Organization Modifier`
- **AND** result is rounded up to nearest whole number
- **AND** for non-minion monsters, system adds option for additional stamina: `(3 x Level) + 3`

#### Scenario: Damage Calculation
- **WHEN** user provides target level, role, and tier
- **THEN** system calculates baseline damage using: `(4 + Level + Damage Modifier) x Tier Modifier`
- **AND** for horde and minion monsters, divides result by 2
- **AND** for strike abilities, adds monster's highest characteristic to total
- **AND** uses tier modifiers: Tier 1 = 0.6, Tier 2 = 1.1, Tier 3 = 1.4

#### Scenario: Characteristic Adjustment
- **WHEN** user provides target level and role/organization
- **THEN** system calculates highest characteristic as: `1 + echelon` (where echelon = Math.ceil(level/3))
- **AND** for leader or solo monsters, increases characteristic by 1 (max +5)
- **AND** adjusts potencies based on characteristic minus tier distance from tier 3

#### Scenario: Ability Scaling Calculation
- **WHEN** abilities target additional creatures beyond default
- **THEN** system applies damage multipliers:
- **AND** one additional target: multiply damage by 0.8
- **AND** two or more additional targets: multiply damage by 0.5
- **AND** one fewer target than expected: multiply damage by 1.2

### Requirement: Level Adjustment Integration
The level adjustment calculations **SHALL** be integrated with the existing reskinner form submission process.

#### Scenario: Apply Level Adjustments
- **WHEN** user submits form with level adjustment changes
- **THEN** system applies all calculated values to the new actor
- **AND** updates actor.system.attributes.ev with calculated EV
- **AND** updates actor.system.attributes.stamina with calculated stamina
- **AND** updates all ability damage values with calculated damages
- **AND** updates characteristics and potencies throughout actor data

#### Scenario: Preserve Existing Functionality
- **WHEN** level adjustment is used alongside other reskinner features
- **THEN** name changes, damage type swaps, movement changes, and token image updates work as before
- **AND** level adjustments are applied after other transformations
- **AND** all changes are applied to the cloned actor only

#### Scenario: Validation and Preview
- **WHEN** user has unsaved level adjustment changes
- **THEN** system displays preview of calculated values before submission
- **AND** system validates that calculated values are within reasonable ranges
- **AND** system shows warnings for potentially unrealistic values

### Requirement: Role and Organization Data
The system **SHALL** maintain accurate reference data for all monster roles and organizations.

#### Scenario: Role Modifier Reference
- **WHEN** performing calculations
- **THEN** system uses correct role modifiers: Ambusher +20, Artillery +10, Brute +30, Controller +10, Defender +30, Harrier +20, Hexer +10, Mount +20, Support +20, Elite +0, Leader +30, Solo +30
- **AND** system uses correct damage modifiers: Ambusher +1, Artillery +1, Brute +1, Controller +0, Defender +0, Harrier +0, Hexer +0, Mount +0, Support +0, Elite +1, Leader +1, Solo +2

#### Scenario: Organization Modifier Reference
- **WHEN** performing calculations
- **THEN** system uses correct organization modifiers: Minion 0.5, Horde 0.5, Platoon 1.0, Leader 2.0, Elite 2.0, Solo 6.0, Minion (Stamina only) 0.125, Solo (Stamina only) 5.0

### Requirement: Level Adjustment Localization
All level adjustment UI elements **SHALL** be properly localized.

#### Scenario: Localized Labels
- **WHEN** level adjustment section is rendered
- **THEN** all labels, tooltips, and messages use localization keys from en.json
- **AND** section title uses "DSRESKINNER.LevelAdjustment.Title"
- **AND** form field labels use appropriate "DSRESKINNER.LevelAdjustment.*" keys
- **AND** role and organization descriptions are localized
