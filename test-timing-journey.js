/**
 * VJ-018 — Tamil timing journey.
 *
 * Acceptance (the half that applies to a day rather than a person):
 * location/date/method visible.
 *
 * Every row the Nalla Neram screen prints is a *clock time*, cut from sunrise
 * and sunset at one set of coordinates under one UTC offset. Read that table
 * against the wrong place or the wrong offset and every row is wrong by a
 * fixed amount while still looking entirely reasonable — which is why the
 * context has to be carried by the result rather than assembled by the page.
 */
const assert = require('node:assert/strict');

const { calculateDailyMuhurta } = require('./src/report/dailyMuhurta');

const CHENNAI = {
  year: 2026, month: 9, day: 27,
  latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330, placeName: 'சென்னை',
};

const day = calculateDailyMuhurta(CHENNAI);
assert.equal(day.available, true);

// ------------------------------------------------- date, place, method --

const c = day.context;
assert.ok(c, 'the result carries its own context');
assert.equal(c.date, '2026-09-27');
assert.equal(c.placeName, 'சென்னை');
assert.equal(c.latitude, '13.0827°N');
assert.equal(c.longitude, '80.2707°E');
assert.equal(c.utcOffset, '+05:30');
assert.equal(c.method.ayanamsha, 'Lahiri');
assert.equal(c.method.dayBoundary, 'sunrise');
assert.ok(/[஀-௿]/.test(c.method.division), 'the division rule is stated for a Tamil reader');

// 2026-09-27 is a Sunday; all three cycles start from the weekday's lord, so
// the weekday is part of the method and not decoration.
assert.equal(c.weekdayTa, 'ஞாயிறு');
assert.equal(c.weekdayLord, 'Sun');
assert.equal(day.hora.day[0].lord, c.weekdayLord,
  'the first hora is the weekday lord, which is what makes the weekday a method detail');

// ----------------------------------------- the offset changes the times --

// Same place, same date, offset dropped to UTC. If the offset were ignored
// the two tables would be identical, which is the defect this guards: the
// page used to hardcode +05:30 while accepting any coordinates.
const utc = calculateDailyMuhurta({ ...CHENNAI, utcOffsetMinutes: 0 });
assert.notEqual(utc.sunrise, day.sunrise,
  'the reported sunrise must follow the offset it was given');
assert.equal(utc.context.utcOffset, '+00:00');
assert.notEqual(utc.gowri.day[0].from, day.gowri.day[0].from);

// The slot *sequence* is a property of the weekday, so it must not move with
// the offset — only the clock times do.
assert.deepEqual(
  utc.gowri.day.map((r) => r.gowri),
  day.gowri.day.map((r) => r.gowri),
);

// ------------------------------------- a different place is a different day --

const LONDON = {
  year: 2026, month: 9, day: 27,
  latitude: 51.5072, longitude: -0.1276, utcOffsetMinutes: 60, placeName: 'London',
};
const london = calculateDailyMuhurta(LONDON);
assert.equal(london.context.latitude, '51.5072°N');
assert.equal(london.context.longitude, '0.1276°W', 'a western longitude keeps its sign');
assert.equal(london.context.utcOffset, '+01:00');
assert.notEqual(london.sunrise, day.sunrise);

// What the method reports is what the calculation used — a displayed
// ayanamsha that could drift from the one in force would be worse than
// showing nothing.
for (const r of [day, utc, london]) {
  assert.equal(r.context.method.ayanamsha, 'Lahiri');
}

// ----------------------------------------------------- slots stay whole --

for (const table of ['gowri', 'choghadiya']) {
  for (const half of ['day', 'night']) {
    assert.equal(day[table][half].length, 8, `${table}.${half} divides into 8`);
  }
}
assert.equal(day.hora.day.length, 12);
assert.equal(day.hora.night.length, 12);

/** "HH:MM" -> minutes, unwrapped so a night table crossing midnight stays monotonic. */
function minutesOf(hhmm, previous) {
  const [h, m] = hhmm.split(':').map(Number);
  let mins = h * 60 + m;
  while (previous !== null && mins < previous) mins += 1440;
  return mins;
}

// The slots of one table are equal by construction — the half-day divided by
// 8 (or 12). Printing them as clock times is where that can break: rounding
// the hour and the minute separately loses an hour whenever the minute rounds
// up to 60, which showed as a 31-minute slot beside a 150-minute one.
for (const [table, count] of [['gowri', 8], ['choghadiya', 8], ['hora', 12]]) {
  for (const half of ['day', 'night']) {
    const slots = day[table][half];
    let cursor = null;
    const lengths = [];
    for (const slot of slots) {
      const from = minutesOf(slot.from, cursor);
      const to = minutesOf(slot.to, from);
      if (cursor !== null) {
        assert.equal(from, cursor, `${table}.${half}: a gap or overlap at ${slot.from}`);
      }
      lengths.push(to - from);
      cursor = to;
    }
    assert.equal(lengths.length, count);
    // Whole-minute rounding can differ by one minute between slots; an hour
    // cannot.
    assert.ok(Math.max(...lengths) - Math.min(...lengths) <= 1,
      `${table}.${half}: slot lengths ${lengths.join(', ')} are not equal`);
  }
}

console.log(JSON.stringify({
  pass: true,
  date: c.date,
  weekday: c.weekdayTa,
  place: `${c.placeName} ${c.latitude} ${c.longitude} UTC${c.utcOffset}`,
  method: c.method.ayanamsha,
  sunrise: day.sunrise,
  sunriseAtUtc: utc.sunrise,
  londonSunrise: london.sunrise,
}, null, 2));
