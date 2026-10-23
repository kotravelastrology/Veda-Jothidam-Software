const assert = require('assert');
const D = require('./src/report/dashaEffects');

const fx = D.FIXTURE;
assert.ok(fx.source.title && fx.source.pageLocus && fx.scope);
assert.deepStrictEqual(Object.keys(fx.planets), ['Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus']);
for (const [planet, sections] of Object.entries(fx.planets)) {
  assert.ok(sections.some((s) => s.kind === 'fav') || planet === 'Moon', `${planet} has a favourable section`);
  assert.ok(sections.some((s) => s.kind === 'unfav'), `${planet} has an unfavourable section`);
  let last = 0;
  for (const s of sections) {
    assert.ok(s.page >= 576 && s.page <= 589, `${planet} page ${s.page}`);
    assert.ok(s.ta.length > 20 && Array.isArray(s.conds));
    assert.ok(['fav', 'unfav', 'timing', 'note', 'cond'].includes(s.kind));
    if (s.kind !== 'note') assert.ok(s.page >= last - 1, `${planet} pages out of order`);
    last = s.page;
  }
}
// the book's order of treatment and its verse numbers climb (Sun 7, Moon 16, Mars 27, Rahu 34, Jupiter 44/45, Saturn 52/53, Mercury 61/62, Ketu 71/72, Venus 78/79)
const first = ['Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus'].map((p) => parseInt(fx.planets[p][0].verses, 10));
assert.deepStrictEqual(first, [7, 16, 27, 34, 45, 53, 62, 72, 79]);

// A chart: Leo lagna (4), Sun, Moon, Mercury, Jupiter, Venus in Leo, Mars in Virgo, Saturn in Gemini, Rahu in Cancer, Ketu in Capricorn.
const signs = { Sun: 4, Moon: 4, Mars: 5, Mercury: 4, Jupiter: 4, Venus: 4, Saturn: 2, Rahu: 3, Ketu: 9 };
const degrees = { Sun: 10, Moon: 10, Mars: 5, Mercury: 12, Jupiter: 3, Venus: 8, Saturn: 20, Rahu: 6, Ketu: 6 };
const chart = { lagnaSign: 4, signs, degrees, moonWaning: false };

const sun = D.dashaEffects('Sun', chart);
const sunFav = sun.sections.find((s) => s.kind === 'fav');
assert.ok(sunFav.held.includes('OWN_SIGN'), 'Sun in Leo is in his own sign');
assert.ok(sunFav.held.includes('KENDRA'));
assert.ok(!sunFav.held.includes('EXALTED') && sunFav.failed.includes('EXALTED'));
assert.ok(sunFav.unknown.includes('STRONG_VARGA'));
// Leo lagna: the 9th lord is Mars, the 10th Venus; Venus shares Leo with the Sun, Mars is in Virgo.
assert.ok(sunFav.held.includes('WITH_LORD_10') && sunFav.failed.includes('WITH_LORD_9'));

const rahu = D.dashaEffects('Rahu', chart);
assert.strictEqual(rahu.house, 12);
assert.ok(rahu.sections.find((s) => s.kind === 'unfav').held.includes('H12'));
const ketu = D.dashaEffects('Ketu', chart);
assert.ok(ketu.sections.find((s) => s.kind === 'fav').held.includes('H6'), 'Ketu in Capricorn is the 6th from Leo');

// Moon waning is only judged when the elongation is given.
const moon = D.dashaEffects('Moon', { ...chart, moonWaning: true }).sections.find((s) => s.kind === 'unfav');
assert.ok(moon.held.includes('WANING'));
assert.ok(D.dashaEffects('Moon', { lagnaSign: 4, signs, degrees }).sections.find((s) => s.kind === 'unfav').unknown.includes('WANING'));

// Moolatrikona needs the degrees: Mars in Aries 0-12.
const mars = D.dashaEffects('Mars', { lagnaSign: 0, signs: { ...signs, Mars: 0 }, degrees: { ...degrees, Mars: 5 } });
assert.ok(mars.sections[0].held.includes('MOOLATRIKONA') && mars.sections[0].held.includes('OWN_SIGN'));
const mars2 = D.dashaEffects('Mars', { lagnaSign: 0, signs: { ...signs, Mars: 0 }, degrees: { ...degrees, Mars: 15 } });
assert.ok(!mars2.sections[0].held.includes('MOOLATRIKONA') && mars2.sections[0].held.includes('OWN_SIGN'));

assert.strictEqual(D.allDashaEffects(chart).planets.length, 9);
// BPHS chapter 48: lordships and the favourable / unfavourable rules. Leo lagna: Sun 1, Mercury 2 & 11, Venus 3 & 10,
// Mars 4 & 9, Jupiter 5 & 8, Saturn 6 & 7, Moon 12.
const fx48 = D.FIXTURE_48;
assert.deepStrictEqual(Object.keys(fx48.houseLords), Array.from({ length: 12 }, (_, i) => String(i + 1)));
assert.strictEqual(fx48.rules.length, 14);
assert.ok(fx48.rules.every((r) => r.page >= 590 && r.page <= 594 && ['fav', 'fav+', 'unfav'].includes(r.kind)));
const holds = (planet) => Object.fromEntries(D.lordshipRules(planet, chart).rules.map((r) => [r.id, r.holds]));
assert.deepStrictEqual(D.lordshipRules('Venus', chart).lordOf, [3, 10]);
assert.deepStrictEqual(D.lordshipRules('Saturn', chart).lordOf, [6, 7]);
assert.deepStrictEqual(D.lordshipRules('Rahu', chart).lordOf, []);
const hSun = holds('Sun');
assert.strictEqual(hSun.WITH_LORD5, true, 'Jupiter, lord of the 5th, shares Leo with the Sun');
assert.strictEqual(hSun.KENDRA_TRIKONA_EXCHANGE, true, 'the lagna lord stands in the lagna');
assert.strictEqual(hSun.WITH_LORD_3_6_11, true, 'Venus (3rd) and Mercury (11th) share Leo');
assert.strictEqual(hSun.LORD_3_6_11, false);
const hVenus = holds('Venus');
assert.strictEqual(hVenus.LORD9_10_WITH_LORD5, true);
assert.strictEqual(hVenus.LORD_3_6_11, true);
const hSat = holds('Saturn');
assert.strictEqual(hSat.IN_HOUSE_3_6_11, true);
assert.strictEqual(hSat.LORD_3_6_11, true);
assert.strictEqual(hSat.KENDRA_TRIKONA_EXCHANGE, false);
assert.strictEqual(hSat.ASPECTED_BY_KENDRA_TRIKONA_LORD, null, 'aspects are not checked');
assert.strictEqual(holds('Mars').IN_HOUSE_8, false);
// 9th lord in the lagna and lagna lord in the 9th: Sagittarius lagna, lord of the 1st Jupiter in Leo (the 9th), lord of the 9th (Leo) the Sun in Sagittarius
const swap = { lagnaSign: 8, signs: { Sun: 8, Moon: 0, Mars: 0, Mercury: 0, Jupiter: 4, Venus: 0, Saturn: 0, Rahu: 0, Ketu: 6 }, degrees };
assert.strictEqual(D.lordshipRules('Sun', swap).rules.find((r) => r.id === 'LORD9_IN_1_AND_LORD1_IN_9').holds, true);
assert.strictEqual(D.lordshipRules('Jupiter', swap).rules.find((r) => r.id === 'LORD9_IN_1_AND_LORD1_IN_9').holds, true);
assert.strictEqual(D.allDashaEffects(chart).planets[0].lordship.houseLords[0].house, 1);

console.log('test-dasha-effects ok');
