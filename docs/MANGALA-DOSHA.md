# Mangala (Kuja) dosha

**Run:** 2026-10-02 · `/mangala-dosha` · `src/report/mangalaDosha.js` ·
`src/report/mangalaDoshaTables.js` · `fixtures/mangala-dosha/definitions.json` ·
`test-mangala-dosha.js`

Second stage of PL9's "Remedies" group, done in the order the owner gave (Saturn
transit first, then Mangala, then gemstones). It replaces one line in
`doshas.js` — "Mars in 1/2/4/7/8/12 from Lagna or Moon" — cited to "a popular
convention" with no page, and no cancellation rules.

## What the books say: they do not agree

| Source | Houses (from the point of count) | Counted from | Other malefics |
|---|---|---|---|
| **Mansagari**, verse 4 (classical) | 1, 4, 7, 8, 12 | Ascendant | — |
| Vishnu Bhaskar, **chapter summary** (p.94) | 1, 4, 7, 8, 12 | Lagna, Moon, Venus | Saturn, Rahu, Ketu |
| Vishnu Bhaskar, **detailed list** (p.98) | 1, 2, 4, 7, 8, 12 | Lagna, Moon, Venus | Sun, Saturn, Rahu, Ketu |
| Vishnu Bhaskar, **South India** (p.99) | 2, 4, 7, 8, 12 | Lagna, Moon, Venus | as above |
| S.P. Bhagat (p.115) | 1, 2, 4, 7, 8, 12 | Lagna, Moon, "sometimes" Venus | — |

- **The 2nd house is where they split.** The classical verse does not count it;
  the repo's old convention did.
- **Vishnu Bhaskar contradicts himself** four pages apart: five houses and four
  malefics in the summary (printed p.94, the same five as Mansagari), six houses
  and five malefics in the detailed list (p.98). Both lines are kept.
- **"South India takes the 2nd in Lagna's place"** is his statement about a
  regional practice, not a Tamil text. **The Tamil texts held state no Mangala
  rule at all** (Sudamani, Kalaprakasika, Jathaka Alangaram, Kalachakram,
  searched as OCR text; a garbled word could be missed, so this is "not found").
  No Tamil reading is invented.

So five readings are shown, each with its page, and none is called the rule.

## Cancellations: 56 conditions, per source, never merged

Mansagari's cancellation list is **the translator's own gathering** — he says it
is culled from "various savants and sages" and the exceptions are "not
sacrosanct". Bhagat's and Vishnu Bhaskar's lists are practitioners' compilations
too, and they contradict each other: Mansagari says Mars *aspected by malefics*
cancels the dosha, Bhagat says aspected by Sun, Mercury, Saturn or Rahu cancels
it; Vishnu Bhaskar says Jupiter with or aspecting Mars cancels "per the
classics" but "experience shows" it increases the dosha. So every condition is
evaluated under its own book and page (Mansagari 10, Bhagat 13, Vishnu Bhaskar
33), the counts are shown per source, and **no single "cancelled" verdict
exists** — the result has no such field, and the test asserts that.

A condition comes out as:

- **MET / NOT_MET** — the geometry the book states holds, or not.
- **JUDGEMENT** — the geometry holds but the book also says "strong" or
  "powerful" without defining it. Left to the practitioner.
- **NOT_COMPUTED** — an input is missing, with the reason: combustion (no
  threshold in any source), the aspect of Rahu and Ketu (no sourced rule), an
  Ashtakoota score (this software has none — the fabricated one was removed),
  and three conditions whose wording is not clear enough to encode.
- **NEEDS_PARTNER** — it compares two charts.

Two of Vishnu Bhaskar's rules say a combination does **not** cancel (Mars in the
7th of one and the 8th of the other; Mars in the same house in both). They are
flagged as warnings, not counted as cancellations.

## Intensity

Vishnu Bhaskar gives two scales, both shown: a **percentage by the house Mars is
in** (12th 50, Lagna 60, 2nd 80, 4th 80, 7th/8th 100) and a **units table** by
the planet's dignity. The units table was read from the page image and has a
regularity that is independent evidence of a correct transcription: Saturn,
Rahu and Ketu are exactly three quarters of Mars, the Sun half, and the
1/2/12/4 columns half of the 7/8 ones — asserted for every row.

The book does not say how to sum units across planets or points of count, what
dignity row Rahu and Ketu take, or whether "enemy/friend house" means natural or
compound friendship. So units are computed for Mars, Saturn and the Sun (natural
friendship), the nodes are named as not counted rather than given an invented
row, and the page lists what the book left unsaid. Comparing two charts follows
his three statements; "about the same" has no number in the book, so a male
total above the female but under 25% more is reported as that and left to
judgement.

## Two readings the code had to choose, and says so

- **"Non-Manglik"** in Vishnu Bhaskar's item 5 is not defined, and item 5G has
  the non-Manglik partner holding a malefic in the same bhava, which is
  contradictory if it meant "no malefic in those houses". Read here as "Mars is
  not in those houses". Found by a test, stated in the code.
- **Item (iii) of Mansagari** is two alternatives joined by "or" and is split in
  two.

## Remedies

As one book records them (Bhagat, printed p.118): Kumbha Vivah, Vishnu Vivah and
Ashwatha Vivah before marriage; six everyday practices after; a Mangala yantra.
Nothing is computed, no effect is claimed, and no mantra text is reproduced.
Bhagat and Vishnu Bhaskar also disagree about age — marriage "not before 27 to
32" against "the effect is over after 28 is not supported by classics" — and
both are shown.

## Sources

Mansagari vol. II (Vasudev's translation; verse 4 and the translator's notes,
printed pp.794–796) and Bhagat's *Practical Astrological Remedies* were copied
into the curated library with SHA-256s and registered, cite-only. Vishnu
Bhaskar's book was already held; its Chapter 9 is printed pp.94–101 in the
curated scan (one page later than the other copy). Every page used was read as
an image, including the first page of the chapter that gives the five-house
summary.

## Verified

`npm test` green including `test-mangala-dosha.js` (every condition has a case
where it holds and one where it does not, plus the 12 houses under each reading,
the units table's regularity, the Vedic weekday around sunrise and Mars's
retrograde period against a well-known one) and the VJ-026 citation scan;
typecheck at its baseline of 20; the page was checked through the real server
path with two manually entered charts, nothing written to the library.
`test-doshas.js` fails identically on the committed version and is not in the
package test list; it is unrelated and untouched.

## Not done

- The astrological *effect* of each combination beyond Vishnu Bhaskar's per-house
  text (for example Mars + Venus, Moon + Venus) — he lists them, they are not
  encoded.
- Kala Sarpa yoga's effect on marriage, which the same chapter gives.
- The Navamsha and D-30 mitigation (his items 7 and 8).
- Counting from the Bhava chart.

## Book order (owner, 2026-10-03)

"The book with the most explanation first, then the others in order." Words in
each book's Mangala/Kuja section: Vishnu Bhaskar 1,167 (Chapter 9 §VII, printed
pp.98-100; counted from the owner's library index OCR, as the curated scan has
no text layer), Bhagat 899 (Chapter 28, pp.115-118), Mansagari 717 (pp.794-796,
verse 4 with the translator's notes and list). The readings and the per-book
cancellation lists follow that order (`BOOK_RANK` in `mangalaDoshaTables.js`);
within Vishnu Bhaskar, his p.98 section leads, then the p.99 South-India
variant, then the p.94 summary line. All five readings are still shown; none is
called the rule.

## Decision needed

1. **A Tamil source.** None held. If you have one that states the rule, it would
   let a Tamil reading stand beside the English ones.
