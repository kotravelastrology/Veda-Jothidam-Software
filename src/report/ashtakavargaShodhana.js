/**
 * Ashtakavarga Śodhana (reduction) + Piṇḍa.
 *
 * Ported from the prior AstrologicLab `src/lib/ashtakavarga.ts`
 * (trikonaShodhana / ekadhipatyaShodhana / calcPinda). BPHS Ch.66:
 *  - Trikoṇa Śodhana: within each trine group {1,5,9} … the lowest value
 *    replaces all three; if two or more are 0, or all equal, all become 0.
 *  - Ekādhipatya Śodhana: for each pair of signs owned by one lord, if
 *    both non-zero, subtract the smaller from the larger and zero the smaller
 *    (equal → both 0).
 *  - Rāśi Piṇḍa = Σ (reduced bindu × rāśi gunakāra); Graha Piṇḍa = Σ over
 *    contributors (their reduced bindu at the target's rāśi × graha gunakāra);
 *    Sodhya Piṇḍa = Rāśi + Graha.
 */
const ASTAKA_PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const RASHI_GUNAKARA = [7, 10, 8, 4, 10, 5, 7, 8, 9, 5, 11, 12];
const GRAHA_GUNAKARA = { Sun: 5, Moon: 5, Mars: 8, Mercury: 5, Jupiter: 10, Venus: 7, Saturn: 5 };
const EKADHIPATYA_PAIRS = [[0, 7], [1, 6], [2, 5], [8, 11], [9, 10]];

function trikonaShodhana(bav) {
  const result = [...bav];
  for (const group of [[0, 4, 8], [1, 5, 9], [2, 6, 10], [3, 7, 11]]) {
    const values = group.map((i) => bav[i]);
    const zeroCount = values.filter((v) => v === 0).length;
    const allEqual = values.every((v) => v === values[0]);
    if (zeroCount >= 2 || allEqual) group.forEach((i) => { result[i] = 0; });
    else { const min = Math.min(...values); group.forEach((i) => { result[i] = min; }); }
  }
  return result;
}

function ekadhipatyaShodhana(bav) {
  const result = [...bav];
  for (const [a, b] of EKADHIPATYA_PAIRS) {
    const va = result[a];
    const vb = result[b];
    if (va === 0 || vb === 0) continue;
    if (va === vb) { result[a] = 0; result[b] = 0; }
    else if (va < vb) { result[a] = 0; result[b] = vb - va; }
    else { result[b] = 0; result[a] = va - vb; }
  }
  return result;
}

function applyShodhana(bav) {
  return ekadhipatyaShodhana(trikonaShodhana(bav));
}

/**
 * @param bhinna  { planet: number[12] } — Kotravel's ashtakavarga.bhinna
 * @param rasiIndexByPlanet  { planet: 0-11 } — natal rasi of each of the 7
 */
function calculateAshtakavargaShodhana(bhinna, rasiIndexByPlanet) {
  const reduced = {};
  for (const p of ASTAKA_PLANETS) reduced[p] = applyShodhana(bhinna[p]);

  const pinda = {};
  for (const target of ASTAKA_PLANETS) {
    const rashiPinda = reduced[target].reduce((s, b, r0) => s + b * RASHI_GUNAKARA[r0], 0);
    const targetRasi0 = rasiIndexByPlanet[target];
    const grahaPinda = ASTAKA_PLANETS.reduce((s, c) => s + reduced[c][targetRasi0] * GRAHA_GUNAKARA[c], 0);
    pinda[target] = { rashiPinda, grahaPinda, sodhyaPinda: rashiPinda + grahaPinda };
  }

  return { available: true, reduced, pinda };
}

module.exports = { calculateAshtakavargaShodhana, applyShodhana, trikonaShodhana, ekadhipatyaShodhana };
