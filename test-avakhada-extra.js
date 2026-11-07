/** The Avakhada chakra's last six lines against four Parashara's Light printouts: Arjun, meera, the aniruddha sample and Kotravel (HP1). */
const assert = require('assert');
const { avakhadaExtra } = require('./src/report/avakhadaExtra');
const row = (e) => [e.varga, e.yunja, e.hansak, e.naamakshar, e.payaRashi, e.payaNakshatra];
assert.deepStrictEqual(row(avakhadaExtra({ star: 1, pada: 3, moonSign: 0, lagnaSign: 5 })), ['Mriga', 'Poorva', 'Agni', 'Lay', 'Iron', 'Gold']); // Arjun, Bharani 3
assert.deepStrictEqual(row(avakhadaExtra({ star: 0, pada: 1, moonSign: 0, lagnaSign: 5 })), ['Simha', 'Poorva', 'Agni', 'Chu', 'Iron', 'Gold']); // meera, Ashwini 1
assert.deepStrictEqual(row(avakhadaExtra({ star: 26, pada: 3, moonSign: 11, lagnaSign: 4 })), ['Simha', 'Poorva', 'Jala', 'Cha', 'Iron', 'Gold']); // sample, Revati 3
assert.deepStrictEqual(row(avakhadaExtra({ star: 6, pada: 4, moonSign: 3, lagnaSign: 7 })), ['Mesha', 'Madhya', 'Jala', 'Hee', 'Silver', 'Silver']); // Kotravel, Punarvasu 4
console.log('test-avakhada-extra: all assertions passed');
