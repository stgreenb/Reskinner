# Change Proposal: Add Movement Type Swapping

## Overview
Add a collapsible movement type management section to the Reskinner UI, similar to the existing damage type swap functionality. This will allow users to add, remove, and modify movement types (walk, fly, burrow, climb, swim) for monsters.

## Current System
- Movement is stored in `actor.system.movement` with structure:
  ```json
  "movement": {
    "value": 10,
    "types": ["walk"], 
    "hover": false,
    "disengage": 1
  }
  ```
- Damage type swapping already exists as a collapsible section with dropdowns
- No UI exists for modifying movement types currently

## Proposed Change
Add a new collapsible section "Movement Types" that allows:
- Adding movement types (teleport, fly, walk, swim, burrow, climb) to existing types array
- Removing movement types from the types array  
- Setting hover state for flying monsters
- Maintaining existing movement value and disengage settings

## Benefits
- Enhances monster customization capabilities
- Follows established UI patterns from damage type swapping
- Enables quick creation of flying, burrowing, or swimming variants
