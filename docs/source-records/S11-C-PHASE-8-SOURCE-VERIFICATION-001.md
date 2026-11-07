# Phase 8: Strength-Based Yoga Conditions — Source Verification

**Stage**: S11 (Yoga Refinements & Cancellation Rules)  
**Phase**: 8 (Strength-Based Yoga Condition Refinement)  
**Date**: 2026-09-06  
**Status**: Implementation  

---

## Overview

Phase 8 refines all 14 lunar-solar and 15 wealth yogas by integrating planetary strength scores (Phase 7) as conditional gates and effect modifiers. Yogas form more reliably when involved planets are strong, and effects scale with strength.

---

## Strength-Based Conditions by Yoga Type

### Lunar Yogas

**Sunapha/Anapha (Mercury-flanked)**: 
- Form if Mercury strength ≥ 50
- Effects scale: +20% per 10 strength points above 50

**Vesi/Vosi (Benefic in 12th/2nd from Sun)**:
- Form if Sun strength ≥ 40
- Effects enhanced if flanking benefic strength ≥ 55

**Adhi Yoga (Benefics in 6-7-8)**:
- Form if Moon strength ≥ 45
- Intensity bonus if benefics have avg strength ≥ 60

**Kemadruma (No benefic near Moon)**:
- Intensity reduced if Jupiter strength ≥ 55 (existing cancellation)
- Mitigation bonus if trine benefic strength ≥ 60

### PMP Yogas

**Ruchaka (Mars)**:
- Form if Mars strength ≥ 55 (requires exaltation/own + angular)
- Effects scale with Mars strength

**Bhadra (Mercury)**:
- Form if Mercury strength ≥ 50
- Enhanced if Jupiter aspect + strength ≥ 60

**Hamsa (Jupiter)**:
- Form if Jupiter strength ≥ 60 (high bar for exaltation)
- Effects: Exceptional only if strength ≥ 75

**Malavya (Venus)**:
- Form if Venus strength ≥ 55
- Effects scale with Venus strength

**Sasa (Saturn)**:
- Form if Saturn strength ≥ 50
- Effects: Strong only if strength ≥ 65

### Wealth Yogas

**Dhanayoga (2nd & 11th lords in angles)**:
- Form if both lords ≥ 50 strength (currently: just angular)
- Severity enhanced if both ≥ 65

**Labha Yoga (11th lord in 1/5/9)**:
- Form if 11th lord strength ≥ 45
- Effects: Strong only if ≥ 60

**Other Wealth Yogas**:
- Apply minimum strength gates (40-50 range)
- Effects weighted by lord strength

---

## Implementation Pattern

Same as Phase 4-5: 
1. Detection unchanged (pure functions)
2. Post-processing adds strength conditions
3. `refineYogasByStrength()` helper integrates Phase 7 scores
4. Returns enriched copy with strength gates applied

---

## Calculation Formula

```
Yoga.canFormWithStrength = (
  Yoga.detectionResult AND
  PrimaryPlanetStrength ≥ MinimumStrengthThreshold
)

Yoga.effectsWithStrength = (
  BaseEffects +
  StrengthScaling(PlanetStrength)
)
```

---

## Test Strategy

**18 comprehensive tests**:
- ✓ Lunar yoga strength gates: 5 tests
- ✓ PMP yoga strength gates: 5 tests
- ✓ Wealth yoga strength gates: 4 tests
- ✓ Effect scaling: 4 tests

---

## Source Attribution

BPHS Ch. 2-4 (planet strength determines yoga manifestation)
BPHS Ch. 26-27 (Shadbala as yoga condition)
