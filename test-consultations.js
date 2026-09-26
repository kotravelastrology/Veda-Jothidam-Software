/**
 * VJ-022 — consultation notes and event journal.
 *
 * Acceptance: evidence links; draft recovery; immutable report association.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { openLibrary, SCHEMA_VERSION } = require('./src/library/chartRepository');
const { createArchive, restoreArchive } = require('./src/library/archive');
const { createCalculationRequest } = require('./src/contracts/calculationRequest');
const { createChartSnapshot } = require('./src/contracts/chartSnapshot');
const { createRuleEvidence, withheldEvidence } = require('./src/contracts/ruleEvidence');
const { calculateNabhasaYogas } = require('./src/chart/nabhasaYoga');
const { calculateParashariChart } = require('./src/chart/parashariChart');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vj022-'));
const dbPath = path.join(tmp, 'library.db');

const chennai = {
  year: 1990, month: 5, day: 15, hour: 10, minute: 30,
  ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 13.0827, longitude: 80.2707, placeName: 'Chennai',
};
const settings = { ayanamsha: 'Lahiri', houseSystem: 'Porphyrius', nodeType: 'mean', calendarMode: 'tirukanita' };

let lib = openLibrary(dbPath);
assert.equal(lib.schemaVersion, 3, 'consultations arrive with schema v3');

const { profileId } = lib.saveProfile({ name: 'Ravi Kumar', input: chennai, settings });

// A real snapshot, so the association is to something that actually exists.
const request = createCalculationRequest({ input: chennai, settings, outputs: ['parashariChart'] });
const snapshot = createChartSnapshot({ request, values: { lagna: { rasi: 'Karkataka' } } });
lib.saveSnapshot(profileId, 1, snapshot);

// --------------------------------------------------------- evidence links --

// Evidence taken from a real engine result rather than a hand-made sample.
const chart = calculateParashariChart(request.chartContext);
const nabhasa = calculateNabhasaYogas({
  Sun: chart.grahas.Sun.rasiIndex, Moon: chart.grahas.Moon.rasiIndex,
  Mars: chart.grahas.Mars.rasiIndex, Mercury: chart.grahas.Mercury.rasiIndex,
  Jupiter: chart.grahas.Jupiter.rasiIndex, Venus: chart.grahas.Venus.rasiIndex,
  Saturn: chart.grahas.Saturn.rasiIndex, Lagna: chart.lagna.rasiIndex,
}, { isWaxingMoon: true });

const applied = createRuleEvidence({
  ruleId: 'NABHASA_YOGA',
  name: 'Nabhasa',
  outcome: nabhasa.yogas.map((y) => y.name),
  source: nabhasa.source,
});
const withheld = withheldEvidence({
  ruleId: 'LIFE_EVENT_FORECAST',
  reason: 'no verified classical source',
});

const first = lib.saveConsultation({
  profileId,
  snapshotId: snapshot.snapshotId,
  summary: 'Career reading',
  notes: 'Discussed Rahu dasha and the 10th house.',
  recommendations: 'Review again after the Sun bhukti.',
  remedies: 'Surya namaskaram',
  evidence: [applied, withheld],
});
assert.equal(first.revision, 1);

const loaded = lib.getConsultation(first.consultationId);
assert.equal(loaded.evidence.length, 2, 'evidence links are stored with the consultation');
const byRule = Object.fromEntries(loaded.evidence.map((e) => [e.ruleId, e]));
assert.ok(byRule.NABHASA_YOGA.source.pageLocus, 'an applied rule keeps its page locator');
assert.equal(byRule.LIFE_EVENT_FORECAST.status, 'SOURCE_REQUIRED',
  'a withheld rule stays withheld in the record, not silently dropped');

assert.throws(() => lib.saveConsultation({ profileId, evidence: [{ name: 'no id' }] }),
  /evidence entries need a ruleId/);
// A failed evidence write must not leave the consultation behind.
assert.equal(lib.listConsultations(profileId).length, 1, 'a rejected consultation rolls back entirely');

assert.throws(() => lib.saveConsultation({ profileId, snapshotId: 'not-a-snapshot' }), /unknown snapshot/);
assert.throws(() => lib.saveConsultation({ profileId: 'nobody' }), /unknown profile/);

// ------------------------------------------ immutable report association --

// Correcting the birth time creates revision 2 and a different chart.
lib.updateProfile(profileId, { input: { ...chennai, minute: 42 } });
assert.equal(lib.getProfile(profileId).revision, 2);

const after = lib.getConsultation(first.consultationId);
assert.equal(after.revision, 1,
  'a past consultation stays bound to the revision it was given against');
assert.equal(after.snapshotId, snapshot.snapshotId,
  'and to the exact snapshot that was on screen');

// A new consultation binds to the new revision, so the two are distinguishable.
const second = lib.saveConsultation({ profileId, summary: 'Follow-up after rectification' });
assert.equal(second.revision, 2);

// Editing the text must not move the association.
lib.updateConsultationNotes(first.consultationId, { notes: 'Expanded notes after review.' });
const edited = lib.getConsultation(first.consultationId);
assert.equal(edited.notes, 'Expanded notes after review.');
assert.equal(edited.revision, 1, 'editing notes does not re-point the consultation');
assert.equal(edited.snapshotId, snapshot.snapshotId);
assert.notEqual(edited.updatedAt, undefined);

assert.equal(lib.listConsultations(profileId).length, 2);
assert.throws(() => lib.updateConsultationNotes('nope', {}), /unknown consultation/);

// ---------------------------------------------------------- event journal --

lib.addJournalEvent({ profileId, eventDate: '2018-06-01', category: 'career', description: 'Started new job' });
lib.addJournalEvent({ profileId, eventDate: '2021-02-14', category: 'marriage', description: 'Married' });
const events = lib.listJournalEvents(profileId);
assert.equal(events.length, 2);
assert.equal(events[0].eventDate, '2021-02-14', 'journal is newest first');
assert.equal(events[0].category, 'marriage');

assert.throws(() => lib.addJournalEvent({ profileId, description: 'no date' }), /eventDate is required/);
assert.throws(() => lib.addJournalEvent({ profileId, eventDate: '2020-01-01' }), /description is required/);
assert.throws(() => lib.addJournalEvent({ profileId: 'nobody', eventDate: '2020-01-01', description: 'x' }), /unknown profile/);

assert.equal(lib.deleteJournalEvent(events[0].eventId), true);
assert.equal(lib.listJournalEvents(profileId).length, 1);

// -------------------------------------------------------- draft recovery --

const draftKey = `consultation:${profileId}`;
lib.saveDraft(draftKey, { notes: 'half-written thought', summary: '' }, profileId);
lib.close();

// The crash: process ends without the draft ever being submitted.
lib = openLibrary(dbPath);
const recovered = lib.getDraft(draftKey);
assert.ok(recovered, 'an unsent draft survives a restart');
assert.equal(recovered.payload.notes, 'half-written thought');
assert.equal(recovered.profileId, profileId);

// Saving again replaces rather than accumulating.
lib.saveDraft(draftKey, { notes: 'second thought' }, profileId);
assert.equal(lib.getDraft(draftKey).payload.notes, 'second thought');

assert.equal(lib.discardDraft(draftKey), true);
assert.equal(lib.getDraft(draftKey), null, 'a submitted draft is cleared');
assert.equal(lib.discardDraft(draftKey), false);
assert.throws(() => lib.saveDraft('', {}), /draftKey is required/);

// ------------------------------------------- consultations survive backup --

const archivePath = path.join(tmp, 'archive.json');
const made = createArchive(dbPath, archivePath);
assert.equal(made.consultations, 2, 'consultations are included in a backup');
assert.equal(made.journalEvents, 1, 'journal entries are included in a backup');
lib.close();

const restorePath = path.join(tmp, 'restored', 'library.db');
const restored = restoreArchive(archivePath, restorePath);
assert.equal(restored.consultations, 2);

lib = openLibrary(restorePath);
const afterRestore = lib.getConsultation(first.consultationId);
assert.equal(afterRestore.notes, 'Expanded notes after review.', 'notes survive backup and restore');
assert.equal(afterRestore.revision, 1, 'the revision binding survives a restore');
assert.equal(afterRestore.snapshotId, snapshot.snapshotId);
assert.equal(afterRestore.evidence.length, 2, 'evidence links survive a restore');
assert.equal(lib.listJournalEvents(profileId).length, 1);
lib.close();

fs.rmSync(tmp, { recursive: true, force: true });

console.log(JSON.stringify({ pass: true, schemaVersion: SCHEMA_VERSION }, null, 2));
