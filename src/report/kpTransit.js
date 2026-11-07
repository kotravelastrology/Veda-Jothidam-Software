/**
 * KP transit (gocharapala nirnayam) as K.S. Krishnamurti sets it out in "Stellar Astrological Reader No. V: Transit (Gocharapala Nirnayam)" (corpus C33, second scan C67),
 * read on the text layer and checked on the page images 2026-10-26; printed page = PDF page - 34 in the chapters used here (printed 151-163 at PDF 185-197):
 *
 *  - the significations of each planet in the native's chart come from the four-level order (planets in the star of the occupants, the occupants, planets in the star of the
 *    owners, the owners: printed p.154), the same table as kpHouseSignificators.js; the book's worked chart (Bombay, 23-12-1924 21:00) gives the signification of each planet
 *    on printed p.155 and the module agrees for seven of the nine planets (see test-kp-transit.js for the two nodes);
 *  - the "ready reckoner" of the stars (printed pp.156-160): each of the 27 stars has its lord, and whenever any planet transits it, "whatever the lord of the constellation signifies"
 *    is the matter; the transiting planet's own houses are the source; the sub lord of the point shows whether it materialises "according to the houses signified by the sub lord"
 *    (printed pp.157, 160-161);
 *  - dasa, bhukti, anthra and transit (printed pp.161-163): the points of the zodiac whose sign, star and sub lords are the dasa, bhukti and anthra lords in any order are the
 *    sensitive points, transited by the planets of the period, the luminaries and the ascendant ("Venus dasa, Moon bhukti, Mercury anthra: Venus sign, Moon star, Mercury sub; Moon sign,
 *    Mercury star, Venus sub; Mercury sign, Moon star, Venus sub"); a point may also be read by star, sub and sub-sub ("Kethu star, Mars sub, Kethu sub-sub"). For Rahu and Kethu the book
 *    names the planet conjoined with them, the lord of the star they stand in, or the lord of their sign (the module lists them as stand-ins);
 *  - the transit of the ascendant (printed pp.192-194): the ruling planets of the moment fix the points; the moment the ascendant reaches such a point is the moment the book names.
 * No prediction is made: the page lists the points and the instants the transiting bodies and the ascendant reach them.
 */
const { julianDay } = require('@swisseph/node');
const { kpChain } = require('./kpSystem');
const { TABLE, instantOfAscendant } = require('./kpHorary');
const { kpLords } = require('./nadiCombinations');
const { planetLongitude, nodeLongitude, sunMoonLongitudes } = require('../ephemeris/siderealPositions');

const SOURCE = {
  title: 'Krishnamurti Padhdhati, Reader V: Transit (Gocharapala Nirnayam)',
  author: 'K.S. Krishnamurti',
  tradition: 'Krishnamurti Paddhati (KP)',
  file: 'C33_KP_Reader_V_Transit_Gochara_KSK.pdf',
  pageLocus: 'Systematic procedure for transit results printed pp.151-160; dasa, bhukti, anthra and transit printed pp.161-163; transit of ascendant and ruling planets printed pp.192-194',
};

const norm = (x) => ((x % 360) + 360) % 360;
const STAR_NAMES = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
const STAR_LORDS = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const BODIES = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const SUB_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const SUB_YEARS = { Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 };

/** Planet -> houses it signifies, from the four-level table of kpSystem.js (houseSignificators). */
function planetHouses(kp) {
  const out = Object.fromEntries(BODIES.map((b) => [b, new Set()]));
  for (const row of kp.houseSignificators ?? []) {
    for (const lv of ['level1', 'level2', 'level3', 'level4']) for (const p of row[lv] ?? []) if (out[p]) out[p].add(row.house);
  }
  return Object.fromEntries(Object.entries(out).map(([p, s]) => [p, [...s].sort((a, b) => a - b)]));
}

/** The 27 stars with their extent, lord and the houses the lord signifies in this chart (printed pp.156-160). */
function starReadyReckoner(kp) {
  const ph = planetHouses(kp);
  const span = 360 / 27;
  return STAR_NAMES.map((name, i) => ({ number: i + 1, name, from: i * span, to: (i + 1) * span, lord: STAR_LORDS[i % 9], houses: ph[STAR_LORDS[i % 9]] }));
}

/** The reading of the transiting bodies at their positions: matter (star lord's houses), source (the body's own), outcome (the sub lord's). */
function transitReading(kp, longitudes) {
  const ph = planetHouses(kp);
  return BODIES.map((b) => {
    const chain = kpChain(longitudes[b]);
    return {
      planet: b, longitude: norm(longitudes[b]), sign: chain.sign, nakshatra: chain.nakshatra, signLord: chain.signLord, starLord: chain.starLord, subLord: chain.sub, subSubLord: chain.subSub,
      matterHouses: ph[chain.starLord] ?? [], sourceHouses: ph[b] ?? [], subHouses: ph[chain.sub] ?? [],
    };
  });
}

const sameMultiset = (a, b) => [...a].sort().join('|') === [...b].sort().join('|');

/** The sub-sub rows: { from, to, signLord, starLord, subLord, subSubLord }, the 2187 sub-subs of the 243 subs cut at the sign boundaries (2193 rows). */
let SUBSUB = null;
function subSubTable() {
  if (SUBSUB) return SUBSUB;
  const SIGN_LORD = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
  const starWidth = 360 / 27;
  const raw = [];
  for (let star = 0; star < 27; star += 1) {
    let sStart = star * starWidth;
    const starLord = STAR_LORDS[star % 9];
    for (let a = 0; a < 9; a += 1) {
      const subLord = SUB_ORDER[(star % 9 + a) % 9];
      const subWidth = starWidth * SUB_YEARS[subLord] / 120;
      let cur = sStart;
      for (let b = 0; b < 9; b += 1) {
        const ssLord = SUB_ORDER[(SUB_ORDER.indexOf(subLord) + b) % 9];
        const w = subWidth * SUB_YEARS[ssLord] / 120;
        raw.push({ from: cur, to: cur + w, starLord, subLord, subSubLord: ssLord });
        cur += w;
      }
      sStart += subWidth;
    }
  }
  SUBSUB = [];
  for (const r of raw) {
    let from = r.from;
    while (from < r.to - 1e-9) {
      const boundary = (Math.floor((from + 1e-9) / 30) + 1) * 30;
      const to = Math.min(r.to, boundary);
      SUBSUB.push({ from, to, signLord: SIGN_LORD[Math.floor((from + to) / 2 / 30)], starLord: r.starLord, subLord: r.subLord, subSubLord: r.subSubLord });
      from = to;
    }
  }
  return SUBSUB;
}

/**
 * The sensitive points of a running dasa, bhukti and anthra (printed pp.161-163): the points whose sign, star and sub lords are the three lords in any order (`byLords`),
 * and those whose star, sub and sub-sub lords are (`byStar`).
 */
function dbaPoints(dasa, bhukti, anthra) {
  const set = [dasa, bhukti, anthra];
  const byLords = TABLE.filter((r) => sameMultiset([r.signLord, r.starLord, r.subLord], set));
  const byStar = subSubTable().filter((r) => sameMultiset([r.starLord, r.subLord, r.subSubLord], set));
  return { lords: set, byLords, byStar };
}

const bodyLongitude = (jd, body, ayanamsha, nodeType) => {
  if (body === 'Rahu') return nodeLongitude(jd, ayanamsha, nodeType);
  if (body === 'Ketu') return norm(nodeLongitude(jd, ayanamsha, nodeType) + 180);
  if (body === 'Sun' || body === 'Moon') { const r = sunMoonLongitudes(jd, ayanamsha); return body === 'Sun' ? r.sunLongitude : r.moonLongitude; }
  return planetLongitude(jd, body, ayanamsha);
};

/**
 * When a body is inside any of the points during `days` days from `fromJd`: [{ point, enterJd, leaveJd }], located by sampling and bisection (about a second).
 * Rahu and Kethu use the mean node (Krishnamurti ayanamsha).
 */
function entryWindows({ points, body, fromJd, days = 30, ayanamsha = 'Krishnamurti', nodeType = 'mean' }) {
  const step = body === 'Moon' ? 1 / 96 : body === 'Sun' || body === 'Mercury' || body === 'Venus' || body === 'Mars' ? 1 / 8 : 1;
  const lon = (jd) => bodyLongitude(jd, body, ayanamsha, nodeType);
  const inside = (jd, p) => { const x = norm(lon(jd)); return x >= p.from && x < p.to; };
  const bis = (a, b, p, wantInsideAtB) => {
    let lo = a; let hi = b;
    for (let i = 0; i < 40; i += 1) { const m = (lo + hi) / 2; if (inside(m, p) === wantInsideAtB) hi = m; else lo = m; }
    return hi;
  };
  const out = [];
  for (const p of points) {
    let jd = fromJd;
    let was = inside(jd, p);
    let enter = was ? fromJd : null;
    for (let t = fromJd + step; t <= fromJd + days; t += step) {
      const now = inside(t, p);
      if (now && !was) enter = bis(jd, t, p, true);
      if (!now && was && enter !== null) { out.push({ point: p, enterJd: enter, leaveJd: bis(jd, t, p, false) }); enter = null; }
      jd = t; was = now;
    }
    if (was && enter !== null) out.push({ point: p, enterJd: enter, leaveJd: null });
  }
  return out.sort((a, b) => a.enterJd - b.enterJd);
}

/**
 * The instants within `hours` from `fromJd` at which the ascendant of a place is at the start of each point: [{ point, jd }] (printed pp.161-162, 192-194).
 * The ascendant passes each point once a sidereal day; the instant is found by instantOfAscendant (Krishnamurti ayanamsha).
 */
function ascendantEntries({ points, latitude, longitude, fromJd, hours = 24 }) {
  const out = [];
  for (const p of points) {
    let jd = instantOfAscendant(p.from, latitude, longitude, fromJd + 0.5);
    while (jd < fromJd) jd += 0.99727;
    for (let k = 0; k < 3 && jd <= fromJd + hours / 24; k += 1) {
      out.push({ point: p, jd });
      jd = instantOfAscendant(p.from, latitude, longitude, jd + 1);
    }
  }
  return out.sort((a, b) => a.jd - b.jd);
}

module.exports = { SOURCE, STAR_NAMES, planetHouses, starReadyReckoner, transitReading, dbaPoints, subSubTable, entryWindows, ascendantEntries, bodyLongitude, kpLords, julianDay };
