# Roadmap — remaining work from the Codex implementation plan

**Updated:** 2026-09-27 · Source: `Veda-Jothidam-Implementation-Plan-2026-09-26`
· **19 of 30 delivered**

Ordered by what actually unblocks what, not by ID.

---

## Delivered

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

---

## The shape of what remains

The desktop branch is clear: VJ-008 unblocked VJ-014 → VJ-017, and
VJ-015 → VJ-016 → VJ-018/VJ-019 are all delivered. **VJ-009 (Android) is now
the only chokepoint**, holding VJ-020 and VJ-021, which VJ-029 waits on.

```
VJ-009 (Android) + VJ-010 ──> VJ-020 ──> VJ-021 ──┐
                                                  ├─> VJ-029 ─> VJ-030
VJ-024, VJ-025, VJ-026, VJ-027, VJ-028 ───────────┘
```

Eleven remain: VJ-009, VJ-010, VJ-020, VJ-021, VJ-024, VJ-025, VJ-026,
VJ-027, VJ-028, VJ-029, VJ-030 — plus VJ-002's domain sign-off and VJ-007's
licence decision, both of which need the user rather than code.

Ready now with no blocker: **VJ-024, VJ-025, VJ-026, VJ-027, VJ-028**.
VJ-009 and VJ-010 need hardware and testers.

---

## Phase A — unblock the tree

> VJ-008 is delivered; VJ-009 and VJ-010 remain.

### ~~VJ-008~~ **DELIVERED** · Windows Electron native worker proof
*Deps met. Acceptance: clean Windows install; airplane mode; Node addon ABI verified.*

The single highest-value item, for two reasons beyond the plan's own:

1. It is the gate on 13 downstream items.
2. **It tests a risk we have already taken.** VJ-011, VJ-012 and VJ-022 all
   sit on `node:sqlite`, which is experimental and which Electron's bundled
   Node may not expose. The same class of problem already bit us once: a bare
   `require('node:sqlite')` failed inside the Next.js bundler while every Node
   test stayed green. If Electron cannot reach it, the repository swaps to
   `better-sqlite3` — one file — but we need to know now, not after building
   the desktop shell on top of it.

Also verifies the Swiss Ephemeris native addon loads from a packaged app
offline.

### VJ-009 · Android native ephemeris bridge proof
*Deps met. Acceptance: same fixtures as desktop; restart/offline; unsupported-capability error.*

ADR-04 already records that a Node addon will not run on Android directly, so
this is a real bridge, not a port. The VJ-002 fixtures exist precisely to
compare desktop and mobile output.

**Needs you:** a real Android device. I can write the bridge and the
comparison harness; I cannot test on hardware.

### VJ-010 · Clickable prototype and usability review
*Deps met. Acceptance: create → analyse → explain → save/report tasks; measured confusion points.*

**Needs you:** 3–5 target users. I can build the prototype and the task
script. The sessions and what they reveal are yours — and VJ-015 and VJ-020
both list this as a dependency, so skipping it means designing the desktop and
mobile shells on assumption.

---

## Phase B — ready now, independent of the spikes

> VJ-013 and VJ-023 are delivered; VJ-024, VJ-025 and VJ-026 remain.

These can proceed in any order while Phase A is in progress.

### ~~VJ-013~~ **DELIVERED** · Separate cache from records
*Acceptance: cache purge cannot remove charts or notes; quota failure visible.*

Small and protective. The library now holds real user data — saved clients,
consultations, journal entries — and nothing currently distinguishes it from
disposable cache. Worth doing before there is more to lose.

### ~~VJ-023~~ **DELIVERED** · PL9 XML import wizard
*Acceptance: test copies only; field mapping, duplicate detection, loss report, rollback.*

Highest practical value of the ready items: it lets existing Parashara's Light
data come across. The acceptance criteria are unusually strict for good reason
— an import that silently drops fields is worse than none.

### VJ-026 · Source-aware learning and glossary
*Acceptance: Tamil term ↔ rule ↔ source locator; redistribution rights documented.*

Fits the existing discipline: `RuleEvidence` already carries page locators, so
a glossary entry can point at the same source a calculation cites. The
redistribution question overlaps VJ-007 and should be settled in the same
conversation with Astrodienst.

### VJ-024 / VJ-025 · Optional sync and conflict resolution
*Acceptance: scoped access, device outbox, idempotent writes, revocation; two-device edit → explicit review.*

Technically unblocked, but **I would defer both.** ADR-05 makes sync optional
and the product works fully without an account. These are the largest
remaining items and they gate only VJ-029. Revisit once desktop and mobile
are real.

---

## Phase C — desktop experience (after VJ-008, VJ-010)

> **All delivered** — VJ-015, VJ-016, VJ-017, VJ-018, VJ-019.

- **VJ-015** workspace shell — keyboard, command search, saved layouts. This is
  also where backup/restore finally get a File menu; VJ-012 has working
  actions that no UI calls.
- **VJ-016** natal/varga/bala evidence panels — puts `RuleEvidence` on screen
  and completes VJ-022's missing evidence picker.
- **VJ-019** ReportDocument + real PDF/PNG export. Note F05: the current
  exporter refuses rather than mislabelling, so this is unimplemented, not
  broken. Needs a real PDF library and Tamil font embedding.
- **VJ-017** deterministic dasha/transit timeline (also needs VJ-014).
- **VJ-018** matching and Tamil timing journeys.

## Phase D — mobile (after VJ-009, VJ-010)

- **VJ-020** navigation and profile flows; **VJ-021** real-device services.
  VJ-021 needs physical devices.

## Phase E — advanced (after VJ-014)

> VJ-014 is delivered; VJ-027 and VJ-028 remain and are unblocked.

- **VJ-014** ephemeris request isolation, **VJ-027** rare dashas/Tajika,
  **VJ-028** research predicates and cohorts.

## Phase F — release

- **VJ-029** installer, update, rollback, support pack.
- **VJ-030** release regression and device acceptance.
- **The licence decision (VJ-007) must be settled before either.** Both
  produce distributable builds, which is exactly the trigger Astrodienst's
  terms name. Development stays unaffected.

---

## What needs you rather than me

| Item | Why |
|---|---|
| VJ-007 decision | Contacting Astrodienst; cost and contract are yours |
| VJ-009, VJ-021 | Real Android hardware |
| VJ-010 | 3–5 target users for the usability sessions |
| VJ-002 sign-off | Fixtures are `ENGINE_BASELINE`, not `DOMAIN_REVIEWED` — they prove the engine has not drifted, not that it was ever right |

---

## Suggested order

1. **VJ-008** — unblocks the most, and tests the `node:sqlite` bet already made.
2. **VJ-013** — small, protects the data now accumulating.
3. **VJ-023** — real user value, no blockers.
4. **VJ-009** + **VJ-010** — when a device and testers are available.
5. Then Phase C, in the order listed.

Deferred deliberately: VJ-024/025 until desktop and mobile exist.
