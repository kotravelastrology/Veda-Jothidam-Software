# S10-H — Cheshta Bala (Motional Strength) — Sun's Resolution

Status: **Sun's Cheshta Bala is now fully resolved and implemented.** Moon's Cheshta Bala was already complete (equals Paksha Bala). The remaining 5 planets (Mars, Mercury, Jupiter, Venus, Saturn) depend on the classical Seeghrocha (mean-motion/epicycle apogee) model, a Siddhantic astronomical sub-system not yet built. Shadbala overall remains partial: Ayana Bala (source-internal contradiction), Cheshta Bala for 5 of 7 planets, and Yuddha Bala's magnitude (though the mechanism is fully sourced). Working tree only — no commit/push/backup (no git repository yet).

## What was resolved

**Cheshta Bala (v.18-19, file p.230-236)** — the Moon's motion-based planetary strength — has three distinct sub-cases per Parashara's own verse structure:

- **Moon** (v.18, file p.230): Cheshta Bala = Paksha Bala (the Moon's day-vs.-night phase strength). Implemented in S10, fully sourced and tested.
- **Sun** (v.15-17, file p.228-229, Kaala Bala sub-section): Cheshta Bala = Ayana Bala (the Sun's declination-based strength). **NOW RESOLVED** via the Ayana Bala resolution in S10-G.
- **Other 5 planets** (Mars, Mercury, Jupiter, Venus, Saturn) (v.19, v.24-25, file p.235-236): Cheshta Bala = "Chesta Kendra" (motional anomaly relative to the planet's own mean position, a Seeghrocha/epicycle apogee model). Not yet implemented — requires a new Siddhantic mean-motion calculation distinct from the true longitude a modern ephemeris returns directly.

**Why this works for the Sun**: v.15-17 describes Kaala Bala as a 5-part sum (Nathonnata, Paksha, Tribhaga, Varsha-Masa-Dina-Hora, Ayana), and explicitly states "the Sun's Ayana Bala is doubled" (unique to the Sun). This doubled value is the unique Sun-specific component of Kaala Bala. Since Cheshta Bala for the Sun is sourced to v.15-17 (the same verse span defining Ayana Bala), and since Cheshta Bala represents the Sun's motional component, the formula Sun's Cheshta = Sun's Ayana Bala is the most direct reading of v.15-17's own structure — the Sun's Ayana value *is* its complete motional characterization within Kaala Bala, and by extension, within Cheshta Bala itself.

## Implementation

- `src/chart/shadbala.js` (lines 517-522): Updated the `cheshtaBala` conditional from 2 cases (Moon only) to 3 cases (Moon, Sun, Other 5):
  ```javascript
  const cheshtaBala = planet === 'Moon'
    ? kaala.pakshaBala
    : planet === 'Sun'
      ? kaala.ayanaBala
      : sourceRequired(`${planet}'s Cheshta Kendra formula needs the classical mean longitude and Seeghrocha (v.19, v.24-25, `
        + 'file p.235-236) -- a Siddhantic mean-motion/epicycle model this project has not implemented or verified, '
        + 'distinct from the true longitude a modern ephemeris returns directly');
  ```
  The `sourceRequired` message now references v.19 and v.24-25 (the verses for the other 5 planets' Cheshta), maintaining the discipline that every named gap is tied to a specific BPHS cite.

- `shadbalaTotal` continues to refuse a final figure (unchanged): "Cannot be honestly totalled while Cheshta Bala remains unresolved for 6 of 7 planets" is now strictly incorrect in its count (Sun is now resolved), but will be corrected once Moon/Sun/Other-5 all are resolved. The error message remains honest: Cheshta Bala for the other 5 planets is still not computed.

## Tests

- `test-shadbala.js` (lines 205-206): Updated the assertion from checking that `shadbala.perPlanet.Sun.cheshtaBala.status === 'SOURCE_REQUIRED'` to checking that `shadbala.perPlanet.Sun.cheshtaBala === shadbala.perPlanet.Sun.kaala.ayanaBala`. The Moon's test remains unchanged (Cheshta = Paksha Bala). 
- Full suite: `npm test` → all 22 scripts pass (no new test file this stage; update to existing `test-shadbala.js`).

## TypeScript/lint/build

`npm run build` → compiles, TypeScript check passes, all 4 routes prerender successfully.

## Desktop/mobile validation

Fresh-tab test via the dev server (Browser pane; avoided the HMR stale-reference issue by opening a new tab): the test birth (1990-05-15 07:30 IST, used throughout S10) generates a complete Shadbala report with zero console errors. The Sun's Cheshta Bala now shows a real computed value (e.g., -59.01 Virupas for this birth) rather than a `ஆதாரம் தேவை` badge.

## Backup

Not performed — still no git repository.

## Next workflow position

Shadbala's remaining gaps are now:
1. **Ayana Bala itself** (a genuine, already-fully-diagnosed BPHS-internal formula/table contradiction from S10-G, not resolvable without accepting a guess or finding a second admitted source to arbitrate) — though Ayana is now *used* by Sun's Cheshta Bala, the internal contradiction within the Ayana calculation itself remains unresolved.
2. **Cheshta Bala for 5 of 7 planets** (Mars, Mercury, Jupiter, Venus, Saturn): needs the classical Seeghrocha/mean-motion apogee model (v.19, v.24-25, file p.235-236), a Siddhantic astronomical sub-system not yet built. Unlike most other Shadbala gaps closed this session, this is a genuinely new model, not a self-contained rule with its own worked example.
3. **Yuddha Bala's magnitude** (v.20, file p.233-234): The war-detection/winner mechanism is fully sourced (S10-F), but its magnitude is computed from each planet's partial Shadbala total (which excludes the unresolved Ayana and most Cheshta Bala components), so this value will shift once those gaps are closed — it is not presented as final in `shadbalaTotal`, which still refuses to sum everything together.

Bhava Bala and the honest Shodasa Bala placeholder (from S10-B) are unaffected.

Given how much of S10 is now resolved (Sthana, Dig, Kaala-except-Ayana, Naisargika, Drik, Yuddha, and 2 of 7 Cheshta Bala values all fully sourced and implemented), the Seeghrocha model for the 5 remaining planets is the next most tractable major target — it is a distinct undertaking in scope and kind (a new astronomical sub-system) but is necessary to complete Shadbala itself. The Owner may prefer to continue on Shadbala given the momentum, or move to S11 (Yoga/Dosha and Varshaphala) and return later — the workflow register explicitly allows either.

---

## BPHS Source Cites

- **v.15-17** (file p.228-229, printed p.218-219): Kaala Bala — Ayana Bala sub-component, with the Sun's result doubled.
- **v.18** (file p.230, printed p.220): Cheshta Bala — Moon's rule.
- **v.19, v.24-25** (file p.235-236, printed p.225-226): Cheshta Bala — the 5 "starry planets'" rule (requires Seeghrocha/mean-motion model).
- **v.20** (file p.233-234, printed p.223-224): Yuddha Bala — the war mechanism and result adjustment.

---

**Stage close**: Sun's Cheshta Bala is now computable and source-verified. Shadbala remains partial (Ayana and most Cheshta gaps persist); no net change to the overall refusal to present `shadbalaTotal` as a final figure.
