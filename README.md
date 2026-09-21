# linkpoint-design

Design mockup for **Linkpoint**, a mobile Second Life/OpenSim viewer —
20 screens × 6 layout packs × 24 colour packs × 5 device sizes, plus the
Second Life system dialogs (permissions, teleport lures, pay, etc.).

- **[`docs/index.html`](docs/index.html)** — the mockup: one HTML file,
  open it directly or serve `docs/` and browse to it. See
  [`docs/ROADMAP.md`](docs/ROADMAP.md) for what it covers and its history.
- **[`docs/react/`](docs/react/)** — a hand-authored, buildable React 18 +
  Vite port of the same prototype as ordinary JSX (`npm install && npm run
  dev`), for engineers who'd rather not touch the mockup's template DSL
  directly.
- **[`docs/mockup-to-react.yaml`](docs/mockup-to-react.yaml)** — the
  translation spec between the two: file-by-file mapping, the binding
  syntax each side uses, and the DSL's binding-evaluation rules (a
  recurring source of silent dead-click bugs if you don't know them).
- **[`tools/sync_todos.py`](tools/README.md)** — pulls the changes that
  landed in [`Kaleaon/React-Linkpoint`](https://github.com/Kaleaon/react-linkpoint)
  (the real app) and schedules them as a checklist in
  [`docs/react-linkpoint-todo.md`](docs/react-linkpoint-todo.md), filed under
  the part of this repo each one implicates. Runs daily in CI; tick a box to
  mark an item done.
