/**
 * The place atlas and the historical time zones (src/sources/places/location.ts and timezone.ts, from the owner's AstrologicLab
 * software, WBS-002 and WBS-003). The two files are TypeScript for the pages; this test compiles them in memory with the
 * project's own TypeScript and loads them as CommonJS.
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const loaded = {};
function load(name) {
  if (loaded[name]) return loaded[name];
  const file = path.join(__dirname, 'src', 'sources', 'places', `${name}.ts`);
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const mod = { exports: {} };
  new Function('module', 'exports', 'require', js)(mod, mod.exports, (spec) => (spec === './location' ? load('location') : require(spec)));
  loaded[name] = mod.exports;
  return mod.exports;
}
const L = load('location');
const Z = load('timezone');

// --- places: English, Tamil and old names, partial names, duplicates
assert.strictEqual(L.resolvePlace('Chennai').status, 'exact');
assert.deepStrictEqual([L.resolvePlace('Chennai').candidates[0].lat, L.resolvePlace('Chennai').candidates[0].lng], [13.0827, 80.2707]);
assert.strictEqual(L.resolvePlace('சென்னை').candidates[0].name, 'Chennai', 'a Tamil name finds the place');
assert.strictEqual(L.resolvePlace('Madras').candidates[0].name, 'Chennai', 'an old name finds the place');
assert.strictEqual(L.resolvePlace('Trichy').candidates[0].name, 'Tiruchirappalli');
assert.strictEqual(L.resolvePlace('Mad').status, 'candidates', 'a partial name only offers places, it never picks one');
assert.strictEqual(L.resolvePlace('London').status, 'ambiguous', 'London, UK and London, Ontario are both offered');
assert.strictEqual(L.resolvePlace('zzzz').status, 'not_found');
const erode = L.resolvePlace('Erode').candidates[0];
assert.deepStrictEqual([erode.lat, erode.lng], [11.341, 77.7172], 'the Erode reference never drifts');
for (const p of L.WORLD_PLACES) assert.ok(L.validateCoordinates(p.lat, p.lng), p.name);

// --- time zones: the offset in force at the birth, from the IANA database
assert.strictEqual(Z.resolveTimeZone(13.0827, 80.2707).zoneId, 'Asia/Kolkata');
const ok = (r) => { assert.strictEqual(r.status, 'ok', JSON.stringify(r)); return r; };
assert.strictEqual(ok(Z.resolveBirthInstant('1990-10-05', '04:30', 13.0827, 80.2707)).offsetMinutes, 330);
// India's war time: +6:30 from 1 Sep 1942 to 15 Oct 1945 (a birth then entered as +5:30 is an hour wrong)
const war = ok(Z.resolveBirthInstant('1943-06-10', '10:00', 13.0827, 80.2707));
assert.strictEqual(war.offsetMinutes, 390);
assert.strictEqual(war.provenance.adjustment, 'wartime');
assert.strictEqual(ok(Z.resolveBirthInstant('1946-06-10', '10:00', 13.0827, 80.2707)).offsetMinutes, 330);
// abroad: London's summer time, Colombo, Singapore
const london = L.resolvePlace('London', { country: 'UK' }).candidates[0];
assert.strictEqual(ok(Z.resolveBirthInstant('2000-07-01', '12:00', london.lat, london.lng)).offsetMinutes, 60);
assert.strictEqual(ok(Z.resolveBirthInstant('2000-01-01', '12:00', london.lat, london.lng)).offsetMinutes, 0);
// a coordinate outside the curated regions is marked approximate (whole-hour zone)
assert.strictEqual(Z.resolveTimeZone(-15, -150).method, 'approximate');

console.log(`test-places: ${L.WORLD_PLACES.length} places; all assertions passed`);
