const assert = require('assert');

function fakeStorage() {
  const data = new Map();
  return { getItem: (k) => (data.has(k) ? data.get(k) : null), setItem: (k, v) => { data.set(k, String(v)); }, removeItem: (k) => { data.delete(k); } };
}
globalThis.localStorage = fakeStorage();
const P = require('./src/ui/screenPrefsStore');
const TT = require('./src/ui/timeToolStore');

// --- the defaults, as the recording's dialogs open: toolbar shown, medium icons, hints on, name and birth data on
const d = P.readPrefs();
assert.deepStrictEqual(d, { ...P.DEFAULTS, planetColors: {} });
assert.strictEqual(d.showToolbar, true);
assert.strictEqual(d.iconSize, 'medium');
assert.strictEqual(d.worksheetLayout, 'standard');
assert.strictEqual(d.homeRoute, '/worksheet');

// --- a change is merged over what is stored, and persists
const a = P.writePrefs({ iconSize: 'large', showToolbar: false });
assert.strictEqual(a.iconSize, 'large');
assert.strictEqual(a.showToolbar, false);
assert.strictEqual(a.nameAndBirthdata, true, 'the rest is untouched');
assert.strictEqual(P.readPrefs().iconSize, 'large');
const b = P.writePrefs({ worksheetLayout: 'single' });
assert.strictEqual(b.iconSize, 'large', 'an earlier change stays');
assert.strictEqual(b.worksheetLayout, 'single');

// --- anything of the wrong kind falls back to the default, nothing throws
assert.strictEqual(P.sanitize({ iconSize: 'huge' }).iconSize, 'medium');
assert.strictEqual(P.sanitize({ showToolbar: 'yes' }).showToolbar, true);
assert.strictEqual(P.sanitize({ worksheetLayout: 3 }).worksheetLayout, 'standard');
assert.strictEqual(P.sanitize({ worksheetTitle: 'x'.repeat(200) }).worksheetTitle.length, 60, 'a long title is cut');
assert.strictEqual(P.sanitize({ homeRoute: 'https://evil.example/' }).homeRoute, '/worksheet', 'only a path of this site');
assert.strictEqual(P.sanitize({ homeRoute: '/lordships' }).homeRoute, '/lordships');
assert.strictEqual(P.sanitize({ homeRoute: '/events?range=1-10' }).homeRoute, '/events?range=1-10');
assert.deepStrictEqual(P.sanitize(null), { ...P.DEFAULTS, planetColors: {} });
assert.deepStrictEqual(P.sanitize('junk'), { ...P.DEFAULTS, planetColors: {} });
assert.deepStrictEqual(P.sanitize({ unknownKey: 1 }), { ...P.DEFAULTS, planetColors: {} }, 'unknown keys are dropped');

// --- planet colours: known planets, six-digit hex only, lower-cased
const c = P.sanitize({ planetColors: { Su: '#FF0000', Mo: 'red', Xx: '#00ff00', Ma: '#12345', Ju: '#00ff00' } });
assert.deepStrictEqual(c.planetColors, { Su: '#ff0000', Ju: '#00ff00' });
assert.strictEqual(P.planetColor(c, 'Su', '#b45309'), '#ff0000');
assert.strictEqual(P.planetColor(c, 'Mo', '#374151'), '#374151', 'the default where none is set');

// --- the degrees beside the planets, and the change event
assert.strictEqual(P.readPrefs().chartDegrees, true);
assert.strictEqual(P.sanitize({ chartDegrees: 'no' }).chartDegrees, true);
const heard = [];
globalThis.dispatchEvent = (e) => { heard.push(e.type); };
globalThis.CustomEvent = class { constructor(type) { this.type = type; } };
assert.strictEqual(P.writePrefs({ chartDegrees: false }).chartDegrees, false);
assert.deepStrictEqual(heard, [P.CHANGE_EVENT], 'a change is announced');
delete globalThis.dispatchEvent;
delete globalThis.CustomEvent;

// --- damaged or unavailable storage
globalThis.localStorage = { getItem: () => '{broken', setItem: () => { throw new Error('quota'); } };
assert.deepStrictEqual(P.readPrefs(), { ...P.DEFAULTS, planetColors: {} });
assert.strictEqual(P.writePrefs({ iconSize: 'small' }).iconSize, 'small', 'applied even when it cannot be saved');

// --- the time tool: "now" until moved, then one moment for every page
assert.strictEqual(TT.getAt(), null);
assert.strictEqual(TT.currentMs(5000), 5000, 'now when not moved');
let calls = 0;
const off = TT.subscribe(() => { calls += 1; });
const noon = Date.UTC(2026, 9, 31, 6, 30);
TT.setAt(noon);
assert.strictEqual(TT.getAt(), noon);
assert.strictEqual(TT.currentMs(5000), noon);
assert.strictEqual(calls, 1);
TT.setAt(noon);
assert.strictEqual(calls, 1, 'no change, no call');
TT.setAt(Number.NaN);
assert.strictEqual(TT.getAt(), null, 'not a moment: back to now');
assert.strictEqual(calls, 2);
off();
TT.setAt(1);
assert.strictEqual(calls, 2, 'unsubscribed');
TT.setAt(null);

// --- local date and time of a moment, and back
const ms = Date.UTC(2026, 9, 31, 6, 30, 15); // 12:00:15 IST on 31 Oct 2026
assert.strictEqual(TT.localDateText(ms, 330), '2026-10-31');
assert.strictEqual(TT.localTimeText(ms, 330), '12:00:15');
assert.strictEqual(TT.localDateText(Date.UTC(2026, 9, 31, 20, 0), 330), '2026-11-01', 'the date in that zone, not UT');
assert.strictEqual(TT.dateTextToMs('2026-10-31', 330, '12:00:15'), ms);
assert.strictEqual(TT.dateTextToMs('2026-10-31', 330), Date.UTC(2026, 9, 31, 6, 30), 'noon when no time is given');
assert.strictEqual(TT.dateTextToMs('garbage', 330), null);

console.log('test-screen-prefs: all assertions passed');
