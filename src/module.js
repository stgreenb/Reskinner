/**
 * Draw Steel Reskinner Module
 * A Foundry VTT module for reskinning Draw Steel monsters
 * Version: INJECTED_AT_BUILD_TIME - This will be replaced by package.json version during build
 */

// Centralized version reference - injected from package.json during build process
const MODULE_VERSION = 'INJECT_VERSION_FROM_PACKAGE_JSON';

import { ReskinApp } from './reskinner-app.js';

/**
 * Check if an actor is a monster NPC that can be reskinned
 * @param {Actor} actor - The actor to check
 * @returns {boolean} True if the actor is a reskinnable monster
 */
function isReskinnableMonster(actor) {
  // Check if it's an NPC (monster) in the Draw Steel system
  if (!actor || actor.type !== 'npc') return false;
  
  // Check if it's in the Draw Steel system
  const isDrawSteel = game.system.id === 'draw-steel';
  if (!isDrawSteel) return false;
  
  return true;
}

/**
 * Add Reskin button to actor sheet headers
 */
Hooks.on('getActorSheetHeaderButtons', (sheet, buttons) => {
  if (!isReskinnableMonster(sheet.actor)) return;
  
  buttons.unshift({
    class: 'reskin-actor',
    icon: 'fas fa-palette',
    label: game.i18n.localize('DSRESKINNER.Reskin'),
    onclick: async () => {
      const reskinApp = new ReskinApp(sheet.actor);
      await reskinApp.render(true);
    }
  });
});

/**
 * Add Reskin option to actor context menu (Foundry VTT v13)
 */
Hooks.on('getActorContextOptions', (html, menuItems) => {
  // Add the context menu option for reskinning
  menuItems.push({
    name: game.i18n.localize('DSRESKINNER.ReskinMonster'),
    icon: '<i class="fas fa-palette"></i>',
    condition: (li) => {
      // Get actor ID from the list item's dataset (Foundry V13 way, replacing jQuery .data() method)
      const actorId = li.dataset.documentId || li.dataset.entryId;
      if (!actorId) {
        return false;
      }
      
      const actor = game.actors.get(actorId);
      return actor ? isReskinnableMonster(actor) : false;
    },
    callback: async (li) => {
      // Get actor ID from the list item's dataset (Foundry V13 way, replacing jQuery .data() method)
      const actorId = li.dataset.documentId || li.dataset.entryId;
      if (!actorId) {
        return;
      }
      
      const actor = game.actors.get(actorId);
      if (!actor) {
        return;
      }
      
      const reskinApp = new ReskinApp(actor);
      await reskinApp.render(true);
    }
  });
});

/**
 * Main module class for initialization and hooks
 */
class DrawSteelReskinner {
  static init() {
    // Module initialization
  }

  static ready() {
    // Module ready
  }
}

// Register the module hooks
Hooks.on('init', () => {
  DrawSteelReskinner.init();
});

Hooks.on('ready', () => {
  DrawSteelReskinner.ready();
});


