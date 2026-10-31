# PL9 VALIDATION CHECKLIST - Phase 28.2

**Objective**: Compare our Ashtakavarga variations with PL9 output

**Status**: READY TO RUN  
**Date**: 2026-09-07  

---

## STEP-BY-STEP VALIDATION PROCESS

### STEP 1: OPEN PL9 & LOAD SAMPLE CHART

**Instructions**:
1. Open PL9: `C:\GeoVision\PL9\PL9.exe`
2. Create NEW chart with these details:
   ```
   Name: Test-Chart-1
   Birth Date: 1990-06-21
   Birth Time: 12:00:00 PM
   Birth Place: Shillong, India (Lat: 25.57, Long: 91.88)
   ```
3. Click OK to calculate

**Why this chart?**: It's from Vinay Aditya's own book example (page 54-55), so we can cross-verify exactly.

---

### STEP 2: EXTRACT PLANETARY POSITIONS

After chart loads:
1. Go to: **Charts → Birth Chart I**
2. Note down all planet positions (we need Rasi indices 0-11)
3. Also note: Lagna position

**Record format**:
```
Sun:       Aries (0) / 3° 25'
Moon:      Scorpio (7) / 15° 10'
Mars:      Gemini (2) / 22° 45'
Mercury:   Cancer (3) / 18° 30'
Jupiter:   Taurus (1) / 8° 20'
Venus:     Pisces (11) / 10° 15'
Saturn:    Virgo (5) / 12° 00'
Lagna:     Capricorn (9) / 15° 30'
```

---

### STEP 3: GET ASHTAKAVARGA - BHINNASHTAKA

**In PL9**:
1. Go to: **Reports → Calculations → Ashtakavarga - Bhinnashtaka #1**
2. Screenshot or note the table showing:
   - Sun's Bhinnashtakavarga (12-house grid with bindus 0-8 per house)
   - Total bindus for each house

**We will compare**: Our `calculateBhinnashtaka_Type1_Sun()` output vs PL9

**Example format you'll see**:
```
House  | Bindus
-------|-------
1      | 5
2      | 4
3      | 3
4      | 6
... (total 12 houses)
```

---

### STEP 4: GET ASHTAKAVARGA - REDUCTIONS

**In PL9**:
1. Go to: **Reports → Calculations → Ashtakavarga Reductions**
2. Note the current dasha information shown
3. Note which bindus are reduced in each house
4. Calculate reduction factor per house

**We will compare**: Our `calculateAshtakavargaReductions()` algorithm

---

### STEP 5: GET SARVASHTAKAVARGA & CHANCHA CHAKRA

**In PL9**:
1. Go to: **Reports → Calculations → Ashtakavarga - Sarvashtaka & Chancha Chakra**
2. Note:
   - Total bindus per house (0-56 scale, sum of all 7 planets)
   - Chancha Chakra breakdown:
     - Kendra (houses 1,4,7,10) = total
     - Panapara (houses 2,5,8,11) = total
     - Apoklima (houses 3,6,9,12) = total

**We will compare**: Our `calculateChanchChakra()` output

---

### STEP 6: DOCUMENT RESULTS

For each feature tested, record:
```
Feature: Bhinnashtaka Type 1 (Sun's chart)
PL9 Total Bindus: [number]
Our Total Bindus: [number]
Difference: [±number]
Tolerance: ✅ Pass (within ±1) / ❌ Fail
Notes: [any observations]
```

---

## SAMPLE CHART DATA (From Vinay Aditya, p.54-55)

If using the book's example chart:

**Shillong, India - 2009-06-21, 12:00 PM**

Expected positions (approximate):
- Sun: Gemini 5°
- Moon: Libra 18°
- Mars: Aries 22°
- Mercury: Cancer 16°
- Jupiter: Aquarius 10°
- Venus: Cancer 3°
- Saturn: Virgo 28°
- Lagna: Gemini 12°

Expected Sarvashtakavarga Bindus (approx):
- House 1-12 should total around 337 (±5)

---

## VALIDATION THRESHOLD

✅ **PASS** if:
- Bhinnashtaka Type 1 total within ±1 bindu of PL9
- Reductions algorithm matches PL9 logic
- Chancha Chakra sums match exactly (math-based)
- Transit overlay classifications match

❌ **FAIL** if:
- Total bindus differ by >2 from PL9
- Reduction formula is fundamentally different
- House grouping is wrong

---

## FILES TO USE FOR COMPARISON

After getting PL9 data, we'll:
1. Input your noted positions into `test-ashtakavarga-variations.js`
2. Run our functions with exact same positions
3. Compare outputs line-by-line

---

## QUICK REFERENCE: OUR IMPLEMENTATIONS

**Bhinnashtaka Type 1 (Sun)**
```javascript
const sunBhinnaType1 = calculateBhinnashtaka_Type1_Sun(rasiPositions);
// Returns: [12-element array of bindus 0-8 per house]
```

**Reductions**
```javascript
const reduced = calculateAshtakavargaReductions(
  sarvaAshtakavarga,  // [32, 28, 25, ...]
  dashaLordPosition,  // 0-11
  dashaLordStrength   // 0-100
);
```

**Chancha Chakra**
```javascript
const chakra = calculateChanchChakra(sarvaAshtakavarga);
// Returns: { kendra, panapara, apoklima, total, strength }
```

---

## NEXT ACTIONS (For User)

1. ✅ **THIS SESSION**: Open PL9, load test chart, screenshot ashtakavarga outputs
2. ⏳ **NEXT**: Send me the data, I'll compare & validate
3. ⏳ **THEN**: Fix any algorithm differences found
4. ⏳ **FINALLY**: Move to Track B (UI Display)

---

**Ready? Open PL9 and follow STEP 1 above.**

