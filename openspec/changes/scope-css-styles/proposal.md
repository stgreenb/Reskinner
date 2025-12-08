# Scope CSS Styles to Prevent Combat Tracker Conflicts

## Problem Statement

The Draw Steel Reskinner module currently includes global CSS rules in `minimal-ui-fix.css` that affect the entire Foundry VTT interface. These global styles are causing combatant avatars in the Draw Steel combat tracker to become 10x larger when the reskinner module is activated.

## Root Cause Analysis

1. **Global CSS Variables**: `minimal-ui-fix.css` defines CSS variables on the `:root` selector
2. **Global Typography Rules**: Broad selectors like `h1-h6`, `p`, `a` affect all elements
3. **Universal Selectors**: `*`, `*::before`, `*::after` with global box-sizing rules
4. **Global HTML/Body Styles**: Base font-size and font-family changes affect layout calculations

These global rules interfere with Draw Steel's custom combat tracker implementation, which relies on specific sizing calculations for avatar display.

## Proposed Solution

Scope all CSS styles to only affect elements within the `.reskinner-app` container, ensuring the reskinner's styling does not leak into other Foundry UI components.

## Change Scope

This change will:
1. Remove global CSS rules from `minimal-ui-fix.css`
2. Move necessary CSS variables into `src/styles.css` scoped under `.reskinner-app`
3. Ensure all reskinner styles are contained within the reskinner application
4. Preserve all existing reskinner functionality while preventing UI conflicts

## Impact Assessment

- **Positive**: Eliminates combat tracker avatar sizing issues
- **Positive**: Prevents future conflicts with other Foundry modules
- **Neutral**: No impact on reskinner core functionality
- **Risk**: Requires careful testing to ensure all reskinner UI elements remain styled correctly

## Dependencies

- Requires testing with Draw Steel combat tracker
- Requires testing with other Foundry modules to ensure no regressions
- Requires compatibility testing across Foundry v11, v12, and v13+ (especially for CSS cascade layers)
- May need to account for future Shadow DOM implementations in Foundry updates
- **Manual module loading**: Developer must manually load updated Reskinner version into Foundry before validation testing
- **Playwright testing access**: Requires ability to log into Foundry via Playwright for automated snapshot comparisons

## Testing Methodology

### Automated Playwright Validation
For precise combat tracker testing, we will use Playwright to:
- Log into Foundry VTT with automated browser control
- Take accessibility snapshots (DOM-level, not visual screenshots)
- Compare combat tracker structure with Reskinner enabled vs disabled
- Detect avatar sizing and layout differences at the element level

This approach provides objective, repeatable testing of the CSS scoping effectiveness beyond visual inspection.

## Technical Considerations

### CSS Cascade Layers (Foundry v13+)
The implementation should leverage CSS cascade layers to ensure proper style ordering and prevent specificity conflicts with Foundry's built-in styles.

### Performance Implications
- Scoping adds selector depth but improves encapsulation
- Keep selectors reasonably flat to avoid CSS engine overhead
- Design tokens reduce CSS size through reusability

### Future-Proofing
- Consider Shadow DOM boundaries in future Foundry versions
- Maintain clear scope boundaries for easier maintenance
- Document the scoping contract for future contributors