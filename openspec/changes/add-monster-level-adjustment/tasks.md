## Phase 1: Data Foundations & Detection (Zero Dependencies)
**Success Criteria**: All reference objects created and exported as ES6 modules, echelon calculator tested with all boundary cases (1, 2, 3, 5, 6, 8, 9, 10), level detection validation works on real actor data, conditional rendering hides section appropriately.
**Estimated Time**: 1.5 hours
**Blocker for**: Phase 2

- [ ] 1.1 Create role modifiers reference object (12 roles: Ambusher +20/+1, Artillery +10/+1, Brute +30/+1, Controller +10/+0, Defender +30/+0, Harrier +20/+0, Hexer +10/+0, Mount +20/+0, Support +20/+0, Elite +0/+1, Leader +30/+1, Solo +30/+2)
- [ ] 1.2 Create organization modifiers reference object (8 types: Minion x0.5, Horde x0.5, Platoon x1.0, Leader x2.0, Elite x2.0, Solo x6.0, Minion-stamina x0.125, Solo-stamina x5.0)
- [ ] 1.3 Create echelon calculation helper with correct Draw Steel boundaries:
  ```javascript
  const echelon = (level) => {
    if (level <= 2) return 0;  // Levels 1-2: Echelon 0
    if (level <= 5) return 1;  // Levels 3-5: Echelon 1  
    if (level <= 8) return 2;  // Levels 6-8: Echelon 2
    return 3;                  // Levels 9-10: Echelon 3
  };
  ```
- [ ] 1.4 Create tier-to-damage modifier mapping (Tier 1: 0.6, Tier 2: 1.1, Tier 3: 1.4)
- [ ] 1.5 Implement level detection validation: check `actor.system.details.level` exists
- [ ] 1.6 Implement role/organization detection validation: ensure required data exists
- [ ] 1.7 Add conditional rendering: hide level adjustment section if prerequisites fail
- [ ] 1.8 Increment version to v0.4.0 in package.json for major feature release
- [ ] 1.9 Add balance warning localization strings to lang/en.json

## Phase 2: Core Calculation Engines (Each Testable)
### Section 2: Encounter Value Calculator
- [ ] 2.1 Implement `calculateEncounterValue(level, organization)` using `((2 x Level) + 4) x Organization Modifier`
- [ ] 2.2 Test formula against 5+ Draw Steel examples with rounding up
- [ ] 2.3 Verify minion EV represents four minions together

### Section 3: Stamina Calculator  
- [ ] 3.1 Implement `calculateStamina(level, role, organization, additionalStamina)` using `((10 x Level) + Role Modifier) x Organization Modifier`
- [ ] 3.2 Test with additional stamina parameter `(3 x Level) + 3`
- [ ] 3.3 Test leader/solo special cases and rounding behavior

### Section 4: Damage Calculator
- [ ] 4.1 Implement `calculateDamage(level, damageModifier, tier, isStrike, highestCharacteristic, isHordeOrMinion)` using `(4 + Level + Damage Modifier) x Tier Modifier`
- [ ] 4.2 Add horde/minion damage division (divide by 2)
- [ ] 4.3 Add strike characteristic addition
- [ ] 4.4 Test all tier combinations and edge cases

### Section 5: Characteristic Calculator
- [ ] 5.1 Implement `calculateCharacteristics(level, isLeaderOrSolo)` for echelon-based power roll bonus `1 + echelon`
- [ ] 5.2 Implement potency adjustments by tier (characteristic - 1 for each tier below 3)
- [ ] 5.3 Add leader/solo +1 bonus (max +5) and potency +1 (max +6)

### Section 6: Ability Scaling
- [ ] 6.1 Implement `applyAbilityScaling(damage, targetDifference)` for multi-target adjustments
- [ ] 6.2 Add one additional target: multiply damage by 0.8
- [ ] 6.3 Add two+ additional targets: multiply damage by 0.5
- [ ] 6.4 Add one fewer target: multiply damage by 1.2

## Phase 3: UI Implementation
### Section 7: Form Templates
- [ ] 7.1 Add level adjustment section HTML to `templates/reskin-form.hbs`
- [ ] 7.2 Create collapsible toggle with proper chevron icons matching existing sections
- [ ] 7.3 Add numeric input field for target level (1-20) with validation
- [ ] 7.4 Add role dropdown with 12 options and tooltips
- [ ] 7.5 Add organization dropdown with 8 options and tooltips
- [ ] 7.6 Add preview area for calculated values display
- [ ] 7.7 Add balance warning notification in level adjustment section
- [ ] 7.8 Add "Apply Level Adjustment" button below preview with clear action text
- [ ] 7.9 Add confirmation warning: "This will update monster stats. Review carefully before applying."

### Section 8: Styling
- [ ] 8.1 Style level adjustment section to match existing movement/damage sections
- [ ] 8.2 Style form controls with proper spacing and responsive design
- [ ] 8.3 Add collapsible animations matching existing patterns
- [ ] 8.4 Style tooltips for role and organization descriptions
- [ ] 8.5 Style preview section with clear calculated values

## Phase 4: Integration & Interaction
### Section 9: Event Handlers
- [ ] 9.1 Add level adjustment section toggle handler to `reskinner-app.js`
- [ ] 9.2 Add level input change listener with real-time recalculation
- [ ] 9.3 Add role/organization dropdown change listeners
- [ ] 9.4 Implement real-time preview updates using calculation engines
- [ ] 9.5 Add basic validation (level range 1-20)

### Section 10: Form Submission
- [ ] 10.1 Modify `_handleFormSubmit` to collect level adjustment data
- [ ] 10.2 Apply calculated EV to `newActorData.system.attributes.ev`
- [ ] 10.3 Apply calculated stamina to `newActorData.system.attributes.stamina`
- [ ] 10.4 Apply characteristic updates to power roll bonuses and potencies
- [ ] 10.5 Apply calculated damage to signature ability only (future: expand to all)
- [ ] 10.6 Ensure level adjustments apply after other transformations

## Phase 5: Polish & Testing
### Section 11: Localization & Accessibility
- [ ] 11.1 Add all level adjustment keys to `lang/en.json`:
  - levelAdjustment.title = "Level Adjustment"
  - levelAdjustment.description = "Adjust monster to a different challenge level using Draw Steel formulas"
  - levelAdjustment.balanceWarning = "⚠️ Level adjustments are approximations based on Draw Steel formulas. Results may not be perfectly balanced. Review carefully and adjust as needed for your campaign."
  - levelAdjustment.levelLabel = "Target Level"
  - levelAdjustment.roleLabel = "Monster Role"
  - levelAdjustment.organizationLabel = "Organization"
  - levelAdjustment.previewTitle = "📊 Level Adjustment Preview"
  - levelAdjustment.currentLevel = "Current Level"
  - levelAdjustment.targetLevel = "Target Level"
  - levelAdjustment.newEV = "New EV"
  - levelAdjustment.newStamina = "New Stamina"
  - levelAdjustment.powerRoll = "Power Roll"
  - levelAdjustment.characteristic = "Characteristic"
  - levelAdjustment.exampleDamage = "Example Damage"
  - levelAdjustment.status = "Status"
  - levelAdjustment.statusReady = "✅ Ready to apply"
  - levelAdjustment.statusReview = "⚠️ Manual review advised"
  - levelAdjustment.statusError = "❌ Input errors"
  - levelAdjustment.applyButton = "Apply Level Adjustment"
  - levelAdjustment.confirmWarning = "This will update monster stats. Review carefully before applying."
  - levelAdjustment.dataMissingError = "Level adjustment requires monster stat data that this actor lacks."
  - levelAdjustment.validationLevelError = "Level must be between 1 and 20"
  - levelAdjustment.validationRoleError = "Please select a valid monster role"
  - levelAdjustment.validationOrgError = "Please select a valid organization"
  - levelAdjustment.successMessage = "Level adjustment applied successfully!"
  - levelAdjustment.errorMessage = "Error applying level adjustment"
  - [Role descriptions for tooltips - 12 keys]
  - [Organization descriptions for tooltips - 8 keys]
- [ ] 11.2 Localize section titles, field labels, tooltips, messages
- [ ] 11.3 Add proper ARIA labels and accessibility attributes
- [ ] 11.4 Ensure keyboard navigation works for all controls
- [ ] 11.5 Add screen reader support for calculated values

### Section 12: Testing & Documentation
- [ ] 12.1 Test all calculation formulas against Draw Steel documentation examples
- [ ] 12.2 Test level adjustment with various role/organization combinations
- [ ] 12.3 Test integration with existing reskinner features
- [ ] 12.4 Test form submission with and without level adjustments active
- [ ] 12.5 Test conditional rendering when level data is missing
- [ ] 12.6 Add JSDoc comments to all calculation functions
- [ ] 12.7 Run build process and validate all files are included correctly
- [ ] 12.8 Test module loading in Foundry VTT

## Phase 7: Future Expansion (Post-Initial Release)
- [ ] 13.1 Expand ability updates beyond signature ability
- [ ] 13.2 Add advanced validation rules and warnings
- [ ] 13.3 Add comprehensive role/organization auto-detection heuristics
- [ ] 13.4 Add level adjustment suggestions based on existing monster database
