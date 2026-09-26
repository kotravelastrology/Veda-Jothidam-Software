# VJ-001: Route → Service → Engine Matrix

Date: 2026-09-26 | Repository: `D:\KotravelAstrology\Veda-Jothidam-Software` | Git HEAD: `7aa22f3`

## Status Legend

| Status | Meaning |
|--------|---------|
| REAL   | Wired to Swiss Ephemeris via `buildReportData` / Server Actions — deterministic, birth-input-dependent |
| MOCK   | Hardcoded or formula-generated data that ignores birth input |
| PROXY-FALLBACK | Proxies to Flask; falls back to mock data on failure (F03) |
| ~~PYTHON-ALT~~ | Removed 2026-09-26 — the Python `AstroEngine` no longer exists |
| STATIC | Display-only page, no calculation |
| UNWIRED | UI scaffold exists but no calculation backend connected |

---

## Path A: Server Actions → Swiss Ephemeris (REAL)

These pages use `'use server'` actions that call Swiss Ephemeris via `src/report/reportData.js`.

| # | Page Route | Action File | Engine | Status | Notes |
|---|-----------|-------------|--------|--------|-------|
| 1 | `/report` | `report/actions.ts` | `buildReportData()` → Swiss Ephemeris + 40+ rule modules | REAL | Primary calculation pipeline. Includes `calculatePredictions` (F01 — random) |
| 2 | `/porutham` | `porutham/actions.ts` | `calculateParashariChart` → `tamilPorutham` / `extendedPorutham` | REAL | Swiss-based chart context |
| 3 | `/varshaphala` | `varshaphala/actions.ts` | `calculateParashariChart` → `varshaphala` module | REAL | |
| 4 | `/rectification` | `rectification/actions.ts` | `calculateParashariChart` → `rectification` module | REAL | |
| 5 | `/jamakkol` | `jamakkol/actions.ts` | `calculateParashariChart` → `jamakkol` module | REAL | |
| 6 | `/nallaneram` | `nallaneram/actions.ts` | Swiss Ephemeris → `dailyMuhurta` | REAL | |
| 7 | `/muhurta` | `muhurta/actions.ts` | Swiss Ephemeris → `muhurtaSearch` | REAL | |
| 8 | `/kelvi` | `kelvi/actions.ts` | `calculateParashariChart` → `answerEngine` | REAL | |
| 9 | `/tamil-calendar` | `tamil-calendar/actions.ts` | Swiss Ephemeris → `tamilCalendar` | REAL | |
| 10 | `/baby-names` | `baby-names/actions.ts` | Swiss Ephemeris → `babyNames` | REAL | |
| 11 | `/classical-muhurta` | `classical-muhurta/actions.ts` | Swiss Ephemeris → `classicalMuhurta` | REAL | |
| 12 | `/kp-time-scan` | `kp-time-scan/actions.ts` | Swiss Ephemeris → `kpTimeScan` | REAL | |

**F01 — RESOLVED (2026-09-26)**: `src/chart/predictionEngine.js` (random event selection, invented accuracy scores, false attribution to Sage Parashara) was deleted. `buildReportData` now returns a `sourceRequired(...)` refusal for `predictions`, and `ReportBuilder` renders it with the existing `SourceRequiredBadge`. The same pass removed the invented `eventSuccess`/`karmaStrength` percentages from `muhurtaEnhancements`.

---

## Path B: FORMER proxy pages — migrated to Swiss Ephemeris Server Actions (2026-09-26)

These four pages previously fetched Next API proxies that silently returned mock data when Flask was unreachable. They now call Server Actions that run the same Swiss Ephemeris engine as Path A, so there is one calculation path.

| # | Page Route | Client Component | Server Action | Engine | Status |
|---|-----------|-----------------|---------------|--------|--------|
| 13 | `/divisional-charts` | `DivisionalChartsView.tsx` | `computeDivisionalCharts` | `calculateParashariChart` → `calculateVargas` (BPHS Ch.6) | REAL |
| 14 | `/yoga-detection` | `YogaDetectionView.tsx` | `detectYogas` | Raja / Nabhasa / Lunar-Solar / Wealth / Edge-case yogas + Doshas | REAL |
| 15 | `/house-analysis` | `HouseAnalysisView.tsx` | `analyzeHouses` | `calculateAshtakavarga` + `calculateShadbala` | REAL |
| 16 | `/dasha-timeline` | `DashaTimelineView.tsx` | `computeDashaTimeline` | `buildVimshottariDasha` depth 2 (BPHS Ch.46/Ch.51) | REAL |
| 17 | `/pdf-reports` | `PdfReportsView.tsx` | — (still proxies Flask) | Flask report service | PROXY (errors surfaced, no synthetic PDF) |

- **F02 — RESOLVED**: the `(i*30 + division*5)%360` formula is gone; vargas come from the birth chart.
- **F03 — RESOLVED**: the four mock proxy routes were deleted. `reports/generate` no longer emits a placeholder PDF with HTTP 200; it returns `BACKEND_ERROR` (502) / `BACKEND_TIMEOUT` / `BACKEND_UNAVAILABLE` (503).
- **F04 — RESOLVED**: no page reaches the Python `AstroEngine`, and `backend/calculators/` has been deleted. Swiss Ephemeris is the single engine.

### Verified against the engine (Chennai 1990-05-15 10:30 IST)
Lagna Karkataka 6.87°; D9 Sun→Makara, Rahu→Mithuna; Sarvashtakavarga total 337 (classical grand total); birth nakshatra Uttara Ashadha, Sun lord, balance 4.571y; 19 yoga/dosha formations with BPHS citations.

---

## Next API Proxy Routes (1 remaining)

| # | Route Path | Target | Failure Behavior |
|---|-----------|--------|------------------|
| A5 | `app/api/charts/reports/generate/route.ts` | `localhost:5000/api/charts/reports/generate` | Structured JSON error (502/503); never a synthetic PDF |

Deleted: `app/api/charts/compute`, `.../yogas/detect`, `.../bhava-bala/analyze`, `.../vimshottari-dasha/calculate`.

---

## Flask Backend Routes

| Blueprint | Route | Handler | Engine |
|-----------|-------|---------|--------|
| `charts` | `POST /api/charts/create` | `create_chart()` | Database only (no calculation) |
| `charts` | `GET /api/charts/<id>` | `get_chart()` | Database only |
| `charts` | `GET /api/charts` | `list_charts()` | Database only |
| `charts` | `POST /api/charts/<id>/consultations` | `create_consultation()` | Database only |
| `charts` | `GET /api/charts/<id>/consultations` | `list_consultations()` | Database only |
| `charts` | `GET /api/charts/<id>/consultations/<cid>` | `get_consultation()` | Database only |
| `charts` | `PUT /api/charts/<id>/consultations/<cid>` | `update_consultation()` | Database only |
| `charts` | `DELETE /api/charts/<id>/consultations/<cid>` | `delete_consultation()` | Database only |
| `auth` | Various | JWT auth endpoints | Auth only |
| — | `GET /api/health` | Health check | None |
| — | `GET /api/config` | Config (dev only) | None |

**Note**: Flask `charts.py` never registered `/compute`, `/yogas/detect`, `/bhava-bala/analyze` or `/vimshottari-dasha/calculate` — the endpoints those proxies targeted did not exist, so every Path B page always fell through to its mock. Flask's remaining role is auth, chart storage and consultations.

---

## Static / UI-Only Pages

| # | Page Route | Component | Status | Notes |
|---|-----------|-----------|--------|-------|
| 18 | `/` | `page.tsx` | STATIC | Home page with stats display |
| 19 | `/professional-dashboard` | `ProfessionalDashboardView.tsx` | STATIC | Dashboard UI — displays hardcoded summary |
| 20 | `/client-management` | `ClientManagementView.tsx` | STATIC | Client list UI scaffold |
| 21 | `/consultation-tools` | `ConsultationToolsView.tsx` | STATIC | Consultation workflow UI |
| 22 | `/learning-resources` | `LearningResourcesView.tsx` | STATIC | Learning content display |
| 23 | `/settings` | `SettingsView.tsx` | STATIC | Settings panel UI |
| 24 | `/references` | `page.tsx` | STATIC | Classical references browser |
| 25 | `/launch-checklist` | `LaunchChecklistView.tsx` | STATIC | Launch checklist UI |
| 26 | `/consultation` | `ConsultationFlow.tsx` | STATIC | Consultation flow wizard |

---

## Chart Display Pages (from src/ components)

| # | Page Route | Component | Data Source | Status |
|---|-----------|-----------|-------------|--------|
| 27 | `/create-chart` | `ChartForm.tsx` | Form input only | UNWIRED — form exists, no calculation wired |
| 28 | `/chart-display` | `ChartWheel.tsx` | Needs chart data | UNWIRED |
| 29 | `/dasha-display` | `DashaTable.tsx` | Needs dasha data | UNWIRED |
| 30 | `/planetary-strength` | `PlanetaryStrengthGraph.tsx` | Needs strength data | UNWIRED |
| 31 | `/house-strength` | `HouseStrengthGraph.tsx` | Needs house data | UNWIRED |
| 32 | `/chart-view/[id]` | Dynamic chart view | Needs chart data | UNWIRED |

---

## Summary

| Category | Count | Pages |
|----------|-------|-------|
| REAL (Swiss Ephemeris via Server Actions) | 16 | /report, /porutham, /varshaphala, /rectification, /jamakkol, /nallaneram, /muhurta, /kelvi, /tamil-calendar, /baby-names, /classical-muhurta, /kp-time-scan, /divisional-charts, /yoga-detection, /house-analysis, /dasha-timeline |
| PROXY (Flask, errors surfaced) | 1 | /pdf-reports |
| STATIC (no calculation needed) | 9 | /, /professional-dashboard, /client-management, /consultation-tools, /learning-resources, /settings, /references, /launch-checklist, /consultation |
| UNWIRED (UI exists, no backend) | 6 | /create-chart, /chart-display, /dasha-display, /planetary-strength, /house-strength, /chart-view/[id] |

---

## Critical Findings Summary

| ID | Severity | Description | Affected Pages |
|----|----------|-------------|----------------|
| F01 | P0 | **RESOLVED 2026-09-26** — `predictionEngine.js` deleted; `predictions` is now a `sourceRequired` refusal. Invented `eventSuccess`/`karmaStrength` percentages also removed from `muhurtaEnhancements`. | `/report` |
| F02 | P0 | **RESOLVED 2026-09-26** — vargas now come from the birth chart via `computeDivisionalCharts`. | `/divisional-charts` |
| F03 | P0 | **RESOLVED 2026-09-26** — four mock proxies deleted; `reports/generate` returns structured 502/503 errors instead of a placeholder PDF. | all five |
| F04 | P0 | **RESOLVED 2026-09-26** — `backend/calculators/` deleted; Swiss Ephemeris is the only engine. | `/yoga-detection`, `/house-analysis`, `/dasha-timeline` |
| F05 | P1 | `reportGenerator` exports HTML bytes with PDF/PNG MIME labels | `/pdf-reports` |
| F05 | P1 | **RESOLVED 2026-09-26** — `exportReport` returned HTML bytes under PDF/PNG/SVG/Excel MIME types; unimplemented formats now throw. | `/pdf-reports` |
| F12 | P2 | **RESOLVED 2026-09-26** — the modules holding `Math.random` API keys, TOTP secrets and webhook signing secrets were unreachable and have been deleted. Every remaining `Math.random` in live code generates a local object id. | (none — was unreachable) |

---

## Remaining work

- ~~Delete `backend/calculators/astro_engine.py`~~ — done 2026-09-26; the whole `backend/calculators` package was removed (no Flask blueprint imported it). Swiss Ephemeris is now the only calculation engine in the repo.
- ~~Settings not reaching the Server Actions~~ — done 2026-09-26; `toEngineOptions(settings)` in `src/ui/SettingsPanel.tsx` is the single mapping from the UI's ayanamsha / house-system / node-type keys to the engine's names, used by `ReportBuilder` and all four migrated pages. Verified: switching Lahiri→Krishnamurti moves Sun 0°23'→0°29'.
- Real PDF export is still unimplemented: `/pdf-reports` proxies Flask, and the Flask backend does not start on Python 3.14 (SQLAlchemy raises `AssertionError: Class SQLCoreOperations directly inherits TypingOnly`). That blocks testing the one remaining proxy.
- `src/reports/ReportBuilder.tsx` was deleted with the rest of the unreachable tree; it had alerted "Report exported" and "Report sent to <email>" while only calling `console.log`.
- `tests/integration.test.ts` targets the deleted proxy endpoints and needs rewriting against the Server Actions; `vitest` is not installed.

Target architecture: **One calculation path** — Swiss Ephemeris via Server Actions for all pages.

Flask backend retains: authentication, user profile storage, consultation management (database operations only).
