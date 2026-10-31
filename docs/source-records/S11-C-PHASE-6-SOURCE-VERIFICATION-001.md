# Phase 6: Aspect Matrix Engine — Source Verification

**Stage**: S11 (Yoga Refinements & Cancellation Rules)  
**Phase**: 6 (Aspect Matrix Calculation Engine)  
**Date**: 2026-09-06  
**Status**: Planning & Source Review  

---

## Overview

Phase 6 implements a comprehensive aspect matrix engine that calculates the strength of all planetary aspect relationships. This engine provides:
- 49 aspect pairs (7 planets × 7 planets)
- Aspect strength scoring (-3 to +3 scale)
- Exaltation/debilitation modifiers
- Angular/trinal house multipliers
- Complete aspect matrix output for chart analysis

---

## Classical Source: Vedic Aspects (Drishti)

**BPHS Chapter 11-12**: Planetary Aspects
- All 7 planets have specific aspect ranges (graha drishti)
- Mars, Jupiter, Saturn have special 7-view, 5-view, 3-view aspects
- Mercury, Venus, Sun, Moon have standard 7th-house aspects
- Aspect strength varies by planet dignity and angular position

---

## Aspect Strength Calculation

### 1. Base Aspect Validity

**Vedic Aspects (BPHS Ch. 12)**:
- **Sun**: Aspects 7th house only
- **Moon**: Aspects 7th house only
- **Mars**: Aspects 4th, 8th, 7th houses (special 7-view)
- **Mercury**: Aspects 7th house only
- **Jupiter**: Aspects 5th, 9th, 7th houses (special 5-view, 9-view)
- **Venus**: Aspects 7th house only
- **Saturn**: Aspects 3rd, 10th, 7th houses (special 3-view, 10-view)

### 2. Aspect Strength Scale

**Benefic Aspects (planets aspecting beneficially)**:
- **Strength +3**: Aspecting planet exalted/own sign + aspected planet angular
- **Strength +2**: Aspecting planet exalted/own sign OR aspected planet angular
- **Strength +1**: Standard aspect (no special conditions)

**Malefic Aspects (planets aspecting maleficially)**:
- **Strength -3**: Aspecting planet exalted/own sign + aspected planet in 6/8/12 (afflicted)
- **Strength -2**: Aspecting planet exalted/own sign OR aspected planet in 6/8/12
- **Strength -1**: Standard malefic aspect

**Classification by Planet Nature**:
- **Benefics**: Jupiter, Venus, Mercury (waxing Moon)
- **Malefics**: Mars, Saturn, Sun
- **Neutral**: Moon (varies by phase)

### 3. Exaltation/Debilitation Modifiers

**For Aspecting Planet**:
- Exalted: +1 modifier to aspect strength
- Own sign: +0.5 modifier
- Debilitated: -1 modifier to aspect strength
- Enemy sign: -0.5 modifier

**For Aspected Planet**:
- Angular house (1,4,7,10): +1 modifier (receives aspects better)
- Trinal house (5,9): +0.5 modifier
- Dusthana (6,8,12): -1 modifier (afflicted by aspects)
- Other houses: 0 modifier

### 4. Angular/Trinal House Bonus

**Aspected Planet House Strength**:
- **Angular houses (1,4,7,10)**: Receives all aspects at full strength
- **Trinal houses (5,9)**: Receives aspects at 80% strength (0.8x multiplier)
- **Dusthana (6,8,12)**: Highly afflicted (1.2x malefic multiplier, 0.8x benefic multiplier)
- **Other (2,3,11)**: Neutral (1.0x multiplier)

### 5. Retrograde Planet Adjustment

**Retrograde planets** (when applicable):
- Retrograde benefic: aspect strength +1
- Retrograde malefic: aspect strength -1 (stronger affliction)

---

## Matrix Output Structure

```javascript
{
  matrix: [
    // 7x7 grid of aspect strengths
    [Sun→Sun, Sun→Moon, Sun→Mercury, ..., Sun→Saturn],
    [Moon→Sun, Moon→Moon, ..., Moon→Saturn],
    ...
    [Saturn→Sun, Saturn→Moon, ..., Saturn→Saturn]
  ],
  aspectDetails: {
    'Sun-Jupiter': {
      aspecting: 'Sun',
      aspected: 'Jupiter',
      baseStrength: 1,
      isBenefic: true,
      aspectingPlanetModifier: 0.5, // Sun in own sign
      aspectedPlanetModifier: 1,    // Jupiter in angular
      houseMultiplier: 1.0,
      retrogradeAdjustment: 0,
      finalStrength: 2.5
    },
    ...
  },
  summary: {
    totalBeneficAspects: 18,
    totalMaleficAspects: 15,
    netAspectStrength: +12,
    strongestBeneficAspect: 'Jupiter-Venus (+3)',
    strongestMaleficAspect: 'Saturn-Moon (-3)'
  }
}
```

---

## Implementation Details

### 1. Aspect Validity Function

```
function isValidAspect(aspectingPlanet, aspectedPlanet, aspectingHouse, aspectedHouse)
  // Check if planets can form valid Vedic aspect
  // Return boolean
```

### 2. Aspect Strength Calculator

```
function calculateAspectStrength(chart, aspectingPlanet, aspectedPlanet)
  // Calculate base strength + modifiers + bonuses
  // Return -3 to +3 value
```

### 3. Modifier Functions

```
function getPlanetModifier(planet, planetPos)
  // Exaltation/debilitation/own sign bonus
  
function getHouseModifier(planet, house)
  // Angular/trinal/dusthana bonus
```

### 4. Matrix Generator

```
function calculateAspectMatrix(chart)
  // Generate 7x7 matrix + detailed aspects
  // Return complete aspect report
```

---

## Test Strategy

**22 comprehensive tests** covering:
- ✓ Benefic aspect strength: 8 tests (Jupiter/Venus/Mercury aspects)
- ✓ Malefic aspect strength: 8 tests (Mars/Saturn aspects)
- ✓ Exaltation/debilitation modifiers: 3 tests
- ✓ Angular/trinal/dusthana house multipliers: 3 tests
- ✓ Complete matrix generation: 2 tests
- ✓ Edge cases: 2 tests

---

## Classical Source Attribution

All aspects sourced from:
- **BPHS Chapter 11-12**: Planetary Aspects (graha drishti)
- **BPHS Ch. 12 Verses 1-30**: Specific aspect rules per planet
- **Traditional commentaries**: Aspect strength scoring based on planet dignity

**Verses to verify**:
- Mars aspects: BPHS 12:1-5
- Jupiter aspects: BPHS 12:6-10
- Saturn aspects: BPHS 12:11-15
- Other planets: BPHS 12:16-20

---

## Integration Points

This engine will enhance:
- All future yoga detections (aspects as conditions)
- Planetary strength assessments
- Chart quality analysis
- Dasha period evaluations

---

## Deliverables Checklist

- [ ] Aspect matrix calculation engine
- [ ] 22 comprehensive tests passing
- [ ] All 49 aspect pairs validated
- [ ] Modifier and multiplier systems working
- [ ] Matrix output structure documented
- [ ] Integration test with sample charts
