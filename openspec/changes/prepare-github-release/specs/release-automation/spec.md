# Release Automation Specification

## ADDED Requirements

### Requirement: Automated Release Script
The system SHALL provide automated release script that creates GitHub releases with proper validation and assets.

#### Scenario: Automated Release Script
- **Given** A clean repository with updated version
- **When** Running the release process
- **Then** Script builds the module automatically
- **And** Creates distribution package
- **And** Generates changelog from git history
- **And** Creates GitHub release with attached assets

### Requirement: Distribution Package Creation
The system SHALL create distribution packages that users can install directly.

#### Scenario: Distribution Package Creation
- **Given** Built module files and assets
- **When** Creating release package
- **Then** Package contains all required module files
- **And** Package excludes development-only files
- **And** Package can be extracted and installed directly

### Requirement: Release Validation
The system SHALL validate releases before publishing to ensure they are properly formed.

#### Scenario: Release Validation
- **Given** A newly created release package
- **When** Running validation checks
- **Then** All files referenced in `module.json` exist in package
- **And** Package structure matches Foundry VTT expectations
- **And** Module can be loaded without errors

### Requirement: Version-Tag Synchronization
The system SHALL synchronize version tags with releases for proper version management.

#### Scenario: Version-Tag Synchronization
- **Given** A version update in `package.json`
- **When** Creating a release
- **Then** Git tag is created matching version (e.g., `v0.4.3`)
- **And** Release title includes version number
- **And** Changelog includes relevant commit messages

## MODIFIED Requirements

### Requirement: Enhanced Build Process
The system SHALL enhance the build process to support release creation and distribution packaging.

#### Scenario: Enhanced Build Process
- **Given** Current build process creates basic files
- **When** Adding release automation
- **Then** Build process supports `npm run release` command
- **And** Build validates all required files exist
- **And** Build creates distribution package in `dist/` directory
- **And** Build shows clear success/failure feedback

### Requirement: Package.json Scripts
The system SHALL add standardized npm scripts for the release process.

#### Scenario: Package.json Scripts
- **Given** Current package.json with basic scripts
- **When** Adding release automation
- **Then** Add `release` script for full release process
- **And** Add `validate` script for release validation
- **And** Keep existing scripts (`build`, `watch`, `lint`) working

## Implementation Notes

### New package.json Scripts
```json
{
  "release": "npm run build && npm run validate && node scripts/create-release.js",
  "validate": "node scripts/validate-module.js"
}
```

### Release Script Requirements
- Parse version from package.json
- Run build process
- Validate all required files exist
- Create zip distribution package
- Generate changelog from git commits since last tag
- Create GitHub release using GitHub CLI
- Upload distribution package as release asset

### Distribution Package Structure
```
ds-reskinner-v0.4.3.zip
├── ds-reskinner/
    ├── ds-reskinner.mjs
    ├── css/module.css
    ├── lang/en.json
    ├── templates/reskin-form.hbs
    ├── module.json
    └── src/ (if needed for runtime)
```

### Validation Checklist
- [ ] ds-reskinner.mjs exists and is valid JS
- [ ] css/module.css exists
- [ ] All templates exist
- [ ] All language files exist
- [ ] module.json paths are correct
- [ ] No console errors on module load
