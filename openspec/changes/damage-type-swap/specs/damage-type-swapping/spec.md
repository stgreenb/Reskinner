# Spec: Damage Type Swapping

## ADDED Requirements

### Requirement: Damage Type Detection and Quantification
The system SHALL detect all damage type instances in actor data and provide counts for UI display.

#### Scenario: User opens Reskin interface and sees damage type analysis for Cloud Giant
**When**: User selects a monster actor to reskin
**Given**: Cloud Giant contains 3 instances of lightning damage
**Then**: The UI displays "lightning (3)" as an available source option
**And**: Damage types with zero instances are shown as disabled

#### Scenario: User analyzes monster with multiple damage types
**Given**: Monster has 2 fire, 1 cold, and 3 sonic damage instances
**When**: Damage analysis is performed
**Then**: counts for each active damage type are accurate
**And**: inactive damage types show count of 0

### Requirement: Damage Type Selection Interface
The system SHALL provide intuitive controls for selecting source and target damage types with validation.

#### Scenario: User selects source and target damage types
**Given**: User wants to convert lightning to fire damage
**When**: User selects "lightning" from source dropdown
**And**: User selects "fire" from target dropdown
**Then**: Preview shows "3 replacements will be made"
**And**: Submit button becomes enabled

#### Scenario: User selects same damage type for source and target
**When**: User selects "lightning" for both source and target
**Then**: Validation error is displayed
**And**: Submit button remains disabled

### Requirement: Damage Type Replacement Execution
The system SHALL perform comprehensive damage type replacement across all relevant text fields.

#### Scenario: User performs damage type swap on monster
**Given**: Cloud Giant with lightning damage in abilities and weaknesses
**When**: User submits form replacing lightning with fire
**Then**: All "lightning" instances become "fire" in new actor data
**And**: Image URLs remain unchanged
**And**: Damage patterns preserve original formatting (case sensitivity)

#### Scenario: Damage type replacement affects multiple fields
**Given**: Monster has damage in attacks, special abilities, and descriptions
**When**: Damage type swap is performed
**Then**: All text fields receive the replacement
**And**: Media fields (img, src, path, url, etc.) are excluded

### Requirement: Damage Type Validation and Feedback
The system SHALL provide clear validation and feedback for damage type operations.

#### Scenario: Monster contains no damage type instances
**When**: User opens Reskin interface for damage-type-free monster
**Then**: All damage types show count of 0
**And**: Damage type controls are disabled
**And**: Informative message explains no damage types found

#### Scenario: Damage type replacement completes successfully
**When**: Damage type swap is applied
**Then**: Success notification shows number of replacements made
**And**: New actor is created with updated damage types
**And**: Original actor remains unchanged
