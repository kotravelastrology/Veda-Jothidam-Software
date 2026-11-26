/** Events saved against a person (PL9's Events list): saved, listed in time order, edited, deleted, bounded, and kept through backup and restore. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { openLibrary } = require('./src/library/chartRepository');
const { createArchive, restoreArchive } = require('./src/library/archive');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vjev-'));
const dbPath = path.join(tmp, 'library.db');
const chennai = { year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 13.0827, longitude: 80.2707, placeName: 'Chennai' };
const settings = { ayanamsha: 'Lahiri', houseSystem: 'Porphyrius', nodeType: 'mean', calendarMode: 'tirukanita' };

let lib = openLibrary(dbPath);
const { profileId } = lib.saveProfile({ name: 'Audit A', input: chennai, settings });
const e = { profileId, latitude: 12.9833, longitude: 77.5833, utcOffsetMinutes: 330, placeName: 'Bengaluru' };
const later = lib.saveEvent({ ...e, name: 'Today', year: 2026, month: 9, day: 18, hour: 7, minute: 59, second: 35 });
lib.saveEvent({ ...e, name: 'Job', year: 2012, month: 6, day: 1, hour: 10, minute: 0, description: 'joined' });

let list = lib.listSavedEvents(profileId);
assert.deepStrictEqual(list.map((x) => x.name), ['Job', 'Today'], 'oldest moment first');
assert.deepStrictEqual([list[1].second, list[1].placeName, list[1].utcOffsetMinutes], [35, 'Bengaluru', 330]);
assert.strictEqual(list[0].description, 'joined');

assert.ok(lib.updateSavedEvent(later.eventId, { description: 'event page test' }));
assert.strictEqual(lib.listSavedEvents(profileId)[1].description, 'event page test');
assert.strictEqual(lib.listSavedEvents(profileId)[1].name, 'Today', 'an edit that gives no name keeps it');
assert.strictEqual(lib.updateSavedEvent('nope', { name: 'x' }), false);

assert.throws(() => lib.saveEvent({ ...e, profileId: 'nobody', name: 'x', year: 2000, month: 1, day: 1, hour: 0, minute: 0 }), /unknown profile/);
assert.throws(() => lib.saveEvent({ ...e, name: 'x', year: 2000, month: 13, day: 1, hour: 0, minute: 0 }), /out of range/);
assert.throws(() => lib.saveEvent({ ...e, name: '', year: 2000, month: 1, day: 1, hour: 0, minute: 0 }), /name is required/);
assert.throws(() => lib.saveEvent({ ...e, name: 'x', year: NaN, month: 1, day: 1, hour: 0, minute: 0 }), /year must be a number/);

// kept through a backup and a restore
const archivePath = path.join(tmp, 'archive.json');
assert.strictEqual(createArchive(dbPath, archivePath).savedEvents, 2);
lib.close();
const restorePath = path.join(tmp, 'restored', 'library.db');
assert.strictEqual(restoreArchive(archivePath, restorePath).savedEvents, 2);
lib = openLibrary(restorePath);
assert.deepStrictEqual(lib.listSavedEvents(profileId).map((x) => x.name), ['Job', 'Today']);

// delete, and the limit of fifty
assert.ok(lib.deleteSavedEvent(lib.listSavedEvents(profileId)[0].eventId));
assert.strictEqual(lib.listSavedEvents(profileId).length, 1);
for (let i = 0; i < 49; i += 1) lib.saveEvent({ ...e, name: `n${i}`, year: 2000, month: 1, day: 1, hour: 0, minute: i % 60 });
assert.throws(() => lib.saveEvent({ ...e, name: 'one more', year: 2001, month: 1, day: 1, hour: 0, minute: 0 }), /at most 50/);
lib.close();
fs.rmSync(tmp, { recursive: true, force: true });
console.log('test-saved-events ok');
