# TRACK A: ASHTAKAVARGA VARIATIONS IMPLEMENTATION

**Status**: STARTING  
**Date**: 2026-09-07  
**Approach**: Implement → Validate vs PL9 → Refine

---

## STEP 1: UNDERSTAND PL9 ASHTAKAVARGA OUTPUT

### What we need to see in PL9:
1. Open PL9 (C:\GeoVision\PL9\PL9.exe)
2. Load sample chart
3. Go to: Reports → Calculations → Ashtakavarga (all variations)
4. Compare:
   - Bhinnashtaka #1 (Sun's 8-point chart)
   - Bhinnashtaka #2 (detailed planet-wise)
   - Ashtakavarga Summary (total bindus per house)
   - Ashtakavarga Reductions
   - Sarvashtaka & Chancha Chakra

### Key Questions to Answer:
- How does PL9 display Bhinnashtaka variants?
- What exactly is "Ashtakavarga Reductions"?
- How is Chancha Chakra calculated?
- Transit ashtakavarga - how is it shown?

---

## STEP 2: SOURCE DOCUMENTATION

### Primary Source: Vinay Aditya - Practical Ashtakavarga

File: D:\1\astro books english\Yogas\Jyotish_2011_Vinay Aditya_Practical Ashtakavarga.pdf

Pages to read:
- Pages 1-50: Bhinnashtaka theory + variants
- Pages 51-100: Reduction rules (dasha lord influence)
- Pages 101-150: Chancha Chakra (house visualization)
- Pages 151-200: Transit ashtakavarga

### Secondary Sources:
- Yogarnava (800 Yogas) - reduction formulas
- BPHS Ch.25 - foundational rules

---

## STEP 3: WHAT TO IMPLEMENT

### 3.1 Bhinnashtaka Variations
Current: `calculateBhinnashtakavarga(planet, rasiPositions)` → returns [0-12] bindus per house

Need:
- [ ] `calculateBhinnashtaka_Type1(planet)` - Sun's special 8-point chart
- [ ] `calculateBhinnashtaka_Type2(planet)` - Detailed variant
- [ ] Tests: 20+ cases per variant

### 3.2 Ashtakavarga Reductions
Current: None (not implemented)

Need:
- [ ] `calculateAshtakavargaReductions(chart, dashaInfo)` 
- [ ] Point loss based on dasha lord position
- [ ] Formula: Base bindus - (dasha lord strength factor)
- [ ] Tests: 30+ cases

### 3.3 Chancha Chakra
Current: None

Need:
- [ ] `calculateChanchChakra(sarvashtaka)` 
- [ ] Convert 12-house bindus → reduced chakra values
- [ ] House-based grouping (1-4, 5-8, 9-12)
- [ ] Tests: 20+ cases

### 3.4 Transit Ashtakavarga
Current: None

Need:
- [ ] `calculateTransitAshtakavarga(natalChart, transitChart)`
- [ ] Apply current planetary positions to bindu grid
- [ ] Overlay format
- [ ] Tests: 25+ cases

**Total new code**: ~500-700 lines  
**Total new tests**: 95-100 tests  
**Target completion**: 5-7 days

---

## STEP 4: PL9 CROSS-VALIDATION CHECKLIST

For each implementation:
- [ ] Run sample chart through PL9
- [ ] Capture PL9 output (screenshot)
- [ ] Compare with our calculation
- [ ] Document any differences
- [ ] Update algorithm if needed
- [ ] Re-test until ±1° tolerance

### Sample Charts to Test:
1. Aries Ascendant, all planets in own signs
2. Pisces Ascendant, all planets in exaltation
3. Complex multi-planet chart
4. Chart with retrograde planets
5. Chart with planets at sign boundaries

---

## IMPLEMENTATION ORDER

```
Day 1: Read sources + understand formulas
Day 2: Implement Bhinnashtaka variants
Day 3: Test + PL9 validation (Bhinnashtaka)
Day 4: Implement Reductions algorithm
Day 5: Test + PL9 validation (Reductions)
Day 6: Implement Chancha Chakra
Day 7: Implement Transit Ashtakavarga + Final testing
```

---

## FILES TO CREATE/MODIFY

**New Files**:
- `src/chart/ashtakavargaVariations.js` (new)
- `test-ashtakavarga-variations.js` (new)

**Modify**:
- `src/chart/ashtakavarga.js` - export new functions
- `package.json` - add test script

---

## SUCCESS CRITERIA

✅ 95+ new tests passing  
✅ PL9 cross-validation complete  
✅ All 4 variations implemented (Bhinnashtaka #1/#2, Reductions, Chancha, Transit)  
✅ Source cited in code  
✅ Ready for UI layer (Track B)

---

**Ready to start? Begin with opening PL9 and reading Vinay Aditya book.**

