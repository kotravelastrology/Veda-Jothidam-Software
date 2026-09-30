# The ten poruthams against a primary text

**Run:** 2026-09-30 · Closes the source gap VJ-018 could only disclose ·
`src/report/poruthamSourceComparison.js` · `fixtures/porutham/choodamani-poruthavial.json` ·
`test-porutham-source.js`

## Why this exists

VJ-018 put a banner on `/porutham` saying the ten rule tables had no source.
They were ported from an earlier screen whose only reference was "the Marriage
reference workbook" — no edition, no page. That was the most that could be said
without a text.

There is one now. The Sūḍāmaṇi Uḷḷamuḍaiyāṉ edition (Thanjavur Saraswathi
Mahal Library, 2007) prints all ten poruthams in its **பொருத்தவியல்**, verses
183–199. It was downloaded into the curated library on 2026-09-29, and this is
the comparison.

## Method

**Every rule was read from the rendered page image, not from OCR.** The scan is
242 pages with printed page = scan page − 25. The OCR text was used only to
*find* passages; each number and star name in the fixture was checked against
the page itself, digit by digit. Nothing in the fixture is `OCR_ONLY`, and the
test asserts that.

The comparison does **not** read our tables. It calls the public `calcPorutham`
over every possible input — all 27×27 star pairs and all 12×12 rasi pairs — and
compares the pass/fail our code would show a client with what the book
prescribes. It measures behaviour, so reorganising the code cannot hide a
difference.

## Result

| # | Factor | Verse · page | Finding |
|---|---|---|---|
| 1 | தினம் Dina | 183–184 · p.78 | **Diverges** — inverted on counts 2–9 |
| 2 | கணம் Gana | 186–187 · p.78 | **Diverges — an error**, 8 stars misclassified |
| 3 | மகேந்திரம் Mahendra | 188 · p.79 | Diverges — book also accepts counts 1 and 20 |
| 4 | ஸ்திரீ தீர்க்கம் | 188 · p.79 | Diverges — book ≥ **13**, ours ≥ 7 |
| 5 | யோனி Yoni | 189–192 · pp.79–81 | **Different model** — not comparable |
| 6 | ராசி Rasi | 192 · p.81 | Diverges — book ≥ 7th; agrees on **48 of 144** pairs |
| 7 | ராசி அதிபதி | 193–194 · p.81 | Diverges — book has a friendship table; 94 of 144 |
| 8 | வசியம் Vasya | 195–196 · p.82 | Diverges — different table; 106 of 144 |
| 9 | **ரஜ்ஜு Rajju** | 197–198 · pp.82–83 | **Matches** — 729 of 729, all 27 stars grouped identically |
| 10 | வேதை Vedha | 199 · p.84 | Diverges — **no pair in common** |

**One of ten matches. Eight diverge. One is not comparable.**

## Reading the numbers — three traps

**The agreement rate misleads for rare-failure factors.** Vedha shows 92.6% and
that is an illusion: nearly every pair passes under *both* schemes, so agreeing
on "compatible" inflates it. The pair sets are what matter — the book prints 15
pairs, this code has 12, and **they share none**. The test asserts the rate is
above 90% *and* that no pair is shared, precisely so the trap stays visible.

**Rasi is worse than chance.** 33.3% agreement on 144 pairs. The book says the
seventh rasi or beyond from the woman's is uttama; this code accepts only the
set {1, 2, 5, 6, 7, 11}.

**Dina is an exact inversion, not a near miss.** For counts 2–9 the book accepts
{2, 4, 6, 8, 9} and rejects {3, 5, 7}. This code rejects {2, 4, 6, 8, 9} and
accepts {3, 5, 7} — every one reversed. (Count 1 is the same-star case, which
the book grades separately by the star's own group.)

## Gana is the one that is an error

Divergence from one text is not proof of a fault: it is one Tamil text, and
practitioners follow others. Most of the above are decisions for the owner.

Gana is different, because it does not depend on trusting the book. The
classical split of 27 stars is **9 / 9 / 9**, and this code produces
**12 Deva · 5 Manushya · 10 Rakshasa**. Eight stars are misplaced:

| Star | Book | This code |
|---|---|---|
| Rohini | Manushya | Deva |
| Ardra | Manushya | Rakshasa |
| U. Phalguni | Manushya | Deva |
| U. Ashadha | Manushya | Deva |
| U. Bhadra | Manushya | Rakshasa |
| Vishakha | Rakshasa | Manushya |
| Jyeshtha | Rakshasa | Deva |
| Anuradha | Deva | Rakshasa |

The *rule* — same gana good, Deva with Manushya acceptable, Rakshasa mixes not
— is identical to the book's, so **every Gana disagreement is a table entry**,
and 30% of star pairs get a different answer because of it. Rohini is among the
most common stars in matching.

## Rajju: the first sourced porutham

Rajju matches on every input, and the book adds something the code does not
show: the consequence differs by band. Foot loses wealth, thigh means a barren
wife, belly means the children die, neck means the husband dies, head means the
wife dies. `RuleEvidence` for Rajju is now `APPLIED`, carrying the verse, the
printed pages and the `+25` offset so the page can be found. The other nine stay
`withheld`, but their reason now says what the book prints rather than "no
source".

## Things the page itself shows that matter

- **The printed Gana commentary lists only eight names each for Deva and
  Rakshasa while saying nine.** The verse supplies the missing Pushya and Magha.
  They are recorded as *inferred from the verse*, not silently added.
- **Anuradha's yoni animal is missing** from the printed commentary, and the sex
  of the two snakes is not stated. A faithful Yoni cannot be completed from this
  edition alone.
- **The Mahendra list prints 20**, which the verse's own arithmetic does not
  obviously give. Recorded as printed.
- **The Dina list ends at 29**, which exceeds the 27 stars, and how the count
  continues past the first ten is not explained. The comparison takes the plain
  reading and says so.
- **The book's elephant enemy is *human*.** The widely repeated 14-yoni scheme
  gives lion. This edition is a variant, which is one reason a divergence from
  it is not automatically a fault.

## What this does not settle

This is **one Tamil text**. The popular rules a practitioner uses may differ from
it, and other texts — a Jātaka Alaṅkāra translation (S.S. Sareen, a rendering of
a Sanskrit work, not a Tamil one) is in the library and unread — may differ from
both. "Diverges" means *no text we hold confirms the rule* — a decision for the
owner about which authority to follow, not a verdict.

Nor were the calculations changed. Clients still see the same scores; what
changed is that the screen now says which of the ten rules the classical text
agrees with, in a banner, a chip on each row, and the verse and page when a row
is opened.

## Decision needed

Which authority should the poruthams follow?

1. **Follow this book** where it is unambiguous — correcting Gana, Rasi,
   Stree Deergha, Vedha, Vasya and Adhipathi to its tables. Rajju already
   matches. Yoni needs a second source for the gaps.
2. **Keep the popular rules** and record them as a documented, cited tradition
   of their own — which needs its own source.
3. **Fix Gana only**, since it is an error under any reading, and leave the
   rest as disclosed divergences pending a decision.

Option 3 is the minimum. It changes results for any pair involving one of eight
stars, so it should be a deliberate change.

## Verified

`npm test` green including `test-porutham-source.js`; typecheck at its baseline
of 20. Browser-verified through the real server path with two saved profiles: a
banner reading *1 matches · 8 diverge · 1 different model*, a coloured chip on
every row, Gana marked *· பிழை*, and the Dina and Rajju rows expanding to their
verse and page. Test profiles removed.

## A side effect

The new citation made VJ-026's scanner fail the build: the source was defined
with `Object.freeze({...})` and the scanner understood only bare object
literals. Freezing a source is the better habit, so the scanner was fixed rather
than the code bent around it.
