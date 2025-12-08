# Tasks: Extended Actor Name Replacement

## Ordered Implementation Tasks

- [x] **Analyze current implementation** - Review existing `_handleFormSubmit` method and form handling
- [x] **Add old name capture** - Modify `_handleFormSubmit` to capture the original actor name
- [x] **Implement `_replaceInObject` method** - Create the recursive text replacement helper method with field exclusions
- [x] **Integrate replacement into submit handler** - Connect the replacement method to the form submission
- [x] **Test basic replacement functionality** - Verify name replacement works in simple string cases
- [x] **Test early with real actor** - Test with a real Draw Steel actor in Foundry to identify any structural issues
- [x] **Test complex object structures** - Verify replacement works with nested object and array structures
- [x] **Test field exclusions** - Verify image URLs and media fields are preserved correctly
- [x] **Update version numbers** - Increment version in package.json and module.json (0.1.49 → 0.2.1)
- [x] **Build and package** - Generate ds-reskinner.mjs with updated functionality
- [x] **Validate comprehensive functionality** - Test with various actor types to ensure comprehensive replacement
- [x] **Document changes** - Update comments in code to reflect new functionality

## Dependencies

- Task 3 must be completed before task 4
- Tasks 7, 8 must be done after implementation

## Parallelizable Tasks

- Version update (task 7) can run in parallel with development
- Code documentation (task 9) can be done during other tasks
