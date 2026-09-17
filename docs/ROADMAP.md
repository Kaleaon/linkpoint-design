# Linkpoint Mobile — feature & screen roadmap

Grounded against `memory/PRD.md` and `frontend/` in `Kaleaon1/Linkpoint-redux`
(the real Expo app this mockup designs for) as of 2026-09-15.

## Current state

`docs/index.html` — the single mockup page (see "One HTML page" below) —
already covers all 13 screens the mockup set out to build, across 6 layout
packs × 24 colour packs × 4 device sizes:

Chat, Friends, Radar, Map, 3D View, Inventory, Profile, Groups, Notices,
Teleport, Settings, Diagnostics, Login.

Comparing screen-by-screen against the real app's PRD, the mockup already
models most of what the real app does or plans to do: LINK badge (circuit
state) in Chat, a "grid connection lost / RECONNECT" system dialog, an
offline-mode login toggle, friend request accept/decline cards, group
notices, offline-IM quick reply, and diagnostics circuit/endpoint stats.
Map, 3D View, Profile, Groups, Notices and Teleport go beyond the current
real-app MVP scope — they're the aspirational surface from the design brief.

## Gaps found (real app has it, mockup doesn't yet) — status: closed 2026-09-16

Read directly from `frontend/app/login.tsx`, `search.tsx`,
`src/components/scope-picker.tsx`, `(tabs)/friends.tsx`, `(tabs)/more.tsx`
on 2026-09-15 — exact fields/states below, not paraphrased from the PRD.
All five are now implemented in both `docs/GridLink Mobile.dc.html` and
`docs/react/`, verified with a headless-Chromium pass exercising every new
interaction (zero console/page errors) plus a regression check that
existing card actions (friend accept/decline, Groups' OPEN CHAT) still
work.

1. ~~Login only has one working path.~~ Now a real GRID LOGIN/OFFLINE
   toggle that swaps the field set, an Agni/Aditi grid picker, and a
   connecting → error state (CONNECT always "fails" after ~1s, since this
   mockup has no live backend to succeed against).
2. ~~No "start a conversation with anyone" picker in Chat.~~ Added an
   "ALL (n)" chip to the IM/Group rows that opens the new Search screen.
3. ~~Friends rows have no rights icons.~~ Added `eye`/`map-pin`/`pencil`
   per row via a new optional `rights` field on the shared card renderer.
4. ~~No resident search screen.~~ New "FIND RESIDENTS" screen: live-filtered
   results, each row cycling ADD → (sending) → OFFERED, or FRIEND for
   existing friends. Reached from Friends' header icons and the "ALL (n)"
   chip.
5. ~~Settings has no account/session identity.~~ Added a session card
   (avatar/mode/grid/region/agent id/sim-link state), a Reconnect action
   with its own busy state, and a destructive Disconnect row.

While testing these against a live browser, also found and fixed two
real, pre-existing bugs in the mockup (both also present, or avoided, in
the React port — see its commit history for specifics):
- The `cards` renderer's action-button mapping dropped every action's
  `pick` handler, so **every** card action in the whole app (friend
  accept/decline, group notice/invite, notice quick-reply, teleport pin,
  settings preview-all/browse-packs/system-match) rendered but did
  nothing on click.
- `"lan-connect"` isn't a real lucide icon name in either icon set, so the
  Reconnect card's icon silently rendered blank — swapped for
  `"plug-zap"`.

## One HTML page (2026-09-17)

The project used to carry nine overlapping `.dc.html`/`.html` mockup
snapshots (`GridLink Mobile.dc.html`, `Linkpoint Mobile.dc.html`, `Second
Life Mobile Viewer-src.html`, two `Sweep Frame *` and three `Vessel Viewer
*` single-frame explorations, `iconic-previews.html`). They'd forked
silently: `index.html`/`Linkpoint Mobile.dc.html` had picked up the
"every card action needs a real `onClick`" fix and the rebrand, but had
*lost* the five gaps this file says were "closed 2026-09-16" — Login's
Agni/Aditi flow, the Search screen, Friends' rights icons, and the
Settings session/reconnect/disconnect cards were only ever present in the
older, stale `GridLink Mobile.dc.html`. Neither file alone was complete.

Before deleting the extra files, all of that was re-merged into
`docs/index.html`, which is now the **one** mockup HTML page:
- Login: GRID LOGIN/OFFLINE toggle, grid picker, connecting → error state.
- Grid picker now also lists **OSgrid** and **Kitely** alongside Agni/Aditi
  — SL's own two grids plus a couple of well-known OpenSim grids, so the
  login screen isn't Linden-only. `connectLogin()`'s failure message reads
  the picked grid's real login host from a new top-level `GRIDS` table.
- Chat's "ALL (n)" chip → Search screen ("FIND RESIDENTS"), reachable from
  there and from Friends' header icons.
- Friends rows carry their `rights` icons (`eye`/`map-pin`/`pencil`) again.
- Settings' Session / Reconnect to grid / Disconnect cards are back.
- Login's grid picker has a "+ CUSTOM" pill (2026-09-17) opening an inline
  ADD CUSTOM GRID form (name + login URI) so a resident can point the
  viewer at any OpenSim grid, not just the four presets. Added grids join
  `s.customGrids` for the session and immediately become a normal
  selectable pill; the Settings Session card and the connect-failure
  message both resolve the picked grid's friendly label/host through a new
  `allGrids()` helper (`GRIDS.concat(s.customGrids)`) instead of assuming
  the built-in table. The form is themed off the same `V.*`/`t.*` tokens
  as the rest of the Login card, so it re-skins correctly across all 6
  layout packs and 24 colour packs — spot-checked on Sweep Console/LCARS
  Amber and Press/Paper & Ink (opposite ends of the palette range) with no
  contrast or layout problems.
- The Sweep Console's top bar now follows the LCARS manifesto's three-tier
  font scale (lcars-terminal.de/tutorial/guideline/font_size.gif — Main
  Title / Sub Header / Normal Data) on the 3D View screen specifically:
  the big bold title (already "Main Title" size) shows the sim name
  (`HELIOTROPE`) instead of the generic "Exterior View", and the small
  telemetry row beneath it (Normal Data size) swaps the grid-link PING/
  SPEED/LAG every other screen shows there for LOC/HEIGHT/PING — the
  region's own coordinates and camera ping. `SIM_NAME`/`SIM_COORD`
  constants feed both this row and the in-scene `cfRegionRead` tag so the
  two can't drift apart.

Two more real, confirmed bugs turned up while doing this (both are a
*template*-level footgun, not a JS one — see "DSL binding limits" below)
and are fixed in `index.html`:
- The Login screen's own "SETTINGS" quick-link button did nothing —
  `onClick="{{ () => this.set('screen','Settings') }}"`. An inline arrow
  function inside `{{ }}` never runs; the fix names it (`loginSettingsPick`)
  in `renderVals()` like every other handler in the file.
- Settings' "Nav Layout" / "Color Palette" `<select>` dropdowns didn't
  change anything — same root cause, `onChange="{{ e => c.onChange(...) }}"`.
  Fixed the same way (`selectChange`, computed per-card).

### DSL binding limits (worth knowing before writing more markup here)

`support.js`'s `{{ }}` evaluator (`resolve()`/`resolvePath()`) is a small
hand-rolled expression parser, not a real JS `eval`. It supports: dotted/
bracket property paths, `===`/`!==`/`==`/`!=` at the top level, `!`
negation, and `true`/`false`/`null`/`undefined`/number/string literals.
It does **not** support arrow functions, ternaries, or general JS
expressions — `{{ () => … }}`, `{{ e => … }}`, and `{{ a ? b : c }}` all
silently resolve to `undefined` (an inert `onClick`) rather than throwing.
Every event handler and every non-trivial computed value must be a named
property on the object `renderVals()` returns, the same way `{{ x.pick }}`
already works everywhere else in the file — never an inline expression in
the attribute itself.

## Remaining before calling this fully done — closed 2026-09-17

Full pass over the re-merged Login/Search/Settings/Friends additions:
a layout×palette×screen click-storm (every pointer-cursor element, all 6
layout packs) came back clean with zero console/page errors, and a visual
spot-check of Login/Settings across all 6 layout packs × 4 non-default
palettes (Neo-Noir Neon, Royal Bronze, Slate Gunmetal, Solarpunk Civic —
spanning the darkest and brightest ends of the palette range) found no
contrast or layout problems with the new grid-choice pills or the Session
card. Not literally all 144 combinations were eyeballed — the sample above
was chosen to cover the extremes a token bug would most likely show up in.

## React port (`docs/react/`)

A hand-authored, buildable React (Vite) web app that reproduces the same
design-canvas prototype as ordinary JSX components instead of the
`.dc.html` file's `x-dc` template DSL (`sc-for`/`sc-if`/`{{ }}` bindings).
Same palettes, same layout packs, same 13 screens, same copy — a
maintainable reference implementation designers and engineers can run with
`npm run dev` without the Design Canvas tooling. See `docs/react/README.md`.

It was built against the old `GridLink Mobile.dc.html`, so unlike this
mockup it already had the Login/Search/Friends-rights/Settings-session
features — but it was missing the shared toast/`notify()` feedback channel
entirely (dialog buttons, header icons, and several card taps were silently
inert) and the Sweep Console's PING/SPEED/LAG readout added above. Both
have since been ported in; see `docs/react/README.md`'s "Known deviations"
section for what's still intentionally simplified.
