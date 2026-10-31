const assert = require('assert');

// A fake localStorage, set before the module is used (the module looks it up when a function runs).
function fakeStorage() {
  const data = new Map();
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => { data.set(k, String(v)); },
    removeItem: (k) => { data.delete(k); },
    _data: data,
  };
}
globalThis.localStorage = fakeStorage();
const O = require('./src/ui/openChartStore');
const reset = () => { globalThis.localStorage = fakeStorage(); };

const aniruddha = { name: 'Aniruddha', gender: 'male', year: 1990, month: 10, day: 5, hour: 4, minute: 30, placeName: 'Chennai', latitude: 13.0833, longitude: 80.2833, utcOffsetMinutes: 330 };
const priya = { name: 'Priya', gender: 'female', year: 2009, month: 6, day: 21, hour: 16, minute: 30, placeName: 'Erode', latitude: 11.341, longitude: 77.7172, utcOffsetMinutes: 330 };
const profile = { profileId: 'p-1', revision: 2, name: 'Meena', birthDate: '1985-01-02', placeName: 'Madurai' };

// --- nothing is open
assert.strictEqual(O.readStash(), null);
assert.strictEqual(O.resolveOpenParty(null), null);

// --- the workspace's active profile is the open chart when there is no stash
const fromActive = O.resolveOpenParty(profile);
assert.strictEqual(fromActive.kind, 'profile');
assert.deepStrictEqual([fromActive.profileId, fromActive.revision, fromActive.label, fromActive.birthDate, fromActive.placeName], ['p-1', 2, 'Meena', '1985-01-02', 'Madurai']);

// --- a chart entered by hand: what is stored comes back as the same birth input
O.writeStash(aniruddha);
const form = O.resolveOpenParty(null);
assert.strictEqual(form.kind, 'form');
assert.strictEqual(form.label, 'Aniruddha');
assert.deepStrictEqual(form.input, { ...aniruddha, ianaTimeZone: 'Asia/Kolkata' }, 'the open chart round-trips to the same birth input');
assert.strictEqual(O.readStash().birthData.dateOfBirth, '1990-10-05');
assert.strictEqual(O.readStash().birthData.timeOfBirth, '04:30');
assert.strictEqual(O.resolveOpenParty(profile).kind, 'form', 'the stash wins over an older active profile');

// --- a saved profile chosen: it is the open chart, and the earlier person's details are gone
O.writeStashProfile(profile);
const p = O.resolveOpenParty(null);
assert.strictEqual(p.kind, 'profile');
assert.strictEqual(p.profileId, 'p-1');
assert.strictEqual(O.readStash().birthData, undefined, 'another person\'s details are not kept');
// the page that computes the profile adds its birth details and keeps the link
O.writeStash({ ...priya, name: 'Meena' }, profile);
assert.strictEqual(O.resolveOpenParty(null).kind, 'profile', 'a profile stays open while it is the person on screen');
assert.strictEqual(O.readStash().birthData.name, 'Meena');
assert.strictEqual(O.readStash().profile.profileId, 'p-1');

// --- the next chart chosen replaces the profile (a hand-entered chart is not that profile)
O.writeStash(aniruddha);
assert.strictEqual(O.readStash().profile, undefined);
assert.strictEqual(O.resolveOpenParty(profile).label, 'Aniruddha', 'even with the old active profile still around');

// --- notes and events: kept for the same person, dropped for another
O.writeStash(aniruddha);
const stash = O.readStash();
globalThis.localStorage.setItem(O.STASH_KEY, JSON.stringify({ ...stash, notes: 'a note', events: [{ name: 'Marriage' }], libraryId: 'lib-1' }));
O.writeStash(aniruddha);
assert.strictEqual(O.readStash().notes, 'a note', 'the same person keeps the notes');
assert.deepStrictEqual(O.readStash().events, [{ name: 'Marriage' }]);
assert.strictEqual(O.readStash().libraryId, 'lib-1');
O.writeStash(priya);
assert.strictEqual(O.readStash().notes, undefined, 'another person does not inherit them');
assert.strictEqual(O.readStash().events, undefined);
assert.strictEqual(O.readStash().birthData.name, 'Priya');
assert.strictEqual(O.resolveOpenParty(null).input.gender, 'female', 'the gender is kept');

// --- the same profile chosen again keeps what was stored for it; a different one does not
O.writeStashProfile(profile);
globalThis.localStorage.setItem(O.STASH_KEY, JSON.stringify({ ...O.readStash(), notes: 'profile note' }));
O.writeStashProfile(profile);
assert.strictEqual(O.readStash().notes, 'profile note');
O.writeStashProfile({ ...profile, profileId: 'p-2', name: 'Other' });
assert.strictEqual(O.readStash().notes, undefined);
assert.strictEqual(O.resolveOpenParty(null).profileId, 'p-2');

// --- File > Close forgets the chart
O.clearStash();
assert.strictEqual(O.readStash(), null);
assert.strictEqual(O.resolveOpenParty(null), null);

// --- a chart saved in the browser's library
const saved = { name: 'Saved one', dateOfBirth: '2001-03-04', timeOfBirth: '05:06', place: 'Salem', latitude: 11.65, longitude: 78.16, utcOffset: 330 };
assert.deepStrictEqual(O.inputFromSaved(saved), { name: 'Saved one', gender: 'male', year: 2001, month: 3, day: 4, hour: 5, minute: 6, placeName: 'Salem', latitude: 11.65, longitude: 78.16, utcOffsetMinutes: 330, ianaTimeZone: 'Asia/Kolkata' });
assert.strictEqual(O.inputFromSaved({ ...saved, gender: 'female' }).gender, 'female');
assert.strictEqual(O.inputFromSaved(saved, 'other').gender, 'other');
assert.strictEqual(O.inputFromSaved({ ...saved, timeOfBirth: '7' }).minute, 0, 'a time without minutes');

// --- damaged or unavailable storage never throws
globalThis.localStorage = { getItem: () => '{not json', setItem: () => { throw new Error('quota'); }, removeItem: () => { throw new Error('blocked'); } };
assert.strictEqual(O.readStash(), null);
assert.strictEqual(O.resolveOpenParty(null), null);
O.writeStash(aniruddha);
O.writeStashProfile(profile);
O.clearStash();
assert.strictEqual(O.resolveOpenParty(profile).kind, 'profile', 'with nothing readable, the active profile still opens');

// --- the line under the toolbar, as PL9 writes it
reset();
assert.strictEqual(O.describeOpenChart(null), null, 'nothing open');
O.writeStash(aniruddha);
assert.deepStrictEqual(O.describeOpenChart(null), { name: 'Aniruddha', line: '5 Oct 1990 04:30:00 Chennai' });
O.writeStashProfile(profile);
assert.deepStrictEqual(O.describeOpenChart(null), { name: 'Meena', line: '2 Jan 1985 Madurai' }, 'a profile before its time is known');
O.clearStash();
assert.deepStrictEqual(O.describeOpenChart(profile), { name: 'Meena', line: '2 Jan 1985 Madurai' }, 'the active profile when there is no stash');

// --- a part of the screen that shows the open chart is told when it changes
const seen = [];
globalThis.dispatchEvent = (e) => { seen.push(e.type); };
globalThis.CustomEvent = class { constructor(type) { this.type = type; } };
O.writeStash(aniruddha);
O.writeStashProfile(profile);
O.clearStash();
assert.deepStrictEqual(seen, [O.CHANGE_EVENT, O.CHANGE_EVENT, O.CHANGE_EVENT]);
assert.strictEqual(O.CHANGE_EVENT, 'kotravel:open-chart');
delete globalThis.dispatchEvent;
delete globalThis.CustomEvent;

console.log('test-open-chart: all assertions passed');
