# S11 — Yoga/Dosha and Varshaphala (Master Record)

Status: **NABHASA YOGAS COMPLETE (all 32).** Raja Yogas, Dosha/Curses, and Varshaphala remain open. Per PLAN-001 item 11 and WORKFLOW-REGISTER-001 S11: only where exact source support is admitted. Working tree only — no commit/push/backup (no git repository yet).

## Progress Summary

| Yoga Type | Status | Component | Source | Tests |
|-----------|--------|-----------|--------|-------|
| **Nabhasa Yogas** | ✅ COMPLETE | All 32 | BPHS Ch.35 v.1-17 | ✅ 12 pass |
| ├─ Asraya (3) | ✅ | Rajju, Musala, Nala | BPHS v.7 | ✅ |
| ├─ Dala (2) | ✅ | Maala, Sarpa | BPHS v.8 | ✅ |
| ├─ Akriti (20) | ✅ | Houses 1/2/3/4/5/6/7 permutations | BPHS v.9-15 | ✅ |
| └─ Sankhya (7) | ✅ | Gola through Veena (1-7 signs) | BPHS v.16-17 | ✅ |
| **Raja Yogas (Phase 1A + 1B)** | ✅ PHASE 1B COMPLETE | 17 implementations | BPHS Ch.39 v.6-48 | ✅ 23 tests pass |
| **Dosha/Curses** | ⏳ OPEN | Pitra, Deva, Naga, Kanda, Kuja | BPHS Ch.83 | ❌ Not yet sourced |
| **Varshaphala** | ⏳ OPEN | Year-based transit analysis | Tajika/Varshaphala texts | ❌ Not yet sourced |

## Current Stage (S11-NABHASA-YOGA-001)

**Nabhasa Yogas (all 32 implemented, tested, complete):**

- **File**: `src/chart/nabhasaYoga.js` — `calculateNabhasaYogas(rasiPositions, {isWaxingMoon})`
- **Tests**: `test-nabhasa-yoga.js` — all 12 tests pass
- **Coverage**: Asraya, Dala, Akriti, Sankhya yoga detection
- **Known limitation**: Vajra/Yava use simplified benefic/malefic (Jupiter/Venus/Mercury vs. Sun/Mars/Saturn) rather than affliction-aware classification
- **Known ambiguity**: Dala Yogas reference "3 angles" without specifying which; implementation uses 4th, 7th, 10th (most common resolution)

---

## Next Steps (S11 Continuation)

### Phase 1: Raja Yogas (BPHS Chapter 39) — **RECOMMENDED NEXT**

**Why first**: 
- Highest practical-use priority (most requested in consultations)
- Similar structure to Nabhasa (positional rules, no continuous math)
- No dependency on S6 (Bhava) or S10 gaps
- ~60 named combinations in BPHS

**Research tasks**:
1. Locate and visually verify BPHS Chapter 39 (file page TBD, printed page TBD)
2. Catalog all named Raja Yogas and their formation rules
3. Categorize by type: Graha Raja (planet combinations), Bhava Raja (house conditions), mixed
4. Identify any dependency on Shadbala/strength (some may need Bala values from S10 ✅ now available)
5. Create test cases with known birth charts

**Estimated scope**: 1-2 stage records, similar to Nabhasa size

### Phase 2: Dosha/Curses (BPHS Chapter 83)

**Why next**:
- Important for predicting afflictions (Pitra/Deva/Naga Dosha especially)
- Positional rules, no continuous math
- Complements Raja Yogas (good/bad yoga classification)

**Research tasks**:
1. Verify BPHS Chapter 83 location and content
2. Document 5+ major Doshas and their detection rules
3. Link to remedies (if included in BPHS)

**Estimated scope**: 1 stage record

### Phase 3: Varshaphala/Tajika (Year-based analysis)

**Why last**:
- Requires Vimshottari Dasha (already done S7 ✅)
- Likely needs secondary source (Tajika texts)
- PLAN-001 scope: "where exact source support exists" — lower priority if not well-documented

**Research tasks**:
1. Search corpus for Tajika texts with exact formulas (not just results)
2. Verify source availability and printed-page loci
3. Assess scope (year-end predictions vs. yearly dasha overlay vs. transit effects)

**Estimated scope**: 1-2 stage records (deferred if source not clear)

---

## Dependencies Now Available

From S10 completion, these are now ready for use in Yoga calculations:

- ✅ **Shadbala** (all 7 planets, all 7 components) — some Raja Yogas may reference planet strength
- ✅ **Ashtakavarga** (S9) — some combinations may use bindus
- ✅ **Vimshottari Dasha** (S7) — Varshaphala uses dasha periods
- ✅ **Varga charts** (S8 D1-D60) — some Yogas check divisional positions

No new dependencies on Bhava (S6 still has Sripati issue) or Ishtabala/Kashtabala (not yet built).

---

## Files to Create

For each new yoga type implemented:

1. **Source record**: `S11-[YOGA_TYPE]-SOURCE-VERIFICATION-001.md` — BPHS chapter/verse, visual page verification, all named conditions
2. **Implementation record**: `S11-[YOGA_TYPE]-IMPLEMENTATION-001.md` — code, tests, findings
3. **Code file**: `src/chart/[yogaType].js` — detection function(s)
4. **Test file**: `test-[yogaType].js` — unit + integration tests

---

## Approval Request

**Next immediate step**: Start Phase 1 (Raja Yogas research and source verification)?

User decision required:
- Continue immediately with Raja Yogas?
- Or defer S11 continuation and move to S12 (Report builder)?
- Or branch off for a specific customer request first?

WORKFLOW-REGISTER-001 allows isolated tasks/branches, but S11 → S12 is the registered sequence.

---

**Stage Status**: S11 Nabhasa Yogas ✅ COMPLETE. Remaining S11 items: Raja Yogas (recommended), Dosha/Curses, Varshaphala (conditional). Ready to proceed when directed.
