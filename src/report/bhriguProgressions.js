/**
 * பிருகு சக்கர / சரள பத்ததி — age-based progression readings.
 *
 * Ported from the prior kottravel-Nadi-astrology-software
 * (`public/research-math.js` + the BCP/BSP block of `public/app.js`,
 * cited there to book-186 / book-189 / book-192 / book-027 / book-106):
 *
 *  - BCP (Bhrigu Chakra Paddhati): 1 year of life = 1 house. Running year N
 *    activates house ((N-1) mod 12) + 1; a 12-year "cycle ruler" runs over
 *    108 years (Moon, Mercury, Venus, Sun, Mars, Jupiter, Saturn, Rahu, Ketu).
 *  - Dasha–BCP focus: the running Mahādaśā lord's sign advanced by (N-1)
 *    signs → the focus sign, and that sign's lord.
 *  - BSP (Bhrigu Saral Paddhati): six age→house activation rules; at the
 *    matching age, the rule's planet activates the sign (planet.sign + house
 *    - 1) mod 12.
 *  - Jeeva / Śarīra of the grahas: Jeeva = the graha's nakshatra lord;
 *    Śarīra = (if the graha is in its own star) its sign lord, else the
 *    nakshatra lord of the Jeeva planet.
 */

const norm = (n) => ((n % 360) + 360) % 360;

// Rasi lords, index 0 = Mesha.
const RULERS = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
// Vimshottari nakshatra-lord cycle (27 stars, repeating every 9).
const STAR_LORDS = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const CYCLE_RULERS = ['Moon', 'Mercury', 'Venus', 'Sun', 'Mars', 'Jupiter', 'Saturn', 'Rahu', 'Ketu'];

const starIndex = (lon) => Math.floor(norm(lon) * 27 / 360);
const starLord = (lon) => STAR_LORDS[starIndex(lon) % 9];

/** Running year of life (1-based) as of `asOf`. null if `asOf` precedes birth. */
function runningYear(birthISO, asOfISO) {
  if (asOfISO < birthISO) return null;
  const b = birthISO.split('-').map(Number);
  const e = asOfISO.split('-').map(Number);
  const beforeAnniversary = e[1] < b[1] || (e[1] === b[1] && e[2] < b[2]);
  return e[0] - b[0] - (beforeAnniversary ? 1 : 0) + 1;
}

function cycleRuler(year) {
  return year >= 1 && year <= 108 ? CYCLE_RULERS[Math.floor((year - 1) / 12)] : null;
}

/** Jeeva/Śarīra rows. `grahas` = [{id, sign, longitude}] excluding Ascendant. */
function jeevaRows(grahas) {
  const by = Object.fromEntries(grahas.map((p) => [p.id, p]));
  return grahas.map((p) => {
    const jeeva = starLord(p.longitude);
    const own = jeeva === p.id;
    return {
      id: p.id,
      jeeva,
      sharira: own ? RULERS[p.sign] : starLord(by[jeeva].longitude),
      own,
    };
  });
}

const BSP_RULES = [
  { no: 6, planet: 'Mars', age: 27, house: 10, note: 'செவ்வாய் தன்னிலிருந்து 10-வது பாவத்தைச் செயல்படுத்தும்.' },
  { no: 8, planet: 'Rahu', age: 38, house: 6, note: 'ராகு தொடர்பான 6-வது பாவச் செயல்பாடு.' },
  { no: 9, planet: 'Ketu', age: 24, house: 12, note: 'கேது தொடர்பான 12-வது பாவச் செயல்பாடு.' },
  { no: 10, planet: 'Jupiter', age: 40, house: 9, note: 'குருவின் 9-வது பாவத் தொடர்பு.' },
  { no: 11, planet: 'Jupiter', age: 32, house: 5, note: 'குருவின் 5-வது பாவத் தொடர்பு.' },
  { no: 13, planet: 'Saturn', age: 20, house: 3, note: 'சனியின் 3-வது பாவத் தொடர்பு.' },
];

/**
 * @param opts.grahas   [{id, sign (0-11), longitude}] for Sun..Ketu (no Ascendant)
 * @param opts.birthISO  'YYYY-MM-DD' of birth
 * @param opts.asOfISO   'YYYY-MM-DD' to evaluate at (default: today)
 * @param opts.mahadashaLord  running Vimshottari Mahādaśā lord id (optional)
 */
function calculateBhriguProgressions(opts) {
  const { grahas, birthISO, asOfISO = new Date().toISOString().slice(0, 10), mahadashaLord } = opts;
  const running = runningYear(birthISO, asOfISO);
  const by = Object.fromEntries(grahas.map((p) => [p.id, p]));

  if (running == null) {
    return { available: false, reason: 'as-of date precedes birth' };
  }

  const bcpHouse = ((running - 1) % 12) + 1;
  const windowStart = Math.max(1, running - 2);
  const bcpTable = Array.from({ length: 7 }, (_, i) => {
    const year = windowStart + i;
    return {
      year,
      house: ((year - 1) % 12) + 1,
      cycleRuler: cycleRuler(year),
      current: year === running,
    };
  });

  let dashaBcpFocus = null;
  if (mahadashaLord && by[mahadashaLord]) {
    const focusSign = (by[mahadashaLord].sign + running - 1) % 12;
    dashaBcpFocus = { mahadashaLord, focusSign, focusSignLord: RULERS[focusSign] };
  }

  const bsp = BSP_RULES.map((r) => {
    const p = by[r.planet];
    return {
      ...r,
      targetSign: p ? (p.sign + r.house - 1) % 12 : null,
      active: r.age === running,
    };
  });

  return {
    available: true,
    asOf: asOfISO,
    runningYear: running,
    bcpHouse,
    bcpCycleRuler: cycleRuler(running),
    bcpTable,
    dashaBcpFocus,
    bsp,
    jeeva: jeevaRows(grahas),
  };
}

module.exports = { calculateBhriguProgressions, runningYear, cycleRuler, jeevaRows, BSP_RULES };
