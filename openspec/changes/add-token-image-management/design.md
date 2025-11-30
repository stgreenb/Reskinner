## Context
The Draw Steel Reskinner module provides a form-based interface for modifying monster actors. The current form handles textual and systemic changes (names, damage types, movement types) but lacks visual customization capabilities. Users need to modify token artwork to create visually distinct monster variants during the reskinning process.

Foundry VTT actors have separate token and prototype token images that can be managed through the framework's file picker API.

## Goals / Non-Goals
- Goals:
  - Display current token image in the reskinning form header
  - Enable token image replacement via Foundry's file picker
  - Maintain responsive UI layout with image display
  - Preserve backward compatibility with existing reskinning functionality
- Non-Goals:
  - Character artwork management (deferred to future change)
  - Batch image operations
  - Image editing/cropping functionality
  - Token size/shape modifications

## Decisions
- Decision: Use Foundry's built-in FilePicker API for image selection with upload capability
  - Rationale: Leverages existing UI patterns, handles file uploads to Foundry, and integrates with Foundry's data management
- Decision: Place token image in form header next to monster name
  - Rationale: Provides immediate visual context and maintains association with the monster identity
- Decision: Make form slightly wider (approximately 700-750px) to accommodate image display
  - Rationale: Mobile responsiveness not a concern, allows side-by-side image and name layout
- Decision: Update both actor.prototypeToken.texture.src and token.texture.src
  - Rationale: Since this creates brand new monsters, both settings should be synchronized
- Decision: Use placeholder icon for monsters without existing token images
  - Rationale: Provides clear UI indication that image area is clickable and functional
- Decision: Limit token image display to 80x80px maintaining aspect ratio
  - Rationale: Based on Foundry's 100px grid system, 80x80 provides good preview while fitting form layout

## Technical Approach
- Template: Add token image element to `reskin-form.hbs` header section
- JavaScript: Implement image click handler to launch FilePicker with callback pattern
- **FilePicker Options**: Consider `FilePicker.fromButton()` vs manual instantiation with callback property
- Styling: Update CSS for image display, hover effects, and responsive layout
- Data handling: Update actor's prototype token texture on form submission
- **Source Management**: Handle Foundry's multiple file sources (data/public/s3) properly

## Risks / Trade-offs
- UI Space: Adding image display requires careful layout management
  - Mitigation: Use responsive design and optional image size
- File Selection: FilePicker integration complexity with multiple sources
  - Mitigation: Use `FilePicker.fromButton()` static method or proper callback pattern
- Performance: Image loading may affect form render time
  - Mitigation: Use Foundry's image caching and lazy loading techniques
- Upload Permissions: FilePicker `canUpload` accessor may restrict functionality
  - Mitigation: Check permissions before enabling upload features
- File Source Complexity: Managing `data/public/s3` sources adds implementation complexity
  - Mitigation: Use Foundry's default source management and let user choose

## Migration Plan
- No breaking changes to existing functionality
- New features are additive to existing reskinning form
- Existing reskinned monsters remain unaffected
- Form will gracefully handle actors without token images

## Token Texture Path Specification
- **Primary Update**: `actor.prototypeToken.texture.src` (affects new tokens created from this actor)
- **Secondary Update**: `actor.token.texture.src` (synchronized for consistency)
- **Not Updating**: Individual placed token images on scenes (since this creates new monsters)

## Image Sizing and Handling
- **Display Size**: 80x80px maximum, maintaining aspect ratio using CSS `object-fit: contain`
- **Foundry Grid**: Based on standard 100px grid system
- **File Types**: Allow any image type supported by Foundry's FilePicker
- **Upload**: Enable FilePicker's upload capability to Foundry's data directory
- **Upload Directory**: `data/assets/tokens/` (or user's preferred directory)
- **Placeholder**: Use generic placeholder icon for actors without existing token images
- **Aspect Ratio Strategy**: CSS `object-fit: contain` with letterboxing for non-square images

## Form Layout Specifications
- **Current Width**: 600px
- **New Width**: 700-750px to accommodate side-by-side image and name
- **Mobile**: Not a priority, can focus on desktop experience
- **Image Position**: Left side of monster name in header

## FilePicker Configuration
- **Type**: `'image'` (image-only filtering via Foundry's FILE_TYPES system)
- **Upload**: `true` (allow file uploads to Foundry - controlled by `canUpload` accessor)
- **Upload Directory**: `data/assets/tokens/` (or user's preferred directory)
- **Starting Path**: Current actor's directory if available (uses `sources: Record<"data"|"public"|"s3">`)
- **Validation Timing**: Validate image URL on FilePicker success for immediate feedback
- **Callback Pattern**: Use `callback: null|Function` property to handle file selection
- **Alternative**: Consider `FilePicker.fromButton()` static method with `data-target` and `data-type` attributes
