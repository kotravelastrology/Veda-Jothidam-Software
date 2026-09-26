# VJ-011 — chart library repository and profile revisions

**Delivered:** 2026-09-26 · Depends on VJ-006 · Acceptance: *save / reopen /
update version; indexed local search*

## What it is

A local SQLite chart library at `src/library/chartRepository.js`, reached from
the app through `app/library/actions.ts`.

Local-first per **ADR-05**: a file the user owns, no account and no network
for basic desktop use. It deliberately does **not** go through the Flask
backend, whose chart endpoints require a JWT — that would make saving a chart
impossible offline.

## No new dependency

Uses Node's built-in `node:sqlite` (`DatabaseSync`), so the production
dependency count stays at four. This matters while the Swiss Ephemeris licence
position in VJ-007 is open: every dependency added now is one more thing to
inventory later.

**Known risk for VJ-008.** `node:sqlite` is still marked experimental and
Electron ships its own Node build, which may not expose it. The repository is
a single module behind a plain function interface, so swapping the driver for
`better-sqlite3` (MIT) means rewriting one file and nothing else. Confirm
availability during the Electron spike before assuming it carries over.

## Revisions, not overwrites

**ADR-08** requires user data changes to be versioned and recoverable, so a
correction appends rather than destroys:

- `saveProfile()` creates a profile at revision 1.
- `updateProfile()` writes revision *n+1*. Fields not mentioned carry forward.
- `getProfile(id)` returns the latest; `getProfile(id, 1)` reopens the original.
- `listRevisions(id)` shows the history.

This is the difference between rectifying a birth time and losing the reading
that was given last month. The test asserts revision 1 is still readable after
a correction.

## Storage layout

| Table | Holds |
|---|---|
| `profiles` | identity and pointer to the current revision |
| `profile_revisions` | every saved version of a person's details |
| `snapshots` | VJ-006 ChartSnapshots, keyed by content hash |
| `profile_search` | FTS5 index over name, place and note |
| `library_meta` | schema version, for future migration |

`snapshots` is what makes **ADR-07** possible: a report can store a
`snapshotId` and later prove exactly what it rendered, rather than recomputing
and hoping the answer still matches. Snapshots record which revision produced
them, and cascade if the profile is deleted.

## Search

- `search(text)` — FTS5 over name, place and note, prefix-matched. Each term is
  quoted before it reaches `MATCH`, so punctuation in user input cannot form a
  malformed query.
- `searchByBirthDate(from, to)` — range query served by `idx_revisions_date`.

The index tracks the **current** revision: renaming a profile makes the new
name findable and the old one stop matching, which the test asserts in both
directions.

## Where the file lives

`%APPDATA%\VedaJothidam\library.db` on Windows, `~/.local/share/VedaJothidam/`
elsewhere. Outside the repository on purpose, so a `git clean` or a reinstall
cannot delete someone's saved charts. `VEDA_LIBRARY_PATH` overrides it, which
is how the desktop build will point at its own user-data directory.

## Tested

`npm run test:library` covers the acceptance criteria. Reopen is tested against
a **real file on disk** across a close and reopen, not an in-memory database,
because the claim being made is "the data was still there after restarting".
Also covered: missing parent directories, unknown-profile errors, snapshot
round-trip across a restart, FTS injection, and cascade on delete.

## Wired to /client-management

The page the Phase 30 audit found doing CRUD purely in React state — add a
client, refresh, it is gone — now reads and writes this library. Verified in
the browser: a saved client survives a reload, FTS search finds it by place,
and editing produces **v2** with the earlier revision intact rather than
overwriting.

The form collects latitude, longitude and UTC offset alongside the birth date
and time, so a stored client carries a complete birth input and a chart can be
recomputed later without re-entering anything.

## node:sqlite under Next.js

`require('node:sqlite')` fails inside the Next server bundle with *"Cannot
find module 'node:sqlite': Unsupported external type Url for commonjs
reference"* — the bundler tries to resolve the bare specifier. The repository
uses `process.getBuiltinModule('node:sqlite')` instead, which reaches the
builtin at runtime and works identically under plain Node.

Worth recording because the Node tests passed throughout: this only appeared
when the page was actually loaded in a browser.

## Schema v2

v2 added `email` and `phone` for the client view. FTS5 columns cannot be
altered, so the migration drops and rebuilds the index from
`profile_revisions`, which stays the source of truth, inside a transaction so
a failure leaves the library on v1 rather than half-migrated.

The test builds a v1 database by hand and asserts the upgrade preserves rows,
rebuilds the search index over pre-existing data, accepts writes to the new
columns, and is a no-op when reopened. That exercises the migration path
VJ-012 will depend on.
