# Linkpoint Mobile — feature & screen roadmap

Grounded against `memory/PRD.md` and `frontend/` in `Kaleaon1/Linkpoint-redux`
(the real Expo app this mockup designs for) as of 2026-09-15.

## Current state

`docs/index.html` — the single mockup page (see "One HTML page" below) —
already covers all 13 screens the mockup set out to build, across 6 layout
packs × 24 colour packs × 4 device sizes:

Chat, Friends, Radar, Map, 3D View, Inventory, Profile, Groups, Notices,
Teleport, Settings, Diagnostics, Login — plus Outfits, Objects, Parcel,
Transactions, Mute List, Search and (since 2026-09-21) Cache.

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

## Desktop floater chrome ignored the layout pack's shape (2026-09-18)

The Desktop device (`d.desk`, 1440×900) renders as its own window-manager
mode — N draggable/resizable floaters plus a File/Edit/View/World/Build/
Help menu bar and a taskbar/dock — instead of the tabs/rail/sweep/tiles nav
every other device size uses. That mode already read colour-pack tokens
(`V.surf`/`V.pri`/`V.outv`/etc., and the `sky1/sky2/gnd/gnd2` scene
gradient) and the layout pack's font (`t.font`/`t.dfont`), but every window,
menu, dropdown and dock button was hardcoded to square corners — the one
place in the app that didn't pick up a layout pack's `rs`/`rp` shape
tokens the way every card, sheet, chip and nav item elsewhere does. Picking
Sweep Console (pill/22-28px rounding) vs. Metro Tiles (0px) vs. Aero Glass
(12-18px) looked identical on Desktop — a "generic screen" regardless of
style pack.

Fixed in both `docs/index.html` (the floaters/fmMenus/flTasks/flTools
blocks in `renderVals()`) and the React port
(`docs/react/src/components/FloatersDesktop.jsx`,
`docs/react/src/components/MenuBar.jsx`): floater windows and the focused
window's content overlay now share `V.rp` (panel radius, clipped via
`overflow: hidden`, with the focused overlay's bottom corners matched to
its window), and the title-bar min/close buttons, menu-bar highlight,
dropdown menu, taskbar buttons and dock buttons all use `V.rs` (small
control radius) — the same tokens every other themed surface in the app
already uses. Verified with a headless-Chromium pass across Metro Tiles
(sharp), Sweep Console (pill), and Aero Glass (soft) on Desktop, including
focusing a floater to confirm the content overlay's rounded corners still
line up with the window frame underneath it.

## Settings review, cache management, crystal loader (2026-09-21)

Three things were asked for: review and expand Settings, fix the screens that
didn't load right, and add the cache-management page that didn't exist.

### Screens that didn't load right

Five of them, all real and all separate causes:

1. **Five screens rendered a blank header band.** `HEAD` in `renderVals()`
   (and `HEAD()` in the React port's `content.js`) had no entry for Outfits,
   Objects, Parcel, Transactions or Mute List, so `HEAD[scr] || ["", ""]` fell
   through to the empty pair and the header drew an empty title + subtitle
   above the card list. Every one of them now has a title and a status line
   like the other screens.
2. **Six screens did nothing at all on Desktop.** `flFocus(id)` raised a
   floater, un-minimised it and set `screen`, but never set `flOpen[id]`.
   Only five floaters start open (Chat, Radar, Friends, Inventory, Map), so
   navigating to Preferences, Groups, Notifications, Places, Profile or
   Statistics on the 1440×900 Desktop device left the scene visually
   unchanged — the window being "focused" had never been opened. `flFocus`
   now opens the window it focuses, in both the mockup and the React port.
3. **Icons with a digit in their name silently rendered nothing.** The
   `pascal()` helper that maps a `data-lucide` name to Lucide's export
   (`icons()` in `index.html`) was `n.replace(/(^|-)([a-z])/g, …)` — it
   uppercased a letter after a dash but left the dash in place before a
   digit, so `volume-2`, `trash-2` and `rows-3` resolved to `Volume-2` /
   `Trash-2` / `Rows-3`, none of which exist, and the row drew with a blank
   icon slot. It now splits on `-` and capitalises every segment.
4. **Two icon names don't exist in the bundled Lucide at all.** Inventory
   asked for `folder-star` (root folder) and `circle-small` (leaf item);
   neither is in `docs/vendor/lucide.min.js`. Swapped for `folder-root` and
   `dot`. A headless pass now asserts every `data-lucide` name on every
   screen resolves.
5. **The rail/console sub-nav under Settings was a dead click.** `CSUB`
   listed LOOK / NETWORK for Settings but `sub[].pick` only had branches for
   Chat and Radar, so both segments were inert. They are now PREFS / CACHE
   and navigate between the two preference screens. The other screens' CSUB
   sub-segments are still decorative — out of scope here, and they at least
   name something the screen really has.

Also fixed while in there: the rail and sweep-console wordmark still read
`GRID LINK`, left over from the pre-rename `GridLink Mobile.dc.html`.

### Settings, expanded

Settings was 17 loose rows mixing session, appearance, notifications and
privacy in no order. It is now ~35 rows under eight headings — SESSION,
APPEARANCE, GRAPHICS & PERFORMANCE, SOUND & VOICE, CHAT & IM, NOTIFICATIONS,
PRIVACY & SAFETY, NETWORK & STORAGE, ABOUT — the grouping a viewer's
Preferences window uses. New rows model what the real viewer exposes: draw
distance, graphics preset, frame-rate cap, avatar complexity limit, shadows,
battery saver, master volume, media autoplay, chat timestamps, IM logging,
translation, typing indicator, online-status privacy, maturity rating and
bandwidth limit.

One of them closes a dangling reference: the Permissions system dialog has
always told the resident that grants "can be revoked from Settings ›
Scripted objects", and no such row existed. It does now, and it opens that
dialog.

Two new card fields carry the expansion:

- `sect: true` — a group heading rendered without card chrome.
- `meter: 0..1` — a usage bar under the body text, tinted by fill level.

The React port's `Card.jsx` also gained `select` support, which it never had
even though the mockup's Settings already used two `<select>` cards.

### Cache management

`Cache` is a new screen (and a new Desktop floater), reached from Settings'
NETWORK & STORAGE section or the PREFS/CACHE sub-nav. It shows total use
against the configured limit, a per-asset-type breakdown (texture, mesh,
sound, inventory skeleton, map tiles, chat logs) with its own meter and
CLEAR button per row, and the policy controls: size limit, location, clear
on exit, rebuild inventory skeleton. Clearing a row zeroes it and the totals
recompute, so the header, the Settings row and the meters can't disagree —
they all read one `cacheRows()` table.

Cache has no nav entry of its own, so it keeps the Settings/MORE nav item
lit (`navActive()` in the React port, `sel()` in the mockup) rather than
leaving the whole nav unhighlighted.

### Loading states use the Linkpoint crystal

Loading used to rotate the screen's own lucide glyph inside its bordered
box (`animation: spin 2.6s linear infinite`) — on Teleport that meant a
spinning `zap` in a spinning diamond, which read as a generic spinner. All
loading states now draw a compact version of the login screen's crystal
instead: two pyramid halves closing into an octahedron with a core that
lights as they meet, in the palette's own colours. Empty and error states
keep their glyph, which carries specific meaning (`inbox`, `plug-zap`,
`cloud-off`). The login logo's own SVG is a ~40 KB SMIL point-interpolation
animation, so this is a small hand-built shape sharing its motion, not a
copy of it; it honours `prefers-reduced-motion`.

### Verification

Headless Chromium, both `docs/index.html` and a production build of
`docs/react/`: every screen visited with zero console/page errors; every
`data-lucide` name on every screen resolves; and a click-storm over
6 layout packs × 5 device sizes × 9 card screens, clicking every
pointer-cursor element in the device frame — 26 218 clicks in the mockup and
18 977 in the React port, zero errors in both.
