# S11 — Comprehensive Implementation Roadmap

Status: **SOURCE RESEARCH COMPLETE.** ~180+ unique yogas cataloged from corpus. Ready for systematic implementation.

Generated: 2026-09-06 | Based on: yoga_dosha_varshaphala_catalog.yaml

---

## Implementation Priority & Phases

### Phase 1: Raja Yogas (S11-A) — 🚀 **START HERE**
**Why First**: Highest practical use, 48 distinct formations, strong customer demand
- **Duration**: 2-4 hours
- **Scope**: BPHS Ch.39 verses 1-48
- **Dependencies**: Shadbala ✅, Vimshottari Dasha ✅, Varga charts ✅
- **Output**: `rajaYogas.js` + tests + stage record
- **Status**: 48 formations cataloged, ready to code

### Phase 2: Doshas/Curses (S11-B) — 📋 **NEXT**
**Why Second**: Important for affliction detection, customer consultations
- **Duration**: 1-2 hours
- **Scope**: BPHS Ch.83 (8 primary Doshas)
- **Doshas Covered**:
  - Pitra Dosha (Father's curse)
  - Matri Dosha (Mother's curse)
  - Sarpa Dosha (Serpent's curse)
  - Kalakarma Dosha (Wife's curse)
  - Bhuta Dosha (Departed soul's curse)
  - Plus: Bhrata, Matula, Brahmanda Doshas
- **Remedies**: Documented per source
- **Output**: `doshas.js` + tests + stage record
- **Status**: 8 formations cataloged, ready to code

### Phase 3: Other Yogas (S11-C) — 📖 **SYSTEMATIC**
**Parallel implementation** of remaining yoga types (lower priority but complete):

#### 3a. Lunar Yogas (6 types)
- Sunapha, Anapha, Duradhara, Kemadruma, Dhana, Adhi Yoga
- **Duration**: 30-45 min
- **Source**: BPHS Ch.37

#### 3b. Solar Yogas (3 types)
- Vesi, Vosi, Ubhayachari Yoga
- **Duration**: 20-30 min
- **Source**: BPHS Ch.38

#### 3c. Other Chapter Yogas
- Chapter 36: Shubha, Ashubha, Gaja Kesari (3)
- Chapter 40: Royal Association (15)
- Chapter 41: Wealth combinations (20+)
- **Duration**: 2-3 hours combined
- **Dependencies**: Ascendant-specific, some need Karakamsa

#### 3d. Pancha Maha Purusha (5 types)
- Ruchaka (Mars), Bhadra (Mercury), Hamsa (Jupiter), Malavya (Venus), Sasa (Saturn)
- **Duration**: 30-45 min
- **Source**: BPHS Ch.31-32

### Phase 4: Varshaphala/Tajika (S11-D) — 🗓️ **CONDITIONAL**
**Why Last**: Requires OCR correction of Tajika texts, complex timing logic
- **Duration**: 3-5 hours
- **Scope**: Tajika Neelakanthi, Bhushana, Sara
- **Status**: Framework mapped, needs OCR fix
- **Note**: Can defer if time/resource constraints

---

## Code Structure Template

```javascript
// src/chart/[yogaType].js
const BPHS_[YOGA]_SOURCE = {
  title: 'BPHS',
  chapter: X,
  verses: "Y-Z",
  file: 'C23_BPHS_Santhanam.pdf',
};

const [YOGA]_YOGAS = {
  YOGA_NAME_1: {
    name: "Formal Name",
    formation_rule: "Planet X in Y with condition Z",
    source: "[BPHS, Ch.X, v.Y]",
    effects: "As stated in source",
    detection: function(chart) { ... }
  },
  // ... more
};

function calculate[YogaType](chart) {
  const matched = [];
  for (const yogaKey in [YOGA]_YOGAS) {
    if (detect[YogaKey](chart)) {
      matched.push(yogaKey);
    }
  }
  return attachSource({
    yogas: matched,
    source: BPHS_[YOGA]_SOURCE
  });
}
```

### Test Structure Template
```javascript
// test-[yogaType].js
test("Raja Yoga: Maha Raja Yoga formation", () => {
  // Test case 1: Ascendant lord and 5th lord exchange
  // Test case 2: Atmakaraka in angle, aspected by benefice
  assert.ok(results.includes("MAHA_RAJA_YOGA"));
});

test("Dosha: Pitra Dosha detection", () => {
  // Test case: Specific 5th house affliction
  assert.ok(results.includes("PITRA_DOSHA"));
});
```

---

## Integration Checklist

- [ ] **S10 Dependencies Available**:
  - ✅ Shadbala (all 7 planets, all 7 components)
  - ✅ Ashtakavarga (S9)
  - ✅ Vimshottari Dasha (S7)
  - ✅ Varga charts (S8)
  - ✅ Birth chart & Bhava (S6)

- [ ] **New Data Needed**:
  - [ ] Karakamsa calculations (for some Royal/Wealth yogas)
  - [ ] Arudha Lagna (for Raja yogas)
  - [ ] Atmakaraka (for Raja yogas)
  - [ ] Vargothamsa calculations (for some yogas)
  - [ ] Navamsha-specific rules

- [ ] **Implementation Strategy**:
  - [ ] Start with yogas using only Rasi placements (no divisionals needed yet)
  - [ ] Progress to yogas needing Navamsha
  - [ ] Handle Karakamsa/Arudha last (may need new functions)

---

## Per-Phase Deliverables

### Phase 1: Raja Yogas
1. **S11-A-RAJA-YOGAS-SOURCE-VERIFICATION-001.md**
   - All 48 yogas with exact BPHS verses
   - Cross-references to Jataka Parijata, Hora Sara
   - Formation rule details
   - Effects documented

2. **S11-A-RAJA-YOGAS-IMPLEMENTATION-001.md**
   - Code walkthrough
   - Test results (22+ tests)
   - Build verification
   - Browser validation

3. **`src/chart/rajaYogas.js`**
   - Full implementation
   - All 48 detection functions

4. **`test-raja-yogas.js`**
   - Unit tests per yoga
   - Integration tests
   - Edge cases

### Phase 2: Doshas
1. **S11-B-DOSHAS-SOURCE-VERIFICATION-001.md**
   - 8 primary Doshas from BPHS Ch.83
   - Remedial measures
   - Variations & exceptions

2. **S11-B-DOSHAS-IMPLEMENTATION-001.md**
   - Code, tests, validation

3. **`src/chart/doshas.js`**
4. **`test-doshas.js`**

---

## Quality Gate Checklist

Before marking any yoga type complete:

- [ ] Every yoga has exact BPHS source cite (chapter, verse)
- [ ] Formation rules documented with all conditions
- [ ] Effects documented as stated in source
- [ ] Test cases cover standard + edge formations
- [ ] PL9 comparison done (UI patterns only, not calculations)
- [ ] No calculation logic borrowed from PL9
- [ ] All tests pass (22+ per phase)
- [ ] Build succeeds (all 4 routes prerender)
- [ ] Stage record filed with findings

---

## Estimated Timeline

| Phase | Component | Duration | Status |
|-------|-----------|----------|--------|
| 1a | Raja Yogas research & design | 30 min | ✅ Done (catalog complete) |
| 1b | Raja Yogas implementation | 2-3 hours | ⏳ Ready to start |
| 1c | Raja Yogas tests & validation | 1-2 hours | ⏳ Ready |
| **Phase 1 Total** | | **3.5-5 hours** | **CRITICAL PATH** |
| 2a | Doshas research & design | 15 min | ✅ Done |
| 2b | Doshas implementation | 1 hour | ⏳ Ready |
| 2c | Doshas tests & validation | 30 min | ⏳ Ready |
| **Phase 2 Total** | | **1.5-2 hours** | **HIGH PRIORITY** |
| 3a-d | Other yogas (parallel) | 4-5 hours | ⏳ Queued |
| 4 | Varshaphala (conditional) | 3-5 hours | ⏳ Pending OCR |
| **TOTAL S11** | | **8-17 hours** | **Distributed over days** |

---

## Success Metrics

| Metric | Target | Notes |
|--------|--------|-------|
| Raja Yogas implemented | 48/48 | From BPHS Ch.39 |
| Doshas implemented | 8/8 | From BPHS Ch.83 |
| Total yogas implemented | 150+/180+ | Excluding Varshaphala pending |
| Test coverage | 22+ tests per phase | Minimum 2 per yoga type |
| Build status | ✅ All routes prerender | No errors |
| Source citations | 100% | Every yoga traces to BPHS |
| PL9 parity check | ✅ Complete | UI reference, not calculation |

---

## Known Constraints & Decisions

1. **Karakamsa/Arudha Lagna**: Some Raja yogas reference these. Decision: Implement simple versions first (Rasi-only), add divisional logic in iteration if time permits.

2. **Ascendant-specific Wealth Yogas** (Ch.41): These are highly specific to each Lagna. Decision: Implement as conditional checks per ascendant.

3. **Varshaphala OCR**: Tajika texts need OCR correction. Decision: Document framework, defer implementation until Tajika text quality improves.

4. **Yoga Conflicts**: What if a chart matches both "Raja Yoga" and "Pitra Dosha"? Decision: Return all matching yogas/doshas, let UI layer interpret.

---

## Next Immediate Action

**START PHASE 1: RAJA YOGAS**

1. Create implementation scaffold for Raja Yogas
2. Begin coding detection functions (prioritize highest-demand yogas first)
3. Write tests as you code (TDD approach)
4. Verify against BPHS catalog after every 5-10 yogas
5. Commit after full Phase 1 completion

**Ready to proceed with Phase 1?** YES → Begin coding now

---

**Prepared by**: Agent research (yoga_dosha_varshaphala_catalog.yaml)
**Status**: Research complete, implementation ready
**Next Session**: Phase 1 Raja Yogas implementation
