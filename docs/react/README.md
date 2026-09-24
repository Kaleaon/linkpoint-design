# Linkpoint Mobile — React port

This is a real, buildable React 18 + Vite app that mechanically translates
[`../index.html`](../index.html) — a "Design Canvas" artifact whose UI is
defined with a Mustache-like `x-dc` DSL (`{{ vm.x }}`, `<sc-for>`,
`<sc-if>`, `sc-camel-on-click`) fed by a ~1300-line `render()` that builds
a giant view-model object — into ordinary JSX components with
`useState`/Context. It is **not** a redesign: every in-app palette token,
layout token, screen, piece of copy, and interaction in `index.html` has a 1:1
counterpart here. The GitHub Pages presentation canvas (device bezel, fake OS
status bar, title, notes and the layout/palette/device picker sidebar) is
intentionally excluded from the application build. See
`../mockup-to-react.yaml` for the translation rules this port follows (and
that any future edit to `index.html` should follow too, to keep the two in
sync).

This port was originally built against an older snapshot of the mockup
(`GridLink Mobile.dc.html`, since removed — the project has one HTML
mockup page now, see the repo root README) and has since been brought up
to parity with `index.html`'s current behavior: the shared toast/`notify()`
feedback channel (dialog buttons, header icons, several card taps — all
were silently inert before), the Sweep Console's PING/SPEED/LAG telemetry
row, and its rail wordmark (was still "GRIDLINK") are now ported in too.

Translation key used throughout:

| `.dc.html` DSL | React |
|---|---|
| `{{ x }}` | `{x}` |
| `<sc-for list="{{ list }}" as="item">…</sc-for>` | `{list.map(item => (…))}` |
| `<sc-if value="{{ cond }}">…</sc-if>` | `{cond && (…)}` |
| `sc-camel-on-click="{{ x.pick }}"` | `onClick={x.pick}` |
| `style="{{ x.style }}"` (already a JS object) | `style={x.style}` |

## What's here

```
src/
  main.jsx                 entry point
  App.jsx                  production root (providers + viewport-filling app)
  index.css                application globals and shared animation keyframes
  context/
    AppContext.jsx          state + actions (wraps hooks/useAppState.js)
    ThemeContext.jsx         computed per-render theme package (wraps theme/computeTheme.js)
  hooks/
    useAppState.js           ported `state = {...}` + every instance method
                              (flR/flDrag/flFocus/flToggle/flClose, hudDrag/
                              toggleHud, T/D/navMode, cf/cTap/cHold/cPress, …)
  theme/
    layouts.js                LAYOUTS (6 packs, ported verbatim)
    palettes.js                PALETTES (24 packs) + LEGACY_PALETTES + FAMILIES
    dialogs.js                 DIALOGS (the 6 SL system moments)
    constants.js               DEVICES, FLOATERS, FMENU, SCREENS, CBTN, CSUB,
                                CPAD/CPADR, HUDS, TARGETS, STATES (loading/empty/error copy)
    color.js                   lum/ratio/pickInk (WCAG contrast-aware ink picker)
    computeTheme.js             the "top of renderVals()" — resolves layout+palette
                                 into tokens, nav mode, console geometry, headLook, etc.
    look.js                     card/segment style-builder helpers
  data/
    content.js                 chat transcripts, friend/radar rosters, inventory
                                tree, map regions, profile/login copy, and
                                buildCards() (Friends/Groups/Notices/Teleport/
                                Settings/Diagnostics card lists + their callbacks)
  components/
    ControlPanels.jsx          source reference for the GitHub Pages-only
                                design controls (not imported by the app)
    DeviceFrame.jsx            responsive, borderless application viewport
    MenuBar.jsx, BottomTabs.jsx, TileNav.jsx, RailNav.jsx
    Shell.jsx                  plain (non-console, non-desktop) content shell
    ConsoleFrame.jsx           the LCARS "sweep console" elbow chrome + its
                                own 3D scene (ConsoleScene, internal)
    FloatersDesktop.jsx        desktop window manager (drag/resize/min/close/
                                z-order, taskbar, unfocused-floater previews)
    ScreenBody.jsx             header + segmented tabs + chips + the screen switch
    Header.jsx                 5 header looks (stack/sweep/pivot/rule/editorial)
    SegmentedTabs.jsx, ChipRow.jsx, SplitDetail.jsx, StateBlock.jsx,
    SystemDialog.jsx, Card.jsx, CardList.jsx, Toggle.jsx, Icon.jsx
  screens/
    Chat.jsx, Radar.jsx, Map.jsx, World3D.jsx, Inventory.jsx, Profile.jsx,
    Login.jsx
    (Friends/Groups/Notices/Teleport/Settings/Diagnostics are all the same
    generic CardList fed by data/content.js's buildCards() — exactly like
    the source's `isCards` template branch)
```

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # -> dist/
npm run preview   # serve the production build
```

Verified in this environment: `npm install` (64 packages, network reachable)
and `npm run build` both complete with **zero errors**. The production
bundle was also smoke-tested with a headless Chromium (Playwright): all 13
screens, all 6 layout packs, a spread of colour packs, all 5 devices, all 6
system dialogs (open + close), and the loading/empty/error states were
clicked through with **zero console errors and zero page errors**.
Interaction spot-checks (friend request accept, inventory folder collapse,
settings toggle, desktop floaters) all produced the expected visual result.

## Feature coverage

- All 20 screens render real content: Chat, Friends, Radar, Map, 3D View,
  Inventory, Profile, Groups, Notices, Teleport, Outfits, Objects, Parcel,
  Transactions, Mute List, Settings, Cache, Diagnostics, Login, Search.
- All 6 layout packs (Ink Terminal, Sweep Console, Metro Tiles, Aero Glass,
  Rule & Rail, Press) and all 24 colour packs are selectable from Settings
  and use the exact hex/radius/spacing tokens from the source.
- The form factor follows the browser viewport automatically: phone, foldable,
  tablet and desktop navigation switch without shipping the mockup's manual
  device picker or fixed-size frame.
- Nav adapts per layout pack exactly like the source: bottom tabs, a left
  rail, a bottom tile strip, the LCARS "sweep console" elbow frame (which
  takes over chrome for *every* screen, not just 3D View — see below), and
  the desktop floating-window model.
- Interactive: palette/layout/device/screen pickers, COMFORTABLE/COMPACT
  density, Chat's LOCAL/IM/GROUP segmented tabs + IM/GROUP chip picker,
  Friends' ALL/ONLINE tabs, Diagnostics' AGNI/ADITI tabs, all 6 SL system
  dialogs (open/close), Settings toggles, friend-request accept/decline,
  group notice/invite dismiss, notice quick-reply/mark-read, inventory
  folder expand/collapse, Radar tap-to-open actions + long-press moderator
  menu, 3D View's worn-HUD picker (drag to reposition) + crosshair target
  picker + nav-peek drawer, the Sweep Console's movement pad / fly controls
  / camera drag / dock long-press-to-edit, and the desktop window manager
  (drag/resize/minimise/close/focus/taskbar/menu bar).

## Known deviations from the mockup

- **Nothing is missing from Settings any more.** This port used to skip the
  two `<select>` cards on Settings (Nav layout / Colour palette) because
  `Card.jsx` had no `select` branch at all. It does now, so the expanded
  preferences screen and the Cache screen render identically on both sides.

- **Dead `isSweep` branch omitted.** In the source, `isConsole` is defined
  as `nav === "sweep"` and the separate `isSweep` flag is defined as
  `nav === "sweep" && !isConsole` — which is *always false*, so the
  decorative left "sweepNav" sidebar markup (a plain nav list with a
  wordmark, distinct from the LCARS console frame) can never render in the
  original either. This port skips reproducing that unreachable markup
  rather than adding a dead code path.
- **System dialog buttons close the sheet and post a toast**, matching
  `index.html`'s current `dialog.buttons` mapping. (An earlier version of
  the mockup — and an earlier version of this port — left them decorative,
  with only the header's `CLOSE` working; that's since been fixed on both
  sides.)
- **HUD/target-picker sheets are scoped to the 3D View's own box.** In the
  source these overlay sheets are positioned `inset:0` against a wrapper
  that also contains the split-detail pane (so their `position:absolute`
  technically spans that wider box). Since the split pane never appears
  together with the 3D View screen (`isSplit` only whitelists Chat/
  Inventory/Radar) this is a geometry-only, visually-equivalent
  simplification: the sheets are anchored to the 3D view's own container.
- **`LEGACY_PALETTES` is ported but unused**, exactly matching the source:
  the mockup declares this 7-pack legacy table but its `render()` only ever
  reads from `PALETTES` (24 packs). It's kept in `theme/palettes.js` purely
  for reference/completeness.
- **Module-spec documentation panel ("1b") not ported.** The `.dc.html`
  canvas includes a second static documentation panel next to the live
  prototype (icon modules / shape & density tokens / component anatomy /
  breakpoints) — that's canvas-authoring reference material about the
  design system, not a screen or state of the app itself, so it was left
  out of the app in favor of focusing on the interactive 13-screen
  prototype the task asked for.
- **Desktop floater drag/resize uses `mousemove`/`mouseup` window
  listeners** (ported verbatim from the source's own implementation),
  which means dragging doesn't track a touch pointer — this matches the
  source's own desktop-only, mouse-only design intent (the floater model
  only exists on the "Desktop" device).
