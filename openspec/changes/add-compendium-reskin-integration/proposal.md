# OpenSpec: Add Compendium Reskin Integration

## Capability: Monster Sheet Top Bar Integration

As a user of the Draw Steel Reskinner module, I want to access the reskin functionality from the top bar of a monster's sheet, in addition to the current right-click context menu, so that I can quickly reskin monsters without having to navigate through alternative interfaces.

## Capability: Compendium Reskin Functionality

As a user of the Draw Steel Reskinner module, I want to reskin monsters directly from compendiums when importing them, so that I can efficiently customize monsters during the import process without requiring separate steps.

## Current State

Currently, the reskinner module can be accessed by right-clicking on a monster in the actors tab, which adds a context menu option. This provides basic reskin functionality after the actor has been imported into the world or exists in the actor directory.

## Requested Features

1. Add "Reskin" button to monster sheet headers for direct access during monster viewing/editing
2. Extend compendium integration to allow reskinnable import of monsters from compendium packs, where users can reskin while importing a monster from a compendium directly

## Implementation Approaches

### Monster Sheet Top Bar Integration:
- Utilize the Foundry VTT `getActorSheetHeaderButtons` hook to add a button to monster sheet headers
- The button should appear only for compatible Draw Steel monsters that can be reskinned
- Clicking the button opens the same ReskinApp interface currently used

### Compendium Reskin Functionality:
- Implement context menu or import functionality in compendium collections
- When clicking on a monster in a compendium, provide a "Reskin and Import" option
- This would open the reskin interface pre-populated with the compendium actor's data
- After user saves changes, the reskinned monster is imported directly to the world
- Potentially use Foundry's `CompendiumCollection#importDocument` and `Actors#importFromCompendium` methods

## Dependencies

- Both capabilities depend on the existing ReskinApp class from ./src/reskinner-app.js
- Requires compatibility with Foundry VTT v13 API
- Should maintain the same security and validation measures as current implementation

## Success Criteria

- Users can access the reskin functionality directly from monster sheet headers
- Users can reskin monsters directly from compendiums during import
- Existing functionality remains unchanged
- User experience is consistent across both access points
