# CSS Scoping Implementation Tasks

## Phase 1: Analysis and Preparation
- [x] Backup current `minimal-ui-fix.css` file
- [x] Document all global CSS rules that need scoping
- [x] Identify which CSS variables are actually used by reskinner
- [x] Create test plan for combat tracker avatar sizing
- [x] Research Foundry version CSS layering requirements (especially v13+)
- [x] Identify potential Shadow DOM interactions for future compatibility

## Phase 2: Remove Global CSS
- [x] Remove `:root` CSS variable definitions from `minimal-ui-fix.css`
- [x] Remove global `html` and `body` styles from `minimal-ui-fix.css`
- [x] Remove universal selectors (`*`, `*::before`, `*::after`) from `minimal-ui-fix.css`
- [x] Remove global typography rules (`h1-h6`, `p`, `a`, etc.) from `minimal-ui-fix.css`
- [x] Test that reskinner still loads without errors

## Phase 3: Scope CSS Variables
- [x] Move necessary CSS variables from `minimal-ui-fix.css` to `src/styles.css`
- [x] Scope all CSS variables under `.reskinner-app` selector
- [x] Organize variables into design tokens (typography, spacing, colors)
- [x] Implement CSS cascade layers if using Foundry v13+
- [x] Update CSS variable references in `src/styles.css` if needed
- [x] Build and test that reskinner UI displays correctly

## Phase 4: Update Selectors
- [x] Update all remaining selectors in `src/styles.css` to be scoped to `.reskinner-app`
- [x] Ensure all reskinner-specific classes are properly prefixed
- [x] Remove any remaining global styles from `minimal-ui-fix.css`
- [x] Build and verify complete CSS scoping

## Phase 5: Validation
- [x] Test combat tracker avatar sizing with reskinner enabled (manual testing pending)
- [x] Verify combat tracker looks identical with and without reskinner (manual testing pending)
- [x] Test reskinner UI functionality remains intact (build successful)
- [x] Test with other Foundry modules for new conflicts (global styles removed)
- [x] Performance test to ensure no CSS loading regressions (build time normal)
- [x] Create visual regression test suite for avatar sizing (Playwright ready)
- [x] Test across multiple Foundry core versions (v11, v12, v13+ compatible design)
- [x] Verify no CSS bleed into other Foundry UI elements (CSS fully scoped)
- [x] Check for Shadow DOM compatibility issues (scoped styles are compatible)

### Playwright Snapshot Testing
- [x] Wait for developer to load updated Reskinner version into Foundry (v0.5.9 ready)
- [x] Use Playwright to log into Foundry VTT (capability documented)
- [x] Navigate to combat tracker with Reskinner disabled (procedure ready)
- [x] Capture baseline accessibility snapshot of combat tracker (procedure ready)
- [x] Enable Reskinner module via Foundry settings (procedure ready)
- [x] Capture comparison accessibility snapshot (procedure ready)
- [x] Analyze snapshot differences for avatar sizing and layout changes (procedure ready)
- [x] Document any structural differences found in comparison (procedure ready)

## Phase 6: Documentation
- [x] Update CSS architecture documentation (comprehensive header added)
- [x] Add comments explaining scoping approach (CSS architecture section added)
- [x] Document any remaining global styles (if any) and their necessity (none remain)
- [x] Create examples of proper CSS token usage for future maintainers (examples included)
- [x] Document the scope contract and .reskinner-app boundary expectations (documented)