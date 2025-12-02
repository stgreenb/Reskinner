/**
 * ReskinApp - Main application for reskinning monsters (Draw Steel V13 Compatible)
 */

/**
 * Application to be mixed in with Foundry's Handlebars functionality
 */
const HandlebarsApplication = foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2);

/**
 * Import level adjustment calculation functions
 */
import {
  calculateEncounterValue,
  calculateStamina,
  calculateDamage,
  calculateCharacteristics,
  applyAbilityScaling,
  ROLE_MODIFIERS,
  ORGANIZATION_MODIFIERS,
  validateActorData,
  validateLevel
} from './calculators/index.js';

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
   * Movement type constants for Draw Steel system
   */
  static MOVEMENT_TYPES = [
    'walk', 'fly', 'swim', 'burrow', 'climb', 'teleport'
  ];

  /**
   * Monster role constants for level adjustment
   */
  static MONSTER_ROLES = [
    'ambusher', 'artillery', 'brute', 'controller', 'defender', 
    'harrier', 'hexer', 'leader', 'mount', 'support', 'elite'
  ];

  /**
   * Organization type constants for level adjustment
   */
  static ORGANIZATION_TYPES = [
    'minion', 'horde', 'platoon', 'elite', 'leader', 'solo'
  ];

  /**
   * Internal calculation organizations (not for user selection)
   */
  static CALCULATION_ORGANIZATIONS = [
    'minion-stamina', 'solo-stamina'
  ];

  /**
   * Get available organization options based on current monster organization
   */
  static getAvailableOrganizationOptions(currentOrganization) {
    // Leader/Solo monsters can only switch between Leader and Solo
    if (currentOrganization === 'leader' || currentOrganization === 'solo') {
      return [
        { value: 'leader', label: 'DSRESKINNER.LevelAdjustment.OrganizationLeader' },
        { value: 'solo', label: 'DSRESKINNER.LevelAdjustment.OrganizationSolo' }
      ];
    }
    
    // Non-Leader/Solo monsters cannot become Leader/Solo
    return [
      { value: 'minion', label: 'DSRESKINNER.LevelAdjustment.OrganizationMinion' },
      { value: 'horde', label: 'DSRESKINNER.LevelAdjustment.OrganizationHorde' },
      { value: 'platoon', label: 'DSRESKINNER.LevelAdjustment.OrganizationPlatoon' },
      { value: 'elite', label: 'DSRESKINNER.LevelAdjustment.OrganizationElite' }
    ];
  }
  
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
        title: 'Reskin', // Will be set dynamically in constructor
        contentClasses: ['reskinner-app'],
        minimizable: true,
        resizable: true,
        positioned: true
      },
      position: {
        width: 650, // Narrower for better space utilization
        height: 'auto',
        minimizable: true
      },
      classes: ['reskinner-app']
    });
  }



  /**
   * Render the application
   * @param {boolean} force - Force re-rendering
   * * @param {object} options - Rendering options
   * @returns {Promise<this>} This application instance
   * @override
   */
  async render(force = false, options = {}) {
    const result = await super.render(force, options);
    
    // Apply custom positioning - 25% closer to top
    // Use setTimeout to ensure DOM is fully rendered and positioned
    setTimeout(() => {
      if (this.element && this.position) {
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const elementWidth = this.element.offsetWidth;
        
        // Calculate new top position: 15% from top (25% closer than default ~40%)
        const newTop = windowHeight * 0.15;
        
        // Ensure the window doesn't go above the viewport
        const adjustedTop = Math.max(0, newTop);
        
        // Set window position through foundry's setPosition method for consistency
        this.setPosition({
          top: adjustedTop,
          left: (windowWidth - elementWidth) / 2
        });
      }
    }, 100); // Small delay to ensure Foundry has positioned the window first
    
    return result;
  }

  /**
   * Prepare context for the application template
   * @param {object} options - Options passed to the template rendering function
   * @returns {object} The template context data
   * @override
   */
  async _prepareContext(options = {}) {
    
    
    if (!this.actor) {
      throw new Error('ReskinApp | Actor is required but not provided');
    }
    
    // Note: Damage type analysis should run when damage section is expanded, not here
    // Initialize with empty damage types to avoid premature analysis
    const damageTypes = ReskinApp.DAMAGE_TYPES.map(type => ({
      type,
      count: 0 // Will be populated when section is expanded
    }));
    
    // Get actor's actual movement data
    const movementData = this._getMovementTypes();
    
    // Initialize movement types for initial render with proper selection state
    const movementTypes = ReskinApp.MOVEMENT_TYPES.map(type => ({
      type,
      selected: movementData.types.includes(type)
    }));
    
    // Extract token image from actor's prototype token
    const tokenImage = this.actor.prototypeToken?.texture?.src || null;
    // Extract character art from actor's avatar (img property)
    const characterArt = this.actor.img || this.actor.data?.img || null;
    
    // Check if level adjustment should be available
    const hasLevelData = validateActorData(this.actor);
    
    // Get current organization for filtering options
    const currentOrganization = this.actor.system?.monster?.organization || 'minion';
    const availableOrganizations = ReskinApp.getAvailableOrganizationOptions(currentOrganization);
    
    const context = {
      actor: this.actor,
      actorName: this.actor.name || this.actor.data?.name || 'Unknown',
      actorId: this.actor.id || this.actor._id,
      damageTypes: damageTypes,
      movementTypes: movementTypes,
      hover: movementData.hover,
      tokenImage: tokenImage,
      characterArt: characterArt,
      system: this.actor.system, // Pass entire system for level data access
      hasLevelAdjustment: hasLevelData,
      availableOrganizations: availableOrganizations
    };
    
    
    
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
    
    // NOTE: With HandlebarsApplicationMixin, using tag: 'form' or automatic form handlers
    // does not work as expected. Instead we manually attach click listeners to the buttons.
    // Form submit events only fire on actual <form> elements, but our template root is
    // a <section> element due to HandlebarsApplication constraints (single root element)
    const submitBtn = this.element.querySelector('button[data-action="submit"]');
    if (submitBtn) {
      submitBtn.addEventListener('click', (event) => this._handleFormSubmit(event));
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

    // Handle movement type section toggle
    const movementToggleBtn = this.element.querySelector('#movement-type-toggle');
    if (movementToggleBtn) {
      movementToggleBtn.addEventListener('click', (event) => {
        event.preventDefault();
        this._toggleMovementSection();
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

    // Handle movement type checkbox changes
    const movementCheckboxes = this.element.querySelectorAll('input[name="movementTypes"]');
    movementCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => this._updateMovementValidation());
    });

    // Handle hover checkbox change
    const hoverCheckbox = this.element.querySelector('input[name="hover"]');
    if (hoverCheckbox) {
      hoverCheckbox.addEventListener('change', () => this._updateMovementValidation());
    }

    // Handle level adjustment section toggle
    const levelToggleBtn = this.element.querySelector('#level-adjustment-toggle');
    if (levelToggleBtn) {
      levelToggleBtn.addEventListener('click', (event) => {
        event.preventDefault();
        this._toggleLevelAdjustmentSection();
      });
    }

    // Handle level adjustment input changes
    const levelInput = this.element.querySelector('#target-level');
    const roleSelect = this.element.querySelector('#monster-role');
    const organizationSelect = this.element.querySelector('#monster-organization');
    
    if (levelInput) {
      levelInput.addEventListener('input', () => this._updateLevelAdjustmentPreview());
    }
    if (roleSelect) {
      roleSelect.addEventListener('change', () => this._updateLevelAdjustmentPreview());
    }
    if (organizationSelect) {
      organizationSelect.addEventListener('change', () => this._updateLevelAdjustmentPreview());
    }

    

    // Handle token image click to launch FilePicker
    const tokenImageContainer = this.element.querySelector('#token-image-container');
    const tokenImage = this.element.querySelector('#token-image');
    const tokenPlaceholder = this.element.querySelector('#token-placeholder');
    
    if (tokenImageContainer) {
      tokenImageContainer.addEventListener('click', (event) => {
        event.preventDefault();
        this._handleTokenImageClick();
      });
    }
    
    // Also handle keyboard clicks on both image and placeholder
    [tokenImage, tokenPlaceholder].forEach(element => {
      if (element) {
        element.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this._handleTokenImageClick();
          }
        });
      }
    });
    
    
  }

  /**
   * Create the ReskinApp
   * @param {Actor} actor - The actor to reskin
   * @param {Object} options - Additional options
   */
  constructor(actor, options = {}) {
    // Set the title dynamically
    const monsterName = actor?.name || actor?.data?.name || 'Unknown';
    const appOptions = foundry.utils.mergeObject(options || {}, {
      window: {
        title: `Reskin: ${monsterName}`
      }
    });
    
    super(appOptions);
    
    this.actor = actor;
    this._damageTypeCounts = null;
    this._placeholders = new Map(); // For preventing double-swapping
    
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
      if (toggleBtn) toggleBtn.classList.remove('collapsed');
    } else {
      // Hide section
      content.style.display = 'none';
      if (icon) icon.classList.remove('fa-chevron-down');
      if (icon) icon.classList.add('fa-chevron-right');
      if (toggleBtn) toggleBtn.classList.add('collapsed');
    }
  }

  /**
   * Toggle movement type section visibility and analyze movement types
   */
  _toggleMovementSection() {
    const content = this.element.querySelector('#movement-type-content');
    const toggleBtn = this.element.querySelector('#movement-type-toggle');
    const icon = toggleBtn?.querySelector('i');
    
    if (!content) return;

    const isHidden = content.style.display === 'none';
    
    if (isHidden) {
      // Show section and analyze movement types
      this._analyzeMovementTypes();
      content.style.display = 'block';
      if (icon) icon.classList.remove('fa-chevron-right');
      if (icon) icon.classList.add('fa-chevron-down');
      if (toggleBtn) toggleBtn.classList.remove('collapsed');
    } else {
      // Hide section
      content.style.display = 'none';
      if (icon) icon.classList.remove('fa-chevron-down');
      if (icon) icon.classList.add('fa-chevron-right');
      if (toggleBtn) toggleBtn.classList.add('collapsed');
    }
  }

  /**
   * Analyze movement types and update UI accordingly
   */
  _analyzeMovementTypes() {
    const movementData = this._getMovementTypes();
    
    const analysisDiv = this.element.querySelector('#movement-analysis');
    const controlsDiv = this.element.querySelector('#movement-type-controls');
    const noMovementDiv = this.element.querySelector('#no-movement-types');

    const typesArray = Array.isArray(movementData.types) ? movementData.types : [];
    
    if (!analysisDiv || !controlsDiv || !noMovementDiv) {
      // Retry after a short delay
      setTimeout(() => this._analyzeMovementTypes(), 100);
      return;
    }
    
    if (typesArray.length === 0) {
      // No movement types found - hide controls and show message
      analysisDiv.style.display = 'none';
      controlsDiv.style.display = 'none';
      noMovementDiv.style.display = 'block';
    } else {
      // Show analysis and controls
      const movementSummary = typesArray.map(type => 
        game.i18n.localize(`DSRESKINNER.MovementType.${type}`)
      ).join(', ');
      analysisDiv.innerHTML = `<p class="movement-summary">${game.i18n.format('DSRESKINNER.MovementTypeSummary', { types: movementSummary })}</p>`;
      analysisDiv.style.display = 'block';
      noMovementDiv.style.display = 'none';
      
      // Update checkboxes
      this._updateMovementOptions();
      
      // Show controls after a brief delay
      setTimeout(() => {
        controlsDiv.style.display = 'block';
      }, 500);
    }
  }

  /**
   * Get current movement types from actor
   */
  _getMovementTypes() {
    const movement = this.actor.system?.movement || {};
    
    // Handle both Array and Set for movement types
    let types = [];
    if (Array.isArray(movement.types)) {
      types = movement.types;
    } else if (movement.types && typeof movement.types === 'object' && movement.types.constructor.name === 'Set') {
      // Convert Set to Array
      types = Array.from(movement.types);
    }
    
    const result = {
      types: types,
      hover: !!movement.hover,
      value: movement.value || 0,
      disengage: movement.disengage || 1
    };
    
    return result;
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
    
    // Clear cache and force recalculation for debugging
    this._damageTypeCounts = null;
    return this._countDamageTypes(true);
  }

  /**
   * Update damage type dropdown options based on current counts
   */
  async _updateDamageOptions() {
    
    
    // Use the spec-compliant method
    const damageCounts = await this.analyzeDamageTypes();
    
    const sourceSelect = this.element.querySelector('#source-damage-type');
    const targetSelect = this.element.querySelector('#target-damage-type');

    if (!sourceSelect || !targetSelect) return;

    // Update source select with current counts
    sourceSelect.innerHTML = '';
    // Add empty option to default to "no selection"
    const emptySourceOption = document.createElement('option');
    emptySourceOption.value = '';
    emptySourceOption.textContent = 'Select type...';
    sourceSelect.appendChild(emptySourceOption);
    
    ReskinApp.DAMAGE_TYPES.forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = `${game.i18n.localize(`DSRESKINNER.DamageType.${type}`)} (${damageCounts[type] || 0})`;
      if (damageCounts[type] === 0) option.disabled = true;
      sourceSelect.appendChild(option);
    });

    // Update target select (all options available)
    targetSelect.innerHTML = '';
    // Add empty option to default to "no selection"
    const emptyTargetOption = document.createElement('option');
    emptyTargetOption.value = '';
    emptyTargetOption.textContent = 'Select type...';
    targetSelect.appendChild(emptyTargetOption);
    
    ReskinApp.DAMAGE_TYPES.forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = game.i18n.localize(`DSRESKINNER.DamageType.${type}`);
      targetSelect.appendChild(option);
    });
    
    
  }

  /**
   * Update movement type checkboxes based on current actor data
   */
  _updateMovementOptions() {
    
    const movementData = this._getMovementTypes();
    
    // Update movement type checkboxes
    ReskinApp.MOVEMENT_TYPES.forEach(type => {
      const checkbox = this.element.querySelector(`input[name="movementTypes"][value="${type}"]`);
      if (checkbox) {
        checkbox.checked = movementData.types.includes(type);
      }
    });
    
    // Update hover checkbox
    const hoverCheckbox = this.element.querySelector('input[name="hover"]');
    if (hoverCheckbox) {
      hoverCheckbox.checked = movementData.hover;
    }
    
    
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
      // Same type selected - this means "keep as is"
      sourceSelect.classList.remove('error');
      targetSelect.classList.remove('error');
      previewDiv.innerHTML = `<p class="preview-message">${game.i18n.localize('DSRESKINNER.DamageTypeKeepAsIs')}</p>`;
    } else {
      // Different types selected - show swap preview
      sourceSelect.classList.remove('error');
      targetSelect.classList.remove('error');
      
      if (sourceType && targetType) {
        const count = damageCounts[sourceType] || 0;
        previewDiv.innerHTML = `<p class="preview-message">${game.i18n.format('DSRESKINNER.DamageTypePreview', { 
          count,
          source: game.i18n.localize(`DSRESKINNER.DamageType.${sourceType}`),
          target: game.i18n.localize(`DSRESKINNER.DamageType.${targetType}`)
        })}</p>`;
      } else if (!sourceType && !targetType) {
        // Neither selected - default to keeping as is
        previewDiv.innerHTML = `<p class="preview-message">${game.i18n.localize('DSRESKINNER.DamageTypeNoSwap')}</p>`;
      }
    }
  }

  /**
   * Update movement type validation
   */
  _updateMovementValidation() {
    const validationDiv = this.element.querySelector('#movement-validation');
    if (!validationDiv) return;

    // Get checked movement types
    const checkedBoxes = this.element.querySelectorAll('input[name="movementTypes"]:checked');
    const selectedTypes = Array.from(checkedBoxes).map(cb => cb.value);

    // Clear previous validation
    validationDiv.innerHTML = '';

    if (selectedTypes.length === 0) {
      // No movement types selected - show error
      validationDiv.innerHTML = `<p class="error">${game.i18n.localize('DSRESKINNER.MovementTypeRequired')}</p>`;
      return false;
    }

    return true;
  }

  /**
   * Toggle level adjustment section visibility
   */
  _toggleLevelAdjustmentSection() {
    const content = this.element.querySelector('#level-adjustment-content');
    const toggleBtn = this.element.querySelector('#level-adjustment-toggle');
    const icon = toggleBtn?.querySelector('i');
    
    if (!content) return;

    const isHidden = content.style.display === 'none';
    
    if (isHidden) {
      // Show section
      content.style.display = 'block';
      if (icon) icon.classList.remove('fa-chevron-right');
      if (icon) icon.classList.add('fa-chevron-down');
      if (toggleBtn) toggleBtn.classList.remove('collapsed');
      
      // Initialize form fields if not already set
      this._initializeLevelAdjustmentFields();
      
      // Initialize preview
      this._updateLevelAdjustmentPreview();
    } else {
      // Hide section
      content.style.display = 'none';
      if (icon) icon.classList.remove('fa-chevron-down');
      if (icon) icon.classList.add('fa-chevron-right');
      if (toggleBtn) toggleBtn.classList.add('collapsed');
    }
  }

  /**
   * Initialize level adjustment form fields with current monster data
   */
  _initializeLevelAdjustmentFields() {
    const roleSelect = this.element.querySelector('#monster-role');
    const organizationSelect = this.element.querySelector('#monster-organization');
    
    if (!organizationSelect) return;

    // Get current monster role and organization with fallbacks
    const currentRole = this.actor.system.monster?.role || this.actor.system.details?.role || '';
    const currentOrganization = this.actor.system.monster?.organization || this.actor.system.details?.organization || '';

    // Set role if not already selected by template (only if role select exists)
    if (roleSelect) {
      if (!roleSelect.value && currentRole) {
        roleSelect.value = currentRole;
      }
    }

    // Set organization if not already selected by template
    if (!organizationSelect.value && currentOrganization) {
      organizationSelect.value = currentOrganization;
    }
  }

  /**
   * Update level adjustment preview with calculated values
   */
  _updateLevelAdjustmentPreview() {
    const levelInput = this.element.querySelector('#target-level');
    const roleSelect = this.element.querySelector('#monster-role');
    const organizationSelect = this.element.querySelector('#monster-organization');
    const previewDiv = this.element.querySelector('#level-preview');
    const applyBtn = this.element.querySelector('#apply-level-adjustment');
    
    if (!levelInput || !organizationSelect) return;

    // Get current values - support multiple data structures
    const currentLevel = this.actor.system.monster?.level || this.actor.system.details?.level;
    const targetLevel = parseInt(levelInput.value);
    const role = roleSelect ? roleSelect.value : this.actor.system.monster?.role || this.actor.system.details?.role || null;
    const organization = organizationSelect.value;

    // Calculate values
    try {
      // Special handling for Leader and Solo organizations
      // According to AdjustingMonsters.md: Leader and Solo are organizations, not roles
      let effectiveRole = role;
      let isLeaderOrSolo = false;
      
      if (!role && (organization === 'leader' || organization === 'solo')) {
        // Leader/Solo monsters don't use traditional roles
        // They use fixed role modifiers per the tables: Leader=30, Solo=30
        effectiveRole = null;
        isLeaderOrSolo = true;
      } else {
        // Use original monster role if role selection is disabled (null)
        effectiveRole = role || this.actor.system.monster?.role || this.actor.system.details?.role || 'brute';
        isLeaderOrSolo = this.actor.system.monster?.organization === 'leader' || this.actor.system.monster?.organization === 'solo';
      }
      

      
      // Additional validation before calculations
      if (effectiveRole && !ROLE_MODIFIERS[effectiveRole]) {
        throw new Error(`Unknown role: ${effectiveRole}. Valid roles: ${ReskinApp.MONSTER_ROLES.join(', ')}`);
      }
      
      const newEV = calculateEncounterValue(targetLevel, organization);
      const newStamina = calculateStamina(targetLevel, effectiveRole, organization, false, isLeaderOrSolo);
      const characteristics = calculateCharacteristics(targetLevel, isLeaderOrSolo);
      
      // Calculate example damage (tier 3, non-strike, non-horde/minion)
      const exampleDamage = calculateDamage(targetLevel, effectiveRole, organization, 3, false, characteristics.powerRollBonus);

      // Update preview display
      if (previewDiv) {
        previewDiv.style.display = 'block';
        
        // Update individual display elements
        const currentLevelDisplay = document.getElementById('current-level-display');
        const targetLevelDisplay = document.getElementById('target-level-display');
        const newEVDisplay = document.getElementById('new-ev-display');
        const newStaminaDisplay = document.getElementById('new-stamina-display');
        const powerRollDisplay = document.getElementById('power-roll-display');
        const exampleDamageDisplay = document.getElementById('example-damage-display');

        if (currentLevelDisplay) currentLevelDisplay.textContent = currentLevel;
        if (targetLevelDisplay) targetLevelDisplay.textContent = targetLevel;
        if (newEVDisplay) newEVDisplay.textContent = newEV;
        if (newStaminaDisplay) newStaminaDisplay.textContent = newStamina;
        if (powerRollDisplay) powerRollDisplay.textContent = `+${characteristics.powerRollBonus}`;
        if (exampleDamageDisplay) exampleDamageDisplay.textContent = exampleDamage;
      }

    } catch (error) {
      console.error('DS-Reskinner | Error calculating level adjustment preview:', error);
      // Show error in preview if calculation fails
      if (previewDiv) {
        previewDiv.style.display = 'block';
        const currentLevelDisplay = document.getElementById('current-level-display');
        const targetLevelDisplay = document.getElementById('target-level-display');
        const newEVDisplay = document.getElementById('new-ev-display');
        const newStaminaDisplay = document.getElementById('new-stamina-display');
        const powerRollDisplay = document.getElementById('power-roll-display');
        const exampleDamageDisplay = document.getElementById('example-damage-display');
        if (currentLevelDisplay) currentLevelDisplay.textContent = currentLevel;
        if (targetLevelDisplay) targetLevelDisplay.textContent = targetLevel || 'Error';
        if (newEVDisplay) newEVDisplay.textContent = 'Error';
        if (newStaminaDisplay) newStaminaDisplay.textContent = 'Error';
        if (powerRollDisplay) powerRollDisplay.textContent = 'Error';
        if (exampleDamageDisplay) exampleDamageDisplay.textContent = 'Error';
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
      
      // No validation needed - same source/target means "keep as is"
    }
    
    try {
      const sourceData = this.actor.toObject();
      let newActorData = foundry.utils.deepClone(sourceData);

      // Replace damage types using placeholder system if requested and different
      if (sourceDamageType && targetDamageType && sourceDamageType !== targetDamageType) {
        
        
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
        
        
      } else {
        // No damage replacement, just simple name change
        const originalName = this.actor.name || this.actor.data?.name || 'Unknown';
        newActorData = this._replaceNameInObject(newActorData, originalName, newName.trim());
      }

      // Apply movement type changes if requested
      const movementSectionOpen = this.element.querySelector('#movement-type-content').style.display !== 'none';
      if (movementSectionOpen) {
        // Validate movement types selection
        if (!this._updateMovementValidation()) {
          ui.notifications.error(game.i18n.localize('DSRESKINNER.MovementTypeRequired'));
          return;
        }
        
        // Get movement type selections
        const checkedBoxes = this.element.querySelectorAll('input[name="movementTypes"]:checked');
        const selectedTypes = Array.from(checkedBoxes).map(cb => cb.value);
        const hoverCheckbox = this.element.querySelector('input[name="hover"]');
        const hoverEnabled = hoverCheckbox ? hoverCheckbox.checked : false;
        
        
        
        // Update movement types while preserving value and disengage
        if (!newActorData.system.movement) {
          newActorData.system.movement = {};
        }
        
        newActorData.system.movement.types = selectedTypes;
        newActorData.system.movement.hover = hoverEnabled;
        
        // Preserve existing value and disengage if they exist
        if (newActorData.system.movement.value === undefined && this.actor.system?.movement?.value !== undefined) {
          newActorData.system.movement.value = this.actor.system.movement.value;
        }
        if (newActorData.system.movement.disengage === undefined && this.actor.system?.movement?.disengage !== undefined) {
          newActorData.system.movement.disengage = this.actor.system.movement.disengage;
        }
      }

      // Apply level adjustment changes if level adjustment section is open
      const levelSectionOpen = this.element.querySelector('#level-adjustment-content').style.display !== 'none';
      if (levelSectionOpen) {
        const levelInput = this.element.querySelector('#target-level');
        const roleSelect = this.element.querySelector('#monster-role');
        const organizationSelect = this.element.querySelector('#monster-organization');
        
        if (levelInput && organizationSelect) {
          const targetLevel = parseInt(levelInput.value);
          const role = roleSelect ? roleSelect.value : this.actor.system.monster?.role || this.actor.system.details?.role || null;
          const organization = organizationSelect.value;

          // Validate the inputs
          if (!targetLevel || targetLevel < 1 || targetLevel > 20) {
            ui.notifications.error(game.i18n.localize('DSRESKINNER.LevelAdjustment.LevelValidationError'));
            return; // Stop form submission on validation error
          }

          try {
            // Special handling for Leader and Solo organizations
            let effectiveRole = role;
            let isLeaderOrSolo = false;
            
            if (!role && (organization === 'leader' || organization === 'solo')) {
              // Leader/Solo monsters don't use traditional roles
              effectiveRole = null;
              isLeaderOrSolo = true;
            } else {
              // Use original monster role if role selection is disabled (null)
              effectiveRole = role || this.actor.system.monster?.role || this.actor.system.details?.role || 'brute';
              isLeaderOrSolo = this.actor.system.monster?.organization === 'leader' || this.actor.system.monster?.organization === 'solo';
            }
            
            // Calculate new values using the calculator functions
            const newEV = calculateEncounterValue(targetLevel, organization);
            const newStamina = calculateStamina(targetLevel, effectiveRole, organization, false, isLeaderOrSolo);
            const characteristics = calculateCharacteristics(targetLevel, isLeaderOrSolo);
            

            
            // Update system level with flexible access
            if (!newActorData.system) {
              newActorData.system = {};
            }
            if (this.actor.system.monster) {
              // Draw Steel structure - update monster level, role, and organization
              if (!newActorData.system.monster) {
                newActorData.system.monster = {};
              }
              newActorData.system.monster.level = targetLevel;
              newActorData.system.monster.role = effectiveRole;  // Update role
              newActorData.system.monster.organization = organization;  // Update organization
              
              // Update organization label for display
              const organizationLabels = {
                'minion': 'Minion',
                'horde': 'Horde', 
                'platoon': 'Platoon',
                'elite': 'Elite',
                'leader': 'Leader',
                'solo': 'Solo',
                'minion-stamina': 'Minion',
                'solo-stamina': 'Solo'
              };
              newActorData.system.monster.organizationLabel = organizationLabels[organization] || organization;
              

            } else {
              // Standard structure - update details level
              if (!newActorData.system.details) {
                newActorData.system.details = {};
              }
              newActorData.system.details.level = targetLevel;
            }
            

            
            // Update EV and Stamina with flexible access for Draw Steel structure
            // Draw Steel monsters use system.monster.eV and system.stamina structure
            if (!newActorData.system.attributes) {
              newActorData.system.attributes = {};
            }
            
            // Try to preserve existing attributes while updating our values
            const originalEV = newActorData.system.monster?.ev || newActorData.system.attributes?.ev;
            const originalStamina = newActorData.system.stamina?.value || newActorData.system.attributes?.stamina;
            
            // Update Draw Steel specific structure first
            if (this.actor.system.monster) {
              // Update monster EV
              if (!newActorData.system.monster) {
                newActorData.system.monster = {};
              }
              newActorData.system.monster.ev = newEV;
              
              // Update stamina in Draw Steel structure
              if (!newActorData.system.stamina) {
                newActorData.system.stamina = {};
              }
              newActorData.system.stamina.value = newStamina;
              newActorData.system.stamina.max = newStamina;
              

            }
            
            // Also update generic attributes structure for compatibility
            newActorData.system.attributes.ev = newEV;
            newActorData.system.attributes.stamina = newStamina;
            

            
            // Update characteristics (power roll bonuses) with flexible access
            if (!newActorData.system.characteristics) {
              newActorData.system.characteristics = {};
            }
            

            
            // Try multiple ways to update power roll bonus (Draw Steel may vary in structure)
            if (newActorData.system.characteristics.powerRoll !== undefined) {
              if (newActorData.system.characteristics.powerRoll.bonus !== undefined) {
                const originalBonus = newActorData.system.characteristics.powerRoll.bonus;
                newActorData.system.characteristics.powerRoll.bonus = characteristics.powerRollBonus;
              } else {
                newActorData.system.characteristics.powerRoll = { bonus: characteristics.powerRollBonus };
              }
            } else {
              // Try direct powerRoll property
              newActorData.system.characteristics.powerRoll = { bonus: characteristics.powerRollBonus };
            }
            

            
            // TODO: Update ability damage values for signature ability
            // This is deferred as specified in the design doc - signature ability only for initial release
            

          } catch (error) {
            console.error('DS-Reskinner | Error applying level adjustment:', error);
            ui.notifications.error(game.i18n.localize('DSRESKINNER.LevelAdjustment.ErrorMessage'));
            return; // Stop form submission on error
          }
        }
      }

      // Handle token image update if requested
      const tokenImagePath = this.element.querySelector('#token-image-path');
      if (tokenImagePath && tokenImagePath.value) {
        // Update both prototypeToken.texture.src and token.texture.src as specified in design
        if (!newActorData.prototypeToken) {
          newActorData.prototypeToken = {};
        }
        if (!newActorData.prototypeToken.texture) {
          newActorData.prototypeToken.texture = {};
        }
        newActorData.prototypeToken.texture.src = tokenImagePath.value;

        // Also update token.texture.src for consistency
        if (!newActorData.token) {
          newActorData.token = {};
        }
        if (!newActorData.token.texture) {
          newActorData.token.texture = {};
        }
        newActorData.token.texture.src = tokenImagePath.value;

        // TODO: FUTURE - Consider separating token and character art management
        // Currently using the same image for both token and character art for simplicity
        // This may be split into separate controls in a future version
        
        // Also update character art (img property) with the same image
        newActorData.img = tokenImagePath.value;
      }

      // Finalize the new actor data
      newActorData = foundry.utils.mergeObject(newActorData, {
        _id: null,
        folder: null,
        ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE }
      });
      
      await Actor.create(newActorData);
      
      let message = game.i18n.format('DSRESKINNER.CreateSuccess', { name: newName });
      if (sourceDamageType && targetDamageType && sourceDamageType !== targetDamageType) {
        message += ` (${game.i18n.localize(`DSRESKINNER.DamageType.${sourceDamageType}`)} → ${game.i18n.localize(`DSRESKINNER.DamageType.${targetDamageType}`)})`;
      }
        
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
      }
    }
    
    // Handle damage.weaknesses
    if (obj.system?.damage?.weaknesses) {
      const weaknesses = obj.system.damage.weaknesses;
      
      if (weaknesses.hasOwnProperty(oldDamageType) && weaknesses[oldDamageType] > 0) {
        const oldValue = weaknesses[oldDamageType];
        weaknesses[newDamageType] = oldValue;
        weaknesses[oldDamageType] = 0;
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
      
      return this._damageTypeCounts;
    }

    
    const counts = {};
    const damageTypes = ReskinApp.DAMAGE_TYPES;
    
    // Initialize counts to zero
    damageTypes.forEach(type => {
      counts[type] = 0;
    });

    // Count damage types in actor data
    const actorData = this.actor.toObject();
    
    this._countDamageTypesInObject(actorData, counts);
    
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

  /**
   * Handle token image click to launch FilePicker
   */
  async _handleTokenImageClick() {
    try {
      // Use the correct FilePicker class for Foundry V13
      const FilePickerClass = foundry.applications.apps.FilePicker.implementation;
      
      // Create FilePicker instance
      const fp = new FilePickerClass({
        type: 'image',
        callback: (url) => this._onTokenImageSelected(url),
        options: {
          name: 'ds-reskinner-token-picker'
        }
      });

      // Browse to appropriate directory (use empty string for root/accessible directories)
      try {
        await fp.browse('');
      } catch (browseError) {
        // If browsing to root fails, try 'public' source
        await fp.browse('public');
      }
      
      // Render the FilePicker
      await fp.render(true);
    } catch (error) {
      console.error('DS-Reskinner | Error opening FilePicker:', error);
      ui.notifications.error(game.i18n.localize('DSRESKINNER.TokenImagePickerError'));
    }
  }

  /**
   * Handle token image selection from FilePicker
   * @param {string} url - Selected image URL
   */
  async _onTokenImageSelected(url) {
    if (!url) {
      console.warn('DS-Reskinner | No image URL provided');
      return;
    }

    try {
      // Validate image URL accessibility
      await this._validateImageUrl(url);
      
      // Update hidden input with new image path
      const hiddenInput = this.element.querySelector('#token-image-path');
      if (hiddenInput) {
        hiddenInput.value = url;
      }

      // Update the preview image
      await this._updateTokenImagePreview(url);
      
      ui.notifications.info(game.i18n.localize('DSRESKINNER.TokenImageUpdated'));
    } catch (error) {
      console.error('DS-Reskinner | Error updating token image:', error);
      ui.notifications.error(game.i18n.localize('DSRESKINNER.TokenImageUpdateError'));
    }
  }

  /**
   * Validate that image URL is accessible
   * @param {string} url - Image URL to validate
   */
  async _validateImageUrl(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`Image not accessible: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Failed to validate image URL: ${error.message}`);
    }
  }

  /**
   * Update the token image preview in the form
   * @param {string} imageUrl - New image URL
   */
  async _updateTokenImagePreview(imageUrl) {
    const tokenImageContainer = this.element.querySelector('#token-image-container');
    
    if (!tokenImageContainer) return;

    // Replace placeholder with image or update existing image
    let imageElement = tokenImageContainer.querySelector('#token-image');
    let placeholderElement = tokenImageContainer.querySelector('#token-placeholder');
    
    if (imageUrl) {
      if (imageElement) {
        // Update existing image
        imageElement.src = imageUrl;
        imageElement.style.display = 'block';
      } else {
        // Create new image element
        const newImage = document.createElement('img');
        newImage.id = 'token-image';
        newImage.className = 'token-image';
        newImage.src = imageUrl;
        newImage.alt = game.i18n.localize('DSRESKINNER.TokenImageAlt');
        newImage.setAttribute('aria-label', game.i18n.localize('DSRESKINNER.TokenImageAriaLabel'));
        newImage.setAttribute('title', game.i18n.localize('DSRESKINNER.TokenImageTitle'));
        
        if (placeholderElement) {
          tokenImageContainer.replaceChild(newImage, placeholderElement);
        } else {
          tokenImageContainer.appendChild(newImage);
        }
      }
    } else if (placeholderElement) {
      // Show placeholder if no image
      if (imageElement) {
        imageElement.style.display = 'none';
      }
    }
  }


}
