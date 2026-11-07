# Phase 30.9: Chart Comparison & Advanced Reports
**Date**: 2026-09-07  
**Status**: PLANNING  
**Duration**: 4-5 days  

---

## 🎯 OBJECTIVES

1. **Chart Comparison Engine** — Compare 2+ charts side-by-side
2. **Advanced Report Generation** — Customizable astrology reports
3. **Comparative Analysis** — Aspect overlays, strength differentials, compatibility metrics

---

## 📋 SCOPE

### Task 1: Dual-Chart Display (2 days)
- Create ChartComparisonDisplay component
- Support native + transit overlay
- Support native + partner (synastry)
- Support historical chart comparison

### Task 2: Comparative Metrics (2 days)
- Shadbala strength differential
- Aspect compatibility matrix
- Planetary friendship comparison
- Dasha period overlap analysis

### Task 3: Report Builder Enhancement (1 day)
- Generate comparison reports
- PDF export support
- Print-friendly formatting
- Custom section selection

---

## 🏗️ ARCHITECTURE

```
ChartComparison/
├── ChartComparisonDisplay.tsx    (Main component)
├── DualShadBalaComparison.tsx   (Side-by-side strength)
├── AspectOverlayRenderer.tsx     (Aspect comparison)
├── CompatibilityMatrix.tsx       (Aspect compatibility)
├── DashaOverlapAnalysis.tsx      (Timeline comparison)
└── ComparisonReporter.tsx        (Report generation)
```

---

## 🔄 DATA FLOW

```
Two Charts Selected
  ↓
[ChartComparisonDisplay]
  ├─→ [DualShadBalaComparison] → Strength comparison
  ├─→ [AspectOverlayRenderer] → Planetary positions
  ├─→ [CompatibilityMatrix] → Aspect strength matrix
  └─→ [ComparisonReporter] → Generate report
```

---

## ✨ KEY FEATURES

1. **Dual Shadbala** — Compare 6-component strength side-by-side
2. **Aspect Overlays** — Show aspects between two charts
3. **Compatibility Scoring** — Quantify chart compatibility
4. **Dasha Overlap** — Show dasha periods for both natives
5. **Strength Differential** — Identify planetary imbalances
6. **Report Export** — Generate printable/PDF reports

---

## 📊 COMPARISON TYPES

1. **Native + Transit** (Predictive)
   - Current planetary transits on natal chart
   - Transit impact analysis
   - Beneficial/malefic periods

2. **Native + Partner** (Synastry)
   - Relationship compatibility
   - Guna Milan scoring
   - Strength imbalances
   - Growth periods

3. **Native + Annual** (Varshaphala)
   - Annual chart comparison
   - Period-by-period analysis
   - Yearly prediction

4. **Historical Comparison** (Rectification)
   - Compare different birth times
   - Identify most accurate time
   - Chart sensitivity analysis

---

## 🔗 CLASSICAL SOURCES

- **BPHS Ch.39** — Synastry & couple analysis
- **BPHS Ch.27** — Shadbala comparison metrics
- **Hora Sara Ch.34** — Varshaphala overlays
- **Jaimini Sutras** — Comparative dasha analysis

---

**Ready to implement?**
