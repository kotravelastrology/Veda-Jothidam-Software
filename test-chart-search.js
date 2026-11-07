const assert = require('assert');
const { filterSavedCharts } = require('./src/portal/chartSearch');

const charts = [
  { id: 'a', name: 'Aniruddha', description: 'client, Tamil Nadu', birthData: { name: 'Aniruddha', dateOfBirth: '1990-10-05', timeOfBirth: '04:30', place: 'Chennai, Tamil Nadu, India' } },
  { id: 'b', name: '', birthData: { name: 'Kumar', dateOfBirth: '1985-03-12', timeOfBirth: '18:05', place: 'Madurai, India' } },
  { id: 'c', name: 'Latha', birthData: { name: 'Latha', dateOfBirth: '1990-07-21', timeOfBirth: '09:15', place: 'Coimbatore' } },
];
const ids = (list) => list.map((c) => c.id);

// an empty or blank query returns the list unchanged
assert.strictEqual(filterSavedCharts(charts, ''), charts);
assert.strictEqual(filterSavedCharts(charts, '   '), charts);
assert.strictEqual(filterSavedCharts(charts, undefined), charts);

// the name, the place, the date and the time are searched; case and spacing do not matter
assert.deepStrictEqual(ids(filterSavedCharts(charts, 'ANIRUDDHA')), ['a']);
assert.deepStrictEqual(ids(filterSavedCharts(charts, '  madurai ')), ['b']);
assert.deepStrictEqual(ids(filterSavedCharts(charts, '1990-07')), ['c']);
assert.deepStrictEqual(ids(filterSavedCharts(charts, '18:05')), ['b']);

// every word must match: a Chennai chart from 1990 is found, one from another year is not
assert.deepStrictEqual(ids(filterSavedCharts(charts, 'chennai 1990')), ['a']);
assert.deepStrictEqual(ids(filterSavedCharts(charts, 'chennai 1985')), []);

// the description is searched too, and a chart with no name still matches on its birth data
assert.deepStrictEqual(ids(filterSavedCharts(charts, 'client')), ['a']);
assert.deepStrictEqual(ids(filterSavedCharts(charts, 'kumar')), ['b']);

// nothing matches: an empty list, not an error
assert.deepStrictEqual(filterSavedCharts(charts, 'zzz'), []);

// the input list is not changed
assert.strictEqual(charts.length, 3);

console.log('test-chart-search ok');
