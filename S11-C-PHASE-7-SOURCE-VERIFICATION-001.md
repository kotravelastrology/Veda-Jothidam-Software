# Phase 7: Planetary Strength Index — Source Verification

**Stage**: S11 (Yoga Refinements & Cancellation Rules)  
**Phase**: 7 (Planetary Strength Index Calculation)  
**Date**: 2026-09-06  
**Status**: Planning & Source Review  

---

## Overview

Phase 7 implements a comprehensive planetary strength index that aggregates multiple strength components into a single 1-100 strength score for each planet. This enables:
- Comparative planet strength assessment
- Strength-based yoga condition refinement
- Prediction period strength evaluation
- Chart quality metrics

---

## Strength Components (Total: 100 points)

### 1. Exaltation Component (30 points max)

**BPHS Chapter 31, Shadbala system**:
- **Exalted**: +30 points (supreme strength)
- **Own sign**: +15 points (strong)
- **Friend's sign**: +5 points (moderate)
- **Neutral sign**: 0 points
- **Enemy's sign**: −10 points (weak)
- **Debilitated**: −30 points (very weak)

**Calculation**: Based on planet's zodiacal sign position

### 2. House Component (20 points max)

**BPHS Chapter 12, house strength**:
- **Angular houses (1,4,7,10)**: +20 points (maximum)
- **Trinal houses (5,9)**: +10 points (good)
- **Upachaya houses (3,6,11)**: +5 points (gradual improvement)
- **Trika houses (8,12)**: −15 points (afflicted)
- **Other (2,3,11)**: +0 points (neutral)

**Calculation**: Based on planet's house placement

### 3. Aspect Component (25 points max)

**BPHS Chapter 11-12, planetary aspects**:
- **Received benefic aspects**: +5 per aspect (max +25 from 5 benefics)
- **Received malefic aspects**: −5 per aspect (max −25 from 5 malefics)
- **Net aspect bonus**: Sum of benefic − malefic aspects

**Calculation**: From aspect matrix (Phase 6)

### 4. Sign Strength Component (15 points max)

**BPHS Rasi system**:
- **Own sign**: +15 points
- **Exaltation sign**: +15 points (included in exaltation)
- **Friend's sign (classical)**: +5 points
- **Neutral sign**: 0 points
- **Enemy's sign**: −5 points
- **Debilitation sign**: −15 points (included in exaltation)

**Calculation**: Based on sign ruler and planetary friendship

### 5. Nakshatra Strength Component (10 points max)

**BPHS Nakshatra lords**:
- **Planet in own nakshatra**: +10 points (maximum)
- **Planet in benefic nakshatra**: +5 points
- **Planet in neutral nakshatra**: 0 points
- **Planet in malefic nakshatra**: −5 points

**Calculation**: Based on nakshatra position

---

## Strength Score Interpretation

**100-point scale**:
- **81-100**: Exceptionally strong (yoga-forming power, major period effects)
- **61-80**: Very strong (yoga formation assistance, good dasha results)
- **41-60**: Moderate strength (mixed results, conditional effects)
- **21-40**: Weak (minimal yoga contribution, challenging dasha)
- **1-20**: Very weak (obstacles, affliction, restrictive dasha)
- **0 or less**: Severely afflicted (major obstacles)

---

## Calculation Algorithm

```
PlanetaryStrength = 
  ExaltationComponent(−30 to +30) +
  HouseComponent(−15 to +20) +
  AspectComponent(−25 to +25) +
  SignStrengthComponent(−15 to +15) +
  NakshatraComponent(−5 to +10) +
  50 (baseline offset to get 1-100 scale)
```

**Clipping**: Final score clamped to 0-100 range

---

## Implementation Details

### 1. Exaltation Component Calculator

```
function getExaltationComponent(planet, planetPos)
  // Check if exalted/own sign/debilitated
  // Return -30 to +30 value
```

### 2. House Component Calculator

```
function getHouseComponent(planet, house)
  // Angular/trinal/dusthana/trika
  // Return -15 to +20 value
```

### 3. Aspect Component Calculator

```
function getAspectComponent(chart, planet, aspectMatrix)
  // Sum benefic aspects - malefic aspects
  // Return -25 to +25 value
```

### 4. Sign Strength Calculator

```
function getSignStrengthComponent(planet, planetPos)
  // Own/friend/enemy sign
  // Return -15 to +15 value
```

### 5. Nakshatra Component Calculator

```
function getNakshatraComponent(planet, planetPos)
  // Own/benefic/malefic nakshatra
  // Return -5 to +10 value
```

### 6. Overall Strength Index

```
function calculatePlanetaryStrength(chart, planet, aspectMatrix)
  // Aggregate all components
  // Return 0-100 strength score
```

---

## Output Structure

```javascript
{
  planetaryStrengths: {
    'Sun': {
      totalStrength: 72,
      components: {
        exaltation: 15,
        house: 20,
        aspect: 12,
        sign: 10,
        nakshatra: 5
      },
      rating: 'Very Strong',
      description: 'Sun in own sign (Leo) in angular house with benefic aspects'
    },
    'Moon': { ... },
    ...
  },
  summary: {
    strongestPlanet: 'Jupiter (89)',
    weakestPlanet: 'Saturn (28)',
    averageStrength: 58.4,
    beneficStrengthTotal: 245,
    maleficStrengthTotal: 145
  }
}
```

---

## Test Strategy

**22 comprehensive tests** covering:
- ✓ Exaltation component: 6 tests (exalted, own, debilitated, friend, enemy, neutral)
- ✓ House component: 5 tests (angular, trinal, upachaya, trika, neutral)
- ✓ Aspect component: 4 tests (benefic, malefic, mixed, no aspects)
- ✓ Sign strength: 3 tests (own, friend, enemy)
- ✓ Complete strength index: 3 tests (calculation, rating, summary)
- ✓ Edge cases: 1 test

---

## Classical Source Attribution

All strength calculations sourced from:
- **BPHS Chapter 2-4**: Rasi/sign strength (exaltation, debilitation, own signs)
- **BPHS Chapter 11-12**: Planetary aspects and house strength
- **BPHS Chapter 26-27**: Shadbala (six-fold strength system)
- **Classical commentary**: Nakshatra lord strength rules

**Verses to verify**:
- Exaltation: BPHS 2:1-30
- House strength: BPHS 12:1-30
- Aspects: BPHS 11:1-50
- Shadbala: BPHS 26:1-100

---

## Integration with Prior Phases

**Uses Phase 6 (Aspect Matrix)**:
- Aspect component from calculateAspectMatrix()
- Benefic/malefic aspect classification
- Aspect strength values

**Feeds Phase 8+ (Advanced Analysis)**:
- Planetary strength as yoga condition modifier
- Strength-based dasha analysis
- Chart quality metrics

---

## Deliverables Checklist

- [ ] Planetary strength calculation engine
- [ ] 5 component calculators (exaltation, house, aspect, sign, nakshatra)
- [ ] 22 comprehensive tests passing
- [ ] All 7 planets with complete strength scores
- [ ] Rating system (Exceptionally Strong to Severely Afflicted)
- [ ] Integration with aspect matrix from Phase 6
