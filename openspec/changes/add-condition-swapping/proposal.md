# Condition Swapping Implementation

## Overview
This proposal adds condition swapping functionality to the Draw Steel Reskinner module, allowing users to replace one condition with another across a monster's entire data structure while preserving Active Effect configurations and media references.

## Why
Game Masters frequently need to create thematic variants of monsters with different condition effects (e.g., converting a Basilisk's "slowed" condition to "restrained" for a Web-Weaver variant). Currently, this requires manually editing multiple Active Effects across abilities, applied effects, and status arrays - a time-consuming and error-prone process. Automating this functionality will significantly streamline monster customization and reduce the likelihood of missed instances or inconsistent condition applications.

## Problem Statement
Users currently need to manually edit multiple Active Effects and applied condition references when reskinning monsters to change conditions (e.g., converting a monster's "slowed" effects to "restrained" for a different theme). This is time-consuming and error-prone due to the distributed nature of condition references across Active Effects statuses arrays and applied effect configurations.

## Proposed Solution
Add a separate condition swapping feature to the Reskin interface that:
1. Creates an independent expandable section for condition swapping (separate from damage type swapping)
2. Detects and quantifies all instances of each condition in the monster's Active Effects and applied abilities
3. Provides a dropdown interface for selecting source and target conditions
4. Performs 1-to-1 replacement across all relevant Active Effect fields and applied effect configurations
5. Preserves Active Effect structures, potency values, and media references

## Scope
- **Draw Steel Conditions**: bleeding, dazed, frightened, grabbed, prone, restrained, slowed, taunted, weakened
- **Replacement Scope**: Active Effect `statuses` arrays and applied effect configurations in abilities
- **UI Integration**: Add independent expandable section to Reskin form for condition swapping controls (separate from damage type swapping section)
- **Validation**: Show count of instances before replacement
- **Default Behavior**: Leaving the "from" dropdown blank results in a no-op (changes nothing by default)

## Technical Approach
- Extend the existing `_replaceInObject` method to handle condition replacement in nested Active Effect structures using a configurable mapping: `{from: X, to: Y}`
- Form dropdowns write this single mapping into form data, which drives the `_replaceInObject` operation over Active Effects and applied effects
- Add condition detection and counting functionality for Active Effects and applied effects
- Update the Handlebars template with independent condition swapping form controls
- Maintain Active Effect configurations while swapping condition identifiers

## User Benefits
- Quick reskinning of monsters with different condition themes
- Ability to see exactly what will be changed before applying
- Consistent condition application across all monster Active Effects and abilities
- Maintains existing Active Effect structures, potency values, and media references
