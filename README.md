# Draw Steel Reskinner

A Foundry VTT module for the Draw Steel system that provides an intuitive interface for quickly reskinning monsters to suit your campaign needs.

## Features

- **Quick Access**: Right-click on any monster in the Actors sidebar or compendium to start reskinning
- **Name Changes**: Instantly rename monsters for your campaign
- **Image Swapping**: Change both portrait art and token images simultaneously
- **Damage Type Conversion**: Swap one damage type for another across all abilities
- **Movement Types**: Add or remove movement types for terrain-specific encounters
- **Level & Role Adjustments**: Modify monster level and role with smart restrictions
- **Safe Operations**: Creates new actor copies - original monsters remain unchanged

## Installation

### From GitHub Release (Recommended)

1. Download the latest release from the [GitHub releases page](https://github.com/stgreenb/ds-reskinner/releases)
2. Extract the `ds-reskinner` folder to your Foundry VTT `Data/modules` directory
3. Start Foundry VTT and enable the "Draw Steel Reskinner" module in your world settings

### Manual Installation

1. Clone this repository to your local machine
2. Copy the entire folder to your Foundry VTT `Data/modules` directory:
   - **Windows**: `C:\Users\{username}\AppData\Local\Foundry VTT\Data\modules\`
   - **Mac**: `~/Library/Application Support/Foundry VTT/Data/modules/`
   - **Linux**: `~/.local/share/Foundry VTT/Data/modules/`
3. Install dependencies and build:
   ```bash
   cd /path/to/ds-reskinner
   npm install
   npm run build
   ```
4. Start Foundry VTT and enable the module in world settings

## Usage

### From the Actors Sidebar

1. **Right-click** on any monster NPC in the Actors sidebar
2. Select **"Reskin Monster"** from the context menu
3. Make your desired changes in the reskin interface
4. Click **"Save Changes"** to create your new monster

### From a Compendium

1. **Right-click** on any monster in a compendium
2. Select **"Reskin Monster"** from the context menu
3. Configure your reskinned monster
4. Save to create a new actor in your Actors directory

## Reskinning Options

### Basic Changes
- **Name**: Change the monster's display name
- **Images**: Update character art and token simultaneously

### Combat Adjustments
- **Damage Types**: Replace one damage type with another across all abilities
- **Movement**: Add or remove movement types (burrow, climb, fly, swim)

### Power Scaling
- **Level**: Adjust the monster's level for your party
- **Role**: Change between combat roles (with smart restrictions to maintain balance)

**Note**: Role changes have intelligent restrictions - Leaders and Solos can swap between each other, while other roles cannot become Leaders/Solos without additional villain actions.

## Requirements

- **Foundry VTT**: Version 11.0 or higher (tested on v12 and v13)
- **System**: Draw Steel system
- **Permissions**: Game Master or equivalent permissions to create actors

## Development

This module is built with:
- **JavaScript ES Modules**: Modern JavaScript patterns
- **Rollup.js**: Build system for bundling and asset management
- **Handlebars**: Template system for the user interface

### Building the Module

```bash
# Install dependencies
npm install

# Build the module
npm run build

# Watch for changes during development
npm run watch

# Validate module structure
npm run validate

# Create a release
npm run release
```

## License

This module is licensed under the [MIT License](LICENSE).

## Support

- **Issues & Bug Reports**: [GitHub Issues](https://github.com/stgreenb/ds-reskinner/issues)
- **Author**: stgreenb
- **System Compatibility**: Draw Steel RPG system

## Changelog

### v0.4.3
- Enhanced build process with validation
- Added release automation
- Cleaned repository for public release
- Improved package distribution structure

### v0.4.0
- Added compendium support for right-click reskinning
- Implemented damage type swapping
- Added movement type management
- Level and role adjustment features

### v0.1.0
- Initial release
- Basic monster reskinning via clone-and-modify
- Actor sheet header button integration
- Simple name and image swapping interface