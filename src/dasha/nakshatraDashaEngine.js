/**
 * VJ-027 — the shared engine behind the nakshatra dasha family.
 *
 * Vimshottari, Ashtottari, Shodashottari, Dwadashottari and the rest are one
 * construction with different numbers: a fixed cycle of lords, a fixed number
 * of years each, a rule mapping the birth nakshatra to a starting lord, and a
 * first period shortened in proportion to how far the Moon has already
 * travelled through that nakshatra.
 *
 * Writing that once means a new system is a *table*, not a new algorithm — and
 * a table can be checked, labelled and verified, which is what VJ-027 is
 * about. `vimshottariDasha.js` keeps its own implementation: it is the one
 * VERIFIED method, it carries page-level citations, and rewriting a verified
 * calculation to share code with unverified ones would put it at risk for no
 * gain.
 *
 * ## The arithmetic invariant
 *
 * A table whose per-lord years do not sum to its stated total is rejected at
 * construction. This is a real check — it catches a transcribed digit — and it
 * is the only automatic check available for a table nobody has read against a
 * text. It must not be mistaken for verification: a table can sum correctly
 * and still be the wrong table. That is why such tables are STRUCTURE_ONLY.
 */

const { UnsupportedInputError } = require('../contracts/chartContext');

/** As in `vimshottariDasha.js`: the ordinary modern-software approximation,
 *  not a classical convention. */
const DAYS_PER_YEAR = 365.25;
const NAK_COUNT = 27;
const NAK_SPAN = 360 / NAK_COUNT;

const norm360 = (d) => ((d % 360) + 360) % 360;

/**
 * Builds a validated dasha table.
 *
 * @param cycle       lords in period order
 * @param years       { lord: years }
 * @param totalYears  the system's stated total
 * @param lordOfNakshatra  (nakshatraIndex) => lord — the system's start rule
 */
function createDashaTable({ id, cycle, years, totalYears, lordOfNakshatra }) {
  if (!id) throw new UnsupportedInputError('id is required', 'id');
  if (!Array.isArray(cycle) || cycle.length === 0) {
    throw new UnsupportedInputError(`${id}: cycle must be a non-empty array`, 'cycle');
  }
  if (new Set(cycle).size !== cycle.length) {
    throw new UnsupportedInputError(`${id}: a lord appears twice in the cycle`, 'cycle');
  }
  for (const lord of cycle) {
    if (!(years[lord] > 0)) {
      throw new UnsupportedInputError(`${id}: ${lord} has no positive year count`, 'years');
    }
  }
  const extra = Object.keys(years).filter((l) => !cycle.includes(l));
  if (extra.length) {
    throw new UnsupportedInputError(`${id}: ${extra.join(', ')} not in the cycle`, 'years');
  }

  const sum = cycle.reduce((acc, lord) => acc + years[lord], 0);
  if (Math.abs(sum - totalYears) > 1e-9) {
    throw new UnsupportedInputError(
      `${id}: the per-lord years sum to ${sum}, but the system's total is ${totalYears}`,
      'totalYears',
    );
  }
  if (typeof lordOfNakshatra !== 'function') {
    throw new UnsupportedInputError(`${id}: lordOfNakshatra must be a function`, 'lordOfNakshatra');
  }
  // The start rule must cover every nakshatra and name only known lords.
  for (let n = 0; n < NAK_COUNT; n += 1) {
    const lord = lordOfNakshatra(n);
    if (!cycle.includes(lord)) {
      throw new UnsupportedInputError(
        `${id}: nakshatra ${n} maps to ${lord}, which is not in the cycle`, 'lordOfNakshatra',
      );
    }
  }

  return Object.freeze({
    id, cycle: Object.freeze([...cycle]), years: Object.freeze({ ...years }),
    totalYears, lordOfNakshatra,
  });
}

function orderFrom(table, lord) {
  const start = table.cycle.indexOf(lord);
  if (start === -1) throw new UnsupportedInputError(`${table.id}: unknown lord ${lord}`, 'lord');
  return table.cycle.map((_, i) => table.cycle[(start + i) % table.cycle.length]);
}

/** Birth nakshatra, starting lord, and the fraction of it already elapsed. */
function birthBalance(table, moonLongitude) {
  if (!Number.isFinite(moonLongitude)) {
    throw new UnsupportedInputError('moonLongitude must be a number', 'moonLongitude');
  }
  const normalized = norm360(moonLongitude);
  const nakshatraIndex = Math.floor(normalized / NAK_SPAN) % NAK_COUNT;
  const lord = table.lordOfNakshatra(nakshatraIndex);
  const elapsedFraction = (normalized - nakshatraIndex * NAK_SPAN) / NAK_SPAN;
  const totalYears = table.years[lord];
  return {
    nakshatraIndex, lord, elapsedFraction, totalYears,
    balanceYears: totalYears * (1 - elapsedFraction),
  };
}

function subPeriods(table, parentLord, parentDurationYears, parentStartYears) {
  let cursor = parentStartYears;
  return orderFrom(table, parentLord).map((lord) => {
    const durationYears = (parentDurationYears * table.years[lord]) / table.totalYears;
    const period = { lord, durationYears, startYears: cursor, endYears: cursor + durationYears };
    cursor += durationYears;
    return period;
  });
}

const isoDate = (ms) => new Date(ms).toISOString().slice(0, 10);

function withDates(period, birthMs) {
  return {
    ...period,
    startDate: isoDate(birthMs + period.startYears * DAYS_PER_YEAR * 86400000),
    endDate: isoDate(birthMs + period.endYears * DAYS_PER_YEAR * 86400000),
  };
}

/**
 * The full period tree from birth.
 *
 * The first mahadasha is the balance of the birth lord's period, and every
 * later one is that lord's full span; sub-periods are pro-rated against the
 * parent, so a shortened first mahadasha yields correspondingly shortened
 * sub-periods rather than a full set that overruns it.
 */
function buildDasha(table, { birthMs, moonLongitude, depth = 2, cycles = 1 }) {
  if (!Number.isFinite(birthMs)) {
    throw new UnsupportedInputError('birthMs is required', 'birthMs');
  }
  if (!(depth >= 1 && depth <= 4)) {
    throw new UnsupportedInputError('depth must be 1-4', 'depth');
  }
  const balance = birthBalance(table, moonLongitude);

  const expand = (lord, durationYears, startYears, level) => {
    const node = withDates({ lord, durationYears, startYears, endYears: startYears + durationYears }, birthMs);
    if (level >= depth) return node;
    return {
      ...node,
      children: subPeriods(table, lord, durationYears, startYears)
        .map((p) => expand(p.lord, p.durationYears, p.startYears, level + 1)),
    };
  };

  const order = orderFrom(table, balance.lord);
  const periods = [];
  let cursor = 0;
  for (let c = 0; c < cycles; c += 1) {
    for (let i = 0; i < order.length; i += 1) {
      const lord = order[i];
      // Only the very first period is shortened — it is the balance remaining
      // at birth, not a full mahadasha.
      const duration = (c === 0 && i === 0) ? balance.balanceYears : table.years[lord];
      periods.push(expand(lord, duration, cursor, 1));
      cursor += duration;
    }
  }

  return {
    system: table.id,
    totalYears: table.totalYears,
    birthNakshatraIndex: balance.nakshatraIndex,
    startLord: balance.lord,
    balanceYears: balance.balanceYears,
    elapsedFraction: balance.elapsedFraction,
    periods,
  };
}

module.exports = {
  createDashaTable, buildDasha, birthBalance, subPeriods, orderFrom,
  DAYS_PER_YEAR, NAK_COUNT, NAK_SPAN,
};
