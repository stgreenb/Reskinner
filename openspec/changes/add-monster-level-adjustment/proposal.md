# Change: Add Monster Level Adjustment

## Why
Game Masters need the ability to scale existing monsters to different encounter levels while maintaining proper Draw Steel balance. The current reskinner tool handles cosmetic changes (name, damage types, movement, images) but lacks the mechanical scaling capabilities outlined in the Draw Steel monster adjustment rules.

**⚠️ Important Balance Consideration**: Unlike existing reskinner features that are cosmetic and perfectly safe, level adjustment involves complex mathematical formulas that may not produce perfectly balanced monsters. This feature provides approximation tools based on Draw Steel guidelines, but GMs should review and adjust results as needed for their specific campaigns.

## What Changes
- Add a new collapsible "Level Adjustment" section to the existing reskin interface
- Implement the 5 core calculation engines from AdjustingMonsters.md:
  - Encounter Value (EV) calculation: `((2 x Level) + 4) x Organization Modifier`
  - Stamina calculation: `((10 x Level) + Role Modifier) x Organization Modifier`
  - Damage calculation: `(4 + Level + Damage Modifier) x Tier Modifier`
  - Characteristic adjustment: Echelon-based power roll bonuses and potencies
  - Ability scaling: Multi-target damage adjustments and special modifiers
- Add UI controls for:
  - Target level input (numeric field)
  - Monster role selection (12 options: Ambusher, Artillery, Brute, Controller, Defender, Harrier, Hexer, Mount, Support, Elite, Leader, Solo)
  - Organization selection (8 options: Minion, Horde, Platoon, Elite, Leader, Solo, with stamina-only variants)
- Apply calculated values to all relevant actor system fields when creating reskinned monster
- Maintain all existing functionality (name change, damage type swap, movement types, token image)

## Impact
- **Version Increment**: Major feature bump to v0.4.x (complex mechanical calculations require new version tier)
- **Affected specs**: New capability `level-adjustment` to be created
- **Affected code**: 
  - `src/reskinner-app.js` - Add level adjustment logic and UI handlers
  - `templates/reskin-form.hbs` - Add level adjustment section UI
  - `src/styles.css` - Add styling for new level adjustment controls
  - `lang/en.json` - Add localization strings for level adjustment UI
- **Breaking changes**: None - additive feature only
- **Complexity**: High - involves complex mathematical formulas and Draw Steel system integration
- **Balance Warning**: Feature produces approximations that may need manual GM adjustment for perfect balance
