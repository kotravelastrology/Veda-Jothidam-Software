/**
 * The monthly entry (masa-pravesha) of the annual chart, from Tajika Bhushana (Ganesha Daivajna; corpus C28), the last chapter, printed pp.90-96
 * (printed = PDF - 4). Read on the page images 2026-10-26 (docs/TAJIKA-BHUSHANA-NOTES.md).
 *
 * v.2: the entry of month k (k = 0..11; month 0 is the varsha entry itself) is the instant the Sun is at the birth Sun plus k signs; v.4: the chart of
 * that instant is cast at the place; v.5: the month lord is the stronger of the lord of the navamsha of the lagna lord and the lord of the navamsha of
 * the lagna; v.6-12: the month lord's results; v.13: those results are for a strong lord, the rest by inference.
 *
 * The book does not say how the "stronger" of the two is decided, so the module reports both candidates with their Pancha-Vargeeya figures and marks
 * the larger as `leading`; it does not pick one when the figures are equal. The results are shown for the leading candidate and, when the two
 * candidates differ, for the other as well. No month is called good or bad.
 */
const { calculateChart } = require('../ephemeris/swissEphemeris');
const { calculateParashariChart } = require('../chart/parashariChart');
const { panchaVargeeyaBala, d9Rashi } = require('./panchaVargeeyaBala');
const { panchaVargeeyaBook } = require('./panchaVargeeyaBook');
const T = require('./varshaInterpretationTables');
const { RASI_TA: SIGN_TA } = require('../sources/tamilNames');

const RASI_LORDS = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
const PLANET_TA = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' };
const MS_DAY = 86400000;
const norm = (x) => ((x % 360) + 360) % 360;
const wrap = (a, b) => ((((a - b + 180) % 360) + 360) % 360) - 180;

const SOURCE = {
  title: 'Tajika Bhushana',
  author: 'Ganesha Daivajna',
  tradition: 'Tajika (Varshaphala)',
  file: 'C28_Tajika_Bhushana_Ganesha.pdf',
  pageLocus: 'Last chapter (Masa-pravesha), printed pp.90-96: the monthly entry, the month lord and its results, the daily entry and food rules',
};

function sunLon(ms) {
  const d = new Date(ms);
  const c = calculateChart({ year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(), hour: d.getUTCHours(), minute: d.getUTCMinutes(), second: d.getUTCSeconds(), latitude: 0, longitude: 0, utcOffsetMinutes: 0 });
  return norm(c.positions.Sun.longitude);
}

/** The UTC ms at which the Sun's sidereal longitude is `target`, near `guessMs` (the Sun moves about 1 degree a day). */
function whenSunAt(target, guessMs) {
  let lo = guessMs - 16 * MS_DAY;
  let hi = guessMs + 16 * MS_DAY;
  const f = (ms) => wrap(sunLon(ms), target);
  if (f(lo) > 0) lo -= 20 * MS_DAY;
  if (f(hi) < 0) hi += 20 * MS_DAY;
  for (let i = 0; i < 40; i += 1) {
    const mid = (lo + hi) / 2;
    if (f(mid) < 0) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * @param birthInput  the chart-context input of the birth (year .. utcOffsetMinutes, latitude, longitude)
 * @param varsha      the object calculateVarshaphala returns (for the year's solar return)
 * @returns { source, months: [{index, utcMs, local, sunSign, lagnaSign, candidates, monthLord, results}], method, strength, notApplied }
 */
function masaPravesha(birthInput, varsha) {
  const natal = calculateParashariChart({ input: birthInput, ayanamsha: 'Lahiri', houseSystem: 'Placidus' });
  const natalSun = natal.grahas.Sun.longitude;
  const offset = birthInput.utcOffsetMinutes ?? 0;
  const returnMs = Date.UTC(Number(varsha.solarReturn.date.slice(0, 4)), Number(varsha.solarReturn.date.slice(5, 7)) - 1, Number(varsha.solarReturn.date.slice(8, 10)),
    Number(varsha.solarReturn.time.slice(0, 2)), Number(varsha.solarReturn.time.slice(3, 5))) - 330 * 60000; // the varsha result's clock is IST
  const months = [];
  for (let k = 0; k < 12; k += 1) {
    const target = norm(natalSun + 30 * k);
    const ms = k === 0 ? returnMs : whenSunAt(target, returnMs + k * 30.44 * MS_DAY);
    const d = new Date(ms + offset * 60000);
    const p = (n) => String(n).padStart(2, '0');
    const chart = calculateParashariChart({
      input: { ...birthInput, year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(), hour: d.getUTCHours(), minute: d.getUTCMinutes(), second: d.getUTCSeconds() },
      ayanamsha: 'Lahiri', houseSystem: 'Placidus',
    });
    const lagnaSign = chart.lagna.rasiIndex;
    const lagnaLord = RASI_LORDS[lagnaSign];
    const lordOfLagnaNavamsha = RASI_LORDS[d9Rashi(chart.lagna.longitude)];
    const lordOfLagnaLordNavamsha = RASI_LORDS[d9Rashi(chart.grahas[lagnaLord].longitude)];
    const cand = (planet, how) => ({ planet, planetTa: PLANET_TA[planet], how, pvb: panchaVargeeyaBook(planet, chart.grahas[planet].longitude).total, pvbApp: panchaVargeeyaBala(planet, chart.grahas[planet].longitude) });
    const candidates = [cand(lordOfLagnaLordNavamsha, 'லக்னாதிபதியின் நவாம்ச அதிபதி'), cand(lordOfLagnaNavamsha, 'லக்னத்தின் நவாம்ச அதிபதி')];
    const same = candidates[0].planet === candidates[1].planet;
    const leading = same ? candidates[0].planet : candidates[0].pvb === candidates[1].pvb ? null : (candidates[0].pvb > candidates[1].pvb ? candidates[0].planet : candidates[1].planet);
    const shown = same ? [candidates[0].planet] : [...new Set(candidates.map((c) => c.planet))];
    months.push({
      index: k, utcMs: ms, local: `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`,
      sunLongitude: sunLon(ms), sunSign: Math.floor(sunLon(ms) / 30), sunSignTa: SIGN_TA[Math.floor(sunLon(ms) / 30)],
      lagnaSign, lagnaSignTa: SIGN_TA[lagnaSign], lagnaLord, lagnaLordTa: PLANET_TA[lagnaLord],
      candidates, sameCandidate: same, leading,
      results: shown.map((pl) => ({ planet: pl, planetTa: PLANET_TA[pl], leading: pl === leading, ...T.masaPravesha.masaLordPhala[pl] })),
    });
  }
  return {
    source: SOURCE, months,
    method: T.masaPravesha.method, lagnaRule: T.masaPravesha.lagna, lordRule: T.masaPravesha.masaLord, strength: T.masaPravesha.strength,
    daily: T.masaPravesha.daily, food: T.masaPravesha.food,
    notApplied: T.masaPravesha.notRead,
  };
}

module.exports = { masaPravesha, SOURCE, whenSunAt, sunLon };
