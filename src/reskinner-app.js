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
export class ReskinApp extends HandlebarsApplication {
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
  async getData(options) {
    console.log('ReskinApp | getData called with actor:', this.actor?.name || 'undefined');
    console.log('ReskinApp | Actor data:', {
      name: this.actor?.name,
      id: this.actor?.id,
      type: this.actor?.type,
      system: typeof this.actor?.system !== 'undefined' ? 'available' : 'undefined'
    });
    
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
    
    console.log('ReskinApp | _activateListeners called with html:', html);

    // Handle form submission
    // In V2 HandlebarsApplication, we need to bind the form submit handler manually
    const form = html.querySelector('form.reskinner-form');
    console.log('ReskinApp | Found form element:', form ? 'yes' : 'no');
    if (form) {
      form.addEventListener('submit', this._onFormSubmit.bind(this));
      console.log('ReskinApp | Event listener added to form submit');
    }
    
    // Add support for the cancel button click
    const cancelButtons = html.querySelectorAll('.cancel-btn');
    console.log('ReskinApp | Found cancel buttons:', cancelButtons.length);
    cancelButtons.forEach((button, index) => {
      console.log('ReskinApp | Adding click listener to cancel button', index);
      button.addEventListener('click', () => {
        console.log('ReskinApp | Cancel button clicked');
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
