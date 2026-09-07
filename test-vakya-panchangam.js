const assert = require('node:assert/strict');
const { createChartContext } = require('./src/contracts/chartContext');
const { calculateVakyaPanchangam } = require('./src/panchangam/vakyaPanchangam');

const baseInput = {
  year: 2026, month: 9, day: 5, hour: 12,
  ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 11.34, longitude: 77.72, placeName: 'Erode',
};

const vakyaContext = createChartContext({ ...baseInput, calendarMode: 'vakya' });
const result = calculateVakyaPanchangam(vakyaContext);
assert.equal(result.status, 'SOURCE_REQUIRED');
assert.ok(result.message.includes('SOURCE REQUIRED'));
assert.ok(result.reason.includes('Vakyakarana'));

const tirukanitaContext = createChartContext({ ...baseInput, calendarMode: 'tirukanita' });
assert.throws(() => calculateVakyaPanchangam(tirukanitaContext), RangeError);

console.log(JSON.stringify({ pass: true, checks: 'vakyaPanchangam correctly refuses with SOURCE_REQUIRED', result }, null, 2));
