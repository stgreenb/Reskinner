# Proposal: Extended Actor Name Replacement

## Summary

Modify the Draw Steel Reskinner module to replace the original actor's name throughout the entire actor data structure, not just the name field. This will update all text content throughout the actor's data (description text, abilities, spells, etc.) where the original name appears, making reskinned monsters truly consistent in their new identity.

## Approach

1. Update the `_handleFormSubmit` method to:
   - Capture the old name (original actor name) for replacement
   - Implement a recursive `_replaceInObject` helper method
   - Perform text replacement throughout the actor's data before creating the new version

2. Create the recursive `_replaceInObject` method to handle string replacement in nested objects and arrays

3. Maintain case sensitivity considerations to preserve proper formatting while ensuring comprehensive replacement

## Current State

Currently, the reskinner only changes the actor's name field and creates a copy. All other references to the original name within the actor's data (descriptions, abilities, features, etc.) remain unchanged, resulting in identity inconsistencies in the reskinned monster.

## Proposed Enhancement

### Enhanced Submit Handler
The `_handleFormSubmit` method will be extended to include a name replacement step that occurs before creating the new actor:

```javascript
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
    const oldName = this.actor.name; // Get the old name for replacement
    
    // ✅ NEW: Deep replace old name with new name throughout the data
    const processedData = this._replaceInObject(sourceData, oldName, newName);
    
    const newActorData = foundry.utils.mergeObject(processedData, {
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
```

### Name Replacement Helper Method
The `_replaceInObject` method will recursively traverse all data in the actor while excluding media fields:

```javascript
/**
 * Recursively replace all instances of oldText with newText in an object
 * Handles strings, nested objects, and arrays while avoiding media fields
 * @param {Object} obj - The object to process
 * @param {string} oldText - The text to find
 * @param {string} newText - The text to replace with
 * @param {string} parentKey - The parent property key for field exclusion decisions
 * @returns {Object} The processed object with replacements made
 */
_replaceInObject(obj, oldText, newText, parentKey = '') {
  // Fields to never replace text in (to preserve image URLs and media references)
  const EXCLUDED_FIELDS = ['img', 'icon', 'src', 'path', 'url', 'uri', 'texture', 'srcSmall', 'srcLarge'];
  
  if (EXCLUDED_FIELDS.includes(parentKey.toLowerCase())) {
    return obj; // Skip replacement for these fields to preserve media references
  }
  
  if (typeof obj === 'string') {
    // Case-insensitive replacement: replace both exact case and title case
    let result = obj.replace(new RegExp(oldText, 'g'), newText);
    
    // Also try replacing with capitalization variations
    const oldTitleCase = oldText.charAt(0).toUpperCase() + oldText.slice(1);
    const newTitleCase = newText.charAt(0).toUpperCase() + newText.slice(1);
    result = result.replace(new RegExp(oldTitleCase, 'g'), newTitleCase);
    
    const oldLowerCase = oldText.toLowerCase();
    const newLowerCase = newText.toLowerCase();
    result = result.replace(new RegExp(oldLowerCase, 'g'), newLowerCase);
    
    return result;
  }
  
  if (Array.isArray(obj)) {
    // Recursively process arrays
    return obj.map(item => this._replaceInObject(item, oldText, newText, parentKey));
  }
  
  if (obj !== null && typeof obj === 'object') {
    // Recursively process objects
    const result = {};
    for (const key in obj) {
      result[key] = this._replaceInObject(obj[key], oldText, newText, key);
    }
    return result;
  }
  
  // Return primitives as-is
  return obj;
}
```

### Case-Preserving Enhancement (Optional)
Optionally, implement a more sophisticated replacement that preserves the original match case:

```javascript
_replaceInObject(obj, oldText, newText) {
  if (typeof obj === 'string') {
    // Case-insensitive regex replacement
    const regex = new RegExp(oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    return obj.replace(regex, (match) => {
      // Preserve the case of the original match
      if (match === match.toUpperCase()) return newText.toUpperCase();
      if (match === match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()) {
        return newText.charAt(0).toUpperCase() + newText.slice(1).toLowerCase();
      }
      return newText.toLowerCase();
    });
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => this._replaceInObject(item, oldText, newText));
  }
  
  if (obj !== null && typeof obj === 'object') {
    const result = {};
    for (const key in obj) {
      result[key] = this._replaceInObject(obj[key], oldText, newText);
    }
    return result;
  }
  
  return obj;
}
```

## Benefits

1. Consistent identity changes: The reskinned actor will have all references updated properly
2. Improved user experience: No need to manually update text after reskinning
3. Professional output: Creates more polished reskinned monsters with consistent terminology
4. Non-intrusive: Works in the background during the normal reskinnig workflow

## Considerations

1. Performance: The recursive replacement might have performance implications with very large actor data, but this is expected to be minimal with typical monster data sizes.
2. Side effects: Some fields might unintentionally contain the original name in a way that shouldn't be replaced (e.g., image URLs), but the proposal is specifically to NOT change image URLs so image names would be preserved.
3. Implementation: The approach should be compatible with the existing HandlebarsApplicationV2 implementation.

## Impact on Version

This enhancement requires updating the version number to reflect the significant functionality improvement.
