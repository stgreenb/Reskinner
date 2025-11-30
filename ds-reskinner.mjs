/**
 * ReskinApp - Main application for reskinning monsters (Draw Steel V13 Compatible)
 */

/**
 * Application to be mixed in with Foundry's Handlebars functionality
 */
const HandlebarsApplication = foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2);

/**
 * The Reskin application window
 */
class ReskinApp extends HandlebarsApplication {
  /**
   * Create the ReskinApp
   * @param {Actor} actor - The actor to reskin
   * @param {Object} options - Additional options
   */
  constructor(actor, options = {}) {
    super(options);
    
    this.actor = actor;
  }

  /**
   * Default configuration for the application
   * @returns {Object} Application options
   * @override
   */
  /**
   * Get the content template for the application
   * @returns {string} Template path
   * @override
   */
  get template() {
    return 'modules/ds-reskinner/templates/reskin-form.hbs';
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      window: {
        title: game.i18n.localize('DSRESKINNER.ReskinMonster'),
        contentClasses: ['reskinner-app'],
        minimizable: true,
        resizable: false
      },
      position: {
        width: 400,
        height: 300
      }
    });
  }

  /**
   * Get the data object for the template
   * @returns {Object} Template data
   * @override
   */
  _prepareContext(options) {
    return {
      actor: this.actor,
      actorName: this.actor.name,
      actorId: this.actor.id
    };
  }

  /**
   * Activate event listeners
   * @param {HTMLElement} html - The rendered HTML
   * @override
   */
  _activateListeners(html) {
    super._activateListeners(html);

    // Handle form submission
    // In V2 HandlebarsApplication, we need to bind the form submit handler manually
    const form = html.querySelector('form.reskinner-form');
    if (form) {
      form.addEventListener('submit', this._onFormSubmit.bind(this));
    }
    
    // Add support for the cancel button click
    const cancelButtons = html.querySelectorAll('.cancel-btn');
    cancelButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.close();
      });
    });
  }

  /**
   * Handle form submission
   * @param {Event} event - The submit event
   * @private
   */
  async _onFormSubmit(event) {
    event.preventDefault();
    
    // Get the form data directly from the event target to access the submitted data
    const form = event.target;
    const formData = new FormData(form);
    const newName = formData.get('actorName');
    
    if (!newName || newName.trim() === '') {
      ui.notifications.error(game.i18n.localize('DSRESKINNER.NameEmptyError'));
      return;
    }

    try {
      // Create a new actor based on the current actor's data
      const sourceData = this.actor.toObject();
      
      // Update the name and generate a new ID for the new actor
      const newActorData = foundry.utils.mergeObject(sourceData, {
        name: newName.trim(),
        _id: null, // This ensures a new ID will be generated
        folder: null, // Don't assign to any specific folder by default
        ownership: { // Ensure proper ownership defaults
          default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE
        }
      });

      // Create the cloned actor in the actors directory
      await Actor.create(newActorData);
      
      ui.notifications.info(game.i18n.format('DSRESKINNER.CreateSuccess', { name: newName }));
      this.close();
    } catch (error) {
      console.error('Draw Steel Reskinner | Error creating reskin:', error);
      ui.notifications.error(game.i18n.localize('DSRESKINNER.CreateError'));
    }
  }
}

/**
 * Draw Steel Reskinner Module
 * A Foundry VTT module for reskinning Draw Steel monsters
 * Version: 0.1.26 - Fixed Foundry V13 compatibility with Draw Steel system
 */

// Centralized version reference to ensure consistency across the module
const MODULE_VERSION = '0.1.26';

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
//# sourceMappingURL=ds-reskinner.mjs.map
