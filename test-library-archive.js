/**
 * VJ-012 — backup, archive, migration, restore.
 *
 * Acceptance: blank install restore; checksum/schema errors; original archive
 * preserved.
 */
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { openLibrary, SCHEMA_VERSION } = require('./src/library/chartRepository');
const { createArchive, verifyArchive, restoreArchive } = require('./src/library/archive');
const { createCalculationRequest } = require('./src/contracts/calculationRequest');
const { createChartSnapshot } = require('./src/contracts/chartSnapshot');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vj012-'));
const sourcePath = path.join(tmp, 'source', 'library.db');
const archivePath = path.join(tmp, 'backups', 'library-archive.json');

const chennai = {
  year: 1990, month: 5, day: 15, hour: 10, minute: 30,
  ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 13.0827, longitude: 80.2707, placeName: 'Chennai',
};
const settings = { ayanamsha: 'Lahiri', houseSystem: 'Porphyrius', nodeType: 'mean', calendarMode: 'tirukanita' };
const fileHash = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');

// ----------------------------------------------------------- populate --

let lib = openLibrary(sourcePath);
const a = lib.saveProfile({
  name: 'Ravi Kumar', gender: 'male', input: chennai, settings,
  note: 'first consultation', email: 'ravi@example.com', phone: '+91-98400-00001',
});
lib.updateProfile(a.profileId, { input: { ...chennai, minute: 42 }, note: 'time rectified' });
const b = lib.saveProfile({ name: 'Meena', input: { ...chennai, placeName: 'Madurai' }, settings });

const request = createCalculationRequest({ input: chennai, settings, outputs: ['parashariChart'] });
const snapshot = createChartSnapshot({ request, values: { lagna: { rasi: 'Karkataka' } } });
lib.saveSnapshot(a.profileId, 2, snapshot);
lib.close();

// -------------------------------------------------------------- backup --

const created = createArchive(sourcePath, archivePath);
assert.ok(fs.existsSync(archivePath), 'archive is written, creating parent directories');
assert.equal(created.profiles, 2);
assert.equal(created.revisions, 3, 'every revision is archived, not just the current one');
assert.equal(created.snapshots, 1);

const manifest = verifyArchive(archivePath);
assert.equal(manifest.schemaVersion, SCHEMA_VERSION);
assert.equal(manifest.counts.profiles, 2);

const archiveHashBefore = fileHash(archivePath);

// ---------------------------------------------- blank install restore --

// A different directory with no library: the "new machine" case.
const blankPath = path.join(tmp, 'blank-install', 'library.db');
assert.ok(!fs.existsSync(blankPath));

const restored = restoreArchive(archivePath, blankPath);
assert.equal(restored.profiles, 2);
assert.equal(restored.revisions, 3);
assert.equal(restored.snapshots, 1);

lib = openLibrary(blankPath);
const ravi = lib.getProfile(a.profileId);
assert.equal(ravi.name, 'Ravi Kumar');
assert.equal(ravi.revision, 2, 'current revision pointer is restored');
assert.equal(ravi.input.minute, 42, 'the corrected reading is restored');
assert.equal(ravi.email, 'ravi@example.com');

const original = lib.getProfile(a.profileId, 1);
assert.equal(original.input.minute, 30, 'superseded revisions survive a backup and restore');
assert.equal(original.note, 'first consultation');

assert.equal(lib.getSnapshot(snapshot.snapshotId).values.lagna.rasi, 'Karkataka',
  'stored snapshots survive, so an old report still resolves');

// Search must work after restore, which it only can if the index was rebuilt.
assert.equal(lib.search('Madurai')[0].profileId, b.profileId, 'search index rebuilt on restore');
assert.equal(lib.search('ravi@example.com').length, 1);
assert.equal(lib.listProfiles().length, 2);
lib.close();

// --------------------------------------------- original archive preserved --

assert.equal(fileHash(archivePath), archiveHashBefore,
  'restoring must not modify the archive — it is often the only copy');

// ---------------------------------------------------- refuses to clobber --

assert.throws(() => restoreArchive(archivePath, blankPath),
  /already contains profiles/, 'a non-empty target is refused by default');

// Overwrite is allowed when asked for explicitly, and replaces rather than duplicates.
const overwritten = restoreArchive(archivePath, blankPath, { overwrite: true });
assert.equal(overwritten.profiles, 2);
lib = openLibrary(blankPath);
assert.equal(lib.listProfiles().length, 2, 'overwrite replaces rather than duplicating');
lib.close();

// ------------------------------------------------------ checksum errors --

const tamperedPath = path.join(tmp, 'tampered.json');
const parsed = JSON.parse(fs.readFileSync(archivePath, 'utf8'));
parsed.payload.revisions[0].name = 'Someone Else';
fs.writeFileSync(tamperedPath, JSON.stringify(parsed, null, 2));

assert.throws(() => verifyArchive(tamperedPath), /checksum mismatch/,
  'edited contents are caught by the checksum');
assert.throws(() => restoreArchive(tamperedPath, path.join(tmp, 'never.db')), /checksum mismatch/,
  'a corrupt archive is refused before anything is written');
assert.ok(!fs.existsSync(path.join(tmp, 'never.db')),
  'a refused restore leaves no half-written library behind');

const truncatedPath = path.join(tmp, 'truncated.json');
fs.writeFileSync(truncatedPath, fs.readFileSync(archivePath, 'utf8').slice(0, 400));
assert.throws(() => verifyArchive(truncatedPath), /not valid JSON|truncated/);

assert.throws(() => verifyArchive(path.join(tmp, 'absent.json')), /archive not found/);

const foreignPath = path.join(tmp, 'foreign.json');
fs.writeFileSync(foreignPath, JSON.stringify({ kind: 'something-else' }));
assert.throws(() => verifyArchive(foreignPath), /not a Veda Jothidam library archive/);

// -------------------------------------------------------- schema errors --

const futurePath = path.join(tmp, 'future.json');
const future = JSON.parse(fs.readFileSync(archivePath, 'utf8'));
future.schemaVersion = SCHEMA_VERSION + 5;
fs.writeFileSync(futurePath, JSON.stringify(future, null, 2));
assert.throws(() => verifyArchive(futurePath), /newer than this build/,
  'an archive from a future version is refused, not silently half-read');

const futureFormatPath = path.join(tmp, 'future-format.json');
const futureFormat = JSON.parse(fs.readFileSync(archivePath, 'utf8'));
futureFormat.archiveVersion = 99;
fs.writeFileSync(futureFormatPath, JSON.stringify(futureFormat, null, 2));
assert.throws(() => verifyArchive(futureFormatPath), /archive format v99 is newer/);

// ------------------------------------- restoring an older schema archive --

// A v1-era archive (no email/phone) must restore into the current schema.
const legacyArchivePath = path.join(tmp, 'legacy-v1.json');
const legacy = JSON.parse(fs.readFileSync(archivePath, 'utf8'));
legacy.schemaVersion = 1;
for (const r of legacy.payload.revisions) { delete r.email; delete r.phone; }
legacy.checksum = require('node:crypto').createHash('sha256')
  .update(JSON.stringify((function c(v) {
    if (Array.isArray(v)) return v.map(c);
    if (v && typeof v === 'object') return Object.keys(v).sort().reduce((o, k) => { o[k] = c(v[k]); return o; }, {});
    return v;
  })(legacy.payload))).digest('hex');
fs.writeFileSync(legacyArchivePath, JSON.stringify(legacy, null, 2));

const legacyTarget = path.join(tmp, 'legacy-restore', 'library.db');
const legacyResult = restoreArchive(legacyArchivePath, legacyTarget);
assert.equal(legacyResult.fromSchemaVersion, 1);
assert.equal(legacyResult.intoSchemaVersion, SCHEMA_VERSION, 'older archive lands in the current schema');

lib = openLibrary(legacyTarget);
const legacyRavi = lib.getProfile(a.profileId);
assert.equal(legacyRavi.name, 'Ravi Kumar', 'rows from an older archive restore intact');
assert.equal(legacyRavi.email, null, 'columns the old archive lacked arrive as null');
assert.equal(lib.search('Ravi').length, 1, 'search works for rows restored from an older schema');
lib.close();

fs.rmSync(tmp, { recursive: true, force: true });

console.log(JSON.stringify({
  pass: true, schemaVersion: SCHEMA_VERSION, archived: created,
}, null, 2));
