# Signature Ability Name Swapping Implementation

## Overview
This proposal adds signature ability name swapping functionality to the Draw Steel Reskinner module, allowing users to rename a monster's signature abilities while preserving all ability mechanics, effects, and configurations.

## Why
Game Masters frequently need to create thematic variants of monsters with different signature ability names (e.g., converting a Basilisk's "Noxious Bite" to "Acidic Spit" for a variant monster). Currently, this requires manual editing of the ability name field, which is error-prone when ensuring all other ability data remains untouched. Automating this functionality streamlines monster customization while maintaining mechanical integrity.

## Problem Statement
Users need to manually edit signature ability names when reskinning monsters to better match new themes. This requires finding and updating the ability name field while ensuring all other ability data remains intact.

## Proposed Solution
Add a signature ability name swapping feature to the Reskin interface that:
1. Detects all signature abilities in the monster (abilities with `"category": "signature"`)
2. Provides a collapsible section (hidden by default) that expands to show signature abilities
3. Allows renaming of individual signature abilities via text input fields
4. Updates only the ability name while preserving all mechanics, effects, and configurations
5. Shows preview of changes before applying, driven by the same mapping used for the final write

## Scope
- **Target Abilities**: Only abilities with `"category": "signature"`
- **Replacement Scope**: Ability name field only (`"name"` property at ability level) - does not touch effect names, IDs, or localization keys
- **UI Integration**: Add collapsible signature ability section to existing Reskin form
- **Preservation**: All ability mechanics, effects, potency values, and configurations remain unchanged
- **Default Behavior**: Section hidden by default, expands on user interaction (similar to existing chevron patterns)

## Technical Approach
- Extend the existing `_replaceInObject` method to handle targeted ability name updates using configurable mapping: `{from: "Original Name", to: "New Name"}`
- Target specific path: `items.<id>.name` for signature abilities only
- Add signature ability detection functionality to scan for abilities with `"category": "signature"`
- Form text inputs write ability name mappings into form data, which drives the `_replaceInObject` operation
- Update the Handlebars template with collapsible signature ability swapping controls
- Maintain all other ability data while updating only the name field

## User Benefits
- Quick thematic customization of signature ability names for reskinned monsters
- Ability to preview name changes before applying
- Preserves all mechanical functionality while allowing thematic customization
- Clean, unobtrusive UI that doesn't interfere with existing reskinning workflow
