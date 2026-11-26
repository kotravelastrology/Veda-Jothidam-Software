const { kpChain } = require('../report/kpSystem');
const { d1Dignity, EXALTATION, DEBILITATION, SHADBALA_MINIMUM_VIRUPAS } = require('../chart/shadbala');
const V = require('../chart/vimshopaka');
const { ABBR, flattenDasha, currentPeriodIndex, periodDateText, dashaWindow } = require('./dashaList');

/**
 * The cells of the birth-chart worksheet, the one screen PL9 opens on ("1. Birth chart I", user guide ch.3 and ch.10):
 * the Rasi chart with the house strengths round it, the Navamsha, the dasha list, the planet table, the strength table and
 * the Shad Bala graph. This turns buildReportData's output into the rows each cell shows.
 *
 * Every column below was checked against the PL9 sample chart (5 October 1990, 04:30 IST, Chennai; screenshot of PL9 9.0,
 * 2026-10-31; test-worksheet-data.js): the planet table's pada and star/sub/sub-sub lords (the KP chain), the dignity,
 * the Ashtakavarga points in the planet's own sign, the Vimshopaka Bala (the Shadvarga scheme, rounded), the Jagradadi and
 * Baladi avasthas, and the Sarvashtakavarga points of each house. The Shad Bala ratio is the BPHS ch.27 one the horoscope
 * book's page 11 prints; PL9's worksheet shows other figures (0.71 for the Sun against 0.55 here), not reproduced.
 */

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const NODES = ['Rahu', 'Ketu'];
/** The three-letter nakshatra names PL9 prints in its charts (Rev, Roh, Pus, Mag, PPh, Has, UPh, PSh, Shr as seen in the sample). */
const NAKSHATRA_ABBR = [
  'Ash', 'Bha', 'Kri', 'Roh', 'Mri', 'Ard', 'Pun', 'Pus', 'Asl', 'Mag', 'PPh', 'UPh', 'Has',
  'Chi', 'Swa', 'Vis', 'Anu', 'Jye', 'Moo', 'PSh', 'USh', 'Shr', 'Dha', 'Sat', 'PBh', 'UBh', 'Rev',
];

/** Degrees within a sign as PL9 prints them, dd:mm:ss, the seconds rounded (never past 29:59:59). */
function dmsText(degreeInSign) {
  const total = Math.min(Math.round(degreeInSign * 3600), 30 * 3600 - 1);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`;
}

/** The nakshatra of a longitude, as the three-letter name. */
function nakshatraAbbr(longitude) {
  return NAKSHATRA_ABBR[Math.min(26, Math.floor(((longitude % 360) + 360) % 360 / (360 / 27)))];
}

/**
 * The ascendant and the nine planets: degrees in the sign, the nakshatra and pada, and the star lord, sub lord and
 * sub-sub lord of the longitude (the KP chain). PL9 prints these as "4,Ve/Me/Ma".
 * @param {{lagna: object, grahas: Record<string, object>}} chart
 */
function planetRows(chart) {
  const entries = [['Lagna', chart.lagna], ...[...PLANETS, ...NODES].map((p) => [p, chart.grahas[p]])];
  return entries.map(([id, g]) => {
    const chain = kpChain(g.longitude);
    return {
      id,
      abbr: ABBR[id],
      rasiIndex: g.rasiIndex,
      degreeInSign: g.degreeInSign,
      degreeText: dmsText(g.degreeInSign),
      nakshatra: chain.nakshatra,
      nakshatraAbbr: nakshatraAbbr(g.longitude),
      pada: chain.pada,
      lords: [chain.starLord, chain.sub, chain.subSub].map((l) => ABBR[l]),
      lordsText: `${chain.pada},${[chain.starLord, chain.sub, chain.subSub].map((l) => ABBR[l]).join('/')}`,
    };
  });
}

/**
 * Gulika, which PL9 draws in its charts ("Gk 03:02 Mag"). From the report's upagraha table; null when there is none.
 * Not in the planet table, as in PL9.
 */
function gulikaRow(upagraha) {
  const g = upagraha?.upagrahas?.Gulika;
  if (!g) return null;
  return {
    id: 'Gulika', abbr: 'Gk', rasiIndex: g.rasiIndex, degreeInSign: g.degreeInSign, degreeText: dmsText(g.degreeInSign),
    nakshatraAbbr: nakshatraAbbr(g.longitude),
  };
}

/** Dignity as PL9 words it: exaltation and debilitation first, then the compound relationship with the sign's lord. */
function dignityKey(planet, rasiIndex, degreeInSign, rasiPositions) {
  if (EXALTATION[planet].sign === rasiIndex) return 'exalted';
  if (DEBILITATION[planet].sign === rasiIndex) return 'debilitated';
  return d1Dignity(planet, rasiIndex, degreeInSign, rasiPositions);
}

/** The first word of a Tamil avastha name ("ஸ்வப்ன (கனவு)" is "ஸ்வப்ன"). */
const shortTamil = (text) => String(text ?? '').split(' (')[0];

/**
 * The seven planets' strengths: dignity, Shad Bala as a share of the BPHS minimum, Vimshopaka Bala (Shadvarga, rounded),
 * the Bhinnashtakavarga points the planet has in its own sign, and the Jagradadi and Baladi avasthas.
 */
function strengthRows({ chart, shadbala, ashtakavarga, avasthas }) {
  const rasiPositions = {
    ...Object.fromEntries([...PLANETS, ...NODES].map((p) => [p, chart.grahas[p].rasiIndex])),
    Lagna: chart.lagna.rasiIndex,
  };
  const signs = Object.fromEntries(V.PLANETS.map((p) => [p, chart.grahas[p].rasiIndex]));
  const degrees = Object.fromEntries(V.PLANETS.map((p) => [p, chart.grahas[p].longitude % 30]));
  const vimshopaka = V.allVimshopaka({ signs, degrees }, 'shadvarga');
  const avasthaOf = Object.fromEntries((avasthas?.rows ?? []).map((r) => [r.planet, r]));
  return PLANETS.map((planet) => {
    const g = chart.grahas[planet];
    const total = shadbala.perPlanet[planet].shadbalaTotal;
    const vb = vimshopaka.find((x) => x.planet === planet);
    return {
      id: planet,
      abbr: ABBR[planet],
      dignity: dignityKey(planet, g.rasiIndex, g.degreeInSign, rasiPositions),
      shadbalaTotal: total,
      shadbalaRatio: total / SHADBALA_MINIMUM_VIRUPAS[planet],
      shadbalaMinimum: SHADBALA_MINIMUM_VIRUPAS[planet],
      vimshopaka: vb ? vb.total : null,
      ownSignBindus: ashtakavarga.bhinna[planet][g.rasiIndex],
      jagradadi: shortTamil(avasthaOf[planet]?.jagradadi),
      baladi: shortTamil(avasthaOf[planet]?.baladi),
    };
  });
}

/**
 * The twelve houses with the Sarvashtakavarga points of each, the number PL9 prints on the chart's edge beside the house
 * ("1st h. 27"): the points of the sign the house falls in, whole-sign from the ascendant.
 */
function houseRows({ chart, ashtakavarga }) {
  return Array.from({ length: 12 }, (_, i) => {
    const rasiIndex = (chart.lagna.rasiIndex + i) % 12;
    return { house: i + 1, rasiIndex, sav: ashtakavarga.sarva[rasiIndex] };
  });
}

module.exports = {
  PLANETS, NODES, ABBR, NAKSHATRA_ABBR,
  dmsText, nakshatraAbbr, planetRows, gulikaRow, dignityKey, strengthRows, houseRows,
  flattenDasha, currentPeriodIndex, periodDateText, dashaWindow,
};
