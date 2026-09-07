const assert = require('node:assert/strict');
const {
  createChartContext, attachSource, sourceRequired, UnsupportedInputError,
} = require('./src/contracts/chartContext');

const baseInput = {
  year: 1990, month: 5, day: 15, hour: 7, minute: 30,
  ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 11.34, longitude: 77.72, placeName: 'Erode',
  calendarMode: 'tirukanita',
};

const context = createChartContext(baseInput);
assert.equal(context.ayanamsha, 'Lahiri');
assert.equal(context.houseSystem, 'Porphyrius');
assert.equal(context.calendarMode, 'tirukanita');
assert.equal(context.dayBoundary, 'sunrise');
assert.equal(context.input.placeName, 'Erode');
context.input.latitude = 0;
assert.equal(context.input.latitude, 11.34, 'frozen input must reject mutation');

for (const field of ['year', 'latitude', 'longitude', 'utcOffsetMinutes', 'ianaTimeZone', 'calendarMode']) {
  assert.throws(
    () => createChartContext({ ...baseInput, [field]: undefined }),
    UnsupportedInputError,
    `missing ${field} should throw UnsupportedInputError`,
  );
}

assert.throws(() => createChartContext({ ...baseInput, latitude: 91 }), UnsupportedInputError);
assert.throws(() => createChartContext({ ...baseInput, longitude: -181 }), UnsupportedInputError);
assert.throws(() => createChartContext({ ...baseInput, ayanamsha: 'Raman' }), UnsupportedInputError);
assert.throws(() => createChartContext({ ...baseInput, houseSystem: 'Koch' }), UnsupportedInputError);
assert.equal(createChartContext({ ...baseInput, houseSystem: 'Placidus' }).houseSystem, 'Placidus');
assert.throws(() => createChartContext({ ...baseInput, calendarMode: 'gregorian-only' }), UnsupportedInputError);

const source = {
  title: 'Panchangam Calculations', author: 'Karanam Ramakumar',
  file: 'Panchangam Calculations.pdf', pageLocus: 'file page 10',
  tradition: 'Hindu Panchangam', convention: 'tirukanita',
};
const stamped = attachSource({ tithiIndex: 12 }, source);
assert.equal(stamped.tithiIndex, 12);
assert.equal(stamped.source.title, 'Panchangam Calculations');
assert.throws(() => attachSource({ tithiIndex: 12 }, { ...source, pageLocus: undefined }), UnsupportedInputError);

const refusal = sourceRequired('Muhurtham dagdha-tithi table not yet page-verified');
assert.equal(refusal.status, 'SOURCE_REQUIRED');
assert.ok(refusal.message.includes('SOURCE REQUIRED'));

console.log(JSON.stringify({ pass: true, checks: 'chartContext contract validated' }, null, 2));
