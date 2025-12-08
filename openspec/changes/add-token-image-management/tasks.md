## 1. Template Updates
- [ ] 1.1 Add token image element to reskin-form.hbs header section (80x80px max, side-by-side with name)
- [ ] 1.2 Add CSS classes for token image styling (hover states, click indication, aspect ratio)
- [ ] 1.3 Update form width to 700-750px to accommodate image + name layout
- [ ] 1.4 Add placeholder icon for monsters without existing token images
- [ ] 1.5 Include proper alt attributes and accessibility support

## 2. JavaScript Implementation  
- [ ] 2.1 Extract current token image path from actor.prototypeToken.texture.src in ReskinApp
- [ ] 2.2 Pass token image data and placeholder status to template context
- [ ] 2.3 Implement token image click handler to launch FilePicker with callback pattern
- [ ] 2.4 Config FilePicker: type='image', callback property, handle data/public/s3 sources
- [ ] 2.4a Consider using `FilePicker.fromButton()` static method with data-target/data-type attributes
- [ ] 2.4b OR manually instantiate FilePicker with callback: null|Function property
- [ ] 2.5 Handle FilePicker success callback to update 80x80px preview with CSS `object-fit: contain` for aspect ratio maintenance
- [ ] 2.6 Store selected image path in form data for both prototypeToken and token texture
- [ ] 2.7 Add form submission logic to update actor.prototypeToken.texture.src and actor.token.texture.src
- [ ] 2.8 Add error handling for invalid image URLs and FilePicker cancellation
- [ ] 2.9 Check FilePicker.canUpload accessor before enabling upload features
- [ ] 2.10 Handle different file sources (data/public/s3) in the callback logic

## 3. Styling and Layout
- [ ] 3.1 Create CSS styles for token image container (80x80px max, aspect ratio maintained)
- [ ] 3.2 Add hover effects (opacity change, cursor pointer) to indicate clickability
- [ ] 3.3 Update form width to 700-750px with side-by-side image-name layout
- [ ] 3.4 Add proper spacing and alignment between image and monster name
- [ ] 3.5 Style generic placeholder icon for actors without token images
- [ ] 3.6 Add focus/active states for keyboard accessibility
- [ ] 3.7 Test various image aspect ratios within 80x80px constraints:
  - 3.7a Test 1:1 (square) - should fill container completely
  - 3.7b Test 16:9 (wide) - should letterbox with black bars top/bottom  
  - 3.7c Test 9:16 (tall) - should letterbox with black bars sides
  - 3.7d Test animated GIFs - should handle gracefully

## 4. Data Management
- [ ] 4.1 Update ReskinApp formData processing to include token image path from FilePicker
- [ ] 4.2 Add token image to actor creation/update logic for new monsters
- [ ] 4.3 Ensure both actor.prototypeToken.texture.src and actor.token.texture.src are updated
- [ ] 4.4 Handle edge cases (invalid URLs, network errors, missing images)
- [ ] 4.5 Validate image URL accessibility on FilePicker success (immediate feedback to user)

## 5. Testing and Validation
- [ ] 5.1 Test token image display for actors with existing images
- [ ] 5.2 Test placeholder display for actors without images
- [ ] 5.3 Test FilePicker integration and image selection
- [ ] 5.4 Test form submission with token image changes
- [ ] 5.5 Test form submission without token changes (unchanged behavior)
- [ ] 5.6 Test responsive layout on different screen sizes
- [ ] 5.7 Test cross-browser compatibility
- [ ] 5.8 Validate Foundry VTT integration and actor creation

## 6. Documentation and Cleanup
- [ ] 6.1 Add localization strings for token image UI elements ("Click to change token", placeholder alt text)
- [ ] 6.2 Update code comments for new token image functionality and FilePicker integration
- [ ] 6.3 Test build process with new template and script changes
- [ ] 6.4 Validate all files referenced in module.json exist and build correctly
- [ ] 6.5 Add accessibility indicators for clickability:
  - 6.5a Add aria-label: "Token image, click to change"
  - 6.5b Add title attribute: "Click to select a new token image" 
  - 6.5c Consider tooltip on hover showing "Click to change"
