# Roadmap — finishing the Codex implementation plan

**Updated:** 2026-09-28 · Source: `Veda-Jothidam-Implementation-Plan-2026-09-26`
· **21 of 30 delivered, 9 remaining**

---

## Delivered (21)

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
| VJ-028 | Research predicates and saved cohorts | `docs/VJ-028-…md` |

---

## The honest shape of what is left

Nine items remain, and they do not all belong to the same person. **Three I can
finish at this keyboard, plus half of a fourth. Five cannot be completed without hardware, testers, or
a decision that is yours.** Saying otherwise would produce items marked "done"
that no device has ever run.

### A · Finishable here, with no external dependency

| ID | What | Size | State |
|---|---|---|---|
| **VJ-027** | Rare dasha / Tajika expansion | **large** | not started — 4 of ~23 dasha systems exist |
| **VJ-024** | Optional auth / sync service | **large** | not started |
| **VJ-025** | Conflict-resolution UI | medium | not started (needs 024) |

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

1. **VJ-027** — the largest remaining calculation gap, and the one the PL9
   audit showed most sharply: 4 dasha systems against PL9's ~23.
2. **VJ-024 → VJ-025** — sync and conflict resolution. The largest items;
   ADR-05 makes them optional and the product works fully without an account,
   so they come last among the ones I can do.
3. **VJ-029 (part)** — packaging and diagnostics.

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
- **`backend/.env` is tracked and on a public remote.** Its `JWT_SECRET_KEY`
  must be treated as compromised and rotated before any auth work (VJ-024)
  lands.
- **The ten porutham rule tables have no cited source.** VJ-018 discloses this
  on screen; closing it is VJ-002 work.
- **A Tamil font must be bundled before release** — the VJ-019 PDF proof used
  Windows NirmalaUI, so output currently depends on the user's system fonts.
