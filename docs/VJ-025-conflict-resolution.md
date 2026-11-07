# VJ-025 — conflict resolution

**Delivered:** 2026-09-28 · Deps VJ-024 met · Acceptance: *same birth-time
edit on two devices → explicit review; no silent loss*

VJ-024 detects conflicts and deliberately refuses to resolve them. This is
where a person decides.

## The scenario, driven literally

The test is the criterion, not an approximation of it:

1. A phone and a laptop both hold profile `p1` at version 1.
2. The phone corrects the birth time to **10:37** and syncs. Remote is now v2.
3. The laptop, offline until now, corrects the same birth time to **10:42**.
4. The laptop syncs: **conflict**. Nothing is sent, the remote stays 10:37.

From there the two guarantees are checked.

## Explicit review — structural, not intended

`RESOLUTIONS` is a closed set of three, and `resolveConflict` refuses anything
outside it — including `undefined` and `''`. There is **no default**, no
"resolve all", and no automatic merge. A conflict cannot be cleared by doing
nothing, because doing nothing leaves it open.

Conflicts are **durable** (schema v7, `sync_conflicts`). A conflict that lived
only in the drain result would vanish on a page reload, and the fact that two
devices disagree about a birth time is exactly the fact that must not be
losable. The test closes the database and reopens it to prove this.

Recording the same conflict twice is one row: the id is derived from the
operation, resource and remote version, so re-draining does not produce a pile
of duplicate reviews.

## No silent loss — a property of the schema

The losing side is **never deleted**. Both payloads stay in the conflict row
permanently, under every resolution. The test asserts it for each branch, and
it was verified in the running app: after choosing "keep the other device's
edit", the rejected 10:42 is still readable in the record.

That is why it is a schema property rather than a promise about the screen —
no future change to the UI can quietly break it without the test failing.

## The three resolutions

| Choice | Outbox | Why |
|---|---|---|
| `KEEP_LOCAL` | re-based onto the remote version and re-queued | the edit applies next drain instead of conflicting again |
| `KEEP_REMOTE` | blocked, `superseded by remote v{n}` | never sent — but kept in the conflict row |
| `KEEP_BOTH` | re-based, same as `KEEP_LOCAL` | VJ-011 appends revisions rather than overwriting, so accepting the remote and applying the local edit on top leaves both readable in the profile's history |

**Re-basing matters.** Without it, resolving "keep mine" would send the same
operation with the same stale `baseVersion` and hit the identical conflict
again — a loop that looks like the software ignoring the decision. The test
drains after resolving and asserts the operation applies with no second
conflict.

## Why birth fields are singled out

The acceptance names the birth time, and it is the right example. A minute's
difference moves house cusps, can change the lagna outright, and silently
invalidates every reading already given from the old time.

So the diff classifies each field as `birth`, `setting` or `other`; birth
fields sort first, are badged, and trigger a warning above the table. Listing
a birth minute as one row among a dozen buries the only thing that matters.

`affectsChart` covers settings too — an ayanamsha disagreement is not a birth
field but changes the chart just as surely.

**Two different birth times are two different charts, not two halves of one**,
so `mergeable` is false whenever the chart is affected and nothing offers to
combine them.

## A detail worth keeping

The diff reports fields present on only one side. An edit that *removes* a
value is a change, and a comparison that walked only the shared keys would
miss it entirely. `baseVersion` is excluded — it is protocol plumbing, not a
difference a person should be asked about.

## Verified

`npm test` green including `test-sync-conflicts.js`; typecheck at its baseline
of 20. `/sync/conflicts` browser-verified with a real seeded conflict: the
birth-time warning showed, the diff listed `minute 42` against `37`, resolving
moved it to the resolved list, and the discarded value was confirmed still
readable in the database afterwards. Demo data removed.

## Not done

- **Nothing records conflicts automatically.** `drainOutbox` returns them and
  `recordConflicts` persists them, but no caller wires the two together,
  because nothing enqueues to the outbox yet either (VJ-024's gap).
- **No three-way merge.** Only the two sides are compared; the common ancestor
  is not fetched, so a non-chart conflict cannot be merged field by field even
  where that would be safe.
- **`KEEP_BOTH` relies on the server accepting the re-based write.** It does
  not create a second profile revision locally, so "both" means both are in
  history after the sync completes, not immediately.
- Resolved conflicts are listed but there is no way to view the discarded
  payload in the UI — it is in the database, not on screen.
