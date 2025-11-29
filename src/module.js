/**
 * Draw Steel Reskinner Module
 * A Foundry VTT module for reskinning Draw Steel monsters
 */

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
    onclick: () => {
      const reskinApp = new ReskinApp(sheet.actor);
      reskinApp.render(true);
    }
  });
});

/**
 * Add Reskin option to actor directory context menu
 */
Hooks.on('getActorDirectoryEntryContext', (html, entryOptions) => {
  const actor = entryOptions[0]?.document;
  if (!isReskinnableMonster(actor)) return;
  
  entryOptions.unshift({
    name: 'Reskin Monster',
    icon: '<i class="fas fa-palette"></i>',
    callback: () => {
      const reskinApp = new ReskinApp(actor);
      reskinApp.render(true);
    }
  });
});

/**
 * Main module class for initialization and hooks
 */
class DrawSteelReskinner {
  static init() {
    console.log('Draw Steel Reskinner | Initializing module');
  }

  static ready() {
    console.log('Draw Steel Reskinner | Ready - all hooks registered');
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
console.log('Draw Steel Reskinner | Module loaded');
