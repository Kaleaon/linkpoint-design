# GridLink Mobile — feature & screen roadmap

Grounded against `memory/PRD.md` and `frontend/` in `Kaleaon1/Linkpoint-redux`
(the real Expo app this mockup designs for) as of 2026-09-15.

## Current state

`docs/GridLink Mobile.dc.html` already covers all 13 screens the mockup set
out to build, across 6 layout packs × 24 colour packs × 4 device sizes:

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

## Remaining before calling this fully done

Full pass over all 144 layout×colour combinations for the five additions
above — they were built and tested against Ink Terminal / iPhone only.
The mockup's pre-existing 13 screens already got this audit; the new
Login/Search/Settings additions need the same treatment before they're
as trustworthy as the rest of the file.

## React port (`docs/react/`)

A hand-authored, buildable React (Vite) web app that reproduces the same
design-canvas prototype as ordinary JSX components instead of the
`.dc.html` file's `x-dc` template DSL (`sc-for`/`sc-if`/`{{ }}` bindings).
Same palettes, same layout packs, same 13 screens, same copy — a
maintainable reference implementation designers and engineers can run with
`npm run dev` without the Design Canvas tooling. See `docs/react/README.md`.
