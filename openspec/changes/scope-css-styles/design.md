# CSS Scoping Design

## Current Architecture

The reskinner currently loads CSS in two ways:
1. `src/styles.css` → `css/module.css` (properly scoped to `.reskinner-app`)
2. `minimal-ui-fix.css` (global styles affecting entire Foundry UI)

## Proposed Architecture

### CSS Variable Scoping

Instead of global `:root` variables, all CSS variables will be scoped to `.reskinner-app`:

```css
.reskinner-app {
  --color-background: #1f2021;
  --color-surface: #262828;
  /* ... other variables */
}
```

### Selector Scoping Strategy

All styles will be prefixed with `.reskinner-app` to prevent leakage:

```css
/* Before (global) */
h1, h2, h3, h4, h5, h6 { ... }

/* After (scoped) */
.reskinner-app h1,
.reskinner-app h2,
.reskinner-app h3,
.reskinner-app h4,
.reskinner-app h5,
.reskinner-app h6 { ... }
```

### Implementation Approach

1. **Phase 1**: Remove global CSS from `minimal-ui-fix.css`
2. **Phase 2**: Move necessary variables to `src/styles.css` under `.reskinner-app`
3. **Phase 3**: Update all selectors to be properly scoped
4. **Phase 4**: Test with combat tracker and other modules

### CSS Cascade Layers Strategy

For Foundry v13+ compatibility, organize module styles using CSS Cascade Layers:

```css
/* Define layers for predictable specificity */
@layer reset, base, components, overrides;

@layer reset {
  /* CSS resets within .reskinner-app scope */
}

@layer base {
  /* Base typography and layout */
}

@layer components {
  /* Component-specific styles */
}

@layer overrides {
  /* Specific overrides for combat tracker compatibility */
}
```

### Design Tokens Approach

Extract common values into CSS custom properties under the scope:

```css
.reskinner-app {
  /* Typography tokens */
  --font-size-base: 14px;
  --font-size-heading: 18px;
  --line-height-base: 1.5;

  /* Spacing tokens */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;

  /* Color tokens */
  --color-primary: #007cba;
  --color-surface: #262828;
}
```

## Trade-offs

### Benefits
- Eliminates CSS conflicts with other modules
- Follows CSS best practices for encapsulation
- Makes the module more "good citizen" in the Foundry ecosystem

### Considerations
- Slightly more verbose CSS selectors
- Need to ensure all reskinner UI elements have `.reskinner-app` ancestor
- May need to adjust some styling that relied on global inheritance

## Risk Mitigation

1. **Backup current CSS** before making changes
2. **Incremental testing** after each phase
3. **Combat tracker testing** as primary validation
4. **Cross-module testing** to ensure no new conflicts
5. **Shadow DOM consideration**: Prepare for future Foundry updates that might introduce Shadow DOM boundaries
6. **Performance monitoring**: Keep selectors flat to avoid CSS engine overhead
7. **Version compatibility**: Test across multiple Foundry core versions, especially v13+ with CSS layering changes

## Testing Infrastructure

### Playwright Accessibility Snapshots
For precise combat tracker validation, we can use Playwright to:
- Log into Foundry VTT with automated browser control
- Take accessibility snapshots (not screenshots) of the combat tracker
- Compare snapshots with Reskinner enabled vs disabled
- Detect structural and sizing differences at the DOM level

**Snapshot Testing Workflow**:
1. Navigate to combat tracker with Reskinner disabled
2. Capture accessibility snapshot baseline
3. Enable Reskinner module
4. Capture comparison snapshot
5. Analyze differences for avatar sizing and layout changes

**Manual Loading Requirement**:
- Developer must manually load the updated Reskinner version into Foundry before testing
- Wait for confirmation that the new version is active before running automated comparisons
- This ensures we're testing the actual implementation changes