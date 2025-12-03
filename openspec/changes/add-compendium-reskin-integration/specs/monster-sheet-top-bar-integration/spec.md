# Spec: Monster Sheet Top Bar Integration

## ADDED Requirements

### Requirement: Monster Sheet Reskin Button
The reskinner module SHALL add a "Reskin" button to the header of Draw Steel monster sheets, adjacent to other actor sheet action buttons.

#### Scenario: User opens a Draw Steel monster sheet and sees a new reskin button in the header controls
- **Given** I am viewing a Draw Steel monster's sheet
- **When** I see the header action buttons for the sheet
- **Then** I should see a "Reskin" button available alongside other action buttons
- **And** when I click it, the ReskinApp interface opens with the current actor pre-loaded

### Requirement: Compatible Draw Steel Monster Detection
The reskin button SHALL only appear for compatible Draw Steel monster actors, specifically when both `game.system.id === 'draw-steel'` AND `(actor.system?.monster || validateActorData(actor))` evaluates true.

#### Scenario: User opens a non-Draw Steel actor sheet
- **Given** I am viewing a non-Draw Steel actor sheet
- **When** I see the header action buttons for the sheet  
- **Then** I should NOT see the "Reskin" button
- **And** the button should only be available for compatible Draw Steel monsters

#### Scenario: User opens a non-monster Draw Steel actor sheet
- **Given** I am viewing a Draw Steel non-monster actor (e.g., character, vehicle)
- **When** I see the header action buttons for the sheet
- **Then** I should NOT see the "Reskin" button
- **And** the button should only be available for actors that are monsters in the draw-steel system

### Requirement: Top Bar Integration Hook
The module SHALL implement the `getActorSheetHeaderButtons` Foundry hook to add the reskin button to actor sheets.

#### Scenario: Loading an actor sheet with the reskin module enabled
- **Given** the Draw Steel Reskinner module is active
- **When** an actor sheet is being prepared with header buttons
- **Then** the system should check if the actor is a reskinnable Draw Steel monster using the same compatibility logic as the context menu
- **And** if compatible, add the reskin button to the header buttons array
- **And** the button SHOULD call the existing ReskinApp constructor when clicked

### Requirement: Reskin Button Error Handling
If the ReskinApp fails to initialize or encounters an error when the button is clicked, the system SHALL show a user-facing notification.

#### Scenario: User clicks reskin button but initialization fails
- **Given** I am viewing a compatible Draw Steel monster sheet
- **When** I click the reskin button and there is an error initializing the ReskinApp
- **Then** the system SHALL show an error notification to the user using `ui.notifications.error`
- **And** the reskin interface should not appear or should gracefully handle the error
