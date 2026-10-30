/**
 * Ashtakavarga reductions and pindas (PL9 sample aniruddha_HC4, page 17, "Ashtakavarga - Reductions").
 *
 * Source: Vishnu Bhaskar, Advanced Techniques of Predictive Astrology vol.1, Part 4 ch.14, XXI-XXII (printed pp.146-147,
 * file pages 161-162): Trikona Shodhan, Ekadhipatya Shodhan, the Graha and Rashi multipliers, Graha Pinda, Rashi Pinda and
 * Shodhya Pinda (Parashara's view, as prevalent in North India).
 *
 * Signs here are 0-based (0 = Mesha .. 11 = Meena), as the Ashtakavarga engine takes them.
 *
 * Ekadhipatya: where neither sign of a pair holds a graha, PL9 reduces the larger bindu to the smaller, whereas the printed
 * table takes the difference. The sample shows four such cases; the difference gives a different value in three of them,
 * and the fourth (a smaller of 1) agrees either way. The rule used is PL9's, and it reproduces every cell of the sample. The
 * equal case (both signs to zero) follows the printed table and is not in the sample. The printed rule for a pair with one
 * sign holding a graha is followed; the sample tests only its equal case (the Lagna's Venus pair).
 */

// Trinal groups: Fiery (1,5,9), Earthy (2,6,10), Airy (3,7,11), Watery (4,8,12).
const TRIKONA_GROUPS = [[0, 4, 8], [1, 5, 9], [2, 6, 10], [3, 7, 11]];

// The two signs each planet owns (Sun and Moon own one sign each and take no Ekadhipatya reduction).
const OWNER_PAIRS = { Mars: [0, 7], Venus: [1, 6], Mercury: [2, 5], Jupiter: [8, 11], Saturn: [9, 10] };

// Rashi multipliers, Aries to Pisces (printed p.146).
const RASHI_MULTIPLIER = [7, 10, 8, 4, 10, 5, 7, 8, 9, 5, 11, 12];

// Graha multipliers (printed p.146).
const GRAHA_MULTIPLIER = { Sun: 5, Moon: 5, Mars: 8, Mercury: 5, Jupiter: 10, Venus: 7, Saturn: 5 };

/** Trikona Shodhan: in each trinal group, the smallest bindu is subtracted from all three. */
function trikonaReduction(bindus) {
  const out = [...bindus];
  for (const group of TRIKONA_GROUPS) {
    const low = Math.min(...group.map((i) => out[i]));
    for (const i of group) out[i] -= low;
  }
  return out;
}

/**
 * Ekadhipatya Shodhan on Trikona-reduced bindus. `grahaSigns` holds the signs that have a graha (the seven planets). A pair
 * with a zero in it is not reduced. A pair with a graha in both signs is not reduced. A pair with a graha in one sign: the
 * other sign goes to zero if it has no more bindus than the graha's sign, else to the difference. A pair with no graha: the
 * larger goes to the smaller, and two equal signs both go to zero.
 */
function ekadhipatyaReduction(bindus, grahaSigns) {
  const out = [...bindus];
  for (const [x, y] of Object.values(OWNER_PAIRS)) {
    if (out[x] === 0 || out[y] === 0) continue;
    const withX = grahaSigns.has(x);
    const withY = grahaSigns.has(y);
    if (withX && withY) continue;
    if (withX || withY) {
      const [sign, other] = withX ? [x, y] : [y, x];
      out[other] = out[sign] >= out[other] ? 0 : out[other] - out[sign];
    } else if (out[x] === out[y]) {
      out[x] = 0;
      out[y] = 0;
    } else if (out[x] > out[y]) {
      out[x] = out[y];
    } else {
      out[y] = out[x];
    }
  }
  return out;
}

/** Rashi Pinda: the bindus of each sign times that sign's multiplier, summed. */
function rashiPinda(bindus) {
  return bindus.reduce((sum, b, i) => sum + b * RASHI_MULTIPLIER[i], 0);
}

/**
 * Graha Pinda: the bindus in the sign where each of the seven grahas stands, each times that graha's multiplier, summed.
 * `grahaSignOf` maps each graha to its 0-based sign.
 */
function grahaPinda(bindus, grahaSignOf) {
  return Object.entries(GRAHA_MULTIPLIER).reduce((sum, [graha, m]) => sum + bindus[grahaSignOf[graha]] * m, 0);
}

/** Shodhya Pinda: Rashi Pinda plus Graha Pinda. */
function shodhyaPinda(bindus, grahaSignOf) {
  return rashiPinda(bindus) + grahaPinda(bindus, grahaSignOf);
}

module.exports = {
  trikonaReduction,
  ekadhipatyaReduction,
  rashiPinda,
  grahaPinda,
  shodhyaPinda,
  TRIKONA_GROUPS,
  OWNER_PAIRS,
  RASHI_MULTIPLIER,
  GRAHA_MULTIPLIER,
};
