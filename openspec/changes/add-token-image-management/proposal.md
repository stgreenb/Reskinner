# Change: Add Token Image Management to Reskinner

## Why
The reskinning form currently only allows users to modify monster names and system attributes like damage types and movement types, but doesn't provide access to visual elements. Users need the ability to customize monster token images during reskinning to create visually distinct variants.

## What Changes
- Display current token image next to the monster name at the top of the reskinning form
- Make the form slightly wider to accommodate the image display
- Make the token image clickable to trigger a file picker dialog
- Allow users to select and replace the token artwork
- Update the reskinned monster with the new token image
- **Note**: This focuses on token artwork only; character artwork may be added later

## Impact
- Affected specs: `monster-reskinning`
- Affected code: `src/reskinner-app.js`, `templates/reskin-form.hbs`, `src/styles.css`
- UI changes: Form layout, image display, file picker integration
- Data changes: Actor token image path updates
