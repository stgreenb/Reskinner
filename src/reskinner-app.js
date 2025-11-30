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
export class ReskinApp extends HandlebarsApplication {
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
    
    // NOTE: With HandlebarsApplicationMixin, using tag: 'form' or automatic form handlers
    // does not work as expected. Instead we manually attach click listeners to the buttons.
    // Form submit events only fire on actual <form> elements, but our template root is
    // a <section> element due to HandlebarsApplication constraints (single root element)
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
    
    // NOTE: We cannot use FormDataExtended with the section element since that only works
    // with actual <form> elements. Instead we manually get the value from the input field.
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
