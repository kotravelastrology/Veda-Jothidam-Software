# VJ-013 — separating cache from records

**Delivered:** 2026-09-27 · Deps VJ-011 met · Acceptance: *cache purge cannot
remove charts/notes; quota failure visible*

## The classification

| Kind | What | Purgeable |
|---|---|---|
| **Records** | profiles, revisions, consultations, cited evidence, journal entries, imports, unsent drafts | **Never** |
| **Cache** | uncited chart snapshots, the FTS search index | Yes |

Drafts are records, not cache. An unsent draft is unfinished work someone
typed; VJ-022 exists to recover it after a crash, and a cleanup that discarded
it would defeat that.

## The subtle case: a cited snapshot is not cache

A `ChartSnapshot` is derived data — it can always be recomputed from the input
and settings, which makes it look disposable. But ADR-07 makes a report a
*snapshot rendering*, and VJ-022 binds a consultation to a `snapshotId` so a
past reading still says what it was about after a birth time is rectified.

So `purgeCache()` protects any snapshot a consultation cites and removes only
the rest. The test populates both kinds and asserts the cited one survives
while the loose one goes.

## Purge cannot remove records

`purgeCache()` touches exactly one table and reports `recordsRemoved: 0` so a
caller cannot mistake it for a data reset. `purgeCache({ dryRun: true })`
reports what *would* go without writing.

The test compares the full record census before and after a purge with
`deepEqual`, then reads each record type back individually — the chart, a
superseded revision, the consultation's notes, the journal entry, the unsent
draft, the import history and the search index. A purge that quietly took any
of them fails here rather than in someone's practice.

## Quota failure is visible

`src/workspace/persistentStore.ts` replaces the usual `catch {}` around
`localStorage`. Writes return a `StoreResult`, quota errors are recognised by
name *and* by the numeric code browsers disagree on, and `WorkspaceProvider`
puts the failure in context state where `ActiveProfileBar` renders it.

This fixed a defect in my own VJ-015 code, which swallowed the exception:
preferences would silently stop persisting and the user would only find out
after a restart.

The message says what was lost and what was not:

> Browser storage is full, so this preference was not saved. Clearing site
> data for this app will free it; your charts and notes are stored separately
> and are unaffected.

That last clause is the point of this whole item. Records live in SQLite;
browser storage holds only preferences.

### Verified in the browser, including a surprise

Filling `localStorage` to a genuine `QuotaExceededError` (~50 MB) and then
saving a client **worked** — proof that records are independent of browser
storage.

The banner did *not* appear, and that turned out to be correct rather than a
bug: replacing an existing 205-byte key needs no new quota, so the workspace
write genuinely succeeded. There was nothing to report. The reporting path was
then verified by making `setItem` throw the exact `QuotaExceededError` shape a
full browser throws, which produced the banner with the message above. The
stub was removed and the ~215 filler keys cleaned up afterwards.

`storageReport()` exposes the file size and per-table counts so pressure is
visible *before* a write fails, rather than only after.

## Not done yet

No UI calls `purgeCache()` or `storageReport()`; both belong in a Tools or
Storage screen alongside the backup controls still outstanding from VJ-015.
The `src/deployment` and `src/notifications` modules also write to
`localStorage` with swallowing catches, but nothing mounts them today.
