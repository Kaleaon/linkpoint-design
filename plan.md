1. **Analyze missing accessibility for movement pad on the console layout.**
   - In `docs/react/src/components/ConsoleFrame.jsx`, there are `<div onMouseDown={...}>` components for the movement pad (fly up, fly down, grid directions, cam modes) and related `<div onClick={...}>` items (RUN, HIDE/MOVE PAD). While some `onClick` ones have `role="button"` and `tabIndex={0}`, the `onMouseDown`/`onMouseUp` ones completely lack `role`, `tabIndex`, `aria-label`, and `onKeyDown`/`onKeyUp` handlers, meaning they are inaccessible to keyboard and screen readers.
   - The same issue exists in `docs/index.html` within the HTML DSL `<sc-if value="{{ consoleScene }}">` block.

2. **Fix `docs/react/src/components/ConsoleFrame.jsx`**
   - Inside `ConsoleScene()`, add `role="button"`, `tabIndex={0}`, `aria-label`s, `onKeyDown`, and `onKeyUp` to the movement pad cells (from `CPAD`) that map `actions.cHold(p.k)`.
   - Add the same attributes to the `UP` and `DN` fly controls, utilizing `actions.flyUpDown`/`actions.flyDnDown` for `onKeyDown` and `actions.flyRelease` for `onKeyUp`.

3. **Fix `docs/index.html`**
   - Inside the template `renderVals()`, add corresponding named handlers: `flyUpKeyDown`, `flyDnKeyDown`, `flyReleaseKeyUp`, `toggleRunKeyDown`, `togglePadKeyDown`, and extend the `cfPad` mapped objects with `pKeyDown` and `pKeyUp` handlers.
   - Update the `<div onMouseDown="{{ flyUpDown }}" ...>`, `<div onMouseDown="{{ p.down }}" ...>`, and other related buttons to use `role="button"`, `tabindex="0"`, dynamic `aria-label`s, and the new keyboard event bindings.

4. **Add entry to `.Jules/palette.md`**
   - Create a journal entry titled "Keyboard Access for Hold-to-Activate Controls" documenting that `onMouseDown`/`onMouseUp` controls need corresponding `onKeyDown` and `onKeyUp` listeners (checking for Space/Enter) to ensure keyboard users can trigger and release actions like camera movement.

5. **Complete pre commit steps**
   - Run the validation runner script (`npm run validate` or `node tools/ci-runner.mjs --unit`) to verify unit tests, accessibility audits, and UI functionality.
   - Ensure a clean build of `docs/react` (`cd docs/react && pnpm build`).

6. **Submit PR**
   - Use standard branch `palette-move-pad-a11y` and title `🎨 Palette: Add keyboard accessibility to movement pad`.
