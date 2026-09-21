# Upstream sync ledger — Linkpoint-redux

repo: Kaleaon1/Linkpoint-redux
branch: main
path: frontend

> **This repo designs for two unrelated upstream apps. This file tracks one
> of them.** They share no git history and neither references the other, so
> one is not a rename or fork of the other:
>
> | Upstream | What it is | Tracked by |
> | --- | --- | --- |
> | [`Kaleaon1/Linkpoint-redux`](https://github.com/Kaleaon1/Linkpoint-redux) | the Expo app (`frontend/`) this mockup's IA was read from | **this file**, by hand |
> | [`Kaleaon/React-Linkpoint`](https://github.com/Kaleaon/react-linkpoint) | the React/PWA viewer that also pulls `docs/react/` back from here | [`react-linkpoint-todo.md`](react-linkpoint-todo.md), by `tools/sync_todos.py` |
>
> Everything below — the screen map especially — refers to Linkpoint-redux
> only, and every path in it was re-verified against that repo on
> 2026-09-21. Its head was then `de1df0c` (2026-09-09); React-Linkpoint's
> was `7fd305d` (2026-09-21). The quiet side is the one this file tracks,
> so treat a stale date here as "upstream is quiet", not "this file rotted".

## Last sync
date: 2026-09-13T18:05:00Z

### Updated in this project
- Sweep Console rebuilt to LCARS rules: tangent elbow (frame arc + content corner share a centre, uniform 4px gap), dedicated elbow arm, sub-segments off the spine, full-bleed console frame on 3D View.
- 3D View: drag-to-look (heading + pitch with parallax), translucent move pad with ORBIT/MOUSE centre, RUN, HIDE toggle; Firestorm-style custom button dock with long-press edit mode.
- Radar rebuilt: chat-distance range rings, bearing-accurate blips, sorted by metres, tap actions, long-press moderator set, avatars/objects modes.
- All 24 Ktheme presets wired as colour packs grouped by family, every pack raised to AA contrast.

### Previous
- Read every Expo screen (login, chat, friends, inventory, more, radar, settings, diagnostics, scope-picker) and `src/theme.ts` tokens.
- Built `GridLink Mobile.dc.html`: one themed shell, 13 screens, 6 SL system dialogs, adaptive tabs/rail/tiles nav.
- Layered 7 skins from kaleaon/Ktheme preset JSONs (copied into project root) over the existing IA.
- Added modular spec sheet: icon modules, shape/density tokens, component anatomy, breakpoints.

## Sync history
- 2026-09-10 — initial build: 13 screens, 7 skins, modular spec sheet.

## Screen map
| Project screen | Repo source |
| --- | --- |
| Chat | frontend/app/(tabs)/chat.tsx, frontend/src/components/scope-picker.tsx |
| Friends | frontend/app/(tabs)/friends.tsx |
| Inventory | frontend/app/(tabs)/inventory.tsx |
| Radar | frontend/app/radar.tsx — rebuilt with range rings, per-entry actions, object mode |
| Settings | frontend/app/settings.tsx, frontend/app/(tabs)/more.tsx |
| Diagnostics | frontend/app/diagnostics.tsx |
| Login | frontend/app/login.tsx |
| Nav shell / tokens | frontend/app/(tabs)/_layout.tsx, frontend/app/_layout.tsx, frontend/src/theme.ts |
| Map, 3D View, Profile, Groups, Notices, Teleport | new — feature set from memory/PRD.md + brief |

## Theme source
repo: kaleaon/Ktheme (branch main) — themes/examples/*.json copied to project root; all 24 presets now wired as colour packs, grouped into TERMINAL & NEON / CONSOLE & AMBER / METAL & JEWEL / DAYLIGHT.
