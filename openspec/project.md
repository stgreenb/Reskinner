# Project: Draw Steel Reskinner

## 1. Project Overview

This project aims to create a Foundry VTT module named "Draw Steel Reskinner" (ID: `ds-reskinner`). The module will provide an intuitive user interface for "reskinning" monster actors within the Draw Steel system. This allows Game Masters to quickly create variations of existing monsters by making minor adjustments, rather than creating new actors from scratch.

The core functionality will be guided by the monster adjustment rules outlined in `AdjustingMonsters.md`.

## 2. Core Features

The module will enable users to:
- Select an existing monster actor.
- Modify core descriptive fields:
  - Name/Title
  - Image/Portrait
- Swap Damage Types: Easily replace one damage type with another (e.g., "fire" to "cold") across all relevant parts of the actor's sheet (abilities, weaknesses, immunities).
- Adjust Monster Level: Implement the level adjustment formulas from `AdjustingMonsters.md` to scale a monster's statistics up or down. This includes recalculating:
  - Encounter Value (EV)
  - Stamina
  - Damage values
  - Characteristics and potencies
- Apply Changes: Save the modified monster as a new actor in the world or in a compendium pack.

## 3. Technical Stack

The technical stack will mirror the conventions established by the `draw-steel` system to ensure compatibility and maintainability.

- **Language:** JavaScript (ESM)
- **Bundler:** Rollup.js
- **Templating:** Handlebars (`.hbs`) for Foundry VTT sheets and UI components.
- **Styling:** CSS
- **Linting:** ESLint with plugins for JavaScript, HTML, and JSDoc to enforce code quality and a consistent style.

## 4. Project Structure

The module will adopt a standard Foundry VTT module structure:

- **`ds-reskinner/`**
  - **`module.json`**: The module manifest file.
  - **`ds-reskinner.mjs`**: The main JavaScript entry point.
  - **`package.json`**: Node.js dependencies and build scripts.
  - **`rollup.config.mjs`**: Rollup build configuration.
  - **`.eslintrc.json`**: ESLint configuration.
  - **`src/`**: Contains the core JavaScript source code and styles.
    - `reskinner-app.js`: The main application logic for the reskinning UI.
    - `module.js`: Hooks and initialization logic.
    - `styles.css`: Module-specific styles.
  - **`templates/`**: Contains Handlebars (`.hbs`) template files for the UI.
    - `reskinner-window.hbs`: The main window for the reskinning interface.
  - **`lang/`**: Language and localization files.
    - `en.json`: English localization strings.
  - **`packs/`**: Compendium packs (if needed for storing reskinned monsters).
  - **`css/`**: Output directory for compiled CSS.

## 5. Development Conventions

- **Code Style:** Adhere to the ESLint configuration, which will be based on the rules from the `draw-steel` project. This includes a focus on clean, readable code and JSDoc documentation for public APIs.
- **Build Process:** Use `npm run build` (powered by Rollup) to bundle JavaScript and prepare the module for release.
- **Versioning:** The module version will be managed in `module.json`.
- **Author:** The author will be listed as `stgreenb`.

## 6. Testing Strategy

- **End-to-End (E2E) Testing:** Playwright will be the primary tool for testing. Tests will run against a live Foundry VTT instance (`http://192.168.1.196:4444/`) to simulate user interactions and verify the module's functionality in a real environment.
- **Unit Testing:** No specific unit testing framework is required at this stage. The focus will be on comprehensive E2E test coverage.

## 7. Key Resources

- **Module Development Guide:** https://foundryvtt.com/article/module-development/
- **Monster Adjustment Rules:** `AdjustingMonsters.md`
- **Reference Project (`draw-steel`):** https://github.com/MetaMorphic-Digital/draw-steel
- **Live Test Environment:** `http://192.168.1.196:4444/`
- **Author GitHub:** https://github.com/stgreenb