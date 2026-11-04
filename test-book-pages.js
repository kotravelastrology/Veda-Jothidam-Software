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
  // the sample ends it on 25-12-1990 (the balance as the calendar's date, not the dasha years', is the same here)
  assert.equal(row(block(p38, 'Ulka (6y)'), 'Sank Ra')[2], '25-12-1990');

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
  assert.deepEqual(row(block(p62, 'Mercury (11y)'), 'Mars').slice(1), ['05-10-1990', '25-11-1990']);
  assert.deepEqual(row(block(p62, 'Mercury (11y)'), 'Rahu').slice(1), ['25-11-1990', '29-07-1992']);
  // page 64 (Tribhagi 40, Vimshottari divided by three): the sample's antardashas of the birth period
  const p64 = await build('p64');
  assert.deepEqual(row(block(p64, 'Mercury (5y)'), 'Mars').slice(1), ['05-10-1990', '30-10-1990']);
  assert.deepEqual(row(block(p64, 'Mercury (5y)'), 'Rahu').slice(1), ['30-10-1990', '01-09-1991']);
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

  // pages 71-72 (Shastihayani): the balance, the dates of the birth period and the second page's first period are the sample's
  const p71 = await build('p71');
  assert.ok(p71.blocks[0].text.includes('Rahu 0y 8m'));
  assert.deepEqual(p71.blocks[1].rows.slice(-2), [['Venus', '05-10-1990', '03-11-1990'], ['Saturn', '03-11-1990', '07-06-1991']]);
  assert.deepEqual(row(block(p71, 'Jupiter (10y)'), 'Jupiter').slice(1), ['07-06-1991', '27-01-1993']);
  assert.deepEqual(row(block(p71, 'Sun (10y)'), 'Rahu').slice(1), ['07-07-2008', '02-07-2009']);
  const p72 = await build('p72');
  assert.deepEqual(row(block(p72, 'Jupiter (10y)'), 'Jupiter').slice(1), ['27-07-2050', '18-03-2052']);
  assert.deepEqual(row(block(p72, 'Sun (10y)'), 'Rahu').slice(1), ['27-08-2067', '21-08-2068']);

  // second cycles: Navamsha repeats (the sample's 76y10m start and dates); Narayana, Drig and Kendradi take twelve less the first-cycle years (Rath; Koch)
  const asides = async (id) => (await build(id)).blocks.slice(1).map((b) => b.aside);
  const p56 = await build('p56');
  assert.deepEqual(await asides('p56'), ['76y10m', '77y10m', '81y9m', '84y9m', '92y7m', '93y7m', '105y5m', '116y3m', '122y2m', '129y1m', '139y11m', '149y9m']);
  assert.deepEqual(p56.blocks[1].rows[0], ['Beginning', '22-08-2067']);
  assert.equal(p56.blocks[2].rows[0][1], '16-08-2068');
  const p58 = await build('p58');
  assert.deepEqual(p58.blocks.slice(1).map((b) => b.heading), ['Aquarius (10y)', 'Cancer (8y)', 'Sagittarius (4y)', 'Taurus (9y)', 'Libra (2y)', 'Pisces (3y)', 'Leo (1y)', 'Capricorn (11y)', 'Gemini (8y)', 'Scorpio (4y)', 'Aries (11y)']); // Virgo had twelve: none left
  assert.deepEqual(await asides('p58'), ['71y11m', '81y9m', '89y8m', '93y7m', '102y6m', '104y5m', '107y5m', '108y5m', '119y3m', '127y1m', '131y1m']);
  assert.deepEqual(p58.blocks[1].rows[0], ['Beginning', '17-09-2062']);
  // Drig second cycle: the sample's periods from Taurus on last 9, 8, 2, 11, 8, 4, 3 years (its first four are printed with repeated headings and do not follow the rule)
  const p54 = await build('p54');
  assert.deepEqual(p54.blocks.slice(1).map((b) => b.heading), ['Aries (11y)', 'Leo (1y)', 'Scorpio (4y)', 'Aquarius (10y)', 'Taurus (9y)', 'Cancer (8y)', 'Libra (2y)', 'Capricorn (11y)', 'Gemini (8y)', 'Sagittarius (4y)', 'Pisces (3y)']);

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

  // page 89, the Mangala dosha: Mars's house from the Lagna, Moon and Venus under each reading
  const p89 = await build('p89');
  const formation = block(p89, 'செவ்வாய் நிற்கும் வீடு — லக்னம், சந்திரன், சுக்கிரனிலிருந்து');
  assert.deepEqual(formation.columns.slice(0, 5), ['முறை', 'லக்னம்', 'சந்திரன்', 'சுக்கிரன்', 'தோஷம்']);
  assert.equal(formation.rows.length, 5, 'five readings: Vishnu Bhaskar three, Bhagat, Maansagari');
  for (const r of formation.rows) assert.ok(/ப\.\d/.test(r[5]) && !/PDF/.test(r[5]), `a printed page, never a PDF page: ${r[5]}`);
  assert.ok(!/undefined|NaN|null/.test(JSON.stringify(p89)));
  // page 90: Saturn from the Moon, the three phases and the remedies the books record, each with a printed page
  const p90 = await build('p90');
  assert.equal(block(p90, 'ஏழரைச் சனியின் மூன்று கட்டங்கள்').rows.length, 3);
  const remedies = block(p90, 'பரிகாரம் — நூல்களில் பதிவானவை');
  assert.ok(remedies.rows.length >= 3 && remedies.rows.every((r) => r[2] && !/PDF/.test(r[2])), 'every remedy names its book');
  assert.ok(!/undefined|NaN|null/.test(JSON.stringify(p90)));
  // page 91: seven planets, each with the three books' words and whether they agree
  const p91 = await build('p91');
  const gems = block(p91, 'ஏழு கிரகங்களின் ரத்தினங்கள்');
  assert.equal(gems.rows.length, 7);
  assert.ok(gems.rows.every((r) => r.length === 6 && r.every(Boolean)), 'no empty cell');
  assert.ok(!/undefined|NaN|null/.test(JSON.stringify(p91)));
  // page 92: the running mahadasha and the next, BPHS ch.47 placements held / not held / not checked, with printed pages
  const p92 = await build('p92');
  const dashaTables = p92.blocks.filter((b) => b.kind === 'table' && b.columns.length === 6);
  assert.equal(dashaTables.length, 2, 'the running mahadasha and the next');
  for (const t of dashaTables) {
    assert.ok(/மகாதசை — \d\d-\d\d-\d{4} முதல்/.test(t.heading), t.heading);
    assert.ok(t.rows.length >= 2 && t.rows.every((r) => /ப\.\d/.test(r[5]) && !/PDF/.test(r[5])), 'each section names its printed page');
  }
  assert.ok(!/undefined|NaN|null/.test(JSON.stringify(p92)));
  // pages 93-97: seventy-five antardashas, fifteen a page, with only the beginnings of their pratyantardashas (PL9's shorter print)
  let shortBlocks = 0;
  for (const id of ['p93', 'p94', 'p95', 'p96', 'p97']) {
    const page = await build(id);
    const tiles = page.blocks.filter((b) => b.kind === 'table');
    shortBlocks += tiles.length;
    assert.ok(tiles.every((t) => t.columns.join() === 'Antar,Begin' && t.rows.length === 9 && /^[A-Z][a-z]{2}-[A-Z][a-z]{2}$/.test(t.heading)), id);
    assert.ok(!/undefined|NaN|null/.test(JSON.stringify(page)));
  }
  assert.equal(shortBlocks, 75, 'seventy-five antardashas');
  // pages 98-99: nine Yogini mahadashas each, with the antardasha beginnings
  for (const id of ['p98', 'p99']) {
    const page = await build(id);
    const tiles = page.blocks.filter((b) => b.kind === 'table');
    assert.equal(tiles.length, 9, id);
    assert.ok(tiles.every((t) => t.columns.join() === 'Antar,Beginning' && t.rows.length === 8), id);
  }

  // pages 100-108: the nine mahadashas from birth in the order they run, each with its nine antardashas read against BPHS ch.52-60
  const CYCLE_TA = ['கேது', 'சுக்கிரன்', 'சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'ராகு', 'குரு', 'சனி', 'புதன்']; // the Vimshottari order
  let firstAt = -1;
  for (let i = 0; i < 9; i += 1) {
    const id = `p${100 + i}`;
    const page = await build(id);
    const at = CYCLE_TA.findIndex((t) => page.blocks[0].heading.startsWith(`${t} மகாதசை — `));
    assert.ok(at >= 0, `${id}: ${page.blocks[0].heading}`);
    if (firstAt < 0) firstAt = at; // the page for the birth dasha names whichever lord rules it; each page after it is the next in the cycle
    assert.equal(at, (firstAt + i) % 9, `${id}: the mahadashas run in the Vimshottari order`);
    const lord = CYCLE_TA[at];
    const tables = page.blocks.filter((b) => b.kind === 'table');
    assert.equal(tables.length, 9, `${id}: nine antardashas`);
    assert.ok(tables.every((t) => t.columns.length === 6 && t.rows.length >= 2 && t.rows.every((r) => r.length === 6 && /Chapter \d+ v\.[\d-]+, ப\.\d+$/.test(r[5]) && !/PDF/.test(r[5]))), `${id}: a book, chapter, verse and printed page on each row`);
    assert.ok(tables.every((t) => t.heading.startsWith(`${lord} தசை — `) && /^\d\d-\d\d-\d{4} → \d\d-\d\d-\d{4}$|^பிறப்புக்கு முன் முடிந்தது$/.test(t.aside) && /வீட்டில் \(/.test(t.note)), id);
    assert.ok(!/undefined|NaN|null/.test(JSON.stringify(page)), id);
  }
  // the birth dasha's antardashas that ended before birth carry no dates
  const undated = (await build('p100')).blocks.filter((b) => b.aside === 'பிறப்புக்கு முன் முடிந்தது').length;
  assert.ok(undated > 0 && undated < 9, 'some, not all, of the antardashas of the birth dasha ended before birth');

  // pages 109-117: the same nine mahadashas, each antardasha with its nine pratyantardashas read against BPHS ch.61
  for (let i = 0; i < 9; i += 1) {
    const id = `p${109 + i}`;
    const page = await build(id);
    const head = (await build(`p${100 + i}`)).blocks[0].heading.split(' மகாதசை')[0];
    assert.ok(page.blocks[0].heading.startsWith(`${head} மகாதசை — `) && /அத். 61/.test(page.blocks[0].heading), id);
    const tables = page.blocks.filter((b) => b.kind === 'table');
    assert.equal(tables.length, 9, `${id}: nine antardashas`);
    assert.ok(tables.every((t) => t.rows.length === 9 && t.rows.every((r) => r.length === 5 && /Chapter 61 v\.\d+, ப\.7\d\d$/.test(r[4]) && r[3].length > 10)), `${id}: nine pratyantardashas, each with the book's effect`);
    assert.ok(tables.every((t) => /திரிகோணத்தில் (உள்ளது|இல்லை)/.test(t.note)), id);
    assert.ok(!/undefined|NaN|null/.test(JSON.stringify(page)), id);
  }
  // the effect is the antardasha-and-pratyantardasha pair's, whatever the mahadasha: the same row text wherever the pair recurs
  const pr109 = (await build('p109')).blocks.filter((b) => b.kind === 'table');
  const dated = pr109.flatMap((t) => t.rows).filter((r) => r[1] !== '—');
  assert.ok(dated.length > 0 && dated.every((r) => /^\d\d-\d\d-\d{4}$/.test(r[1]) && /^\d\d-\d\d-\d{4}$/.test(r[2])));

  // pages 118-121: nine of the thirty-six pratyantardashas from the one running now, each with its nine sookshma dashas read against BPHS ch.62
  const pdNames = [];
  for (let i = 0; i < 4; i += 1) {
    const page = await build(`p${118 + i}`);
    assert.ok(/அத். 62/.test(page.blocks[0].heading) && /Chapter 62 v\.1, ப\.770/.test(page.blocks[0].text) && /Chapter 62 translator's note, ப\.784/.test(page.blocks[0].text), `p${118 + i}`);
    const tables = page.blocks.filter((b) => b.kind === 'table');
    assert.equal(tables.length, 9, `p${118 + i}: nine pratyantardashas`);
    assert.ok(tables.every((t) => t.columns.length === 5 && t.rows.length === 9 && t.rows.every((r) => /^\d\d-\d\d-\d{4} \d\d:\d\d$/.test(r[1]) && /^\d\d-\d\d-\d{4} \d\d:\d\d$/.test(r[2]) && /Chapter 62 v\.\d+, ப\.7[7-8]\d$/.test(r[4]) && r[3].length > 10)), `p${118 + i}: nine sookshma dashas with date-times and the book's effect`);
    assert.ok(!/undefined|NaN|null/.test(JSON.stringify(page)), `p${118 + i}`);
    pdNames.push(...tables.map((t) => t.heading));
  }
  assert.equal(new Set(pdNames).size, 36, 'thirty-six different pratyantardashas over the four pages');
  // pages 122-123: nine of the eighteen sookshma dashas from the one running now, each with its nine prana dashas read against BPHS ch.63
  for (let i = 0; i < 2; i += 1) {
    const page = await build(`p${122 + i}`);
    assert.ok(/அத். 63/.test(page.blocks[0].heading) && /Chapter 63 v\.1, ப\.785/.test(page.blocks[0].text) && /Chapter 63 v\.83, ப\.798/.test(page.blocks[0].text), `p${122 + i}`);
    const tables = page.blocks.filter((b) => b.kind === 'table');
    assert.equal(tables.length, 9, `p${122 + i}: nine sookshma dashas`);
    assert.ok(tables.every((t) => t.rows.length === 9 && t.rows.every((r) => /^\d\d-\d\d-\d{4} \d\d:\d\d$/.test(r[1]) && /Chapter 63 v\.\d+, ப\.(7[89]\d)$/.test(r[4]) && r[3].length > 10)), `p${122 + i}: nine prana dashas`);
    assert.ok(!/undefined|NaN|null/.test(JSON.stringify(page)), `p${122 + i}`);
  }
  // each prana table's dates run on from one prana dasha to the next and fill its sookshma dasha
  const pr122 = (await build('p122')).blocks.filter((b) => b.kind === 'table');
  for (const t of pr122) {
    assert.equal(t.rows[0][1], t.aside.split(' → ')[0], `${t.heading}: the first prana begins where the sookshma begins`);
    assert.equal(t.rows[8][2], t.aside.split(' → ')[1], `${t.heading}: the last prana ends where the sookshma ends`);
    for (let k = 1; k < 9; k += 1) assert.equal(t.rows[k][1], t.rows[k - 1][2], `${t.heading}: prana ${k} follows ${k - 1}`);
  }

  // pages 124-126: the Kalachakra dasha's results from BPHS ch.65 (page 124) and ch.64 (pages 125-126); the sample is a Savya birth in Revati pada 3 (Aquarius Amsa)
  const k124 = await build('p124');
  assert.ok(/அத். 65/.test(k124.blocks[0].heading) && /Chapter 65 v\.32, ப\.841/.test(k124.blocks[0].text));
  const kt = k124.blocks.filter((b) => b.kind === 'table');
  assert.equal(kt.length, 1);
  assert.equal(kt[0].rows.length, 12);
  assert.ok(kt[0].rows.every((r) => r.length === 6 && /^\d\d-\d\d-\d{4}$/.test(r[1]) && /Chapter 65 v\.[\d½-]+, ப\.8[34]\d/.test(r[5]) && r[4].length > 5));
  assert.deepEqual(kt[0].rows[0].slice(0, 5), ['ரிஷபம் (16 ஆண்டு)', '05-10-1990', '26-07-1991', 'கும்பம் அம்சம், 1-ஆவது', 'செல்வப் பெருக்கம்.']);
  assert.equal(kt[0].rows[1][3], 'கும்பம் அம்சம், 2-ஆவது');
  for (const [id, first] of [['p125', 'ரிஷபம் தசை — கும்பம் அம்சம்'], ['p126', null]]) {
    const page = await build(id);
    assert.ok(/அத். 64/.test(page.blocks[0].heading), id);
    const tables = page.blocks.filter((b) => b.kind === 'table');
    assert.equal(tables.length, 6, `${id}: six mahadashas`);
    assert.ok(tables.every((t) => t.rows.length === 12 && t.rows.every((r) => r.length === 5 && /^[^\s]+ \([^)]+\)$/.test(r[0]) && (r[3] === '—' ? r[4] === '—' : /Chapter 64 v\.[\d-]+, ப\.8[23]\d/.test(r[4])))), `${id}: twelve antardashas, each with the book's effect or none`);
    assert.ok(!/undefined|NaN|null/.test(JSON.stringify(page)), id);
    if (first) assert.equal(tables[0].heading, first);
  }
  // an Apsavya birth (15 October 1990, Moon in Mrigasira): the book gives no table for it, so the pages give its rule and no rows
  const apsavyaBirth = { ...birth, day: 15 };
  for (const id of ['p124', 'p125', 'p126']) {
    const page = await BOOK_SECTIONS.find((s) => s.id === id).build({ name: 'x', birth: apsavyaBirth, dashaOptions });
    assert.equal(page.blocks.length, 1, id);
    assert.ok(/அப்சவ்ய/.test(page.blocks[0].text) && /Chapter 64 v\.56-58, ப\.833-834/.test(page.blocks[0].text), id);
  }

  console.log(`test-book-pages: ${BOOK_SECTIONS.length} pages registered; all assertions passed`);
})().catch((e) => { console.error(e); process.exit(1); });
