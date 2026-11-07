# Phase 10: Yoga Severity Analysis — Source Verification

**Stage**: S11 (Yoga Refinements & Impact Classification)  
**Phase**: 10 (Yoga Severity & Impact Ranking)  
**Date**: 2026-09-06  
**Status**: Research & Implementation

---

## Overview

Phase 10 assigns impact severity levels to all detected yogas. Rather than treating all yogas equally, this phase ranks them by practical influence on the native's life using a multi-factor calculation that integrates all prior phases (detection, enrichment, strength, cancellation).

Severity scale: **CRITICAL → MAJOR → MODERATE → MINOR → NEGLIGIBLE**

---

## Severity Calculation Framework

### Base Severity (From BPHS)

**CRITICAL Yogas** (BPHS Ch. 31-32):
- Rajayoga (all variants): Transforms life completely
- Adhi Yoga: Major fortune, prosperity, leadership
- Sunapha/Anapha: Mercury-strong combinations
- Hamsa/Malavya: Strong benefic combinations

**MAJOR Yogas** (BPHS Ch. 32-34):
- Vesi/Vosi: Sun-Mercury combinations
- Ruchaka/Bhadra/Sasa: Mars/Mercury/Saturn strong placements
- Dhanayoga: Wealth formation

**MODERATE Yogas** (BPHS Ch. 34-35):
- Chandraadhi: Moon combination, mixed effects
- Pittadhara: Liver/health related
- Minor wealth yogas

**MINOR Yogas** (BPHS Ch. 36-38):
- Edge case yogas
- Rare planetary combinations
- Specific placement yogas

**NEGLIGIBLE Yogas**:
- Cancelled yogas (Phase 9)
- Yogas with very weak involved planets
- Yogas negated by stronger counter-yogas

---

## Multi-Factor Severity Score

```
SEVERITY_SCORE = (
  BaseWeight(40%) +
  StrengthFactor(35%) +
  CancellationFactor(15%) +
  AspectSupport(10%)
) × Classification_Multiplier

Scale: 0-100
Ratings: 80-100 (CRITICAL), 60-79 (MAJOR), 40-59 (MODERATE), 
         20-39 (MINOR), 0-19 (NEGLIGIBLE)
```

### 1. Base Weight (40%)
**From BPHS classification**:
- CRITICAL yoga base: 100 points
- MAJOR yoga base: 75 points
- MODERATE yoga base: 50 points
- MINOR yoga base: 30 points
- NEGLIGIBLE base: 10 points

**Examples**:
- Rajayoga: 100 base
- Sunapha: 90 base
- Kemadruma: 80 base (adverse)
- Chandraadhi: 50 base
- Edge case: 20 base

---

### 2. Strength Factor (35%)
**Depends on Phase 7 planetary strength**:

**If beneficial yoga**:
- If all planets ≥75 strength: +35 points (exceptional)
- If all planets ≥60 strength: +25 points (strong)
- If all planets ≥50 strength: +15 points (moderate)
- If all planets ≥40 strength: +5 points (weak)
- If any planet <40 strength: -10 points (very weak)

**If adverse yoga** (Kemadruma, Pittadhara):
- If all planets ≥75 strength: +35 points (severe problem)
- If all planets ≥60 strength: +25 points (significant)
- If all planets ≥50 strength: +15 points (notable)
- If weak planets: -20 points (much reduced threat)

---

### 3. Cancellation Factor (15%)
**From Phase 9 cancellation status**:

- If `cancelled === true`: -30 points (completely negated)
- If `cancellationReason` exists: -20 points (partially mitigated)
- If `cancelled === false`: 0 points (full manifestation)

---

### 4. Aspect Support (10%)
**From Phase 6 aspect matrix**:

**Benefic yogas**:
- If strong benefic aspects to yoga planets: +10 points
- If weak benefic aspects: +5 points
- If malefic aspects: -5 points

**Adverse yogas**:
- If benefic aspects to afflicting planet: +10 points (mitigating)
- If malefic aspects reinforce: -5 points (worsening)

---

### 5. Classification Multiplier

**Adjustment based on yoga type**:

**Raja Yogas**: ×1.2 (amplify severity upward)
- Rajayoga, Lakshmi, Saraswati, etc.
- More impactful than base rating suggests

**Adverse Yogas**: ×1.1 (emphasize threat level)
- Kemadruma, Pittadhara, etc.
- Practical impact higher than base

**Neutral Yogas**: ×1.0 (no adjustment)
- Sunapha, Hamsa, etc.
- Rating as-is

**Rare Yogas**: ×0.9 (reduce emphasis)
- Edge cases, uncommon combinations
- Lower practical relevance

---

## Severity Rating Tiers

### CRITICAL (80-100)
**Indicators**:
- Rajayogas with strong planets
- Adhi Yoga manifesting fully
- Major adverse yoga strongly afflicted

**Life Impact**: Transforms circumstances, major career/wealth changes, significant health/relationship effects

**Example**: Rajayoga with Jupiter/Sun both >75 strength, no cancellation → 95 severity

---

### MAJOR (60-79)
**Indicators**:
- Strong benefic combination yogas
- Significant adverse yoga with moderate strength
- Cancellation partially reducing impact

**Life Impact**: Notable effects in specific life area, measurable influence

**Example**: Sunapha with Mercury ≥60 strength, active benefic aspects → 72 severity

---

### MODERATE (40-59)
**Indicators**:
- Benefic yogas with average planetary strength
- Cancelled major adverse yoga
- Multiple minor yogas combined

**Life Impact**: Background influence, noticeable in specific periods

**Example**: Chandraadhi with mixed planetary strengths → 48 severity

---

### MINOR (20-39)
**Indicators**:
- Weak benefic combinations
- Heavily mitigated adverse yoga
- Single factor formation yogas

**Life Impact**: Subtle effects, secondary influence

**Example**: Edge case yoga with weak planetary support → 28 severity

---

### NEGLIGIBLE (0-19)
**Indicators**:
- Cancelled yogas
- Yogas with very weak planets
- Rare combinations with no support

**Life Impact**: Minimal or no practical influence

**Example**: Kemadruma cancelled by Moon in angular house, weak Jupiter → 5 severity

---

## Implementation Pattern

Same as Phases 4-9:
1. **Detection**: Existing yoga detection unchanged
2. **Enrichment**: Phases 4-5 enrich with strength scales
3. **Refinement**: Phases 6-8 add aspect/strength/gates
4. **Cancellation**: Phase 9 applies negation rules
5. **Classification**: Phase 10 calculates severity score (NEW)
6. **Return**: Enriched yoga with severity rating

---

## Output Format

```javascript
{
  yogas: [
    {
      yogaKey: 'RAJAYOGA',
      name: 'Rajayoga',
      effects: '...',
      // ... all Phase 4-9 fields ...
      severity: {
        score: 85,
        rating: 'CRITICAL',
        factors: {
          base: 100,
          strengthFactor: 25,
          cancellationFactor: 0,
          aspectSupport: 10,
          multiplier: 1.2
        },
        breakdown: 'Critical: Rajayoga with strong planets, no cancellation, excellent aspect support'
      }
    }
  ]
}
```

---

## Test Strategy

**20 comprehensive tests**:
- Base severity calculation: 3 tests
- Strength factor integration: 3 tests
- Cancellation factor reduction: 3 tests
- Aspect support modulation: 2 tests
- Classification multiplier: 2 tests
- Rating tier assignment: 3 tests
- Edge cases: 2 tests
- Backward compatibility: 2 tests

---

## Source Attribution

- BPHS Ch. 2-4 (Yoga fundamentals & impact)
- BPHS Ch. 26-27 (Planetary strength system)
- BPHS Ch. 31-38 (Individual yoga effects)
- Jataka Parijata (Impact classification)
- Phaladipika (Predictive intensity)

---

## Integration Points

**Uses**:
- Phase 4-5: Yoga enrichment metadata
- Phase 6: Aspect matrix for support calculation
- Phase 7: Planetary strength scores
- Phase 8: Strength gate status
- Phase 9: Cancellation flags

**Feeds**:
- UI chart report generation (severity badges)
- Prioritization for consultation
- Period analysis (dasha strength calculation)
- Chart quality metrics

---

## Next Steps (Phase 11+)

- Phase 11: Chart Quality Score (aggregate severity metrics)
- Phase 11: Dasha Period Analysis (when yogas activate)
- Phase 12: Varshaphala/Tajika Annual Predictions
- Phase 13: Advanced prediction engine integration
