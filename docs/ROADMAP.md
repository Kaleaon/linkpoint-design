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

## Gaps found (real app has it, mockup doesn't yet)

Read directly from `frontend/app/login.tsx`, `search.tsx`,
`src/components/scope-picker.tsx`, `(tabs)/friends.tsx`, `(tabs)/more.tsx`
on 2026-09-15 — exact fields/states below, not paraphrased from the PRD.

1. **Login only has one working path.** `login.tsx` has a real GRID
   LOGIN / OFFLINE segmented toggle (offline needs just an avatar name, no
   grid contact) and an Agni/Aditi grid picker, plus busy and error states
   on CONNECT. The mockup's Login screen renders GRID LOGIN as permanently
   "on" and OFFLINE as inert text — no Aditi option, no offline field set,
   no connecting/error condition. Needs: working two-tab toggle that swaps
   the field set, a grid picker (Agni/Aditi), and a busy + error state.
2. **No "start a conversation with anyone" picker in Chat.**
   `scope-picker.tsx` is a searchable full-screen modal (filter box + list,
   friends show an online dot, groups show a group icon) reached from an
   "ALL (n)" chip per the PRD. The mockup's IM/Group chip rows only cycle
   between pre-seeded existing threads — there's no entry point to start a
   new one. Add an "ALL (n)" chip that opens this picker (can share the
   same list UI as item 4 below).
3. **Friends rows have no rights icons.** `friends.tsx` renders three
   specific glyphs per row when set: `eye` (can see me online), `map-marker`
   (can see me on the map), `pencil` (can modify my objects). The mockup's
   Friends rows show only an online dot and an IM affordance. Add the same
   three-icon row (icons already exist in lucide, used elsewhere in the
   mockup).
4. **No resident search screen.** `search.tsx`: query field (min 2 chars,
   debounced), result rows with a state machine per row — idle → ADD
   (pending) → OFFERED (sent) or RETRY (error), and FRIEND (with a chat
   icon) if already friends — plus two empty states ("type a name to
   search" / "no residents match"). The mockup's Friends search header icon
   has nothing behind it. Add this as its own screen or full-bleed dialog
   in the same style as the mockup's 6 existing SL system dialogs.
5. **Settings has no account/session identity.** `more.tsx` leads with a
   session card: avatar name, mode (grid/offline), grid, region, agent_id
   (truncated), and live sim-link state (`LIVE · rx N / tx N` or the error),
   plus a login-message/MOTD line. Below it: a conditional "RECONNECT TO
   GRID" button (only shown when disconnected and reconnectable, with its
   own busy + error state) and a red "Disconnect" row that ends the
   session. The mockup's Settings only has preference cards (layout/colour
   pack, toggles, mute list) — none of this identity/connection block
   exists outside the transient "GRID CONNECTION LOST" system dialog.

## Suggested build order

1. Login toggle + Aditi option + busy/error state — self-contained, no
   dependency on the others.
2. Friend rights icons — smallest change, one row renderer.
3. Search screen (own screen or dialog) — needed by both Friends' search
   icon and item 4.
4. "ALL (n)" Chat scope-picker chip, reusing the Search screen's list/row
   pattern.
5. Settings session card + RECONNECT/Disconnect rows.
6. Full pass over all 144 layout×colour combinations for whichever of the
   above get built (the mockup's existing screens were already audited for
   this; new UI needs the same pass before calling it done).

## React port (`docs/react/`)

A hand-authored, buildable React (Vite) web app that reproduces the same
design-canvas prototype as ordinary JSX components instead of the
`.dc.html` file's `x-dc` template DSL (`sc-for`/`sc-if`/`{{ }}` bindings).
Same palettes, same layout packs, same 13 screens, same copy — a
maintainable reference implementation designers and engineers can run with
`npm run dev` without the Design Canvas tooling. See `docs/react/README.md`.
