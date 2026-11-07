# The ten poruthams against two primary texts

**Run:** 2026-09-30 · Closes the source gap VJ-018 could only disclose ·
`src/report/poruthamSourceComparison.js` · `src/report/poruthamTables.js` ·
`fixtures/porutham/kalaprakasika-poruthams.json` ·
`fixtures/porutham/choodamani-poruthavial.json` · `test-porutham-source.js`

## Why this exists

VJ-018 put a banner on `/porutham` saying the ten rule tables had no source.
They were ported from an earlier screen whose only reference was "the Marriage
reference workbook" — no edition, no page.

Two primary texts have now been read, page by page:

| Role | Text | Where the rules are |
|---|---|---|
| **Authority — the calculation follows it** | *Kalaprakasika*, N.P. Subramania Iyer's English translation, 1982 | printed pp.69–76 (PDF page = printed + 30) |
| **Cross-check** | *Sūḍāmaṇi Uḷḷamuḍaiyāṉ*, Thanjavur Saraswathi Mahal, 2007 | பொருத்தவியல், verses 183–199 (scan page = printed + 25) |

The owner named Kalaprakasika, Jātaka Alaṅkāra, Kumaraswamiyam, Jātaka
Chandrikā, Bṛhat Jātaka and Jātaka Pārijāta as the old marriage-matching books
and said any one of them could serve as the source. Kalaprakasika was the one
that both held the complete tables and was already on disk, so it was made the
authority.

## What the comparison found

The legacy code was wrong against **both** books, not merely different from one.
It was not a tradition difference; it was a set of errors that a second reader
could not have guessed at.

| # | Factor | Was | Corrected to (Kalaprakasika) |
|---|---|---|---|
| 1 | தினம் Dina | **Inverted** — rejected counts 2, 4, 6, 8, 9, which both books call good | 9-position cycle: 2, 4, 6, 8, 9 good; 3, 5, 7 bad; 22nd avoided; 27th only within one rasi; same star graded by the star itself |
| 2 | கணம் Gana | **12 Deva · 5 Manushya · 10 Rakshasa** — 8 stars misplaced | 9 · 9 · 9, as both books give |
| 3 | மகேந்திரம் Mahendra | matched | unchanged: 4, 7, 10 … 25 |
| 4 | ஸ்திரீ தீர்க்கம் | count ≥ 7 — the book's *minority* view | count ≥ 13 |
| 5 | யோனி Yoni | 9 numeric groups + adjacency test — a scheme in **neither** book | 13 animals; the book's printed hostile pairs |
| 6 | ராசி Rasi | accepted only {1, 2, 5, 6, 7, 11}; agreed with the books on **48 of 144** pairs | 7th–12th good, 2nd–6th bad |
| 7 | ராசி அதிபதி | plain "lords differ" test | **unchanged — see below** |
| 8 | வசியம் Vasya | a table in neither book | Kalaprakasika's table |
| 9 | ரஜ்ஜு Rajju | matched | unchanged; all 27 stars grouped identically in both books |
| 10 | வேதை Vedha | 12 pairs, of which only Ashwini–Jyeshtha is in either book | 12 pairs + the Mrigasirsha–Chithra–Sravishta triple; every star now participates |

After the change the code agrees with Kalaprakasika on **every input** for the
nine factors the book states (1,458 star-pair × rasi cases; 132 rasi pairs;
144 for Vasya). `test-porutham-source.js` asserts that, so it cannot drift.

The Gana table was the clearest error: rule and split are the classical ones,
so all disagreement was in the table. Eight stars moved — Rohini, Ardra,
Uttara Phalguni, Uttara Ashadha, Uttara Bhadrapada to Manushya; Vishakha and
Jyeshtha to Rakshasa; Anuradha to Deva. Rohini is among the commonest stars in
matching, so this changes results for many real pairs.

## Where the two books differ from each other

Where they agree the rule is well supported. Where they differ, the code
follows Kalaprakasika and the screen says Sudamani differs; neither is the only
tradition, so choosing between them is the practitioner's call.

| Factor | Kalaprakasika vs Sudamani | Agreement over all inputs |
|---|---|---|
| Gana | same 9/9/9 split | 100% |
| Stree Deergha | both ≥ 13 (K says "beyond the 13th", S "13 or more") | 100% (differs only at exactly 13 if K means 14) |
| Rasi | both 7th–12th good | 100% |
| Rajju | five bands identical star by star | 100% |
| Dina | agree on counts 2–9; differ beyond — S accepts 22 and a list ending 29 | 56.9% |
| Mahendra | S adds counts 1 and 20 | 92.6% |
| Vasya | tables differ in some entries | 88.9% |
| Vedha | **no pair in common** | 91.8% — see the trap below |
| Yoni | S adds sex and different enmities — a different model | not comparable |
| Rasi Adhipathi | K states no rule; S gives a table | not comparable |

So **four factors are agreed by both books, five follow Kalaprakasika alone,
and one has no source.** The screen shows this per row and in a banner; the
figures are computed from the result, never typed into the page.

## Reading the numbers — one trap

**The agreement rate misleads for rare-failure factors.** Vedha shows 91.8%
between the books and that is an illusion: nearly every pair passes under both
schemes, so agreeing on "compatible" inflates it. The pair sets are what
matter, and the two books share **none**. The test asserts the rate is above
90% *and* that no pair is shared, so the trap stays visible.

## What is not settled

- **Rasi Adhipathi has no source.** Kalaprakasika lists each planet's friends
  but states no rule for what the two lords must be; Sudamani gives a
  rasi-by-rasi friendship table. The code keeps the earlier plain test (lords
  differ), and the row says *ஆதாரம் இல்லை*. Its `RuleEvidence` stays `withheld`.
  Making it sourced needs a decision on Sudamani's table.
- **Not modelled, each disclosed on its row:** the pada-level exclusions of the
  second Dina cycle; named "happy" and "unsuitable" star pairs; three Rasi
  exceptions (even-sign 2nd, some 6th-place pairs, lords who are one/friends/
  opposite); the Gana "beyond the 14th" exception; the "at least five of ten
  agree" rule.
- **Stree Deergha boundary.** "Beyond the 13th" may mean 14; the code takes ≥ 13
  because Sudamani says so explicitly. It matters only at a count of exactly 13.
- **Rajju consequences conflict.** For the neck band Kalaprakasika says the
  wife dies, Sudamani the husband; the head band is the reverse. The code uses
  only the shared rule (same band fails) and shows no consequence.
- **The printed Gana commentary lists five Manushya stars** while the split is
  9/9/9; the other four (Uttara Phalguni, Purva Ashadha, Uttara Ashadha,
  Purva Bhadrapada) are what remains once the Deva and Rakshasa lists are
  removed, and Sudamani gives the same four. Recorded as inferred, not silently
  added.
- **Yoni.** The printed hostile list has anomalies: "serpent–mongoose" can never
  apply because no star is a mongoose, and the elephant's enemy is printed as
  the deer. Implemented as printed; recorded in the fixture as anomalies.

## The sources that were and were not found

| Book | Result |
|---|---|
| Kalaprakasika (N.P. Subramania Iyer, 1982) | **held** — the authority |
| Kalaprakasika 1917 print | text only — the same translation, not an independent witness |
| Kalaprakasika, Tamil (Lawley Press) | **unusable** — 303k Devanagari characters, no Tamil, garbled; kept for provenance |
| Jathaka Alangaram (two editions) | text only — names the ten poruthams and defers the rules elsewhere; **not a table source** |
| Kumaraswamiyam | **wrong book** — the archive.org item is a Shaiva-philosophy work; deleted |
| Jātaka Chandrikā | not found under the searched spellings |
| Bṛhat Jātaka, Jātaka Pārijāta | not fetched; not known as porutham-table texts (unverified) |

**Rights.** The list the owner supplied described these as public domain. The
old Sanskrit and Tamil originals may be; the English translation and Tamil
commentary editions held here are modern and probably not. Kalaprakasika is
registered as `RESTRICTED` in `src/sources/registry.js`: it is cited by page,
never reproduced, and the toConfirm note records that the 1917 print's status
needs checking.

## Method

**Every rule the code applies was read from the rendered page image, not from
OCR.** OCR text was used only to *find* passages; each number and star name in
both fixtures was checked against the page itself. Nothing in either fixture is
`OCR_ONLY`, and the test asserts that. Passages that were not read that way —
such as Kalaprakasika's list of named happy and unsuitable Dina pairs on
printed p.70 — are listed under `notModelled` in the fixture and are not
applied.

The comparison does **not** read our tables. It calls the public `calcPorutham`
over every possible input — all 27×27 star pairs, with the two rasis both equal
and different, and all 12×12 rasi pairs — and compares the pass/fail a client
would see with what each book prescribes. It measures behaviour, so
reorganising the code cannot hide a difference.

The runtime tables are **embedded** in `src/report/poruthamTables.js`, not read
from JSON at run time: Next's bundler replaces `__dirname` with a placeholder,
so a runtime file read would fail under the server. The comparison over every
input proves the embedded tables reproduce the verdicts encoded from the
fixtures.

## A correction to an earlier claim

VJ-018 recorded that a chart matched with itself scores "exactly 5/10 for every
star and sign". That was an artefact of the wrong tables. Under the corrected
rules a self-match scores **3 or 4 of 10**, and it is still refused by the
guard (same profile, or identical birth details).

## Verified

`npm test` green including `test-porutham-source.js`,
`test-porutham-journey.js` and `test-tamil-porutham.js`; typecheck at its
baseline of 20. Browser-verified through the real server path with two
manually-entered charts (nothing written to the library): banner *9 from a
book · 4 both agree · 5 follow Kalaprakasika · 1 unsourced*, a chip on every
row, and each row expanding to both books with verse and page. VJ-026's
citation scanner resolves the new Kalaprakasika source.

## Decision needed

1. **Rasi Adhipathi** — adopt Sudamani's friendship table (sourced, but a
   different rule from Kalaprakasika's silence), or keep the plain test and
   leave it disclosed as unsourced?
2. **Where the books differ** — Kalaprakasika is followed throughout. If your
   tradition follows Sudamani on Dina beyond count 9, Vasya or Vedha, say so and
   those rows can be switched, with the choice recorded on the row.
3. **Yoni** — the printed lists carry anomalies (no mongoose star). A second
   witness for Yoni would settle them.
