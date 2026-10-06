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
  found to differ from Vinay Aditya's in two cells. Not yet: vedha and Kakshya
  for the other planets.
- **A Tamil font must be bundled before release** — the VJ-019 PDF proof used
  Windows NirmalaUI, so output currently depends on the user's system fonts.
