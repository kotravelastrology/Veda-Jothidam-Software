# PL9 parity audit — row by row

**Run:** 2026-09-28 · Source: `PL9-Audit-Snapshot-2026-09-26.zip` ·
Rules: `scripts/pl9-parity-audit.js` · Rows: `docs/pl9-parity-rows.json` ·
Report: https://claude.ai/artifact/SJJQSSzTakTXD3tVeMDFCe

## What was compared

The PL9 snapshot is an **inventory of Parashara's Light 9**, not a task list:
979 capture states, 2,051 screenshots, **433 catalogue rows**. Eight of those
are PL9's own `Unused` / `Reserved` worksheet slots, leaving **425 real rows**.

Its `status` column records how thoroughly the *auditor* observed each feature
("Preview பதிவு", "முடிவு பார்த்தது"). It says nothing about this software.

Each row was classified against a repository inventory of **36 routes and 199
modules**.

## Result

| Verdict | Rows | Share |
|---|---|---|
| **BUILT** — implemented and reachable from a route | 168 | 40% |
| **PARTIAL** — calculation without its report, or one variant of many | 116 | 27% |
| **ABSENT** — nothing in the codebase | 131 | 31% |
| **MENU_ONLY** — named in the UI with nothing behind it | 9 | 2% |
| **SUSPECT** — present but known to be wrong | 1 | — |

An earlier module-level estimate in this session put it at 35–40%; the
row-by-row pass gives 40% built, 67% counting partial. The estimate held.

## Built is not verified

`BUILT` means the code exists and a page reaches it. It does not mean the
calculation has a verified source. Separately established this session:

- Only **1 of 22** dasha methods has both a source locator and an independent
  worked example (VJ-027).
- **8 of 32** source citations still read `file pages TBD` (VJ-026).
- The **ten Tamil porutham tables have no cited source at all** (VJ-018).

Parity and correctness are two different audits. This is the first.

## The shape

The calculation core is the strongest part of the product and the paper layer
is the weakest:

- Reports / Calculations **16/17**, Horoscope **11/11**, Varshaphala **19/23**
- Print **0/7**, Astronomy **0/8**, Remedies **0/10**

## The 131 absent rows cluster

Five clusters account for 83 of them, and each closes as one piece of work:

| Rows | Cluster | Blocker |
|---|---|---|
| 28 | Rare dashas (Chara, Sthira, Narayana, Shodashottari…) | The BPHS pages. Registered and deliberately unimplemented in VJ-027: the start rule cannot be established without the text, and a wrong one makes every date wrong while looking plausible. |
| 25 | Solar-return worksheets (annual/monthly/daily, natal and local place, Tithi Pravesh) | Mostly one generalisation of `varshaphala.js`, which covers the annual chart only. |
| 15 | Remedies (Sadhesati, Dhayya, Kantaka, Mangala, gemstones) | No module exists. A whole domain, and the gap Tamil clients notice first. |
| 9 | Print pipeline | **None.** VJ-019 produces a verified PDF with embedded Tamil fonts; no UI calls it. |
| 8 | Astronomy reports | **None.** `siderealPositions.js` already computes what they display. |

## Three defects found

### 1. A fabricated Ashtakoota is live

`src/charts/chart-renderers/CompatibilityMatrix.tsx`, reachable at
`/chart-display` → chart-comparison, shows a 36-guna score. Its own code says
`// Calculate Guna Milan scores (simplified for demonstration)`, and the
formulas are not the Ashtakoota rules:

```
Varna    rashi1 === rashi2 || diff === 6     not the sign's varna
Yoni     (rashi1 + rashi2) % 3               not the animal table
Gana     (rashi1 + rashi2) % 2               not Deva/Manushya/Rakshasa
Maitri   sign distance                       not planetary friendship
Bhakuta  nakshatra count                     not the 12-sign position
```

The VJ-003 defect class, surviving in a component nobody had looked at. It
gives a family a number out of 36 to act on.

### 2. Six menu links 404

`/tools/location`, `/tools/time`, `/tools/rectification`, `/reference/yogas`,
`/reference/nakshatras`, `/reference/karanas`. None exist. `/rectification`
does — the menu points at the wrong path.

### 3. Nine rows are menu entries with nothing behind them

BPHS Sanskrit, Saravali, Hora Sara, Garga Hora, Horoscope Interpretation,
Lordship effects, Change Location, Change Time, Change Time Tool Bar.

Counted separately from ABSENT throughout. A name in a menu is a promise the
product does not keep, which is worse than an honest omission — and it is
exactly what the Phase 30 audit found before.

## Method note

Concepts matching **only** in navigation files (`TopMenuBar.tsx`,
`Sidebar.tsx`, `classicalReferencesData.ts`) were separated rather than
counted as implementations. That single rule is what separates `MENU_ONLY`
from `BUILT`, and it is the lesson of the Phase 30 audit and of the Ashtakoota
above: a menu that names a feature is not the feature.

Re-run with `node scripts/pl9-parity-audit.js`. The rules are one table in
that file; disagreeing with a verdict means editing one line and re-running.

## Suggested order

1. **Remove the fabricated Ashtakoota** — small, and it is currently producing
   marriage scores from invented arithmetic.
2. **Fix the six menu links** — minutes.
3. **Wire the PDF export to a button** — closes most of 9 rows; the hard part
   (Tamil shaping in real PDF bytes) is done and proven.
4. **Astronomy pages** — 8 rows, presentation over existing data.
5. **Generalise Varshaphala to monthly and daily returns** — ~25 rows.
6. **Start the remedies domain** — 15 rows; needs sourcing before coding.
7. **The 28 rare dashas wait on the BPHS pages** — same blocker as the 8
   unverified locators. One session with the book unblocks both.
