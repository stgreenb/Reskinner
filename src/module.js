/**
 * Draw Steel Reskinner Module
 * A Foundry VTT module for reskinning Draw Steel monsters
 * Version: INJECTED_AT_BUILD_TIME - This will be replaced by package.json version during build
 */

// Centralized version reference - injected from package.json during build process
const MODULE_VERSION = 'INJECT_VERSION_FROM_PACKAGE_JSON';

import { ReskinApp } from './reskinner-app.js';

// Define the validation function and make it globally accessible
function isReskinnableMonster(actor) {
  return actor && actor.type === "npc";
}

// Make function globally available for testing and module access
window.isReskinnableMonster = isReskinnableMonster;

// Register hooks once when Foundry starts
Hooks.once("init", () => {
  console.log("DS-Reskinner | Initializing hooks");
});

// Simple hook for actor sheets - works with some systems
Hooks.on("getActorSheetHeaderButtons", (sheet, buttons) => {
  const actor = sheet.actor;
  if (!actor || !isReskinnableMonster(actor)) return;

  buttons.unshift({
    class: "reskin-actor",
    icon: "fas fa-palette", 
    label: game.i18n.localize("DSRESKINNER.Reskin"),
    onclick: async () => {
      const reskinApp = new ReskinApp(actor);
      await reskinApp(true);
    }
  });
});

// Actor directory and compendium context menu - this works reliably
Hooks.on("getActorContextOptions", (app, menuItems) => {
  // Check if this is a compendium directory
  const isCompendium = app.constructor.name.includes("Compendium");
  
  // Add context menu option for actor directory
  if (!isCompendium) {
    menuItems.push({
      name: game.i18n.localize("DSRESKINNER.ReskinMonster"),
      icon: '<i class="fas fa-palette"></i>',
      condition: li => {
        const actorId = li.dataset.documentId || li.dataset.entryId;
        if (!actorId) return false;
        const actor = game.actors.get(actorId);
        return isReskinnableMonster(actor);
      },
      callback: async li => {
        const actorId = li.dataset.documentId || li.dataset.entryId;
        const actor = game.actors.get(actorId);
        if (!actor) return;
        const app = new ReskinApp(actor);
        await app.render(true);
      }
    });
  }
  
  // Add context menu option for compendium
  if (isCompendium && game.system.id === "draw-steel") {
    
    menuItems.push({
      name: game.i18n.localize("DSRESKINNER.ReskinAndImport"),
      icon: '<i class="fas fa-palette"></i>',
      condition: (li) => {
        // li is the entry element clicked
        const documentId = li.dataset.documentId || li.dataset.entryId;
        return !!documentId;
      },
      callback: async (li) => {
        const documentId = li.dataset.documentId || li.dataset.entryId;
        if (!documentId) return;
        
        try {
          // Get the compendium pack name from app ID - most reliable for V13
          let packName = null;
          
          // Extract from app ID (format: compendium-{packname})
          if (app.options?.id) {
            const appId = app.options.id;
            const match = appId.match(/^compendium-(.+)$/);
            if (match) {
              packName = match[1];
            }
          }
          
          // Fallback to DOM data attributes
          if (!packName) {
            const directory = li.closest('.directory');
            packName = directory?.dataset?.pack || 
                       li.closest('[data-pack]')?.dataset?.pack ||
                       app.options?.pack;
          }
          
          if (!packName) {
            console.error("DS-Reskinner | Could not determine pack name");
            ui.notifications.error("Could not determine compendium pack");
            return;
          }
          
          // Convert pack name from format to proper UUID format
          // draw-steel_monsters -> draw-steel.monsters
          const packCollection = packName.replace('_', '.');
          
          // Correct UUID format for compendium documents
          const uuid = `Compendium.${packCollection}.Actor.${documentId}`;
          const actor = await fromUuid(uuid);
          
          if (!actor) {
            console.error("DS-Reskinner | Could not load actor from UUID:", uuid);
            ui.notifications.error("Could not load monster from compendium");
            return;
          }
          
          if (actor.type !== "npc") {
            ui.notifications.warn("Only NPC monsters can be reskinned");
            return;
          }
          const reskinApp = new ReskinApp(actor);
          await reskinApp.render(true);
          
        } catch (err) {
          console.error("DS-Reskinner | Error in callback:", err);
          ui.notifications.error("Error opening reskin app: " + err.message);
        }
      }
    });
  }
});






