# Movement Type Management Specification

## ADDED Requirements

### Requirement: Display Movement Type Controls
The system SHALL display a collapsible movement types section in the reskinner interface with individual checkboxes for each available movement type (walk, fly, swim, burrow, climb, teleport) plus a separate standalone hover checkbox.

#### Scenario: User opens reskinner interface
**Given** the user has selected a monster with existing movement types
**When** the reskinner interface renders
**Then** a collapsible "Movement Types" section is displayed with checkboxes for each movement type and a separate hover checkbox

### Requirement: Analyze Current Movement Types
The system SHALL analyze the monster's current movement configuration and populate the UI with the existing movement types and hover state.

#### Scenario: System analyzes monster movement
**Given** the monster has movement types in actor.system.movement.types array
**When** the movement analysis runs
**Then** checkboxes are checked for current movement types and hover state reflects actor.system.movement.hover

### Requirement: Add Movement Type
The system SHALL allow users to add movement types to a monster by checking the corresponding checkbox in the movement types section.

#### Scenario: User adds flying movement
**Given** the monster currently has only "walk" movement type
**When** the user checks the "fly" checkbox
**Then** "fly" is added to the movement types array and hover option becomes available

### Requirement: Remove Movement Type
The system SHALL allow users to remove movement types from a monster by unchecking the corresponding checkbox while preserving all other movement types.

#### Scenario: User removes climbing movement
**Given** the monster has both "walk" and "climb" movement types
**When** the user unchecks the "climb" checkbox
**Then** "climb" is removed from the movement types array while preserving other types

### Requirement: Toggle Hover State
The system SHALL allow users to toggle the hover state independently through a separate checkbox, without validation constraints on movement type combinations.

#### Scenario: User enables hover for flying monster
**Given** the monster has "fly" movement type and hover is false
**When** the user checks the hover checkbox
**Then** the hover state is set to true in the movement object

#### Scenario: User enables hover without flying movement type
**Given** the monster has only "walk" movement type and hover is false
**When** the user checks the hover checkbox
**Then** the hover state is set to true regardless of movement type selection

### Requirement: Apply Movement Changes
The system SHALL apply all movement type and hover state modifications to the new monster actor when the user saves the reskinned monster.

#### Scenario: User submits reskinned monster
**Given** the user has modified movement types and/or hover state
**When** the user clicks "Save Changes"
**Then** the updated movement configuration is applied to the new monster actor

### Requirement: Prevent Empty Movement Types
The system SHALL validate that at least one movement type is selected, preventing creation of monsters with empty movement types array.

#### Scenario: User attempts to deselect all movement types
**Given** the monster has a single movement type selected (e.g., ["walk"])
**When** the user unchecks the last selected movement type
**Then** the system prevents deselection and maintains at least one movement type

### Requirement: Preserve Movement Values
The system SHALL preserve the monster's movement speed value and disengage settings when adding or removing movement types.

#### Scenario: User modifies movement types
**Given** the original monster has movement.value of 10 and disengage of 1
**When** movement types are added or removed
**Then** movement.value and disengage settings remain unchanged
