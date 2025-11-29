# Tasks for Add Basic Name Reskin Feature

This outlines the tasks to implement the "Add Basic Name Reskin Feature" proposal.

## 1. Module Initialization & Setup
- [x] 1.1 Create the basic module directory structure (`src`, `templates`, `lang`, `css`)
- [x] 1.2 Initialize `package.json` with necessary dependencies (Rollup, ESLint, etc.)
- [x] 1.3 Create `module.json` with `id: "ds-reskinner"`, `title: "Draw Steel Reskinner"`, author `stgreenb`, and entry points
- [x] 1.4 Configure Rollup (`rollup.config.mjs`) for bundling JavaScript
- [x] 1.5 Configure ESLint (`.eslintrc.json`) for code quality
- [x] 1.6 Create a main module entry point (`ds-reskinner.mjs`) with basic Foundry VTT module boilerplate

## 2. Implement UI Triggers Capability (`ui-triggers`)
- [x] 2.1 Implement Actor Sheet Header Button:
    - [x] 2.1.1 Implement a Foundry VTT `Hooks.on('getActorSheetHeaderButtons', ...)` hook
    - [x] 2.1.2 Add a "Reskin" button to the header of monster NPC sheets (checking for actor type "npc" or similar monster identifier)
    - [x] 2.1.3 Wire the button's click event to open the `ReskinApp` (to be created in the next step)
- [x] 2.2 Implement Actors Sidebar Context Menu Item:
    - [x] 2.2.1 Implement a Foundry VTT `Hooks.on('getActorDirectoryEntryContext', ...)` hook
    - [x] 2.2.2 Add a "Reskin" option to the context menu for monster NPC actor entries in the Actors sidebar
    - [x] 2.2.3 Wire the context menu item's click event to open the `ReskinApp`

## 3. Implement Reskin Name Form Capability (`reskin-name-form`)
- [x] 3.1 Create ReskinApp (Foundry VTT Application subclass):
    - [x] 3.1.1 Define a new JavaScript class, `ReskinApp`, extending `FoundryVTT.Application`
    - [x] 3.1.2 Define its default options (e.g., title, width, height, template path)
    - [x] 3.1.3 Pass the target `Actor` document to the application's constructor
- [x] 3.2 Create Handlebars Template:
    - [x] 3.2.1 Create `templates/reskin-form.hbs` with an HTML form
    - [x] 3.2.2 Include a text input field for the monster's name, pre-filled with the current name
    - [x] 3.2.3 Include a "Save Changes" button
- [x] 3.3 Implement Render & Data Retrieval:
    - [x] 3.3.1 Implement the `getData()` method in `ReskinApp` to pass the actor's current name to the template
    - [x] 3.3.2 Implement the `activateListeners()` method in `ReskinApp` to handle form submission
- [x] 3.4 Implement Clone and Save Logic:
    - [x] 3.4.1 Upon form submission, retrieve the new name from the input field
    - [x] 3.4.2 Clone the original actor using `actor.clone()` to create a new actor document
    - [x] 3.4.3 Update the cloned actor's name using `clonedActor.update({ name: newName })`
    - [x] 3.4.4 Add error handling for clone failures (e.g., permissions, memory constraints)
    - [x] 3.4.5 Close the `ReskinApp` window after successful save

## 4. Validation
- [x] 4.1 Write Playwright E2E Tests for Actor Sheet Workflow:
    - [x] 4.1.1 Write a Playwright test script to open a monster NPC sheet
    - [x] 4.1.2 Verify the "Reskin" button is present in the header
    - [x] 4.1.3 Click the "Reskin" button and verify the `ReskinApp` window opens
    - [x] 4.1.4 Enter a new name in the `ReskinApp`, save, and verify a new actor is created with the updated name
    - [x] 4.1.5 Verify the original monster remains unchanged
- [x] 4.2 Write Playwright E2E Tests for Sidebar Context Menu Workflow:
    - [x] 4.2.1 Write a Playwright test script to open the Actors sidebar
    - [x] 4.2.2 Right-click a monster NPC and verify the "Reskin" context menu item is present
    - [x] 4.2.3 Click the "Reskin" context menu item and verify the `ReskinApp` window opens
    - [x] 4.2.4 Enter a new name in the `ReskinApp`, save, and verify a new actor is created with the updated name
    - [x] 4.2.5 Verify the original monster remains unchanged
- [x] 4.3 Verify new actors appear in the Actors directory

## 5. Documentation
- [x] 5.1 Update the main `README.md` with instructions on how to install and use the module's basic name reskin feature
