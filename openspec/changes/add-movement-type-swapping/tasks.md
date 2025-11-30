# Tasks: Add Movement Type Swapping

## Implementation Tasks

1. **Create movement type constants**
   - Define MOVEMENT_TYPES array with teleport, fly, walk, swim, burrow, climb
   - Add hover state management

2. **Extend UI template**
   - Add collapsible movement section to reskin-form.hbs
   - Include checkboxes for movement types
   - Add hover toggle option

3. **Add JavaScript logic**
   - Implement analyzeMovementTypes() method
   - Add _updateMovementOptions() method
   - Create movement type change handlers

4. **Update reskinning logic**
   - Modify _applyReskin() to handle movement changes
   - Preserve movement value and disengage settings
   - Update types array based on UI selections

5. **Add localization**
   - Add movement type strings to en.json
   - Include UI labels and descriptions

6. **Test and validate**
   - Test with various movement configurations
   - Verify hover state works correctly
   - Ensure existing functionality unchanged
