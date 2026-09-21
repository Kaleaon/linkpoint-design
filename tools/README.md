# `tools/` — upstream todo sync

`sync_todos.py` pulls the changes that landed in
[`Kaleaon/React-Linkpoint`](https://github.com/Kaleaon/react-linkpoint) — the
real React app this repo designs for — and schedules them as a checklist in
[`docs/react-linkpoint-todo.md`](../docs/react-linkpoint-todo.md), filed under
the part of *this* repo each one implicates.

It exists because the two repos drift in both directions. Upstream already has
`scripts/sync-design.ts`, which copies `docs/react/` **into** React-Linkpoint.
Nothing ran the other way, so upstream work reached this repo only when someone
remembered to go looking. This is that other direction — deliberately as a
backlog rather than as code, because upstream changes can't be mechanically
copied back: a new viewer feature might need a screen in `docs/index.html`, a
token in a colour pack, a note in `docs/ROADMAP.md`, or nothing at all. That
call is a human one; the tool's job is to make sure it gets made.

## Use it

```bash
python3 tools/sync_todos.py              # fetch upstream, update the todo file
python3 tools/sync_todos.py --dry-run    # report only, write nothing
python3 tools/sync_todos.py --no-fetch   # re-file from the cached mirror
python3 tools/sync_todos.py --since 16be9ad   # re-scan from a ref you choose
```

Python 3.8+ and `git`. No dependencies, no `package.json`, no GitHub token —
upstream is read over anonymous git, so it behaves the same on a laptop as in
CI. The mirror is cached in `.cache/react-linkpoint.git` (gitignored).

Other flags: `--repo` / `--branch` to point at a different upstream,
`--output` for a different todo file, `--limit` for the first-run window,
`--config`, `--quiet`.

## How the list behaves

The markdown file is both the UI and the store. **Tick a box** — in an editor
or straight on GitHub — and the next run keeps the tick and moves the item into
`Completed`; untick it and it comes back to `Open`. Machine state lives in a
`<!-- sync-state -->` JSON block at the end of that same file, so there is
never a second file to drift out of step with it.

A run only writes when the *list* moves. The timestamp and the upstream cursor
are excluded from that comparison, so a quiet week leaves the file untouched
instead of producing timestamp-only commits.

Each commit becomes one item, filed under the area holding most of its changed
files, with every other area it touches noted on the item.

## Configuring it

[`sync-config.json`](sync-config.json) holds the upstream coordinates and the
triage rules. The parts worth knowing:

- **`areas`** — ordered path-glob rules mapping upstream paths to an area and
  the files here that mirror it. First match wins, so keep them
  most-specific-first. `**` spans directories, `*` does not. Add a rule
  whenever something lands in `Unclassified`.
- **`skip_subjects`** — **the echo-loop guard.** Upstream's own sync commits
  this repo's `docs/react/` back into its `src/` (e.g. `205b1a1`, *"import
  design & layout work from linkpoint-design"*). Those are our own work coming
  home; scheduling them as work for us would loop forever. If upstream ever
  reworks its sync commit messages, update these patterns to match.
- **`skip_paths`** — lockfiles, snapshots and the vendored `src/design/` copy.
  A commit touching nothing else is dropped entirely.
- **`skip_authors`**, **`first_run_max_commits`**, **`include_merges`**.

Commits with an identical subject *and* an identical file set are treated as
one piece of work (upstream sometimes lands a branch commit and its squashed
re-apply). The match is deliberately strict — upstream also has genuinely
different commits sharing a subject, and those are both real work.

## On a schedule

[`.github/workflows/sync-react-linkpoint-todos.yml`](../.github/workflows/sync-react-linkpoint-todos.yml)
runs it daily at 06:00 UTC — after upstream's own 00:00 sync in the opposite
direction, so a day's round trip settles first — and commits the file when it
moves. It also takes `workflow_dispatch` (with an optional `since` input) and a
`repository_dispatch` of type `react-linkpoint-updated`, so upstream can poke
this repo on push instead of waiting for the next tick:

```bash
curl -X POST -H "Authorization: Bearer $TOKEN" \
     -H "Accept: application/vnd.github+json" \
     https://api.github.com/repos/Kaleaon/linkpoint-design/dispatches \
     -d '{"event_type":"react-linkpoint-updated"}'
```

The script writes `new_items`, `open_items` and `changed` to `$GITHUB_OUTPUT`.
To review the list in a PR rather than committing to the default branch, swap
the commit step for `peter-evans/create-pull-request` gated on the same
`steps.sync.outputs.changed`.
