# Saturn transit — Sade Sati, Dhaiya, Kantaka

**Run:** 2026-09-30 · `/saturn-transit` · `src/report/saturnTransit.js` ·
`src/report/saturnTransitTables.js` · `fixtures/saturn-transit/definitions.json` ·
`test-saturn-transit.js`

First stage of PL9's "Remedies" group (15 absent rows). It answers the question
a Tamil client asks first: *ஏழரைச் சனி நடக்கிறதா?* Gemstones and Mangala are
untouched and are separate stages.

## Two kinds of claim, kept apart

| | What | How it is established |
|---|---|---|
| **Astronomy** | Where Saturn is; when it crosses into a sign; the retrograde re-entries | Computed from the ephemeris by bisection. Checked independently by asking the ephemeris for Saturn's longitude at every boundary reported (within 0.001° of a multiple of 30°). |
| **Doctrine** | Which houses from the Moon are *called* Sade Sati, Ardhashtama, Ashtama, Kantaka | A table read from **rendered page images**, not OCR. Each entry carries its page. |

## What the books say

Counted from the natal Moon's **sign** (1 = the Moon's own sign):

| Condition | Houses | Sources |
|---|---|---|
| Sade Sati | 12, 1, 2 | Vishnu Bhaskar p.142 · Pulippani pp.69, 171 · Shubhakaran §34 — **all agree** |
| Ardhashtama | 4 | Vishnu Bhaskar p.142 · Pulippani p.168 |
| Ashtama | 8 | Vishnu Bhaskar p.142 · Pulippani p.169 · Shubhakaran §34 |
| **Kantaka** | **the books disagree** | see below |

### Kantaka Saturn: four sources, four answers

| Source | Houses |
|---|---|
| Parashara's Light 6.1 manual, glossary p.191 | 4, 7 |
| Vishnu Bhaskar p.142 (IX) | 4, 7, 10 |
| Pulippani pp.168–169 | 4, 7, 8 |
| Pulippani's own introduction, p.69 | 8 only |
| Rath, *Vedic Remedies*, p.170 fn 52 | 1, 8, 10 |

Only houses **4 and 7** are named by three of the four sources, and that pair
was the default until 2026-10-03. The owner then set one rule for every page
that compares books: **the book with the most explanation first**. Words each
source spends on Kantaka Saturn: Pulippani 576 (his 4th, 7th and 8th passages),
Rath 182 (§e and footnote 52), Vishnu Bhaskar 27 (§IX), Parashara's Light 13
(the glossary line). So the conventions are listed in that order and Pulippani's
(4, 7, 8) is the default (`KANTAKA_RANK`). Neither the count nor the length is a
finding about which reading is right.
Kantaka is therefore a selectable, labelled convention — the choice is on
screen, in the result, and in the evidence record. Pulippani contradicts
himself within one book; the software records both readings and says so.

### Recorded, not implemented

K.T. Shubhakaran counts by *degrees* from the Moon's degree (Sade Sati from
330° to 60°, Ashtama 210°–240°, Kantaka 90°–120°), and says himself that he
"slightly disagrees" with the usual view. One author's own variant, so it is
noted on screen and not applied.

## The owner's decision (2026-10-02): show both traditions

Asked which Kantaka convention to follow and whether Tamil sources were wanted,
the owner said to show the methods of **both** the English and the Tamil texts as
sources. So the page no longer asks for a choice it cannot make:

- **All four Kantaka readings are shown at once** — one strip each on the
  timeline and a table (houses, whether it applies now, next period, page). The
  selector still sets which one the headline figures use (default changed on
  2026-10-03, above).
- **A Tamil / English section** sets Saturn's transit as the Tamil text and the
  English books state it, row by row.

### What the Tamil corpus holds — and does not

Searched: *Sūḍāmaṇi Uḷḷamuḍaiyāṉ* (full OCR text), *Jathaka Alangaram* (2007 and
1964) and *Kalachakram*. The owner's library search index returned nothing for any Tamil term tried
(it is built for English text), so it was no help here.

| | Tamil text | English books |
|---|---|---|
| Saturn favourable in | **3, 6, 11** — verse 341 | 3, 6, 11 — Pulippani p.69, Vishnu Bhaskar p.139 |
| Vedha that obstructs each | 12, 9, 5 — verse 342 | 12, 9, 5 — Vishnu Bhaskar p.139 |
| Sade Sati / Ardhashtama / Ashtama / **Kantaka** | **not found** | named, with pages (Kantaka disputed) |
| Anga Sani (Saturn on the body) | verse 344 | not found in the books read |

**The verse and the printed commentary disagree.** Verse 341 reads
"மூன்றே, இருமூன்றே, பத்தொன்றுமா" — 3, 6, and *பத்தொன்று* (ten-and-one) = **11**.
The editor's commentary lists "மூன்றாம், ஆறாம், பத்தாம், பதினோராம்" — four
houses, reading பத்தொன்று as "ten, one". The verse, the three-entry vedha list
and both English books all say three, so the verse is applied and the
commentary's 10th is shown as a disagreement, not followed. Page images:
printed pp.148–150 (scan pages 173–175).

**Because the Tamil text does not name Kantaka at all, it cannot settle which
houses it occupies.** The page says so in a row of its own; no Tamil answer is
invented, and the English readings are not presented as Tamil ones.

### Anga Sani — computed, but labelled

Verse 344 divides Saturn's stay over the body, 27 portions in all, and the
commentary says all such tables are counted "from the birth star to the star
where the planet stands". Every planet's table in the chapter sums to 27, which
is what makes a nakshatra count the right reading (Saturn crosses 27 nakshatras
in about 29.5 years). The text does **not** say in what order the portions are
counted, nor whether the birth star is 1. For the Sun, Mars and the benefics the
printed order runs head to foot, so the printed order is applied, but Saturn's
printed order (mouth, right hand, legs, left hand, stomach, eyes, shoulder, head)
is not anatomical. So Anga Sani carries the status `ORDER_ASSUMED`, is shown with
its three assumptions listed, and its evidence is `withheld` — computed and
visible, but not claimed as an applied rule. This is the same posture as an
unsourced porutham factor.

## Findings worth knowing

- **Sade Sati is not 7½ years.** The books say 90 months. Measured across all
  twelve Moon signs over a century, a span is **6.4 to 8.9 years**, mean 7.8
  (45 complete cycles). Saturn's orbit is eccentric and it is slowest through Scorpio,
  Sagittarius and Capricorn, so Moon signs Scorpio–Capricorn run 8.2–8.9 years
  and Taurus–Cancer about 7.1 (one Gemini cycle is 6.4). Retrograde re-entries add to it. The result shows
  the book's 90 months beside the real figure.
- **Retrograde is common, not exceptional.** 27 of 104 sign changes in 125 years
  were Saturn coming back across a boundary. A span can therefore hold two or
  three separate stays in the same house, and up to about a year (366 days at most, measured) stepped out of the three houses. All of it is shown, not smoothed away.
- **Cycles are about 21–23 years apart** (20.9 to 22.8 measured).
- Capricorn Moon: Sade Sati 26 Jan 2017 to 29 Mar 2025 — the widely reported
  Lahiri ingresses. Those two dates are *not* from a source we hold; the test
  uses them as a sanity check on the ephemeris only.

## Conventions this code chooses, and says so

1. **Sign-based**, as every source does except Shubhakaran's variant.
2. **Cycle numbering starts at birth.** A cycle already running at birth is the
   first, flagged "in progress at birth". The book characterises three cycles
   (painful / mediocre / harsh); a fourth gets no text rather than an invented
   one.
3. **Two stays belong to one span if under two years apart.** Retrograde dips
   last months; the real gap between cycles is over twenty years.
4. **Vishnu Bhaskar's sign-wise arishta table** is carried per cycle. Five of
   its twelve rows have a second clause that could be read as a subset of the
   first ("1st 5 yrs. – Middle 2½ yrs are specially bad"); the reading is ours
   and those rows are marked uncertain on screen.

## Remedies

Recorded practices, with pages, from two books:

- **Rath p.170:** recite an extract of Shri Rudram eleven times each morning,
  after bathing, facing east (for Kantaka Sani).
- **Shubhakaran §34:** a Shani verse 11 times daily during the transit; or a
  Rudram extract 11 times daily for 40 days, with puja of Rudra and a homa on the
  41st day.

Nothing is computed for them and no effect is claimed. **The Sanskrit text of the
recitations is deliberately not reproduced** — a transcription made here could
differ from the printed one, and the books are in copyright.

## Sources

Four books were copied into the curated library (`SOURCE-CATALOGUE.md`,
"Saturn-transit sources"), each with a SHA-256: Pulippani's *Gochar
Phaladeepika*, the Parashara's Light 6.1 manual, Rath's *Vedic Remedies* and
Shubhakaran's *Nakshatra based predictions* part 1. Vishnu Bhaskar's book was
already held. All are modern, in copyright, and cite-only; the registry says so.

**A pagination trap:** the two copies of Vishnu Bhaskar's book paginate one page
apart (Sade Sati is on printed p.141 in one, p.142 in the curated scan). The
citation gives the curated copy's page and names the other.

**Not read:** the Parashara's Light *9* wording. Only the 6.1 manual is held; its
glossary is what defines Kantaka Saturn there. Whether 9.0 agrees is unverified.

## A bug found on the way

`solarReturns.js` passed `ayanamsha` to `calculateChart`, which reads
`ayanamsa`. The key was ignored, so **every solar-return crossing was found under
Lahiri whatever ayanamsha was chosen** — silently, because Lahiri is also the
default. Raman sits 1.4° past Lahiri, so a return under Raman was off by about a
day and a half. Fixed, with a regression test that fails on the old line
(`got 0.000`) and passes on the fix. The same argument is asserted for Saturn.

## Vedha and Vipareetha Vedha (added 2026-10-03)

`src/report/gocharaVedhaTables.js`, `src/report/saturnVedha.js`, section
"வேதை, விபரீத வேதை" on the page.

- **The tables.** Pulippani ch.22 (printed pp.204–206) prints Gochara Vedha
  (good results obstructed) and Vipareetha Vedha (bad results cancelled) for all
  nine planets. Both are encoded as printed. The vipareetha table should be the
  gochara table read backwards, and the test confirms it is, except where the
  print departs: Jupiter's "S" (read 8) and Venus's last two pairs, which are
  swapped against the gochara table. Both recorded, not corrected.
- **Saturn.** Good in 3/6/11, obstructed by a planet in 12/9/5 (not the Sun —
  Pulippani and Vishnu Bhaskar). Bad in 12/9/5, relieved by a planet in 3/6/11.
  Saturn in the 1st, 2nd, 4th, 7th, 8th and 10th has no relieving house: "evil
  effects of this will be felt". Pulippani's example: Saturn 12th, Jupiter 3rd
  — Saturn's evil is not felt for the year Jupiter is there (it happens for 6
  Moon-sign cases in 2024–2056). During Sade Sati with Jupiter not in the 3rd,
  the fast planets passing Saturn's own sign bring "more ordeal": computed too.
- **Tamil.** Sudamani verse 343 states the reversal ("கொடியவரும்
  நலங்கொடுப்பர் — விபரீதமான") and its commentary says to read every planet's
  pairs that way; for Saturn that gives the same pairs from verse 342. The two
  traditions differ on the effect: Pulippani says Saturn's evil "will not be
  felt", Sudamani says even a cruel planet "gives good". Both shown. The same
  verse says when in a sign each planet gives its results (Saturn and Moon at
  the end); "the end" is not quantified, so no window is computed.
- **The Sun.** Excluded for both. Pulippani's vipareetha list names only "no
  vipareetha vedha to the Sun by Saturn", but Jataka Parijata (vol. III, printed
  p.834, notes to Adhyaya XIII sloka 60, page image read 2026-10-03) states the
  rule generally: "the Sun and Saturn do not affect each other through Vedha";
  Vishnu Bhaskar and Pulippani's gochara table agree. The book was copied into
  the curated library and registered (cite-only). The Sun's windows are listed
  for information only and kept out of the totals.
- **Choices stated on the page.** The Moon
  passes a sign in ~2¼ days monthly: counted, not listed. Rahu and Ketu count
  ("any other planet"; mean node). Window: two years back, thirty ahead.

## Result text for every house (4th, 7th, 8th first; the rest added the same day, 2026-10-03)

`src/report/saturnHouseResults.js`, section "சனி ஒவ்வொரு இடத்திலும் — நூல்
சொல்லும் பலன்" (the house Saturn is in now opens first). Pulippani gives three
separate passages, condensed into Tamil: the main reading (printed pp.168–172,
houses 4–12), *Sundarananda Jyotisha Kavya* with a waxing- and a waning-Moon
reading (pp.172–175, all twelve), and the result for each of Saturn's 1st, 2nd
and 3rd rounds (*Sani Paryaya*, pp.231–234, all twelve; the 3rd round's 10th–12th
point back to the main reading). Each lived period is given its round. The 9th
keeps both traditions the book records: "ancient Tamil texts" (Raja Yoga) and
"traditional Sanskrit texts" (bad), with its own conclusion "moderate".

- The round is counted the way the book's own Jupiter example does it (printed
  p.236: Jupiter in Gemini at birth — "when he passes through Taurus, the
  paryaya will end"): a round starts in the planet's sign at birth and ends with
  the sign before it. So a period's round is 1 + the number of times Saturn has
  come back into its birth sign before the period begins. That is usually the
  n-th passage through the house, but not when Saturn retrogrades out of its
  birth sign just after birth (a 1985 birth: Scorpio → Libra, May–Sep 1985):
  that short Libra stay and Libra's regular passage in 2011–14 are both round 1.
  The book's definition is applied; the test re-derives it from daily samples
  and lists the cases where it differs from the passage count. The Saturn
  passage gives no example of its own.
- Sundarananda's print says "waxing" for both readings in every house except
  the 6th (where the second is "waning"); read as waxing/waning and flagged. It
  also numbers the 3rd-house heading "1" and calls the 10th-house heading
  "Jupiter". Which fortnight is meant the book does say (printed p.86, preface):
  the fortnight running at the time — so the page shows today's paksha, tithi
  and next turn, and marks the paragraph that applies when Saturn is in that house.
- The book's own parts disagree: the main reading calls the 8th the worst place
  after Sade Sati; the 2nd-round text for the 8th says "gain of money".
- The scan lacks printed pp.148–167, so the main reading's 1st–3rd houses are
  not available.

## Not done

- **Ashtakavarga / Kakshya refinement of Sade Sati** (Vishnu Bhaskar §XVII).
- **Vedha for the other planets** — the tables are encoded; only Saturn is computed.
- **Counting from Lagna** and Arudha Lagna (Rath).
- **Tamil-tradition names** for the three phases, which are not in any Tamil book held (the Sudamani chapter was searched; it has Anga Sani instead).
- **Gemstones, Mangala, mantras by planet** — separate stages.

## Decision needed

Answered 2026-10-02: show both traditions, and all Kantaka readings, as
sources. Still open:

1. **The Anga Sani order.** If a Tamil practitioner or a second Tamil text can
   say in what order the portions are counted, `ORDER_ASSUMED` can become a
   sourced rule. Until then it stays labelled.
2. **A Tamil source for Sade Sati and Kantaka by name.** None of the Tamil texts
   held names them. If the owner has one (the earlier list included Jataka
   Chandrika and Kumaraswamiyam, neither of which could be found), it would let
   the Kantaka houses come from a Tamil authority.

## Verified

`npm test` green including `test-saturn-transit.js`, `test-solar-returns.js`
and the VJ-026 citation scan; typecheck at its baseline of 20. Browser-checked
through the real server path with a manually entered chart (nothing written to
the library): the timeline, three cycles with retrograde re-entries, the current
state, and the convention selector changing the Kantaka row and label.
