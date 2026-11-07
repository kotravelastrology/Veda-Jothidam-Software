# VJ-012 — backup, archive, migration, restore

**Delivered:** 2026-09-26 · Depends on VJ-011 · Acceptance: *blank install
restore; checksum/schema errors; original archive preserved*

## Format: JSON, not a copy of the database file

`src/library/archive.js` writes every profile, revision and snapshot to a
single JSON file. Copying the SQLite file would have been less code, but a
binary copy of a v1 database cannot be inspected, diffed, or restored into a
newer schema. ADR-08 asks for migrations that are versioned and independently
restore-tested, which needs a format that survives the schema moving
underneath it.

```json
{
  "kind": "veda-jothidam-library-archive",
  "archiveVersion": 1,
  "schemaVersion": 2,
  "createdAt": "...",
  "counts": { "profiles": 2, "revisions": 3, "snapshots": 1 },
  "checksum": "sha256 over the canonicalised payload",
  "payload": { "profiles": [...], "revisions": [...], "snapshots": [...] }
}
```

The checksum is taken over a key-order-independent canonicalisation, so
re-serialising the file cannot invalidate it.

## The archive is never written during a restore

`restoreArchive()` opens the archive read-only. A failed restore cannot cost
someone their backup, which matters because the archive is frequently the
only remaining copy. The test asserts this by hashing the archive file before
and after a restore and comparing.

A restore into a library that already holds profiles is **refused** unless
`overwrite` is passed explicitly, so a routine restore cannot quietly replace
live data.

## Failures are named, not generic

"Restore failed" on someone's only backup is not an acceptable message. Each
case says what is wrong:

| Situation | Message |
|---|---|
| File absent | `archive not found: <path>` |
| Truncated or corrupt | `archive is not valid JSON; the file may be truncated` |
| Wrong file entirely | `not a Veda Jothidam library archive` |
| Contents edited | `archive checksum mismatch … (expected abc…, got def…)` |
| From a newer build | `archive holds schema v7, newer than this build (v2); upgrade to restore it` |
| Newer archive format | `archive format v99 is newer than this build (v1)` |

Validation runs **before** anything is written. The test asserts a refused
restore leaves no half-written library behind.

## Older archives restore forward

An archive written at schema v1 restores into a v2 library: the rows land,
and columns that did not exist then arrive as null. The result reports
`fromSchemaVersion` and `intoSchemaVersion` so the caller knows a migration
happened. Tested with a hand-built v1 archive, including that search works
afterwards.

## Restores rebuild the search index

The FTS index is not archived. It is rebuilt from the restored rows, because
an index shipped inside a backup could disagree with the data it claims to
describe. Tested by searching for a restored profile by place and by email.

## Import is transactional

`importAll()` runs in one transaction. A failure part-way rolls back, leaving
the library as it was rather than half-populated.

## Reachable from the app

`app/library/actions.ts` exposes `backupLibrary()`, `inspectBackup()` and
`restoreLibrary()`. Backups default to a `backups/` folder beside the library
in the user's data directory, named `veda-library-YYYY-MM-DD.json`.
`inspectBackup()` validates without writing, for a restore preview.

## Tested

`npm run test:archive`, plus an end-to-end check that **deletes the library
file entirely** and restores it from the archive — the actual disaster case,
not a tidy round-trip.

## Not done yet

No UI calls the backup actions. There is no scheduled or automatic backup: a
user who never triggers one has no archive. Both belong with VJ-015's
workspace shell, where a File menu has somewhere to put them.
