# Tasks: Add Compendium Reskin Integration

## Monster Sheet Top Bar Integration

1. **Implement Monster Sheet Header Button**
   - Modify `src/module.js` to add a "Reskin" button to `getActorSheetHeaderButtons` hook
   - Use the same compatibility validation as the context menu: (game.system.id === 'draw-steel' && (actor.system?.monster || validateActorData(actor)))
   - Button should call the existing `ReskinApp` functionality with proper error handling

2. **Implement Top Bar Error Handling**
   - Wrap ReskinApp initialization in a try/catch to handle initialization errors
   - Show proper error notifications using `ui.notifications.error` when issues occur

3. **Test Top Bar Integration**
   - Verify button appears on compatible monster sheets (Draw Steel monsters only)
   - Test that clicking opens the reskin interface correctly
   - Ensure button doesn't appear on non-compatible actors (non-Draw Steel actors, non-monster actors)
   - Test error handling when initialization fails

## Compendium Reskin Functionality

4. **Add Compendium Context Menu Option**
   - Add hook for `getCompendiumContextOptions` to add a "Reskin and Import" option  
   - Implement proper validation to only show the option for compatible Draw Steel monsters: (game.system.id === 'draw-steel' && document.data.system?.monster || validateActorData(document.data))
   - Option should not appear for non-actor compendium entries or non-Draw Steel content

5. **Implement Compendium Document Fetch Workflow**
   - Create a new function to fetch a compendium document using `pack.getDocument(id)`
   - Create a temporary actor using the fetched document data: `Actor.implementation.create(doc.data.toObject(), {temporary: true})`
   - Open the ReskinApp interface with the temporary actor

6. **Implement Import Workflow After Reskinning**
   - When user saves changes from the reskin interface, ensure modified actor data becomes a new world actor
   - Properly dispose of temporary actor used for the interface
   - Consider using the same save logic as existing reskin function but with appropriate actor creation

7. **Implement Compendium-Specific Error Handling**
   - Handle cases where compendium access fails, permissions issues, or document loading errors
   - Ensure appropriate error notifications are shown to users using `ui.notifications.error`

8. **Test Compendium Integration**
   - Verify "Reskin and Import" option appears only for compatible actor compendiums
   - Test the complete workflow: select compendium actor → reskin → import to world
   - Test error handling for permission/access issues
   - Ensure all functionality works consistently with existing reskinning features

## Validation

9. **Validate Both Integrations**
   - Test both top-bar and compendium integration workflows
   - Ensure no conflicts with existing functionality
   - Verify all features work consistently with the same ReskinApp interface
   - Test error handling in all scenarios
