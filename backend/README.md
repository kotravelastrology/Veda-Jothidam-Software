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

As of 2026-09-26 this is **149 passing, 40 failing** — see below. The three
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

`149 passed, 40 failed`. The failures are pre-existing and fall into two
groups:

1. **~28 assert 404/405 == 200.** Those tests target `/api/dasha/*`,
   `/api/shadbala/*` and `/api/complete-analysis`, which live in
   `backend/api/` — a package `create_app()` never registers. It is imported
   only by `app_integration_3_5.py`, which nothing references. There are two
   parallel API implementations here and the tests target the unregistered
   one.
2. **~12 model failures.** `to_dict()` calls `.isoformat()` on `created_at` /
   `updated_at` before the row is flushed, so it raises `AttributeError:
   'NoneType' object has no attribute 'isoformat'`. Column defaults are
   applied by the database on insert, not at construction.

Neither group is an environment problem. See
`docs/VJ-002-phase30-claims-audit.md`.
