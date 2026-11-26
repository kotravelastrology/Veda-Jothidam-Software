/** The Avakhada chakra's last six lines against four Parashara's Light printouts: Arjun, meera, the aniruddha sample and Kotravel (HP1). */
const assert = require('assert');
const { avakhadaExtra } = require('./src/report/avakhadaExtra');
const row = (e) => [e.varga, e.yunja, e.hansak, e.naamakshar, e.payaRashi, e.payaNakshatra];
assert.deepStrictEqual(row(avakhadaExtra({ star: 1, pada: 3, moonSign: 0, lagnaSign: 5 })), ['Mriga', 'Poorva', 'Agni', 'Lay', 'Iron', 'Gold']); // Arjun, Bharani 3
assert.deepStrictEqual(row(avakhadaExtra({ star: 0, pada: 1, moonSign: 0, lagnaSign: 5 })), ['Simha', 'Poorva', 'Agni', 'Chu', 'Iron', 'Gold']); // meera, Ashwini 1
assert.deepStrictEqual(row(avakhadaExtra({ star: 26, pada: 3, moonSign: 11, lagnaSign: 4 })), ['Simha', 'Poorva', 'Jala', 'Cha', 'Iron', 'Gold']); // sample, Revati 3
assert.deepStrictEqual(row(avakhadaExtra({ star: 6, pada: 4, moonSign: 3, lagnaSign: 7 })), ['Mesha', 'Madhya', 'Jala', 'Hee', 'Silver', 'Silver']); // Kotravel, Punarvasu 4
// the result the book gives each Paya of the birth nakshatra (Adawal, ch.11, printed p.263): Silver Best, Copper Good, Gold Medium, Iron Bad; the four cover the 27 nakshatras (12 + 9 + 3 + 3)
const { PAYA_NAKSHATRA_RESULT, PAYA_SOURCE } = require('./src/report/avakhadaExtra');
assert.deepStrictEqual(PAYA_NAKSHATRA_RESULT, { Silver: 'Best', Copper: 'Good', Gold: 'Medium', Iron: 'Bad' });
const counts = {};
for (let star = 0; star < 27; star += 1) { const p = avakhadaExtra({ star, pada: 1, moonSign: 0, lagnaSign: 0 }).payaNakshatra; counts[p] = (counts[p] || 0) + 1; assert.ok(PAYA_NAKSHATRA_RESULT[p], p); }
assert.deepStrictEqual(counts, { Iron: 3, Silver: 12, Gold: 3, Copper: 9 });
assert.ok(/Chapter 11/.test(PAYA_SOURCE.pageLocus) && /printed p\.263/.test(PAYA_SOURCE.pageLocus) && PAYA_SOURCE.author === 'Shanker Adawal');
console.log('test-avakhada-extra: all assertions passed');
