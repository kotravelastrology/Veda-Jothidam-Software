/**
 * The particulars shown when a chart is made (src/report/birthParticulars.js), on the Parashara's Light sample birth
 * (5 October 1990, 04:30 IST, Chennai): the figures are the ones the horoscope book's page 1 and page 20 hold against the
 * sample (Hindu weekday, sunrise, the limbs at birth, Mercury's dasha with its balance of 7y 8m 20d by degree).
 */
const assert = require('node:assert/strict');
const { buildBirthParticulars, ymd } = require('./src/report/birthParticulars');
const { buildPage1 } = require('./src/report/horoscopeBook/page1');

const sample = {
  year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai',
};

// years, months, days of a balance: a month is a twelfth of the year and a day a thirtieth of a month, with the carries
assert.deepEqual(ymd(7.72258816027444), { years: 7, months: 8, days: 20 });
assert.deepEqual(ymd(3), { years: 3, months: 0, days: 0 });
assert.deepEqual(ymd(2.99999999), { years: 3, months: 0, days: 0 }, 'a day that rounds up to a month carries');

(async () => {
  const p = await buildBirthParticulars({ birth: sample, name: 'மாதிரி', gender: 'male' });

  // the day: born before sunrise, so the Hindu weekday is the previous day's (the civil day is Friday)
  assert.equal(p.birth.civilWeekdayTa, 'வெள்ளி');
  assert.equal(p.weekdayTa, 'வியாழன்');
  assert.equal(p.sunriseDate, '1990-10-04');
  assert.equal(p.sunrise, '05:58:05');
  assert.equal(p.sunset, '17:57:12');

  // the limbs at the moment of birth, each with the time it ends after the birth
  assert.equal(p.tithi.paksha, 'தேய்பிறை');
  assert.equal(p.tithi.name, 'பிரதமை');
  assert.equal(p.nakshatra.name, 'ரேவதி');
  assert.equal(p.nakshatra.pada, 3);
  assert.equal(p.nakshatra.lordTa, 'புதன்');
  assert.equal(p.yoga.name, 'வியாகாதம்');
  assert.equal(p.karana.name, 'கௌலவம்');
  for (const limb of [p.tithi, p.nakshatra, p.yoga, p.karana]) assert.ok(limb.endLocal > '1990-10-05 04:30', 'a limb ends after the birth');
  // at sunrise of the Hindu day the limbs were the ones before
  assert.equal(p.atSunrise.nakshatra, 'உத்திரட்டாதி');

  // the signs
  assert.equal(p.lagna.rasiTa, 'சிம்மம்');
  assert.equal(p.moon.rasiTa, 'மீனம்');
  assert.equal(p.moon.lordTa, 'குரு');

  // the dasha at birth: Mercury, with the balance the page-20 test holds
  assert.equal(p.dasha.lord, 'Mercury');
  assert.equal(p.dasha.lordTa, 'புதன்');
  assert.deepEqual(p.dasha.balance, { years: 7, months: 8, days: 20 });
  assert.ok(p.dasha.endsLocal.startsWith('1998-06'), 'the balance runs out in June 1998');

  // the Avakhada points of Revati (Hasti yoni, Deva gana, Antya nadi) and Meena (Brahmin)
  assert.equal(p.avakhada.yoni, 'யானை');
  assert.equal(p.avakhada.gana, 'தேவ');
  assert.ok(p.avakhada.nadi.startsWith('அந்த்யம்'));
  assert.equal(p.avakhada.varna, 'பிராமணர்');

  // the by-time balance differs a little from the by-degree one, and is reported as asked
  const byTime = await buildBirthParticulars({ birth: sample, dashaOptions: { yearDays: 365.25, balance: 'time' } });
  assert.equal(byTime.dasha.method, 'time');
  assert.ok(Math.abs(byTime.dasha.balanceYears - p.dasha.balanceYears) < 0.1);
  // a shorter dasha year shortens the dates, not the balance in years
  const y360 = await buildBirthParticulars({ birth: sample, dashaOptions: { yearDays: 360, balance: 'degree' } });
  assert.equal(y360.dasha.balanceYears, p.dasha.balanceYears);
  assert.ok(y360.dasha.endsLocal < p.dasha.endsLocal);

  // every hour of one day: the limb that holds the birth always exists (a karana lasts about eleven hours, so the two sunrise
  // windows leave a gap), its end is after the birth, and the horoscope book's first page holds up at every hour too
  const day = { ...sample, day: 6, minute: 0, latitude: 13.0833, longitude: 80.2833 };
  for (let hour = 0; hour < 24; hour += 1) {
    const birth = { ...day, hour };
    const r = await buildBirthParticulars({ birth });
    const at = `${birth.year}-10-06 ${String(hour).padStart(2, '0')}:00`;
    for (const key of ['tithi', 'nakshatra', 'yoga', 'karana']) {
      assert.ok(r[key].name, `${key} named at ${hour}:00`);
      assert.ok(r[key].endLocal > at, `${key} ends after ${hour}:00 (ends ${r[key].endLocal})`);
    }
    await buildPage1({ name: 'x', sex: 'male', country: 'India', birth });
  }
  // the weekday changes at sunrise, not at midnight
  assert.equal((await buildBirthParticulars({ birth: { ...day, hour: 5 } })).weekdayTa, 'வெள்ளி');
  assert.equal((await buildBirthParticulars({ birth: { ...day, hour: 6 } })).weekdayTa, 'சனி');

  console.log('test-birth-particulars: all assertions passed');
})().catch((e) => { console.error(e); process.exit(1); });
