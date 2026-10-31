# S6 (revisited) — User-selectable Ayanamsha / House System / Node type, and a sidereal-houses correction

Status: RESOLVED. Two things landed together:

1. **Bug fix (correctness):** the Lagna and Bhava cusps were being computed
   **tropically** and then read as sidereal — a latent error of one whole
   sign (~24°) in every chart. Now corrected.
2. **Feature:** `ayanamsha`, `houseSystem` and a new `nodeType` (mean/true
   lunar node) are user-selectable from Settings, each option carrying its
   own standard citation. Defaults are unchanged — Lahiri / Porphyrius /
   mean node — so an unconfigured chart is byte-identical to before *except*
   for the sidereal-houses fix.

Part of the Tier-1 "AstrologicLab feature integration" batch (see
`docs/feature-integration-plan.md`). Working tree only (no git repo when the
S1–S13 records were written; a repo exists now and this is committed with
the change).

## 1. The sidereal-houses bug

`@swisseph/node`'s `calculateHouses(jd, lat, lon, hsys)` wraps Swiss
Ephemeris `swe_houses()`, which has **no flags parameter** and therefore
always returns **tropical** cusps, ascendant and MC. It does *not* honour
the ambient `swe_set_sid_mode`. Verified directly: `calculateHouses` output
for Lahiri and for Raman was byte-identical (`43.46595198...` both), when a
real sidereal ascendant must differ by the ~1.45° ayanamsha gap between
those two systems.

`swissEphemeris.js` passed that tropical `ascendant` / `cusps` straight into
`parashariChart.js`, where `rasiFromLongitude` / `houseOfLongitude` treat
their input as sidereal. Net effect: for the S6 test birth (1990-05-15
07:30 IST, Erode) the reported Lagna was **Mithuna 16.3°** when the
astronomically correct sidereal Lagna is **Vrishabha 22.5°** — and the Sun,
which rose ~90 min before birth, was placed in the 11th house when it
belongs in the 12th. Every house-dependent downstream value (Bhava Bala,
house-counted yogas, Karakas) inherited the same one-sign rotation.

Why it went unnoticed: `test-parashari-chart.js` verified `houseOfLongitude`
against *Sripatipaddhati*'s worked-example cusp values fed in as **synthetic
literals**, and asserted only that the engine's real Lagna was "a finite
number in some rasi, 0 ≤ deg < 30" — never its actual value. S6-BHAVA-001's
computational check likewise verified that `HouseSystem.Porphyrius`
*trisects correctly between its own angles*, not that those angles were
sidereal.

### Fix

`src/ephemeris/swissEphemeris.js` — new `siderealizeHouses(houses, jd)`:
subtracts `getAyanamsa(jd)` (`swe_get_ayanamsa_ut`, which *does* honour the
sidereal mode) from the ascendant, MC and all 12 cusps, normalised to
[0, 360). This is Swiss Ephemeris's own documented manual equivalent of
`swe_houses_ex(..., SEFLG_SIDEREAL)`, which the binding does not expose.
`armc` (a sidereal-time value, not an ecliptic longitude) is left untouched;
the applied ayanamsha is echoed back as `houses.ayanamsaApplied`.

### Regression pin

`test-parashari-chart.js` now asserts the concrete sidereal values for the
S6 test birth (Lagna = Vrishabha, longitude ≈ 52.546°; Sun = Vrishabha,
house 12, longitude ≈ 30.269°) and that switching Lahiri→Raman shifts the
Lagna **and** every graha by the same ayanamsha delta (~1.45°).

## 2. The options

`@swisseph/node` supports every one of these natively via `SiderealMode`
/ `HouseSystem` keys / `LunarPoint`, so nothing had to be ported — only
allow-listed and wired through the existing plumbing.

### Ayanamsha — `SUPPORTED_AYANAMSHAS` (`src/contracts/chartContext.js`)
Names are exactly `@swisseph/node`'s `SiderealMode` keys.
| value | source |
|---|---|
| `Lahiri` (default) | Chitrapaksha; unchanged project default (S6). |
| `Raman` | B. V. Raman, *A Manual of Hindu Astrology* / Raman's ephemerides. |
| `Krishnamurti` | KP ayanamsha (`SE_SIDM_KRISHNAMURTI`), *Krishnamurti Paddhati*. |
| `TrueCitra` | true Chitrapaksha (Spica fixed at 180°00′). |

### House system — `SUPPORTED_HOUSE_SYSTEMS`
| value | source |
|---|---|
| `Porphyrius` (default) | = Sripati Paddhati; verified in S6-BHAVA-001 against *Sripatipaddhati* (V. Subrahmanya Sastri), Adhyaya I Sloka 6-7. |
| `Placidus` | semi-arc; was the pre-S6 wrapper default, kept selectable. |
| `WholeSign` | sign = house; the classical North/East-Indian bhava. |
| `Equal` | 30° from the Lagna degree. |
| `Koch` | birthplace house system. |

### Node type — `SUPPORTED_NODE_TYPES` (new)
| value | source |
|---|---|
| `mean` (default) | S6-RAHU-KETU-001: *Rahu & Kethu in Bhrigu Astrology* (Srinivasan Shastry) describes the nodes' motion as a constant unbroken regression — the mean node. |
| `true` | osculating node; opt-in for KP / modern-Vedic practice (*Krishnamurti Paddhati*), where the true node is standard. |

`src/ephemeris/siderealPositions.js` — `meanNodeLongitude` is now a thin
wrapper over a new `nodeLongitude(jd, ayanamsha, nodeType)` that selects
`LunarPoint.MeanNode` / `LunarPoint.TrueNode`. Panchangam and other callers
that want the project default are unaffected.

## Wiring

- `src/contracts/chartContext.js` — allow-lists expanded; `nodeType`
  validated and frozen into the context; default `'mean'`.
- `src/contracts/birthProfile.js` — `nodeType` added to the `deriveChartId`
  canonical hash, so changing it produces a new (correct) chart identity.
- `src/chart/parashariChart.js` — reads `chartContext.nodeType`, calls
  `nodeLongitude`, echoes `nodeType` in the chart result alongside
  `ayanamsha` / `houseSystem`.
- `app/report/actions.ts` — `BirthFormInput` gains optional `ayanamsha`
  / `houseSystem` / `nodeType`; when omitted the governed context defaults
  apply.
- `app/report/ReportBuilder.tsx` — reads `useSettings()`, maps the
  lowercase UI values to the canonical engine names, passes them into
  `computeReport`; the Profile section now prints
  "`<ayanamsha> · <houseSystem> · <mean|true> node`".
- `src/ui/SettingsPanel.tsx` — the Ayanamsha / House System selects now
  offer exactly the supported set (removed the never-wired
  Regiomontanus / Campanus / Sayana options); new "Lunar Node" select;
  default `houseSystem` corrected to `'porphyrius'` to match the engine's
  actual default; `useSettings` now merges stored settings over
  `DEFAULT_SETTINGS` so a key added later is never `undefined` for an
  existing user.

## Tests

- `test-chart-context.js` — updated: the now-valid `Raman` / `Koch` are
  replaced with genuinely-unsupported values (`FaganBradley` /
  `Regiomontanus`) for the negative checks; positive checks added for every
  new ayanamsha / house / node option; `nodeType: 'osculating'` asserted to
  throw.
- `test-parashari-chart.js` — sidereal-value regression pin (above), plus
  a `nodeType: 'true'` check that Rahu moves off the mean-node value.
- Full suite: `npm test` → all 20 scripts pass.
- `npm run build` → compiles, TypeScript check passes, all routes prerender.
- Browser: submitted the report form under Lahiri/Porphyrius/mean and again
  under Raman/WholeSign/true; Profile line and Lagna/graha table update
  correctly (Lagna Vrishabha 22.55° → 23.99° for the ayanamsha change; house
  numbers change for the WholeSign change; a new Chart ID for the node
  change). Zero console errors.

## Scope note

Downstream modules that count houses whole-sign-from-Lagna (S10 Kendradi
Bala, S11 Nabhasa Yoga) are unaffected by the sidereal-houses fix — they
never used the cusp array — and remain a defensible reading of their own
verses (see S6-BHAVA-001's scope note). The fix changes only the cusp-based
`house` field and the Lagna longitude/rasi.
