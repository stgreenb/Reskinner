# Spec: Extended Actor Name Replacement

## ADDED Requirements

### REQ-NAME-REPLACE-001: Recursive Name Replacement
The system SHALL recursively replace the original actor name with the new name throughout the entire actor data structure.

**Scenario:** When a user reskins a "Kobold" to "Goblin", all textual references to "Kobold" should be changed to "Goblin" in the new actor's data, including those in nested properties like actor.system.details.biography.value.

**Scenario:** Name replacement should maintain proper capitalization patterns (Kobold→Goblin, kobold→goblin, KOBOLD→GOBLIN).

### REQ-NAME-REPLACE-002: Complex Structure Processing
The system SHALL process nested object structures when replacing names.

**Scenario:** Actor items with nested descriptions should have names replaced even in deeply nested properties like actor.items[0].system.description.

**Scenario:** Arrays of features containing names should have their elements processed, including actor.effects and other collection-type fields.

### REQ-NAME-REPLACE-003: Case-Preserving Text Matching
The system SHALL perform case-aware text matching while preserving original formatting where appropriate.

**Scenario:** When "Kobold" is replaced with "Goblin", "KOBOLD" becomes "GOBLIN" and "kobold" becomes "goblin".

**Scenario:** Proper sentence structure should be maintained (Kobold at start of sentence becomes Goblin while maintaining capitalization pattern).

### REQ-NAME-REPLACE-004: Object Type Handling
The system SHALL handle all standard JavaScript data types during replacement.

**Scenario:** String values should be replaced, array elements should be recursively processed, object properties should be recursively processed.

**Scenario:** Primitive values that are not strings should pass through unchanged (numbers, booleans, etc.).

### REQ-NAME-REPLACE-005: Media Field Preservation
The system SHALL preserve media field values during replacement to avoid breaking image and resource references.

**Scenario:** Fields named 'img', 'icon', 'src', 'path', 'url', 'uri', 'texture', 'srcSmall', 'srcLarge' should not have their content modified during replacement.

**Scenario:** When processing an object with an 'img' property, the original image URL should be preserved.

## MODIFIED Requirements

### REQ-NAME-REPLACE-006: Form Submission Context
The `_handleFormSubmit` method SHALL capture the original actor name for replacement context.

**Scenario:** Before creating the new actor, the old name should be preserved as context for replacement.

**Scenario:** Form submission should pass both old and new names to the replacement mechanism.

### REQ-NAME-REPLACE-007: Actor Creation with Replacement
The actor creation flow SHALL apply name replacements before creating the new actor instance.

**Scenario:** The final actor data sent to `Actor.create()` MUST contain all name replacements.

**Scenario:** The original actor data SHALL NOT be modified during the replacement process.

## Implementation Notes

### _replaceInObject Method Signature
```javascript
_replaceInObject(obj: Object, oldText: string, newText: string, parentKey: string): Object
```

### Integration Points
- The method will be called after form validation but before `Actor.create`
- The original `sourceData` will come from `this.actor.toObject()`
- Replacement will use case-insensitive, global regex matching
- Field exclusion logic will prevent modifications to media-related fields
