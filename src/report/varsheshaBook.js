/**
 * The Varshapati (year lord) as Tajika Bhushana selects him (Ganesha Daivajna; corpus C28), chapter 1, printed pp.4-10 (printed = PDF - 4), read on the
 * page images 2026-10-26 (docs/TAJIKA-BHUSHANA-NOTES.md).
 *
 *   v.34  the five office-holders (pancha-adhikari): the lord of the janma lagna, the lord of the varsha lagna, the Munthesha, the lord of the sign of the
 *         Sun by day or of the Moon by night, and the Trirashi lord (the table on printed p.4, by the varsha lagna's sign, day or night).
 *   v.35  of these the planet endowed with strength that also aspects the varsha lagna fully is the Varshapati.
 *   v.36  if the aspects are equal the stronger; if the strengths are equal the one that aspects more; if both are equal the one with more offices;
 *         if everything is equal the Munthesha.
 *   v.37  if none aspects the varsha lagna, the one that aspects the varsha lagna's sign in the birth chart; if none, the Munthesha.
 *   v.14  how much a planet aspects: the 3rd and 11th from it a quarter, the 4th and 10th a half, the 5th and 9th three quarters, its own sign and the 7th full.
 *
 * What the book leaves open, and what is done here:
 *  - "strength" (bala): the five-fold Pancha-Vargeeya scheme of printed pp.5-9, as `panchaVargeeyaBook.js` reads it, is the default figure (`strengthMethod: 'BOOK'` in
 *    varshaphala.js); the app's `panchaVargeeyaBala` (after Rao's "Vedic Astrology: An Integrated Approach") differs in the friend's share, the drekkana lords and the
 *    Virgo hadda, and can be chosen with `strengthMethod: 'APP'`. Only the `strength` function changes.
 *  - "equal" aspects or strengths: equal to two decimals.
 *  - when one planet has the greater aspect and another the greater strength the verses do not say which governs. v.36 is built as "among those of equal
 *    aspect the stronger; where the strengths are equal, the one that aspects more", so the aspect level is taken first; `aspectAndStrengthLeadersDiffer` reports
 *    that the two leaders are different planets, so the page can say so.
 *  - the commentary on v.34 says "lagna lord of the Sun" by day; the verse says "lord of the Sun" (arkesha). The sign of the Sun is used, as before.
 */

const SOURCE = {
  title: 'Tajika Bhushana',
  author: 'Ganesha Daivajna',
  tradition: 'Tajika (Varshaphala)',
  file: 'C28_Tajika_Bhushana_Ganesha.pdf',
  pageLocus: 'Chapter 1 (Varshesha-nayana), printed pp.4-10: v.14 aspects, v.34-37 the five office-holders and the selection',
};

/** printed p.4: the Trirashi lords by the varsha lagna's sign, Aries..Pisces. Cancer by day is Venus (the app's older table has the Moon). */
const TRIRASHI_DAY = ['Sun', 'Venus', 'Saturn', 'Venus', 'Jupiter', 'Moon', 'Mercury', 'Mars', 'Saturn', 'Mars', 'Jupiter', 'Moon'];
const TRIRASHI_NIGHT = ['Jupiter', 'Moon', 'Mercury', 'Mars', 'Sun', 'Venus', 'Saturn', 'Venus', 'Saturn', 'Mars', 'Jupiter', 'Moon'];

/** v.14: the house counted from the planet to the aspected point -> the share of the glance. */
const ASPECT_SHARE = { 1: 1, 3: 0.25, 4: 0.5, 5: 0.75, 7: 1, 9: 0.75, 10: 0.5, 11: 0.25 };
const aspectShare = (fromSign, toSign) => ASPECT_SHARE[((toSign - fromSign + 12) % 12) + 1] ?? 0;

const ROLE_TA = {
  janmaLagnaLord: 'ஜன்ம லக்னாதிபதி', varshaLagnaLord: 'வர்ஷ லக்னாதிபதி', munthesha: 'முந்தேசன்', luminarySignLord: 'பகல்: சூரிய ராசி அதிபதி / இரவு: சந்திர ராசி அதிபதி', trirashiLord: 'திரிராசி அதிபதி',
};
const round2 = (x) => Math.round(x * 100) / 100;

/**
 * @param f {
 *   isDay, varshaLagnaSign, janmaLagnaSign, munthaSign,
 *   varshaSigns: {planet: sign}, varshaSunSign, varshaMoonSign,
 *   birthSigns: {planet: sign},   // the birth chart, for v.37
 *   lordOfSign: (sign)=>planet, strength: (planet)=>number
 * }
 */
function selectVarsheshaBook(f) {
  const roles = {
    janmaLagnaLord: f.lordOfSign(f.janmaLagnaSign),
    varshaLagnaLord: f.lordOfSign(f.varshaLagnaSign),
    munthesha: f.lordOfSign(f.munthaSign),
    luminarySignLord: f.lordOfSign(f.isDay ? f.varshaSunSign : f.varshaMoonSign),
    trirashiLord: (f.isDay ? TRIRASHI_DAY : TRIRASHI_NIGHT)[f.varshaLagnaSign],
  };
  const planets = [...new Set(Object.values(roles))];
  const rows = planets.map((p) => ({
    planet: p,
    offices: Object.keys(roles).filter((k) => roles[k] === p),
    aspect: aspectShare(f.varshaSigns[p], f.varshaLagnaSign),
    birthAspect: aspectShare(f.birthSigns[p], f.varshaLagnaSign),
    strength: round2(f.strength(p)),
  }));
  const top = (key, list) => Math.max(...list.map((r) => r[key]));
  const leaders = (key, list) => list.filter((r) => r[key] === top(key, list));
  const result = (planet, rule, extra = {}) => ({ source: SOURCE, planet, rule, roles, rows, ...extra });

  const maxAspect = top('aspect', rows);
  let pool = rows;
  let usedBirth = false;
  if (maxAspect === 0) {
    // v.37: no one aspects the varsha lagna: the one that aspects its sign in the birth chart
    const byBirth = rows.filter((r) => r.birthAspect > 0);
    if (byBirth.length === 0) return result(roles.munthesha, 'V37_MUNTHESHA', { note: 'எந்த அதிகாரியும் வர்ஷ லக்னத்தையோ ஜன்மத்தில் அதன் ராசியையோ பார்க்கவில்லை; நூல்: முந்தேசன் (பா.37).' });
    pool = byBirth.map((r) => ({ ...r, aspect: r.birthAspect }));
    usedBirth = true;
  }
  // v.35-36, read as the verse is built: among those with the same (best) aspect on the lagna, the stronger; and where the strengths are equal, the one that
  // aspects more. That is the order aspect first, then strength; then the number of offices; then the Munthesha.
  const bestAspect = top('aspect', pool);
  const level = pool.filter((r) => r.aspect === bestAspect);
  const bestStrength = top('strength', level);
  const strongest = level.filter((r) => r.strength === bestStrength);
  // the verses do not say what to do when one planet aspects more and another is stronger; the aspect level is taken first and the difference is reported
  const strengthLeaders = leaders('strength', pool).map((r) => r.planet);
  const differs = !strongest.some((r) => strengthLeaders.includes(r.planet));
  const extra = { usedBirthAspect: usedBirth, aspectLeaders: level.map((r) => r.planet), strengthLeaders, aspectAndStrengthLeadersDiffer: differs };
  if (strongest.length === 1) {
    const d = strongest[0];
    const full = d.aspect === 1;
    return result(d.planet, usedBirth ? 'V37_BIRTH_ASPECT' : (full ? 'V35_FULL_ASPECT_AND_STRENGTH' : 'V36_BEST_ASPECT_THEN_STRENGTH'), { ...extra, fullAspect: full });
  }
  // equal in aspect and strength: the one with more offices; all equal: the Munthesha
  const most = Math.max(...strongest.map((r) => r.offices.length));
  const byOffices = strongest.filter((r) => r.offices.length === most);
  if (byOffices.length === 1) return result(byOffices[0].planet, 'V36_MOST_OFFICES', extra);
  const m = byOffices.find((r) => r.planet === roles.munthesha);
  return result(m ? m.planet : roles.munthesha, 'V36_ALL_EQUAL_MUNTHESHA', { ...extra, tied: byOffices.map((r) => r.planet) });
}

module.exports = { selectVarsheshaBook, aspectShare, SOURCE, ROLE_TA, TRIRASHI_DAY, TRIRASHI_NIGHT, ASPECT_SHARE };
