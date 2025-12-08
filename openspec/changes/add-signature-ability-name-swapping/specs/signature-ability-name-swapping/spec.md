# Spec: Signature Ability Name Swapping

## ADDED Requirements

### Requirement: Signature Ability Detection and Display
The system SHALL detect all signature abilities in actor data and provide a collapsible interface section for name management.

#### Scenario: User opens Reskin interface for Basilisk with multiple signature abilities
**When**: User selects a monster actor to reskin
**Given**: Basilisk contains "Noxious Bite", "Petrifying Eye Beams", and "Lash Out" as signature abilities
**Then**: A collapsible section shows "Signature Abilities (3)" indicating the number of signature abilities found
**And**: The section is hidden by default, only showing the count

#### Scenario: User expands signature ability section
**Given**: Monster has signature abilities detected
**When**: User clicks the chevron/expander for signature abilities
**Then**: The section expands to show each signature ability with its current name in a text input field
**And**: All fields are editable for renaming

### Requirement: Signature Ability Name Input Interface
The system SHALL provide intuitive text input controls for renaming individual signature abilities with validation.

#### Scenario: User renames a signature ability
**Given**: User wants to change "Noxious Bite" to "Acidic Spit"
**When**: User edits the text input for "Noxious Bite" to "Acidic Spit"
**Then**: Preview shows "Noxious Bite → Acidic Spit"
**And**: Submit button becomes enabled

#### Scenario: User leaves ability name unchanged
**When**: User does not modify any signature ability text fields
**Then**: No changes are applied to ability names
**And**: The operation is treated as a no-op for signature abilities

### Requirement: Signature Ability Name Replacement Execution
The system SHALL perform targeted name replacement for signature abilities while preserving all other ability data.

#### Scenario: User performs signature ability name swap on monster
**Given**: Monster with "Noxious Bite" signature ability containing damage effects, potency values, and configurations
**When**: User submits form renaming "Noxious Bite" to "Acidic Spit"
**Then**: Only the ability name field changes from "Noxious Bite" to "Acidic Spit"
**And**: All damage effects, potency values, keywords, and mechanical data remain unchanged
**And**: Ability type, category, and system data are preserved

#### Scenario: Multiple signature abilities are renamed
**Given**: Monster with multiple signature abilities being renamed
**When**: Name replacement is performed
**Then**: Each target ability name is updated individually
**And**: Non-target signature abilities remain unchanged

### Requirement: Signature Ability Validation and Feedback
The system SHALL provide clear validation and feedback for signature ability name operations.

#### Scenario: Monster contains no signature abilities
**When**: User opens Reskin interface for monster without signature abilities
**Then**: Signature ability section is not displayed
**And**: No signature ability controls are shown

#### Scenario: Signature ability name replacement completes successfully
**When**: Signature ability name swap is applied
**Then**: Success notification shows number of abilities renamed
**And**: New actor is created with updated ability names
**And**: Original actor remains unchanged
**And**: All ability mechanics are preserved

#### Scenario: User collapses signature ability section
**When**: User clicks expander to hide signature ability section
**Then**: Section returns to collapsed state showing only the count
**And**: Any entered name changes are preserved in the form data
