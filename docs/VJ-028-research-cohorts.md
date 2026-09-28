# VJ-028 — research predicates and saved cohorts

**Delivered:** 2026-09-28 · Deps VJ-011, VJ-014 met · Acceptance: *filter
replay yields same members; sample counts; cancellable query*

A cohort is "the charts in my library where X". The page is `/research`.

## The predicate language

A small, explicitly-typed tree — seven leaf kinds plus `and` / `or` / `not`:

`grahaInHouse` · `grahaInRasi` · `grahaInNakshatra` · `lagnaRasi` ·
`conjunct` · `navamsaRasi` · `sarvaAtLeast`

There is deliberately **no free-text or expression form**. A predicate that
could say anything could not be hashed, replayed, or read back to the
practitioner in words — and every saved cohort is read back in Tamil
(`செவ்வாய் 7ஆம் பாவத்தில் மற்றும் மேஷம் லக்னம்`).

Two refusals are load-bearing:

- **There is no retrograde predicate.** `calculateParashariChart` returns no
  retrograde flag, so one would have to be guessed, and a cohort built on a
  guessed fact means nothing. Every predicate reads a fact the engines really
  compute.
- **Unknown fields are an error, not ignored.** A typo like `houze: 8` would
  otherwise silently widen the cohort while the run still looked successful.

Depth is bounded at 8, so a pathological saved cohort cannot blow the stack.

## Why a cohort declares its own settings

Profiles are saved with the ayanamsha and house system they were cast under.
Asking *"which of my charts have Mars in the 7th?"* across a library where one
chart is Lahiri and another is Raman compares two conventions and calls the
answer a finding — Mars can sit either side of a house cusp depending on
which was used.

So a cohort names **one** set of settings and applies them to every chart. The
cost is that a member's house here may differ from the house its own page
shows, so each member records `settingsMatchProfile`, the page counts the
mismatches, and the screen says so above the results. `settings` is a required
argument: there is no default that would quietly mix conventions.

## Replay

The result carries a **signature** — a hash over the canonical predicate, the
settings, and every member's profile id *with its revision*.

"Same members" is easy to assert weakly: run twice, compare counts. That would
pass even if the cohort had swapped one chart for another. So replay is
checked on the signature, and then the test proves the signature actually
*moves* when the data does — otherwise a stable signature would mean nothing.

Verified in the browser end to end:

| Step | Signature | Page said |
|---|---|---|
| First run, 3 of 4 matched | `d806efac6cb9bb27` | — |
| Replay, nothing changed | `d806efac6cb9bb27` | கையொப்பம் மாறவில்லை — அதே உறுப்பினர்கள் |
| One birth time rectified (v1 → v2) | `e36825623df12021` | கையொப்பம் மாறியுள்ளது |

The member row shows `v2`. A cohort that changed silently would be worse than
one that changed.

Members are sorted by profile id before hashing, so the library's ordering
cannot move the signature. `predicateHash` is key-order independent, so two
predicates that differ only in how their fields were typed are one cohort.

## Sample counts

`total` · `examined` · `matched` · `unmatched` · `failed` ·
`settingsMismatched` · `rate`.

**`failed` is separate from `unmatched` on purpose.** A chart that cannot be
cast is reported with its reason, never counted as a non-match: *"no Mars in
the 7th"* and *"we could not cast this chart"* are different answers, and a
sample count that merged them would understate the rate while looking precise.
The test seeds a profile with an impossible latitude to prove the split.

## Cancellation

The engine takes an `AbortSignal` and checks it **before** each profile's
work, not after, so an abort arriving between profiles stops that one rather
than the next. `QueryCancelled` carries how far the run got. The test asserts
both an immediate abort (`examined: 0`) and an abort partway through
(`0 < examined < total`).

**What is not wired:** a Next server action cannot carry the browser's abort
across the request boundary, so the page has no cancel button that would stop
the server. Adding one that only stopped the client waiting would be a button
that lies. The engine-level cancellation is real and tested; the UI-level one
needs streaming and is not claimed.

## Storage

Schema **v5** adds a `cohorts` table holding the predicate, the settings and
the last run's signature and counts — **never the member list**. Freezing
members would turn a saved question into a stale answer, and the whole point
of a replay is to see what changed.

## Verified

`npm test` green including `test-research-cohort.js`; typecheck at its
pre-existing baseline of 20, none in the new files. Browser-verified against
four seeded profiles, which were deleted afterwards.

## Not done

- No cancel button on the page (above).
- The library is read through `listProfiles({ limit: 5000 })`; a larger
  library would need paging, and the limit is not surfaced in the UI.
- Cohorts are not exportable, and are not included in the VJ-012 archive.
- No cross-cohort comparison (intersection, difference) — each cohort is
  answered on its own.
