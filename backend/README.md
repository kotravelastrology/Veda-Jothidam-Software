# Backend (Flask)

## Setup

From this `backend/` directory:

```bash
python -m venv .venv
.venv/Scripts/python.exe -m pip install -r requirements.txt -r tests/requirements.txt
```

On macOS/Linux the interpreter is `.venv/bin/python` instead.

## Run

```bash
.venv/Scripts/python.exe run.py
```

Serves on `http://localhost:5000`. Check it with:

```bash
curl http://localhost:5000/api/health
```

## Test

```bash
.venv/Scripts/python.exe -m pytest tests/ -q
```

As of 2026-09-26 this is **119 passing, 6 failing** — see below. The three
`test_*.py` files in this directory (not in `tests/`) are not pytest suites;
they are manual scripts that expect a server already running on port 5000.

## Why the pins moved (2026-09-26)

The previous `requirements.txt` could not run on Python 3.14: `SQLAlchemy
2.0.23` raises `AssertionError: Class SQLCoreOperations directly inherits
TypingOnly` at import, so the app and its entire test suite were unreachable.
The installed packages matched the pins exactly, so this was not environment
drift — the pinned stack itself was unrunnable. A stale
`__pycache__/app.cpython-311.pyc` suggests the backend last ran under Python
3.11, where those pins were fine.

Two code fixes were needed alongside the upgrade:

- `DATABASE_URL` in `.env` is relative to the repo root
  (`sqlite:///./backend/database/...`), but `run.py` starts from `backend/`,
  where it resolved to `backend/backend/...` and SQLite failed with "unable
  to open database file". `database.resolve_database_url()` now anchors
  relative SQLite paths at the repo root.
- The test suites call `create_app({'TESTING': True})`, passing a dict where
  the factory expected a config *name*, which raised `TypeError: cannot use
  'dict' as a dict key`. `create_app` now accepts either, and no longer lets
  the ambient `DATABASE_URL` override `TestingConfig`'s in-memory database.

## Known state of the test suite

`119 passed, 6 failed`, stable across runs.

1. **4 model failures.** These assert that column defaults (`language`,
   `timezone`, `ayanamsa`) are readable immediately after construction. They
   are not: SQLAlchemy applies `default=` at INSERT, so the attribute is None
   until the row is flushed. Either the tests should flush first, or the
   models should set these in `__init__` — a behaviour decision, not a bug.
2. **1 validator failure** — `test_email_too_long` expects a `ValidationError`
   that `EmailValidator` does not raise for over-length addresses.
3. **1 chart API failure** — `test_create_chart_success` asserts on a field
   that comes back None.

## The deleted parallel API (2026-09-26)

`backend/api/` (41 routes) and `backend/calculations/` were removed, along
with `app_integration_3_5.py` (the orphan entrypoint that imported them) and
the two test files that covered them.

They were a second, unregistered implementation, and its astrology was wrong:

- The Vimshottari calculator gave the first dasha its **full** duration from
  the birth date, with no balance at birth — the defining property of the
  system. Every subsequent period shifted with it.
- It never computed the Moon's position. The nakshatra arrived as a caller
  supplied *string*, looked up with `.get(name, 'Ketu')`, and its table spelled
  it `"Uttara Shadha"` against the standard "Uttara Ashadha" — so a correctly
  spelled request silently returned Ketu. For the reference chart (Chennai
  1990-05-15 10:30 IST) it produced Ketu 1990-1997 where the real engine gives
  Sun with a 4.571-year balance, putting today's dasha at Sun instead of Rahu.
- Its "Shadbala" was invented: Dik Bala returned 80/70/40 from a day/night
  check on the birth hour, and Kala Bala keyed off a hardcoded table of
  favourable Gregorian months per planet. The repo's own
  `src/chart/shadbala.js` refuses to emit a Shadbala total at all, returning
  `SOURCE_REQUIRED`, because BPHS's Ayana Bala verses and table do not
  reconcile.

Registering it would have made 28 tests pass by asserting against fabricated
output. Swiss Ephemeris under `src/` remains the single calculation engine.
See `docs/VJ-002-phase30-claims-audit.md`.
