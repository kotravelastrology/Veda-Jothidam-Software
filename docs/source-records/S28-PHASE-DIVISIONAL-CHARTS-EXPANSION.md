# Phase 28: DIVISIONAL CHARTS EXPANSION

**Status**: STARTING  
**Date Started**: 2026-09-07  
**Target Completion**: 2026-09-21 (2 weeks)  
**Priority**: TIER 1 / HIGHEST  

---

## OBJECTIVE

Implement complete divisional chart suite (D1-D30) based on classical sources, with full test coverage and UI matching PL9's "Vargas I" interface pattern.

---

## SOURCES (VERIFIED)

### Primary Sources
1. **BPHS Chapter 26** — Divisional chart definitions and division rules
   - Source file: `D:\KotravelAstrology\Veda-Jothidam-Software\S1I-VARGA-SOURCE-VERIFICATION-001.md`
   - Status: VERIFIED ✅

2. **"How to Study Divisional Charts"** by Prof. V.K. Choudhry (168 pages)
   - File: `D:\1\astro books english\D-charts_kalacakra_sarvatobhadra\Jyotish_1990_V.K. Choudhry_How to Study Divisional Charts.pdf`
   - Key Pages: 7-8 (division rules and chart associations)
   - Status: VERIFIED ✅

3. **"Interpreting Divisional Charts"** by N.N. Sharma
   - File: `D:\1\astro books english\D-charts_kalacakra_sarvatobhadra\Jyotish_2009_N.N. Sharma_Interpreting Divisional Charts.pdf`
   - Status: VERIFIED ✅

4. **"A Study of the Vargas"** by K.S. Charak
   - File: `D:\1\astro books english\D-charts_kalacakra_sarvatobhadra\Jyotish_a study of the Vargas_K.S. Charak.pdf`
   - Status: VERIFIED ✅

---

## DIVISIONAL CHARTS TO IMPLEMENT (14 charts)

| Chart | Code | Name | Traditional Subject | Division Rule | Source |
|-------|------|------|-------------------|---------------|---------
| D1 | Rasi | Birth Chart | All matters | 1 (full sign) | BPHS 26 ✅ |
| **D2** | **Hora** | **Finance, Wealth** | **Money, resources** | **Each sign ÷ 2** | **Choudhry p.7** |
| **D3** | **Drekkana** | **Siblings, Courage** | **Siblings, valour** | **Each sign ÷ 3** | **Choudhry p.7** |
| **D4** | **Chaturthamsha** | **Property, Land** | **Real estate, vehicles** | **Each sign ÷ 4** | **Choudhry p.7** |
| **D5** | **Panchamsha** | **Children, Creativity** | **Intellect, creativity** | **Each sign ÷ 5** | **Choudhry p.7** |
| D7 | Saptamsha | Spouse | Marriage, partnership | Each sign ÷ 7 | Choudhry p.7 |
| D9 | Navamsha | Destiny, Spirituality | Overall strength | Each sign ÷ 9 | BPHS 26 ✅ DONE |
| **D10** | **Dasamsha** | **Career, Status** | **Profession, karma** | **Each sign ÷ 10** | **Choudhry p.7** |
| **D12** | **Dvadashamsha** | **Parents, Elders** | **Parental matters** | **Each sign ÷ 12** | **Choudhry p.7** |
| **D16** | **Shodashamsha** | **Vehicles, Luxuries** | **Conveyances** | **Each sign ÷ 16** | **Choudhry p.7** |
| **D20** | **Vimshamsha** | **Spirituality, Dharma** | **Religious duty** | **Each sign ÷ 20** | **BPHS 26** |
| **D24** | **Chaturvimshamsha** | **Education, Speech** | **Learning, speech** | **Each sign ÷ 24** | **Choudhry p.7** |
| **D27** | **Saptavimshamsha** | **Strength, Health** | **Physical strength** | **Each sign ÷ 27** | **Choudhry p.7** |
| **D30** | **Trimsamsha** | **Misfortune, Challenges** | **Obstacles** | **Each sign ÷ 30** | **Choudhry p.7** |

**Note**: D1 (Rasi) and D9 (Navamsha) already implemented. This phase adds 12 new charts.

---

## IMPLEMENTATION CHECKLIST

### PHASE 28.1: Code Implementation
- [ ] Read BPHS Ch.26 + Choudhry pp.1-20 (division math)
- [ ] Update `src/chart/vargaChart.js`:
  - [ ] Extract division ratio function: `getDivisionRatio(chartCode)` → returns divisor
  - [ ] For each D-chart: `calculateVargaChart(natalChart, chartCode)` 
  - [ ] For each planet: calculate exact degree → within sign ÷ divisor → map to new sign
  - [ ] Test against worked examples from books
- [ ] Create test data for all 14 charts (3+ examples each = 42+ test cases)

### PHASE 28.2: Tests (Target: 120+ new tests)
- [ ] Unit tests per chart type (D2, D3, D4, D5, D7, D10, D12, D16, D20, D24, D27, D30)
- [ ] Cross-validation: Compare our D-chart calculations vs PL9 output
- [ ] Edge cases: Planets at sign boundaries, retrograde planets in vargas
- [ ] Regression: Ensure all 98 existing tests still pass

### PHASE 28.3: UI Integration
- [ ] Create chart display component (`VargasUIComponent`)
  - Tabular view: D1, D2, D3... D30 as separate tabs
  - Graphical view: Chakra/wheel format for each
- [ ] Add to Solutions widget if applicable
- [ ] Mobile responsive design

### PHASE 28.4: Ashtakavarga Variations (Sub-Phase)
- [ ] Bhinnashtaka #1 (Sun's 8-point chart per BPHS 25)
- [ ] Bhinnashtaka #2 (Planet-wise 8-point charts)
- [ ] Sarvashtaka (composite all-points table)
- [ ] Chancha Chakra (reduction visualization)
- [ ] Tests: 40+ cases

---

## DIVISION RULES (MATH)

### Example: D2 (Hora) — Each sign ÷ 2
```
If natal planet is at 15° Aries:
- Aries = 0°-30° (full sign)
- Hora division: 0°-15° → Aries, 15°-30° → Taurus
- 15° Aries = Start of 2nd half = Taurus Hora ✓

If natal planet is at 25° Aries:
- 25° is in 2nd half (15°-30°) → Taurus Hora ✓
```

### Example: D3 (Drekkana) — Each sign ÷ 3
```
If natal planet is at 12° Aries:
- Aries = 0°-30° (full sign)
- Drekkana division: 0°-10° → Aries, 10°-20° → Gemini (next odd sign), 20°-30° → Leo
- 12° Aries = in 2nd drekkana (10°-20°) → Gemini Drekkana ✓
```

### General Algorithm
```javascript
function getVargaSign(natalLongitude, divisor, chartCode) {
  const natalSignIndex = Math.floor(natalLongitude / 30); // 0=Aries, 1=Taurus, etc.
  const degreeInSign = natalLongitude % 30; // 0-30 degrees within sign
  const vargaDegree = degreeInSign * divisor; // Multiply by divisor
  const vargaIndex = Math.floor(vargaDegree / 30); // Which varga within the divisor
  
  // Map back to zodiac sign (varies by chart type)
  return mapVargaToSign(natalSignIndex, vargaIndex, divisor);
}
```

---

## TESTING STRATEGY

### Test Data Sources
1. **PL9 Output** — Run sample charts through PL9, extract D2-D30 values
2. **Book Examples** — Work examples from Choudhry, Sharma, Charak books
3. **Cross-Reference** — Compare our output vs PL9 for accuracy

### Test File
```bash
test-divisional-charts.js
├── testD2Hora()
├── testD3Drekkana()
├── testD4Chaturthamsha()
├── testD5Panchamsha()
├── testD7Saptamsha()
├── testD10Dasamsha()
├── testD12Dvadashamsha()
├── testD16Shodashamsha()
├── testD20Vimshamsha()
├── testD24Chaturvimshamsha()
├── testD27Saptavimshamsha()
├── testD30Trimsamsha()
└── testAshtakavargaVariations()
```

---

## NEXT STEPS (IMMEDIATE)

1. **Open PL9** → Charts → Vargas I (screenshot the UI layout)
2. **Read** BPHS Ch.26 + Choudhry pp.1-50 (division rules)
3. **Implement** D2, D3, D4 first (simplest)
4. **Test** those 3 against PL9
5. **Implement** remaining charts (D5, D7, D10, D12, D16, D20, D24, D27, D30)
6. **Run full test suite** (120+ cases)
7. **Build UI** for tabular + graphical display

---

## TIMELINE

```
Day 1-2:   Study sources + extract division rules
Day 3-4:   Implement D2, D3, D4, D5, D7
Day 5-6:   Implement D10, D12, D16, D20, D24, D27, D30
Day 7-8:   Write comprehensive tests (120+ cases)
Day 9-10:  Ashtakavarga variations
Day 11-12: UI implementation
Day 13-14: Bug fixes, cross-validation, final polish
```

---

## SUCCESS CRITERIA

✅ All 12 new divisional charts implemented  
✅ 120+ test cases passing  
✅ Zero regressions in existing 98 tests  
✅ PL9 cross-validation within ±1° tolerance  
✅ UI matches PL9 "Vargas I" layout  
✅ Source cited in every function and test  

---

## DEFERRED (NOT FOR PHASE 28)

❌ KP Astrology (Krishnamurti Paddhati) — separate system per PLAN-001  
❌ Jaimini Charaka, Arudhas — deferred per PLAN-001  
❌ Interpretation rules (yogas in vargas) — Phase 29+  

---

**Status**: Ready to begin 🎯  
**Command to start**: Begin implementation of D2 (Hora) chart  

