# Spec: Compendium Reskin Functionality

## ADDED Requirements

### Requirement: Compatible Compendium Actor Detection
The "Reskin and Import" option SHALL appear only for compatible Draw Steel monsters in compendiums, specifically when both `game.system.id === 'draw-steel'` AND `document.data.system?.monster || validateActorData(document.data)` evaluates true, where `document` is the compendium entry.

#### Scenario: User views Draw Steel actor compendium
- **Given** I am viewing a compendium browser with Draw Steel monsters
- **When** I right-click on a Draw Steel monster entry in the compendium
- **Then** I should see the "Reskin and Import" option in the context menu
- **And** this option SHALL use consistent compatibility validation as the existing context menu

#### Scenario: User views non-Draw Steel actor compendium
- **Given** I am viewing a compendium browser with non-Draw Steel actors
- **When** I right-click on an actor in the compendium
- **Then** I should NOT see the "Reskin and Import" option in the context menu
- **And** the system SHALL verify the actor is both in the right system and a monster type

#### Scenario: User views non-actor compendium
- **Given** I am viewing a compendium browser with items, journal entries, or other non-actor documents
- **When** I right-click on an entry in the compendium
- **Then** I should NOT see the "Reskin and Import" option in the context menu
- **And** the option SHALL appear only for actor compendium entries

### Requirement: Compendium Reskin and Import Option
The reskinner module SHALL add a "Reskin and Import" option to the context menu of compatible actors in compendium collections.

#### Scenario: User right-clicks on a compatible actor in a compendium browser
- **Given** I am viewing a compendium browser with Draw Steel monster actors
- **When** I right-click on a Draw Steel monster within a compendium
- **Then** I should see a "Reskin and Import" option in the context menu
- **And** this option SHALL be available specifically for actor compendiums
- **And** the option SHALL NOT appear for non-actor compendiums (items, journal entries, etc.)

### Requirement: Compendium Actor Fetch and Reskin Workflow
When selecting "Reskin and Import", the system SHALL fetch the compendium actor and open the reskin interface with a temporary, cloned version of that actor's data using `Actor.implementation.create(doc.data.toObject(), {temporary: true})`.

#### Scenario: User clicks "Reskin and Import" from compendium context menu
- **Given** I have right-clicked on an actor in a compendium and selected "Reskin and Import"
- **When** the operation begins
- **Then** the system SHALL fetch the full actor document from the compendium using `pack.getDocument(id)`
- **And** create a temporary Actor instance for the ReskinApp using the document's data
- **And** open the ReskinApp interface populated with the temporary actor's data
- **And** the interface SHOULD function identically to the current reskin workflow

### Requirement: Reskin and Import Process
After completing changes in the reskin interface from a compendium source, the modified actor SHALL be created and imported into the world as a new actor using `Actors.importFromCompendium(pack, id, updatedData, options)`.

#### Scenario: User saves changes from a compendium actor reskin session
- **Given** I have opened the reskin interface from a compendium actor 
- **When** I make modifications and click "Save Changes"
- **Then** the modified actor data SHALL be created as a new actor in the world via `Actors.importFromCompendium`
- **And** the actor SHALL retain all reskin modifications
- **And** any changes to actor name, images, damage types, movement, or level attributes SHALL be preserved
- **And** the temporary actor used for the interface SHOULD be properly disposed of after import

### Requirement: Compendium Context Hook
The module SHALL implement the `getCompendiumContextOptions` Foundry hook to add the "Reskin and Import" functionality.

#### Scenario: Loading compendium context menu with the reskin module enabled
- **Given** the Draw Steel Reskinner module is active
- **When** a compendium context menu is being prepared for an actor entry
- **Then** the system should check if the document is a reskinnable Draw Steel monster using the same validation as other parts of the system
- **And** if compatible, add the "Reskin and Import" option to the context menu
- **And** the option SHOULD initiate the workflow to fetch the compendium document and open the reskin interface with a temporary clone

### Requirement: Compendium Error Handling
The system SHALL provide user-facing error notifications when the "Reskin and Import" workflow encounters permission, access, or other errors.

#### Scenario: User tries to reskin an actor from compendium but permissions prevent access
- **Given** I try to use "Reskin and Import" from a compendium
- **When** there are permission issues or the document fails to load
- **Then** the system SHALL show a user-facing error notification using `ui.notifications.error`
- **And** the reskin interface should not open, or should show a proper error message
