const { DASHA_LEVEL_NAMES } = require('./vimshottariDasha');
const { UnsupportedInputError } = require('../contracts/chartContext');

/**
 * VJ-017 — deterministic dasha timeline.
 *
 * Every function here takes the instant it is asked about as an argument.
 * Nothing reads the clock: a timeline computed for a given date must give the
 * same answer next week, or a stored report and a fresh recomputation would
 * disagree for no reason the practitioner can see. `app/dasha-timeline` used
 * to call `Date.now()` mid-computation, which made its output change daily.
 */

const MS_PER_DAY = 86400000;
const JD_UNIX_EPOCH = 2440587.5;

/** Milliseconds since the Unix epoch → Julian Day. */
function julianDayFromMs(ms) {
  if (!Number.isFinite(ms)) throw new UnsupportedInputError('ms must be a finite number', 'ms');
  return ms / MS_PER_DAY + JD_UNIX_EPOCH;
}

function julianDayFromDate(date) {
  const ms = date instanceof Date ? date.getTime() : Date.parse(date);
  if (!Number.isFinite(ms)) throw new UnsupportedInputError(`unparseable date: ${date}`, 'date');
  return julianDayFromMs(ms);
}

/** Pure: the same three numbers always give the same answer. */
function statusAt(jd, startJulianDay, endJulianDay) {
  if (jd >= endJulianDay) return 'past';
  if (jd >= startJulianDay) return 'current';
  return 'future';
}

/** The child periods a node carries, whatever level it is. */
function childrenOf(node) {
  for (const level of DASHA_LEVEL_NAMES) {
    if (Array.isArray(node[level])) return { level, periods: node[level] };
  }
  return null;
}

/**
 * The full chain of periods active at an instant: Dasha, then Bhukti, and as
 * far down as the tree was built. This is the "period boundary drill" — each
 * level narrows the window.
 *
 * Returns an empty array for an instant outside the 120-year cycle rather
 * than guessing, because extrapolating past the cycle would be invention.
 */
function chainAtJulianDay(dashaResult, jd) {
  if (!dashaResult || !Array.isArray(dashaResult.dashas)) {
    throw new UnsupportedInputError('a Vimshottari result is required', 'dashaResult');
  }
  if (!Number.isFinite(jd)) throw new UnsupportedInputError('jd must be finite', 'jd');

  const chain = [];
  let level = 'Dasha';
  let periods = dashaResult.dashas;

  while (periods) {
    const hit = periods.find((p) => jd >= p.startJulianDay && jd < p.endJulianDay);
    if (!hit) break;
    chain.push({
      level,
      lord: hit.lord,
      startJulianDay: hit.startJulianDay,
      endJulianDay: hit.endJulianDay,
      startLocal: hit.startLocal,
      endLocal: hit.endLocal,
      durationYears: hit.durationYears,
    });
    const next = childrenOf(hit);
    if (!next) break;
    level = next.level;
    periods = next.periods;
  }
  return chain;
}

/** Selected-date replay: what was running on a given date. */
function chainAtDate(dashaResult, date) {
  return chainAtJulianDay(dashaResult, julianDayFromDate(date));
}

/**
 * Every boundary crossing in a window, at one level, in order. Used to drill
 * into "when exactly does this change" without scanning time.
 */
function boundariesBetween(dashaResult, fromJd, toJd, { level = 'Dasha' } = {}) {
  if (toJd < fromJd) {
    throw new UnsupportedInputError('toJd must not be before fromJd', 'toJd');
  }
  const targetIndex = DASHA_LEVEL_NAMES.indexOf(level);
  if (targetIndex === -1) throw new UnsupportedInputError(`unknown level: ${level}`, 'level');

  const out = [];
  const walk = (periods, depth, parents) => {
    for (const p of periods) {
      const here = [...parents, p.lord];
      if (depth === targetIndex) {
        // A boundary is the start of a period; include it when it falls in range.
        if (p.startJulianDay >= fromJd && p.startJulianDay <= toJd) {
          out.push({
            level,
            lord: p.lord,
            chain: here,
            julianDay: p.startJulianDay,
            local: p.startLocal,
            endsJulianDay: p.endJulianDay,
            endsLocal: p.endLocal,
          });
        }
      } else if (p.endJulianDay > fromJd && p.startJulianDay < toJd) {
        const next = childrenOf(p);
        if (next) walk(next.periods, depth + 1, here);
      }
    }
  };
  walk(dashaResult.dashas, 0, []);
  out.sort((a, b) => a.julianDay - b.julianDay);
  return out;
}

class ScanCancelled extends Error {
  constructor(scanned) {
    super('scan cancelled');
    this.name = 'ScanCancelled';
    this.scanned = scanned;
  }
}

/**
 * Steps through time looking for a change, yielding to the event loop so the
 * UI stays responsive and an abort is honoured promptly.
 *
 * `probe(jd)` returns a comparable value; a change between consecutive steps
 * is a crossing. Long scans are the only place cancellation matters, so this
 * is where the acceptance criterion applies.
 */
async function scanForChanges({
  fromJd, toJd, stepDays = 1, probe, signal,
  onProgress, yieldEvery = 200,
}) {
  if (typeof probe !== 'function') {
    throw new UnsupportedInputError('probe must be a function', 'probe');
  }
  if (!(stepDays > 0)) throw new UnsupportedInputError('stepDays must be positive', 'stepDays');
  if (toJd < fromJd) throw new UnsupportedInputError('toJd must not be before fromJd', 'toJd');

  const changes = [];
  let scanned = 0;
  let previous = probe(fromJd);

  for (let jd = fromJd + stepDays; jd <= toJd; jd += stepDays) {
    // Checked before the work, so an abort that arrives between steps stops
    // this one rather than after it.
    if (signal?.aborted) throw new ScanCancelled(scanned);

    const value = probe(jd);
    scanned += 1;
    if (value !== previous) {
      changes.push({ fromValue: previous, toValue: value, afterJd: jd - stepDays, atJd: jd });
      previous = value;
    }
    if (scanned % yieldEvery === 0) {
      onProgress?.({ scanned, jd, changes: changes.length });
      // Hand control back so an abort can actually be delivered.
      await new Promise((resolve) => setImmediate(resolve));
    }
  }
  return { changes, scanned, completed: true };
}

module.exports = {
  julianDayFromMs, julianDayFromDate, statusAt,
  chainAtJulianDay, chainAtDate, boundariesBetween,
  scanForChanges, ScanCancelled,
  MS_PER_DAY, JD_UNIX_EPOCH,
};
