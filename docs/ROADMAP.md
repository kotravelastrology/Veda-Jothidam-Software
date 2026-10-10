# Roadmap — finishing the Codex implementation plan

**Updated:** 2026-09-28 · Source: `Veda-Jothidam-Implementation-Plan-2026-09-26`
· **24 of 30 delivered, 6 remaining**

---

## Delivered (24)

| ID | What | Record |
|---|---|---|
| VJ-001 | Route → engine matrix | `docs/VJ-001-route-engine-matrix.md` |
| VJ-002 | Versioned fixtures with recorded baselines | `fixtures/README.md` |
| VJ-003 | Random predictions removed; sourced-outcome contract | commit `184b3df` |
| VJ-004 | Divisional charts on authoritative varga output | commit `184b3df` |
| VJ-005 | Proxy fallbacks replaced with structured errors | commit `184b3df` |
| VJ-006 | CalculationRequest / ChartSnapshot / RuleEvidence | commit `803ba9c` |
| VJ-007 | Ephemeris licence inventory (decision **deferred**) | `docs/VJ-007-…md` |
| VJ-008 | Windows Electron native worker proof | `docs/VJ-008-…md` |
| VJ-011 | Local chart library with profile revisions | `docs/VJ-011-…md` |
| VJ-012 | Backup, archive, restore | `docs/VJ-012-…md` |
| VJ-013 | Cache policy and storage records | `docs/VJ-013-…md` |
| VJ-014 | Ephemeris request isolation | `docs/VJ-014-…md` |
| VJ-015 | Workspace shell, command palette, active profile | `docs/VJ-015-…md` |
| VJ-016 | Natal / varga / bala evidence panels | `docs/VJ-016-…md` |
| VJ-017 | Deterministic dasha / transit timeline | `docs/VJ-017-…md` |
| VJ-018 | Matching and Tamil timing journeys | `docs/VJ-018-…md` |
| VJ-019 | ReportDocument and PDF export | `docs/VJ-019-…md` |
| VJ-022 | Consultation notes, evidence links, event journal | `docs/VJ-022-…md` |
| VJ-023 | Parashara's Light 9 import | `docs/VJ-023-…md` |
| VJ-026 | Source-aware glossary (term ↔ rule ↔ locator ↔ rights) | `docs/VJ-026-…md` |
| VJ-024 | Sync: scopes, outbox, idempotency, revocation (client half) | `docs/VJ-024-…md` |
| VJ-025 | Conflict resolution — explicit review, no silent loss | `docs/VJ-025-…md` |
| VJ-027 | Dasha coverage labels + Tribhagi (worked example) | `docs/VJ-027-…md` |
| VJ-028 | Research predicates and saved cohorts | `docs/VJ-028-…md` |

---

## The honest shape of what is left

Six items remain, and they do not all belong to the same person. **Half of one I can
finish at this keyboard. Five cannot be completed without hardware, testers, or
a decision that is yours.** Saying otherwise would produce items marked "done"
that no device has ever run.

### A · Finishable here, with no external dependency

Only VJ-029's first half remains in this group; everything else needs the
blockers below.


VJ-029 (installer / update / rollback / support pack) is **half** in this
group: packaging and diagnostic redaction are doable here; proving an
interrupted update rolls back needs a real install on a real machine.

### B · Blocked on hardware, testers, or your decision

| ID | What | Blocked on |
|---|---|---|
| **VJ-009** | Android native ephemeris bridge proof | A physical Android device **and** an Android project that does not exist yet — there is no Capacitor or `android/` directory in this repo. ADR-04 already records that a Node addon cannot run on Android directly, so this is a real bridge, not a port. |
| **VJ-010** | Clickable prototype + usability review | 3–5 target users. The acceptance is *measured confusion points*; I cannot measure a person. |
| **VJ-020** | Mobile navigation and profile flows | VJ-009 |
| **VJ-021** | Mobile real-device services (location, notifications, share) | Physical devices; permission-denied paths cannot be faked |
| **VJ-030** | Release regression / device acceptance | Everything above — "every committed capability device verified" is the criterion |

Also outstanding, and yours rather than mine:

- **VJ-002 domain sign-off** — the fixtures carry `ENGINE_BASELINE`, not
  `DOMAIN_REVIEWED`. A baseline nobody has checked records what the engine
  does, not what is correct.
- **VJ-007 licence decision** — Swiss Ephemeris, deliberately deferred. The
  four events that trigger it are listed in that record.

---

## Order

1. **VJ-029 (part)** — packaging and diagnostic redaction. Proving an
   interrupted update rolls back needs a real install on a real machine.

Then the PL9 425-row comparison audit.

VJ-009 / 010 / 020 / 021 / 030 wait on the blockers above and should be
scheduled around device availability rather than slotted into this sequence.

---

## Known defects outstanding

Not plan items, but real, and they should not be discovered at release:

- **Fabricated Ashtakoota.** `src/charts/chart-renderers/CompatibilityMatrix.tsx`
  shows a 36-guna score from formulas that are not the Ashtakoota rules
  (`// simplified for demonstration`, in its own code). Live at
  `/chart-display` → chart-comparison. The same defect class VJ-003 removed
  elsewhere.
- **8 unverified source locators.** `rajaYogas`, `wealthYogas`,
  `lagnaSpecificYogas`, `lunarSolarYogas`, `edgeCaseYogas`, `chartQuality`,
  `doshas` (×2) say `file pages TBD`. Chapter and verse known, page never
  checked. Needs the BPHS PDF — VJ-002 work. Asserted at exactly 8 by test.
- **`backend/.env` — untracked in VJ-024, but the secret is still exposed.**
  It was in `.gitignore` yet still tracked; `git rm --cached` fixed that, but
  the history and the `backup/pre-env-strip` refs still hold it. The
  `JWT_SECRET_KEY` is a real 39-character secret and **must be rotated**.
- **The porutham tables: corrected 2026-09-30; one factor still unsourced.**
  The earlier port was wrong against *both* primary texts — Gana 12/5/10 (should
  be 9/9/9), Dina inverted, Rasi agreeing on 48 of 144 pairs, Yoni/Vasya/Vedha
  tables in neither book. Nine factors now follow Kalaprakasika (page-verified;
  the code agrees with the book on every input it models); Sūḍāmaṇi is the cross-check — four factors agree,
  five differ (`docs/PORUTHAM-source-comparison.md`). **Rasi Adhipathi has no
  source**: Kalaprakasika states no rule. Owner decisions outstanding: Adhipathi,
  and whether to follow Sūḍāmaṇi where the books differ.
- **Saturn transit: built, one convention undecided.** `/saturn-transit`
  (`docs/SATURN-TRANSIT-remedies.md`) computes Sade Sati, Ardhashtama, Ashtama
  and Kantaka Saturn; dates come from the ephemeris, definitions from page-read
  sources. The books disagree about Kantaka (4/7, 4/7/10, 4/7/8, 1/8/10), so
  it is a selectable convention. Default since 2026-10-03 by the owner's
  "most explanation first" rule: Pulippani (4, 7, 8), whose Kantaka text is
  the longest; before that 4 and 7 (named by three of four).
- **Mangala dosha: built; five readings, no single verdict.** `/mangala-dosha`
  (`docs/MANGALA-DOSHA.md`). The books disagree on the houses — Mansagari's
  verse omits the 2nd, Vishnu Bhaskar gives five houses in his summary and six
  in his detailed list — and on the cancellations, so each of 56 conditions is
  shown under its own book and page. The Tamil texts held state no rule. Order
  since 2026-10-03 (most explanation first): Vishnu Bhaskar, Bhagat, Mansagari.
  Not yet: Kala Sarpa effects, Navamsha/D-30 mitigation.
- **Gemstones: built as a comparison, not a recommendation.** `/gemstones`
  (`docs/GEMSTONES.md`). Three books, three methods, disagreeing on gems for the
  same Ascendant; each is shown with its page and agreements/conflicts are
  marked. Order settled by the owner (2026-10-03): the book that explains most
  first — Kapoor (all 84 per-Ascendant paragraphs encoded, conditions settled
  against the chart), then Tilak Raj, then Raj Kumar; wearing details compared
  across all three. No Tamil book gives a method (names only).
- **Saturn deepened: vedha, vipareetha vedha, 4th/7th/8th result text.**
  `/saturn-transit` (`docs/SATURN-TRANSIT-remedies.md`). Pulippani's vedha
  tables for all nine planets (two print departures recorded); Saturn's windows
  computed against the other planets for the coming 30 years; Sudamani verse 343
  gives the same reversal in Tamil but a different effect ("gives good" vs "evil
  not felt"). Pulippani's three passages for the 4th, 7th and 8th, each period
  with its round. Since then: all twelve houses' text; and (2026-10-06)
  Ashtakavarga and Kakshya — Patel's bhava method reproduced exactly from his two
  worked charts, the sign method, Vinay Aditya's watch-list; Patel's bindu table
  found to differ from Vinay Aditya's in two cells. Not yet: Kakshya for the
  other planets.
- **Gochara vedha for all nine planets.** `/gochara-vedha`
  (`docs/GOCHARA-VEDHA.md`). Five books compared cell by cell (Pulippani,
  Jataka Parijata, Sudamani, Kalaprakasika, Vishnu Bhaskar); they differ only on
  Mercury's 10th, Venus's 11th/12th, the 10th as a good house and Pulippani's
  Venus–Sun exemption. Pulippani (most explained) and Vishnu Bhaskar computed.
  The report's gochara section and the answer engine now read the sourced
  table instead of an unverified "Phaladeepika 26.3-8" copy. Nakshatra vedha
  added the same day: sixteen positions from the planets' natal stars,
  identical in Pulippani ch.23 and Santhanam's Jyotisharnava Navanitam; the
  books read the effect three ways and all three are shown. Then Santhanam
  became a sixth book and third computed method: his "vedha for bad places
  only" table is Kalaprakasika's bad-house columns (35 of 39 cells), and his
  p.152 contradicts Pulippani on Sade Sati companions. Default decided
  2026-10-10 by the owner: Phaladeepika (Sastri), the classical text, not the
  first by words; the report's gochara section, the answer engine and the page
  follow it, and the report also shows chapter 26 (verses 9–25, 30–34) for the
  present from the function the page uses. Saptashalaka chakra added
  2026-10-07: three books (Bhat 808 words, default; Pulippani; Gour) read it
  as straight lines or three lines — both computed; four rules as dated
  windows; Abhijit from Charak. Sudamani's Venus line read 2026-10-08: five of
  its eight numbers are legible and follow Pulippani's pairs in verse-341 order
  (so Sudamani gives 11→3, against Santhanam and Vishnu Bhaskar); three are
  reconstruction. Verse 341 has no 8th house for Venus (the commentary adds it).
  Phaladeepika XXVI.2–8 read the same day (Sastri 1950, with the verse; Kapoor)
  and computed as a fourth method: Pulippani's pairs cell for cell, Rahu and
  Ketu good in the 10th "like the Sun", no Venus–Sun exemption, no vipareetha.
  The old "Phaladeepika 26.3-8" port matched it except for the nodes. The rest
  of XXVI read the same day: house results (9–24) and the effective third of a
  sign (25) on /gochara-vedha, verses 33–34 computed, 30–32 and 41 shown;
  Saptashalaka (26–29) and anga (35–40) added as books on their pages — the
  verses decide against Pulippani's anga rows, and verse 28's "Vainashika" is
  the 23rd (Jataka Parijata) or 22nd (Kalaprakasika, Gour), both computed.
- **Nakshatra gochara: taras, star classes, anga phala, weekday.**
  `/nakshatra-gochara` (`docs/NAKSHATRA-GOCHARA.md`), 2026-10-08. The rest of
  Pulippani ch.24. Anga in four books (Bhat default; Pulippani; Sudamani read
  from the Tamil verses; Gour): Bhat and Gour agree, Pulippani differs only on
  the Moon (19th–24th "going abroad" against "living in his own house"), and
  Pulippani's English of Sudamani departs from the Tamil for the Sun and Mars.
  First page to use the shared `PartyChooser`.
- **Moorthi Nirnaya: the form of each sign entry.** `/moorthi-nirnaya`
  (`docs/MOORTHI-NIRNAYA.md`), 2026-10-08. Six books give the same groups
  (1/6/11 gold … 4/8/12 iron); Pulippani (most explained) alone reverses the
  grades for malefics and quantifies them in two series that do not agree.
  Entries are computed to 30 seconds; an entry within 2′ of a Moon sign change
  is marked close with the other form shown — the two book examples that
  differ from Lahiri (Pulippani 1998, Raj Kumar 1958) are both of that kind.
  Pulippani says the method is "greatly explained in Tamil texts only"; none of
  the Tamil books held has it.
- **Latta: the planets' kick.** `/latta` (`docs/LATTA.md`), 2026-10-08.
  Phaladeepika XXVI.42–47 (Sastri's 1950 translation, with the verse) and six
  books; order by words puts Narasimha Rao first (he also reads the lagna star
  and judges by the kicker's natal houses). The counts agree except Kapoor's
  Rahu 8th (verse: 9th); three books count Ketu; the effects differ most for
  Mars, Saturn, the Moon and Jupiter. Muhurta use of Latta not built.
- **The 88th nakshatra pada.** `/pada-88` (`docs/PADA-88.md`), 2026-10-08.
  Raj Kumar (per-planet table, Jupiter's aspect as relief) and Vishnu Bhaskar
  for transits; Kalaprakasika and Shubhakaran for the quality of a time (the
  Moon's six-hour passages). "In the 22nd star" holds only for a 1st-pada birth;
  the count is followed. Prasna, muhurta and matching uses not built.
- **A Tamil font must be bundled before release** — the VJ-019 PDF proof used
  Windows NirmalaUI, so output currently depends on the user's system fonts.
