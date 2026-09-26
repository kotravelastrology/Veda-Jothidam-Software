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

const SCHEMA_VERSION = 2;

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

    close() { db.close(); },
  };
}

module.exports = { openLibrary, SCHEMA_VERSION };
