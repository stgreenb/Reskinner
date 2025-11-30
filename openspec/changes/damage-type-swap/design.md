# Damage Type Swap Design Document

## Architecture

### Extension of Existing Pattern
The damage type swap will extend the existing name replacement pattern established in the ReskinApp:
- Uses the same `_replaceInObject` method with enhanced functionality
- Maintains media field exclusions
- Follows the same 1-to-1 replacement logic

### User Interface Flow

1. **Primary Name Replacement** (Default visible)
   - Actor name input field (existing functionality)
   - Optional damage type replacement control

2. **Damage Type Section** (Collapsible, default collapsed)
   - Toggle button to expand damage replacement options
   - Damage analysis runs on expand (cached for performance)
   - If no damage types: show informative message and keep section collapsed

3. **Damage Analysis Phase**
   - Parse current actor data to count all damage type instances
   - Display counts next to each source damage type
   - Disable damage types that have zero instances

4. **Selection Phase** 
   - User selects source damage type (current instances shown)
   - User selects target damage type (all damage types available)
   - Preview section shows expected number of replacements

5. **Validation Phase**
   - Ensure source != target
   - Show confirmation message with replace count
   - Only enable submit when valid selection made

### Technical Implementation

#### Damage Type Constants
```javascript
const DAMAGE_TYPES = [
  'acid', 'cold', 'corruption', 'fire', 'holy', 
  'lightning', 'poison', 'psychic', 'sonic'
];
```

#### Detection and Counting (with Caching)
```javascript
_countDamageTypes(forceRecalc = false) {
  if (this._damageTypeCounts && !forceRecalc) {
    return this._damageTypeCounts;
  }
  
  // Traverse object structure and count damage type instances
  this._damageTypeCounts = counts;
  return counts;
}
```

#### Replacement Logic (Separate Methods)
```javascript
// Keep existing name replacement simple and focused
_replaceNameInObject(obj, oldName, newName, parentKey = '') {
  // Existing logic for name replacement
}

// New dedicated method for damage type replacement
_replaceDamageTypeInObject(obj, oldDamageType, newDamageType, parentKey = '') {
  // Damage-specific replacement logic
}

// Shared utility for field exclusions
_isExcludedField(parentKey) {
  return ['img', 'icon', 'src', 'path', 'url', 'uri', 'texture', 'srcSmall', 'srcLarge']
         .includes(parentKey.toLowerCase());
}
```

#### Performance Considerations
- Cache damage type counts to avoid repeated traversal
- Only run analysis when damage section is expanded
- Use case-insensitive matching for comprehensive coverage

#### Edge Case Handling
- **No Damage Types**: Show informative message, keep damage section collapsed
- **Same Type Selection**: Prevent source == target selection with validation
- **Large Actors**: Use caching to maintain performance
- **Plural Forms**: Handle "fire damage" vs "fire damages" through case-insensitive matching

### Form Integration
The damage type controls will be added to the existing `reskin-form.hbs` template:
- Two select dropdowns for source and target damage types
- Real-time count display
- Validation feedback

### Error Handling
- Handle cases with no damage types found
- Prevent same-to-same mapping
- Graceful fallback on parsing errors

## Data Flow
1. Form render → Damage analysis → Count display
2. User selection → Validation → Form enable/disable  
3. Form submit → Damage replacement → New actor creation

## Dependencies
- Existing `_replaceInObject` method (to be extended)
- Existing form submission flow
- Handlebars template system
