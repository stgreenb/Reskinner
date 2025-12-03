# Repository Cleanup Specification

## ADDED Requirements

### Requirement: Clean AI Assistant Traces
The system SHALL remove all AI assistant directories from version control before public release.

#### Scenario: Clean AI Assistant Traces
- **Given** The repository has directories like `.factory`, `.gemini`, `.kilocode`, `.windsurf`, and `openspec`
- **When** The cleanup process runs
- **Then** These directories must be excluded from version control
- **And** They must be included in `.gitignore` to prevent future commits

### Requirement: Remove Development Documentation
The system SHALL remove development documentation files that are not relevant to end users.

#### Scenario: Remove Development Documentation
- **Given** Files like `AGENTS.md`, `quick-fix-guide.md`, `ui-consistency-dark-theme.md`
- **When** Preparing for public release
- **Then** These files must be removed from tracking
- **And** They should be excluded by `.gitignore` patterns

### Requirement: Clean Build Artifacts
The system SHALL remove temporary build artifacts and development files from version control.

#### Scenario: Clean Build Artifacts
- **Given** Log files, temporary CSS files, and development artifacts
- **When** Preparing clean repository
- **Then** Only essential module files remain in tracking
- **And** `.gitignore` prevents future inclusion of these files

### Requirement: Validate Clean Repository
The system SHALL validate that the repository contains only essential module files before release.

#### Scenario: Validate Clean Repository
- **Given** A repository that should be cleaned
- **When** Running validation checks
- **Then** No AI assistant directories are tracked
- **And** No development documentation files are tracked
- **And** Only module-essential files remain in version control

## MODIFIED Requirements

### Requirement: Enhanced .gitignore
The system SHALL update `.gitignore` to exclude all AI assistant traces and development artifacts.

#### Scenario: Enhanced .gitignore
- **Given** Current `.gitignore` file with basic exclusions
- **When** Updating for public release preparation
- **Then** Add patterns for all AI assistant directories
- **And** Add patterns for development documentation files
- **And** Maintain existing essential exclusions

## Implementation Notes

### .gitignore Additions Required
```
# AI Assistant Directories
.factory/
.gemini/
.kilocode/
.windsurf/
.openspec/

# Development Documentation
AGENTS.md
quick-fix-guide.md
ui-consistency-dark-theme.md
AdjustingMonsters.md

# Development Artifacts
*.log
192.168.*.log
minimal-ui-fix.css
unified-dark-theme.css

# Temporary Files
fvtt-Actor-*.json
```

### Git Commands Required
- `git rm --cached AGENTS.md` - Stop tracking development doc
- `git rm --cached *.log` - Remove log files
- Update `.gitignore` with new patterns
- Commit changes to clean repository state
