## 2024-11-20 - Add ARIA Labels to Icon-Only Div Buttons
**Learning:** In custom templating frameworks where `<div>` elements are used as interactive buttons (especially icon-only ones without text), they often lack semantic button properties (`role="button"`, `tabindex="0"`) and accessible names (`aria-label`), making them inaccessible to screen readers and keyboard navigation. Dynamic button arrays mapped via templates require ensuring the data object exposes a label field to populate `aria-label`.
**Action:** When finding `onClick` handlers on `div` elements containing only an `<i data-lucide="...">` tag, always verify if it has an `aria-label`, `role="button"`, and `tabindex="0"`, and add them. Ensure backing data arrays provide human-readable labels for `aria-label` interpolation.

## 2026-09-18 - Synchronizing Desktop Firestorm Features in Dual-Stack (HTML DSL + React) Mockups
**Learning:** When adding interactive desktop features (such as a persistent quick-chat bar, interactive camera HUD controls, and functional top menu actions) to a dual-stack codebase (`docs/index.html` template DSL and `docs/react/` port), event handlers in `docs/index.html` must be named properties in `renderVals()` rather than inline expressions due to DSL resolution constraints.
**Action:** Always maintain 1:1 behavioral parity between `docs/index.html` and `docs/react/`, ensuring new desktop widgets and inputs use named handler callbacks in `renderVals()` for `docs/index.html` and React hooks/state in `docs/react/`.

## 2024-11-20 - Add ARIA Labels and Keyboard Access to React Header Icons
**Learning:** When porting custom div-buttons to React, it's essential to not only add `role="button"`, `tabIndex={0}`, and `aria-label` but also implement an `onKeyDown` handler for 'Enter' and ' ' (Space) keys. It is also important to use `e.preventDefault()` on the key down event to prevent the browser from scrolling down when space is pressed.
**Action:** Add full accessibility attributes and keyboard handlers to interactive custom components.

## 2026-09-20 - Custom Toggle Component Accessibility
**Learning:** Custom interactive components, such as a toggle built from `<span>` elements, must include the semantic attributes `role="switch"` and `aria-checked` to be recognized properly by assistive technologies. Further, keyboard accessibility requires adding `tabIndex={0}` and an `onKeyDown` handler to handle Space and Enter keystrokes, ensuring `e.preventDefault()` is used to prevent the page from scrolling on Space.
**Action:** When inspecting or adding custom switches/toggles, ensure `role="switch"`, `aria-checked`, `tabIndex`, and `onKeyDown` are all correctly configured to replicate native element behavior.
## 2024-11-20 - Add ARIA Labels and Keyboard Access to Chat Chips\n**Learning:** When adding accessibility to interactive list items rendered from an array (like chat thread chips), ensure the mapped data object contains a human-readable label field that can be used to populate the  attribute in both custom HTML templating and React implementations.\n**Action:** Verify that data arrays used for dynamic interactive elements include properties suitable for  injection.

## 2024-11-20 - Add ARIA Labels and Keyboard Access to Chat Chips
**Learning:** When adding accessibility to interactive list items rendered from an array (like chat thread chips), ensure the mapped data object contains a human-readable label field that can be used to populate the `aria-label` attribute in both custom HTML templating and React implementations.
**Action:** Verify that data arrays used for dynamic interactive elements include properties suitable for `aria-label` injection.

## 2026-09-23 - Accessible Custom Tab & Nav Controls
**Learning:** When using `<div>` elements for navigation tabs or tiles in custom implementations (like `SegmentedTabs` and `TileNav`), providing correct ARIA roles (like `role="tab"` and `role="button"`) alongside active state attributes (`aria-selected`, `aria-pressed`) drastically improves screen reader context. Just making it focusable via `tabIndex={0}` is insufficient without key handlers (`onKeyDown`) listening for Space/Enter.
**Action:** When inspecting navigation structures not using native `<button>` or `<a>` tags, ensure `role`, focus states, interaction handlers, and appropriate state attributes (like `aria-pressed/selected`) are fully implemented.

## 2026-09-24 - Accessibility for Text-Based Custom Buttons
**Learning:** It is easy to remember adding `aria-label`, `role="button"`, and `tabindex="0"` to icon-only buttons, but text-based actionable `<div>` or `<span>` elements acting as buttons (like "CLEAR", "DONE", or "CLOSE" links inside modals) are often overlooked. Without these attributes and proper `onKeyDown` handlers for Space/Enter, keyboard and screen reader users cannot perceive or trigger these actions.
**Action:** When auditing or building custom overlays and modals, proactively check any text span or div that has an `onClick` handler. Apply `role="button"`, `tabIndex={0}`, an explicit `aria-label` if the text alone lacks context, and an `onKeyDown` handler to ensure full keyboard interactivity.
