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
  }
  return out;
}

module.exports = { calculateNakshatraExtras, taraBala, PADA_SYLLABLES, NAKSHATRA_NAMES };
