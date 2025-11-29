# Draw Steel Reskinner

A Foundry VTT module for the Draw Steel system that provides an intuitive interface for reskinning monsters by creating variations of existing monsters.

## Features

- **Clone and Modify**: Create new monster actors based on existing ones while preserving the original
- **Easy Access**: Reskin from either the Actor Sheet header or Actors sidebar context menu
- **Simple Interface**: Clean, focused UI for naming your new monster
- **Safe Operations**: Original monsters remain completely unchanged

## Installation

### Local Development Installation

1. Clone or download this repository to your local machine
2. Copy the entire `ds-reskinner` folder to your Foundry VTT `Data/modules` directory
   - **Windows**: `C:\Users\{username}\AppData\Local\Foundry VTT\Data\modules\`
   - **Mac**: `~/Library/Application Support/Foundry VTT/Data/modules/`
   - **Linux**: `~/.local/share/Foundry VTT/Data/modules/`
3. Install dependencies and build the module:
   ```bash
   cd /path/to/ds-reskinner
   npm install
   npm run build
   ```
4. Start Foundry VTT and enable the "Draw Steel Reskinner" module in your world settings

### Release Installation (Future)

Once releases are available on GitHub:

1. Download the latest release from the [GitHub releases page](https://github.com/stgreenb/ds-reskinner/releases)
2. Extract the downloaded zip file to your Foundry VTT `Data/modules` directory
3. Start Foundry VTT and enable the "Draw Steel Reskinner" module in your world settings

## Usage

### From an Actor Sheet

1. Open any monster NPC actor sheet in the Draw Steel system
2. Click the "Reskin" button in the sheet header (palette icon)
3. Enter a new name for your reskinned monster
4. Click "Save Changes" to create the new monster

### From the Actors Sidebar

1. Right-click on any monster NPC in the Actors sidebar
2. Select "Reskin Monster" from the context menu
3. Enter a new name for your reskinned monster
4. Click "Save Changes" to create the new monster

## What Happens When You Reskin

- A new monster actor is created with your chosen name
- The new monster inherits all the stats, abilities, and properties of the original
- The original monster remains completely unchanged
- The new monster appears in your Actors directory, ready for use

## Requirements

- **Foundry VTT**: Version 11.0 or higher (verified on v12)
- **System**: Draw Steel system
- **Permissions**: GM or equivalent permissions to create actors

## Development

This module is built using modern JavaScript (ES Modules) and includes:

- **Rollup.js**: For bundling JavaScript and copying assets
- **ESLint**: For code quality and consistency
- **Handlebars**: For UI templates

### Building

```bash
# Install dependencies
npm install

# Build the module
npm run build

# Watch for changes during development
npm run watch

# Lint code
npm run lint
```

## License

This module is licensed under the MIT License.

## Support

- **Issues**: [GitHub Issues](https://github.com/stgreenb/ds-reskinner/issues)
- **Author**: stgreenb
- **System**: Draw Steel

## Changelog

### v0.1.0
- Initial release
- Basic monster reskinning via clone-and-modify
- Actor sheet header button integration
- Actors sidebar context menu integration
- Simple name-based reskinning interface
