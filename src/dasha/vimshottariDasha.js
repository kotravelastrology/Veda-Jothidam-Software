const { julianDayToDate } = require('@swisseph/node');
const { attachSource } = require('../contracts/chartContext');

const BPHS_DASHA_SOURCE = {
  title: 'Brihat Parashara Hora Shastra (BPHS)',
  author: 'R. Santhanam (translation)',
  file: 'C23_BPHS_Santhanam.pdf',
  tradition: 'Parashari',
  convention: 'Vimshottari',
};

/**
 * The fixed 9-lord Vimshottari cycle (BPHS Ch.46 v.12 gives it starting from
 * Sun/Krittika: Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury, Ketu, Venus;
 * written here starting from Ketu/Ashwini so index 0 lines up with nakshatra
 * index 0 — the same cycle, just rotated, per the printed table on file page
 * 409 (printed p.402: "Makha, Moola, Ashwini -> Ketu", "Poorvaphalguni,
 * Poorvashada, Bharani -> Venus", etc.).
 */
const VIMSHOTTARI_CYCLE = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

/** Each nakshatra's lord, in zodiacal order Ashwini..Revati (BPHS Ch.46 table, file pages 409-411 / printed pages 402-404). */
const NAKSHATRA_LORDS = Array.from({ length: 27 }, (_, i) => VIMSHOTTARI_CYCLE[i % 9]);

/** Total years per lord's Mahadasha (BPHS Ch.46 v.15, file page 409 / printed page 402); sum is 120. */
const VIMSHOTTARI_YEARS = {
  Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17, Ketu: 7, Venus: 20,
};
const TOTAL_YEARS = 120;

/**
 * WORKFLOW-REGISTER-001 S7's five registered level names. BPHS's own verse
 * names are "Dasha" (level 1), "Antardasa" (level 2 — a synonym for the
 * register's "Bhukti") and "Pratyantar Dasha" (level 3 — a synonym for the
 * register's "Antara"); see the S7 stage record for why these two secondary
 * sources' level-4/5 naming ("Sookshma", "Prana") is adopted by extension of
 * BPHS's own explicitly-recursive rule (Ch.51 v.1-2) rather than found
 * verbatim on a printed BPHS page.
 */
const DASHA_LEVEL_NAMES = ['Dasha', 'Bhukti', 'Antara', 'Sookshma', 'Prana'];

/** A civil/Julian year, used only to turn a Dasha-years figure into a calendar date. Not a BPHS convention (BPHS's own worked method, Ch.46 v.16, uses Ghatika/Panchanga units); this is the ordinary modern-software approximation. */
const DAYS_PER_YEAR = 365.25;

function normalizeDegrees(deg) {
  return ((deg % 360) + 360) % 360;
}

function formatLocalDateTime(jd, utcOffsetMinutes) {
  const local = julianDayToDate(jd + utcOffsetMinutes / 1440);
  const totalMinutes = Math.round(local.hour * 60);
  const hour = Math.floor(totalMinutes / 60) % 24;
  const minute = totalMinutes % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return `${local.year}-${pad(local.month)}-${pad(local.day)} ${pad(hour)}:${pad(minute)}`;
}

/** The 9 lords in fixed cycle order, starting from `fromLord` (BPHS Ch.51 v.2: "the further Antardasa belong to the other 9 planets in the same order as followed for the Dasha"). */
function orderFrom(fromLord) {
  const startIndex = VIMSHOTTARI_CYCLE.indexOf(fromLord);
  if (startIndex === -1) throw new RangeError(`Unknown Vimshottari lord: ${fromLord}`);
  return VIMSHOTTARI_CYCLE.map((_, i) => VIMSHOTTARI_CYCLE[(startIndex + i) % 9]);
}

/**
 * Birth nakshatra, starting Mahadasha lord and its balance at birth (BPHS
 * Ch.46 v.16, file page 409 / printed page 402; using the sidereal Moon
 * longitude directly is the "much simpler method... based on the longitude
 * of the Moon" BPHS's own notes attribute to "modern researchers", in place
 * of the original Ghatika/Panchanga-based worked method in the same verse).
 */
function birthNakshatraAndBalance(moonLongitude) {
  const nakshatraSpan = 360 / 27;
  const normalized = normalizeDegrees(moonLongitude);
  const nakshatraIndex = Math.floor(normalized / nakshatraSpan);
  const lord = NAKSHATRA_LORDS[nakshatraIndex];
  const degreeIntoNakshatra = normalized - nakshatraIndex * nakshatraSpan;
  const elapsedFraction = degreeIntoNakshatra / nakshatraSpan;
  const totalYears = VIMSHOTTARI_YEARS[lord];
  return {
    nakshatraIndex,
    lord,
    elapsedFraction,
    totalYears,
    balanceYears: totalYears * (1 - elapsedFraction),
  };
}

/**
 * One level of sub-periods under a parent period (BPHS Ch.51 v.1-2, file
 * pages 495-496 / printed pages 488-489): each sublord's share of
 * `parentDurationYears` is parentDurationYears * VIMSHOTTARI_YEARS[sublord]
 * / 120, in lord-cycle order starting from `parentLord` itself.
 */
function subPeriods(parentLord, parentDurationYears, parentStartYears) {
  let cursor = parentStartYears;
  return orderFrom(parentLord).map((lord) => {
    const durationYears = (parentDurationYears * VIMSHOTTARI_YEARS[lord]) / TOTAL_YEARS;
    const period = { lord, durationYears, startYears: cursor, endYears: cursor + durationYears };
    cursor += durationYears;
    return period;
  });
}

function withCalendarDates(period, birthJulianDay, utcOffsetMinutes) {
  const startJulianDay = birthJulianDay + period.startYears * DAYS_PER_YEAR;
  const endJulianDay = birthJulianDay + period.endYears * DAYS_PER_YEAR;
  return {
    ...period,
    startJulianDay,
    endJulianDay,
    startLocal: formatLocalDateTime(startJulianDay, utcOffsetMinutes),
    endLocal: formatLocalDateTime(endJulianDay, utcOffsetMinutes),
  };
}

/**
 * S7 — Vimshottari Dasha hierarchy (WORKFLOW-REGISTER-001 S7; PLAN-001 item
 * 7). Builds the full 120-year Mahadasha sequence from the birth Moon
 * longitude and birth Julian Day, then recursively subdivides each period
 * down to `depth` levels (1 = Dasha only ... 5 = Dasha/Bhukti/Antara/
 * Sookshma/Prana). Depth defaults to 2 (Dasha+Bhukti) since a full 5-level
 * tree has 9^5 leaf periods; callers needing deeper detail pass `depth`
 * explicitly.
 */
function buildVimshottariDasha(birthJulianDay, moonLongitude, utcOffsetMinutes, { depth = 2 } = {}) {
  if (!Number.isInteger(depth) || depth < 1 || depth > 5) {
    throw new RangeError('depth must be an integer between 1 and 5');
  }
  const birth = birthNakshatraAndBalance(moonLongitude);

  const mahadashas = [];
  let cursor = 0;
  let lord = birth.lord;
  for (let i = 0; i < 9; i += 1) {
    const durationYears = i === 0 ? birth.balanceYears : VIMSHOTTARI_YEARS[lord];
    mahadashas.push({ lord, durationYears, startYears: cursor, endYears: cursor + durationYears });
    cursor += durationYears;
    lord = orderFrom(lord)[1];
  }

  function withChildren(period, level) {
    const dated = withCalendarDates(period, birthJulianDay, utcOffsetMinutes);
    if (level >= depth) return dated;
    const children = subPeriods(period.lord, period.durationYears, period.startYears)
      .map((child) => withChildren(child, level + 1));
    return { ...dated, [DASHA_LEVEL_NAMES[level]]: children };
  }

  const dashas = mahadashas.map((m) => withChildren(m, 1));

  return attachSource({
    birthNakshatraIndex: birth.nakshatraIndex,
    startingLord: birth.lord,
    balanceYearsAtBirth: birth.balanceYears,
    depth,
    levelNames: DASHA_LEVEL_NAMES.slice(0, depth),
    dashas,
  }, {
    ...BPHS_DASHA_SOURCE,
    pageLocus: 'file pages 407-411 / printed pages 400-404 (Ch.46 vv.12-16: order, durations, balance-at-birth), '
      + 'file pages 495-497 / printed pages 488-490 (Ch.51 vv.1-2: sub-period formula) — S7',
  });
}

module.exports = {
  buildVimshottariDasha,
  birthNakshatraAndBalance,
  subPeriods,
  orderFrom,
  NAKSHATRA_LORDS,
  VIMSHOTTARI_CYCLE,
  VIMSHOTTARI_YEARS,
  TOTAL_YEARS,
  DASHA_LEVEL_NAMES,
};
