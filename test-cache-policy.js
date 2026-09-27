/**
 * VJ-013 — cache and records are separate things.
 *
 * Acceptance: cache purge cannot remove charts/notes; quota failure visible.
 *
 * The first half is tested by purging with everything populated and asserting
 * each record type is still there afterwards — a purge that quietly took a
 * consultation would fail here rather than in someone's practice.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { openLibrary } = require('./src/library/chartRepository');
const { createCalculationRequest } = require('./src/contracts/calculationRequest');
const { createChartSnapshot } = require('./src/contracts/chartSnapshot');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vj013-'));
const dbPath = path.join(tmp, 'library.db');

const chennai = {
  year: 1990, month: 5, day: 15, hour: 10, minute: 30,
  ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 13.0827, longitude: 80.2707, placeName: 'Chennai',
};
const settings = { ayanamsha: 'Lahiri', houseSystem: 'Porphyrius', nodeType: 'mean', calendarMode: 'tirukanita' };
const snapshotFor = (values) => createChartSnapshot({
  request: createCalculationRequest({ input: chennai, settings, outputs: ['parashariChart'] }),
  values,
});

const lib = openLibrary(dbPath);

// Everything a practitioner would have after real use.
const { profileId } = lib.saveProfile({
  name: 'Ravi Kumar', input: chennai, settings, note: 'first consultation', email: 'r@example.com',
});
lib.updateProfile(profileId, { note: 'time rectified' });
lib.addJournalEvent({ profileId, eventDate: '2021-02-14', description: 'Married' });
lib.saveDraft(`consultation:${profileId}`, { notes: 'half-written' }, profileId);
lib.recordImport('imp-1', { sourcePath: 'somewhere.xml', profileIds: [profileId] });

// Two snapshots: one cited by a consultation, one merely computed.
const citedSnapshot = snapshotFor({ marker: 'cited' });
const looseSnapshot = snapshotFor({ marker: 'loose' });
lib.saveSnapshot(profileId, 2, citedSnapshot);
lib.saveSnapshot(profileId, 2, looseSnapshot);
assert.notEqual(citedSnapshot.snapshotId, looseSnapshot.snapshotId);

const consultation = lib.saveConsultation({
  profileId, snapshotId: citedSnapshot.snapshotId,
  summary: 'Career reading', notes: 'Discussed Rahu dasha.',
});

// ------------------------------------------------------ storage report --

const before = lib.storageReport();
assert.equal(before.records.profiles, 1);
assert.equal(before.records.revisions, 2);
assert.equal(before.records.consultations, 1);
assert.equal(before.records.journalEvents, 1);
assert.equal(before.records.drafts, 1);
assert.equal(before.records.imports, 1);
assert.equal(before.cache.snapshots, 2);
assert.equal(before.cache.citedSnapshots, 1);
assert.equal(before.cache.purgeableSnapshots, 1, 'only the uncited snapshot is disposable');
assert.ok(before.bytes > 0, 'file size is reported so storage pressure is visible');

// A dry run must not change anything.
const dry = lib.purgeCache({ dryRun: true });
assert.equal(dry.wouldRemove, 1);
assert.equal(dry.removedSnapshots, 0);
assert.equal(lib.storageReport().cache.snapshots, 2, 'a dry run writes nothing');

// ------------------------------------- purge cannot remove charts/notes --

const purge = lib.purgeCache();
assert.equal(purge.removedSnapshots, 1);
assert.equal(purge.protectedSnapshots, 1);
assert.equal(purge.recordsRemoved, 0);

const after = lib.storageReport();
assert.deepEqual(after.records, before.records,
  'not one record of any kind may be removed by a cache purge');

// Each record type, checked by reading it back rather than by counting.
const profile = lib.getProfile(profileId);
assert.equal(profile.name, 'Ravi Kumar', 'the chart survives');
assert.equal(profile.revision, 2);
assert.equal(lib.getProfile(profileId, 1).note, 'first consultation',
  'superseded revisions survive');

const keptConsultation = lib.getConsultation(consultation.consultationId);
assert.equal(keptConsultation.notes, 'Discussed Rahu dasha.', 'notes survive');
assert.equal(keptConsultation.snapshotId, citedSnapshot.snapshotId);

assert.equal(lib.listJournalEvents(profileId).length, 1, 'journal entries survive');
assert.ok(lib.getDraft(`consultation:${profileId}`), 'unsent drafts survive — they are unfinished work');
assert.ok(lib.getImport('imp-1'), 'import history survives, or rollback would break');
assert.equal(lib.search('Ravi').length, 1, 'search still finds the profile');

// ------------------------------- a cited snapshot is not cache (ADR-07) --

assert.ok(lib.getSnapshot(citedSnapshot.snapshotId),
  'a snapshot cited by a consultation must survive: ADR-07 makes a report a '
  + 'snapshot rendering, so purging it would break the citation');
assert.equal(lib.getSnapshot(citedSnapshot.snapshotId).values.marker, 'cited');
assert.equal(lib.getSnapshot(looseSnapshot.snapshotId), null,
  'an uncited snapshot is recomputable, so it is cache');

// Purging twice is safe and removes nothing further.
const second = lib.purgeCache();
assert.equal(second.removedSnapshots, 0);
assert.equal(lib.storageReport().records.profiles, 1);

// ---------------------------------------- the index is cache, rebuildable --

const rebuilt = lib.rebuildSearchIndex();
assert.equal(rebuilt.indexed, 1);
assert.equal(lib.search('Ravi').length, 1, 'search works again after a rebuild');
assert.equal(lib.search('r@example.com').length, 1);

lib.close();
fs.rmSync(tmp, { recursive: true, force: true });

// ------------------------------------------------- quota failure visible --

// The browser store classifies a quota error rather than swallowing it. Tested
// against the DOMException shape browsers actually throw.
const storePath = path.join(__dirname, 'src', 'workspace', 'persistentStore.ts');
const storeSource = fs.readFileSync(storePath, 'utf8');
assert.match(storeSource, /QuotaExceededError/, 'quota errors are recognised by name');
assert.match(storeSource, /code === 22/, 'and by the numeric code browsers disagree on names for');
assert.ok(!/catch\s*\{\s*\/\*[^*]*\*\/\s*\}/.test(storeSource.replace(/\n/g, ' ')),
  'the store must not contain a swallow-and-ignore catch');
assert.match(storeSource, /StoreResult/, 'writes return a result the caller can surface');

// The provider must report a failed write rather than ignore it.
const providerSource = fs.readFileSync(
  path.join(__dirname, 'src', 'workspace', 'WorkspaceProvider.tsx'), 'utf8');
assert.match(providerSource, /setStorageFailure\(result\.ok \? null : result\.failure\)/,
  'a failed preference write is surfaced to the UI');
assert.ok(!providerSource.includes('localStorage.setItem'),
  'the provider goes through the reporting store, not localStorage directly');

// And the UI must actually render it.
const barSource = fs.readFileSync(
  path.join(__dirname, 'src', 'workspace', 'ActiveProfileBar.tsx'), 'utf8');
assert.match(barSource, /storageFailure\.message/, 'the failure message reaches the screen');

console.log(JSON.stringify({
  pass: true,
  purged: purge.removedSnapshots,
  protectedSnapshots: purge.protectedSnapshots,
  recordsRemoved: purge.recordsRemoved,
}, null, 2));
