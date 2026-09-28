// `process.getBuiltinModule` rather than `require('node:sqlite')`: Next.js's
// bundler tries to resolve the bare require and fails with "Unsupported
// external type Url for commonjs reference", which breaks every Server Action
// that touches the library. This reaches the builtin at runtime instead, so
// the module works identically under plain Node and inside the Next server.
const { DatabaseSync } = process.getBuiltinModule
  ? process.getBuiltinModule('node:sqlite')
  // eslint-disable-next-line global-require
  : require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');

const { UnsupportedInputError } = require('../contracts/chartContext');
const { assertChartSnapshot } = require('../contracts/chartSnapshot');

/**
 * VJ-011 — local chart library.
 *
 * Local-first per ADR-05: a SQLite file on disk, no account and no network
 * needed for basic desktop use. Uses node:sqlite so the library adds no
 * dependency (see the Electron note in docs/VJ-011-chart-library.md).
 *
 * ADR-08 requires user data migrations to be versioned and recoverable, so
 * corrections never overwrite: every save writes a new **revision** and the
 * earlier ones stay readable.
 */

const SCHEMA_VERSION = 6;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS library_meta (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- A saved person. Identity is stable across corrections.
CREATE TABLE IF NOT EXISTS profiles (
  profile_id       TEXT PRIMARY KEY,
  created_at       TEXT NOT NULL,
  updated_at       TEXT NOT NULL,
  current_revision INTEGER NOT NULL
);

-- Every save appends a revision; nothing is overwritten.
CREATE TABLE IF NOT EXISTS profile_revisions (
  profile_id  TEXT    NOT NULL,
  revision    INTEGER NOT NULL,
  name        TEXT    NOT NULL,
  gender      TEXT,
  place_name  TEXT,
  birth_date  TEXT,
  birth_input TEXT    NOT NULL,
  settings    TEXT    NOT NULL,
  note        TEXT,
  email       TEXT,
  phone       TEXT,
  created_at  TEXT    NOT NULL,
  PRIMARY KEY (profile_id, revision),
  FOREIGN KEY (profile_id) REFERENCES profiles(profile_id) ON DELETE CASCADE
);

-- Computed results, addressed by the VJ-006 content hash. A report can store
-- a snapshot_id and prove later exactly what it rendered (ADR-07).
CREATE TABLE IF NOT EXISTS snapshots (
  snapshot_id    TEXT PRIMARY KEY,
  profile_id     TEXT NOT NULL,
  revision       INTEGER NOT NULL,
  engine_version TEXT NOT NULL,
  settings       TEXT NOT NULL,
  values_json    TEXT NOT NULL,
  created_at     TEXT NOT NULL,
  FOREIGN KEY (profile_id) REFERENCES profiles(profile_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_revisions_name  ON profile_revisions(name);
CREATE INDEX IF NOT EXISTS idx_revisions_date  ON profile_revisions(birth_date);
CREATE INDEX IF NOT EXISTS idx_revisions_place ON profile_revisions(place_name);
CREATE INDEX IF NOT EXISTS idx_snapshots_profile ON snapshots(profile_id, revision);

-- A consultation session. Bound to the revision (and, where one exists, the
-- exact snapshot) that was on screen when the reading was given, so later
-- corrections cannot silently rewrite what a past consultation was about.
CREATE TABLE IF NOT EXISTS consultations (
  consultation_id TEXT PRIMARY KEY,
  profile_id      TEXT NOT NULL,
  revision        INTEGER NOT NULL,
  snapshot_id     TEXT,
  occurred_at     TEXT NOT NULL,
  summary         TEXT,
  notes           TEXT,
  recommendations TEXT,
  remedies        TEXT,
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL,
  FOREIGN KEY (profile_id) REFERENCES profiles(profile_id) ON DELETE CASCADE
);

-- Which doctrinal rules a consultation was reasoning from (VJ-006
-- RuleEvidence), so a note can be traced back to the page it rests on.
CREATE TABLE IF NOT EXISTS consultation_evidence (
  consultation_id TEXT NOT NULL,
  rule_id         TEXT NOT NULL,
  rule_name       TEXT,
  status          TEXT NOT NULL,
  evidence_json   TEXT NOT NULL,
  PRIMARY KEY (consultation_id, rule_id),
  FOREIGN KEY (consultation_id) REFERENCES consultations(consultation_id) ON DELETE CASCADE
);

-- Life events recorded against a person, independent of any consultation.
CREATE TABLE IF NOT EXISTS journal_events (
  event_id    TEXT PRIMARY KEY,
  profile_id  TEXT NOT NULL,
  event_date  TEXT NOT NULL,
  category    TEXT,
  description TEXT NOT NULL,
  created_at  TEXT NOT NULL,
  FOREIGN KEY (profile_id) REFERENCES profiles(profile_id) ON DELETE CASCADE
);

-- Autosaved, unsent text. Survives a crash or a navigation away.
CREATE TABLE IF NOT EXISTS drafts (
  draft_key  TEXT PRIMARY KEY,
  profile_id TEXT,
  payload    TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_consultations_profile ON consultations(profile_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_journal_profile ON journal_events(profile_id, event_date);

-- VJ-023: what each import created, so it can be undone exactly rather than
-- by guessing which profiles looked recent.
CREATE TABLE IF NOT EXISTS imports (
  import_id     TEXT PRIMARY KEY,
  source_path   TEXT NOT NULL,
  profile_ids   TEXT NOT NULL,
  skipped       INTEGER NOT NULL DEFAULT 0,
  rejected      INTEGER NOT NULL DEFAULT 0,
  loss_report   TEXT,
  rolled_back   INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL
);

-- VJ-028: a saved research cohort — the predicate and the settings it was run
-- under, plus the signature of its last run, so a replay can be compared
-- rather than merely re-counted.
CREATE TABLE IF NOT EXISTS cohorts (
  cohort_id      TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  predicate      TEXT NOT NULL,
  predicate_hash TEXT NOT NULL,
  settings       TEXT NOT NULL,
  last_signature TEXT,
  last_counts    TEXT,
  last_run_at    TEXT,
  created_at     TEXT NOT NULL
);

-- VJ-024: the device outbox. Local changes queue here and drain to a sync
-- service when one is configured; the product works with this table empty and
-- never drained (ADR-05). op_id is the idempotency key: the server records
-- which op_ids it has applied, so a redelivered row is a no-op rather than a
-- duplicate. attempts and last_error are kept so a row that cannot be sent is
-- visible instead of retrying forever in silence.
CREATE TABLE IF NOT EXISTS outbox (
  op_id       TEXT PRIMARY KEY,
  operation   TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  payload     TEXT NOT NULL,
  state       TEXT NOT NULL DEFAULT 'pending',
  attempts    INTEGER NOT NULL DEFAULT 0,
  last_error  TEXT,
  created_at  TEXT NOT NULL,
  sent_at     TEXT
);
CREATE INDEX IF NOT EXISTS idx_outbox_state ON outbox(state, created_at);

-- VJ-024: devices granted sync access, and what each may do. A revoked device
-- keeps its row — deleting it would lose the record that it ever had access,
-- which is the first thing anyone asks after revoking one.
CREATE TABLE IF NOT EXISTS sync_devices (
  device_id   TEXT PRIMARY KEY,
  label       TEXT NOT NULL,
  scopes      TEXT NOT NULL,
  created_at  TEXT NOT NULL,
  revoked_at  TEXT,
  last_sync_at TEXT
);

-- Indexed local search over the current revision of each profile.
CREATE VIRTUAL TABLE IF NOT EXISTS profile_search USING fts5(
  name, place_name, note, email, phone, profile_id UNINDEXED, tokenize = 'unicode61'
);
`;

/**
 * v1 -> v2: contact details for the client-management view, and an FTS index
 * that covers them. FTS5 columns cannot be altered, so the index is dropped
 * and rebuilt from profile_revisions, which remains the source of truth.
 *
 * ADR-08 requires migrations to be versioned and recoverable; this runs inside
 * a transaction so a failure leaves the library on v1 rather than half-migrated.
 */
function migrateToV2(db) {
  const columns = db.prepare('PRAGMA table_info(profile_revisions)').all().map((c) => c.name);
  db.exec('BEGIN');
  try {
    if (!columns.includes('email')) db.exec('ALTER TABLE profile_revisions ADD COLUMN email TEXT');
    if (!columns.includes('phone')) db.exec('ALTER TABLE profile_revisions ADD COLUMN phone TEXT');

    db.exec('DROP TABLE IF EXISTS profile_search');
    db.exec(`CREATE VIRTUAL TABLE profile_search USING fts5(
      name, place_name, note, email, phone, profile_id UNINDEXED, tokenize = 'unicode61'
    )`);
    const rows = db.prepare(`
      SELECT r.profile_id, r.name, r.place_name, r.note, r.email, r.phone
      FROM profile_revisions r
      JOIN profiles p ON p.profile_id = r.profile_id AND p.current_revision = r.revision`).all();
    const insert = db.prepare(
      'INSERT INTO profile_search (name, place_name, note, email, phone, profile_id) VALUES (?, ?, ?, ?, ?, ?)',
    );
    for (const r of rows) {
      insert.run(r.name, r.place_name ?? '', r.note ?? '', r.email ?? '', r.phone ?? '', r.profile_id);
    }
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

const nowIso = () => new Date().toISOString();

/** FTS5 treats punctuation as syntax; quote each term so a user's raw text
 *  cannot become a malformed MATCH expression. */
function toMatchQuery(text) {
  const terms = String(text).split(/\s+/).filter(Boolean)
    .map((t) => `"${t.replace(/"/g, '""')}"*`);
  return terms.join(' ');
}

function openLibrary(filePath) {
  if (!filePath) throw new UnsupportedInputError('filePath is required', 'filePath');
  if (filePath !== ':memory:') {
    fs.mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true });
  }

  const db = new DatabaseSync(filePath);
  db.exec('PRAGMA foreign_keys = ON');

  // Read the version before applying the schema, so an existing v1 library is
  // recognised rather than silently left without the v2 columns (CREATE TABLE
  // IF NOT EXISTS would skip it and every later write would fail).
  const hasMeta = db.prepare(
    "SELECT 1 FROM sqlite_master WHERE type='table' AND name='library_meta'",
  ).get();
  const existing = hasMeta
    ? db.prepare('SELECT value FROM library_meta WHERE key = ?').get('schemaVersion')
    : null;
  const foundVersion = existing ? Number(existing.value) : null;

  if (foundVersion !== null && foundVersion > SCHEMA_VERSION) {
    throw new UnsupportedInputError(
      `library schema v${foundVersion} is newer than this build (v${SCHEMA_VERSION}); upgrade before opening`,
      'schemaVersion',
    );
  }

  db.exec(SCHEMA);

  if (foundVersion !== null && foundVersion < 2) migrateToV2(db);
  // v2 -> v3 through v5 -> v6 add only new tables, which the schema above
  // already created with IF NOT EXISTS; there is nothing to move, so no data
  // migration runs for any of them.

  if (foundVersion === null) {
    db.prepare('INSERT INTO library_meta (key, value) VALUES (?, ?)')
      .run('schemaVersion', String(SCHEMA_VERSION));
  } else if (foundVersion < SCHEMA_VERSION) {
    db.prepare('UPDATE library_meta SET value = ? WHERE key = ?')
      .run(String(SCHEMA_VERSION), 'schemaVersion');
  }

  const reindex = (profileId, rev) => {
    db.prepare('DELETE FROM profile_search WHERE profile_id = ?').run(profileId);
    db.prepare(
      'INSERT INTO profile_search (name, place_name, note, email, phone, profile_id) VALUES (?, ?, ?, ?, ?, ?)',
    ).run(rev.name, rev.place_name ?? '', rev.note ?? '', rev.email ?? '', rev.phone ?? '', profileId);
  };

  const readRevision = (profileId, revision) => db.prepare(
    'SELECT * FROM profile_revisions WHERE profile_id = ? AND revision = ?',
  ).get(profileId, revision);

  const hydrate = (row) => (row ? {
    profileId: row.profile_id,
    revision: row.revision,
    name: row.name,
    gender: row.gender,
    placeName: row.place_name,
    birthDate: row.birth_date,
    input: JSON.parse(row.birth_input),
    settings: JSON.parse(row.settings),
    note: row.note,
    email: row.email ?? null,
    phone: row.phone ?? null,
    createdAt: row.created_at,
  } : null);

  const hydrateOutbox = (row) => ({
    opId: row.op_id,
    operation: row.operation,
    resourceId: row.resource_id,
    payload: JSON.parse(row.payload),
    state: row.state,
    attempts: row.attempts,
    lastError: row.last_error ?? null,
    createdAt: row.created_at,
    sentAt: row.sent_at ?? null,
  });

  const hydrateDevice = (row) => ({
    deviceId: row.device_id,
    label: row.label,
    scopes: JSON.parse(row.scopes),
    createdAt: row.created_at,
    revokedAt: row.revoked_at ?? null,
    lastSyncAt: row.last_sync_at ?? null,
  });

  const hydrateCohort = (row) => ({
    cohortId: row.cohort_id,
    name: row.name,
    predicate: JSON.parse(row.predicate),
    predicateHash: row.predicate_hash,
    settings: JSON.parse(row.settings),
    lastSignature: row.last_signature ?? null,
    lastCounts: row.last_counts ? JSON.parse(row.last_counts) : null,
    lastRunAt: row.last_run_at ?? null,
    createdAt: row.created_at,
  });

  /** ISO date from a birth input, for range search and display. */
  const isoDate = (input) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${input.year}-${pad(input.month)}-${pad(input.day)}`;
  };

  return {
    schemaVersion: SCHEMA_VERSION,

    /** First save of a person. Returns revision 1. */
    saveProfile({ name, gender = null, input, settings, note = null, email = null, phone = null }) {
      if (!name) throw new UnsupportedInputError('name is required to save a profile', 'name');
      if (!input) throw new UnsupportedInputError('input is required', 'input');
      if (!settings) throw new UnsupportedInputError('settings is required', 'settings');

      const profileId = crypto.randomUUID();
      const at = nowIso();

      db.prepare(
        'INSERT INTO profiles (profile_id, created_at, updated_at, current_revision) VALUES (?, ?, ?, 1)',
      ).run(profileId, at, at);
      db.prepare(`INSERT INTO profile_revisions
        (profile_id, revision, name, gender, place_name, birth_date, birth_input, settings, note, email, phone, created_at)
        VALUES (?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(profileId, name, gender, input.placeName ?? null, isoDate(input),
        JSON.stringify(input), JSON.stringify(settings), note, email, phone, at);

      reindex(profileId, { name, place_name: input.placeName ?? '', note, email, phone });
      return { profileId, revision: 1 };
    },

    /**
     * Correcting a birth time appends a revision rather than overwriting, so
     * an earlier reading stays reproducible. Unspecified fields carry over.
     */
    updateProfile(profileId, changes = {}) {
      const profile = db.prepare('SELECT * FROM profiles WHERE profile_id = ?').get(profileId);
      if (!profile) throw new UnsupportedInputError(`unknown profile: ${profileId}`, 'profileId');

      const previous = hydrate(readRevision(profileId, profile.current_revision));
      const next = {
        name: changes.name ?? previous.name,
        gender: changes.gender ?? previous.gender,
        input: changes.input ?? previous.input,
        settings: changes.settings ?? previous.settings,
        note: changes.note ?? previous.note,
        email: changes.email ?? previous.email,
        phone: changes.phone ?? previous.phone,
      };
      const revision = profile.current_revision + 1;
      const at = nowIso();

      db.prepare(`INSERT INTO profile_revisions
        (profile_id, revision, name, gender, place_name, birth_date, birth_input, settings, note, email, phone, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(profileId, revision, next.name, next.gender, next.input.placeName ?? null,
        isoDate(next.input), JSON.stringify(next.input), JSON.stringify(next.settings),
        next.note, next.email, next.phone, at);
      db.prepare('UPDATE profiles SET current_revision = ?, updated_at = ? WHERE profile_id = ?')
        .run(revision, at, profileId);

      reindex(profileId, {
        name: next.name, place_name: next.input.placeName ?? '',
        note: next.note, email: next.email, phone: next.phone,
      });
      return { profileId, revision };
    },

    /** Latest revision by default; pass a number to reopen an earlier one. */
    getProfile(profileId, revision = null) {
      const profile = db.prepare('SELECT * FROM profiles WHERE profile_id = ?').get(profileId);
      if (!profile) return null;
      return hydrate(readRevision(profileId, revision ?? profile.current_revision));
    },

    listRevisions(profileId) {
      return db.prepare(
        'SELECT revision, name, birth_date, created_at FROM profile_revisions WHERE profile_id = ? ORDER BY revision',
      ).all(profileId).map((r) => ({
        revision: r.revision, name: r.name, birthDate: r.birth_date, createdAt: r.created_at,
      }));
    },

    listProfiles({ limit = 50, offset = 0 } = {}) {
      return db.prepare(`
        SELECT p.profile_id, p.current_revision, p.updated_at, r.name, r.birth_date,
               r.place_name, r.email, r.phone, r.note, r.gender
        FROM profiles p
        JOIN profile_revisions r
          ON r.profile_id = p.profile_id AND r.revision = p.current_revision
        ORDER BY p.updated_at DESC LIMIT ? OFFSET ?`,
      ).all(limit, offset).map((r) => ({
        profileId: r.profile_id,
        revision: r.current_revision,
        name: r.name,
        birthDate: r.birth_date,
        placeName: r.place_name,
        email: r.email,
        phone: r.phone,
        note: r.note,
        gender: r.gender,
        updatedAt: r.updated_at,
      }));
    },

    /** Indexed search over name, place and note of the current revision. */
    search(query, { limit = 25 } = {}) {
      const match = toMatchQuery(query);
      if (!match) return [];
      return db.prepare(`
        SELECT s.profile_id, r.name, r.birth_date, r.place_name, r.email, r.phone,
               r.note, r.gender, p.current_revision, p.updated_at
        FROM profile_search s
        JOIN profiles p ON p.profile_id = s.profile_id
        JOIN profile_revisions r
          ON r.profile_id = s.profile_id AND r.revision = p.current_revision
        WHERE profile_search MATCH ?
        ORDER BY rank LIMIT ?`,
      ).all(match, limit).map((r) => ({
        profileId: r.profile_id,
        revision: r.current_revision,
        name: r.name,
        birthDate: r.birth_date,
        placeName: r.place_name,
        email: r.email,
        phone: r.phone,
        note: r.note,
        gender: r.gender,
        updatedAt: r.updated_at,
      }));
    },

    /** Birth-date range search, served by idx_revisions_date. */
    searchByBirthDate(fromIso, toIso, { limit = 50 } = {}) {
      return db.prepare(`
        SELECT r.profile_id, r.name, r.birth_date, r.place_name, p.current_revision
        FROM profile_revisions r
        JOIN profiles p
          ON p.profile_id = r.profile_id AND p.current_revision = r.revision
        WHERE r.birth_date BETWEEN ? AND ?
        ORDER BY r.birth_date LIMIT ?`,
      ).all(fromIso, toIso, limit).map((r) => ({
        profileId: r.profile_id,
        revision: r.current_revision,
        name: r.name,
        birthDate: r.birth_date,
        placeName: r.place_name,
      }));
    },

    /** Stores a VJ-006 ChartSnapshot against the revision it was computed from. */
    saveSnapshot(profileId, revision, snapshot) {
      assertChartSnapshot(snapshot, 'snapshot');
      if (!db.prepare('SELECT 1 FROM profile_revisions WHERE profile_id = ? AND revision = ?')
        .get(profileId, revision)) {
        throw new UnsupportedInputError(`no revision ${revision} for profile ${profileId}`, 'revision');
      }
      db.prepare(`INSERT OR REPLACE INTO snapshots
        (snapshot_id, profile_id, revision, engine_version, settings, values_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ).run(snapshot.snapshotId, profileId, revision, snapshot.engineVersion,
        JSON.stringify(snapshot.settings), JSON.stringify(snapshot.values), nowIso());
      return snapshot.snapshotId;
    },

    getSnapshot(snapshotId) {
      const row = db.prepare('SELECT * FROM snapshots WHERE snapshot_id = ?').get(snapshotId);
      if (!row) return null;
      return {
        snapshotId: row.snapshot_id,
        profileId: row.profile_id,
        revision: row.revision,
        engineVersion: row.engine_version,
        settings: JSON.parse(row.settings),
        values: JSON.parse(row.values_json),
        createdAt: row.created_at,
      };
    },

    /** Deleting a person removes their revisions and snapshots (FK cascade). */
    deleteProfile(profileId) {
      db.prepare('DELETE FROM profile_search WHERE profile_id = ?').run(profileId);
      const info = db.prepare('DELETE FROM profiles WHERE profile_id = ?').run(profileId);
      return info.changes > 0;
    },

    /**
     * VJ-022 — records a consultation against the revision that was actually
     * on screen. Revision and snapshot are captured at write time and never
     * recomputed, so correcting a birth time later cannot rewrite what a past
     * reading was about.
     */
    saveConsultation({
      profileId, snapshotId = null, occurredAt = null,
      summary = null, notes = null, recommendations = null, remedies = null,
      evidence = [],
    }) {
      const profile = db.prepare('SELECT * FROM profiles WHERE profile_id = ?').get(profileId);
      if (!profile) throw new UnsupportedInputError(`unknown profile: ${profileId}`, 'profileId');
      if (snapshotId && !db.prepare('SELECT 1 FROM snapshots WHERE snapshot_id = ?').get(snapshotId)) {
        throw new UnsupportedInputError(`unknown snapshot: ${snapshotId}`, 'snapshotId');
      }

      const consultationId = crypto.randomUUID();
      const at = nowIso();
      db.exec('BEGIN');
      try {
        db.prepare(`INSERT INTO consultations
          (consultation_id, profile_id, revision, snapshot_id, occurred_at,
           summary, notes, recommendations, remedies, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ).run(consultationId, profileId, profile.current_revision, snapshotId,
          occurredAt ?? at, summary, notes, recommendations, remedies, at, at);

        for (const e of evidence) {
          if (!e || !e.ruleId) throw new UnsupportedInputError('evidence entries need a ruleId', 'evidence');
          db.prepare(`INSERT OR REPLACE INTO consultation_evidence
            (consultation_id, rule_id, rule_name, status, evidence_json) VALUES (?, ?, ?, ?, ?)`,
          ).run(consultationId, e.ruleId, e.name ?? e.ruleId, e.status ?? 'APPLIED', JSON.stringify(e));
        }
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
      return { consultationId, revision: profile.current_revision, snapshotId };
    },

    /** Edits a consultation's text. The revision and snapshot it was recorded
     *  against are deliberately not editable. */
    updateConsultationNotes(consultationId, changes = {}) {
      const existing = db.prepare('SELECT * FROM consultations WHERE consultation_id = ?').get(consultationId);
      if (!existing) throw new UnsupportedInputError(`unknown consultation: ${consultationId}`, 'consultationId');
      db.prepare(`UPDATE consultations
        SET summary = ?, notes = ?, recommendations = ?, remedies = ?, updated_at = ?
        WHERE consultation_id = ?`,
      ).run(
        changes.summary ?? existing.summary,
        changes.notes ?? existing.notes,
        changes.recommendations ?? existing.recommendations,
        changes.remedies ?? existing.remedies,
        nowIso(), consultationId,
      );
      return this.getConsultation(consultationId);
    },

    getConsultation(consultationId) {
      const row = db.prepare('SELECT * FROM consultations WHERE consultation_id = ?').get(consultationId);
      if (!row) return null;
      const evidence = db.prepare(
        'SELECT evidence_json FROM consultation_evidence WHERE consultation_id = ? ORDER BY rule_id',
      ).all(consultationId).map((e) => JSON.parse(e.evidence_json));
      return {
        consultationId: row.consultation_id,
        profileId: row.profile_id,
        revision: row.revision,
        snapshotId: row.snapshot_id,
        occurredAt: row.occurred_at,
        summary: row.summary,
        notes: row.notes,
        recommendations: row.recommendations,
        remedies: row.remedies,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        evidence,
      };
    },

    listConsultations(profileId) {
      return db.prepare(
        `SELECT consultation_id, revision, snapshot_id, occurred_at, summary, updated_at
         FROM consultations WHERE profile_id = ? ORDER BY occurred_at DESC`,
      ).all(profileId).map((r) => ({
        consultationId: r.consultation_id,
        revision: r.revision,
        snapshotId: r.snapshot_id,
        occurredAt: r.occurred_at,
        summary: r.summary,
        updatedAt: r.updated_at,
      }));
    },

    addJournalEvent({ profileId, eventDate, category = null, description }) {
      if (!db.prepare('SELECT 1 FROM profiles WHERE profile_id = ?').get(profileId)) {
        throw new UnsupportedInputError(`unknown profile: ${profileId}`, 'profileId');
      }
      if (!eventDate) throw new UnsupportedInputError('eventDate is required', 'eventDate');
      if (!description) throw new UnsupportedInputError('description is required', 'description');
      const eventId = crypto.randomUUID();
      db.prepare(
        'INSERT INTO journal_events (event_id, profile_id, event_date, category, description, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      ).run(eventId, profileId, eventDate, category, description, nowIso());
      return { eventId };
    },

    listJournalEvents(profileId) {
      return db.prepare(
        'SELECT * FROM journal_events WHERE profile_id = ? ORDER BY event_date DESC',
      ).all(profileId).map((r) => ({
        eventId: r.event_id,
        eventDate: r.event_date,
        category: r.category,
        description: r.description,
        createdAt: r.created_at,
      }));
    },

    deleteJournalEvent(eventId) {
      return db.prepare('DELETE FROM journal_events WHERE event_id = ?').run(eventId).changes > 0;
    },

    /** VJ-023 — what an import created, for an exact rollback. */
    recordImport(importId, { sourcePath, profileIds, skipped = 0, rejected = 0, lossReport = null }) {
      db.prepare(`INSERT INTO imports
        (import_id, source_path, profile_ids, skipped, rejected, loss_report, rolled_back, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
      ).run(importId, sourcePath, JSON.stringify(profileIds), skipped, rejected,
        lossReport ? JSON.stringify(lossReport) : null, nowIso());
      return { importId };
    },

    // ── VJ-024: device outbox and sync grants ───────────────────────────
    //
    // `enqueue` is idempotent on `op_id`: enqueuing the same operation twice
    // is one row. That matters because the caller generating op_ids may
    // itself be retried — a crash between writing a profile and enqueuing its
    // sync row must be safe to repeat.

    enqueue(opId, { operation, resourceId, payload }) {
      if (!opId) throw new UnsupportedInputError('opId is required', 'opId');
      if (!operation) throw new UnsupportedInputError('operation is required', 'operation');
      db.prepare(`INSERT INTO outbox (op_id, operation, resource_id, payload, state, created_at)
        VALUES (?, ?, ?, ?, 'pending', ?)
        ON CONFLICT(op_id) DO NOTHING`,
      ).run(opId, operation, resourceId ?? '', JSON.stringify(payload ?? null), nowIso());
      return { opId };
    },

    /** Oldest first, so changes reach the server in the order they were made. */
    pendingOutbox({ limit = 100 } = {}) {
      return db.prepare(
        "SELECT * FROM outbox WHERE state = 'pending' ORDER BY created_at, rowid LIMIT ?",
      ).all(limit).map(hydrateOutbox);
    },

    markSent(opId, { sentAt = nowIso() } = {}) {
      db.prepare("UPDATE outbox SET state = 'sent', sent_at = ?, last_error = NULL WHERE op_id = ?")
        .run(sentAt, opId);
      return { opId };
    },

    /** A failure keeps the row pending and records why, so it stays visible. */
    markFailed(opId, reason) {
      db.prepare(
        'UPDATE outbox SET attempts = attempts + 1, last_error = ? WHERE op_id = ?',
      ).run(String(reason ?? 'unknown'), opId);
      return { opId };
    },

    /** Parked: refused for a reason retrying cannot fix, such as a lost scope. */
    markBlocked(opId, reason) {
      db.prepare(
        "UPDATE outbox SET state = 'blocked', attempts = attempts + 1, last_error = ? WHERE op_id = ?",
      ).run(String(reason ?? 'unknown'), opId);
      return { opId };
    },

    outboxStatus() {
      const rows = db.prepare('SELECT state, COUNT(*) AS n FROM outbox GROUP BY state').all();
      const byState = Object.fromEntries(rows.map((r) => [r.state, r.n]));
      return {
        pending: byState.pending ?? 0,
        sent: byState.sent ?? 0,
        blocked: byState.blocked ?? 0,
        total: rows.reduce((a, r) => a + r.n, 0),
      };
    },

    getOutboxEntry(opId) {
      const row = db.prepare('SELECT * FROM outbox WHERE op_id = ?').get(opId);
      return row ? hydrateOutbox(row) : null;
    },

    registerDevice(deviceId, { label, scopes }) {
      if (!deviceId) throw new UnsupportedInputError('deviceId is required', 'deviceId');
      if (!label) throw new UnsupportedInputError('a device needs a label to be revoked later', 'label');
      db.prepare(`INSERT INTO sync_devices (device_id, label, scopes, created_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(device_id) DO UPDATE SET label = excluded.label, scopes = excluded.scopes`,
      ).run(deviceId, label, JSON.stringify(scopes ?? []), nowIso());
      return { deviceId };
    },

    /** Revocation keeps the row: losing it would lose the record of access. */
    revokeDevice(deviceId, { revokedAt = nowIso() } = {}) {
      const changes = db.prepare(
        'UPDATE sync_devices SET revoked_at = ? WHERE device_id = ? AND revoked_at IS NULL',
      ).run(revokedAt, deviceId).changes;
      return { deviceId, revoked: changes === 1 };
    },

    getDevice(deviceId) {
      const row = db.prepare('SELECT * FROM sync_devices WHERE device_id = ?').get(deviceId);
      return row ? hydrateDevice(row) : null;
    },

    listDevices() {
      return db.prepare('SELECT * FROM sync_devices ORDER BY created_at').all().map(hydrateDevice);
    },

    noteDeviceSync(deviceId, { at = nowIso() } = {}) {
      db.prepare('UPDATE sync_devices SET last_sync_at = ? WHERE device_id = ?').run(at, deviceId);
      return { deviceId, at };
    },

    // ── VJ-028: saved research cohorts ──────────────────────────────────
    //
    // A cohort stores the predicate and the settings, never the member list.
    // Members are whatever the library holds *now*: freezing them would turn a
    // saved question into a stale answer, and the whole point of a replay is
    // to see what changed. `last_signature` is what makes that comparison
    // exact rather than a matter of counting rows.

    saveCohort(cohortId, { name, predicate, predicateHash, settings }) {
      if (!cohortId) throw new UnsupportedInputError('cohortId is required', 'cohortId');
      if (!name) throw new UnsupportedInputError('a cohort needs a name to be found again', 'name');
      db.prepare(`INSERT INTO cohorts
        (cohort_id, name, predicate, predicate_hash, settings, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(cohort_id) DO UPDATE SET
          name = excluded.name, predicate = excluded.predicate,
          predicate_hash = excluded.predicate_hash, settings = excluded.settings`,
      ).run(cohortId, name, JSON.stringify(predicate), predicateHash,
        JSON.stringify(settings), nowIso());
      return { cohortId };
    },

    /** Records what a run produced, so the next run can be compared with it. */
    recordCohortRun(cohortId, { signature, counts, runAt = nowIso() }) {
      const changes = db.prepare(
        'UPDATE cohorts SET last_signature = ?, last_counts = ?, last_run_at = ? WHERE cohort_id = ?',
      ).run(signature, JSON.stringify(counts), runAt, cohortId).changes;
      if (changes === 0) {
        throw new UnsupportedInputError(`no cohort ${cohortId}`, 'cohortId');
      }
      return { cohortId, signature };
    },

    getCohort(cohortId) {
      const row = db.prepare('SELECT * FROM cohorts WHERE cohort_id = ?').get(cohortId);
      return row ? hydrateCohort(row) : null;
    },

    listCohorts() {
      return db.prepare('SELECT * FROM cohorts ORDER BY created_at DESC').all().map(hydrateCohort);
    },

    deleteCohort(cohortId) {
      return { deleted: db.prepare('DELETE FROM cohorts WHERE cohort_id = ?').run(cohortId).changes };
    },

    getImport(importId) {
      const row = db.prepare('SELECT * FROM imports WHERE import_id = ?').get(importId);
      if (!row) return null;
      return {
        importId: row.import_id,
        sourcePath: row.source_path,
        profileIds: JSON.parse(row.profile_ids),
        skipped: row.skipped,
        rejected: row.rejected,
        lossReport: row.loss_report ? JSON.parse(row.loss_report) : null,
        rolledBack: row.rolled_back === 1,
        createdAt: row.created_at,
      };
    },

    listImports() {
      return db.prepare('SELECT import_id, source_path, profile_ids, rolled_back, created_at FROM imports ORDER BY created_at DESC')
        .all().map((r) => ({
          importId: r.import_id,
          sourcePath: r.source_path,
          count: JSON.parse(r.profile_ids).length,
          rolledBack: r.rolled_back === 1,
          createdAt: r.created_at,
        }));
    },

    markImportRolledBack(importId) {
      db.prepare('UPDATE imports SET rolled_back = 1 WHERE import_id = ?').run(importId);
    },

    /** Draft recovery: autosaved text that outlives a crash or navigation. */
    saveDraft(draftKey, payload, profileId = null) {
      if (!draftKey) throw new UnsupportedInputError('draftKey is required', 'draftKey');
      db.prepare(
        'INSERT OR REPLACE INTO drafts (draft_key, profile_id, payload, updated_at) VALUES (?, ?, ?, ?)',
      ).run(draftKey, profileId, JSON.stringify(payload), nowIso());
      return { draftKey };
    },

    getDraft(draftKey) {
      const row = db.prepare('SELECT * FROM drafts WHERE draft_key = ?').get(draftKey);
      if (!row) return null;
      return {
        draftKey: row.draft_key,
        profileId: row.profile_id,
        payload: JSON.parse(row.payload),
        updatedAt: row.updated_at,
      };
    },

    discardDraft(draftKey) {
      return db.prepare('DELETE FROM drafts WHERE draft_key = ?').run(draftKey).changes > 0;
    },

    /**
     * VJ-013 — what is disposable and what is not.
     *
     * Records are the practitioner's own work and are never purged: profiles,
     * their revisions, consultations and the evidence cited in them, journal
     * entries, imports and unsent drafts.
     *
     * Cache is anything this app can recompute: chart snapshots, and the FTS
     * index. The one subtlety is that a snapshot **cited by a consultation is
     * not cache** — ADR-07 makes a report a snapshot rendering, so dropping it
     * would break the immutable association VJ-022 exists to provide.
     */
    purgeCache({ dryRun = false } = {}) {
      const cited = new Set(
        db.prepare('SELECT DISTINCT snapshot_id FROM consultations WHERE snapshot_id IS NOT NULL')
          .all().map((r) => r.snapshot_id),
      );
      const all = db.prepare('SELECT snapshot_id FROM snapshots').all().map((r) => r.snapshot_id);
      const disposable = all.filter((id) => !cited.has(id));

      if (dryRun) {
        return { removedSnapshots: 0, wouldRemove: disposable.length, protectedSnapshots: cited.size };
      }

      db.exec('BEGIN');
      try {
        const del = db.prepare('DELETE FROM snapshots WHERE snapshot_id = ?');
        for (const id of disposable) del.run(id);
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }

      return {
        removedSnapshots: disposable.length,
        protectedSnapshots: cited.size,
        // Stated explicitly so a caller cannot mistake this for a data reset.
        recordsRemoved: 0,
      };
    },

    /** Rebuilds the FTS index from the revisions, which remain the source of
     *  truth. Safe to call after a purge or if search ever looks wrong. */
    rebuildSearchIndex() {
      db.exec('DELETE FROM profile_search');
      const rows = db.prepare(`
        SELECT r.profile_id, r.name, r.place_name, r.note, r.email, r.phone
        FROM profile_revisions r
        JOIN profiles p ON p.profile_id = r.profile_id AND p.current_revision = r.revision`).all();
      const insert = db.prepare(
        'INSERT INTO profile_search (name, place_name, note, email, phone, profile_id) VALUES (?, ?, ?, ?, ?, ?)',
      );
      for (const r of rows) {
        insert.run(r.name, r.place_name ?? '', r.note ?? '', r.email ?? '', r.phone ?? '', r.profile_id);
      }
      return { indexed: rows.length };
    },

    /** Row counts and file size, so storage pressure is visible before a
     *  write fails rather than after (VJ-013: "quota failure visible"). */
    storageReport() {
      const count = (table) => db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get().n;
      const cited = db.prepare('SELECT COUNT(DISTINCT snapshot_id) AS n FROM consultations WHERE snapshot_id IS NOT NULL').get().n;
      let bytes = null;
      try {
        if (filePath !== ':memory:') bytes = fs.statSync(filePath).size;
      } catch { /* a missing file is reported as unknown rather than zero */ }
      return {
        path: filePath,
        bytes,
        records: {
          profiles: count('profiles'),
          revisions: count('profile_revisions'),
          consultations: count('consultations'),
          journalEvents: count('journal_events'),
          drafts: count('drafts'),
          imports: count('imports'),
        },
        cache: {
          snapshots: count('snapshots'),
          citedSnapshots: cited,
          purgeableSnapshots: count('snapshots') - cited,
        },
      };
    },

    /** Every row, for VJ-012 archives. Raw column shape on purpose: an
     *  archive should round-trip storage, not a presentation view. */
    exportAll() {
      return {
        profiles: db.prepare('SELECT * FROM profiles ORDER BY profile_id').all(),
        revisions: db.prepare('SELECT * FROM profile_revisions ORDER BY profile_id, revision').all(),
        snapshots: db.prepare('SELECT * FROM snapshots ORDER BY snapshot_id').all(),
        consultations: db.prepare('SELECT * FROM consultations ORDER BY consultation_id').all(),
        consultationEvidence: db.prepare('SELECT * FROM consultation_evidence ORDER BY consultation_id, rule_id').all(),
        journalEvents: db.prepare('SELECT * FROM journal_events ORDER BY event_id').all(),
        imports: db.prepare('SELECT * FROM imports ORDER BY created_at').all(),
      };
    },

    countProfiles() {
      return db.prepare('SELECT COUNT(*) AS n FROM profiles').get().n;
    },

    /**
     * Restores exported rows. Runs in one transaction so a failure part-way
     * leaves the library as it was rather than half-populated.
     *
     * Rows from an older schema simply lack the newer columns, which arrive
     * as null — the reason the archive stores a schemaVersion.
     */
    importAll(payload, { overwrite = false } = {}) {
      if (!payload || !Array.isArray(payload.profiles) || !Array.isArray(payload.revisions)) {
        throw new UnsupportedInputError('payload must contain profiles and revisions', 'payload');
      }
      if (!overwrite && this.countProfiles() > 0) {
        throw new UnsupportedInputError(
          'target library already contains profiles; pass overwrite to replace them',
          'overwrite',
        );
      }

      db.exec('BEGIN');
      try {
        if (overwrite) {
          db.exec(`DELETE FROM consultation_evidence; DELETE FROM consultations;
                   DELETE FROM journal_events; DELETE FROM imports; DELETE FROM snapshots;
                   DELETE FROM profile_revisions; DELETE FROM profiles; DELETE FROM profile_search;`);
        }
        for (const p of payload.profiles) {
          db.prepare(
            'INSERT INTO profiles (profile_id, created_at, updated_at, current_revision) VALUES (?, ?, ?, ?)',
          ).run(p.profile_id, p.created_at, p.updated_at, p.current_revision);
        }
        for (const r of payload.revisions) {
          db.prepare(`INSERT INTO profile_revisions
            (profile_id, revision, name, gender, place_name, birth_date, birth_input, settings, note, email, phone, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          ).run(r.profile_id, r.revision, r.name, r.gender ?? null, r.place_name ?? null,
            r.birth_date ?? null, r.birth_input, r.settings, r.note ?? null,
            r.email ?? null, r.phone ?? null, r.created_at);
        }
        for (const s of payload.snapshots ?? []) {
          db.prepare(`INSERT INTO snapshots
            (snapshot_id, profile_id, revision, engine_version, settings, values_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
          ).run(s.snapshot_id, s.profile_id, s.revision, s.engine_version,
            s.settings, s.values_json, s.created_at);
        }

        // Consultations and journal entries are part of a backup: an archive
        // that silently dropped them would lose the practitioner's own notes.
        for (const c of payload.consultations ?? []) {
          db.prepare(`INSERT INTO consultations
            (consultation_id, profile_id, revision, snapshot_id, occurred_at,
             summary, notes, recommendations, remedies, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          ).run(c.consultation_id, c.profile_id, c.revision, c.snapshot_id ?? null, c.occurred_at,
            c.summary ?? null, c.notes ?? null, c.recommendations ?? null, c.remedies ?? null,
            c.created_at, c.updated_at);
        }
        for (const e of payload.consultationEvidence ?? []) {
          db.prepare(`INSERT INTO consultation_evidence
            (consultation_id, rule_id, rule_name, status, evidence_json) VALUES (?, ?, ?, ?, ?)`,
          ).run(e.consultation_id, e.rule_id, e.rule_name ?? null, e.status, e.evidence_json);
        }
        for (const j of payload.journalEvents ?? []) {
          db.prepare(`INSERT INTO journal_events
            (event_id, profile_id, event_date, category, description, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
          ).run(j.event_id, j.profile_id, j.event_date, j.category ?? null, j.description, j.created_at);
        }

        for (const im of payload.imports ?? []) {
          db.prepare(`INSERT INTO imports
            (import_id, source_path, profile_ids, skipped, rejected, loss_report, rolled_back, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          ).run(im.import_id, im.source_path, im.profile_ids, im.skipped, im.rejected,
            im.loss_report ?? null, im.rolled_back, im.created_at);
        }

        // Rebuild the search index from the restored rows rather than trusting
        // an index shipped inside the archive.
        db.exec('DELETE FROM profile_search');
        const current = db.prepare(`
          SELECT r.profile_id, r.name, r.place_name, r.note, r.email, r.phone
          FROM profile_revisions r
          JOIN profiles p ON p.profile_id = r.profile_id AND p.current_revision = r.revision`).all();
        const insert = db.prepare(
          'INSERT INTO profile_search (name, place_name, note, email, phone, profile_id) VALUES (?, ?, ?, ?, ?, ?)',
        );
        for (const r of current) {
          insert.run(r.name, r.place_name ?? '', r.note ?? '', r.email ?? '', r.phone ?? '', r.profile_id);
        }
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }

      return {
        profiles: payload.profiles.length,
        revisions: payload.revisions.length,
        snapshots: (payload.snapshots ?? []).length,
        consultations: (payload.consultations ?? []).length,
        journalEvents: (payload.journalEvents ?? []).length,
      };
    },

    close() { db.close(); },
  };
}

module.exports = { openLibrary, SCHEMA_VERSION };
