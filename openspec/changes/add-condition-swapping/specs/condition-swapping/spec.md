# Spec: Condition Swapping

## ADDED Requirements

### Requirement: Condition Detection and Quantification
The system SHALL detect all condition instances in actor Active Effects and applied ability effects and provide counts for UI display.

#### Scenario: User opens Reskin interface and sees condition analysis for Basilisk
**When**: User selects a monster actor to reskin
**Given**: Basilisk contains 2 instances of "slowed" condition and 1 instance of "weakened" condition
**Then**: The UI displays "slowed (2)" and "weakened (1)" as available source options
**And**: Conditions with zero instances are shown as disabled

#### Scenario: User analyzes monster with multiple conditions across Active Effects
**Given**: Monster has Active Effects with "restrained" in statuses array and "slowed" in applied effects
**When**: Condition analysis is performed
**Then**: counts for each active condition are accurate across both Active Effects and applied effects
**And**: inactive conditions show count of 0

### Requirement: Condition Selection Interface
The system SHALL provide intuitive controls for selecting source and target conditions with validation.

#### Scenario: User selects source and target conditions
**Given**: User wants to convert "slowed" to "restrained" condition
**When**: User selects "slowed" from source dropdown
**And**: User selects "restrained" from target dropdown
**Then**: Preview shows "3 replacements will be made"
**And**: Submit button becomes enabled

#### Scenario: User selects same condition for source and target
**When**: User selects "slowed" for both source and target
**Then**: Validation error is displayed
**And**: Submit button remains disabled

### Requirement: Condition Replacement Execution
The system SHALL perform comprehensive condition replacement across all relevant Active Effect structures.

#### Scenario: User performs condition swap on monster with Active Effects
**Given**: Monster with Active Effects containing "slowed" in statuses arrays and applied effect configurations
**When**: User submits form replacing "slowed" with "restrained"
**Then**: All "slowed" entries become "restrained" in statuses arrays
**And**: All applied effect configurations update "slowed" condition keys to "restrained"
**And**: Active Effect structures, potency values, and configurations remain unchanged

#### Scenario: Condition replacement affects multiple ability tiers
**Given**: Monster has condition in tier1, tier2, and tier3 applied effects
**When**: Condition swap is performed
**Then**: All tiers receive the replacement
**And**: potency values and display strings remain consistent

### Requirement: Condition Validation and Feedback
The system SHALL provide clear validation and feedback for condition operations.

#### Scenario: Monster contains no condition instances
**When**: User opens Reskin interface for condition-free monster
**Then**: All conditions show count of 0
**And**: Condition controls are disabled
**And**: Informative message explains no conditions found

#### Scenario: Condition replacement completes successfully
**When**: Condition swap is applied
**Then**: Success notification shows number of Active Effects and applied effects updated
**And**: New actor is created with updated conditions
**And**: Original actor remains unchanged
**And**: Active Effect configurations are preserved
