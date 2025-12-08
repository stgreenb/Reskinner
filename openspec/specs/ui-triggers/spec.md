# ui-triggers Specification

## Purpose
TBD - created by archiving change add-name-reskin-feature. Update Purpose after archive.
## Requirements
### Requirement: UI Integration for Monster Sheet Header
A "Reskin" button **SHALL** be added to the header of monster NPC character sheets, allowing users to quickly access the Reskinner application for that specific actor.
#### Scenario: From Actor Sheet Header
1. Given a user is viewing a monster NPC sheet.
2. When they view the window header controls.
3. Then a "Reskin" button is visible.
4. When the user clicks the "Reskin" button.
5. Then the Reskinner application window opens for that actor.

### Requirement: UI Integration for Actors Sidebar Context Menu
A "Reskin" option **MUST** be added to the context menu for monster NPC entries in the Actors sidebar, providing an alternative way to launch the Reskinner application.
#### Scenario: From Actors Sidebar Context Menu
1. Given a user is viewing the Actors sidebar.
2. When they right-click a monster NPC actor entry.
3. Then a context menu appears containing a "Reskin" option.
4. When the user clicks the "Reskin" option.
5. Then the Reskinner application window opens for that actor.

