const assert = require('assert');
const Y = require('./src/chart/yearlyTransit');
const { jdToLocal } = require('./src/chart/graphicalEphemeris');

// PL9's "Yearly transit overview (South Indian)", read from its screen (the audit chart, year 2026). Its dates are UT days.
const t = Y.yearlyTransit({ year: 2026, utcOffsetMinutes: 0 });
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayOf = (jd) => { const s = jdToLocal(jd, 0); return `${MON[Number(s.slice(5, 7)) - 1]} ${Number(s.slice(8, 10))}`; };
/** PL9's line for a stay */
const line = (s) => Y.stayLine(s, dayOf, { marked: Y.PL9_MARKED });
const lines = (sign) => t.bySign[sign].map(line);

// sign index: 0 Aries ... 11 Pisces. What each screen cell shows, planet by planet.
const screen = {
  0: ['Su: Apr 14 to May 15', 'Ma: May 11 to Jun 20', 'Me: Apr 30 to May 14', 'Ve: Mar 25 to Apr 19'],
  1: ['Su: May 15 to Jun 15', 'Ma: Jun 20 to Aug 2', 'Me: May 14 to May 29', 'Ve: Apr 19 to May 14'],
  11: ['Su: Mar 14 to Apr 14', 'Ma: Apr 2 to May 11', 'Me: Apr 10 to Apr 30', 'Ve: Mar 1 to Mar 25', 'Sa entire year'],
  10: ['Su: Feb 12 to Mar 14', 'Ma: Feb 23 to Apr 2', 'Me: Feb 3 to Apr 10', 'Ve: Feb 5 to Mar 1', 'RaR: Jan 1 to Dec 5'],
  9: ['Su: Jan 14 to Feb 12', 'Ma: Jan 15 to Feb 23', 'Me: Jan 17 to Feb 3', 'Ve: Jan 12 to Feb 5', 'RaR: Dec 5 to Dec 31'],
  2: ['Su: Jun 15 to Jul 16', 'Ma: Aug 2 to Sep 18', 'Me: May 29 to Jun 22', 'MeR: Jul 7 to (D) Aug 5', 'Ju: Jan 1 to Jun 1', 'Ve: May 14 to Jun 8'],
  3: ['Su: Jul 16 to Aug 17', 'Ma: Sep 18 to Nov 12', 'Me: Jun 22 to Jul 7', 'Me: Aug 5 to Aug 22', 'Ju: Jun 1 to Oct 31', 'Ve: Jun 8 to Jul 4', 'KeR: Dec 5 to Dec 31'],
  5: ['Su: Sep 17 to Oct 17', 'Me: Sep 7 to Sep 26', 'Ve: Aug 1 to Sep 2', 'VeR: Nov 5 to (D) Nov 22'],
  6: ['Su: Oct 17 to Nov 16', 'Me: Sep 26 to Dec 2', 'Ve: Sep 2 to Nov 5', 'Ve: Nov 22 to Dec 31'],
  7: ['Su: Nov 16 to Dec 16', 'Me: Dec 2 to Dec 22'],
  8: ['Su: Jan 1 to Jan 14', 'Su: Dec 16 to Dec 31', 'Ma: Jan 1 to Jan 15', 'Me: Jan 1 to Jan 17', 'Me: Dec 22 to Dec 31', 'Ve: Jan 1 to Jan 12'],
};
for (const [sign, expected] of Object.entries(screen)) {
  assert.deepStrictEqual(lines(Number(sign)).sort(), [...expected].sort(), `sign ${sign}`);
}
// Leo: PL9 prints Jupiter 31 Oct to 26 Nov and then no further entry; the ephemeris keeps Jupiter in Leo to the end of the year
// (it turns retrograde on about 11 Nov inside Leo). The other five Leo lines agree.
const leo = lines(4);
for (const l of ['Su: Aug 17 to Sep 17', 'Ma: Nov 12 to Dec 31', 'Me: Aug 22 to Sep 7', 'Ve: Jul 4 to Aug 1', 'KeR: Jan 1 to Dec 5']) assert.ok(leo.includes(l), l);
assert.ok(leo.includes('Ju: Oct 31 to Dec 31'));

// marking every planet shows Jupiter retrograde on 1 January 2026 (it turned direct in March), which PL9 does not print
const jupGemStay = t.bySign[2].find((s) => s.planet === 'Jupiter');
assert.strictEqual(Y.stayLine(jupGemStay, dayOf), 'JuR: Jan 1 to (D) Jun 1');
assert.strictEqual(dayOf(jupGemStay.stations[0].jd).slice(0, 3), 'Mar');
// the stations stay available inside the stays PL9 does not mark: Mercury in Aquarius, direct to start, turns retrograde and direct again
const merAqu = t.bySign[10].find((s) => s.planet === 'Mercury');
assert.deepStrictEqual(merAqu.stations.map((x) => x.kind), ['RETROGRADE', 'DIRECT']);
assert.strictEqual(merAqu.retrogradeAtStart, false);
assert.strictEqual(merAqu.turnsDirect, false);
// Mercury in Gemini: starts retrograde, turns direct on 23 July UT (24 July IST; the (D) marker), and the stay ends on 5 August
const merGem = t.bySign[2].find((s) => s.planet === 'Mercury' && s.retrogradeAtStart);
assert.strictEqual(dayOf(merGem.stations[0].jd), 'Jul 23');

// every planet's stays tile the year exactly
for (const p of Y.PLANETS) {
  const all = t.bySign.flat().filter((s) => s.planet === p).sort((a, b) => a.startJd - b.startJd);
  assert.strictEqual(all[0].startJd, t.yearStartJd);
  for (let i = 1; i < all.length; i += 1) assert.ok(Math.abs(all[i].startJd - all[i - 1].endJd) < 1e-9, `${p} gap`);
  assert.strictEqual(all[all.length - 1].endJd, t.yearEndJd);
}
// a local offset moves a stay's edge to the local day: the Sun's Pisces ingress is 14 March 19:33 UT = 15 March 01:03 IST
const ist = Y.yearlyTransit({ year: 2026, utcOffsetMinutes: 330 });
assert.strictEqual(jdToLocal(ist.bySign[11].find((s) => s.planet === 'Sun').startJd, 330).slice(0, 10), '2026-03-15');
console.log('test-yearly-transit ok');
