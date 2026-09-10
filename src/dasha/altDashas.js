/**
 * Yogini and Ashtottari dashas — alternate nakshatra-based daśā systems,
 * shown alongside Vimshottari.
 *
 * Ported from the prior AstrologicLab engine:
 *  - Yogini: `ephemeris.ts` buildYoginiDasha / yoginiStartIndex. 8 Yoginīs
 *    (Maṅgalā 1 yr … Saṅkaṭā 8 yr), 36-year cycle; start index
 *    (nakIdx0 + 3) mod 8 (BPHS Uttara, "janmarkṣāt trisaṁyuktāt aṣṭabhir
 *    bhāgamāharet", GOV-REG-V11-020).
 *  - Ashtottari: `dasha.ts` buildAshtottariDasha. 8 lords
 *    (Sun 6, Moon 15, Mars 8, Mercury 17, Saturn 10, Jupiter 19, Rahu 12,
 *    Venus 21) = 108 yr; nakshatra→lord by the group pattern [4,3,4,3,4,3,4,2]
 *    from Ārdrā (BPHS Ch.49, R. Santhanam). Traditionally applied only when
 *    Rāhu is in a kendra/trikoṇa from the Lagna lord — surfaced as a note,
 *    not gated.
 *
 * Both use the 365.25-day year, like Kotravel's Vimshottari module.
 */

const MS_PER_YEAR = 365.25 * 86400000;
const NAK_SPAN = 360 / 27;
const norm360 = (d) => ((d % 360) + 360) % 360;
const isoDate = (ms) => new Date(ms).toISOString().slice(0, 10);

// ── Yogini ───────────────────────────────────────────────────────────────
const YOGINI_NAMES = ['Mangala', 'Pingala', 'Dhanya', 'Bhramari', 'Bhadrika', 'Ulka', 'Siddha', 'Sankata'];
const YOGINI_NAMES_TA = ['மங்களா', 'பிங்களா', 'தன்யா', 'பிரமரி', 'பத்ரிகா', 'உல்கா', 'சித்தா', 'சங்கடா'];
const YOGINI_LORDS = ['Moon', 'Sun', 'Jupiter', 'Mars', 'Mercury', 'Saturn', 'Venus', 'Rahu'];
const YOGINI_YEARS = [1, 2, 3, 4, 5, 6, 7, 8]; // sum 36

function yoginiStartIndex(nakIdx0) {
  return ((nakIdx0 % 27) + 3) % 8;
}

function yoginiEntry(idx, startMs, years) {
  return {
    index: idx,
    yogini: YOGINI_NAMES[idx],
    yoginiTa: YOGINI_NAMES_TA[idx],
    lord: YOGINI_LORDS[idx],
    years: Math.round(years * 1000) / 1000,
    startMs,
    endMs: startMs + years * MS_PER_YEAR,
    start: isoDate(startMs),
    end: isoDate(startMs + years * MS_PER_YEAR),
  };
}

function buildYoginiDasha(moonLongitudeSidereal, birthMs) {
  const lon = norm360(moonLongitudeSidereal);
  const nakIdx = Math.floor(lon / NAK_SPAN) % 27;
  const frac = (lon % NAK_SPAN) / NAK_SPAN;
  const si = yoginiStartIndex(nakIdx);

  const periods = [];
  let cursor = birthMs;
  const withSubs = (p) => {
    const subs = [];
    let sc = p.startMs;
    const totalUnits = 36;
    for (let i = 0; i < 8; i += 1) {
      const idx = (p.index + i) % 8;
      const subYears = (YOGINI_YEARS[idx] / totalUnits) * p.years;
      subs.push(yoginiEntry(idx, sc, subYears));
      sc += subYears * MS_PER_YEAR;
    }
    return { ...p, subs };
  };

  const firstYears = YOGINI_YEARS[si] * (1 - frac);
  periods.push(withSubs(yoginiEntry(si, cursor, firstYears)));
  cursor += firstYears * MS_PER_YEAR;
  // ~3 cycles (24 further periods) so a living native's "now" is always covered.
  for (let i = 1; i <= 24; i += 1) {
    const idx = (si + i) % 8;
    periods.push(withSubs(yoginiEntry(idx, cursor, YOGINI_YEARS[idx])));
    cursor += YOGINI_YEARS[idx] * MS_PER_YEAR;
  }
  return { system: 'Yogini', cycleYears: 36, startYogini: YOGINI_NAMES[si], periods };
}

// ── Ashtottari ───────────────────────────────────────────────────────────
const ASHTOTTARI_LORDS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Saturn', 'Jupiter', 'Rahu', 'Venus'];
const ASHTOTTARI_YEARS = [6, 15, 8, 17, 10, 19, 12, 21]; // sum 108
const ASHTOTTARI_GROUP_SIZES = [4, 3, 4, 3, 4, 3, 4, 2];
const ASHTOTTARI_NAK_LORD = (() => {
  const arr = new Array(27).fill(0);
  let cursor = 5; // Ardra
  ASHTOTTARI_GROUP_SIZES.forEach((size, lordIdx) => {
    for (let i = 0; i < size; i += 1) { arr[cursor % 27] = lordIdx; cursor += 1; }
  });
  return arr;
})();

function ashtottariEntry(idx, startMs, years) {
  return {
    index: idx,
    lord: ASHTOTTARI_LORDS[idx],
    years: Math.round(years * 1000) / 1000,
    startMs,
    endMs: startMs + years * MS_PER_YEAR,
    start: isoDate(startMs),
    end: isoDate(startMs + years * MS_PER_YEAR),
  };
}

function buildAshtottariDasha(moonLongitudeSidereal, birthMs) {
  const lon = norm360(moonLongitudeSidereal);
  const nakIndex = Math.floor(lon / NAK_SPAN) % 27;
  const startLordIdx = ASHTOTTARI_NAK_LORD[nakIndex];

  let groupStartNak = nakIndex;
  while (ASHTOTTARI_NAK_LORD[(groupStartNak - 1 + 27) % 27] === startLordIdx) {
    groupStartNak = (groupStartNak - 1 + 27) % 27;
  }
  const groupSize = ASHTOTTARI_GROUP_SIZES[startLordIdx];
  const groupStartLon = groupStartNak * NAK_SPAN;
  const distFromGroupStart = norm360(lon - groupStartLon);
  const fractionElapsed = distFromGroupStart / (groupSize * NAK_SPAN);

  const withSubs = (p) => {
    const subs = [];
    let sc = p.startMs;
    for (let i = 0; i < 8; i += 1) {
      const idx = (p.index + i) % 8;
      const subYears = (ASHTOTTARI_YEARS[idx] / 108) * p.years;
      subs.push(ashtottariEntry(idx, sc, subYears));
      sc += subYears * MS_PER_YEAR;
    }
    return { ...p, subs };
  };

  const periods = [];
  let cursor = birthMs;
  const firstYears = ASHTOTTARI_YEARS[startLordIdx] * (1 - fractionElapsed);
  periods.push(withSubs(ashtottariEntry(startLordIdx, cursor, firstYears)));
  cursor += firstYears * MS_PER_YEAR;
  for (let i = 1; i < 8; i += 1) {
    const idx = (startLordIdx + i) % 8;
    periods.push(withSubs(ashtottariEntry(idx, cursor, ASHTOTTARI_YEARS[idx])));
    cursor += ASHTOTTARI_YEARS[idx] * MS_PER_YEAR;
  }
  return {
    system: 'Ashtottari', cycleYears: 108, startLord: ASHTOTTARI_LORDS[startLordIdx], periods,
    note: 'BPHS: பாரம்பரியமாக ராகு லக்னாதிபதியிலிருந்து கேந்திர/திரிகோணத்தில் இருக்கும்போது மட்டும் பயன்படுத்தப்படும்.',
  };
}

function currentPeriod(periods, nowMs = Date.now()) {
  return periods.find((p) => p.startMs <= nowMs && nowMs < p.endMs) || null;
}

module.exports = { buildYoginiDasha, buildAshtottariDasha, yoginiStartIndex, currentPeriod };
