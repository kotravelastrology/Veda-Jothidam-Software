const assert = require('assert');
const { julianDay } = require('@swisseph/node');
const L = require('./src/report/kpLuckyTime');
const { calculateKpSystem } = require('./src/report/kpSystem');
const { buildVimshottariDasha } = require('./src/dasha/vimshottariDasha');
const { signifiersByHouse } = require('./src/report/kpHoraryTopics');

// the matters of Reader V printed pp.219-234 with the houses as printed
const h = (id) => [L.BY_ID[id].take, L.BY_ID[id].avoid, L.BY_ID[id].page];
assert.deepStrictEqual(h('TREASURE'), [[2, 4, 6, 11], [8, 12], 219]);
assert.deepStrictEqual(h('SICK_CHILD'), [[1, 5, 11], [], 220]);
assert.deepStrictEqual(h('ACTRESS'), [[5, 6, 10, 11], [], 220]);
assert.deepStrictEqual(h('TENDER'), [[3, 6, 9, 11], [], 221]);
assert.deepStrictEqual(h('OVERDRAFT'), [[3, 6, 9, 11], [], 223]);
assert.deepStrictEqual(h('COURT_FILING'), [[6, 11], [8, 12], 227]);
assert.deepStrictEqual(h('MUSIC'), [[2, 3, 5, 10, 11], [], 228]);
assert.deepStrictEqual(h('ENTER_HOUSE'), [[2, 4, 11], [5, 8, 12], 232]);
assert.deepStrictEqual(h('CONCEIVE'), [[2, 5, 11], [1, 4, 10], 234]);
assert.ok(L.TOPICS.length >= 20 && new Set(L.TOPICS.map((t) => t.id)).size === L.TOPICS.length);
assert.ok(L.TOPICS.every((t) => t.take.length && t.page >= 219 && t.page <= 234 && t.parts.length));

// the audit chart (5 Oct 1990 04:30 Chennai)
const birth = { year: 1990, month: 10, day: 5, hour: 4, minute: 30, utcOffsetMinutes: 330, latitude: 13.0827, longitude: 80.2707, ianaTimeZone: 'Asia/Kolkata' };
const kp = calculateKpSystem(birth);
const sig = signifiersByHouse(kp);
const houses = (name) => Object.keys(sig).map(Number).filter((x) => sig[x].all.includes(name));
const court = L.eligiblePlanets(kp, L.BY_ID.COURT_FILING);
for (const p of kp.positions.map((x) => x.name)) {
  const e = court.find((x) => x.name === p);
  const should = houses(p).some((x) => [6, 11].includes(x)) && !houses(p).some((x) => [8, 12].includes(x));
  assert.strictEqual(Boolean(e), should, p);
}
const moonLon = kp.positions.find((p) => p.name === 'Moon').longitude;
const vim = buildVimshottariDasha(julianDay(1990, 10, 5, 4.5 - 5.5), moonLon, 330, { depth: 3 });
const from = julianDay(2027, 3, 1, 0);
const r = L.luckyTime(kp, vim, { topicId: 'COURT_FILING', fromJd: from, days: 365, ascHours: 24, latitude: 13.0827, longitude: 80.2707 });
const names = new Set(court.map((x) => x.name));
assert.strictEqual(r.periods, null, 'the book asks for the Moon and the ascendant only');
const ag = L.luckyTime(kp, vim, { topicId: 'AGREEMENT', fromJd: julianDay(1990, 10, 5, 0), days: 365 * 20, ascHours: 24, latitude: 13.0827, longitude: 80.2707 });
const agNames = new Set(ag.eligible.map((x) => x.name));
assert.strictEqual(ag.periods[0].lords.join('-'), 'Mercury-Mercury-Mercury');
assert.ok(ag.periods.length >= 17);
for (const p of ag.periods) { assert.ok(p.lords.every((l) => agNames.has(l))); assert.ok(p.startJd >= julianDay(1990, 10, 5, 0) && p.endJd <= julianDay(1990, 10, 5, 0) + 365 * 20 && p.endJd > p.startJd); }
for (const m of r.moon) assert.ok(names.has(m.starLord) && names.has(m.subLord));
for (const a of r.ascendant) { assert.ok(names.has(a.signLord) && names.has(a.starLord) && names.has(a.subLord)); assert.ok(a.endJd > a.startJd && a.startJd >= from && a.startJd <= from + 1); }
// MUSIC asks for the dasha only
assert.strictEqual(L.luckyTime(kp, vim, { topicId: 'MUSIC', fromJd: from, days: 30, latitude: 13.0827, longitude: 80.2707 }).moon, null);
assert.throws(() => L.luckyTime(kp, vim, { topicId: 'NOPE', fromJd: from }));
console.log('test-kp-lucky-time ok');
