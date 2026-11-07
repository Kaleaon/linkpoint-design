1. **Explore `docs/react/src/components/RadialPieMenu.jsx`**
   - The `<g>` element for pie slices and `<circle>` element for the center hub use `onClick`, but they lack `role="button"`, `tabIndex={0}`, an explicit `aria-label`, and `onKeyDown` attributes for full screen-reader and keyboard accessibility.
   - The same applies to the center target info `<div>`.
2. **Apply Accessibility Fixes to `RadialPieMenu.jsx`**
   - In `<g>` (slice), add: `role="button"`, `tabIndex={0}`, `aria-label={slice.label}`, and `onKeyDown` to replicate `onClick`.
   - In `<circle>` (center hub), add: `role="button"`, `tabIndex={0}`, `aria-label="Close Radial Menu"`, and `onKeyDown` for keyboard closing.
   - In `<div>` (center info target), add: `role="button"`, `tabIndex={0}`, `aria-label="Cancel"`, and `onKeyDown`.
3. **Verify Changes**
   - Ensure the React codebase builds (`pnpm run build` if needed).
   - Ensure linter passes.
   - Run vitest `pnpm test`.
4. **Update Palette Journal (`.Jules/palette.md`)**
   - Log a finding that SVG-based custom controls (`<g>`, `<circle>`) often miss ARIA roles and tab indices, rendering them invisible to screen readers or keyboard users despite having some global key event listeners.
5. **Complete pre-commit steps**
   - Execute tests, a11y checks, etc., to ensure changes don't break existing stuff.
6. **Submit PR**
   - Title: "🎨 Palette: Add ARIA and keyboard accessibility to RadialPieMenu"
