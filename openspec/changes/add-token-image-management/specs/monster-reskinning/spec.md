## ADDED Requirements

### Requirement: Token Image Display
The reskinning form SHALL display the current monster's token image in the header section next to the monster name.

#### Scenario: Display existing token image
- **WHEN** a user opens the reskinning form for a monster with a token image
- **THEN** the form displays the current token image next to the monster name
- **AND** the image is sized appropriately for the form layout

#### Scenario: Handle missing token image
- **WHEN** a user opens the reskinning form for a monster without a token image
- **THEN** the form displays a placeholder image or empty space
- **AND** the layout maintains proper spacing

### Requirement: Token Image Replacement
The system SHALL allow users to replace the monster's token image through a file picker dialog.

#### Scenario: Click to open file picker
- **WHEN** a user clicks on the token image in the reskinning form
- **THEN** the system opens Foundry's FilePicker dialog for image selection
- **AND** the dialog is filtered to show only image files

#### Scenario: Select new token image
- **WHEN** a user selects a new image file through the FilePicker
- **THEN** the token image preview updates to show the selected image
- **AND** the new image path is stored for the reskinned monster

#### Scenario: Cancel image selection
- **WHEN** a user cancels the FilePicker dialog
- **THEN** the token image remains unchanged
- **AND** the form continues to display the original image

### Requirement: Form Layout Adaptation
The reskinning form SHALL adapt its layout to accommodate the token image display.

#### Scenario: Responsive form width
- **WHEN** the token image is displayed in the form header
- **THEN** the form width increases sufficiently to accommodate the image
- **AND** the layout remains responsive on different screen sizes

#### Scenario: Image positioning
- **WHEN** the form renders with the token image
- **THEN** the image is positioned consistently next to the monster name
- **AND** proper spacing is maintained between elements

### Requirement: Token Image Persistence
The system SHALL persist token image changes when the reskinned monster is saved.

#### Scenario: Save reskinned monster with new token
- **WHEN** a user submits the reskinning form with a new token image
- **THEN** the created reskinned monster has the new token image applied
- **AND** the token image is properly configured in Foundry's actor system

#### Scenario: Save without changing token image
- **WHEN** a user submits the reskinning form without modifying the token image
- **THEN** the reskinned monster retains the original token image
- **AND** no token-related errors occur during save

## MODIFIED Requirements

### Requirement: Reskinning Form Layout
The reskinning form SHALL provide a comprehensive layout for monster modification including visual elements.

#### Scenario: Complete form rendering
- **WHEN** a user opens the reskinning form
- **THEN** the form displays monster name, token image, damage type controls, movement type controls, and action buttons
- **AND** all elements are properly positioned and functional
- **AND** the token image is displayed next to the monster name in the header section
