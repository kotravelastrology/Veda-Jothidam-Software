/**
 * The horoscope book's pages built after page 20, against the PL9 sample (aniruddha_HC4: 5 October 1990, 04:30 IST, Chennai) on the sample's
 * 360-day dasha year, where the sample's figures and ours are the same reckoning: the dates and values below are the sample's own.
 */
const assert = require('node:assert/strict');
const { BOOK_SECTIONS } = require('./src/report/horoscopeBook/bookSections');

const birth = { year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai' };
const dashaOptions = { yearDays: 360, balance: 'degree' };
const build = (id) => BOOK_SECTIONS.find((s) => s.id === id).build({ name: 'x', birth, dashaOptions });
const block = (doc, heading) => doc.blocks.find((b) => b.heading === heading);
const row = (b, first) => b.rows.find((r) => r[0] === first);

(async () => {
  // page 4: three rings of twelve houses
  const p4 = await build('p4');
  assert.equal(p4.blocks[0].rings.length, 3);
  for (const ring of p4.blocks[0].rings) assert.equal(ring.houses.length, 12);
  assert.ok(p4.blocks[0].rings[2].houses[0].includes('As'), 'the inner ring begins at the Ascendant');
  assert.ok(p4.blocks[0].rings[1].houses[0].includes('Mo'), 'the middle ring begins at the Moon');

  // page 7: the Dhoomadi group is the sample's to the second; the portion lords run Sun to Saturn
  const p7 = await build('p7');
  const dh = block(p7, 'Dhoomadi Group');
  assert.deepEqual(row(dh, 'Upaketu').slice(2, 4), ['Leo', '17:43:34']);
  assert.deepEqual(row(dh, 'Dhooma').slice(2, 4), ['Aqu', '01:03:34']);
  assert.deepEqual(row(dh, 'Vyatipata').slice(2, 4), ['Tau', '28:56:26']);
  const gu = p7.blocks.find((b) => b.columns && b.columns.includes('Duration of upagraha'));
  assert.deepEqual(gu.rows.map((r) => r[1]), ['Sun', 'Mon', 'Mar', 'Mer', 'Jup', 'Ven', 'Sat']);

  // page 21: the birth dasha's antardashas that ended before birth have no dates; Mercury-Mars has Venus, Sun, Moon from birth
  const p21 = await build('p21');
  const mm = block(p21, 'Mercury-Mars');
  assert.deepEqual(mm.rows.filter((r) => r[1]).map((r) => [r[0], r[1]]), [['Venus', '05-10-1990'], ['Sun', '03-11-1990'], ['Moon', '21-11-1990']]);
  assert.deepEqual(mm.rows.filter((r) => r[1]).map((r) => r[2]), ['03-11-1990', '21-11-1990', '21-12-1990']);
  assert.equal(block(p21, 'Mercury-Mercury').rows.filter((r) => r[1]).length, 0);

  // page 33 (Ashtottari) and 38 (Yogini): the first antardashas from birth
  const p33 = await build('p33');
  assert.equal(row(block(p33, 'Rahu (12y)'), 'Rahu')[1], '-');
  assert.equal(row(block(p33, 'Rahu (12y)'), 'Moon')[1], '05-10-1990');
  const p38 = await build('p38');
  assert.equal(row(block(p38, 'Ulka (6y)'), 'Sank Ra')[1], '05-10-1990');
  // the sample ends it on 25-12-1990: its balance at birth is two weeks shorter (the Moon's longitude is the same), a day's difference here
  assert.equal(row(block(p38, 'Ulka (6y)'), 'Sank Ra')[2], '26-12-1990');

  // pages 41-42 (Kala Chakra): the balance, the first mahadashas' dates, and the pratyantardashas of the birth antardasha are the sample's
  const p41 = await build('p41');
  assert.ok(p41.blocks[0].text.includes('Jeeva Rashi: Gemini') && p41.blocks[0].text.includes('Deha Rashi: Taurus'));
  assert.deepEqual(p41.blocks.slice(1).map((b) => b.heading), ['Tau (16y)', 'Ari (7y)', 'Pis (10y)', 'Aqu (4y)', 'Cap (4y)', 'Sag (10y)', 'Ari (7y)', 'Tau (16y)', 'Gem (9y)', 'Can (21y)', 'Leo (5y)', 'Vir (9y)']);
  assert.deepEqual(p41.blocks[1].rows.slice(0, 2), [['Beginning', '05-10-1990'], ['Ending', '26-07-1991']]);
  assert.deepEqual(p41.blocks[2].rows.slice(0, 3), [['Beginning', '26-07-1991'], ['Ending', '19-06-1998'], ['1 Ari', '26-07-1991']]);
  const p42 = await build('p42');
  assert.equal(p42.blocks[1].heading, 'Tau-Gem J');
  assert.deepEqual(p42.blocks[1].rows.filter((r) => r[1]).slice(0, 3), [['Ari', '05-10-1990'], ['Tau D', '19-10-1990'], ['Gem J', '28-11-1990']]);

  // pages 62 and 67 (Tribhagi and Shodashottari): the dates are the sample's
  const p62 = await build('p62');
  assert.deepEqual(row(block(p62, 'Mercury (11.33y)'), 'Mars').slice(1), ['05-10-1990', '25-11-1990']);
  assert.deepEqual(row(block(p62, 'Mercury (11.33y)'), 'Rahu').slice(1), ['25-11-1990', '29-07-1992']);
  // page 64 (Tribhagi 40, Vimshottari divided by three): the sample's antardashas of the birth period
  const p64 = await build('p64');
  assert.deepEqual(row(block(p64, 'Mercury (5.67y)'), 'Mars').slice(1), ['05-10-1990', '30-10-1990']);
  assert.deepEqual(row(block(p64, 'Mercury (5.67y)'), 'Rahu').slice(1), ['30-10-1990', '01-09-1991']);
  const p67 = await build('p67');
  assert.deepEqual(row(block(p67, 'Saturn (14y)'), 'Venus').slice(1), ['05-10-1990', '29-09-1992']);

  // pages 57 (Narayana) and 61: the periods' signs and dates are the sample's
  const p57 = await build('p57');
  const aq = block(p57, 'Aquarius (2y)');
  assert.equal(aq.rows[0][1], '05-10-1990');
  assert.equal(aq.rows[1][1], '24-09-1992');
  assert.ok(block(p57, 'Cancer (4y)') && block(p57, 'Sagittarius (8y)') && block(p57, 'Taurus (3y)'));
  const p61 = await build('p61');
  assert.equal(p61.blocks[1].heading, 'Aquarius (9y)');
  assert.equal(p61.blocks[2].rows[0][1], '19-08-1999', 'the sample: Pisces begins 19-08-1999');

  // pages 48-59: the sign dashas as the sample prints them (K.N. Rao chara, Sthira, Drig, Kendradi, Navamsha)
  const heads = async (id) => (await build(id)).blocks.slice(1).map((b) => b.heading);
  assert.deepEqual(await heads('p48'), ['Leo (11y)', 'Virgo (12y)', 'Libra (11y)', 'Scorpio (8y)', 'Sagittarius (7y)', 'Capricorn (1y)', 'Aquarius (2y)', 'Pisces (8y)', 'Aries (1y)', 'Taurus (4y)', 'Gemini (3y)', 'Cancer (4y)']);
  assert.deepEqual(await heads('p50'), ['Virgo (9y)', 'Libra (7y)', 'Scorpio (8y)', 'Sagittarius (9y)', 'Capricorn (7y)', 'Aquarius (8y)', 'Pisces (9y)', 'Aries (7y)', 'Taurus (8y)', 'Gemini (9y)', 'Cancer (7y)', 'Leo (8y)']);
  const p50 = await build('p50');
  assert.deepEqual(p50.blocks[1].rows.slice(0, 3), [['Beginning', '05-10-1990'], ['Ending', '19-08-1999'], ['6 Vir', '05-10-1990']]);
  assert.equal(p50.blocks[1].rows[3][0], '5 Leo'); // Virgo is even: the sub-periods run backward
  assert.equal(p50.blocks[2].rows[2][0], '1 Ari'); // Libra's seventh, Aries, is the stronger
  assert.deepEqual(await heads('p53'), ['Aries (1y)', 'Leo (11y)', 'Scorpio (8y)', 'Aquarius (2y)', 'Taurus (3y)', 'Cancer (4y)', 'Libra (10y)', 'Capricorn (1y)', 'Gemini (4y)', 'Virgo (12y)', 'Sagittarius (8y)', 'Pisces (9y)']);
  assert.deepEqual(await heads('p55'), ['Aries (1y)', 'Taurus (4y)', 'Gemini (3y)', 'Cancer (8y)', 'Leo (1y)', 'Virgo (12y)', 'Libra (11y)', 'Scorpio (6y)', 'Sagittarius (7y)', 'Capricorn (11y)', 'Aquarius (10y)', 'Pisces (4y)']);
  assert.deepEqual(await heads('p59'), ['Aquarius (2y)', 'Taurus (3y)', 'Leo (11y)', 'Scorpio (8y)', 'Pisces (9y)', 'Gemini (4y)', 'Virgo (12y)', 'Sagittarius (8y)', 'Aries (1y)', 'Cancer (4y)', 'Libra (10y)', 'Capricorn (1y)']);

  // page 47: the Chara Karakas are the sample's
  const p47 = await build('p47');
  const ck = block(p47, 'Chara Karakas');
  assert.deepEqual(ck.rows.map((r) => r[2]), ['25:05', '23:56', '19:05', '17:43', '15:11', '10:34', '04:55']);
  assert.ok(ck.rows[0][1].includes('Sa') && ck.rows[6][1].includes('Me'));

  // pages 79 and 80: Saturn's stays and the Ashtakavarga points of the signs are the sample's
  const p79 = await build('p79');
  const first = p79.blocks[1].rows.find((r) => r[2] === '05-03-1993');
  assert.deepEqual([first[3], first[4], first[5], first[6]], ['15-10-1993', '0-7-10', '4', '29']);
  const p80 = await build('p80');
  const gem = p80.blocks[2].rows.find((r) => r[2] === '23-07-2002');
  assert.deepEqual([gem[5], gem[6]], ['4', '34'], 'Saturn in Gemini: 4 bindus of its own, 34 of the Sarvashtakavarga');

  // pages 81 and 82: the KP lagna and cusps are the sample's
  const p81 = await build('p81');
  assert.deepEqual(row(block(p81, 'Planets'), 'Lagna').slice(2, 4), ['Leo', '25:08:50']);
  assert.deepEqual(row(block(p81, 'Planets'), 'Lagna').slice(6), ['Su', 'Ve', 'Me', 'Ra']);
  const c2 = row(block(p81, 'Bhava Details (Placidus System)'), '2.Second'); // the sample: Vir 25:19:36, a second apart
  assert.deepEqual([c2[1], c2[3]], ['Vir', 'Chitra']);
  assert.ok(['25:19:36', '25:19:37'].includes(c2[2]), c2[2]);
  const p82 = await build('p82');
  assert.equal(p82.blocks[0].rows.length, 12);

  // pages 83-88: twelve annual charts each, the first the sample's
  const p83 = await build('p83');
  const cards = p83.blocks.filter((b) => b.kind === 'chartCard');
  assert.equal(cards.length, 12);
  assert.ok(cards[0].heading.includes('5 October 1991 10:42'), cards[0].heading);
  assert.equal(cards[0].rows[1][1], '17:43', 'the Sun at its return');
  assert.equal((await build('p88')).blocks.filter((b) => b.kind === 'chartCard').length, 12);

  console.log(`test-book-pages: ${BOOK_SECTIONS.length} pages registered; all assertions passed`);
})().catch((e) => { console.error(e); process.exit(1); });
