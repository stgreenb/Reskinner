/**
 * Draw Steel Reskinner Module
 * A Foundry VTT module for reskinning Draw Steel monsters
 * Version: 0.1.26 - Fixed Foundry V13 compatibility with Draw Steel system
 */

// Centralized version reference to ensure consistency across the module
const MODULE_VERSION = '0.1.26';

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
  console.log('getActorSheetHeaderButtons hook triggered');
  console.log('Sheet actor:', sheet.actor);
  console.log('Is reskinnable?', sheet.actor ? isReskinnableMonster(sheet.actor) : 'No actor found');
  
  if (!isReskinnableMonster(sheet.actor)) return;
  
  console.log('Adding Reskin button to actor sheet header');
  buttons.unshift({
    class: 'reskin-actor',
    icon: 'fas fa-palette',
    label: game.i18n.localize('DSRESKINNER.Reskin'),
    onclick: () => {
      const reskinApp = new ReskinApp(sheet.actor);
      reskinApp.render(true);
    }
  });
});

/**
 * Add Reskin option to actor context menu (Foundry VTT v13)
 */
Hooks.on('getActorContextOptions', (html, menuItems) => {
  console.log('getActorContextOptions called with html element and', menuItems.length, 'existing items');
  
  // Add the context menu option for reskinning
  menuItems.push({
    name: game.i18n.localize('DSRESKINNER.ReskinMonster'),
    icon: '<i class="fas fa-palette"></i>',
    condition: (li) => {
      console.log('Condition function called with li element:', li);
      // Get actor ID from the list item's dataset (Foundry V13 way, replacing jQuery .data() method)
      const actorId = li.dataset.documentId || li.dataset.entryId;
      if (!actorId) {
        console.log('No actor ID found in element dataset');
        return false;
      }
      
      const actor = game.actors.get(actorId);
      console.log('Found actor in condition:', actor ? {name: actor.name, type: actor.type} : 'none');
      
      const result = actor ? isReskinnableMonster(actor) : false;
      console.log('Condition result:', result);
      return result;
    },
    callback: (li) => {
      console.log('Callback function called with li element:', li);
      // Get actor ID from the list item's dataset (Foundry V13 way, replacing jQuery .data() method)
      const actorId = li.dataset.documentId || li.dataset.entryId;
      if (!actorId) {
        console.warn('No actor ID found in element dataset');
        return;
      }
      
      const actor = game.actors.get(actorId);
      if (!actor) {
        console.warn('Could not find actor with ID:', actorId);
        return;
      }
      
      console.log('Opening reskin app for actor:', actor.name);
      new ReskinApp(actor).render(true);
    }
  });
});

/**
 * Main module class for initialization and hooks
 */
class DrawSteelReskinner {
  static init() {
    console.log(`Draw Steel Reskinner | Initializing module version ${MODULE_VERSION} - Enhanced actor detection including DOM traversal when app.context is undefined`);
  }

  static ready() {
    console.log(`Draw Steel Reskinner | Ready - all hooks registered version ${MODULE_VERSION}`);
  }
}

// Register the module hooks
Hooks.on('init', () => {
  DrawSteelReskinner.init();
});

Hooks.on('ready', () => {
  DrawSteelReskinner.ready();
});

// Log module initialization
console.log(`Draw Steel Reskinner | Module loaded version ${MODULE_VERSION}`);
