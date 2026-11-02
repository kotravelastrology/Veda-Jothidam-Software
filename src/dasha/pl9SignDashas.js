/**
 * The sign dashas as the Parashara's Light 9 sample prints them (aniruddha_HC4, pages 48-61), each checked against the books of the library that describe it.
 *
 *  - Chara dasha (page 48): K.N. Rao, "Predicting through Jaimini's Chara Dasa", ch.3-4 and the notes (pp. "Calculation of Jaimini Chara Dasha"): the order from
 *    the lagna (Aries, Leo, Virgo, Libra, Aquarius, Pisces forward; Taurus, Gemini, Cancer, Scorpio, Sagittarius, Capricorn backward); the years are the count from
 *    the sign to its lord's sign (forward for Aries, Taurus, Gemini, Libra, Scorpio, Sagittarius, backward for the others) less one, twelve for a lord in its own sign,
 *    and NO year added for an exalted lord or taken for a debilitated one (his reason: a sign could then have no years); the special rules for Scorpio (Mars and Ketu)
 *    and Aquarius (Saturn and Rahu): the one in the sign is ignored, both in it give twelve, both away: the one with company is stronger, then the higher degree. The
 *    sub-periods are twelve equal parts in the direction of the sign's group, each sign taking its own part LAST. Rath's reading (jaiminiRashiDashas.js) adds and takes
 *    the year for exaltation and debilitation, and Vishnu Bhaskar calls that the majority view; the sample follows K.N. Rao.
 *  - Sthira dasha (page 50): Koch (Saptarishis, "Jaimini's Sthira Dasa") and Vishnu Bhaskar's summary of Jaimini 2.3.3-4: from the sign of the Brahma graha, onward, seven
 *    years for a movable sign, eight for a fixed, nine for a dual. Brahma is the stronger of the lords of the 6th, 8th and 12th from the stronger of the lagna and the
 *    seventh, Saturn, Rahu and Ketu left out. Strengths are B.V. Raman's numbers (Studies in Jaimini Astrology), as Koch tabulates them: a sign has its natural strength
 *    (dual 60, fixed 30, movable 15), 60 to 150 for its planets (one to seven) and 60 for each of Mercury, Jupiter and its own lord that aspects it; a planet has 60 to
 *    3.75 for its dignity, 60 to 3.75 for its place among the Chara Karakas and 60, 30 or 15 for the angle it makes with the Atmakaraka; a tie goes to the planet of more degrees.
 *  - Drig dasha (page 53; the sample prints its "Niryaana Shoola" pages 51-52 with the same table): the sign of the 9th from the lagna followed by the three signs it aspects,
 *    then the 10th and its three, then the 11th and its three (Jaimini 2.4.21-23 as Vishnu Bhaskar summarises it: the aspected signs forward from an odd movable or dual sign
 *    and from an even fixed sign, backward from the others). The sample's years are Rath's (the Chara years with the exaltation adjustment), not the nine years of the sutra.
 *  - Lagna Kendradi (page 59): from the stronger of the lagna and the seventh, the angles from it (1, 4, 7, 10 onward from an odd sign, 1, 10, 7, 4 backward from an even one), then the
 *    succeedents, then the cadents, as the Karaka Kendra dasha of Jaimini 2.4.11-13 is ordered from the Atmakaraka; years as for the Drig dasha.
 *  - Navamsha dasha (page 55): the twelve signs onward, the years the count forward to the lord's sign less one (Mars for Scorpio, Saturn for Aquarius), twelve in its own sign.
 *    The sample starts at Aries, the 9th from its Leo lagna; that this is the 9th from the lagna and not Aries itself is an inference from one chart. Jaimini 2.3.1-2 (nine
 *    years each, from the lagna or the seventh) is a different dasha.
 * A "chart" is { signs, degrees, longitudes?, lagnaSign } as the other sign-dasha engines take it. Signs run 0 = Aries to 11 = Pisces.
 */
const { signYears, atmakaraka } = require('./jaiminiRashiDashas');
const { strongerOfPair, aspected } = require('./jaiminiShoola');
const { d1Dignity, EXALTATION, DEBILITATION } = require('../chart/shadbala');

const LORD = Object.freeze(['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter']);
const CO_LORD = Object.freeze({ 7: 'Ketu', 10: 'Rahu' });
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const WEEK = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const mod12 = (n) => ((n % 12) + 12) % 12;
const quality = (s) => s % 3; // 0 movable, 1 fixed, 2 dual
const forwardDiff = (from, to) => mod12(to - from);
const backwardDiff = (from, to) => mod12(from - to);

/** K.N. Rao's direct group for counting: Aries, Taurus, Gemini, Libra, Scorpio, Sagittarius. */
const COUNTS_FORWARD = new Set([0, 1, 2, 6, 7, 8]);
/** K.N. Rao's direct order of the dasha and its sub-periods: Aries, Leo, Virgo, Libra, Aquarius, Pisces. */
const ORDER_FORWARD = new Set([0, 4, 5, 6, 10, 11]);

const degreeOf = (planet, chart) => chart.degrees[planet] ?? 0;
const companions = (planet, chart) => PLANETS.filter((p) => p !== planet && chart.signs[p] === chart.signs[planet]).length;

/** The years of one sign by K.N. Rao: the count to the lord's sign less one, twelve for the sign itself, no adjustment for exaltation or debilitation. */
function charaYearsKNRao(sign, chart) {
  const fwd = COUNTS_FORWARD.has(sign);
  const steps = (to) => (fwd ? forwardDiff(sign, to) : backwardDiff(sign, to));
  const lords = CO_LORD[sign] ? [LORD[sign], CO_LORD[sign]] : [LORD[sign]];
  let lord = lords[0];
  if (lords.length === 2) {
    const away = lords.filter((l) => chart.signs[l] !== sign);
    if (away.length === 0) return { years: 12, lord: lords[0], target: sign };
    if (away.length === 1) [lord] = away;
    else {
      const [a, b] = away;
      const ca = companions(a, chart);
      const cb = companions(b, chart);
      if ((ca > 0) !== (cb > 0)) lord = ca > 0 ? a : b;
      else lord = degreeOf(a, chart) >= degreeOf(b, chart) ? a : b;
    }
  }
  const target = chart.signs[lord];
  const years = steps(target);
  return { years: years === 0 ? 12 : years, lord, target };
}

/** Jaimini Chara dasha by K.N. Rao: the periods in order from the lagna. Each period's `order` is its twelve sub-periods, the sign's own last. */
function charaKNRao(chart) {
  const fwd = ORDER_FORWARD.has(chart.lagnaSign);
  const periods = Array.from({ length: 12 }, (_, i) => {
    const sign = mod12(chart.lagnaSign + (fwd ? i : -i));
    const dir = ORDER_FORWARD.has(sign) ? 1 : -1;
    return { sign, ...charaYearsKNRao(sign, chart), order: Array.from({ length: 12 }, (_, k) => mod12(sign + dir * (k + 1))) };
  });
  return { id: 'chara-pl9', start: chart.lagnaSign, forward: fwd, periods };
}

// ------------------------------------------------------------------------------------------------ Sthira

const PLANETS_IN_SIGN = [0, 60, 75, 90, 105, 120, 135, 150];
const DIGNITY_UNITS = { exalted: 60, moolatrikona: 45, own: 30, greatFriend: 22.5, friend: 22.5, neutral: 15, enemy: 7.5, greatEnemy: 7.5, debilitated: 3.75 };
const AMSA_UNITS = [60, 45, 30, 22.5, 15, 7.5, 3.75];
const KENDRA_UNITS = [60, 30, 15];

/** A sign's strength in B.V. Raman's numbers (Koch's table): its nature, its planets, and the aspects of Mercury, Jupiter and its lord. */
function signStrength(sign, chart) {
  const nature = [15, 30, 60][quality(sign)];
  const inside = PLANETS.filter((p) => chart.signs[p] === sign).length;
  const aspecting = ['Mercury', 'Jupiter', LORD[sign]].filter((p, i, a) => a.indexOf(p) === i && aspected(chart.signs[p]).includes(sign)).length;
  return nature + PLANETS_IN_SIGN[Math.min(7, inside)] + 60 * aspecting;
}

/** The dignity key as the worksheet words it (exalted and debilitated first, then the relationship to the sign's lord). */
function dignityOf(planet, chart) {
  const sign = chart.signs[planet];
  if (EXALTATION[planet]?.sign === sign) return 'exalted';
  if (DEBILITATION[planet]?.sign === sign) return 'debilitated';
  return d1Dignity(planet, sign, degreeOf(planet, chart), { ...chart.signs, Lagna: chart.lagnaSign });
}

/** The seven Chara Karakas in order of degree, Rahu and Ketu left out. */
function karakaOrder(chart) {
  return ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].sort((a, b) => degreeOf(b, chart) - degreeOf(a, chart));
}

/** A planet's strength in Raman's numbers: its dignity, its place among the Chara Karakas, its angle from the Atmakaraka. */
function planetStrength(planet, chart) {
  const karakas = karakaOrder(chart);
  const rank = karakas.indexOf(planet);
  const akSign = chart.signs[karakas[0]];
  const house = mod12(chart.signs[planet] - akSign) + 1; // the house from the Atmakaraka
  return (DIGNITY_UNITS[dignityOf(planet, chart)] ?? 15) + (rank >= 0 ? AMSA_UNITS[rank] : 0) + KENDRA_UNITS[(house - 1) % 3];
}

/** Brahma: the strongest of the lords of the 6th, 8th and 12th from the stronger of the lagna and the seventh, Saturn, Rahu and Ketu excepted. */
function brahma(chart) {
  const seventh = mod12(chart.lagnaSign + 6);
  const bl = signStrength(chart.lagnaSign, chart);
  const bs = signStrength(seventh, chart);
  const base = bl !== bs ? (bl > bs ? chart.lagnaSign : seventh) : strongerOfPair(chart.lagnaSign, seventh, chart).winner;
  const lords = [5, 7, 11].map((h) => LORD[mod12(base + h)]);
  let candidates = [...new Set(lords)].filter((p) => !['Saturn', 'Rahu', 'Ketu'].includes(p));
  let fallback = false;
  if (candidates.length === 0) {
    // every lord is Saturn: the sixth planet from him in the weekday order stands for him
    fallback = true;
    candidates = [...new Set(lords)].map((p) => WEEK[(WEEK.indexOf(p) + 5) % 9]);
  }
  candidates.sort((a, b) => planetStrength(b, chart) - planetStrength(a, chart) || degreeOf(b, chart) - degreeOf(a, chart));
  return { planet: candidates[0], sign: chart.signs[candidates[0]], base, candidates, fallback };
}

/** Sthira dasha: from the Brahma graha's sign onward, 7, 8 or 9 years by the nature of the sign. */
function sthiraPL9(chart) {
  const b = brahma(chart);
  const periods = Array.from({ length: 12 }, (_, i) => {
    const sign = mod12(b.sign + i);
    return { sign, years: [7, 8, 9][quality(sign)] };
  });
  return { id: 'sthira-pl9', start: b.sign, forward: true, detail: { brahma: b.planet, strongerOfLagnaAndSeventh: b.base }, periods };
}

// ------------------------------------------------------------------------------------------------ Drig, Kendradi, Navamsha

/** The three signs a sign aspects, forward or backward from it. */
function aspectedInOrder(sign, forward) {
  const list = aspected(sign);
  const key = (s) => (forward ? mod12(s - sign) : mod12(sign - s));
  return [...list].sort((a, b) => key(a) - key(b));
}

/** Drig dasha: the 9th, 10th and 11th from the lagna, each followed by the signs it aspects; Rath's years. */
function drigPL9(chart) {
  const order = [];
  for (const h of [8, 9, 10]) {
    const sign = mod12(chart.lagnaSign + h);
    // movable and dual signs: onward from an odd sign, backward from an even one; fixed signs: onward from an even sign, backward from an odd one
    const odd = sign % 2 === 0; // Aries (0) is odd
    const forward = quality(sign) === 1 ? !odd : odd;
    order.push(sign, ...aspectedInOrder(sign, forward));
  }
  const periods = order.map((sign) => ({ sign, ...signYears(sign, chart) }));
  return { id: 'drig-pl9', start: order[0], forward: true, periods };
}

/** Lagna Kendradi: from the stronger of the lagna and the seventh, the angles, the succeedents, the cadents; Rath's years. */
function kendradiPL9(chart) {
  const { winner } = strongerOfPair(chart.lagnaSign, mod12(chart.lagnaSign + 6), chart);
  const odd = winner % 2 === 0;
  const houses = odd ? [1, 4, 7, 10, 2, 5, 8, 11, 3, 6, 9, 12] : [1, 10, 7, 4, 12, 9, 6, 3, 11, 8, 5, 2];
  const periods = houses.map((h) => ({ sign: mod12(winner + h - 1), ...signYears(mod12(winner + h - 1), chart) }));
  return { id: 'kendradi-pl9', start: winner, forward: odd, periods };
}

/** Navamsha dasha: the signs onward from the 9th from the lagna, the years the forward count to the lord's sign less one. */
function navamshaPL9(chart) {
  const start = mod12(chart.lagnaSign + 8);
  const periods = Array.from({ length: 12 }, (_, i) => {
    const sign = mod12(start + i);
    const lord = LORD[sign];
    const target = chart.signs[lord];
    const d = forwardDiff(sign, target);
    return { sign, years: d === 0 ? 12 : d, lord, target };
  });
  return { id: 'navamsha-pl9', start, forward: true, periods };
}

module.exports = {
  charaYearsKNRao, charaKNRao, signStrength, planetStrength, brahma, sthiraPL9, drigPL9, kendradiPL9, navamshaPL9, aspectedInOrder,
};
