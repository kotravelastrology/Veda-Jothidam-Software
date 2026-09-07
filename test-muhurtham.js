const assert = require('node:assert/strict');
const { createChartContext } = require('./src/contracts/chartContext');
const { calculateDailyMuhurtham } = require('./src/panchangam/muhurtham');

/**
 * Regression check against the worked example printed in the verified S1-B
 * source itself (Panchangam Calculations, Karanam Ramakumar, file pages
 * 24-27): Shillong (25°35'N 91°53'E), 21-6-2009, a Sunday. The book states
 * Rahu Kalam starts 16:37 and ends 18:20 (duration 1:43), computed from its
 * own sunrise/sunset (4:32/18:16, day length 13:44). This implementation
 * uses Swiss Ephemeris for sunrise/sunset rather than the book's stated
 * values, so a few minutes of difference is expected; the multiplier logic
 * is what this test actually pins down.
 */
const shillong = createChartContext({
  year: 2009, month: 6, day: 21, hour: 12,
  ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 25 + 35 / 60, longitude: 91 + 53 / 60, placeName: 'Shillong',
  calendarMode: 'tirukanita',
});
const shillongResult = calculateDailyMuhurtham(shillong);
assert.equal(shillongResult.vara, 'Ravivara', 'the book itself identifies 21-6-2009 as a Sunday');

function toMinutes(localDateTime) {
  const [, time] = localDateTime.split(' ');
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}
const bookRahuStart = 16 * 60 + 37;
const bookRahuEnd = 18 * 60 + 20;
const gotStart = toMinutes(shillongResult.rahuKalam.startLocal);
const gotEnd = toMinutes(shillongResult.rahuKalam.endLocal);
assert.ok(Math.abs(gotStart - bookRahuStart) <= 10, `Rahu Kalam start ${shillongResult.rahuKalam.startLocal} should be within ~10 min of the book's 16:37`);
assert.ok(Math.abs(gotEnd - bookRahuEnd) <= 10, `Rahu Kalam end ${shillongResult.rahuKalam.endLocal} should be within ~10 min of the book's 18:20`);

const erode = createChartContext({
  year: 2026, month: 9, day: 5, hour: 12,
  ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 11.34, longitude: 77.72, placeName: 'Erode',
  calendarMode: 'tirukanita',
});
const result = calculateDailyMuhurtham(erode);

for (const key of ['rahuKalam', 'gulikaKalam', 'yamagandam']) {
  assert.ok(toMinutes(result[key].startLocal) < toMinutes(result[key].endLocal), `${key} must not be zero/negative width`);
}
assert.ok(Array.isArray(result.durmuhurtham) && result.durmuhurtham.length >= 1);
assert.ok(result.amritKaal && result.amritKaal.startLocal);
assert.ok(Array.isArray(result.varjyam) && result.varjyam.length >= 1);
assert.equal(result.abhijitMuhurta.status, 'SOURCE_REQUIRED');

console.log(JSON.stringify({ pass: true, checks: 'muhurtham validated against the book\'s own Shillong 2009-06-21 worked example', shillongResult, result }, null, 2));
