/**
 * BPHS ch.72, "Aggregational Ashtakavarga" (Santhanam, vol.2, printed pp.897-904; fixture fixtures/ashtakavarga/bphs-72.json): the rekhas of the Ascendant's and the seven
 * planets' Ashtakavargas added sign by sign (the Samudaya), read for the signs and houses (more than 30 favourable, 25 to 30 medium, fewer than 25 adverse), for the wealth
 * condition of v.7-8, for the three parts of life (v.9-10) and for the month the Sun is in each sign (v.11-28). Nothing is weighed against anything else.
 * Benefics are the Moon, Mercury, Jupiter and Venus and malefics the Sun, Mars, Saturn, Rahu and Ketu, as the book's own example takes them.
 */
const { calculateBhinnashtakavarga, LAGNA_PLACES } = require('../chart/ashtakavarga');
const DATA = require('../../fixtures/ashtakavarga/bphs-72.json');

const PLANETS = Object.freeze(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']);
const BENEFICS = Object.freeze(['Moon', 'Mercury', 'Jupiter', 'Venus']);
const MALEFICS = Object.freeze(['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu']);

/** The Samudaya of a chart: twelve counts, the sum of the seven planets' Bhinnashtakavarga and the Ascendant's, index 0 = Aries. */
function samudaya(rasi) {
  const total = new Array(12).fill(0);
  for (const p of PLANETS) calculateBhinnashtakavarga(p, rasi).forEach((v, i) => { total[i] += v; });
  calculateBhinnashtakavarga('Lagna', rasi, LAGNA_PLACES).forEach((v, i) => { total[i] += v; });
  return total;
}

/**
 * The band of v.3-6 for a count: 'favourable' above 30, 'medium' from 25 to 30, 'adverse' below 25. `exactly30` marks the count the verses and the worked example read differently.
 * @returns {{ band: 'favourable'|'medium'|'adverse', exactly30: boolean, above40: boolean }}
 */
function band(count) {
  return { band: count > 30 ? 'favourable' : count >= 25 ? 'medium' : 'adverse', exactly30: count === 30, above40: count > 40 };
}

/** The effect and remedy of the month of a sign with `count` rekhas (v.11-28), or null when the count is above 30 (v.29 reads those). */
function monthEntry(count) {
  if (count > 30) return null;
  return DATA.counts.find((c) => count <= c.max);
}

/** The houses' counts (1-12) of a chart with the Ascendant in sign `lagnaSign`. */
const houseCounts = (sam, lagnaSign) => Array.from({ length: 12 }, (_, h) => sam[(lagnaSign + h) % 12]);

/**
 * The wealth condition of v.7-8: more rekhas in the 11th than the 10th, fewer in the 12th than the 11th, the Ascendant holding the most.
 * @returns {{ held: boolean, eleventhOverTenth: boolean, twelfthUnderEleventh: boolean, lagnaLargest: boolean, reverse: boolean }} `reverse` is the opposite of all three (the Sanskrit: poor)
 */
function wealthCondition(counts) {
  const [lagna, , , , , , , , , tenth, eleventh, twelfth] = counts;
  const others = counts.slice(1);
  const eleventhOverTenth = eleventh > tenth;
  const twelfthUnderEleventh = twelfth < eleventh;
  const lagnaLargest = others.every((c) => lagna > c);
  const reverse = !eleventhOverTenth && !twelfthUnderEleventh && !lagnaLargest;
  return { held: eleventhOverTenth && twelfthUnderEleventh && lagnaLargest, eleventhOverTenth, twelfthUnderEleventh, lagnaLargest, reverse };
}

/**
 * The three parts of life of v.9-10 (houses 1-4, 5-8, 9-12): the benefics and malefics in each, and which outnumber.
 * @param signs { Sun..Ketu: 0-11 }
 * @returns {{ part: 1|2|3, benefics: string[], malefics: string[], reading: 'benefics'|'malefics'|'equal' }[]}
 */
function sections(signs, lagnaSign) {
  const houseOf = (p) => ((signs[p] - lagnaSign + 12) % 12) + 1;
  return [1, 2, 3].map((part) => {
    const inPart = (p) => Math.ceil(houseOf(p) / 4) === part;
    const benefics = BENEFICS.filter(inPart);
    const malefics = MALEFICS.filter(inPart);
    return { part, benefics, malefics, reading: benefics.length > malefics.length ? 'benefics' : malefics.length > benefics.length ? 'malefics' : 'equal' };
  });
}

module.exports = { DATA, PLANETS, BENEFICS, MALEFICS, samudaya, band, monthEntry, houseCounts, wealthCondition, sections };
