/**
 * Sthira Dasha with Brahma chosen as Sanjay Rath gives it in "Jaimini Maharishi's Upadesa Sutras" (2.1.46-54, printed pp.159-161; 2.3.3-4, printed p.197), beside the
 * Brahma of Santhanam's BPHS translation that bphsRashiDashas.js builds. The two differ on the points below, and the event page shows both.
 *
 *  Rath 2.1.46-54 (read from the PDF, printed pp.159-161):
 *   1. the reference is the stronger of the lagna and the seventh (here: the Jaimini ladder of jaiminiShoola.js, which the book's own strength sutras 2.3.6-13 give);
 *   2. the lords of the 6th, 8th and 12th from it, "not placed in an odd sign or not in the visible half are disqualified" (the visible half is the seventh to the twelfth
 *      from the reference);
 *   3. the strongest of the qualifying lords is Brahma; if none qualifies the weaker of lagna and seventh is taken, then the condition of the visible half is dropped
 *      if a lord is in an odd sign of the invisible half, then the odd-sign condition;
 *   4. if Saturn, Rahu or Ketu becomes Brahma, the sixth planet in the order of the weekdays replaces it (Mars, Mercury, Jupiter); (printed p.160)
 *   5. several qualifying: the one with more degrees in its sign, Rahu's degrees counted from the end of the sign (printed p.161);
 *   6. the lord of the 8th from the Atmakaraka, if it stands in the 8th itself, qualifies as Brahma (2.1.53).
 *  2.3.4: the Sthira dasas begin from the sign occupied by Brahma; 2.3.3: seven, eight and nine years for movable, fixed and dual signs.
 *
 * Direction after Brahma's sign. The sutras do not state it; Rath's worked example (Chart 48, printed p.226: Brahma in Virgo, an even sign) runs the Sthira dasas
 * "regularly in the zodiacal order" (Virgo, Libra, Scorpio ...), so that is the reading `jaimini-sthira-zodiacal` follows. `jaimini-sthira` keeps the BPHS rule
 * (onward from an odd sign, backward from an even one), which is what gives Parashara's Light's Capricorn for the audit chart; with the printed zodiacal order the
 * audit chart gives Virgo. Where the text leaves the strength of two qualifying lords to the reader, the Jaimini ladder's dignity is used.
 */
const { strongerOfPair, dignity, LORD } = require('./jaiminiShoola');

const SOURCE = Object.freeze({
  title: "Jaimini Maharishi's Upadesa Sutras",
  author: 'Sanjay Rath',
  tradition: 'Jaimini',
  file: 'Jyotish_Jaimini upadesa sutras_S.Rath ban.pdf',
  pageLocus: 'Chapter II Quarter 1 stanzas 46-54 on Brahma, printed pp.159-161 (PDF page = printed + 10), and Chapter II Quarter 3 stanzas 3-4, printed p.197: '
    + '"The Sthira dasas begin from the sign occupied by Brahma"; "If Saturn, Rahu or Ketu become Brahma, then the sixth planet (reckoned in the order of weekdays) becomes Brahma"',
});

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const WEEKDAY = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
/** Rath's note on 2.1.50: Saturn is replaced by Mars, Rahu by Mercury and Ketu by Jupiter ("the sixth planet" counting Rahu and Ketu as the eighth and ninth). */
const REPLACEMENT = Object.freeze({ Saturn: 'Mars', Rahu: 'Mercury', Ketu: 'Jupiter' });
const isOdd = (s) => s % 2 === 0;
const years = (s) => [7, 8, 9][s % 3];

function lordsOf(sign) {
  return sign === 7 ? ['Mars'] : sign === 10 ? ['Saturn'] : [LORD[sign]];
}

/** Atmakaraka: the planet with the most degrees in its sign among the seven and Rahu (Rahu from the end of the sign); `degrees` are within the sign. */
function atmakaraka(chart) {
  const deg = (p) => (p === 'Rahu' ? 30 - chart.degrees[p] : chart.degrees[p]);
  return ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu'].sort((a, b) => deg(b) - deg(a))[0];
}

/**
 * @param chart { signs: {planet: sign}, degrees: {planet: deg in sign}, lagnaSign }
 * @returns { reference, referenceStep, qualifying, brahmaFound, brahma, replacedFrom, atmakaraka, sign }
 */
function brahmaRath(chart) {
  const { signs, degrees, lagnaSign } = chart;
  const seventh = (lagnaSign + 6) % 12;
  const first = strongerOfPair(lagnaSign, seventh, chart);
  const tryReference = (ref, requireVisible, requireOdd) => {
    const out = [];
    for (const h of [6, 8, 12]) {
      for (const l of lordsOf((ref + h - 1) % 12)) {
        const s = signs[l];
        const house = ((s - ref + 12) % 12) + 1;
        if (requireOdd && !isOdd(s)) continue;
        if (requireVisible && house < 7) continue;
        if (!out.includes(l)) out.push(l);
      }
    }
    return out;
  };
  let reference = first.winner;
  let qualifying = tryReference(reference, true, true);
  let relaxed = null;
  if (!qualifying.length) {
    reference = reference === lagnaSign ? seventh : lagnaSign;
    qualifying = tryReference(reference, true, true);
    relaxed = 'weaker reference';
  }
  if (!qualifying.length) { qualifying = tryReference(reference, false, true); relaxed = 'visible half dropped'; }
  if (!qualifying.length) { qualifying = tryReference(reference, false, false); relaxed = 'odd-sign condition dropped'; }
  const ak = atmakaraka(chart);
  // 2.1.53: the lord of the 8th from the Atmakaraka, if it stands in that 8th itself
  const eighthFromAk = (signs[ak] + 7) % 12;
  for (const l of lordsOf(eighthFromAk)) if (signs[l] === eighthFromAk && !qualifying.includes(l)) qualifying.push(l);
  if (!qualifying.length) return { reference, referenceStep: first.step, qualifying, brahma: null, sign: null, atmakaraka: ak, relaxed };
  const deg = (p) => (p === 'Rahu' ? 30 - degrees[p] : p === 'Ketu' ? degrees[p] : degrees[p]);
  const sorted = [...qualifying].sort((a, b) => (deg(b) - deg(a)) || (dignity(b, signs[b], degrees[b], signs) - dignity(a, signs[a], degrees[a], signs)));
  const found = sorted[0];
  const replacedFrom = REPLACEMENT[found] ? found : null;
  const brahma = replacedFrom ? REPLACEMENT[found] : found;
  return { reference, referenceStep: first.step, qualifying, brahmaFound: found, brahma, replacedFrom, atmakaraka: ak, relaxed, sign: signs[brahma] };
}

function jaiminiSthira(chart, { zodiacal = false } = {}) {
  const b = brahmaRath(chart);
  if (b.sign === null) return { id: 'jaimini-sthira', source: SOURCE, start: null, periods: [], detail: b, reasonTa: 'இந்த ஜாதகத்தில் ராத் நூலின் முறைப்படி பிரம்ம கிரகம் அமையவில்லை.' };
  const forward = zodiacal ? true : isOdd(b.sign);
  const periods = Array.from({ length: 12 }, (_, i) => {
    const s = forward ? (b.sign + i) % 12 : (b.sign - i + 12) % 12;
    return { sign: s, years: years(s) };
  });
  return { id: zodiacal ? 'jaimini-sthira-zodiacal' : 'jaimini-sthira', source: SOURCE, start: b.sign, forward, detail: b, periods };
}

module.exports = { jaiminiSthira, brahmaRath, atmakaraka, REPLACEMENT, SOURCE };
