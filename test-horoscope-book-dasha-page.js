const assert = require('assert');
const { buildPage20, orderFrom, yearsText } = require('./src/report/horoscopeBook/dashaPage');

// Sample birth, PL9 aniruddha_HC4 page 20: 5 October 1990, 04:30 IST, Chennai (13N05' 80E17').
const birth = {
  year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai',
};

const DAY = 86400000;
/** dd-mm-yyyy to a UTC day number, for the gaps between the sample's dates and ours. */
const dayOf = (s) => { const [d, m, y] = s.split('-').map(Number); return Date.UTC(y, m - 1, d) / DAY; };

// PL9 page 20, the Ketu mahadasha (from 06-05-1998) and the Mercury mahadasha's antardashas from birth (the sample's own dates).
const PL9_MERCURY = [['Mars', '05-10-1990', '11-12-1990'], ['Rahu', '11-12-1990', '16-06-1993'],
  ['Jupiter', '16-06-1993', '10-09-1995'], ['Saturn', '10-09-1995', '06-05-1998']];
const PL9_KETU = [['Ketu', '06-05-1998', '30-09-1998'], ['Venus', '30-09-1998', '24-11-1999'], ['Sun', '24-11-1999', '29-03-2000'],
  ['Moon', '29-03-2000', '25-10-2000'], ['Mars', '25-10-2000', '21-03-2001'], ['Rahu', '21-03-2001', '03-04-2002'],
  ['Jupiter', '03-04-2002', '05-03-2003'], ['Saturn', '05-03-2003', '07-04-2004'], ['Mercury', '07-04-2004', '30-03-2005']];

async function main() {
  // The order of the cycle from each lord, and the year text.
  assert.deepStrictEqual(orderFrom('Mercury'), ['Mercury', 'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn']);
  assert.strictEqual(yearsText(7.72258816027444), '7y 8m 20d');
  assert.strictEqual(yearsText(0), '0y 0m 0d');

  const page = await buildPage20({ name: 'aniruddha', birth, dashaOptions: { yearDays: 360, balance: 'degree' } });
  assert.ok(!/undefined|NaN|null/.test(JSON.stringify(page)), 'no undefined, NaN or null on page 20');
  assert.strictEqual(page.blocks[0].kind, 'text');
  assert.strictEqual(page.blocks[0].text, 'Mercury 7y 8m 20d');

  const mahadashas = page.blocks.slice(1);
  assert.deepStrictEqual(mahadashas.map((b) => b.heading), [
    'Mercury (17y)', 'Ketu (7y)', 'Venus (20y)', 'Sun (6y)', 'Moon (10y)', 'Mars (7y)', 'Rahu (18y)', 'Jupiter (16y)', 'Saturn (19y)',
  ]);

  // The first mahadasha starts at birth with the antardashas still to run (four of nine), as the sample lists them.
  assert.deepStrictEqual(mahadashas[0].rows.map((r) => r[0]), PL9_MERCURY.map((r) => r[0]));
  assert.strictEqual(mahadashas[0].note, 'From 0 yrs to 7y 8m 20d');
  assert.strictEqual(mahadashas[1].note, 'From 7y 8m 20d to 14y 8m 20d');

  // Each antardasha ends where the next begins, and each mahadasha's antardashas cover the whole mahadasha.
  for (const b of mahadashas) {
    for (let i = 1; i < b.rows.length; i += 1) assert.strictEqual(b.rows[i][1], b.rows[i - 1][2], `${b.heading}: contiguous`);
  }

  // Against the sample: every antardasha date within ten days (the balance at birth differs: see dashaPage.js), and
  // the Ketu antardasha of Ketu lasts 147 days on the 360-day year, as the sample's 06-05-1998 to 30-09-1998 does.
  const compare = (rows, pl9) => rows.forEach((r, i) => {
    for (const k of [1, 2]) {
      const gap = Math.abs(dayOf(r[k]) - dayOf(pl9[i][k]));
      assert.ok(gap <= 10, `${r[0]} ${k === 1 ? 'beginning' : 'ending'}: ${gap} days from the sample`);
    }
  });
  compare(mahadashas[0].rows, PL9_MERCURY);
  compare(mahadashas[1].rows, PL9_KETU);
  assert.strictEqual(dayOf(mahadashas[1].rows[0][2]) - dayOf(mahadashas[1].rows[0][1]), 147);

  // The two Dasha Options change the page: the 365.25-day year lengthens the Ketu-in-Ketu antardasha to 150 days, and the
  // balance by time gives 7y 8m 10d (the engine's by-time fraction for this birth).
  const julian = await buildPage20({ name: 'aniruddha', birth, dashaOptions: { yearDays: 365.25, balance: 'degree' } });
  assert.strictEqual(dayOf(julian.blocks[2].rows[0][2]) - dayOf(julian.blocks[2].rows[0][1]), 150, '365.25-day year');
  const byTime = await buildPage20({ name: 'aniruddha', birth, dashaOptions: { yearDays: 360, balance: 'time' } });
  assert.strictEqual(byTime.blocks[0].text, 'Mercury 7y 8m 10d', 'balance by time');

  console.log('test-horoscope-book-dasha-page: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
