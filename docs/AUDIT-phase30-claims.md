# VJ-002 — Phase 30 completion claims, audited against the code

**Audited:** 2026-09-26 · **Against:** `PHASE-30-FINAL-COMPLETION-REPORT.md`,
`DAYS-27-28-SECURITY-COMPLETE.md`, `DAY_25/26_TESTING_LOG.md`,
`INTEGRATION-TEST-RESULTS-DAYS-25-26.md`, `PHASE-30.10-COMPLETE.md`

Every claim below was checked by reading the code, counting registered
routes, running the test suites, and checking whether each module has a real
importer. Claims are marked **TRUE**, **OVERSTATED** or **FALSE** on the
evidence in this repo today.

---

## What holds up

| Claim | Verdict | Evidence |
|---|---|---|
| Swiss Ephemeris calculation engine works and is tested | **TRUE** | `npm test` runs 47 files, exits 0, 1,174 assertions |
| "49+ core engine tests, 100% pass" (Days 25-26) | **TRUE** | `INTEGRATION-TEST-RESULTS` contains real JSON output matching live runs |
| Input validation framework is wired | **TRUE** | `validators.py` imported and called in `routes/auth.py` and `routes/charts.py` |
| Security headers + JWT blacklist | **TRUE** | `add_security_headers(app)` and `token_blacklist_loader(jwt)` in `app.py` |
| "Zero critical vulnerabilities" | **TRUE** (npm) | `npm audit`: 0 across all severities |
| Phase 30.10 UI shell | **TRUE** | SettingsPanel, ToolsPanel, HelpPanel, TopMenuBar, `useKeyboardShortcuts`, `useUIManager` all have real importers |
| "19,000+ lines of production code" | **UNDERSTATED** | ~75,000 lines total (30.5k app+src TS/TSX, 18.3k engine JS, 14k Python, 12.9k test JS) |

The calculation engine is the genuinely strong part of this codebase. The
problems are concentrated in the API layer, the test claims and the
feature pages.

---

## What does not

### 1. "23 API endpoints (100% complete)" — FALSE

`run.py` and `wsgi.py` both serve `app.create_app()`, which registers only
`auth.bp` and `charts.bp`:

- `routes/auth.py` — 7 routes
- `routes/charts.py` — 8 routes
- `app.py` inline — `/api/health`, `/api/config`

**17 endpoints are actually served.** A further 41 routes existed under
`backend/api/`, imported only by the orphan entrypoint
`app_integration_3_5.py`. **Resolved 2026-09-26:** that package,
`backend/calculations/` and the two test files covering them were deleted
after inspection showed the implementation was wrong — a Vimshottari with no
balance at birth, a nakshatra lookup that silently fell back to Ketu, and an
invented Shadbala. See `backend/README.md`.

### 2. "All 23 endpoints documented" — FALSE

`API-DOCUMENTATION.md` documents 14 endpoints. Four of them never existed:
`/api/charts/compute`, `/yogas/detect`, `/bhava-bala/analyze`,
`/vimshottari-dasha/calculate` (see VJ-001). Five real consultation
endpoints are undocumented.

### 3. "400+ automated tests (100% pass rate)" — FALSE as stated

The backend holds 228 test functions across `tests/` and `test_*.py`. None
of them can run here:

- `pytest` is not installed.
- The backend cannot even import: `requirements.txt` pins
  `SQLAlchemy==2.0.23`, which is incompatible with the installed Python
  3.14.6 (`AssertionError: Class SQLCoreOperations directly inherits
  TypingOnly`). The installed packages match the pins exactly, so this is
  not environment drift — the pinned stack cannot run on this machine.

What does pass is the Node calculation suite: 47 files, 1,174 assertions.

### 4. "Days 25-26: all 11 features verified, zero critical issues" — FALSE

`DAY_25_TESTING_LOG.md` and `DAY_26_TESTING_LOG.md` are unfilled templates.
They carry 62 and 60 tests pre-marked with checkmarks, while the bodies of
those same tests read `Status: [PENDING]` (85 and 86 occurrences) with blank
`Result: [____ ms]` fields. The checkmarks were applied to a template that
was never executed.

### 5. "22 automated E2E tests" — FALSE

`tests/integration.test.ts` is 420 lines and targets only the four phantom
endpoints above. No test runner is installed: `package.json` has no vitest,
jest, playwright or cypress. It has never been executable.

### 6. Rate limiting "per-endpoint protection" (350 LOC) — FALSE

`rate_limiter.py` defines a `rate_limit` decorator. It is applied to **zero
routes**. `app.py` has only the 429 error handler. Login and signup have no
brute-force protection.

### 7. Structured logging "security event tracking, audit trail" (400 LOC) — FALSE

`logger.py` has no importers anywhere in the backend. It never runs.

### 8. "100% OWASP Top 10 compliance" — UNSUPPORTED

Asserted in a table in `DAYS-27-28-SECURITY-COMPLETE.md` with no scanner
output, SAST report or test evidence in the repo. Findings 6 and 7 directly
contradict the brute-force and logging portions.

### 9. Per-page line counts — OVERSTATED 3-4x

| Page | Claimed | Actual |
|---|---|---|
| Professional Dashboard | 1,350+ | 371 |
| Client Management | 1,300+ | 382 |
| Learning Resources | 1,050+ | 313 |
| PDF Reports | 950+ | 343 |
| Consultation Tools | 900+ | 259 |

### 10. Client Management "complete CRUD operations / data management" — OVERSTATED

CRUD operates on React `useState` seeded from a hardcoded array. No fetch,
no Server Action, no persistence of any kind. Adding a client and refreshing
the page loses it.

### 11. "Learning Resources: 50+ resources" — FALSE

6 entries.

### 12. 34 of 81 test files are not in `npm test`

Including every yoga suite the project's records cite as passing
(`test-raja-yogas.js`, `test-lunar-solar-yogas.js`, `test-wealth-yogas.js`,
`test-edge-case-yogas.js`, `test-doshas.js`, `test-phase-*.js`). Run
manually: **31 pass, 2 fail** —

- `test-doshas.js` — assertion failure, `actual: null`
- `test-phase-3.3-part3.js` — 7/10, "Dhanayoga not detected"

Both fail on `main` too, so they pre-date the 2026-09-26 engine work. The
green `npm test` is partly green because the two failing suites are not in
it.

### 13. `WindowManager.tsx` (199 LOC) has no importers

Claimed as delivered in Phase 30.10; never mounted.

---

## The pattern

Most claims describe work that was really done — the files exist and are
often substantial. What was not done is the **wiring and the verification**:
modules built but never imported, routes written but never registered,
test templates ticked but never run.

The safe reading of any `PHASE-*.md` or `*-COMPLETION-REPORT.md` in this
repo is: *a file was created*. It is not evidence that the code is reachable
or that anything was executed.

## Suggested order of work

1. ~~Pin a Python the backend can run~~ — done 2026-09-26. The backend runs
   on Python 3.14 and the suite is at 119 passed / 6 failed.
2. Apply `@rate_limit` to the auth routes, or delete `rate_limiter.py`.
3. Wire `logger.py` in, or delete it.
4. Add the 32 passing orphan test files to `npm test`; fix or quarantine the
   2 failures.
5. ~~Decide on `backend/api/`~~ — done 2026-09-26: deleted. It was not
   abandoned scaffolding but an actively-tested parallel implementation, and
   its calculations were fabricated; registering it would have turned 28
   tests green against wrong output.
6. Give Client Management real persistence, or relabel it a demo.
7. Correct `API-DOCUMENTATION.md` — remove the 4 phantom endpoints, add the
   5 real consultation ones.
