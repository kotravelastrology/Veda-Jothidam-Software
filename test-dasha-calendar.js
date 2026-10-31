const assert = require('assert');
const { daysInMonth, firstWeekday, dashaChangesInMonth } = require('./src/dasha/dashaCalendar');

assert.strictEqual(daysInMonth(2026, 2), 28);
assert.strictEqual(daysInMonth(2028, 2), 29, 'leap year');
assert.strictEqual(daysInMonth(2026, 10), 31);

// 1 October 2026 is a Thursday (4 with Sunday = 0).
assert.strictEqual(firstWeekday(2026, 10), 4);
assert.strictEqual(firstWeekday(2026, 11), 0, '1 November 2026 is a Sunday');

// A depth-2 tree: Mercury's Bhuktis, then Ketu's. Two changes fall on 3 October, one on 20 October.
const tree = {
  dashas: [
    {
      lord: 'Mercury',
      Bhukti: [
        { lord: 'Venus', startLocal: '2026-10-03 18:00' },
        { lord: 'Ketu', startLocal: '2026-10-03 06:12' },
        { lord: 'Sun', startLocal: '2026-11-01 00:00' },
      ],
    },
    {
      lord: 'Ketu',
      Bhukti: [{ lord: 'Ketu', startLocal: '2026-10-20 09:05' }],
    },
  ],
};

const oct = dashaChangesInMonth(tree, 2026, 10);
assert.deepStrictEqual(oct.map((d) => d.day), [3, 20]);
// Two changes on the 3rd are sorted by time.
assert.deepStrictEqual(oct[0].changes.map((c) => c.antardasha), ['Ketu', 'Venus']);
assert.deepStrictEqual(oct[0].changes.map((c) => c.time), ['06:12', '18:00']);
assert.strictEqual(oct[0].changes[0].mahadasha, 'Mercury');
assert.deepStrictEqual(oct[1].changes, [{ mahadasha: 'Ketu', antardasha: 'Ketu', time: '09:05', startLocal: '2026-10-20 09:05' }]);

// The November change is not in October and shows up in November alone.
const nov = dashaChangesInMonth(tree, 2026, 11);
assert.deepStrictEqual(nov.map((d) => d.day), [1]);
assert.strictEqual(nov[0].changes[0].antardasha, 'Sun');

// A month with no change gives an empty list.
assert.deepStrictEqual(dashaChangesInMonth(tree, 2027, 1), []);

// Against PL9: the Vimshottari panel of the sample chart (5 October 1990, 04:30 IST, Chennai) lists these dasha starts
// (screenshot of PL9 9.0, 2026-10-31). With the 365.25-day year the calendar writes eight of the ten on PL9's day. The
// other two (Su-Ke, Mo-Mo) begin in the first hours after midnight on the next day here (00:36 and 02:42), so PL9's
// day is one earlier; the reason is not known (PL9 prints no time), and the test records the gap rather than hiding it.
const { withBirth } = require('./src/report/horoscopeBook/charts');
const { buildVimshottariDasha } = require('./src/dasha/vimshottariDasha');
const birth = {
  year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai',
};
// [combination, PL9 date, whether ours falls on the next day, before 03:00]
const PL9_STARTS = [
  ['Su-Ra', '2026-08-19'], ['Su-Ju', '2027-07-14'], ['Su-Sa', '2028-05-01'], ['Su-Me', '2029-04-13'],
  ['Su-Ke', '2030-02-17', 'next-day'], ['Su-Ve', '2030-06-25'], ['Mo-Mo', '2031-06-25', 'next-day'],
  ['Mo-Ma', '2032-04-25'], ['Mo-Ra', '2032-11-24'], ['Mo-Ju', '2034-05-26'],
];

async function main() {
  const real = await withBirth(birth, ({ chart }) => buildVimshottariDasha(chart.julianDay, chart.grahas.Moon.longitude, 330, { depth: 2 }));
  for (const [combination, pl9Date, gap] of PL9_STARTS) {
    const antar = real.dashas
      .flatMap((m) => m.Bhukti.map((a) => ({ combination: `${m.lord.slice(0, 2)}-${a.lord.slice(0, 2)}`, startLocal: a.startLocal })))
      .find((a) => a.combination === combination && a.startLocal.slice(0, 4) >= '2026');
    assert.ok(antar, `${combination}: not in the tree`);
    const [date, time] = antar.startLocal.split(' ');
    if (gap === 'next-day') {
      assert.strictEqual(Date.parse(`${date}T00:00:00Z`) - Date.parse(`${pl9Date}T00:00:00Z`), 86400000, `${combination}: one day after PL9`);
      assert.ok(time < '03:00', `${combination}: ${time} is in the first hours of the day`);
    } else {
      assert.strictEqual(date, pl9Date, `${combination}: PL9 ${pl9Date}`);
    }
    // And the calendar puts it on that day of the month.
    const [y, m, d] = date.split('-').map(Number);
    assert.ok(dashaChangesInMonth(real, y, m).some((x) => x.day === d && x.changes.some((c) => c.startLocal === antar.startLocal)));
  }
  console.log('test-dasha-calendar: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
