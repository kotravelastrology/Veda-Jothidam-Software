# S11 — Yoga/Dosha (Nabhasa Yogas) and Varshaphala

Status: NABHASA YOGAS (all 32) IMPLEMENTED AND TESTED. Every other named item in this stage — Raja Yogas, Lunar/Solar Yogas, Dosha (curses), and Varshaphala/Tajika — remains explicitly open per S1-G's own record, which found only Nabhasa Yogas (BPHS Ch. 35) visually verified; everything else was "located, not admitted." Working tree only — no commit/push/backup (no git repository yet, unchanged since S2/S6-S10). No UI yet (backend only, matching precedent).

## Source check

S1-G had already visually confirmed BPHS Ch. 35 "Nabhasa Yogas" (file page 298, printed page 288) for its opening naming verses (1-7), but not the full formation rules for all 32 yogas or their exact house/sign conditions. This stage read the whole chapter (file pages 16619-16885 in the extracted text / printed pages 288-295) — the formation rules (v.1-17) plus the traditional effects (v.18-49), which are **not reproduced in this codebase**: this project's reproduction-rights caution (already applied to S1-D's Ashtakavarga source) extends here — only the geometric formation rule is implemented, not the predictive/interpretive verse text.

Compared to S10's Shadbala, this chapter is compact (~266 lines) and every one of the 32 yogas has an explicit, purely positional definition — no continuous-value math, no dependency on anything still open from S6 (Bhava) or S10 (Cheshta/Drik Bala). All 32 were implementable in one pass:

- **3 Asraya Yogas** (v.7): all 7 classical grahas share one sign-modality (movable → Rajju, fixed → Musala, dual → Nala).
- **2 Dala Yogas** (v.8): benefics/malefics confined to specific angles → Maala/Sarpa. **One genuine textual ambiguity, flagged rather than silently resolved:** the verse says benefics/malefics must occupy "3 angles" without naming which three of the four (1st/4th/7th/10th). This implementation uses 4th, 7th and 10th (excluding Lagna itself) — the most common resolution in comparable texts — but this is a judgment call, not a directly-stated rule, and is called out explicitly here so it can be revisited if the Owner wants the exact three pinned down from the Sanskrit grammar itself.
- **20 Akriti Yogas** (v.9-15): all 7 grahas confined to a specific house-set from Lagna (pairs, trines, quadrants, consecutive blocks of 4/7, alternating houses, or a benefic/malefic split for Vajra/Yava).
- **7 Sankhya Yogas** (v.16-17): by count of distinct signs occupied (1 through 7 signs → Gola through Veena) — **only when no other Nabhasa yoga above already matched**, exactly as v.17 states ("None of these seven yogas will be operable, if another Nabhasa yoga explained earlier is derivable"). Implemented as an explicit priority gate, not an afterthought.

A second simplification, also flagged rather than hidden: Vajra/Yava need a benefic/malefic split. This reuses the same simplified classification already used in S10's Paksha Bala (Jupiter/Venus/Mercury benefic, Sun/Mars/Saturn malefic, Moon by waxing/waning) rather than a full affliction-aware classification (which would need conjunction/aspect analysis not yet built).

## Implementation

- `src/chart/nabhasaYoga.js`: `calculateNabhasaYogas(rasiPositions, { isWaxingMoon })` — takes the same `{ Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Lagna }` 0-based-rasi map used by S9's Ashtakavarga, derives each planet's whole-sign house-from-Lagna (reusing the exact convention already established in S10's Kendradi Bala, so it inherits no new dependency on S6's still-open Sripati Bhava question), and checks all 32 formation rules, returning the list of yoga names/categories that match. Wrapped in `attachSource` citing Ch.35's formation verses only.
- Reuses `movability` from S8's `vargaChart.js` for the Asraya check, keeping sign-modality logic in one place rather than duplicated.

## Tests

`test-nabhasa-yoga.js` (new):
- Rajju/Musala/Nala: all 7 planets in a movable/fixed/dual sign respectively.
- Sringataka (houses 1, 5, 9 from Lagna): also confirms Rajju/Musala/Nala correctly do **not** co-fire, since trine houses from any Lagna always span all three modalities once each (an inherent structural fact double-checked by hand before writing the test, after an initial wrong assumption during test design that trine houses share modality — they don't; only fixed zodiacal trine sign-groups like Aries-Leo-Sagittarius do).
- Kamala (all 4 angles): also confirms no Sankhya name sneaks in once an Akriti yoga has matched (the v.17 priority rule).
- Vajra: benefics confined to houses 1 & 7, malefics to 4 & 10.
- Soola (Sankhya, 3 signs): a house combination (1, 5, 10 from Lagna) hand-verified against every one of the other 22 Asraya/Dala/Akriti rules to confirm none of them match, so this is a genuine, isolated test of the Sankhya fallback rather than an accidental co-match.

Full suite: `npm test` → all 12 scripts pass (11 pre-existing + this stage's new test).

## TypeScript/lint/build

- `npm run build` → compiles, prerenders, TypeScript check passes. Unaffected by S11 (backend-only `.js`, no new frontend code).
- `npm run lint` → still fails on the pre-existing `eslint-config-next`/`eslint-plugin-react` FlatCompat incompatibility recorded in S6; unrelated to and unchanged by S11.

## Desktop/mobile validation

Not applicable — backend-only, no UI surface yet (same as S2/S6-S10).

## Backup

Not performed — still no git repository (unchanged since S2/S6-S10).

## Next workflow position

Nabhasa Yogas are done. Everything else named in WORKFLOW-REGISTER-001 S11 remains open, each a separate, concrete next step: (a) visually verify BPHS's other located Yoga chapters one at a time (S1-G recommended starting with Ch. 39 Raja Yogas as highest practical-use priority), (b) visually verify the Dosha-relevant Ch. 83 "Effects of Curses", (c) open and page-verify one of the four already-discovered Tajika/Varshaphala candidate sources (per PLAN-001 item 11, this is only in scope "where exact source support exists" — it is explicitly allowed to stay thin). S12 — Report builder — is the next registered stage after S11 and does not depend on any of these remaining S11 items, per the register's rule that isolated gaps don't block moving forward.
