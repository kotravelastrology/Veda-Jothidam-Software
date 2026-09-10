/**
 * Nakshatra-derived helpers:
 *  - Tāra Bala (9-fold star relationship): inclusive forward count from one
 *    nakshatra to another → 1-27 → one of 9 Tāras. Standard classical
 *    formula (the phalan prose tables from AstrologicLab's workbook are not
 *    ported — only the calculation + the 9 universal category names).
 *  - Baby-name syllables: the standard 108-pāda aksharas (4 per nakshatra),
 *    used for a nakṣatra-pada name lead from the natal Moon.
 *  - D60 (Shashtiamsa) deity per graha — from vargaChart.shashtiamsaDeity.
 */
const { shashtiamsaDeity } = require('../chart/vargaChart');

// ── Nadiamsa (Deva Keralam's 150-part-per-rasi / 1800-total micro-division) ──
// Source: "Deva Keralam (Chandra Kala Nadi)", tr. R. Santhanam — Table 1/2.
// Each rasi -> 150 slots of 12' (0.2°); which of the 150 NAMES a slot carries
// depends on the sign's modality (movable direct, fixed reverse, dual
// 76-150 then 1-75). Each 12' slot splits into 4 Kalas of 3'
// (Vipra/Kshatriya/Vaisya/Soodra). The name table is SPARSE — only OCR-legible
// entries from the scanned source; missing indices return null, never guessed.
const NADIAMSA_NAMES = {
  1: 'Vasudha', 2: 'Vaishnavi', 3: 'Braahi', 4: 'Kalakoota', 5: 'Sankari',
  6: 'Sudhakarasama', 7: 'Saumya', 8: 'Suraa', 9: 'Maaya', 10: 'Manoharaa',
  11: 'Maadhavi', 13: 'Ghoraa', 15: 'Kutilaa', 17: 'Paraa', 19: 'Maala',
  21: 'Jarjhari', 22: 'Dhruvaa', 23: 'Musalaa', 24: 'Mudgala', 25: 'Pasaa',
  26: 'Chambaka', 28: 'Mahi', 30: 'Kamalaa', 31: 'Kanthaa', 34: 'Kshamaa',
  35: 'Durdharaa', 38: 'Visirnaa', 42: 'Sukhaprada', 43: 'Snigdha', 47: 'Kaala',
  50: 'Kundini', 51: 'Kanthaa', 52: 'Vishakhya', 53: 'Vishanaasini', 54: 'Nirmada',
  55: 'Seethala', 56: 'Nimnaa', 57: 'Preeta', 58: 'Priyavivardhani', 59: 'Manaadha',
  62: 'Vichitra', 64: 'Bhoopa', 65: 'Gadaaharaa', 75: 'Trailokyamohanakari', 78: 'Sukhadaa',
  79: 'Suprabhaa', 88: 'Sootana', 89: 'Sumanoharaa', 91: 'Somalatha', 92: 'Mangala',
  94: 'Sudha', 95: 'Melaa', 101: 'Nirgathaa', 103: 'Samagaa', 105: 'Samaa',
  109: 'Kunyarakrithi', 121: 'Haarini', 125: 'Dhanada', 126: 'Kachchapa', 130: 'Raudri',
  134: 'Mukundaa', 140: 'Kokilamsa', 143: 'Viraprasoo', 144: 'Sangaraa', 146: 'Sataavari',
  147: 'Sragvi', 149: 'Naagapankaja', 150: 'Parameswari',
};
const NADIAMSA_KALAS = ['Vipra', 'Kshatriya', 'Vaisya', 'Soodra'];

function calculateNadiamsa(longitude) {
  const l = ((longitude % 360) + 360) % 360;
  const s0 = Math.floor(l / 30);
  const deg = l - s0 * 30;
  const mod = ((s0 % 3) + 3) % 3; // 0 movable, 1 fixed, 2 dual
  const modality = mod === 0 ? 'movable' : mod === 1 ? 'fixed' : 'dual';
  const EPS = 1e-9;
  const slot = Math.min(150, Math.floor(deg / 0.2 + EPS) + 1);
  const nameIndex = mod === 0 ? slot : mod === 1 ? 151 - slot : (slot > 75 ? slot - 75 : slot + 75);
  const minsIn = (deg - (slot - 1) * 0.2) * 60;
  const kala = NADIAMSA_KALAS[Math.min(3, Math.floor(minsIn / 3 + EPS))];
  return { slot, nameIndex, modality, name: NADIAMSA_NAMES[nameIndex] || null, kala };
}

const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
  'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
  'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati',
];

// 9 Tāra categories (universal classical names).
const TARA_NAMES = ['Janma', 'Sampat', 'Vipat', 'Kshema', 'Pratyari', 'Sadhaka', 'Vadha', 'Mitra', 'Ati-Mitra'];
const TARA_NAMES_TA = ['ஜென்மம்', 'சம்பத்து', 'விபத்து', 'சேமம்', 'பிரத்யரி', 'சாதகம்', 'வதை', 'மித்திரம்', 'பரம மித்திரம்'];
const TARA_GOOD = [false, true, false, true, false, true, false, true, true];

/** fromIdx0/toIdx0: 0-indexed nakshatra. Inclusive forward count. */
function taraBala(fromIdx0, toIdx0) {
  const distance = ((toIdx0 - fromIdx0 + 27) % 27) + 1;
  const category = ((distance - 1) % 9) + 1;
  return {
    distance,
    category,
    name: TARA_NAMES[category - 1],
    nameTa: TARA_NAMES_TA[category - 1],
    favorable: TARA_GOOD[category - 1],
  };
}

// Standard 108-pāda name syllables (4 per nakshatra, in pāda order).
const PADA_SYLLABLES = [
  ['Chu', 'Che', 'Cho', 'La'], ['Li', 'Lu', 'Le', 'Lo'], ['A', 'I', 'U', 'E'],
  ['O', 'Va', 'Vi', 'Vu'], ['Ve', 'Vo', 'Ka', 'Ki'], ['Ku', 'Gha', 'Ng', 'Chha'],
  ['Ke', 'Ko', 'Ha', 'Hi'], ['Hu', 'He', 'Ho', 'Da'], ['Di', 'Du', 'De', 'Do'],
  ['Ma', 'Mi', 'Mu', 'Me'], ['Mo', 'Ta', 'Ti', 'Tu'], ['Te', 'To', 'Pa', 'Pi'],
  ['Pu', 'Sha', 'Na', 'Tha'], ['Pe', 'Po', 'Ra', 'Ri'], ['Ru', 'Re', 'Ro', 'Ta'],
  ['Ti', 'Tu', 'Te', 'To'], ['Na', 'Ni', 'Nu', 'Ne'], ['No', 'Ya', 'Yi', 'Yu'],
  ['Ye', 'Yo', 'Bha', 'Bhi'], ['Bhu', 'Dha', 'Pha', 'Dha'], ['Bhe', 'Bho', 'Ja', 'Ji'],
  ['Ju', 'Je', 'Jo', 'Kha'], ['Ga', 'Gi', 'Gu', 'Ge'], ['Go', 'Sa', 'Si', 'Su'],
  ['Se', 'So', 'Da', 'Di'], ['Du', 'Tha', 'Jha', 'Da'], ['De', 'Do', 'Cha', 'Chi'],
];

/**
 * @param moonLongitude  natal sidereal Moon longitude
 * @param transitMoonLongitude  current transit Moon longitude (for daily Tāra)
 */
function calculateNakshatraExtras(moonLongitude, transitMoonLongitude, grahaLongitudes) {
  const nakSpan = 360 / 27;
  const norm = (d) => ((d % 360) + 360) % 360;
  const janmaNak = Math.floor(norm(moonLongitude) / nakSpan) % 27;
  const janmaPada = Math.floor((norm(moonLongitude) % nakSpan) / (nakSpan / 4)) + 1;

  const out = {
    available: true,
    janmaNakshatra: NAKSHATRA_NAMES[janmaNak],
    janmaPada,
    nameSyllable: PADA_SYLLABLES[janmaNak][janmaPada - 1],
    nakshatraSyllables: PADA_SYLLABLES[janmaNak],
  };

  if (Number.isFinite(transitMoonLongitude)) {
    const todayNak = Math.floor(norm(transitMoonLongitude) / nakSpan) % 27;
    out.todayNakshatra = NAKSHATRA_NAMES[todayNak];
    out.todayTaraBala = taraBala(janmaNak, todayNak);
  }

  if (grahaLongitudes) {
    out.shashtiamsa = Object.fromEntries(
      Object.entries(grahaLongitudes).map(([id, lon]) => [id, shashtiamsaDeity(lon)]),
    );
    out.nadiamsa = Object.fromEntries(
      Object.entries(grahaLongitudes).map(([id, lon]) => [id, calculateNadiamsa(lon)]),
    );
  }
  return out;
}

module.exports = { calculateNakshatraExtras, taraBala, calculateNadiamsa, PADA_SYLLABLES, NAKSHATRA_NAMES };
