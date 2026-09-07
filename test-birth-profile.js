const assert = require('node:assert/strict');
const { createBirthProfile, deriveChartId } = require('./src/contracts/birthProfile');

const baseBirth = {
  year: 1990, month: 5, day: 15, hour: 7, minute: 30,
  ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 11.34, longitude: 77.72, placeName: 'Erode',
};

// Valid profile carries name, gender, frozen chart context and a chartId.
const profile = createBirthProfile({ ...baseBirth, name: '  Kumar  ', gender: 'male' });
assert.equal(profile.name, 'Kumar');
assert.equal(profile.gender, 'male');
assert.equal(profile.chartContext.input.year, 1990);
assert.equal(typeof profile.chartId, 'string');
assert.equal(profile.chartId.length, 16);
profile.name = 'Changed';
assert.equal(profile.name, 'Kumar', 'frozen profile must reject mutation');

// Missing/blank name is rejected.
assert.throws(() => createBirthProfile({ ...baseBirth }), TypeError);
assert.throws(() => createBirthProfile({ ...baseBirth, name: '   ' }), TypeError);

// Same astronomical input -> same chartId, regardless of name/gender.
const profileA = createBirthProfile({ ...baseBirth, name: 'Twin A' });
const profileB = createBirthProfile({ ...baseBirth, name: 'Twin B', gender: 'female' });
assert.equal(profileA.chartId, profileB.chartId);

// Different birth minute -> different chartId.
const profileC = createBirthProfile({ ...baseBirth, name: 'Twin C', minute: 31 });
assert.notEqual(profileA.chartId, profileC.chartId);

// deriveChartId is exposed directly and agrees with the profile's own id.
assert.equal(deriveChartId(profileA.chartContext), profileA.chartId);

console.log(JSON.stringify({ pass: true, chartId: profileA.chartId }, null, 2));
