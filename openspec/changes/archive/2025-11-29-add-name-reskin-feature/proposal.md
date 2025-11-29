# Proposal: Add Basic Name Reskin Feature

## Overview

This proposal outlines the initial implementation of the "Draw Steel Reskinner" module, focusing on providing a user interface to change a monster's name. This feature will allow users to open a dedicated Reskinner window either from the monster's character sheet header or via a context menu option in the Actors sidebar. Within this window, users can modify the monster's name, and upon saving, a new cloned monster actor will be created with the modified name, preserving the original monster.

## Capabilities

1.  **UI Triggers (`ui-triggers`):** Integrate entry points within Foundry VTT to launch the Reskinner application. This includes a button on the Actor Sheet header for monster NPCs and a context menu option in the Actors sidebar for monster NPCs.
2.  **Reskin Name Form (`reskin-name-form`):** Implement the core Reskinner application window, which will initially provide a simple form to view and update the name of the selected monster actor.

## Clone-and-Modify Justification

This proposal focuses on creating new monster actors through cloning rather than modifying existing ones. This approach aligns with the "Draw Steel Reskinner" module's core goals while maintaining manageable complexity:

-   **Preserves Original Assets:** Users maintain their library of base monsters for future reskinning iterations.
-   **Better User Experience:** Gamemasters accumulate variations rather than replacing template monsters.
-   **Data Safety:** No risk of accidentally overwriting original monster stats and configurations.
-   **Scalability:** Supports the stated goal of "reskinning" (creating variants) rather than "modifying" existing monsters.
-   **Foundry VTT Best Practices:** Uses the built-in `clone()` method which is designed for this use case.

The clone-and-modify approach is nearly as straightforward as in-place updates but better aligns with the project's long-term vision. New reskinned monsters will be created in the root of the Actors directory, with folder organization deferred to future iterations.
