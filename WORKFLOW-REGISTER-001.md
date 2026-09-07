# Kotravel Vedic Astrology — WORKFLOW-REGISTER-001

Status: WORKFLOW REGISTERED (implementation must follow this sequence)
Created: 2026-09-05
Owner: V. Kotravel
Related plan: PLAN-001.md (remains unchanged)

## Purpose

Build a new Tamil-first Vedic astrology product with a simple public layer and a deep astrologer layer. The product must follow the registered sequence below. An extra request may be handled as an isolated task, but work must return to the next unfinished registered stage.

## Product identity

- Product: Kotravel Vedic Astrology
- Project path: `D:\KotravelAstrology\New-kottravelastrology-software`
- The legacy product name is not a user-facing identity and must not appear in the new UI, reports, PDFs, metadata or documentation.

## Registered scope and boundaries

### Active Vedic core

Parashari and Phaladeepika-oriented calculations; Tirukanita and Vakya Panchangam; daily Panchangam; Muhurtham; Rasi/Bhava; Dasha/Bhukti/Antara/Sookshma/Prana; Varga; Ashtakavarga; Shadbala; Ishtabala; Kashtabala; Yoga/Dosha; Varshaphala/Tajika; selectable reports and print/export.

### Deferred separate modules

- KP Jyotish: deferred; separate future authorization, sources and calculation contract.
- Jaimini Jyotish: deferred; separate future authorization, sources and calculation contract.
- Numerology: later separate module; never silently blended with Vedic results.

### Safety boundary

Mortality, death-time or longevity prediction/rectification is prohibited. A later bounded Birth-Time/Life-Event Rectification module may use dated user-provided events only and must not infer death, lifespan or inevitability.

## Fixed implementation workflow

1. **S0 — Identity and scope freeze:** product name, folder, active/deferred/prohibited modules and change-control rules.
2. **S1 — Source registry:** search Owner-curated and local corpora first; verify complete work, author, edition, printed page, tradition and convention. OCR is discovery-only.
3. **S2 — Shared time/chart contracts:** timezone, location, ayanamsha, calendar mode, parameter identity and provenance model.
4. **S3 — Tirukanita Panchangam:** Vara, Tithi, Nakshatra, Yoga and Karana with exact start/end times plus sunrise/sunset.
5. **S4 — Vakya Panchangam:** same contract, separately selected convention; no blending with Tirukanita.
6. **S5 — Daily Panchangam and Muhurtham:** colourful public cards, event-type filters, neutral time windows and mobile/desktop layouts.
7. **S6 — Birth profile and Parashari chart:** complete intake and stable chart identity.
8. **S7 — Dasha hierarchy:** Dasha, Bhukti, Antara, Sookshma and Prana with exact boundaries.
9. **S8 — Varga and Karaka references:** supported divisions and source-attested significations.
10. **S9 — Ashtakavarga:** Bhinnashtakavarga, Sarvashtakavarga and transit context.
11. **S10 — Strength:** Shadbala, Ishtabala and Kashtabala component tables.
12. **S11 — Yoga/Dosha and Varshaphala:** only where exact source support is admitted.
13. **S12 — Report builder:** checkbox selection, ordering, preview, PDF, print and export of selected sections only.
14. **S13 — Consultation layer:** explicit request → reading request → direct Owner phone first; no automatic remedy or unsolicited contact.
15. **S14 — Capacity expansion:** queue and verified additional astrologers only after a separate future authorization.
16. **S15 — Validation and release readiness:** focused/full tests, TypeScript, lint, build, accessibility, responsive checks, generated artifact inspection and backup.

## Feature adoption from the Owner-provided design brief

Adopted as product requirements: two-depth UI, daily dashboard, Panchangam five limbs and time windows, Muhurtham event cards, selectable report sections, direct Owner-call flow and later multi-astrologer queue. KP/Jaimini early integration, mortality/death rectification and commercial marketplace are not adopted into the active core.

## Evidence and change control

- Every calculation result retains chart identity, parameters, engine, source, edition, printed-page locus, tradition, convention and derivation identity.
- Reliable source divergence permits one explicit default convention; alternatives remain separate and are never silently blended.
- Missing, restricted, unsupported and unevaluable states remain distinct.
- Each stage requires source check, focused tests, full suite, TypeScript/lint/build, desktop/mobile validation, backup and a stage record.
- No code commit, push, release or deployment occurs without a separately approved frozen patch.

## Mandatory progress response format

Every project status response must show:

1. Original goal.
2. Completed stages and result.
3. Current stage and activity.
4. Next unfinished stages.
5. The flow map from S0 to S15.

This register is a workflow control document; it does not itself implement software.
