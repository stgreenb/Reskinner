/**
 * ReskinApp - Main application for reskinning monsters (Draw Steel V13 Compatible)
 * Version: 0.1.49 - Updated button click event handling to collect input values correctly
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
   * Define the template parts for this application.
   */
  static PARTS = {
    "content": {
      template: "modules/ds-reskinner/templates/reskin-form.hbs"
    }
  };
  
  /**
   * Define action handlers for this application
   */
  static ACTIONS = {
    cancel: 'close'
  };
  
  /**
   * Default configuration for the application
   * @returns {Object} Application options
   * @override
   */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      window: {
        title: game.i18n.localize('DSRESKINNER.ReskinMonster'),
        contentClasses: ['reskinner-app'],
        minimizable: true,
        resizable: true,
        positioned: true
      },
      position: {
        width: 600,
        height: 'auto'
      },
      classes: ['reskinner-app']
    });
  }



  /**
   * Render the application
   * @param {boolean} force - Force re-rendering
   * @param {object} options - Rendering options
   * @returns {Promise<this>} This application instance
   * @override
   */
  async render(force = false, options = {}) {
    console.log('ReskinApp | render called with force:', force, 'options:', options);
    
    // Log before calling parent render to track execution flow
    console.log('ReskinApp | About to call super.render()');
    
    // Call the parent render method to ensure proper initialization
    const result = await super.render(force, options);
    
    // Log after to verify the render completed
    console.log('ReskinApp | super.render() completed, result:', result);
    
    return result;
  }

  /**
   * Prepare context for the application template
   * @param {object} options - Options passed to the template rendering function
   * @returns {object} The template context data
   * @override
   */
  async _prepareContext(options = {}) {
    console.log('ReskinApp | _prepareContext called with actor:', this.actor?.name || 'undefined');
    console.log('ReskinApp | Actor data:', {
      name: this.actor?.name,
      id: this.actor?.id,
      type: this.actor?.type,
      system: typeof this.actor?.system !== 'undefined' ? 'available' : 'undefined'
    });
    
    if (!this.actor) {
      throw new Error('ReskinApp | Actor is required but not provided');
    }
    
    const context = {
      actor: this.actor,
      actorName: this.actor.name || this.actor.data?.name || 'Unknown',
      actorId: this.actor.id || this.actor._id
    };
    
    console.log('ReskinApp | Preparing context for template:', 'modules/ds-reskinner/templates/reskin-form.hbs', 'with data:', context);
    
    return context;
  }

  /**
   * Prepare context for each template part
   * @param {string} partId - The partId name
   * @param {object} context - The context data
   * @returns {object} The part-specific context
   * @override
   */
  async _preparePartContext(partId, context) {
    return context;
  }

  /**
   * Called after the application renders and is added to the DOM
   * @param {HTMLElement} element - The HTML element that was rendered
   * @override
   */
  _onRender(context, options) {
    super._onRender(context, options);
    
    console.log('ReskinApp | _onRender called with element:', this.element);
    
    // Find the submit button and attach a click handler instead of form submit
    const submitBtn = this.element.querySelector('button[data-action="submit"]');
    if (submitBtn) {
      console.log('ReskinApp | Found submit button! Attaching click handler.');
      submitBtn.addEventListener('click', (event) => this._handleFormSubmit(event));
    } else {
      console.log('ReskinApp | ❌ Submit button not found');
    }
    
    // Also handle cancel
    const cancelBtn = this.element.querySelector('button[data-action="cancel"]');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', (event) => {
        event.preventDefault();
        this.close();
      });
    }
    
    console.log('ReskinApp | Window content element:', this.element?.[0]);
    console.log('ReskinApp | Application is in DOM:', this.element?.[0] && this.element?.[0].isConnected ? 'yes' : 'no');
  }

  /**
   * Create the ReskinApp
   * @param {Actor} actor - The actor to reskin
   * @param {Object} options - Additional options
   */
  constructor(actor, options = {}) {
    super(options);
    
    this.actor = actor;
    console.log('ReskinApp | Constructor called with actor:', actor?.name || 'undefined');
  }

  /**
   * Handle form submission manually when the submit button is clicked
   * @param {Event} event - The button click event
   */
  async _handleFormSubmit(event) {
    event.preventDefault();
    
    // Manually collect form data since section element won't create FormDataExtended correctly
    const inputElement = this.element.querySelector('input[name="actorName"]');
    const newName = inputElement ? inputElement.value : '';
    
    console.log('ReskinApp | Form submitted with name:', newName);
    
    if (!newName || newName.trim() === '') {
      ui.notifications.error(game.i18n.localize('DSRESKINNER.NameEmptyError'));
      return;
    }
    
    try {
      const sourceData = this.actor.toObject();
      const newActorData = foundry.utils.mergeObject(sourceData, {
        name: newName.trim(),
        _id: null,
        folder: null,
        ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE }
      });
      
      await Actor.create(newActorData);
      ui.notifications.info(game.i18n.format('DSRESKINNER.CreateSuccess', { name: newName }));
      this.close();
    } catch (error) {
      console.error('Draw Steel Reskinner | Error creating reskin:', error);
      ui.notifications.error(game.i18n.localize('DSRESKINNER.CreateError'));
    }
  }









  /**
   * Cancel form action  
   * @param {Event} event - The event that triggered this action
   * @param {HTMLElement} element - The element the action occurred on 
   */
  async _onFormCancel(event) {  
    event.preventDefault();  
    this.close();
  }


}

/**
 * Draw Steel Reskinner Module
 * A Foundry VTT module for reskinning Draw Steel monsters
 * Version: 0.1.49 - Updated button click event handling to collect input values correctly
 */

// Centralized version reference to ensure consistency across the module
const MODULE_VERSION = '0.1.49';

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
    onclick: async () => {
      console.log('Reskin button clicked, creating ReskinApp for:', sheet.actor.name);
      const reskinApp = new ReskinApp(sheet.actor);
      console.log('ReskinApp instance created from sheet header, calling render...');
      await reskinApp.render(true);
      console.log('ReskinApp render called and awaited from sheet header');
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
    callback: async (li) => {
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
      const reskinApp = new ReskinApp(actor);
      console.log('ReskinApp instance created, calling render...');
      await reskinApp.render(true);
      console.log('ReskinApp render called and awaited');
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
