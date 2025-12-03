# GitHub Release Architecture Design

## Repository Structure Strategy

### Public Repository Structure
```
ds-reskinner/
├── src/                    # Clean source code
├── css/                    # Generated CSS (build output)
├── lang/                   # Localization files
├── templates/              # Handlebars templates
├── packs/                  # Data packs
├── dist/                   # Distribution bundle (new)
├── package.json           # Dependencies and scripts
├── module.json            # Foundry VTT metadata
├── ds-reskinner.mjs       # Built JavaScript bundle
├── rollup.config.mjs      # Build configuration
├── .gitignore             # Clean ignore rules
├── README.md              # User documentation
└── LICENSE                # MIT License
```

### Excluded Directories (Private)
- `.factory/` - Factory AI assistant files
- `.gemini/` - Gemini AI assistant files  
- `.kilocode/` - KiloCode assistant files
- `.windsurf/` - Windsurf editor files
- `openspec/` - OpenSpec development specs
- `AGENTS.md` - AI assistant instructions

## Release Workflow Design

### Version Management
- Single source of truth: `package.json` version
- Build process propagates to `module.json` and bundle
- Git tags for releases: `v0.4.3`, `v0.4.4`, etc.

### Distribution Strategy
1. **GitHub Releases**: Primary distribution method
2. **Source Repository**: Clean code without AI traces
3. **Release Assets**: Pre-built module zip files

### Build Process Enhancement
```javascript
// Enhanced rollup config will:
// 1. Generate ds-reskinner.mjs (required)
// 2. Copy css/module.css (required)
// 3. Create distribution zip in dist/
// 4. Validate all required files exist
```

### Git Workflow
```
main branch: Clean public code
development branch: AI-assisted development (private)
release process: Tag → Build → Release
```

## Security Considerations
- Remove any API keys or sensitive data
- Ensure no development environment traces
- Validate build output contains only module files
- Test installation from release package
