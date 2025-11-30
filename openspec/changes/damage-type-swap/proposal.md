# Damage Type Swap Implementation

## Overview
This proposal adds damage type swapping functionality to the Draw Steel Reskinner module, allowing users to replace one damage type with another across a monster's entire data structure while preserving media references.

## Why
Game Masters frequently need to create thematic variants of monsters with different damage types (e.g., converting a Cloud Giant's lightning damage to fire damage for a Fire Giant variant). Currently, this requires manually editing multiple fields across abilities, attacks, weaknesses, and descriptions - a time-consuming and error-prone process. Automating this functionality will significantly streamline monster customization and reduce the likelihood of missed instances or inconsistent damage types.

## Problem Statement
Users currently need to manually edit multiple fields when reskinning monsters to change damage types (e.g., converting a Cloud Giant's lightning damage to fire damage for a Fire Giant variant). This is time-consuming and error-prone.

## Proposed Solution
Add a damage type swapping feature to the Reskin interface that:
1. Detects and quantifies all instances of each damage type in the monster
2. Provides a dropdown interface for selecting source and target damage types 
3. Performs 1-to-1 replacement across all relevant fields
4. Preserves image URLs and media references (similar to name replacement exclusions)

## Scope
- **Draw Steel Damage Types**: acid, cold, corruption, fire, holy, lightning, poison, psychic, sonic
- **Replacement Scope**: All text fields except media-related fields
- **UI Integration**: Extend existing Reskin form with damage type controls
- **Validation**: Show count of instances before replacement

## Technical Approach
- Extend the existing `_replaceInObject` method to handle damage type replacement
- Add damage type detection and counting functionality
- Update the Handlebars template with new form controls
- Maintain the same exclusion patterns for media fields

## User Benefits
- Quick reskinning of monsters with different damage themes
- Ability to see exactly what will be changed before applying
- Consistent damage type application across all monster abilities
- Maintains existing media and image references
