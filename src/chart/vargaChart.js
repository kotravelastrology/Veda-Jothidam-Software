const { attachSource } = require('../contracts/chartContext');
const { RASI_NAMES } = require('./parashariChart');

const BPHS_VARGA_SOURCE = {
  title: 'Brihat Parashara Hora Shastra (BPHS)',
  author: 'R. Santhanam (translation)',
  file: 'C23_BPHS_Santhanam.pdf',
  tradition: 'Parashari',
  convention: 'Shodasavarga (16 divisions), Ch.6',
};

const MOVABLE = new Set([0, 3, 6, 9]); // Aries, Cancer, Libra, Capricorn
const FIXED = new Set([1, 4, 7, 10]); // Taurus, Leo, Scorpio, Aquarius
// remaining 4 signs (2,5,8,11) are dual: Gemini, Virgo, Sagittarius, Pisces

function movability(rasiIndex) {
  if (MOVABLE.has(rasiIndex)) return 'movable';
  if (FIXED.has(rasiIndex)) return 'fixed';
  return 'dual';
}

/** Traditional sign parity: Aries (index 0) is the 1st sign, hence "odd". */
function isOddSign(rasiIndex) {
  return rasiIndex % 2 === 0;
}

const ELEMENT_START = [0, 3, 6, 9]; // fire->Aries, earth->Cancer, air->Libra, water->Capricorn
function elementStart(rasiIndex) {
  return ELEMENT_START[rasiIndex % 4];
}

/**
 * The 13 "equal division" vargas, each defined by how many divisions split
 * a 30-degree sign and which sign the division-count starts from. All rules
 * are BPHS Chapter 6 (file pages 53-64 / printed pages 43-54, visually
 * verified this stage; see S8 stage record for verse-by-verse citations).
 */
const EQUAL_DIVISION_VARGAS = {
  D1: { name: 'Rashi', divisions: 1, startSign: (r) => r },
  // v.7-8: decanates fall on the 1st/5th/9th (trine) signs from the sign itself, not consecutive signs.
  D3: { name: 'Drekkana', divisions: 3, startSign: (r) => r, step: 4 },
  // v.9: quarters fall on the 1st/4th/7th/10th (kendra) signs from the sign itself, not consecutive signs.
  D4: { name: 'Chathurthamsa', divisions: 4, startSign: (r) => r, step: 3 },
  D7: {
    name: 'Saptamsa',
    divisions: 7,
    startSign: (r) => (isOddSign(r) ? r : (r + 6) % 12), // v.10-11
  },
  D9: {
    name: 'Navamsa',
    divisions: 9,
    startSign: (r) => {
      const m = movability(r);
      if (m === 'movable') return r; // v.12: from itself
      if (m === 'fixed') return (r + 8) % 12; // from the 9th thereof
      return (r + 4) % 12; // dual: from the 5th thereof
    },
  },
  D10: {
    name: 'Dashamsa',
    divisions: 10,
    startSign: (r) => (isOddSign(r) ? r : (r + 8) % 12), // v.13-14
  },
  D12: { name: 'Dvadasamsa', divisions: 12, startSign: (r) => r }, // v.15: always from the sign itself
  D16: {
    name: 'Shodasamsa',
    divisions: 16,
    startSign: (r) => {
      const m = movability(r);
      return m === 'movable' ? 0 : m === 'fixed' ? 4 : 8; // v.16: Aries / Leo / Sagittarius (absolute)
    },
  },
  D20: {
    name: 'Vimsamsa',
    divisions: 20,
    startSign: (r) => {
      const m = movability(r);
      return m === 'movable' ? 0 : m === 'fixed' ? 8 : 4; // v.17: Aries / Sagittarius / Leo (absolute)
    },
  },
  D24: {
    name: 'Chaturvimsamsa',
    divisions: 24,
    startSign: (r) => (isOddSign(r) ? 4 : 3), // v.22-23: Leo (odd) / Cancer (even), absolute
  },
  D27: {
    name: 'Saptavimsamsa',
    divisions: 27,
    startSign: (r) => elementStart(r), // v.24-26 notes: fire->Aries, earth->Cancer, air->Libra, water->Capricorn
  },
  D40: {
    name: 'Khavedamsa',
    divisions: 40,
    startSign: (r) => (isOddSign(r) ? 0 : 6), // v.29-30: Aries (odd) / Libra (even), absolute
  },
  D45: {
    name: 'Akshavedamsa',
    divisions: 45,
    startSign: (r) => {
      const m = movability(r);
      return m === 'movable' ? 0 : m === 'fixed' ? 4 : 8; // v.31-32: Aries / Leo / Sagittarius (absolute)
    },
  },
};

function equalDivisionVarga({ divisions, startSign, step = 1 }, rasiIndex, degreeInSign) {
  const divisionIndex = Math.min(divisions - 1, Math.floor(degreeInSign / (30 / divisions)));
  return (startSign(rasiIndex) + divisionIndex * step) % 12;
}

/** D2 Hora (BPHS v.5-6): the two 15-degree halves are ruled by Sun/Moon, not assigned a sign. */
function calculateHora(rasiIndex, degreeInSign) {
  const firstHalf = degreeInSign < 15;
  if (isOddSign(rasiIndex)) return firstHalf ? 'Sun' : 'Moon';
  return firstHalf ? 'Moon' : 'Sun';
}

/** D30 Trimsamsa (BPHS v.27-28): irregular 5/5/8/7/5-degree spans, not equal divisions. */
const TRIMSAMSA_ODD = [
  { uptoDegree: 5, sign: 0 }, // Aries (Mars)
  { uptoDegree: 10, sign: 10 }, // Aquarius (Saturn)
  { uptoDegree: 18, sign: 8 }, // Sagittarius (Jupiter)
  { uptoDegree: 25, sign: 2 }, // Gemini (Mercury)
  { uptoDegree: 30, sign: 6 }, // Libra (Venus)
];
const TRIMSAMSA_EVEN = [
  { uptoDegree: 5, sign: 1 }, // Taurus (Venus)
  { uptoDegree: 12, sign: 5 }, // Virgo (Mercury)
  { uptoDegree: 20, sign: 11 }, // Pisces (Jupiter)
  { uptoDegree: 25, sign: 9 }, // Capricorn (Saturn)
  { uptoDegree: 30, sign: 7 }, // Scorpio (Mars)
];
function calculateTrimsamsa(rasiIndex, degreeInSign) {
  const table = isOddSign(rasiIndex) ? TRIMSAMSA_ODD : TRIMSAMSA_EVEN;
  const entry = table.find((e) => degreeInSign < e.uptoDegree) ?? table[table.length - 1];
  return entry.sign;
}

/**
 * D60 Shashtiamsa (BPHS v.33-41, worked example on file page 65 / printed
 * page 55): double the degrees-into-sign, floor it, mod 12, that many signs
 * from the sign itself. Reproduces the book's own example exactly: Venus at
 * Capricorn 13d25' -> 13.4167*2=26.83 -> floor 26 -> 26%12=2 -> 2 signs from
 * Capricorn -> Pisces.
 */
function calculateShashtiamsa(rasiIndex, degreeInSign) {
  const offset = Math.floor(degreeInSign * 2) % 12;
  return (rasiIndex + offset) % 12;
}

/**
 * The 60 Shashtiamsa deities (BPHS Ch.6 v.32). The D60 SIGN is uniform for
 * odd/even (calculateShashtiamsa); what reverses is the ORDER of the 60
 * deities: odd (viṣama) signs count 1→60 direct, even (yugma) signs 60→1
 * reverse ("oje krameṇa … yugme vyutkramataḥ"). Deity list + benefic/malefic
 * nature ported from the prior AstrologicLab `shashtiamsa.ts` (its corpus-C30
 * "D60_Shashtiamsha_Master_Guide" transcription).
 */
const SHASHTIAMSA_DEITIES = [
  ['Ghora', 0, 'கோரம்'], ['Rakshasa', 0, 'ராக்ஷசம்'], ['Deva', 1, 'தேவம்'], ['Kubera', 1, 'குபேரம்'],
  ['Yaksha', 1, 'யக்ஷம்'], ['Kinnara', 1, 'கின்னரம்'], ['Bhrashta', 0, 'ப்ரஷ்டம்'], ['Kulisa', 0, 'குலிசம்'],
  ['Garuda', 1, 'கருடம்'], ['Agni', 0, 'அக்னி'], ['Maya', 0, 'மாயா'], ['Preta', 0, 'ப்ரேதம்'],
  ['Purisha', 0, 'புரீஷம்'], ['Apampati', 1, 'அபாம்பதி'], ['Marutwan', 1, 'மருத்வான்'], ['Kaala', 0, 'காலம்'],
  ['Sarpa', 0, 'சர்ப்பம்'], ['Amrita', 1, 'அமிர்தம்'], ['Indumukhi', 1, 'இந்துமுகி'], ['Mridu', 1, 'மிருது'],
  ['Komala', 1, 'கோமளம்'], ['Heramba', 1, 'ஹேரம்பம்'], ['Brahma', 1, 'பிரஹ்மா'], ['Vishnu', 1, 'விஷ்ணு'],
  ['Maheshwara', 1, 'மகேஸ்வரன்'], ['Deva/Sudha', 1, 'தேவா/சுதா'], ['Kalinasa', 1, 'கலிநாசம்'], ['Kshitishwara', 1, 'க்ஷிதீஸ்வரன்'],
  ['Kamalakara', 1, 'கமலாக்கரன்'], ['Gulika', 0, 'குளிகன்'], ['Mrityu', 0, 'மிருத்யு'], ['Kaala', 0, 'காலம்'],
  ['Davagni', 0, 'தவாக்னி'], ['Ghora', 0, 'கோரம்'], ['Yama', 0, 'யமன்'], ['Kantaka', 0, 'கண்டகம்'],
  ['Sudha', 1, 'சுதா'], ['Amrita', 1, 'அமிர்தம்'], ['Purnachandra', 1, 'பூர்ணசந்திரன்'], ['Vishadagdha', 0, 'விஷதத்தம்'],
  ['Kulanasa', 0, 'குலநாசம்'], ['Mukhya', 1, 'முக்யம்'], ['Maya', 0, 'மாயா'], ['Pretapuri', 0, 'ப்ரேதபுரி'],
  ['Dhanta', 1, 'தாந்தம்'], ['Indra', 1, 'இந்திரன்'], ['Devaguru', 1, 'தேவகுரு'], ['Chandra', 1, 'சந்திரன்'],
  ['Yamaghataka', 0, 'யமகண்டகம்'], ['Satru', 0, 'சத்ரு'], ['Kalinasa', 1, 'கலிநாசம்'], ['Mukhya', 1, 'முக்யம்'],
  ['Gulika', 0, 'குளிகன்'], ['Utpata', 0, 'உத்பாதம்'], ['Kaalarupa', 0, 'காலரூபம்'], ['Mrityu', 0, 'மிருத்யு'],
  ['Susheetala', 1, 'சுசீதளம்'], ['Sudha', 1, 'சுதா'], ['Amrita', 1, 'அமிர்தம்'], ['Indurekha/Kshiti', 1, 'இந்துரேகா/க்ஷிதி'],
];

/** @param longitude sidereal longitude → { number, name, nameTa, benefic }. */
function shashtiamsaDeity(longitude) {
  const L = ((longitude % 360) + 360) % 360;
  const sign = Math.floor(L / 30) % 12;
  const idx = Math.min(59, Math.floor((L % 30) / 0.5));
  const oddSign = sign % 2 === 0;
  const number = oddSign ? idx + 1 : 60 - idx;
  const [name, benefic, nameTa] = SHASHTIAMSA_DEITIES[number - 1];
  return { number, name, nameTa, benefic: benefic === 1 };
}

const VARGA_KEYS = ['D1', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D40', 'D45'];

/**
 * S8 — Varga charts (WORKFLOW-REGISTER-001 S8; PLAN-001 item 8). Computes
 * all 13 equal-division vargas plus Hora (D2), Trimsamsa (D30) and
 * Shashtiamsa (D60) — the full BPHS Shodasavarga (16 divisions) — for one
 * Rasi placement (as already computed by `rasiFromLongitude` in
 * `parashariChart.js`).
 */
function calculateVargas(rasiIndex, degreeInSign) {
  const vargas = {};
  for (const key of VARGA_KEYS) {
    const signIndex = equalDivisionVarga(EQUAL_DIVISION_VARGAS[key], rasiIndex, degreeInSign);
    vargas[key] = { name: EQUAL_DIVISION_VARGAS[key].name, signIndex, sign: RASI_NAMES[signIndex] };
  }
  vargas.D2 = { name: 'Hora', lord: calculateHora(rasiIndex, degreeInSign) };
  const trimsamsaSign = calculateTrimsamsa(rasiIndex, degreeInSign);
  vargas.D30 = { name: 'Trimsamsa', signIndex: trimsamsaSign, sign: RASI_NAMES[trimsamsaSign] };
  const shashtiamsaSign = calculateShashtiamsa(rasiIndex, degreeInSign);
  vargas.D60 = { name: 'Shashtiamsa', signIndex: shashtiamsaSign, sign: RASI_NAMES[shashtiamsaSign] };

  return attachSource(vargas, {
    ...BPHS_VARGA_SOURCE,
    pageLocus: 'file pages 53-66 / printed pages 43-56 (Ch.6 vv.1-41, all sixteen varga definitions) — S8',
  });
}

module.exports = {
  calculateVargas,
  calculateHora,
  calculateTrimsamsa,
  calculateShashtiamsa,
  shashtiamsaDeity,
  equalDivisionVarga,
  EQUAL_DIVISION_VARGAS,
  movability,
  isOddSign,
};
