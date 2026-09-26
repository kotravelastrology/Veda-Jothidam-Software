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

## Not done yet

The Server Actions exist and are tested, but **no UI calls them**. The obvious
consumer is `/client-management`, which the Phase 30 audit found has CRUD that
lives only in React state, so adding a client and refreshing the page loses
them. Wiring that page to this library is the next step, and is what turns
VJ-011 into something a user can see.
