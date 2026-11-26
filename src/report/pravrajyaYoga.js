/**
 * The yogas that lead to asceticism, BPHS ch.79 (Santhanam, vol.2, printed pp.948-952; fixture fixtures/yogas/bphs-79.json).
 *
 * Read from the chart: four or more of the seven planets in one house (v.2-3), the lord of the Moon's sign aspecting Saturn with no aspect on himself (v.6) or aspected
 * only by Saturn (v.7), the Moon in Saturn's decanate or the Navamsha of Saturn or Mars with Saturn's aspect (v.8), Saturn aspecting Jupiter, the Moon and the Lagna with
 * Jupiter in the 9th (v.14), Saturn alone in the 9th without any aspect (v.15), and the planetary wars of the chart (v.9, planetaryWar.js). The planets' strength,
 * combustion, whether a Rajayoga is present and which planet leads are not checked, so the order the book names is given for each planet that could lead and none is chosen.
 * Aspects are BPHS ch.26's full aspects counted by signs: the 7th for every planet, the 4th and 8th for Mars, the 5th and 9th for Jupiter, the 3rd and 10th for Saturn.
 */
const { navamshaSign } = require('./specialPoints');
const N = require('../sources/tamilNames');

const DATA = require('../../fixtures/yogas/bphs-79.json');

const PLANETS = Object.freeze(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']);
const ASPECTS = Object.freeze({ Sun: [7], Moon: [7], Mercury: [7], Venus: [7], Mars: [4, 7, 8], Jupiter: [5, 7, 9], Saturn: [3, 7, 10] });
const SIGN_LORD = Object.freeze(['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter']);
const byId = Object.freeze(Object.fromEntries(DATA.rules.map((r) => [r.id, r])));

/** The house (1 to 12) of sign `to` counted from sign `from`. */
const houseFrom = (from, to) => ((to - from + 12) % 12) + 1;
/** Whether `planet`, standing in sign `from`, aspects the sign `to`. */
const aspects = (planet, from, to) => ASPECTS[planet].includes(houseFrom(from, to));
/** The planets (of the seven) that aspect sign `to`, other than `except`. */
const aspectors = (signs, to, except) => PLANETS.filter((p) => p !== except && aspects(p, signs[p], to));
/** The Parashari decanate sign: the sign itself, its 5th or its 9th for the first, second or third ten degrees. */
const drekkanaSign = (longitude) => {
  const lon = ((longitude % 360) + 360) % 360;
  const sign = Math.floor(lon / 30);
  return (sign + 4 * Math.floor((lon % 30) / 10)) % 12;
};
const ta = (p) => N.PLANET_TA[p] ?? p;
const list = (ps) => ps.map(ta).join(', ');

/**
 * Each rule read against `facts` = { signs, lagnaSign, moonLongitude, wars: [[a, b, winner]] }:
 * { id, status: 'held' | 'not-held' | 'unknown' | 'not-checked', detail, orders? }, `orders` the planets whose order the rule names.
 */
function evaluate(f) {
  const out = [];
  const put = (id, status, detail, orders) => out.push({ id, status, detail, ...(orders ? { orders } : {}) });
  const { signs } = f;
  const moonSign = signs.Moon;
  const lord = SIGN_LORD[moonSign];

  // v.2-3: four or more of the seven in one house; the strength that makes the yoga is not checked
  const groups = {};
  for (const p of PLANETS) (groups[signs[p]] ??= []).push(p);
  const crowd = Object.entries(groups).filter(([, ps]) => ps.length >= 4).map(([s, ps]) => ({ sign: Number(s), planets: ps }));
  if (crowd.length) {
    put('STELLIUM', 'unknown', crowd.map((c) => `${N.RASI_TA[c.sign]} (லக்னத்திலிருந்து ${houseFrom(f.lagnaSign, c.sign)}-ஆம் வீடு): ${list(c.planets)} — ${c.planets.length} கிரகங்கள்; பலம் சோதிக்கப்படவில்லை.`).join(' '), crowd.flatMap((c) => c.planets));
  } else {
    const most = Math.max(...Object.values(groups).map((ps) => ps.length));
    put('STELLIUM', 'not-held', `ஒரே வீட்டில் அதிகபட்சம் ${most} கிரகங்கள்.`);
  }

  put('COMBUST', 'not-checked', byId.COMBUST.reason);

  // v.6: the lord of the Moon's sign, with no aspect on himself, aspects Saturn
  const onLord = aspectors(signs, signs[lord], lord);
  if (lord === 'Saturn') put('MOON_LORD_ASPECTS_SATURN', 'not-held', `சந்திரனின் ராசி அதிபதி சனியே (${N.RASI_TA[moonSign]}).`);
  else if (!onLord.length && aspects(lord, signs[lord], signs.Saturn)) put('MOON_LORD_ASPECTS_SATURN', 'held', `${N.RASI_TA[moonSign]} ராசி அதிபதி ${ta(lord)} மற்ற கிரகப் பார்வை இன்றி சனியைப் பார்க்கிறார்; இருவரில் பலமுள்ளவரின் நெறி (பலம் சோதிக்கப்படவில்லை).`, [lord, 'Saturn']);
  else put('MOON_LORD_ASPECTS_SATURN', 'not-held', `${ta(lord)} மீது பார்வை: ${onLord.length ? list(onLord) : 'இல்லை'}; சனியைப் பார்க்கிறாரா: ${aspects(lord, signs[lord], signs.Saturn) ? 'ஆம்' : 'இல்லை'}.`);

  // v.7: the lord aspected by Saturn alone (his lack of strength is not checked)
  const only = onLord.length === 1 && onLord[0] === 'Saturn';
  put('MOON_LORD_WEAK', only ? 'unknown' : 'not-held', only ? `${ta(lord)} சனியால் மட்டுமே பார்க்கப்படுகிறார்; அவர் பலமற்றவரா என்பது சோதிக்கப்படவில்லை.` : `${ta(lord)} மீது பார்வை: ${onLord.length ? list(onLord) : 'இல்லை'}.`, only ? ['Saturn'] : undefined);

  // v.8: the Moon in Saturn's decanate or the Navamsha of Saturn or Mars, and aspected by Saturn
  const dre = SIGN_LORD[drekkanaSign(f.moonLongitude)];
  const nav = SIGN_LORD[navamshaSign(f.moonLongitude)];
  const placed = dre === 'Saturn' || nav === 'Saturn' || nav === 'Mars';
  const seen = aspects('Saturn', signs.Saturn, moonSign);
  put('MOON_SATURN_DIV', placed && seen ? 'held' : 'not-held',
    `சந்திரனின் திரேக்காணம்: ${ta(dre)}; நவாம்சம்: ${ta(nav)}; சனியின் பார்வை சந்திரன் மீது: ${seen ? 'உண்டு' : 'இல்லை'}.`, placed && seen ? ['Saturn'] : undefined);

  // v.9: the planetary wars (Mars to Saturn within a degree)
  put('WAR', f.wars.length ? 'unknown' : 'not-held', f.wars.length ? f.wars.map(([a, b, w]) => `${ta(a)}-${ta(b)} யுத்தம்: ${ta(w)} வெல்கிறார்.`).join(' ') : 'ஜாதகத்தில் ஒரு பாகைக்குள் இரு கிரகங்கள் இல்லை; யுத்தம் இல்லை.');
  put('ORDER_BY_DASHA', 'not-checked', byId.ORDER_BY_DASHA.reason);

  // v.14: Saturn aspects Jupiter, the Moon and the Lagna; Jupiter in the 9th
  const saturnSees = ['Jupiter', 'Moon'].every((p) => aspects('Saturn', signs.Saturn, signs[p])) && aspects('Saturn', signs.Saturn, f.lagnaSign);
  const jupiterNinth = houseFrom(f.lagnaSign, signs.Jupiter) === 9;
  put('JUPITER_NINTH', saturnSees && jupiterNinth ? 'held' : 'not-held',
    `சனியின் பார்வை குரு, சந்திரன், லக்னம் மூன்றின் மீதும்: ${saturnSees ? 'உண்டு' : 'இல்லை'}; குரு லக்னத்திலிருந்து ${houseFrom(f.lagnaSign, signs.Jupiter)}-ஆம் வீட்டில்.${saturnSees && jupiterNinth ? ' ராஜயோகம் உள்ளதா என்பது சோதிக்கப்படவில்லை.' : ''}`);

  // v.15: Saturn in the 9th with no aspect from any planet
  const onSaturn = aspectors(signs, signs.Saturn, 'Saturn');
  const saturnNinth = houseFrom(f.lagnaSign, signs.Saturn) === 9;
  put('SATURN_NINTH', saturnNinth && !onSaturn.length ? 'held' : 'not-held',
    `சனி லக்னத்திலிருந்து ${houseFrom(f.lagnaSign, signs.Saturn)}-ஆம் வீட்டில்; அவர் மீது பார்வை: ${onSaturn.length ? list(onSaturn) : 'இல்லை'}.${saturnNinth && !onSaturn.length ? ' ராஜயோகம் உள்ளதா என்பது சோதிக்கப்படவில்லை.' : ''}`);
  return out;
}

module.exports = { DATA, byId, PLANETS, aspects, aspectors, drekkanaSign, houseFrom, evaluate };
