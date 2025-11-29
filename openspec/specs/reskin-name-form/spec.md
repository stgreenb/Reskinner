# reskin-name-form Specification

## Purpose
TBD - created by archiving change add-name-reskin-feature. Update Purpose after archive.
## Requirements
### Requirement: Name Input Form
The Reskinner window **SHALL** provide a simple form containing a text input field for the monster's name, pre-filled with the current name of the actor, and a button to save changes.
#### Scenario: View and Edit Name
1. Given the Reskinner window is opened for an actor with the name "Ancient Red Dragon".
2. When the window appears.
3. Then it displays a text input field labeled "Name" containing "Ancient Red Dragon".
4. And it displays a "Save Changes" button.

### Requirement: Persist Name Changes
Changes made to the monster's name in the Reskinner window **MUST** be saved to a new cloned actor document, preserving the original actor unchanged.
#### Scenario: Save Name Change (Clone and Modify)
1. Given the Reskinner window is open for an actor named "Ancient Red Dragon".
2. When the user changes the name in the input field to "Young Red Dragon".
3. And clicks the "Save Changes" button.
4. Then a new cloned actor is created with the name "Young Red Dragon".
5. And the original "Ancient Red Dragon" remains unchanged.
6. And the Reskinner window closes.
7. And the new actor appears in the Actors directory.

