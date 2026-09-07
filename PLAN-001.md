# Kotravel Vedic Astrology — PLAN-001

Status: PLANNING FROZEN (no implementation authorized by this record)
Created: 2026-09-04
Owner: V. Kotravel

## Identity

- Product name: Kotravel Vedic Astrology
- Project path: `D:\KotravelAstrology\New-kottravelastrology-software`
- The legacy AstrologicLab name is not a user-facing product identity. It must not appear in the new application's UI, reports, PDF/print output, branding, metadata or documentation.
- Legacy repositories and backups remain read-only references and must not be modified by this workstream.

## Current V1 scope

The first release is Vedic/Parashari and Phaladeepika-oriented. KP and Jaimini are deferred to separately authorized modules and are not part of the core calculations. Numerology is a separate later module and must not be silently blended with Vedic results.

Core sequence:

1. Source registry and exact printed-page verification.
2. Shared astronomical/time and chart-identity contracts.
3. Tirukanita Panchangam.
4. Vakya Panchangam.
5. Daily Panchangam and Muhurtham.
6. Birth profile, Rasi/Bhava and planetary calculations.
7. Dasha, Bhukti, Antara, Sookshma and Prana periods.
8. Varga charts and source-attested Karakas.
9. Ashtakavarga.
10. Shadbala, Ishtabala and Kashtabala.
11. Yoga/Dosha reference results.
12. Varshaphala/Tajika where exact source support exists.
13. Tamil-first report builder, selectable print book and exports.
14. Focused/full tests, accessibility, desktop/mobile validation, backup and release readiness.

## Deferred or prohibited scope

- KP Jyotish: DEFERRED; separate future authorization and method contract required.
- Jaimini Jyotish: DEFERRED; separate future authorization and method contract required.
- Numerology: separate future module; no cross-system blending.
- Mortality, death-time or longevity prediction/rectification: PROHIBITED.
- Safe alternative: birth-time and dated life-event rectification only, with neutral unevaluable/refusal states.

## Non-negotiable method rules

- One explicit source convention is selected per calculation; reliable alternatives remain separately identified.
- Rules from different works are never silently blended or reconstructed.
- A source filename or search hit is discovery evidence only. Authority requires a complete, readable, independently resolvable work and visually verified printed-page locus.
- Every result retains chart identity, parameters, engine, source, edition, page, tradition and derivation identity.
- Missing, restricted, unsupported and unevaluable results remain distinct; no generic substitute narrative is generated.
- Extra requests are isolated, completed and tested, then the workflow returns to this sequence.
- No commit, push, release or deployment occurs without a separately approved frozen patch.

## Stage gates

Each stage requires: source check → implementation → focused tests → full suite → TypeScript/lint/build → desktop/mobile validation → backup → immutable stage record. A failed gate halts only the affected stage and records the exact reason.

## First implementation boundary

The first implementation batch is Panchangam + Muhurtham only. It must expose both Tirukanita and Vakya modes, start/end times for Vara, Tithi, Nakshatra, Yoga and Karana, timezone/location identity, and a Tamil-first daily presentation. No prediction, remedy, KP or Jaimini output is included in this batch.
