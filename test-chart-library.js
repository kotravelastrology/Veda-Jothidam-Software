/**
 * VJ-011 — chart library repository.
 *
 * Acceptance: save / reopen / update version; indexed local search.
 * Reopen is tested against a real file on disk, not an in-memory database,
 * because "the data was still there after restarting" is the actual claim.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { openLibrary, SCHEMA_VERSION } = require('./src/library/chartRepository');
const { createCalculationRequest } = require('./src/contracts/calculationRequest');
const { createChartSnapshot } = require('./src/contracts/chartSnapshot');

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vj011-'));
const dbPath = path.join(tmpDir, 'nested', 'library.db');

const chennai = {
  year: 1990, month: 5, day: 15, hour: 10, minute: 30,
  ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 13.0827, longitude: 80.2707, placeName: 'Chennai',
};
const madurai = { ...chennai, year: 2004, month: 8, day: 31, hour: 4, minute: 12, placeName: 'Madurai' };
const settings = { ayanamsha: 'Lahiri', houseSystem: 'Porphyrius', nodeType: 'mean', calendarMode: 'tirukanita' };

// ------------------------------------------------------------------ save --

let lib = openLibrary(dbPath);
assert.equal(lib.schemaVersion, SCHEMA_VERSION);
assert.ok(fs.existsSync(dbPath), 'library file is created, including missing parent directories');

const { profileId, revision } = lib.saveProfile({
  name: 'Ravi Kumar', gender: 'male', input: chennai, settings, note: 'first consultation',
  email: 'ravi@example.com', phone: '+91-98400-00001',
});
assert.equal(revision, 1);

const second = lib.saveProfile({ name: 'Meena', gender: 'female', input: madurai, settings });
assert.notEqual(second.profileId, profileId, 'each save gets its own identity');

assert.throws(() => lib.saveProfile({ input: chennai, settings }), /name is required/);
assert.throws(() => lib.saveProfile({ name: 'X', settings }), /input is required/);

// ---------------------------------------------------------------- reopen --

lib.close();
lib = openLibrary(dbPath);

const reopened = lib.getProfile(profileId);
assert.equal(reopened.name, 'Ravi Kumar');
assert.equal(reopened.revision, 1);
assert.deepEqual(reopened.input, chennai, 'birth input survives a close and reopen intact');
assert.deepEqual(reopened.settings, settings, 'settings are stored with the profile, not assumed');
assert.equal(reopened.birthDate, '1990-05-15');
assert.equal(reopened.email, 'ravi@example.com', 'contact details survive reopen');
assert.equal(reopened.phone, '+91-98400-00001');

// -------------------------------------------------------- update version --

// A corrected birth time must not destroy the earlier reading.
const corrected = { ...chennai, hour: 10, minute: 42 };
const updated = lib.updateProfile(profileId, { input: corrected, note: 'time rectified' });
assert.equal(updated.revision, 2);

assert.equal(lib.getProfile(profileId).revision, 2, 'latest revision is returned by default');
assert.equal(lib.getProfile(profileId).input.minute, 42);
assert.equal(lib.getProfile(profileId).note, 'time rectified');

const original = lib.getProfile(profileId, 1);
assert.equal(original.input.minute, 30, 'revision 1 still readable after the correction');
assert.equal(original.note, 'first consultation');

// Fields not mentioned in an update carry forward.
assert.equal(lib.getProfile(profileId).name, 'Ravi Kumar');
assert.equal(lib.getProfile(profileId).gender, 'male');

const revisions = lib.listRevisions(profileId);
assert.equal(revisions.length, 2);
assert.deepEqual(revisions.map((r) => r.revision), [1, 2]);

assert.throws(() => lib.updateProfile('no-such-id', { note: 'x' }), /unknown profile/);

// --------------------------------------------------------------- search --

const byName = lib.search('Ravi');
assert.equal(byName.length, 1);
assert.equal(byName[0].profileId, profileId);
assert.equal(byName[0].revision, 2, 'search reports the current revision');

assert.equal(lib.search('Rav')[0].profileId, profileId, 'prefix search matches');
assert.equal(lib.search('Madurai')[0].profileId, second.profileId, 'place is searchable');
assert.equal(lib.search('rectified')[0].profileId, profileId, 'note is searchable');
assert.equal(lib.search('ravi@example.com')[0].profileId, profileId, 'email is searchable');
assert.equal(lib.search('98400')[0].profileId, profileId, 'phone is searchable');
assert.equal(lib.search('Nobody').length, 0);

// Punctuation must not break the FTS query.
assert.doesNotThrow(() => lib.search('O"Brien (test) AND'), 'raw user text is quoted, not injected');

// The index follows the current revision rather than the original.
lib.updateProfile(profileId, { name: 'Ravi Shankar' });
assert.equal(lib.search('Shankar').length, 1, 'renamed profile is findable');
assert.equal(lib.search('Kumar').length, 0, 'stale name no longer matches the index');

const inRange = lib.searchByBirthDate('1990-01-01', '1990-12-31');
assert.equal(inRange.length, 1);
assert.equal(inRange[0].name, 'Ravi Shankar');
assert.equal(lib.searchByBirthDate('2010-01-01', '2020-12-31').length, 0);

assert.equal(lib.listProfiles().length, 2);

// ------------------------------------------------------------- snapshots --

const request = createCalculationRequest({ input: chennai, settings, outputs: ['parashariChart'] });
const snapshot = createChartSnapshot({ request, values: { lagna: { rasi: 'Karkataka' } } });

const current = lib.getProfile(profileId);
lib.saveSnapshot(profileId, current.revision, snapshot);

const loaded = lib.getSnapshot(snapshot.snapshotId);
assert.equal(loaded.snapshotId, snapshot.snapshotId);
assert.equal(loaded.values.lagna.rasi, 'Karkataka');
assert.equal(loaded.revision, current.revision, 'a snapshot records which revision produced it');
assert.equal(loaded.settings.ayanamsha, 'Lahiri');

assert.throws(() => lib.saveSnapshot(profileId, 99, snapshot), /no revision 99/);
assert.throws(() => lib.saveSnapshot(profileId, current.revision, { bogus: true }), /required|not a ChartSnapshot/);

// Snapshots survive a restart, which is what makes a stored report reproducible.
lib.close();
lib = openLibrary(dbPath);
assert.equal(lib.getSnapshot(snapshot.snapshotId).values.lagna.rasi, 'Karkataka');

// ---------------------------------------------------------------- delete --

assert.equal(lib.deleteProfile(second.profileId), true);
assert.equal(lib.getProfile(second.profileId), null);
assert.equal(lib.search('Madurai').length, 0, 'delete clears the search index too');
assert.equal(lib.deleteProfile('no-such-id'), false);

// Cascade: the remaining profile's snapshot goes with it.
lib.deleteProfile(profileId);
assert.equal(lib.getSnapshot(snapshot.snapshotId), null, 'snapshots cascade with the profile');

lib.close();

// ------------------------------------------------------- v1 -> v2 migration --

// Build a v1 library by hand, then prove opening it upgrades in place without
// losing rows — the property ADR-08 demands of every user-data migration.
const { DatabaseSync } = require('node:sqlite');
const legacyPath = path.join(tmpDir, 'legacy-v1.db');
const legacy = new DatabaseSync(legacyPath);
legacy.exec(`
  CREATE TABLE library_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
  CREATE TABLE profiles (
    profile_id TEXT PRIMARY KEY, created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL, current_revision INTEGER NOT NULL);
  CREATE TABLE profile_revisions (
    profile_id TEXT NOT NULL, revision INTEGER NOT NULL, name TEXT NOT NULL,
    gender TEXT, place_name TEXT, birth_date TEXT, birth_input TEXT NOT NULL,
    settings TEXT NOT NULL, note TEXT, created_at TEXT NOT NULL,
    PRIMARY KEY (profile_id, revision));
  CREATE TABLE snapshots (
    snapshot_id TEXT PRIMARY KEY, profile_id TEXT NOT NULL, revision INTEGER NOT NULL,
    engine_version TEXT NOT NULL, settings TEXT NOT NULL, values_json TEXT NOT NULL,
    created_at TEXT NOT NULL);
  CREATE VIRTUAL TABLE profile_search USING fts5(name, place_name, note, profile_id UNINDEXED);
`);
legacy.prepare("INSERT INTO library_meta VALUES ('schemaVersion', '1')").run();
legacy.prepare('INSERT INTO profiles VALUES (?, ?, ?, 1)').run('legacy-1', '2026-01-01', '2026-01-01');
legacy.prepare(`INSERT INTO profile_revisions
  (profile_id, revision, name, gender, place_name, birth_date, birth_input, settings, note, created_at)
  VALUES ('legacy-1', 1, 'Old Client', 'female', 'Madurai', '1985-03-11', ?, ?, 'legacy note', '2026-01-01')`)
  .run(JSON.stringify(madurai), JSON.stringify(settings));
legacy.close();

const upgraded = openLibrary(legacyPath);
assert.equal(upgraded.schemaVersion, 2);

const migrated = upgraded.getProfile('legacy-1');
assert.equal(migrated.name, 'Old Client', 'v1 rows survive the upgrade');
assert.equal(migrated.note, 'legacy note');
assert.equal(migrated.email, null, 'new columns default to null for old rows');

// The rebuilt FTS index must cover rows written before v2 existed.
assert.equal(upgraded.search('Old').length, 1, 'search index rebuilt from existing rows');
assert.equal(upgraded.search('Madurai')[0].profileId, 'legacy-1');

// And the upgraded library must accept writes using the new columns.
upgraded.updateProfile('legacy-1', { email: 'old@example.com' });
assert.equal(upgraded.getProfile('legacy-1').email, 'old@example.com');
assert.equal(upgraded.search('old@example.com').length, 1);
upgraded.close();

// Reopening an already-migrated library must be a no-op, not a second upgrade.
const reMigrated = openLibrary(legacyPath);
assert.equal(reMigrated.schemaVersion, 2);
assert.equal(reMigrated.getProfile('legacy-1').email, 'old@example.com');
assert.equal(reMigrated.listRevisions('legacy-1').length, 2);
reMigrated.close();

fs.rmSync(tmpDir, { recursive: true, force: true });

console.log(JSON.stringify({ pass: true, schemaVersion: SCHEMA_VERSION }, null, 2));
