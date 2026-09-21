#!/usr/bin/env python3
"""Pull changes from React-Linkpoint and schedule them as a todo list here.

The upstream React app (`Kaleaon/React-Linkpoint`) moves faster than this
design repo. This tool walks the commits that landed upstream since the last
run, files each one under the part of *this* repo it implicates, and writes
them into a markdown checklist (`docs/react-linkpoint-todo.md` by default).

The markdown file is the UI and the store at once: tick a box in an editor or
straight on GitHub, and the next run keeps the tick and files the item under
"Completed". Machine state lives in a `<!-- sync-state ... -->` JSON block at
the end of the same file, so there are never two files to drift apart.

Nothing here talks to the GitHub API or needs a token — it reads the upstream
repo over anonymous git, so it runs the same on a laptop as it does in CI.

    python3 tools/sync_todos.py              # fetch, update the todo file
    python3 tools/sync_todos.py --dry-run    # print what would change
    python3 tools/sync_todos.py --since v1.2 # re-scan from a ref of your choice

See tools/README.md for the full story.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_CONFIG = REPO_ROOT / "tools" / "sync-config.json"

# Record separators for `git log` output: NUL between commits, US between the
# header fields of one commit. Neither can occur in a commit subject. They are
# written as git's own `%xNN` escapes because argv itself cannot carry a NUL.
REC = "\x00"
SEP = "\x1f"
REC_FMT = "%x00"
SEP_FMT = "%x1f"

STATE_OPEN = "<!-- sync-state"
STATE_CLOSE = "-->"

# "- [x] **`a1b2c3d`** subject" — tolerant of the bold markers and indentation
# so a hand-edited line still parses.
ITEM_RE = re.compile(r"^\s*[-*]\s*\[([ xX])\][^`]*`([0-9a-f]{7,40})`")


class SyncError(RuntimeError):
    pass


# --------------------------------------------------------------------------
# git plumbing
# --------------------------------------------------------------------------

def git(args, cwd=None, check=True):
    proc = subprocess.run(
        ["git", *args],
        cwd=str(cwd) if cwd else None,
        capture_output=True,
        text=True,
    )
    if check and proc.returncode != 0:
        raise SyncError(
            "git {} failed ({}): {}".format(
                " ".join(args), proc.returncode, proc.stderr.strip() or proc.stdout.strip()
            )
        )
    return proc


def with_retries(what, fn, attempts=5, log=print):
    """Retry a network git call with exponential backoff (2s, 4s, 8s, 16s)."""
    delay = 2
    for attempt in range(1, attempts + 1):
        try:
            return fn()
        except SyncError as exc:
            if attempt == attempts:
                raise
            log(f"  ! {what} failed (attempt {attempt}/{attempts}): {exc}")
            log(f"    retrying in {delay}s")
            time.sleep(delay)
            delay *= 2


def ensure_mirror(url, cache, log=print):
    """Clone (or refresh) a bare mirror of the upstream repo under `cache`.

    A blobless mirror is enough: every path we report comes out of the commit
    trees, and we never ask git for line counts, so file contents are never
    needed. If the server refuses the filter we fall back to a plain mirror.
    """
    cache = Path(cache)
    if (cache / "HEAD").exists():
        log(f"  fetching into {cache}")
        with_retries("fetch", lambda: git(["fetch", "--prune", "origin"], cwd=cache), log=log)
        return cache

    cache.parent.mkdir(parents=True, exist_ok=True)
    log(f"  cloning {url} -> {cache}")

    def clone(extra):
        if cache.exists():
            shutil.rmtree(cache, ignore_errors=True)
        return git(["clone", "--mirror", *extra, url, str(cache)])

    try:
        with_retries("clone", lambda: clone(["--filter=blob:none"]), log=log)
    except SyncError:
        log("  ! blobless clone unavailable, retrying with a full mirror")
        with_retries("clone", lambda: clone([]), log=log)
    return cache


def rev_exists(mirror, rev):
    return git(["cat-file", "-e", f"{rev}^{{commit}}"], cwd=mirror, check=False).returncode == 0


def read_commits(mirror, branch, since, limit, include_merges, log=print):
    """Return commits on `branch`, oldest first, as dicts with their files."""
    if not rev_exists(mirror, branch):
        raise SyncError(f"branch {branch!r} not found in the upstream mirror")

    fmt = REC_FMT + SEP_FMT.join(["%H", "%h", "%ad", "%an", "%s"])
    args = ["log", "--reverse", "--date=short", f"--format={fmt}", "--name-only"]
    if not include_merges:
        args.append("--no-merges")

    if since and rev_exists(mirror, since):
        args.append(f"{since}..{branch}")
    else:
        if since:
            log(f"  ! {since[:12]} is not in the upstream history any more; "
                f"falling back to the last {limit} commits")
        args += [f"-n{limit}", branch]

    out = git(args, cwd=mirror).stdout
    commits = []
    for chunk in out.split(REC):
        chunk = chunk.strip("\n")
        if not chunk:
            continue
        header, _, body = chunk.partition("\n")
        fields = header.split(SEP)
        if len(fields) != 5:
            continue
        sha, short, date, author, subject = fields
        files = [line for line in body.splitlines() if line.strip()]
        commits.append(
            {
                "sha": sha,
                "short": short,
                "date": date,
                "author": author,
                "subject": subject,
                "files": files,
            }
        )
    return commits


# --------------------------------------------------------------------------
# classification
# --------------------------------------------------------------------------

def glob_to_re(pattern):
    """Translate a path glob to a regex. `**` spans directories, `*` does not."""
    out = []
    i = 0
    while i < len(pattern):
        ch = pattern[i]
        if ch == "*":
            if pattern.startswith("**/", i):
                out.append("(?:.*/)?")
                i += 3
                continue
            if pattern.startswith("**", i):
                out.append(".*")
                i += 2
                continue
            out.append("[^/]*")
        elif ch == "?":
            out.append("[^/]")
        else:
            out.append(re.escape(ch))
        i += 1
    return re.compile("^" + "".join(out) + "$")


def compile_areas(config):
    areas = []
    for area in config["areas"]:
        areas.append(
            {
                "id": area["id"],
                "title": area["title"],
                "targets": area.get("targets", []),
                "patterns": [glob_to_re(p) for p in area["match"]],
            }
        )
    default = dict(config["default_area"])
    default.setdefault("targets", [])
    default["patterns"] = []
    return areas, default


def area_for_path(path, areas, default):
    for area in areas:
        if any(p.match(path) for p in area["patterns"]):
            return area["id"]
    return default["id"]


def should_skip(commit, config, skip_paths):
    author = commit["author"]
    if author in config.get("skip_authors", []):
        return f"author {author}"
    for pattern in config.get("skip_subjects", []):
        if re.search(pattern, commit["subject"]):
            return "subject matches a skip rule"
    if not commit["files"]:
        return "touches no files"
    if all(any(p.match(f) for p in skip_paths) for f in commit["files"]):
        return "only touches ignored paths"
    return None


def dedupe_key(subject, files):
    """Identity of a unit of work, independent of which commit carried it.

    Upstream lands the same change twice fairly often (a branch commit plus
    its squashed re-apply on main). Both are real commits, but they are one
    piece of work, and scheduling it twice just makes the list lie.
    """
    return subject.strip(), tuple(sorted(files))


def build_item(commit, areas, default, skip_paths, commit_url):
    files = [f for f in commit["files"] if not any(p.match(f) for p in skip_paths)]
    counts = {}
    for path in files:
        counts.setdefault(area_for_path(path, areas, default), []).append(path)

    order = [a["id"] for a in areas] + [default["id"]]
    primary = sorted(counts, key=lambda a: (-len(counts[a]), order.index(a)))[0]
    also = [a for a in order if a in counts and a != primary]

    return {
        "sha": commit["sha"],
        "short": commit["short"],
        "date": commit["date"],
        "author": commit["author"],
        "subject": commit["subject"],
        "area": primary,
        "also": also,
        "files": files,
        "url": commit_url.format(sha=commit["sha"]),
        "done": False,
    }


# --------------------------------------------------------------------------
# the todo file: read, merge, render
# --------------------------------------------------------------------------

def read_todo(path):
    """Return (state, ticks) from an existing todo file.

    `ticks` maps sha -> bool as read from the checkboxes, which always wins
    over the stored `done` flag: the checkbox is what a human edits.
    """
    if not path.exists():
        return {"items": [], "last_sha": None}, {}

    text = path.read_text(encoding="utf-8")

    ticks = {}
    for line in text.splitlines():
        m = ITEM_RE.match(line)
        if m:
            ticks[m.group(2)] = m.group(1).lower() == "x"

    state = {"items": [], "last_sha": None}
    start = text.rfind(STATE_OPEN)
    if start == -1 or text.find(STATE_CLOSE, start) == -1:
        # Rebuilding from scratch here would silently drop every tick and the
        # whole Completed history, so refuse rather than quietly lose it.
        if ticks:
            raise SyncError(
                f"{path} lists {plural(len(ticks), 'item')} but has no "
                f"<!-- sync-state --> block. Restore it (git checkout the file), "
                f"or delete the file to rebuild from scratch."
            )
        return state, ticks

    end = text.find(STATE_CLOSE, start)
    blob = text[start + len(STATE_OPEN):end].strip()
    try:
        state = json.loads(blob)
    except json.JSONDecodeError as exc:
        raise SyncError(
            f"{path} has a corrupt <!-- sync-state --> block ({exc}). "
            f"Fix it, or delete the file to rebuild from scratch."
        )
    return state, ticks


def merge(state, ticks, new_items):
    """Fold newly-seen commits into stored state, honouring checkbox edits."""
    items = list(state.get("items", []))
    by_sha = {item["sha"]: item for item in items}

    for sha, done in ticks.items():
        # Checkboxes carry short shas; stored items carry full ones.
        for item in items:
            if item["sha"].startswith(sha):
                item["done"] = done
                break

    seen = {dedupe_key(i["subject"], i["files"]) for i in items}

    added = []
    duplicates = []
    for item in new_items:
        if item["sha"] in by_sha:
            continue
        key = dedupe_key(item["subject"], item["files"])
        if key in seen:
            duplicates.append(item)
            continue
        seen.add(key)
        items.append(item)
        by_sha[item["sha"]] = item
        added.append(item)
    return items, added, duplicates


def render(items, config, areas, default, last_sha, now):
    up = config["upstream"]
    titles = {a["id"]: a["title"] for a in areas}
    titles[default["id"]] = default["title"]
    targets = {a["id"]: a.get("targets", []) for a in areas}
    targets[default["id"]] = default.get("targets", [])
    order = [a["id"] for a in areas] + [default["id"]]

    open_items = [i for i in items if not i["done"]]
    done_items = [i for i in items if i["done"]]

    lines = [
        f"# Upstream todo — {up['name']} → linkpoint-design",
        "",
        "<!-- Generated by tools/sync_todos.py — do not renumber or reformat by hand.",
        "     Tick a box (here or on GitHub) to mark an item done; the next sync keeps",
        '     your tick and moves the item to "Completed". -->',
        "",
        f"Every commit that landed in [`{up['name']}`]({up['url']}) is triaged here",
        "against the parts of this repo it implicates, so the mockup and the React",
        "port can be brought back into step deliberately rather than by memory.",
        "",
        f"- **Upstream:** [`{up['name']}`]({up['url']}) (`{up['branch']}`)",
        f"- **Last change:** {now} — upstream read through "
        + (f"[`{last_sha[:7]}`]({up['commit_url'].format(sha=last_sha)})" if last_sha else "_nothing yet_"),
        f"- **Open:** {len(open_items)} · **Completed:** {len(done_items)}",
        "",
    ]

    lines.append("## Open")
    lines.append("")
    if not open_items:
        lines += ["Nothing outstanding — this repo is level with upstream.", ""]

    for area_id in order:
        chunk = [i for i in open_items if i["area"] == area_id]
        if not chunk:
            continue
        lines.append(f"### {titles[area_id]}")
        lines.append("")
        where = targets[area_id]
        if where:
            lines.append("Mirror into: " + " · ".join(where))
            lines.append("")
        for item in sorted(chunk, key=lambda i: (i["date"], i["short"]), reverse=True):
            lines += render_item(item, titles)
        lines.append("")

    lines.append("## Completed")
    lines.append("")
    if not done_items:
        lines += ["_Nothing ticked off yet._", ""]
    else:
        lines.append(f"<details><summary>{len(done_items)} done</summary>")
        lines.append("")
        for item in sorted(done_items, key=lambda i: (i["date"], i["short"]), reverse=True):
            lines.append(
                f"- [x] **`{item['short']}`** {md_escape(item['subject'])} "
                f"— {item['date']} · [commit]({item['url']})"
            )
        lines.append("")
        lines.append("</details>")
        lines.append("")

    state = {
        "version": 1,
        "generated": now,
        "upstream": {"url": up["url"], "branch": up["branch"]},
        "last_sha": last_sha,
        "items": items,
    }
    lines.append(STATE_OPEN)
    lines.append(json.dumps(state, indent=1, sort_keys=True))
    lines.append(STATE_CLOSE)
    return "\n".join(lines).rstrip() + "\n"


def render_item(item, titles):
    """One checkbox plus a 2-space nested detail list.

    Nested bullets rather than a wrapped paragraph: they render the same on
    GitHub and in a plain editor, and since only the `- [ ]` line carries the
    sha, the detail lines can never be mistaken for items when read back.
    """
    out = [
        f"- [ ] **`{item['short']}`** {md_escape(item['subject'])}",
        f"  - {item['date']} · {md_escape(item['author'])} · [commit]({item['url']})",
    ]
    shown = item["files"][:6]
    rest = len(item["files"]) - len(shown)
    files = ", ".join(f"`{f}`" for f in shown)
    if rest > 0:
        files += f" _(+{rest} more)_"
    out.append(f"  - {plural(len(item['files']), 'file')}: {files}")
    if item["also"]:
        out.append("  - also touches: " + ", ".join(titles[a] for a in item["also"]))
    return out


def plural(count, noun):
    return f"{count} {noun}" if count == 1 else f"{count} {noun}s"


def md_escape(text):
    return text.replace("|", "\\|").replace("<", "&lt;").replace(">", "&gt;")


# --------------------------------------------------------------------------
# entry point
# --------------------------------------------------------------------------

def rel(path):
    """Repo-relative display path, falling back to the absolute one."""
    try:
        return str(Path(path).relative_to(REPO_ROOT))
    except ValueError:
        return str(path)


def emit_action_outputs(**values):
    path = os.environ.get("GITHUB_OUTPUT")
    if not path:
        return
    with open(path, "a", encoding="utf-8") as fh:
        for key, value in values.items():
            fh.write(f"{key}={value}\n")


def main(argv=None):
    ap = argparse.ArgumentParser(
        description="Pull upstream React-Linkpoint changes into a todo list here."
    )
    ap.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    ap.add_argument("--repo", help="override the upstream clone URL")
    ap.add_argument("--branch", help="override the upstream branch")
    ap.add_argument("--output", type=Path, help="override the todo file path")
    ap.add_argument("--since", help="re-scan from this upstream ref instead of the stored cursor")
    ap.add_argument("--limit", type=int, help="cap on commits read when there is no cursor")
    ap.add_argument("--no-fetch", action="store_true", help="use the cached mirror as-is")
    ap.add_argument("--dry-run", action="store_true", help="report only; write nothing")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args(argv)

    log = (lambda *a: None) if args.quiet else print

    config = json.loads(args.config.read_text(encoding="utf-8"))
    up = config["upstream"]
    if args.repo:
        up["url"] = args.repo
    if args.branch:
        up["branch"] = args.branch

    output = args.output or (REPO_ROOT / config["output"])
    output = Path(output)
    cache = REPO_ROOT / config["cache_dir"]
    limit = args.limit or config.get("first_run_max_commits", 40)

    areas, default = compile_areas(config)
    skip_paths = [glob_to_re(p) for p in config.get("skip_paths", [])]

    log(f"Syncing {up['name']} ({up['branch']}) -> {rel(output)}")

    state, ticks = read_todo(output)
    since = args.since or state.get("last_sha")

    if args.no_fetch:
        if not (cache / "HEAD").exists():
            raise SyncError(f"--no-fetch given but no mirror at {cache}")
    else:
        ensure_mirror(up["url"], cache, log=log)

    commits = read_commits(
        cache, up["branch"], since, limit, config.get("include_merges", False), log=log
    )
    head = git(["rev-parse", up["branch"]], cwd=cache).stdout.strip()
    log(f"  {plural(len(commits), 'commit')} to consider since "
        f"{since[:7] if since else 'the beginning'}")

    new_items = []
    for commit in commits:
        reason = should_skip(commit, config, skip_paths)
        if reason:
            log(f"  - skip {commit['short']} ({reason})")
            continue
        new_items.append(build_item(commit, areas, default, skip_paths, up["commit_url"]))

    items, added, duplicates = merge(state, ticks, new_items)
    for item in duplicates:
        log(f"  - skip {item['short']} (same work as an item already listed)")
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    text = render(items, config, areas, default, head, now)

    open_count = sum(1 for i in items if not i["done"])
    changed = (
        not output.exists()
        or substance(output.read_text(encoding="utf-8")) != substance(text)
    )

    if args.dry_run:
        log(f"  [dry run] {len(added)} new item(s); {open_count} open in total")
        for item in added:
            log(f"    + {item['short']} [{item['area']}] {item['subject']}")
        emit_action_outputs(new_items=len(added), open_items=open_count, changed=str(changed).lower())
        return 0

    if not changed:
        log(f"  {rel(output)} is already level with upstream "
            f"({open_count} open); left untouched")
        emit_action_outputs(new_items=len(added), open_items=open_count, changed="false")
        return 0

    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(text, encoding="utf-8")
    log(f"  wrote {rel(output)}: {len(added)} new, {open_count} open")
    for item in added:
        log(f"    + {item['short']} [{item['area']}] {item['subject']}")
    emit_action_outputs(new_items=len(added), open_items=open_count, changed=str(changed).lower())
    return 0


VOLATILE_PREFIXES = ("- **Last change:**", '"generated":', '"last_sha":')


def substance(text):
    """The todo list with its bookkeeping stripped out.

    The timestamp and the upstream cursor move whenever we look at upstream,
    whether or not anything was scheduled. Comparing without them answers the
    only question that matters: did the *list* move? If it did not, the file
    is left alone — so a quiet week produces no commits and no local churn,
    and the cursor simply stays put until there is something to record.
    """
    return "\n".join(
        ln for ln in text.splitlines()
        if not ln.strip().startswith(VOLATILE_PREFIXES)
    )


if __name__ == "__main__":
    try:
        sys.exit(main())
    except SyncError as exc:
        print(f"error: {exc}", file=sys.stderr)
        sys.exit(1)
