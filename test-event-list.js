const assert = require('assert');
const { slotRange, eventListRow, SIGN_SHORT, MAX_EVENTS } = require('./src/report/eventList');
const { createChartContext } = require('./src/contracts/chartContext');
const { calculateParashariChart } = require('./src/chart/parashariChart');
const { eventChart } = require('./src/report/eventChart');

// --- the slots: the first ten, the next ten, or the whole list
assert.strictEqual(MAX_EVENTS, 20);
assert.deepStrictEqual(slotRange('1-10', 25), { from: 0, to: 10 });
assert.deepStrictEqual(slotRange('11-20', 25), { from: 10, to: 20 });
assert.deepStrictEqual(slotRange('1-10', 4), { from: 0, to: 4 }, 'fewer than ten events');
assert.deepStrictEqual(slotRange('11-20', 12), { from: 10, to: 12 });
assert.deepStrictEqual(slotRange('11-20', 7), { from: 7, to: 7 }, 'nothing in the second ten yet');
assert.deepStrictEqual(slotRange(null, 7), { from: 0, to: 7 });
assert.deepStrictEqual(slotRange('bogus', 30), { from: 0, to: 20 }, 'never more than twenty');
assert.strictEqual(SIGN_SHORT.length, 12);

// --- a row of the list, read from the event chart of the sample (5 October 1990, 04:30 IST, Chennai) at 31 October 2026, noon
const ctx = createChartContext({ year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 13.0827, longitude: 80.2707, calendarMode: 'tirukanita' });
const natal = calculateParashariChart(ctx);
const ev = eventChart({ natal: { ctx, chart: natal }, event: { year: 2026, month: 10, day: 31, hour: 12, minute: 0, second: 0, latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330 } });
const row = eventListRow(ev);
// Vimshottari to five levels: Sun, Rahu, Jupiter, Venus (the first four are the running Sun-Rahu-Jupiter-Venus of the dasha browser), then the fifth
assert.strictEqual(row.vimshottari.length, 5);
assert.deepStrictEqual(row.vimshottari.slice(0, 4), ['Su', 'Ra', 'Ju', 'Ve']);
assert.deepStrictEqual(row.vimshottari, ev.dashas.vimshottari.map((d) => ({ Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke' })[d.lord]));
// Yogini and Ashtottari to five levels; the first level is the main period the engine reports
assert.strictEqual(row.yogini.length, 5);
assert.strictEqual(row.ashtottari.length, 5);
assert.strictEqual(row.yogini[0], 'Sa', 'Yogini: Ulka, lord Saturn, as the engine reports');
assert.strictEqual(row.ashtottari[0], 'Mo', 'Ashtottari: the Moon');
// the sign-based systems give one sign each, as the sign names
assert.deepStrictEqual(row.chara, [SIGN_SHORT[ev.dashas.chara.sign]]);
assert.deepStrictEqual(row.sthira, [SIGN_SHORT[ev.dashas.sthira.sign]]);
assert.strictEqual(row.narayana.length, 5);
assert.strictEqual(row.jaiminiSthira.length, 5);
assert.strictEqual(row.kalachakra[0], SIGN_SHORT[ev.dashas.kalachakra.maha.rasiIndex]);
assert.ok(row.kalachakra.length === 2, 'Kalachakra: the maha dasha and the bhukti, as far as the book goes');
assert.strictEqual(typeof row.shatabdikaApplies, 'boolean');
// a system the event has none of gives an empty list, not a crash
const bare = eventListRow({ dashas: { vimshottari: [] } });
assert.deepStrictEqual(bare, { vimshottari: [], yogini: [], ashtottari: [], chara: [], sthira: [], shatabdika: [], shatabdikaApplies: false, kalachakra: [], narayana: [], jaiminiSthira: [] });

console.log('test-event-list: all assertions passed');
