# Damage Type Swap Implementation Tasks

## Implementation Tasks

### 1. Add Damage Type Detection Logic with Caching
- [x] Create `_countDamageTypes` method with caching in ReskinApp
- [x] Implement recursive traversal for damage type counting
- [x] Return object with damage type counts and cache results
- [x] Add damage type constants array
- [x] Add `_isExcludedField` utility method for shared exclusion logic

### 2. Refactor Replacement Methods for Separation of Concerns
- [ ] Rename existing `_replaceInObject` to `_replaceNameInObject`
- [ ] Create dedicated `_replaceDamageTypeInObject` method
- [ ] Implement case-insensitive damage type replacement
- [ ] Use shared `_isExcludedField` utility for both methods
- [ ] Ensure both methods maintain proper case preservation

### 3. Update Form Template with Collapsible Design
- [ ] Add collapsible damage type section to reskin-form.hbs
- [ ] Create expandable container for damage options (default collapsed)
- [ ] Create source damage type dropdown with counts
- [ ] Create target damage type dropdown
- [ ] Add preview/confirmation section
- [ ] Include validation feedback elements
- [ ] Add "No damage types detected" message for edge cases

### 4. Implement Form Logic with Performance Optimization
- [ ] Add damage type section expansion handlers
- [ ] Implement `analyzeDamageTypes` method to call `_countDamageTypes`
- [ ] Add damage type handlers to `_prepareContext` with caching
- [ ] Implement damage type selection validation
- [ ] Update `_handleFormSubmit` for dual replacement (name + damage types)
- [ ] Add real-time UI updates based on selections
- [ ] Handle "no damage types" edge case in form logic

### 5. Add Localization
- [ ] Create damage type UI language strings in en.json
- [ ] Add validation messages for damage type operations
- [ ] Include success notification wording

### 6. Testing and Validation
- [ ] Test damage detection with various damage type combinations
- [ ] Verify replacement preserves media fields
- [ ] Validate 1-to-1 mapping accuracy
- [ ] Test edge cases (no damage types, same types selected)
- [ ] Verify caching behavior for performance
- [ ] Test form collapsing/expanding functionality
- [ ] Validate dual replacement (name + damage types) works correctly
- [ ] Test case preservation in damage type replacements

## Dependencies
- Tasks 1-2 can be completed in parallel
- Task 3 depends on design decisions from 1-2
- Task 4 depends on completion of 1-3
- Task 5 can be done in parallel with other tasks
- Task 6 requires completion of all implementation tasks
