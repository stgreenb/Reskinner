# CSS Encapsulation Specification

## ADDED Requirements

### Requirement: CSS Variable Scoping
The reskinner module SHALL scope all CSS variables to the `.reskinner-app` container to prevent global style conflicts.

#### Scenario: Combat Tracker Unaffected
WHEN the reskinner module is activated
THEN the Draw Steel combat tracker avatar sizes SHALL remain unchanged from their default dimensions.

#### Scenario: Variable Isolation
WHEN CSS variables are defined by the reskinner
THEN they SHALL only affect elements within the `.reskinner-app` container and SHALL NOT leak to other Foundry UI components.

### Requirement: Global Style Removal
The reskinner module SHALL NOT apply any global CSS rules that affect elements outside the `.reskinner-app` container.

#### Scenario: No Global Selectors
WHEN the module applies CSS rules
THEN it SHALL NOT use universal selectors (`*`, `*::before`, `*::after`) or global element selectors (`html`, `body`) that affect the entire Foundry interface.

#### Scenario: Scoped Typography
WHEN typography rules are applied
THEN they SHALL be scoped to `.reskinner-app` and SHALL NOT affect headings, paragraphs, or text in other Foundry modules.

## MODIFIED Requirements

### Requirement: CSS Architecture
The reskinner module SHALL maintain all existing UI functionality while implementing proper CSS encapsulation.

#### Scenario: Preserved Styling
WHEN CSS scoping is implemented
THEN all reskinner UI elements SHALL maintain their current appearance and behavior.

#### Scenario: Build Process
WHEN the build process runs
THEN it SHALL correctly compile scoped CSS from `src/styles.css` to `css/module.css` without breaking references.

## REMOVED Requirements

### Requirement: Global CSS Application
The module SHALL NO LONGER apply global CSS rules through `minimal-ui-fix.css` that affect the entire Foundry VTT interface.

#### Scenario: No Global Impact
WHEN the reskinner module is activated
THEN it SHALL NOT cause any visual changes to Foundry UI components outside the reskinner application itself.