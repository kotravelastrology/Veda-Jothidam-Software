/**
 * ஜைமினி ஜோதிடம் (core) — Chara Karakas, Sthira Karakatvam, Bhava Arudhas
 * (A1–A12 incl. Arudha Lagna & Upapada), Karkamsha + Ishta/Dharma Devata,
 * Chara (Narayana) rasi dasha, and the static Rashi Drishti (Jaimini sign
 * aspects).
 *
 * Ported from the prior AstrologicLab `src/lib/jaimuni.ts` (its Chara-year
 * rule and the Arudha 1st/7th exception carry the GOV-REG-V11-022/023
 * corrections against Jaimini Upadeśa Sūtras + BPHS ch.29/46). Adapted to
 * Kotravel's English graha keys and its own EXALTATION table. Nadi-style
 * co-lordship: Scorpio = Mars/Ketu, Aquarius = Saturn/Rahu (whichever has
 * more degrees in its own sign).
 */
const { EXALTATION } = require('../chart/shadbala');
const { equalDivisionVarga, EQUAL_DIVISION_VARGAS } = require('../chart/vargaChart');

const RASI_NAMES = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karkataka', 'Simha', 'Kanya',
  'Tula', 'Vrischika', 'Dhanu', 'Makara', 'Kumbha', 'Meena',
];
const RASI_LORDS = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
const CLASSICAL_7 = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const CHARA_KARAKA_NAMES = ['Atmakaraka', 'Amatyakaraka', 'Bhratrikaraka', 'Matrikaraka', 'Putrakaraka', 'Gnatikaraka', 'Darakaraka'];
const CHARA_KARAKA_TA = ['ஆத்ம காரகன்', 'அமாத்திய காரகன்', 'பிராத்ரி காரகன்', 'மாத்ரி காரகன்', 'புத்ர காரகன்', 'ஞாதி காரகன்', 'தார காரகன்'];

const STHIRA_KARAKATVAM = {
  Sun: 'ஆத்மா / தந்தை', Moon: 'மனம் / தாய்', Mars: 'உடன்பிறப்பு / தைரியம்',
  Mercury: 'கல்வி / தாய்மாமன்', Jupiter: 'குழந்தைகள் / குரு', Venus: 'மனைவி / இன்பம்',
  Saturn: 'ஆயுள் / எதிரிகள்', Rahu: 'மனைவி (இரண்டாம்)',
};
const PLANET_DEVATA = {
  Sun: 'சிவன் / சூரியன்', Moon: 'பார்வதி / கௌரி', Mars: 'முருகன் / ஸ்கந்தன்',
  Mercury: 'விஷ்ணு', Jupiter: 'பிரம்மா / விஷ்ணு', Venus: 'மகாலக்ஷ்மி',
  Saturn: 'அய்யப்பன் / சனீஸ்வரன்', Rahu: 'துர்க்கை', Ketu: 'கணபதி / விநாயகர்',
};

const norm360 = (d) => ((d % 360) + 360) % 360;
const sign0 = (lon) => Math.floor(norm360(lon) / 30);
const degInSign = (lon) => norm360(lon) % 30;
const navamsa0 = (lon) => equalDivisionVarga(EQUAL_DIVISION_VARGAS.D9, sign0(lon), degInSign(lon));
const wrapRaw = (x) => { const m = ((Math.round(x) % 12) + 12) % 12; return m === 0 ? 12 : m; };

/** 7 Chara Karakas by descending degree-within-sign of the 7 classical grahas. */
function calculateCharaKarakas(grahaLongitudes) {
  const ranked = CLASSICAL_7
    .map((p) => ({ planet: p, deg: degInSign(grahaLongitudes[p]) }))
    .sort((a, b) => b.deg - a.deg);
  return ranked.map((r, i) => ({
    role: CHARA_KARAKA_NAMES[i], roleTa: CHARA_KARAKA_TA[i], planet: r.planet, degreeInSign: Math.round(r.deg * 100) / 100,
  }));
}

// Arudha of a house (0-indexed base sign). Count from the house to its lord's
// sign, then that count again from the lord. Classical exception: the pada may
// not fall in the 1st/7th from base — pada in 1st (diff 0/6) → 10th from base;
// pada in 7th (diff 3/9) → 4th from base.
function arudhaOf(house0, grahaLongitudes) {
  const lord = RASI_LORDS[house0];
  const lordPos0 = sign0(grahaLongitudes[lord]);
  const diff = ((lordPos0 - house0) % 12 + 12) % 12;
  if (diff === 0 || diff === 6) return wrapRaw(house0 + 10);
  if (diff === 3 || diff === 9) return wrapRaw(house0 + 4);
  return ((house0 + diff * 2) % 12) + 1;
}

const BHAVA_ARUDHA_LABELS = ['A1 (AL)', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12 (UL)'];

function calculateBhavaArudhas(lagnaLongitude, grahaLongitudes) {
  const lagna0 = sign0(lagnaLongitude);
  return Array.from({ length: 12 }, (_, i) => {
    const house0 = (lagna0 + i) % 12;
    const rashi = arudhaOf(house0, grahaLongitudes);
    return { house: i + 1, label: BHAVA_ARUDHA_LABELS[i], rasiIndex: rashi - 1, rasi: RASI_NAMES[rashi - 1] };
  });
}

function planetInNavamsaSign0(targetRashi0, grahaLongitudes) {
  for (const name of [...CLASSICAL_7, 'Rahu', 'Ketu']) {
    if (grahaLongitudes[name] !== undefined && navamsa0(grahaLongitudes[name]) === targetRashi0) return name;
  }
  return RASI_LORDS[targetRashi0];
}

function calculateKarkamsha(grahaLongitudes) {
  const ak = calculateCharaKarakas(grahaLongitudes)[0].planet;
  const rashi0 = navamsa0(grahaLongitudes[ak]);
  const devataAt = (offset, label) => {
    const r0 = (rashi0 + offset) % 12;
    const planet = planetInNavamsaSign0(r0, grahaLongitudes);
    return { house: label, rasiIndex: r0, rasi: RASI_NAMES[r0], planet, devata: PLANET_DEVATA[planet] || planet };
  };
  return {
    atmakaraka: ak,
    rasiIndex: rashi0,
    rasi: RASI_NAMES[rashi0],
    ishtaDevata: devataAt(11, '12th'),
    dharmaDevata: devataAt(8, '9th'),
  };
}

// ── Rashi Drishti (static Jaimini sign aspects) ──────────────────────────
function calculateRashiDrishti() {
  const modality = (s) => s % 3; // 0 movable, 1 fixed, 2 dual
  return Array.from({ length: 12 }, (_, s) => {
    const m = modality(s);
    let targets = [];
    if (m === 0) targets = [1, 4, 7, 10].filter((f) => f !== (s + 1) % 12); // movable → fixed except next
    else if (m === 1) targets = [0, 3, 6, 9].filter((f) => f !== (s - 1 + 12) % 12); // fixed → movable except previous
    else targets = [2, 5, 8, 11].filter((f) => f !== s); // dual → other dual
    return { rasiIndex: s, rasi: RASI_NAMES[s], type: ['Movable', 'Fixed', 'Dual'][m], aspects: targets.map((t) => RASI_NAMES[t]) };
  });
}

// ── Chara (Narayana) rasi dasha ─────────────────────────────────────────
const MS_PER_YEAR = 365.25 * 86400000;

function charaLord(rashi0, PL) {
  if (rashi0 === 7) { // Scorpio
    const k = PL.Ketu; const m = PL.Mars;
    if (k !== undefined && degInSign(k) >= degInSign(m)) return { name: 'Ketu', sign0: sign0(k) };
    return { name: 'Mars', sign0: sign0(m) };
  }
  if (rashi0 === 10) { // Aquarius
    const r = PL.Rahu; const s = PL.Saturn;
    if (r !== undefined && degInSign(r) >= degInSign(s)) return { name: 'Rahu', sign0: sign0(r) };
    return { name: 'Saturn', sign0: sign0(s) };
  }
  const name = RASI_LORDS[rashi0];
  return { name, sign0: sign0(PL[name]) };
}

function charaYears(rashi0, PL, direction) {
  const { name, sign0: lordR0 } = charaLord(rashi0, PL);
  const count = direction === 'direct'
    ? ((lordR0 - rashi0 + 12) % 12) + 1
    : ((rashi0 - lordR0 + 12) % 12) + 1;
  let years = count - 1;
  const ex = EXALTATION[name];
  if (ex) {
    if (lordR0 === ex.sign) years += 1;
    else if (lordR0 === (ex.sign + 6) % 12) years -= 1;
  }
  years = ((years % 12) + 12) % 12;
  return years === 0 ? 12 : years;
}

function calculateCharaDasha(lagnaLongitude, grahaLongitudes, birthMs) {
  const lagna0 = sign0(lagnaLongitude);
  const direction = lagna0 % 2 === 0 ? 'direct' : 'indirect'; // odd 1-indexed sign → direct
  const seq = Array.from({ length: 12 }, (_, i) => (direction === 'direct' ? (lagna0 + i) % 12 : (lagna0 - i + 12) % 12));
  let cursor = birthMs;
  const periods = seq.map((r0) => {
    const years = charaYears(r0, grahaLongitudes, direction);
    const startMs = cursor;
    const endMs = cursor + years * MS_PER_YEAR;
    cursor = endMs;
    return {
      rasiIndex: r0, rasi: RASI_NAMES[r0], years,
      start: new Date(startMs).toISOString().slice(0, 10),
      end: new Date(endMs).toISOString().slice(0, 10),
      startMs, endMs,
    };
  });
  return { direction, periods };
}

/**
 * @param opts.lagnaLongitude
 * @param opts.grahaLongitudes  { Sun..Saturn (+ Rahu, Ketu) : sidereal longitude }
 * @param opts.birthMs          epoch ms of birth
 */
function calculateJaimini(opts) {
  const { lagnaLongitude, grahaLongitudes, birthMs } = opts;
  const charaKarakas = calculateCharaKarakas(grahaLongitudes);
  return {
    available: true,
    charaKarakas,
    sthiraKarakatvam: STHIRA_KARAKATVAM,
    bhavaArudhas: calculateBhavaArudhas(lagnaLongitude, grahaLongitudes),
    karkamsha: calculateKarkamsha(grahaLongitudes),
    charaDasha: calculateCharaDasha(lagnaLongitude, grahaLongitudes, birthMs),
    rashiDrishti: calculateRashiDrishti(),
  };
}

module.exports = {
  calculateJaimini, calculateCharaKarakas, calculateBhavaArudhas, calculateKarkamsha,
  calculateCharaDasha, calculateRashiDrishti, STHIRA_KARAKATVAM,
};
