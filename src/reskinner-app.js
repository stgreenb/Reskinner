/**
 * ReskinApp - Main application for reskinning monsters
 */

/**
 * The Reskin application window
 */
export class ReskinApp extends Application {
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
