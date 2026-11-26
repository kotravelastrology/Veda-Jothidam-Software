/**
 * Phaladeepika XXVI for one moment — the present block shared by /gochara-vedha
 * and the report: each planet's house from the natal Moon and the verse's
 * result there (9-24), whether it stands in the third of its sign that gives
 * the result (25), exaltation / own sign / debilitation / enemy's sign /
 * combustion (31-32), the full aspects on it with their nature and enmity (30),
 * verse 33, and verse 34's eight positions. The tables and their sources are
 * in `phaladeepikaGocharaTables.js`; dated windows are in `gocharaVedha.js`.
 */

const V = require('./gocharaVedhaTables');
const P = require('./phaladeepikaGocharaTables');
const { calculateBhinnashtakavarga, TARGET_PLANETS } = require('../chart/ashtakavarga');

/**
 * Verse 41: the natal Ashtakavarga under each table of places (Phaladeepika
 * XXIII.3-9, Varahamihira IX.1-7) — each planet's own (bav) and the total (sav).
 * `natalRasi` holds the seven planets' and the Lagna's natal signs 0-11.
 */
function binduCharts(natalRasi) {
  return Object.fromEntries(P.BINDU_TABLES.order.map((id) => {
    const bav = Object.fromEntries(TARGET_PLANETS.map((p) => [p, calculateBhinnashtakavarga(p, natalRasi, P.BINDU_TABLES[id].table)]));
    const sav = Array.from({ length: 12 }, (_, s) => TARGET_PLANETS.reduce((a, p) => a + bav[p][s], 0));
    return [id, { bav, sav }];
  }));
}

/**
 * Verse 41 for `planet` in `sign`, under each table: the bindus, whether each
 * reading calls them "more", and XXIII.11's result for the planet's own count.
 * The nodes have no Ashtakavarga of their own (bav null); the total applies.
 */
function bindusAt(charts, planet, sign) {
  return Object.fromEntries(Object.entries(charts).map(([id, c]) => {
    const bav = c.bav[planet] ? c.bav[planet][sign] : null;
    return [id, {
      bav, sav: c.sav[sign],
      bySav: c.sav[sign] > P.BINDU_READINGS.SAV_28.threshold,
      byBav: bav === null ? null : bav >= P.BINDU_READINGS.BAV_5.threshold,
      resultTa: bav === null ? null : P.BINDU_RESULTS_TA[bav],
    }];
  }));
}

const PLANETS = V.PLANETS_9;
const PLANET_TA = {
  Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு',
  Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது',
};
const norm360 = (d) => ((d % 360) + 360) % 360;
const wrap180 = (d) => norm360(d + 180) - 180;
const round2 = (x) => Math.round(x * 100) / 100;

/**
 * @param moonRasiIndex natal Moon sign 0-11
 * @param lon        { planet: sidereal longitude } for the nine planets
 * @param retrograde { planet: boolean } — only Mercury's and Venus's orbs depend on it
 * @param bindus     `binduCharts(natalRasi)` for verse 41, or omitted
 */
function phaladeepikaNow({ moonRasiIndex, lon, retrograde: isRetro, bindus }) {
  const signOf = (p) => Math.floor(norm360(lon[p]) / 30) % 12;
  const houseOf = (p) => ((signOf(p) - moonRasiIndex + 12) % 12) + 1;
  const goodHouse = (p, h) => V.VEDHA_METHODS.PHALADEEPIKA_SASTRI.table[p].good.includes(h);

  // II.27: the Moon by her paksha (waning = Krishna paksha, our reading); Mercury by his company.
  const elongation = norm360(lon.Moon - lon.Sun);
  const moonNature = elongation < 180 ? 'BENEFIC' : 'MALEFIC';
  const isMalefic = (o) => P.MALEFIC_FIXED.includes(o) || (o === 'Moon' && moonNature === 'MALEFIC');
  const mercuryNature = PLANETS.some((m) => m !== 'Mercury' && signOf(m) === signOf('Mercury') && isMalefic(m)) ? 'MALEFIC' : 'BENEFIC';
  const natureOf = (o) => (o === 'Moon' ? moonNature : o === 'Mercury' ? mercuryNature : P.MALEFIC_FIXED.includes(o) ? 'MALEFIC' : 'BENEFIC');
  const verse33 = P.RULES.find((x) => x.id === 'DANGER_12_8_1');

  const planets = {};
  for (const p of PLANETS) {
    const house = houseOf(p);
    const good = goodHouse(p, house);
    const degreeInSign = norm360(lon[p]) % 30;
    const third = Math.floor(degreeInSign / 10);
    const retrograde = Boolean(isRetro[p]);
    const orb = P.combustionOrb(p, retrograde);
    const separation = Math.abs(wrap180(lon[p] - lon.Sun));
    const combustion = { separation: round2(separation), retrograde, orb, combust: orb === null ? null : separation < orb };
    const dignity = P.dignityOf(p, signOf(p));
    const aspects = PLANETS.filter((o) => o !== p && o in P.FULL_ASPECTS).map((o) => {
      const k = ((signOf(p) - signOf(o) + 12) % 12) + 1;
      const a = P.aspectsOf(o);
      const full = a.full.includes(k);
      const part = a.partial.find(([h]) => h === k);
      if (!full && !part) return null;
      const nature = natureOf(o);
      const enemy = P.NATURAL_ENEMIES[p].includes(o);
      return { planet: o, planetTa: PLANET_TA[o], house: k, full, fraction: full ? 1 : part[1], nature, enemy, ...(full ? P.verse30Effect({ nature, enemy }, good) : { voids: null, enemy: false }) };
    }).filter(Boolean);
    planets[p] = {
      planet: p, planetTa: PLANET_TA[p], house,
      resultTa: P.HOUSE_RESULTS[p]?.[house - 1] ?? null,
      degreeInSign: round2(degreeInSign), third,
      // Verse 25: true/false; 'ALL' for Mercury and Rahu; null for Ketu (no verse).
      effectiveNow: !(p in P.DECANATE) ? null : P.DECANATE[p] === null ? 'ALL' : P.DECANATE[p] === third,
      dignity, goodHouse: good, combustion,
      verdict: P.verses31and32(dignity, combustion.combust, good),
      aspects,
      dangerVerse33: verse33.planets.includes(p) && verse33.houses.includes(house),
      bindus: bindus ? bindusAt(bindus, p, signOf(p)) : null,
    };
  }

  const positions = Object.entries(P.RULES.find((x) => x.id === 'ALL_EIGHT').positions)
    .map(([planet, house]) => ({ planet, planetTa: PLANET_TA[planet], house, nowHouse: planets[planet].house }));
  return {
    planets,
    moonNow: { elongation: round2(elongation), nature: moonNature },
    mercuryNow: { nature: mercuryNature },
    verse34Now: { positions, met: positions.filter((x) => x.house === x.nowHouse).length, all: positions.every((x) => x.house === x.nowHouse) },
  };
}

/** Every page the present block rests on: verse 2's good houses, 9-25, 30-34, and the definitions verses 30-32 use. */
const NOW_SOURCES = Object.freeze([
  V.PHALADEEPIKA_SOURCES.sastri,
  ...P.HOUSE_RESULTS_SOURCES,
  ...P.DECANATE_SOURCES,
  ...P.RULES.filter((r) => r.computed).flatMap((r) => [r.source, r.kapoor].filter(Boolean)),
  ...Object.values(P.DIGNITY_SOURCES),
  ...Object.values(P.ASPECT_SOURCES),
  P.BINDU_RESULTS_SOURCE,
  ...P.BINDU_READINGS.order.flatMap((id) => P.BINDU_READINGS[id].sources),
  ...P.BINDU_TABLES.order.flatMap((id) => P.BINDU_TABLES[id].sources),
].map((s) => Object.freeze({ title: s.title, pageLocus: s.pageLocus })));

/** What a page needs to word verse 41 (the tables' labels, not the tables). */
const BINDU_META = Object.freeze({
  tables: Object.fromEntries(P.BINDU_TABLES.order.map((id) => [id, { labelTa: P.BINDU_TABLES[id].labelTa, noteTa: P.BINDU_TABLES[id].noteTa }])),
  tableOrder: P.BINDU_TABLES.order, defaultTable: P.BINDU_TABLES.default,
  readings: Object.fromEntries(P.BINDU_READINGS.order.map((id) => [id, { labelTa: P.BINDU_READINGS[id].labelTa, threshold: P.BINDU_READINGS[id].threshold }])),
  defaultReading: P.BINDU_READINGS.default,
});

/**
 * The present block with what a page needs to word it (the report's gochara
 * section). `natalRasi` (planets and Lagna, 0-11) adds verse 41.
 */
function phaladeepikaReportBlock({ natalRasi, ...args }) {
  const verse34 = P.RULES.find((x) => x.id === 'ALL_EIGHT');
  return {
    ...phaladeepikaNow({ ...args, bindus: natalRasi ? binduCharts(natalRasi) : undefined }),
    decanate: P.DECANATE, decanateTa: P.DECANATE_TA, ketuNoteTa: P.KETU_NOTE_TA,
    verse34Ta: verse34.textTa,
    bindu: BINDU_META,
    sources: NOW_SOURCES,
  };
}

module.exports = { phaladeepikaNow, phaladeepikaReportBlock, binduCharts, bindusAt, BINDU_META, NOW_SOURCES, PLANET_TA };
