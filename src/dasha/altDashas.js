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

// ── Ashtottari ─────────────────────────────────────────────────
// Read against BPHS Ch.46 vv.17-23 (printed pp.409-410) on 2026-10-21: 28 divisions (Abhijit between Uttarashada and
// Sravana), the lords' blocks of 3 or 4 divisions and the Abhijit-aware balance are `bphsDashas.js`. The earlier port
// here spread 27 stars as 4,3,4,3,4,3,4,2 and so misplaced Dhanishta to Krittika.
const { ASHTOTTARI_BLOCKS, ashtottariBalance, ASHTOTTARI_WHEN_TA } = require('./bphsDashas');

const ASHTOTTARI_LORDS = ASHTOTTARI_BLOCKS.map((b) => b.lord);
const ASHTOTTARI_YEARS = ASHTOTTARI_BLOCKS.map((b) => b.years); // sum 108

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
  const bal = ashtottariBalance(norm360(moonLongitudeSidereal));
  const startLordIdx = ASHTOTTARI_LORDS.indexOf(bal.lord);

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
  const firstYears = bal.balanceYears;
  periods.push(withSubs(ashtottariEntry(startLordIdx, cursor, firstYears)));
  cursor += firstYears * MS_PER_YEAR;
  for (let i = 1; i < 8; i += 1) {
    const idx = (startLordIdx + i) % 8;
    periods.push(withSubs(ashtottariEntry(idx, cursor, ASHTOTTARI_YEARS[idx])));
    cursor += ASHTOTTARI_YEARS[idx] * MS_PER_YEAR;
  }
  return {
    system: 'Ashtottari', cycleYears: 108, startLord: ASHTOTTARI_LORDS[startLordIdx], periods,
    note: `BPHS அத்.46 ஸ்லோ.17-23: ${ASHTOTTARI_WHEN_TA}. இங்கே இந்த நிபந்தனை சரிபார்க்கப்படுவதில்லை; குறிப்பாக மட்டும்.`,
  };
}

function currentPeriod(periods, nowMs = Date.now()) {
  return periods.find((p) => p.startMs <= nowMs && nowMs < p.endMs) || null;
}

module.exports = { buildYoginiDasha, buildAshtottariDasha, yoginiStartIndex, currentPeriod, YOGINI_LORDS, YOGINI_YEARS, ASHTOTTARI_LORDS, ASHTOTTARI_YEARS };
