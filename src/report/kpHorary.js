/**
 * Krishnamurti Paddhati horary (prasna) as K.S. Krishnamurti sets it out in "Horary Astrology: Krishnamurti Padhdhati, Advanced Stellar System" (Reader VI; corpus C34,
 * printed page = PDF page - 19), read on the text layer and the page images 2026-10-26:
 *
 *  - the querist gives a number from 1 to 249; each number is one of the 249 subs of the zodiac (the 243 subs of the 27 stars, with the three that straddle a sign
 *    boundary cut at it); "every number refers to a particular sign, star and sub as the Ascendant. One has to take only the commencing position of the sub as Ascendant"
 *    (printed p.88);
 *  - "We must take only the time of judgment" (printed p.87), in standard time: no local mean time or sidereal time is needed for the ascendant, because the number fixes it;
 *    "having this as Ascendant, one is to calculate the other 11 cusps for the latitude of the place of judgment" (printed p.88): the cusps are those of the moment at which that
 *    ascendant rises at the place, so the house table is entered with the ascendant's own sidereal time; the planets are those of the time of judgment (Placidus houses, the
 *    Krishnamurti ayanamsha, as in kpSystem.js);
 *  - ruling planets (printed p.123): the day lord, the lord of the sign and of the star in which the Moon stands, the lord of the sign and of the star in which the Ascendant rises;
 *    Rahu and Kethu stand for the lord of the sign they occupy and are counted when they stand in a sign of a ruling planet; "those deposited in the constellation of a retrograde
 *    planet should be rejected".
 * No answer is given: the page shows the chart, the ruling planets, the significators and, for a question the book names houses for, whether those houses are signified.
 */
const { julianDay, calculateHouses, getAyanamsa, setSiderealMode, SiderealMode, HouseSystem } = require('@swisseph/node');
const { calculateKpSystem, kpChain, houseForLongitude, planetSignificators } = require('./kpSystem');
const { kpLords } = require('./nadiCombinations');

const norm = (x) => ((x % 360) + 360) % 360;
const wrap = (x) => ((x + 540) % 360) - 180;

const SOURCE = {
  title: 'Krishnamurti Padhdhati, Reader VI: Horary Astrology',
  author: 'K.S. Krishnamurti',
  tradition: 'Krishnamurti Paddhati (KP)',
  file: 'C34_KP_Reader_VI_Horary_KSK.pdf',
  pageLocus: 'Erection of horary horoscope printed pp.87-88; the table of the 249 subs printed pp.89-106; ruling planets printed pp.123-124 (PDF page = printed + 19)',
};

/** The 249 subs: { number, sign (0-11), signLord, starLord, subLord, from, to } with the longitudes sidereal. */
function subTable() {
  const cuts = new Set([0]);
  const star = 360 / 27;
  for (let n = 0; n < 27; n += 1) {
    let start = n * star;
    let index = n % 9;
    const order = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
    const years = { Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 };
    for (let k = 0; k < 9; k += 1) {
      cuts.add(Math.round(start * 1e9) / 1e9);
      start += star * years[order[(index + k) % 9]] / 120;
    }
  }
  for (let s = 0; s < 12; s += 1) cuts.add(s * 30);
  const pts = [...cuts].sort((a, b) => a - b);
  const rows = [];
  for (let i = 0; i < pts.length; i += 1) {
    const from = pts[i];
    const to = i + 1 < pts.length ? pts[i + 1] : 360;
    if (to - from < 1e-6) continue;
    const mid = (from + to) / 2;
    const [signLord, starLord, subLord] = kpLords(mid);
    rows.push({ number: rows.length + 1, sign: Math.floor(mid / 30), signLord, starLord, subLord, from, to });
  }
  return rows;
}
const TABLE = subTable();

/** The sidereal ascendant (the start of the sub) for a querist's number. */
function ascendantOfNumber(number) {
  if (!Number.isInteger(number) || number < 1 || number > 249) throw new RangeError('the number must be a whole number from 1 to 249');
  return TABLE[number - 1].from;
}

/** A Julian day (UT) near `jdNear` at which the sidereal (Krishnamurti) ascendant at the place is `ascendant`, by sampling and bisection. */
function instantOfAscendant(ascendant, latitude, longitude, jdNear) {
  setSiderealMode(SiderealMode.Krishnamurti);
  const asc = (jd) => norm(calculateHouses(jd, latitude, longitude, HouseSystem.Placidus).ascendant - getAyanamsa(jd));
  const f = (jd) => wrap(asc(jd) - ascendant);
  let prev = jdNear - 0.5;
  let fPrev = f(prev);
  for (let i = 1; i <= 96; i += 1) {
    const t = jdNear - 0.5 + i / 96;
    const ft = f(t);
    if (fPrev < 0 && ft >= 0 && Math.abs(fPrev - ft) < 90) {
      let lo = prev;
      let hi = t;
      for (let k = 0; k < 50; k += 1) {
        const mid = (lo + hi) / 2;
        if (f(mid) < 0) lo = mid; else hi = mid;
      }
      return (lo + hi) / 2;
    }
    prev = t; fPrev = ft;
  }
  throw new Error('no instant found for this ascendant at the place');
}

/** The twelve Placidus cusps (sidereal, 1-indexed) for the horary ascendant at the place. */
function horaryCusps(ascendant, latitude, longitude, jdNear) {
  const jd = instantOfAscendant(ascendant, latitude, longitude, jdNear);
  setSiderealMode(SiderealMode.Krishnamurti);
  const h = calculateHouses(jd, latitude, longitude, HouseSystem.Placidus);
  const ay = getAyanamsa(jd);
  const cusps = h.cusps.map((c, i) => (i === 0 ? c : norm(c - ay)));
  cusps[1] = ascendant; // exactly the number's own, whatever the rounding of the search
  return cusps;
}

const NODES = ['Rahu', 'Ketu'];
/**
 * The ruling planets of the moment (printed p.123) from a horary KP chart: the day lord, the Moon's sign lord and star lord, the Ascendant's sign lord and star lord; a node is
 * added when it stands in a sign of one of them (it acts for that sign's lord) and, for a node that is itself a ruling planet's sign-owner position, as the book says; those
 * standing in the star of a retrograde planet are marked, as "should be rejected".
 */
function horaryRulingPlanets(kp) {
  const byName = Object.fromEntries(kp.positions.map((p) => [p.name, p]));
  const factors = kp.rulingPlanets.factors; // Day Lord, Moon Sign Lord, Moon Star Lord, Asc Sign Lord, Asc Star Lord
  const base = [...new Set(factors.map(([, lord]) => lord))];
  const added = [];
  for (const node of NODES) {
    const signLord = byName[node].signLord;
    if (base.includes(signLord) && !base.includes(node)) added.push({ node, forLord: signLord });
  }
  const all = [...base, ...added.map((a) => a.node)];
  const rows = all.map((name) => {
    const p = byName[name];
    const starLord = p ? p.starLord : null;
    const star = starLord ? byName[starLord] : null;
    return { planet: name, retrograde: Boolean(p && p.retrograde && !NODES.includes(name)), inRetrogradeStar: Boolean(star && star.retrograde && !NODES.includes(starLord)), starLord };
  });
  return { factors, planets: rows, nodesAdded: added };
}

/**
 * The horary chart.
 * @param q { number 1-249, year, month, day, hour, minute, second?, utcOffsetMinutes, latitude, longitude, placeName? } the moment of judgment and its place
 */
function horaryChart(q) {
  const sub = TABLE[q.number - 1] ?? (() => { throw new RangeError('the number must be a whole number from 1 to 249'); })();
  const jdNear = julianDay(q.year, q.month, q.day, q.hour + (q.minute || 0) / 60 + (q.second || 0) / 3600 - (q.utcOffsetMinutes || 0) / 60);
  const cusps = horaryCusps(sub.from, q.latitude, q.longitude, jdNear);
  const kp = calculateKpSystem({ year: q.year, month: q.month, day: q.day, hour: q.hour, minute: q.minute || 0, second: q.second || 0, latitude: q.latitude, longitude: q.longitude, utcOffsetMinutes: q.utcOffsetMinutes || 0 }, { cuspsSidereal: cusps });
  return { number: q.number, sub, kp, ruling: horaryRulingPlanets(kp) };
}

module.exports = { subTable, TABLE, ascendantOfNumber, instantOfAscendant, horaryCusps, horaryChart, horaryRulingPlanets, SOURCE, kpChain, houseForLongitude, planetSignificators };
