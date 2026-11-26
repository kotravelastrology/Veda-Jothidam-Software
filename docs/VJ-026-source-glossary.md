# VJ-026 — source-aware learning and glossary

**Delivered:** 2026-09-27 · Deps VJ-006, VJ-007 met · Acceptance: *Tamil term
↔ rule ↔ source locator; redistribution rights documented*

## What was on the learning page before

Six invented articles. Titles nobody wrote, publication dates nobody
published, and an attribution to **Dr. K.N. Rao** — a living author — for an
article he had no part in. No entry pointed at a rule in this software or at
any real page in any book.

That is the VJ-003 defect (fabricated content presented as sourced) surviving
in a page nobody had looked at since. It is gone, and the page is now the
thing its name always implied.

## The design: derive, don't retype

A glossary that repeats page numbers is a second copy of what the engines
cite. It drifts the first time a locator is corrected, and then it shows a
reader a page the engine no longer uses — worse than showing none, because it
looks checked.

So the locator is never written in the glossary:

- **`registry.js`** names each source once, with its rights.
- **`citationScan.js`** reads every `pageLocus:` out of the engine tree.
- **`glossary.js`** holds the Tamil term, its meaning, and *which module*
  implements the rule. The page locator is resolved from that module's own
  `attachSource` call at lookup time.

The test asserts `glossary.js` contains no `pageLocus:` literal at all, so the
derivation cannot be quietly bypassed.

When a module cites several sources, the term names a `locusMatch`. If it
matches none — or more than one — lookup **throws**. A term silently bound to
the wrong page is the failure this design exists to prevent, so guessing is
not an option it has.

## Results

27 Tamil terms across 5 sources, covering 29 citations in the engines. Every
citation in the code resolves to a registered source; there are no orphans.

| Source | Terms | Rights |
|---|---|---|
| Brihat Parashara Hora Shastra — R. Santhanam tr. | 12 | RESTRICTED |
| Practical Ashtakavarga — Vinay Aditya | 6 | RESTRICTED |
| IJATET chakra papers, 2022 | 5 | **UNVERIFIED** |
| Panchangam Calculations | 3 | **UNVERIFIED** |
| Traditional convention (no single verse) | 1 | PERMITTED |

## Redistribution rights

Each source carries `status`, `mayShip`, `mayQuoteShort`, the reasoning, and
what would settle it. Three rules are enforced by test:

- Only a `PERMITTED` source may have `mayShip: true`.
- `verified: false` forces `mayShip: false` — an unread licence cannot permit
  anything.
- Anything not `PERMITTED` must say what would resolve it.

**BPHS is RESTRICTED, and the reason matters.** The Sanskrit original is
ancient and out of copyright; the twentieth-century English translation is a
new copyrightable work, and the translation is what the engines were read
against. Citing chapter and verse is not redistribution; shipping the PDF is.

**Two sources are honestly UNVERIFIED rather than assumed open.** The IJATET
papers may well be CC-BY — many such journals are — but an assumption is not a
licence, and if it *is* CC-BY those papers could ship, which is worth
checking. "Panchangam Calculations" has no recorded author at all: a work that
cannot be named cannot have its rights assessed, and that is now written down
instead of implied.

This sits beside VJ-007's ephemeris licence question and takes the same
posture: not cleared means not shipped.

## The finding: 8 locators were never verified

The scan turned up something the inline citations hid. **8 of 29 locators say
`file pages TBD / printed pages TBD`** — they name a chapter and verse but no
page, meaning the rule was transcribed from a chapter reference and never
checked against the printed page:

`rajaYogas` · `wealthYogas` · `lagnaSpecificYogas` · `lunarSolarYogas` ·
`edgeCaseYogas` · `chartQuality` · `doshas` (×2)

All seven modules are from the S11 phases. Their stage records
(`S11-A-RAJA-YOGAS-SOURCE-VERIFICATION-001.md` and siblings) carry chapter and
verse but no page numbers either, and the PDF is not in the repository — so
closing this needs the book, which is VJ-002 work.

Those terms are shown with **⚠ பக்கம் சரிபார்க்கப்படவில்லை** and the reason.
The count is asserted at exactly 8, so a new unverified locator cannot be
added quietly and the number can only come down deliberately.

## A bug the browser caught, again

The first browser load showed:

```
ENOENT: no such file or directory, scandir 'D:\ROOT\src'
```

Next bundles the scanner, and inside the bundle `__dirname` is a placeholder —
the same trap that made `engineVersion()` return `unknown` and gave one chart
two snapshot ids. The root is now resolved from `process.cwd()` first, and a
candidate only counts if it really contains `chart/` and `contracts/`.

That last part matters more than it looks: a wrong root would have scanned
nothing and rendered an empty glossary, which reads as *"this project cites no
sources"* rather than as an error. It throws instead, and the test asserts it.

Node tests were green through all of this. That is four for four in this
project: only a browser load found it.

## Not done

- **The 8 unverified page locators.** Needs the BPHS PDF and someone reading it.
- **IJATET and Panchangam Calculations licences.** One email each, roughly.
- `/references` still serves paraphrased BPHS prose with loose chapter refs
  (`BPHS 2.1-2.15`) that are not tied to any rule or edition. It is a separate
  surface from this glossary and has not been reconciled with it.
- The glossary covers the 27 terms whose rules carry citations. Terms whose
  rules cite nothing — the poruthams, for instance (VJ-018) — are absent by
  construction, which is correct but means the glossary is not a complete
  dictionary of the domain.
