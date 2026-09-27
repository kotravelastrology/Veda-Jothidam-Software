# VJ-018 — matching and Tamil timing journeys

**Delivered:** 2026-09-27 · Deps VJ-015, VJ-016 met · Acceptance: *two
distinct profiles; factor explanations; location/date/method visible*

Two journeys share one criterion set: marriage matching (`/porutham`) and
Tamil daily timing (`/nallaneram`).

## What the matching screen said before

Ten rows of `{ name, result, note }`. `யோனி · ✗ இல்லை · பெண்: 1, ஆண்: 7`
is not a reason — it is a verdict with a number beside it. Nothing said what
yoni governs, what rule turned 1 and 7 into a failure, or how far that rule
can be trusted. The reader had to supply all three from memory, and a family
sitting across the table cannot.

## Factor explanations

Every row now carries four things, opened by clicking the factor:

- **எதைக் குறிக்கிறது** — what the factor is taken to indicate.
- **விதி** — the rule *as this engine applies it*.
- **இந்த ஜோடிக்கு** — why this pair got this verdict, quoting the quantity it
  was decided on.
- **வேறுபாடு** — where the coded rule departs from how the porutham is
  usually stated. Eight of the ten have one.

`calcPorutham` now emits a `measure` per row — the count, the two group names,
the gap — and `poruthamFactors.js` turns that into the sentence. The
calculator formats no prose and the view invents no reasoning.

## The sourcing position, stated plainly

**None of the ten rule tables has a verified classical source.** They were
ported from the prior AstrologicLab matching screen, whose own note cites
"the Marriage reference workbook" — no edition, no page. Under PLAN-001 that
is `sourceRequired`, so all ten emit `withheldEvidence` and the screen carries
the statement above the table.

The verdicts themselves are *not* withheld. They are a real computation from a
real table, not a fabricated substitute, and hiding them would help nobody.
What must not happen is a reader taking "our software says ✓" for "the
classical text says ✓" — so the software says which of those it means.

## The eight disclosures

Each is a fact about *this code*, read off the tables — never a claim about
what the tradition says, which is exactly what is unverified.
`test-porutham-journey.js` asserts every one against the behaviour it
describes, so a disclosure cannot quietly go stale when a table is edited.

| Factor | Disclosed |
|---|---|
| கணம் | Applied symmetrically, though the file's own note says the poruthams are asymmetric |
| மகேந்திரம் | Dina, Mahendra and Stree Deergha all read one measurement, so they are not independent |
| ஸ்திரீ தீர்க்கம் | A single threshold (≥7); no graded band |
| யோனி | The table holds **9** groups, not the 14-yoni scheme; tested by index adjacency, not an enmity table; the animal names were never ported |
| ராசி அதிபதி | A plain inequality, not naisargika maitri — so a shared lord *fails*. `extendedPorutham.js` in this same repo uses naisargika maitri for another factor |
| வசியம் | Direction-blind; the direction is recorded in `measure` but does not affect the verdict |
| ரஜ்ஜு | All five groups treated alike; no severity by group |
| வேதை | Only 12 pairs (24 stars). Mūla, Śravaṇa and Dhaniṣṭha have no partner and can never fail this factor |

Two of these are worth a decision rather than a note — **ராசி அதிபதி** and
**யோனி** are not simplifications so much as different rules. Resolving them
needs a cited text, which is VJ-002 work.

## Two distinct profiles

Both sides are now picked from the VJ-011 library, with search, and the
workspace's active profile seeds the bride side. A profile chosen on one side
is disabled on the other.

The real guard is on the server, because the UI is not the only caller. A
self-match is refused two ways: same `profileId`, and identical birth details
saved under two names.

This matters more than an ordinary validation error. A chart matched against
itself scores **exactly 5/10 "சாதாரணம்" for every star and sign** — never 0,
never an obvious error. On screen it is indistinguishable from a real,
middling match. The test asserts all 324 combinations.

The active-profile seed is confirmed against the library before it is shown.
That seed lives in browser storage and can outlive the record it names — found
during the browser check, where a deleted profile still showed a green tick
and would have failed only when the match was run.

## Location, date and method visible

Each side prints name, revision, date, time with offset, place, signed
coordinates, and the ayanamsha / house system / node type **read back from the
resolved `ChartContext`** — not from the page's intent. A match shown as
"Lahiri" that ran under Raman is a lie a practitioner cannot detect.

The revision is shown because a rectified birth time changes the match, and
two profiles saved under different ayanamshas can land on different Moon
nakshatras.

## Tamil timing

`/nallaneram` had the same gap in a sharper form: every row it prints is a
*clock time*, cut from sunrise and sunset at one place.

- **The UTC offset was hardcoded to +05:30 while the coordinates were free.**
  Any place outside India produced a full day of wrong times with nothing on
  screen saying so. It is an input now, required rather than defaulted, and
  displayed.
- The ayanamsha was written inline at two call sites. It is now one named
  constant, reported in `context.method`, so the displayed method cannot drift
  from the one in force.
- The weekday is shown with its lord, because all three cycles start there —
  it is method, not decoration.
- Each tab explains what its table is and how this day's sequence was fixed.

### A real defect this surfaced

The Gowri table showed a **31-minute slot followed by a 150-minute one**, in a
table whose entire premise is eight equal parts:

```
08:59–10:29   10:29–11:00   11:00–13:30
```

`fmtHr` rounded the hour and the minute separately. At 11.9999 the hour floors
to 11 while the minute rounds to 60 and wraps to 0 — printing `11:00` for
12:00, losing a full hour. Now it rounds to whole minutes first, then splits:

```
08:59–10:29   10:29–12:00   12:00–13:30
```

The night table crosses midnight correctly too (`22:30–00:00`). The test
asserts the slots chain with no gap and differ by at most a minute, across
Gowri, Choghadiya and Hora. No other site in the repo has this pattern.

## Verified

`npm test` green including the two new files; typecheck at its pre-existing
baseline of 20 errors, none in the files touched.

Checked in the browser, not only in tests — three real bugs in this project
were invisible to tests alone, and two more were here: the stale active-profile
seed and the `fmtHr` hour loss, neither of which any assertion would have
caught before it was seen on screen.

## Not done

- **The ten rule tables still need a cited text** (VJ-002). Everything above
  makes the gap visible; it does not close it.
- `extendedPorutham.js`'s 15 factors have explanations only in the footnote,
  not per row. Its ஆயுள் factor also prints implausible values
  (`பெண்: 8, ஆண்: 141`) and is worth its own look.
- Matching is not yet citable into a consultation record the way VJ-016
  evidence is, though `poruthamEvidence()` returns the right shape for it.
- The workspace's own active-profile bar still shows a deleted profile. This
  page no longer trusts it; the bar itself is VJ-015's to fix.
