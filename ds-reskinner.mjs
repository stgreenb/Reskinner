/**
 * ReskinApp - Main application for reskinning monsters
 */

/**
 * The Reskin application window
 */
class ReskinApp extends Application {
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
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: 'modules/ds-reskinner/templates/reskin-form.hbs',
      classes: ['reskinner-app'],
      width: 400,
      height: 300,
      resizable: false,
      minimizable: true,
      title: game.i18n.localize('DSRESKINNER.ReskinMonster')
    });
  }

  /**
   * Get the data object for the template
   * @returns {Object} Template data
   * @override
   */
  getData() {
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
  activateListeners(html) {
    super.activateListeners(html);

    // Handle form submission
    html.find('form.reskinner-form').on('submit', this._onFormSubmit.bind(this));
  }

  /**
   * Handle form submission
   * @param {Event} event - The submit event
   * @private
   */
  async _onFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const newName = formData.get('actorName');
    
    if (!newName || newName.trim() === '') {
      ui.notifications.error(game.i18n.localize('DSRESKINNER.NameEmptyError'));
      return;
    }

    try {
      // Clone the actor
      const clonedActor = await this.actor.clone({
        name: newName.trim()
      });

      // Create the cloned actor in the actors directory
      await Actor.create(clonedActor.toObject());
      
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
 */


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
//# sourceMappingURL=ds-reskinner.mjs.map
