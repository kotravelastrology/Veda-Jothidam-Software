/**
 * The sign dashas as the PL9 sample prints them (src/dasha/pl9SignDashas.js): Chara (K.N. Rao), Sthira (Brahma, B.V. Raman's strengths),
 * Drig, Lagna Kendradi and Navamsha. The sample (5 October 1990, 04:30 IST, Chennai, Leo lagna) gives each sequence of signs and years.
 */
const assert = require('node:assert/strict');
const P = require('./src/dasha/pl9SignDashas');
const { withBirth } = require('./src/report/horoscopeBook/charts');

const SIGN = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];
const seq = (r) => r.periods.map((p) => `${SIGN[p.sign]}${Math.round(p.years)}`).join(' ');

(async () => {
  const birth = { year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai' };
  await withBirth(birth, ({ chart }) => {
    const PL = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
    const facts = {
      signs: Object.fromEntries(PL.map((p) => [p, chart.grahas[p].rasiIndex])),
      degrees: Object.fromEntries(PL.map((p) => [p, chart.grahas[p].longitude % 30])),
      lagnaSign: Math.floor(chart.lagna.longitude / 30), lagnaLongitude: chart.lagna.longitude,
      moonFraction: (chart.grahas.Moon.longitude % (360 / 27)) / (360 / 27),
    };
    assert.equal(facts.lagnaSign, 4);
    assert.equal(seq(P.charaKNRao(facts)), 'Leo11 Vir12 Lib11 Sco8 Sag7 Cap1 Aqu2 Pis8 Ari1 Tau4 Gem3 Can4');
    assert.equal(seq(P.sthiraPL9(facts)), 'Vir9 Lib7 Sco8 Sag9 Cap7 Aqu8 Pis9 Ari7 Tau8 Gem9 Can7 Leo8');
    assert.equal(seq(P.drigPL9(facts)), 'Ari1 Leo11 Sco8 Aqu2 Tau3 Can4 Lib10 Cap1 Gem4 Vir12 Sag8 Pis9');
    assert.equal(seq(P.kendradiPL9(facts)), 'Aqu2 Tau3 Leo11 Sco8 Pis9 Gem4 Vir12 Sag8 Ari1 Can4 Lib10 Cap1');
    assert.equal(seq(P.navamshaPL9(facts)), 'Ari1 Tau4 Gem3 Can8 Leo1 Vir12 Lib11 Sco6 Sag7 Cap11 Aqu10 Pis4');
    // the Chara sub-periods run in the order of the sign, each sign taking its own last
    const chara = P.charaKNRao(facts);
    assert.deepEqual(chara.periods[0].order, [5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4]); // Leo: Vir ... Can, Leo
    assert.equal(chara.periods[0].order.length, 12);
  });
  console.log('test-pl9-sign-dashas: all assertions passed');
})().catch((e) => { console.error(e); process.exit(1); });
