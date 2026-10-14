# VJ-027 — rare dasha expansion and coverage labels

**Delivered:** 2026-09-28 · Deps VJ-002, VJ-014, VJ-026 met · Acceptance:
*independent worked examples; coverage labels before promotion*

## Reading the criterion literally

PL9 offers about twenty-three dasha systems; this software had four. The
obvious move is to write the other nineteen tables from general knowledge and
ship them, and the gap would close on paper in an afternoon.

But the acceptance does not say "add dashas". It says *independent worked
examples* and *coverage labels before promotion* — it is a verification
discipline, and it was written that way because writing tables from memory is
exactly the defect VJ-003 removed and VJ-018 and VJ-026 found still alive
elsewhere. So this delivers the discipline, applies it to what exists, and
adds only what can be added honestly.

## What a nakshatra dasha actually needs

Three things: the lords in order, the years each holds, and **the rule mapping
the birth nakshatra to the starting lord**.

The first two are widely repeated and arithmetically self-checking. The third
is not, and it is the consequential one. With the right years table and the
wrong start rule, every date the system produces is wrong — and wrong in a way
that looks entirely plausible, because the periods have the right lengths and
the right lords, merely assigned to the wrong person. Nobody reading the
output could tell.

That is why seventeen methods are `DECLARED`: named, with a note saying what
is missing, and with **no table at all**. Entering a guessed table would be
worse than leaving it out, because a table invites use.

## The four levels

| Level | Means | Promoted? |
|---|---|---|
| `VERIFIED` | Source locator **and** an independent worked example that replays exactly | **yes** |
| `SOURCED` | Source locator recorded; no published result reproduced | no |
| `STRUCTURE_ONLY` | Table present, arithmetic self-checks, nobody has read it against a text | no |
| `DECLARED` | Known to exist; deliberately not implemented | no |

Only `VERIFIED` is used without the practitioner asking. `assertPromotable`
refuses anything else unless the caller passes `allowUnverified`, so the
default path cannot emit an unverified method by omission.

The invariants are enforced at construction, not left to reviewers, because
the failure mode is a label drifting upward — a method acquires a table, keeps
its old label, and quietly becomes production output:

- `VERIFIED` without both halves throws. Intending it is not enough.
- `STRUCTURE_ONLY` **carrying a source** throws: the label would understate
  what is known, hiding a promotion that should have happened.
- `DECLARED` with `implemented: true` throws, and vice versa.
- A "source" with no `pageLocus` throws — it locates nothing.

## Where the four existing methods actually stand

| Method | Level | Why |
|---|---|---|
| Vimshottari | **VERIFIED** | BPHS Ch.46 vv.12-16, page-verified, plus the worked example below |
| Kalachakra | SOURCED | காலச்சக்கரம், தில்லைநாயகப் புலவர் — a real, identified edition; no worked example |
| Ashtottari | STRUCTURE_ONLY | Ported from the prior AstrologicLab engine; its note cites BPHS Ch.49 but there is **no `attachSource` stamp** and no verified page |
| Yogini | STRUCTURE_ONLY | Same — a BPHS Uttara quotation in a comment, no stamp |

That audit is the immediate value. Ashtottari and Yogini were sitting beside
Vimshottari as if equal; they are not, and now the screen says so.

## The independent worked example

`fixtures/dashas/vimshottari-chennai-1990.json`. Its expected values were
derived by applying the BPHS rule arithmetically and are written into the
fixture with the working shown — **not** produced by running the engine and
recording the output, which would prove only that the code is deterministic.
The test asserts the fixture carries its derivation, so a recorded-output
fixture cannot quietly replace it.

Deriving it by hand caught two arithmetic slips of my own in the Sun bhukti
row (Saturn and Mercury), which a recorded fixture would have enshrined.

The engine reproduces every figure to within 1e-6 years (about thirty
seconds): birth nakshatra 20, starting lord Sun, balance at birth
**4.570992828** years, all nine mahadasha boundaries, and the nine
sub-periods of the shortened first mahadasha — which are pro-rated against
the balance, not the lord's full six years.

## What was added: Tribhagi

The one rare system that can be built without guessing. Tribhagi is
Vimshottari with each period reduced to two-thirds, so the cycle is 80 years
instead of 120 — and it needs **no start rule of its own**, reusing
Vimshottari's nakshatra lords, which are cited to a verified page. Only the
durations are scaled, and the scaling is stated rather than transcribed.

It is `SOURCED`, not `VERIFIED`: the derivation rests on a cited table, but no
published Tribhagi result has been reproduced.

`nakshatraDashaEngine.js` generalises the family so a future system is a
*table*, not new code. `vimshottariDasha.js` deliberately keeps its own
implementation — it is the one verified method, and rewriting it to share code
with unverified ones would put it at risk for no gain.

A table whose per-lord years do not sum to its stated total is rejected at
construction. That check is real — it catches a transcribed digit — and it is
the only automatic check available for a table nobody has read. It is not
verification: a table can sum correctly and still be the wrong table.

## A side effect worth noting

Giving Kalachakra a proper `pageLocus` made VJ-026's citation scanner fail the
build: the source was not in the registry. That is the anti-drift mechanism
working — VJ-026 had missed it because `kalachakraDasha.js` documented its
source in a header comment rather than an `attachSource` call.

It is registered now, with its rights: a Saraswathi Mahal Library edition,
digitised on the Internet Archive. Publicly readable is not the same as
redistributable, and the part the engine was read against — the 2007
introduction, pp.1-13 — is modern editorial work over an old text. Marked
`UNVERIFIED` with that distinction written down.

The registry is now 6 sources, 32 citations, still 8 `TBD` locators.

## Results

22 methods registered: **1 VERIFIED · 2 SOURCED · 2 STRUCTURE_ONLY · 17
DECLARED**. Visible at `/dasha-methods`, which defaults to showing all with
their labels and can be filtered to the one that is promotable.

## Not done

- **Seventeen methods still need their start rules**, which needs the BPHS
  pages — the same blocker as VJ-026's eight `TBD` locators and VJ-002's
  domain sign-off. Each one closes independently: establish the start rule,
  enter the table, add a worked example, and it promotes.
- **Tajika is not addressed.** The plan item names "rare dasha/Tajika"; the
  Varshaphala module already has Tajika yogas, Mudda and Patyayini, but none
  of them carry coverage labels yet. They should be brought into this register.
- Ashtottari and Yogini are labelled but not fixed; giving them `attachSource`
  stamps and worked examples would promote them.
- The register is not yet consulted by the report builder — a report can still
  render an unverified dasha because nothing calls `assertPromotable` on that
  path.
