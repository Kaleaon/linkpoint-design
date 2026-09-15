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

1. **Resident search screen.** The real app has a dedicated `search.tsx`
   (AvatarPickerSearch cap / mock directory offline, "ADD" sends a
   friendship offer). The mockup's Friends screen has a search header icon
   but nothing behind it. Add a `Search` screen or a full-screen dialog:
   query field, result rows with an ADD action, empty state.
2. **"ALL (n)" scope-picker chip in Chat.** PRD: "IM chips = online friends
   + IM history; Group chips = real groups; 'ALL (n)' chip opens a
   searchable ScopePicker." The mockup's IM/Group chip rows only let you
   pick a specific existing thread — there's no searchable "start a new
   conversation with anyone" entry point. Add an "ALL (n)" chip that opens
   a picker dialog (reuse the Search screen's list UI).
3. **Friend rights icons.** PRD calls out "rights icons" per friend row
   (can-see-online, can-modify-objects, etc. — the classic SL friend
   permissions pair). The mockup's Friends rows show an online dot and an
   "IM" affordance but no rights glyphs. Add a small icon pair per row with
   a tap target for editing rights.
4. **Reconnect affordance outside the dialog.** PRD: "LINK badge (Chat) /
   RECONNECT TO GRID (More)". The mockup has the LINK badge and the
   connection-lost dialog's RECONNECT button, but no persistent
   RECONNECT TO GRID row in Settings/More for reconnecting proactively
   (not just after a drop). Add one row to the Settings card list.
5. **Disconnect / logout.** PRD: More tab has "Disconnect (sends
   LogoutRequest)". Not currently in the mockup's Settings cards — add a
   destructive-styled row.

## Suggested build order

1. Search screen + wire it as the target of Friends' search icon and a new
   Chat "ALL (n)" chip (shared component — one picker, two entry points).
2. Friend rights icons — smallest, self-contained addition to the Friends
   row renderer.
3. Reconnect / Disconnect rows in Settings.
4. Full pass over all 144 layout×colour combinations for the new UI once
   added (the mockup's existing screens were already audited for this;
   new screens need the same pass before calling them done).

## React port (`docs/react/`)

A hand-authored, buildable React (Vite) web app that reproduces the same
design-canvas prototype as ordinary JSX components instead of the
`.dc.html` file's `x-dc` template DSL (`sc-for`/`sc-if`/`{{ }}` bindings).
Same palettes, same layout packs, same 13 screens, same copy — a
maintainable reference implementation designers and engineers can run with
`npm run dev` without the Design Canvas tooling. See `docs/react/README.md`.
