/**
 * Niryana Shoola Dasha of the Jaimini Sutras (2.3.18; the strength ladder 2.3.5-12): each sign runs 9 years (antardasha
 * 9 months), beginning at the stronger of the lagna and its seventh, onward if that sign is odd and backward if even.
 * The first, fifth and ninth signs from the starting sign are its Shoola signs, those where death is looked for.
 *
 * Sources: Jaimini Sutram, P.S. Sastri, ch.2 pada 3 sutras 1-25 (printed pp.217-219); Jaimini Sutramritam,
 * Iranganti Rangacharya, "Niryana Sula Dasa" (printed pp.125-127), whose worked chart is the test.
 *
 * The ladder as Rangacharya states it (p.126): (1) a sign with a planet beats a vacant one; (2) more planets beat fewer;
 * (3) with equal numbers the lord of each sign is weighed by exaltation, moolatrikona and the like — his worked chart
 * applies this step to the lords even though both signs are occupied; (4) vacant signs likewise by their lords; (5) the
 * lord with more degrees; (6) Prativeshika: an odd sign whose lord is in an even sign beats one whose lord is in an odd
 * sign, an even sign whose lord is in an odd sign beats one whose lord is in an even sign. Sastri's text adds the natural
 * strength dual > fixed > movable (sutra 9) before the lords; it is applied here at the same place. Rahu and Ketu are not
 * taken as lords of Scorpio and Aquarius, and as occupants they count as planets.
 */

const { EXALTATION, DEBILITATION, MOOLATRIKONA, OWN_SIGNS } = require('../chart/shadbala');
const { compoundRelationship } = require('../chart/planetaryRelationship');

const SOURCE = Object.freeze({
  title: 'Jaimini Sutram',
  author: 'P.S. Sastri',
  tradition: 'Jaimini',
  file: 'Jyotish_Jaimini sutram P.S. Sastri.pdf',
  pageLocus: 'Sutras 2.3.18 and 2.3.5-12, printed pp.217-219 (PDF page = printed - 1): "the Shoola Dasa for death begins from the stronger of the Lagna and the seventh … each Dasa is nine years"; '
    + 'ladder of strength as stated in Jaimini Sutramritam, Iranganti Rangacharya, printed pp.125-127.',
});

const LORD = Object.freeze(['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter']);
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const isOdd = (s) => s % 2 === 0;
const quality = (s) => s % 3;

/** Dignity score of a planet where it stands: exalted 6, moolatrikona 5, own 4, then the compound relation, debilitated 0. */
function dignity(planet, sign, degree, signs) {
  if (EXALTATION[planet]?.sign === sign) return 6;
  if (DEBILITATION[planet]?.sign === sign) return 0;
  const mt = MOOLATRIKONA[planet];
  if (mt && mt.sign === sign && degree >= mt.from && degree < mt.to) return 5;
  if (OWN_SIGNS[planet]?.includes(sign)) return 4;
  const rel = compoundRelationship(planet, LORD[sign], signs);
  return { greatFriend: 3.5, friend: 3, neutral: 2, enemy: 1, greatEnemy: 0.5, own: 4 }[rel] ?? 2;
}

/** Compare two signs by the ladder; returns { winner, step } (ties go to the first and say so). */
function strongerOfPair(a, b, chart) {
  const { signs, degrees } = chart;
  const occ = (s) => PLANETS.filter((p) => signs[p] === s).length;
  if ((occ(a) > 0) !== (occ(b) > 0)) return { winner: occ(a) > 0 ? a : b, step: 'occupied against vacant' };
  if (occ(a) !== occ(b)) return { winner: occ(a) > occ(b) ? a : b, step: 'more planets' };
  if (quality(a) !== quality(b)) return { winner: quality(a) > quality(b) ? a : b, step: 'natural strength (dual > fixed > movable)' };
  const lordScore = (s) => dignity(LORD[s], signs[LORD[s]], degrees[LORD[s]] ?? 0, signs);
  if (lordScore(a) !== lordScore(b)) return { winner: lordScore(a) > lordScore(b) ? a : b, step: 'dignity of the lord' };
  const deg = (s) => degrees[LORD[s]] ?? 0;
  if (deg(a) !== deg(b)) return { winner: deg(a) > deg(b) ? a : b, step: 'lord with more degrees' };
  const prati = (s) => (isOdd(s) ? !isOdd(signs[LORD[s]]) : isOdd(signs[LORD[s]]));
  if (prati(a) !== prati(b)) return { winner: prati(a) ? a : b, step: 'Prativeshika' };
  return { winner: a, step: 'equal on every step (lagna taken)' };
}

/** The dasha: start sign, direction, twelve signs of nine years, the Shoola signs. */
function niryanaShoola(chart) {
  const seventh = (chart.lagnaSign + 6) % 12;
  const { winner, step } = strongerOfPair(chart.lagnaSign, seventh, chart);
  const forward = isOdd(winner);
  const periods = Array.from({ length: 12 }, (_, i) => ({ sign: forward ? (winner + i) % 12 : (winner - i + 12) % 12, years: 9 }));
  const shoola = [0, 4, 8].map((k) => (forward ? (winner + k) % 12 : (winner - k + 12) % 12));
  return { id: 'niryaana-shoola', source: SOURCE, start: winner, forward, detail: { decidedBy: step, shoolaSigns: shoola, lagnaStronger: winner === chart.lagnaSign }, periods };
}

/** Signs a sign aspects (v.185-187 and Rasi Drishti): movable the fixed ones but the adjacent, fixed the movable but the adjacent, dual the other duals. */
function aspected(sign) {
  const q = quality(sign);
  const all = Array.from({ length: 12 }, (_, i) => i);
  if (q === 0) return all.filter((t) => quality(t) === 1 && t !== (sign + 1) % 12);
  if (q === 1) return all.filter((t) => quality(t) === 0 && t !== (sign + 11) % 12);
  return all.filter((t) => quality(t) === 2 && t !== sign);
}

module.exports = { SOURCE, LORD, aspected, dignity, strongerOfPair, niryanaShoola };
