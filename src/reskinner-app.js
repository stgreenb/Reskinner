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
   * Define the template parts for this application.
   */
  static PARTS = {
    "content": {
      template: "modules/ds-reskinner/templates/reskin-form.hbs"
    }
  };

  /**
   * Damage type constants for Draw Steel system
   */
  static DAMAGE_TYPES = [
    'acid', 'cold', 'corruption', 'fire', 'holy', 
    'lightning', 'poison', 'psychic', 'sonic'
  ];
  
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
    
    // Note: Damage type analysis should run when damage section is expanded, not here
    // Initialize with empty damage types to avoid premature analysis
    const damageTypes = ReskinApp.DAMAGE_TYPES.map(type => ({
      type,
      count: 0 // Will be populated when section is expanded
    }));
    
    const context = {
      actor: this.actor,
      actorName: this.actor.name || this.actor.data?.name || 'Unknown',
      actorId: this.actor.id || this.actor._id,
      damageTypes: damageTypes
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

    // Handle damage type section toggle
    const toggleBtn = this.element.querySelector('#damage-type-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (event) => {
        event.preventDefault();
        this._toggleDamageSection();
      });
    }

    // Handle damage type selection changes
    const sourceSelect = this.element.querySelector('#source-damage-type');
    const targetSelect = this.element.querySelector('#target-damage-type');
    if (sourceSelect) {
      sourceSelect.addEventListener('change', () => this._updateDamageValidation());
    }
    if (targetSelect) {
      targetSelect.addEventListener('change', () => this._updateDamageValidation());
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
    this._damageTypeCounts = null;
    this._placeholders = new Map(); // For preventing double-swapping
    console.log('ReskinApp | Constructor called with actor:', actor?.name || 'undefined');
  }

  /**
   * Toggle damage type section visibility and analyze damage types
   */
  _toggleDamageSection() {
    const content = this.element.querySelector('#damage-type-content');
    const toggleBtn = this.element.querySelector('#damage-type-toggle');
    const icon = toggleBtn?.querySelector('i');
    
    if (!content) return;

    const isHidden = content.style.display === 'none';
    
    if (isHidden) {
      // Show section and analyze damage types
      this._analyzeDamageTypes();
      content.style.display = 'block';
      if (icon) icon.classList.remove('fa-chevron-right');
      if (icon) icon.classList.add('fa-chevron-down');
    } else {
      // Hide section
      content.style.display = 'none';
      if (icon) icon.classList.remove('fa-chevron-down');
      if (icon) icon.classList.add('fa-chevron-right');
    }
  }

  /**
   * Analyze damage types and update UI accordingly
   */
  _analyzeDamageTypes() {
    const damageCounts = this._countDamageTypes();
    const totalDamageTypes = Object.entries(damageCounts).filter(([_, count]) => count > 0).length;
    
    const analysisDiv = this.element.querySelector('#damage-analysis');
    const controlsDiv = this.element.querySelector('#damage-type-controls');
    const noDamageDiv = this.element.querySelector('#no-damage-types');

    if (totalDamageTypes === 0) {
      // No damage types found - hide controls and show message
      analysisDiv.style.display = 'none';
      controlsDiv.style.display = 'none';
      noDamageDiv.style.display = 'block';
      
      // Close the section
      const content = this.element.querySelector('#damage-type-content');
      const toggleBtn = this.element.querySelector('#damage-type-toggle');
      const icon = toggleBtn?.querySelector('i');
      
      setTimeout(() => {
        content.style.display = 'none';
        if (icon) {
          icon.classList.remove('fa-chevron-down');
          icon.classList.add('fa-chevron-right');
        }
      }, 2000);
    } else {
      // Damage types found - hide analysis and show controls
      setTimeout(() => {
        analysisDiv.style.display = 'none';
        controlsDiv.style.display = 'block';
        this._updateDamageOptions();
        this._updateDamageValidation();
      }, 500);
      
      // Keep no damage hidden
      noDamageDiv.style.display = 'none';
    }
  }

  /**
   * Analyze damage types (spec-compliant method name)
   */
  async analyzeDamageTypes() {
    console.log('ReskinApp | analyzeDamageTypes: Forcing recalc and clearing cache');
    // Clear cache and force recalculation for debugging
    this._damageTypeCounts = null;
    return this._countDamageTypes(true);
  }

  /**
   * Update damage type dropdown options based on current counts
   */
  async _updateDamageOptions() {
    console.log('ReskinApp | _updateDamageOptions: Analyzing damage types and updating dropdowns');
    
    // Use the spec-compliant method
    const damageCounts = await this.analyzeDamageTypes();
    
    const sourceSelect = this.element.querySelector('#source-damage-type');
    const targetSelect = this.element.querySelector('#target-damage-type');

    if (!sourceSelect || !targetSelect) return;

    // Update source select with current counts
    sourceSelect.innerHTML = '';
    ReskinApp.DAMAGE_TYPES.forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = `${game.i18n.localize(`DSRESKINNER.DamageType.${type}`)} (${damageCounts[type] || 0})`;
      if (damageCounts[type] === 0) option.disabled = true;
      sourceSelect.appendChild(option);
    });

    // Update target select (all options available)
    targetSelect.innerHTML = '';
    ReskinApp.DAMAGE_TYPES.forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = game.i18n.localize(`DSRESKINNER.DamageType.${type}`);
      targetSelect.appendChild(option);
    });
    
    console.log('ReskinApp | Dropdown options updated with damage counts:', damageCounts);
  }

  /**
   * Update damage type validation and preview
   */
  _updateDamageValidation() {
    const sourceSelect = this.element.querySelector('#source-damage-type');
    const targetSelect = this.element.querySelector('#target-damage-type');
    const validationDiv = this.element.querySelector('#damage-validation');
    const previewDiv = this.element.querySelector('#damage-preview');

    if (!sourceSelect || !targetSelect || !validationDiv) return;

    const sourceType = sourceSelect.value;
    const targetType = targetSelect.value;
    const damageCounts = this._countDamageTypes();

    // Clear previous validation
    validationDiv.innerHTML = '';

    if (sourceType === targetType && sourceType) {
      // Same type selected - show error
      validationDiv.innerHTML = `<p class="error">${game.i18n.localize('DSRESKINNER.DamageTypeSameError')}</p>`;
      sourceSelect.classList.add('error');
      targetSelect.classList.add('error');
    } else {
      // Valid selection - show preview
      sourceSelect.classList.remove('error');
      targetSelect.classList.remove('error');
      
      if (sourceType && targetType) {
        const count = damageCounts[sourceType] || 0;
        previewDiv.innerHTML = `<p class="preview-message">${game.i18n.format('DSRESKINNER.DamageTypePreview', { 
          count,
          source: game.i18n.localize(`DSRESKINNER.DamageType.${sourceType}`),
          target: game.i18n.localize(`DSRESKINNER.DamageType.${targetType}`)
        })}</p>`;
      }
    }
  }

  /**
   * Handle form submission manually when the submit button is clicked
   * @param {Event} event - The button click event
   */
  async _handleFormSubmit(event) {
    event.preventDefault();
    
    // Get name input
    const inputElement = this.element.querySelector('input[name="actorName"]');
    const newName = inputElement ? inputElement.value : '';
    
    if (!newName || newName.trim() === '') {
      ui.notifications.error(game.i18n.localize('DSRESKINNER.NameEmptyError'));
      return;
    }

    // Get damage type selections
    const sourceSelect = this.element.querySelector('#source-damage-type');
    const targetSelect = this.element.querySelector('#target-damage-type');
    const damageSectionOpen = this.element.querySelector('#damage-type-content').style.display !== 'none';
    
    let sourceDamageType = null;
    let targetDamageType = null;
    
    if (damageSectionOpen && sourceSelect && targetSelect) {
      sourceDamageType = sourceSelect.value;
      targetDamageType = targetSelect.value;
      
      // Validate damage type selection
      if (sourceDamageType && targetDamageType && sourceDamageType === targetDamageType) {
        ui.notifications.error(game.i18n.localize('DSRESKINNER.DamageTypeSameError'));
        return;
      }
    }
    
    try {
      const sourceData = this.actor.toObject();
      let newActorData = foundry.utils.deepClone(sourceData);

      // Replace damage types using placeholder system if requested
      if (sourceDamageType && targetDamageType) {
        console.log('ReskinApp | Replacing damage types:', sourceDamageType, '->', targetDamageType);
        
        const originalName = this.actor.name || this.actor.data?.name || 'Unknown';
        const nameProtectionPlaceholder = `__PROTECTED_NAME_${Date.now()}__`;
        const originalNamePlaceholder = `__PROTECTED_ORIGINAL_NAME_${Date.now()}__`;
        
        // Step 1: Protect BOTH names from damage type replacements
        newActorData = this._replaceNameInObject(newActorData, newName.trim(), nameProtectionPlaceholder);
        newActorData = this._replaceNameInObject(newActorData, originalName, originalNamePlaceholder);
        
        // Step 2: Swap immunities AND weaknesses
        newActorData = this._swapDamageTypeImmunities(newActorData, sourceDamageType, targetDamageType);
        
        // Step 3: Replace damage types in arrays/effects ONLY
        this._placeholders.clear();
        newActorData = this._replaceDamageTypeWithPlaceholders(newActorData, sourceDamageType, targetDamageType, false);
        newActorData = this._replaceDamageTypeWithPlaceholders(newActorData, sourceDamageType, targetDamageType, true);
        
        // Step 4: Restore both protected names to the NEW name
        newActorData = this._replaceNameInObject(newActorData, nameProtectionPlaceholder, newName.trim());
        newActorData = this._replaceNameInObject(newActorData, originalNamePlaceholder, newName.trim());
        
        console.log('ReskinApp | All replacements completed');
      } else {
        // No damage replacement, just simple name change
        const originalName = this.actor.name || this.actor.data?.name || 'Unknown';
        newActorData = this._replaceNameInObject(newActorData, originalName, newName.trim());
      }

      // Finalize the new actor data
      newActorData = foundry.utils.mergeObject(newActorData, {
        _id: null,
        folder: null,
        ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE }
      });
      
      await Actor.create(newActorData);
      
      const message = sourceDamageType && targetDamageType 
        ? game.i18n.format('DSRESKINNER.CreateSuccess', { name: newName }) + ` (${game.i18n.localize(`DSRESKINNER.DamageType.${sourceDamageType}`)} → ${game.i18n.localize(`DSRESKINNER.DamageType.${targetDamageType}`)})`
        : game.i18n.format('DSRESKINNER.CreateSuccess', { name: newName });
        
      ui.notifications.info(message);
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

  /**
   * Swap damage type immunities/weaknesses with direct value transfer
   * @param {Object} obj - Actor data object
   * @param {string} oldDamageType - Original damage type
   * @param {string} newDamageType - Target damage type
   * @returns {Object} Modified object
   */
  _swapDamageTypeImmunities(obj, oldDamageType, newDamageType) {
    if (!obj || typeof obj !== 'object') return obj;
    
    // Handle damage.immunities
    if (obj.system?.damage?.immunities) {
      const immunities = obj.system.damage.immunities;
      
      if (immunities.hasOwnProperty(oldDamageType) && immunities[oldDamageType] > 0) {
        const oldValue = immunities[oldDamageType];
        immunities[newDamageType] = oldValue;  // Set new damage type
        immunities[oldDamageType] = 0;         // Clear old damage type
        console.log(`ReskinApp | Swapped immunity: ${oldDamageType}:${oldValue} → ${newDamageType}:${oldValue}`);
      }
    }
    
    // Handle damage.weaknesses
    if (obj.system?.damage?.weaknesses) {
      const weaknesses = obj.system.damage.weaknesses;
      
      if (weaknesses.hasOwnProperty(oldDamageType) && weaknesses[oldDamageType] > 0) {
        const oldValue = weaknesses[oldDamageType];
        weaknesses[newDamageType] = oldValue;
        weaknesses[oldDamageType] = 0;
        console.log(`ReskinApp | Swapped weakness: ${oldDamageType}:${oldValue} → ${newDamageType}:${oldValue}`);
      }
    }
    
    return obj;
  }

  /**
   * Count damage types in actor data with caching
   * @param {boolean} forceRecalc - Force recalculation even if cached
   * @returns {Object} Object with damage type counts
   */
  _countDamageTypes(forceRecalc = false) {
    if (!forceRecalc && this._damageTypeCounts) {
      console.log('ReskinApp | Using cached damage type counts:', this._damageTypeCounts);
      return this._damageTypeCounts;
    }

    console.log('ReskinApp | Counting damage types for actor:', this.actor.name);
    const counts = {};
    const damageTypes = ReskinApp.DAMAGE_TYPES;
    
    // Initialize counts to zero
    damageTypes.forEach(type => {
      counts[type] = 0;
    });

    // Count damage types in actor data
    const actorData = this.actor.toObject();
    console.log('ReskinApp | Actor data structure preview:', {
      name: actorData.name,
      hasItems: !!actorData.items,
      itemsCount: actorData.items?.length || 0,
      hasSystem: !!actorData.system,
      keys: Object.keys(actorData)
    });
    
    this._countDamageTypesInObject(actorData, counts);
    
    console.log('ReskinApp | Final damage type counts:', counts);
    const totalDamageTypes = Object.entries(counts).filter(([_, count]) => count > 0).length;
    console.log('ReskinApp | Total damage types found:', totalDamageTypes);
    
    this._damageTypeCounts = counts;
    return counts;
  }

  /**
   * Recursively count damage types in an object
   * @param {*} obj - Object to traverse
   * @param {Object} counts - Counts object to update
   * @param {string} parentKey - Parent key for context
   */
  _countDamageTypesInObject(obj, counts, parentKey = '') {
    // Skip excluded media fields EARLY
    if (this._isExcludedField(parentKey)) {
      return;
    }

    // Handle strings - COUNT DAMAGE TYPES HERE
    if (typeof obj === 'string') {
      const lowerStr = obj.toLowerCase();
      ReskinApp.DAMAGE_TYPES.forEach(damageType => {
        // Count whole word matches using word boundaries
        const regex = new RegExp(`\\b${damageType}\\b`, 'gi');
        const matches = lowerStr.match(regex);
        if (matches) {
          counts[damageType] += matches.length;
          console.log(`ReskinApp | ✅ Found ${matches.length} instance(s) of "${damageType}" in ${parentKey}: ${matches.join(', ')}`);
        }
      });
      return; // Don't recurse further on strings
    }

    // Skip null/non-objects
    if (obj === null || typeof obj !== 'object') {
      return;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        this._countDamageTypesInObject(item, counts, `${parentKey}[${index}]`);
      });
      return;
    }

    // Handle objects - RECURSE INTO ALL values
    Object.entries(obj).forEach(([key, value]) => {
      this._countDamageTypesInObject(value, counts, key);
    });
  }

  /**
   * Check if a field should be excluded from text replacement
   * @param {string} parentKey - Parent field key
   * @returns {boolean} True if field should be excluded
   */
  _isExcludedField(parentKey) {
    const excludedFields = ['img', 'icon', 'src', 'path', 'url', 'uri', 'texture', 'srcSmall', 'srcLarge'];
    return parentKey && excludedFields.includes(parentKey.toLowerCase());
  }

  /**
   * Replace giant type references in object (e.g., "fire giant" → "storm giant")
   * @param {Object} obj - Object to modify
   * @param {string} oldGiantType - Old giant type (e.g., "fire giant")
   * @param {string} newGiantType - New giant type (e.g., "storm giant")
   * @returns {Object} Modified object
   */
  _replaceGiantTypeInObject(obj, oldGiantType, newGiantType) {
    if (!obj || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
      return obj.map(item => {
        if (typeof item === 'string') {
          const regex = new RegExp(`\\b${oldGiantType}\\b`, 'gi');
          return item.replace(regex, (match) => {
            if (match === match.toLowerCase()) return newGiantType.toLowerCase();
            if (match === match.toUpperCase()) return newGiantType.toUpperCase();
            return newGiantType.charAt(0).toUpperCase() + newGiantType.slice(1).toLowerCase();
          });
        } else {
          return this._replaceGiantTypeInObject(item, oldGiantType, newGiantType);
        }
      });
    }

    const newObj = { ...obj };
    Object.entries(newObj).forEach(([key, value]) => {
      // Skip excluded fields
      if (this._isExcludedField(key)) {
        return;
      }
      
      if (typeof value === 'string') {
        const regex = new RegExp(`\\b${oldGiantType}\\b`, 'gi');
        newObj[key] = value.replace(regex, (match) => {
          // Preserve original case
          if (match === match.toLowerCase()) return newGiantType.toLowerCase();
          if (match === match.toUpperCase()) return newGiantType.toUpperCase();
          return newGiantType.charAt(0).toUpperCase() + newGiantType.slice(1).toLowerCase();
        });
      } else if (typeof value === 'object') {
        newObj[key] = this._replaceGiantTypeInObject(value, oldGiantType, newGiantType);
      }
    });
    
    return newObj;
  }

  /**
   * Generate unique placeholder for damage type replacement
   * @param {string} damageType - Original damage type
   * @returns {string} Unique placeholder
   */
  _generatePlaceholder(damageType) {
    const placeholder = `__DSREPLACE_${damageType.toUpperCase()}_${Date.now()}__`;
    this._placeholders.set(damageType, placeholder);
    return placeholder;
  }

  /**
   * Replace damage types using placeholder system to prevent double-swapping
   * @param {Object} obj - Object to modify
   * @param {string} oldDamageType - Damage type to replace
   * @param {string} newDamageType - New damage type
   * @param {boolean} isPlaceholderPass - Whether this is the placeholder replacement pass
   * @returns {Object} Modified object
   */
  _replaceDamageTypeWithPlaceholders(obj, oldDamageType, newDamageType, isPlaceholderPass = false) {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => {
        if (typeof item === 'string') {
          // Handle direct string matches in arrays (like "types": ["fire"])
          if (item.toLowerCase() === oldDamageType.toLowerCase()) {
            console.log(`ReskinApp | Direct array replacement: ${item} → ${newDamageType}`);
            return newDamageType;
          }
          
          // Handle string arrays with word boundary matching
          if (!isPlaceholderPass) {
            if (!this._placeholders.has(oldDamageType)) {
              this._generatePlaceholder(oldDamageType);
            }
            const placeholder = this._placeholders.get(oldDamageType);
            const regex = new RegExp(`\\b${oldDamageType}\\b`, 'gi');
            return item.replace(regex, (match) => {
              if (match === match.toLowerCase()) return placeholder.toLowerCase();
              if (match === match.toUpperCase()) return placeholder.toUpperCase();
              return placeholder.charAt(0).toUpperCase() + placeholder.slice(1).toLowerCase();
            });
          } else {
            const placeholder = this._placeholders.get(oldDamageType);
            if (placeholder) {
              const regex = new RegExp(placeholder, 'gi');
              return item.replace(regex, (match) => {
                if (match === match.toLowerCase()) return newDamageType.toLowerCase();
                if (match === match.toUpperCase()) return newDamageType.toUpperCase();
                return newDamageType.charAt(0).toUpperCase() + newDamageType.slice(1).toLowerCase();
              });
            }
            return item;
          }
        } else {
          return this._replaceDamageTypeWithPlaceholders(item, oldDamageType, newDamageType, isPlaceholderPass);
        }
      });
    }

    const newObj = { ...obj };
    Object.entries(newObj).forEach(([key, value]) => {
      // Skip excluded fields
      if (this._isExcludedField(key)) {
        return;
      }
      
      // Special handling for "types" arrays
      if (key === 'types' && Array.isArray(value)) {
        newObj[key] = value.map(type => {
          if (typeof type === 'string' && type.toLowerCase() === oldDamageType.toLowerCase()) {
            console.log(`ReskinApp | Types array replacement: ${type} → ${newDamageType}`);
            return newDamageType;
          }
          return type;
        });
      } else if (typeof value === 'string') {
        if (!isPlaceholderPass) {
          // First pass: Replace damage types with placeholders
          if (!this._placeholders.has(oldDamageType)) {
            this._generatePlaceholder(oldDamageType);
          }
          const placeholder = this._placeholders.get(oldDamageType);
          
          // Use word boundary regex to match whole words
          const regex = new RegExp(`\\b${oldDamageType}\\b`, 'gi');
          newObj[key] = value.replace(regex, (match) => {
            // Preserve original case
            if (match === match.toLowerCase()) return placeholder.toLowerCase();
            if (match === match.toUpperCase()) return placeholder.toUpperCase();
            return placeholder.charAt(0).toUpperCase() + placeholder.slice(1).toLowerCase();
          });
        } else {
          // Second pass: Replace placeholders with final damage type
          const placeholder = this._placeholders.get(oldDamageType);
          if (placeholder) {
            const regex = new RegExp(placeholder, 'gi');
            newObj[key] = value.replace(regex, (match) => {
              // Preserve original case from placeholder
              if (match === match.toLowerCase()) return newDamageType.toLowerCase();
              if (match === match.toUpperCase()) return newDamageType.toUpperCase();
              return newDamageType.charAt(0).toUpperCase() + newDamageType.slice(1).toLowerCase();
            });
          }
        }
      } else if (typeof value === 'object') {
        newObj[key] = this._replaceDamageTypeWithPlaceholders(value, oldDamageType, newDamageType, isPlaceholderPass);
      }
    });

    return newObj;
  }

  /**
   * Replace actor name in object
   * @param {Object} obj - Object to modify
   * @param {string} oldName - Name to replace
   * @param {string} newName - New name
   * @returns {Object} Modified object
   */
  _replaceNameInObject(obj, oldName, newName) {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => {
        if (typeof item === 'string') {
          const regex = new RegExp(`\\b${oldName}\\b`, 'gi');
          return item.replace(regex, (match) => {
            if (match === match.toLowerCase()) return newName.toLowerCase();
            if (match === match.toUpperCase()) return newName.toUpperCase();
            return newName.charAt(0).toUpperCase() + newName.slice(1).toLowerCase();
          });
        } else {
          return this._replaceNameInObject(item, oldName, newName);
        }
      });
    }

    const newObj = { ...obj };
    Object.entries(newObj).forEach(([key, value]) => {
      // Skip excluded fields
      if (this._isExcludedField(key)) {
        return;
      }

      if (typeof value === 'string') {
        // Replace name with case-insensitive matching, preserving original case
        const regex = new RegExp(`\\b${oldName}\\b`, 'gi');
        newObj[key] = value.replace(regex, (match) => {
          // Preserve original case
          if (match === match.toLowerCase()) return newName.toLowerCase();
          if (match === match.toUpperCase()) return newName.toUpperCase();
          return newName.charAt(0).toUpperCase() + newName.slice(1).toLowerCase();
        });
      } else if (typeof value === 'object') {
        newObj[key] = this._replaceNameInObject(value, oldName, newName);
      }
    });

    return newObj;
  }


}
