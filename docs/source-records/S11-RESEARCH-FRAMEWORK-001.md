# S11 — Research & Implementation Framework

## Objective

Systematically aggregate **all available Yoga, Dosha, and Varshaphala sources** from the classical corpus (50+ texts), consolidate them, and implement with proper source citations and no calculation blending.

## Scope

### 1. Raja Yogas (High Priority - Highest Practical Use)
- **BPHS Chapter 39** — Primary source (Parashara's own verses)
- **Cross-reference**: Hora Sara, Saravali, Garga Hora for alternative definitions
- **Aggregation**: Combine all unique Raja Yogas found across texts
- **Estimate**: 50-100 named combinations

### 2. 1001 Yogas
- **BPHS Chapters 6-40+** — Full yoga suite across all chapters
- **Hora Sara** — Own yoga catalog
- **Saravali** — Own yoga catalog
- **Garga Hora** — Own yoga catalog
- **Aggregation**: Master list of ALL unique yogas, mapped to source(s)
- **Note**: This is likely a compilation reference, not a literal "1001" count

### 3. Doshas/Curses (Medium Priority - Important for Affliction Detection)
- **BPHS Chapter 83** — Primary source ("Effects of Curses")
- **Pitra Dosha** — Ancestral curse
- **Deva Dosha** — Divine curse
- **Naga Dosha** — Serpent curse
- **Kanda Dosha** — Thorny yoga
- **Kuja Dosha** — Mars affliction (Mars in 12th/2nd from Moon for marriage)
- **Cross-reference**: Muhurta Chintamani, Kalaprakasika for related afflictions
- **Estimate**: 5-15 major Doshas with multiple variants

### 4. Varshaphala/Tajika (Lower Priority - Conditional on Source Quality)
- **Tajika Neelakanthi** (C26) — Primary Tajika source
- **Tajika Bhushana** (C28) — Secondary Tajika source
- **Tajika Sara** (C29) — Supplementary Tajika source
- **Muhurta Chintamani** (C15) — Annual prediction sections
- **Aggregation**: Year-based prediction methods, transit + dasha overlay
- **Estimate**: Variable scope based on source depth

---

## Research Methodology

### Phase 1: Source Discovery (Agent-driven)
- [ ] Search all 50 texts for "Yoga", "Dosha", "Varshaphala" keywords
- [ ] Extract exact chapter/verse references
- [ ] Document all unique formations
- [ ] Flag cross-references and conflicts

### Phase 2: Source Consolidation (Manual)
- [ ] De-duplicate: same yoga from multiple sources
- [ ] Prioritize: BPHS primary, others as alternatives
- [ ] Conflict resolution: when two sources disagree, document both
- [ ] Missing pieces: flag incomplete definitions

### Phase 3: Implementation Planning
- [ ] For each Yoga type, write detection function signature
- [ ] Document dependencies (Shadbala? Nakshatra? Dasha?)
- [ ] Identify which need new astronomical data
- [ ] Plan test cases with known birth charts

### Phase 4: Implementation & Testing
- [ ] Code detection functions
- [ ] Write unit tests per yoga type
- [ ] Integration tests with full Shadbala
- [ ] Browser verification

---

## Expected Output Structure

### For Raja Yogas
```javascript
// src/chart/rajaYogas.js
const RAJA_YOGAS = {
  ADHI_YOGA: {
    name: "Adhi Yoga",
    formation: "Beneficial planets in angles from Moon",
    source: "BPHS Ch.39 v.X",
    detection: function(chart) { ... }
  },
  VIPREET_RAJAYOGA: {
    name: "Vipreet Raja Yoga",
    formation: "Malefics in 6th/8th/12th from Moon",
    source: "BPHS Ch.39 v.Y",
    detection: function(chart) { ... }
  },
  // ... 50+ total
};
```

### For Doshas
```javascript
// src/chart/doshas.js
const DOSHAS = {
  PITRA_DOSHA: {
    name: "Pitra Dosha",
    formation: "[Rule from source]",
    source: "BPHS Ch.83",
    severity: "major",
    detection: function(chart) { ... }
  },
  // ... 5-15 total
};
```

### For Varshaphala
```javascript
// src/chart/varshaphala.js
const VARSHAPHALA_METHODS = {
  TAJIKA_ANNUAL: {
    name: "Tajika Annual",
    method: "[Tajika method]",
    source: "Tajika Neelakanthi",
    calculation: function(chart, targetYear) { ... }
  },
  // ... 2-5 methods
};
```

---

## Stage Record Template

Each implemented Yoga type will have:
1. **S11-[YOGA_TYPE]-SOURCE-VERIFICATION-001.md** — All sources, cross-references, conflict notes
2. **S11-[YOGA_TYPE]-IMPLEMENTATION-001.md** — Code, tests, findings
3. **test-[yogaType].js** — Unit + integration tests

---

## Integration with Existing Stages

### Already Available (from S10 completion):
- ✅ **Shadbala** (all 7 planets, all 7 components)
- ✅ **Ashtakavarga** (S9)
- ✅ **Vimshottari Dasha** (S7)
- ✅ **Varga charts** (S8)
- ✅ **Birth chart & Bhava** (S6)

### Still Open (may affect some Yoga definitions):
- ❌ **Ishtabala/Kashtabala** (not yet built) — Some yogas reference these
- ⚠️ **Sripati Bhava** (S6 open) — Some yogas check house positions

**Strategy**: Implement yogas that don't depend on open items first. Flag dependencies clearly.

---

## Quality Checklist

Before marking any Yoga type complete:
- [ ] All known sources checked
- [ ] Formations documented with exact verse references
- [ ] Conflicts between sources documented (not hidden)
- [ ] Detection function handles all formation cases
- [ ] Tests cover worked examples AND edge cases
- [ ] Cross-check against PL9 output (UI reference only, not calculation)
- [ ] No calculation logic borrowed from PL9 (BPHS only)
- [ ] Stage record filed with all findings

---

## Success Metrics

| Metric | Target | Status |
|--------|--------|--------|
| Raja Yogas cataloged | 50+ unique | ⏳ Pending |
| Doshas identified | 5-15 major | ⏳ Pending |
| Varshaphala methods | 2-5 variants | ⏳ Pending |
| Source deduplications | 100% | ⏳ Pending |
| Test coverage | 22+ tests pass | ⏳ Pending |
| Build success | All 4 routes prerender | ⏳ Pending |

---

## Estimated Timeline

- **Source Research** (Agent): 15-30 min
- **Source Consolidation** (Manual): 30 min
- **Raja Yogas Implementation** (S11-A): 2-4 hours
- **Doshas Implementation** (S11-B): 1-2 hours
- **Varshaphala Implementation** (S11-C): 2-4 hours (if sourced)

**Total S11 estimated**: 1-2 days of focused work

---

**Status**: Framework prepared. Awaiting agent source research completion. Will proceed with implementation phase by phase as findings arrive.
