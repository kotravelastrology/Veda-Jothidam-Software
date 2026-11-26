/**
 * "Today for you": the facts of one chart on one day, gathered from the engines the program already has and nothing new:
 *
 *  - the running dasha, bhukti and antara of the Vimshottari (src/dasha/dashaDrill.js, BPHS ch.46 and 51), each with its dates and how
 *    much of it has passed;
 *  - the Moon of the day: its star and quarter, the star's count from the birth star (1 to 27), the tara that count falls in with the
 *    names and the result Pulippani gives it (nakshatraGocharaTables.js, TARAS), and the Moon's house from the birth Moon;
 *  - Saturn: his sign, his house from the birth Moon, and the Sade Sati phase when he stands in the 12th, 1st or 2nd from it
 *    (saturnTransit.js, saturnStateAt, with its table of phases);
 *  - Jupiter: his sign and his house from the birth Moon.
 *
 * These are states, not verdicts: nothing here says that the day is good or bad, and where a book's word for a state is shown (a tara's
 * result, a Sade Sati phase) it is shown as that book's. Every line links to the page that gives the whole reading with its sources.
 * Pure but for the ephemeris reads of saturnStateAt and planetLongitude, which the caller runs inside one isolated ephemeris session
 * (src/ephemeris/isolation.js) with the chart's ayanamsha.
 */
const { chainAt, localText } = require('../dasha/dashaDrill');
const { saturnStateAt } = require('./saturnTransit');
const { planetLongitude } = require('../ephemeris/siderealPositions');
const GT = require('./nakshatraGocharaTables');
const ST = require('./saturnTransitTables');
const { NAKSHATRA_TA, RASI_TA, PLANET_TA, DASHA_LEVEL_TA } = require('../sources/tamilNames');

const DAY_MS = 86400000;
const JD_UNIX_EPOCH = 2440587.5;
const STAR = 360 / 27;
const norm360 = (d) => ((d % 360) + 360) % 360;

/** The house (1-12) of sign `sign` counted from sign `from`. */
const houseFrom = (sign, from) => ((sign - from + 12) % 12) + 1;

/**
 * The running periods at `atMs`, `levels` deep (dasha, bhukti, antara).
 * @param mahadashas the nine mahadashas as computeDashaTimeline returns them: { lord, startJd, endJd, fullStartJd? }
 * @param utcOffsetMinutes the birth place's, in which the dates are told
 */
function runningDashas({ mahadashas, atMs, utcOffsetMinutes, levels = 3 }) {
  const jd = atMs / DAY_MS + JD_UNIX_EPOCH;
  return chainAt(mahadashas, jd, levels).map((p, i) => {
    const from = p.fullStartJd ?? p.startJd;
    const length = p.endJd - from;
    return {
      level: i + 1,
      levelTa: DASHA_LEVEL_TA[i],
      lord: p.lord,
      lordTa: PLANET_TA[p.lord],
      start: localText(p.startJd, utcOffsetMinutes).slice(0, 10),
      end: localText(p.endJd, utcOffsetMinutes).slice(0, 10),
      progress: Math.min(1, Math.max(0, (jd - from) / length)),
      daysLeft: Math.max(0, Math.round(p.endJd - jd)),
    };
  });
}

/**
 * @param natalMoonLongitude the birth Moon's sidereal longitude
 * @param mahadashas see runningDashas
 * @param atMs the instant (nothing here reads the clock)
 * @param ayanamsha the name the ephemeris takes ('Lahiri', ...), the chart's
 */
function personalToday({ natalMoonLongitude, mahadashas, utcOffsetMinutes, atMs, ayanamsha = 'Lahiri' }) {
  if (!Number.isFinite(natalMoonLongitude)) throw new RangeError('the birth Moon\'s longitude is required');
  const janmaStar = Math.floor(norm360(natalMoonLongitude) / STAR) % 27;
  const janmaRasi = Math.floor(norm360(natalMoonLongitude) / 30);
  const jd = atMs / DAY_MS + JD_UNIX_EPOCH;

  const moonLon = norm360(planetLongitude(jd, 'Moon', ayanamsha));
  const moonStar = Math.floor(moonLon / STAR) % 27;
  const count = ((moonStar - janmaStar + 27) % 27) + 1;
  const tara = ((count - 1) % 9) + 1;
  const moonRasi = Math.floor(moonLon / 30);

  const jupiterRasi = Math.floor(norm360(planetLongitude(jd, 'Jupiter', ayanamsha)) / 30);
  const saturn = saturnStateAt({ moonRasiIndex: janmaRasi, atMs, ayanamsha });
  const phase = saturn.conditions.find((c) => c.id === 'SADE_SATI');
  const phaseRow = phase ? ST.SADE_SATI_PHASES[saturn.houseFromMoon] : null;

  return {
    atUtc: new Date(atMs).toISOString(),
    janma: { starTa: NAKSHATRA_TA[janmaStar], rasiTa: RASI_TA[janmaRasi] },
    dasha: runningDashas({ mahadashas, atMs, utcOffsetMinutes }),
    moon: {
      starTa: NAKSHATRA_TA[moonStar],
      pada: Math.floor((moonLon % STAR) / (STAR / 4)) + 1,
      count,
      tara,
      taraTa: GT.TARAS[tara - 1].pulippaniTa,
      taraResultTa: GT.TARAS[tara - 1].pulippaniResultTa,
      rasiTa: RASI_TA[moonRasi],
      houseFromMoon: houseFrom(moonRasi, janmaRasi),
    },
    saturn: {
      rasiTa: saturn.saturnRasi,
      houseFromMoon: saturn.houseFromMoon,
      sadeSati: phaseRow ? { phase: phase.phase, nameTa: phaseRow.nameTa } : null,
    },
    jupiter: { rasiTa: RASI_TA[jupiterRasi], houseFromMoon: houseFrom(jupiterRasi, janmaRasi) },
    sources: { tara: GT.TARA_SOURCES, sadeSati: phaseRow ? phaseRow.source : null },
  };
}

module.exports = { personalToday, runningDashas, houseFrom };
