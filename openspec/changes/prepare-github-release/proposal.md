# GitHub Release Preparation Proposal

## Goal
Prepare the ds-reskinner Foundry VTT module for public GitHub release while removing all traces of AI assistance development.

## Problem Statement
The current codebase contains AI assistance artifacts (OpenSpec, factory configs, editor traces) that should not be publicly visible. We need to clean the repository and establish a proper release workflow.

## Scope
- Clean up AI assistance traces and development artifacts
- Establish GitHub release workflow with proper versioning
- Create publish-ready distribution package
- Update documentation for public consumption
- Ensure build process creates clean, distributable artifacts

## Files to Remove/Exclude
1. **AI Assistant Directories**: `.factory`, `.gemini`, `.kilocode`, `.windsurf`, `openspec/`
2. **Development Files**: `AGENTS.md`, temporary log files, development CSS files
3. **Build Exclusions**: Ensure `.gitignore` properly excludes all non-essential files

## Release Workflow
1. Clean repository of AI traces
2. Update version and build distributable package
3. Create GitHub release with changelog
4. Provide clean installation instructions

## Success Criteria
- Repository contains only essential module files
- GitHub release process is automated
- Users can install via GitHub releases
- No AI assistance traces visible in public repository
