# Design: Extended Actor Name Replacement

## Architecture Overview

The implementation will add a recursive text replacement feature to the existing ReskinApp class, extending the current functionality without changing the UI or user workflow. This maintains backward compatibility while significantly enhancing the feature set.

## Technical Approach

### Design Pattern: Recursive Processing
We'll implement a classic recursive processing pattern with type checking:

1. Check if the object is a string → perform replacement
2. Check if the object is an array → recursively process each element
3. Check if the object is an object → recursively process each property
4. Otherwise → return as-is

This approach handles arbitrarily nested data structures that are common in actor documents.

### Pattern: Pre-Processing Before Create
The new functionality will follow a pre-processing pattern:
1. Clone original actor data with `toObject()`
2. Apply transformations (name replacements with field exclusions) to the cloned data
3. Pass processed data to `Actor.create()`

This maintains separation of concerns and prevents mutation of the original actor.

## Implementation Strategy

### Method Integration
The `_replaceInObject` method will be a private instance method of the `ReskinApp` class, consistent with other helper methods. This keeps the functionality encapsulated within the class while enabling unit testing if needed in the future.

### Field Exclusion Strategy
We'll implement field name-based exclusions to handle media fields specifically:
- Track the parent key during recursion to determine the current field name
- Compare against a predefined list of media-related field names (img, icon, src, etc.)
- Skip text replacement for matching fields to preserve media references

### Regex Strategy
For case preservation, we'll use:
- A global regex pattern for exact matches in different cases ('g' flag)
- Separate handling for title case, lower case, and upper case versions
- Proper character escaping to handle special characters in names

### Error Handling
The implementation will maintain existing error handling patterns, ensuring that replacement failures don't break the core functionality.

## Potential Issues & Mitigation

### Performance
Large actor documents might experience performance issues with full recursive processing. Mitigation: This is expected to be negligible with typical monster data sizes in Foundry VTT.

### Incorrect Matches
The system might replace text that appears to match but isn't actually the actor's name. Mitigation: We'll use exact string matching while maintaining case sensitivity patterns.

### Side Effects
Replacing text in unintended fields (image URLs, file paths, etc.). Mitigation: The field exclusion list prevents changes to common media property names (img, icon, src, path, url, etc.).

## Future Considerations

### Configuration
The replacement behavior might need to be configurable (e.g., case-sensitive vs. insensitive, specific field targeting, custom exclusion lists) in the future.

### Scope Extension
The same approach could potentially be extended to handle other replacement patterns or support regex-based matching.

### Optimization
For large data sets, field-level optimizations could be implemented, or specific data section targeting could improve performance.

## Quality Assurance

### Testing Strategy
Functionality should be unit-testable through the `_replaceInObject` method in isolation, with integration tests confirming full actor replacement workflow works properly, including verification that media fields are properly preserved.
