const { attachSource } = require('../contracts/chartContext');
const { movability } = require('./vargaChart');

const BPHS_NABHASA_SOURCE = {
  title: 'Brihat Parashara Hora Shastra (BPHS)',
  author: 'R. Santhanam (translation)',
  file: 'C23_BPHS_Santhanam.pdf',
  tradition: 'Parashari',
  convention: 'Nabhasa Yoga, Ch.35',
};

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
/** Simplified benefic/malefic split reused from S10's Paksha Bala treatment
 * (Jupiter/Venus/Mercury benefic; Sun/Mars/Saturn malefic; Moon by paksha).
 * Mercury is treated as always-benefic here since conjunction-based
 * affliction detection is not yet built -- a simplification worth revisiting. */
const NATURAL_BENEFICS = new Set(['Jupiter', 'Venus', 'Mercury']);

function houseFromLagna(rasiIndex, lagnaRasiIndex) {
  return ((rasiIndex - lagnaRasiIndex + 12) % 12) + 1;
}

function allIn(houses, allowedHouses) {
  const allowed = new Set(allowedHouses);
  return houses.every((h) => allowed.has(h));
}

/**
 * Nabhasa Yogas (BPHS Ch.35 v.1-17, file pages 16619-16885 offsets / printed
 * pages 288-295, S11). `rasiPositions` is the same `{ Sun, Moon, Mars,
 * Mercury, Jupiter, Venus, Saturn, Lagna }` 0-based-rasi map used by S9's
 * Ashtakavarga; `isWaxingMoon` selects the Moon's benefic/malefic group for
 * the two yogas (Vajra, Yava) that need it.
 *
 * Effects text (v.18-49) is intentionally not reproduced here -- only the
 * yoga-formation rule is implemented; the source's reproduction status has
 * not been assessed (same caution as S1-D), so predictive text is left for
 * a later, separately-authorized step.
 */
function calculateNabhasaYogas(rasiPositions, { isWaxingMoon = true } = {}) {
  const lagnaRasiIndex = rasiPositions.Lagna;
  const houses = PLANETS.map((p) => houseFromLagna(rasiPositions[p], lagnaRasiIndex));
  const movabilities = PLANETS.map((p) => movability(rasiPositions[p]));

  const benefics = [];
  const malefics = [];
  PLANETS.forEach((p, i) => {
    const isBenefic = p === 'Moon' ? isWaxingMoon : NATURAL_BENEFICS.has(p);
    (isBenefic ? benefics : malefics).push(houses[i]);
  });

  const found = [];
  const add = (name, category, verse) => found.push({ name, category, verse });

  // Asraya yogas (v.7): all 7 planets share one sign-movability type.
  if (movabilities.every((m) => m === 'movable')) add('Rajju', 'Asraya', 'v.7');
  if (movabilities.every((m) => m === 'fixed')) add('Musala', 'Asraya', 'v.7');
  if (movabilities.every((m) => m === 'dual')) add('Nala', 'Asraya', 'v.7');

  // Dala yogas (v.8): benefics/malefics in the 4th, 7th and 10th (the "3 angles"
  // excluding Lagna itself -- the verse names a count of 3, not which 3; this
  // is the most common resolution and is flagged explicitly in the stage record).
  if (allIn(benefics, [4, 7, 10]) && benefics.length === PLANETS.length) add('Maala', 'Dala', 'v.8');
  if (allIn(malefics, [4, 7, 10]) && malefics.length === PLANETS.length) add('Sarpa', 'Dala', 'v.8');

  // Akriti yogas (v.9-15): all 7 planets confined to a specific house set.
  if (allIn(houses, [1, 4]) || allIn(houses, [4, 7]) || allIn(houses, [7, 10]) || allIn(houses, [10, 1])) {
    add('Gada', 'Akriti', 'v.9');
  }
  if (allIn(houses, [1, 7])) add('Sakata', 'Akriti', 'v.9');
  if (allIn(houses, [4, 10])) add('Vihaga', 'Akriti', 'v.9');
  if (allIn(houses, [1, 5, 9])) add('Sringataka', 'Akriti', 'v.10');
  if (allIn(houses, [2, 6, 10]) || allIn(houses, [3, 7, 11]) || allIn(houses, [4, 8, 12])) {
    add('Hala', 'Akriti', 'v.10');
  }
  if (allIn(benefics, [1, 7]) && allIn(malefics, [4, 10])) add('Vajra', 'Akriti', 'v.11');
  if (allIn(benefics, [4, 10]) && allIn(malefics, [1, 7])) add('Yava', 'Akriti', 'v.11');
  if (allIn(houses, [1, 4, 7, 10])) add('Kamala', 'Akriti', 'v.12');
  if (allIn(houses, [3, 6, 9, 12]) || allIn(houses, [2, 5, 8, 11])) add('Vapi', 'Akriti', 'v.12');
  if (allIn(houses, [1, 2, 3, 4])) add('Yupa', 'Akriti', 'v.13');
  if (allIn(houses, [4, 5, 6, 7])) add('Sara', 'Akriti', 'v.13');
  if (allIn(houses, [7, 8, 9, 10])) add('Sakthi', 'Akriti', 'v.13');
  if (allIn(houses, [10, 11, 12, 1])) add('Danda', 'Akriti', 'v.13');
  if (allIn(houses, [1, 2, 3, 4, 5, 6, 7])) add('Nauka', 'Akriti', 'v.14');
  if (allIn(houses, [4, 5, 6, 7, 8, 9, 10])) add('Koota', 'Akriti', 'v.14');
  if (allIn(houses, [7, 8, 9, 10, 11, 12, 1])) add('Chatra', 'Akriti', 'v.14');
  if (allIn(houses, [10, 11, 12, 1, 2, 3, 4])) add('Chapa', 'Akriti', 'v.14');
  if (allIn(houses, [1, 3, 5, 7, 9, 11])) add('Chakra', 'Akriti', 'v.15');
  if (allIn(houses, [2, 4, 6, 8, 10, 12])) add('Samudra', 'Akriti', 'v.15');

  // Sankhya yogas (v.16-17): by count of distinct signs occupied -- only
  // apply "if another Nabhasa yoga explained earlier is [not] derivable" (v.17).
  if (found.length === 0) {
    const distinctSignCount = new Set(PLANETS.map((p) => rasiPositions[p])).size;
    const sankhyaNames = ['Gola', 'Yuga', 'Soola', 'Kedara', 'Paasa', 'Dama', 'Veena'];
    add(sankhyaNames[distinctSignCount - 1], 'Sankhya', 'v.16-17');
  }

  return attachSource({ yogas: found }, {
    ...BPHS_NABHASA_SOURCE,
    pageLocus: 'Ch.35 v.1-17 (formation rules only; predictive text v.18-49 not reproduced) — S11',
  });
}

module.exports = { calculateNabhasaYogas, houseFromLagna, NATURAL_BENEFICS };
