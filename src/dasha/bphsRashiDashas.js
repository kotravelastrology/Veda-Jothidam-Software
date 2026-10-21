/**
 * The sign dashas of Brihat Parashara Hora Shastra chapter 46 that the printed text gives a complete rule for:
 * Chara (vv.155-167), Sthira with its Brahma Graha (vv.168-173), Yogardha (v.174), Mandooka (vv.179-180), Dirga
 * (vv.185-187) and Lagnadi (vv.188-190)
 * (R. Santhanam's translation, Vol.2: printed pp.553-558, 560, 564; PDF page = printed - 489).
 *
 * Signs are 0 = Aries … 11 = Pisces; "odd sign" = Aries, Gemini … (even index). A sign's *pada* is its group of three
 * from Aries (Aries-Gemini odd, Cancer-Virgo even, Libra-Sagittarius odd, Capricorn-Pisces even); odd pada counts
 * forward, even pada counts backward (v.156). Years are signs counted, one less than the inclusive count, and a lord
 * in its own sign gives 12 (v.158-166). The dasha starts at birth — there is no balance.
 *
 * Every rule is as printed. Where the printed worked example disagrees with the printed rule (Chara: Scorpio and
 * Capricorn; Yogardha: Leo) both are kept and the test lists the cells.
 *
 * Not built (rule incomplete or its example does not follow it): Kendradi, Trikona, Shoola, Navamsha,
 * Narayana, Drig, Padanadhamsa — see DECLARED_TA.
 */

const JS_SOURCE = require('./jaiminiShoola').SOURCE;
const JR_SOURCE = require('./jaiminiRashiDashas').SOURCE;
const BPHS_RASHI = Object.freeze({
  title: 'Brihat Parashara Hora Shastra (BPHS)',
  author: 'R. Santhanam (translation)',
  file: 'Jyotish_BPHS_Santhanam_Vol.2.pdf',
  tradition: 'Parashari',
});
const locus = (pages, quote) => Object.freeze({ ...BPHS_RASHI, pageLocus: `Chapter 46, printed ${pages}: ${quote}` });

const SOURCES = Object.freeze({
  'niryaana-shoola': JS_SOURCE,
  'jaimini-chara': JR_SOURCE,
  narayana: JR_SOURCE,
  chara: locus('pp.553-556 vv.155-167', '"The number of years of Dasa is reckoned from the Rasi up to the house in which its lord is posited … for the odd padas counting is done from Rasi onwards … for the even padas in the reverse order"'),
  sthira: locus('pp.556-558 vv.168-173', '"7 years, 8 years and 9 years are the Dasa spans of the movable, fixed and dual signs … begins from the Brahma Grahashrit rasi"'),
  yogardha: locus('p.560 v.174', '"The spans of Dasas of the signs in the Yogardha Dasa system are half of the total of the Chara and Sthira Dasas"'),
  dirga: locus('pp.567-568 vv.185-187', '"The ninth sign from the Ascendant, the signs aspected by it, the tenth, the signs aspected by it, the eleventh, the signs aspected by it … Movable, Fixed and Dual signs from the 9th, 10th and 11th houses"'),
  lagnadi: locus('pp.569-570 vv.188-190', '"Multiply the Bhayat by 12 and divide by Bhabhog … add to the longitude of the Lagna … from that rasi will start the Dasas of the 12 signs"'),
  yogini: locus('pp.571-572 vv.195-199', '"Add 3 to the Janma nakshatra and divide it by 8. The remainder will indicate the Yogini Dasa of Mangala, Pingala, Dhanya, Bhramari, Bhadrika, Ulka, Siddha and Sankata ... of 1, 2, 3, 4, 5, 6, 7 and 8 years"'),
  mandooka: locus('p.564 vv.179-180', '"Every Dasa is of the next 3rd sign (after leaving out two signs)"'),
});

const SIGN_LORDS = Object.freeze({
  0: ['Mars'], 1: ['Venus'], 2: ['Mercury'], 3: ['Moon'], 4: ['Sun'], 5: ['Mercury'],
  6: ['Venus'], 7: ['Mars', 'Ketu'], 8: ['Jupiter'], 9: ['Saturn'], 10: ['Saturn', 'Rahu'], 11: ['Jupiter'],
});
const EXALTED = Object.freeze({ Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 });
const DEBILITATED = Object.freeze(Object.fromEntries(Object.entries(EXALTED).map(([p, s]) => [p, (s + 6) % 12])));
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

const isOddSign = (s) => s % 2 === 0;
const isOddPada = (s) => Math.floor(s / 3) % 2 === 0;
const quality = (s) => s % 3; // 0 movable, 1 fixed, 2 dual
const strengthRank = (s) => [0, 1, 2][quality(s)];
const forward = (from, to) => (to - from + 12) % 12;
const backward = (from, to) => (from - to + 12) % 12;

/** Which planets stand in each sign (Rahu and Ketu included; `signs` holds Rahu, Ketu as given). */
function occupants(signs) {
  const occ = Array.from({ length: 12 }, () => []);
  for (const p of PLANETS) occ[signs[p]].push(p);
  return occ;
}

/**
 * The stronger of two signs by the printed order (vv.158-166): a planet in exaltation first, then the one with more
 * planets, then the stronger kind (dual over fixed over movable), then the larger count. `count` is the number of
 * signs counted to it, given by the caller. Returns the winning argument.
 */
function stronger(a, b, occ) {
  const exalted = (s) => occ[s.sign].some((p) => EXALTED[p] === s.sign);
  if (exalted(a) !== exalted(b)) return exalted(a) ? a : b;
  if (occ[a.sign].length !== occ[b.sign].length) return occ[a.sign].length > occ[b.sign].length ? a : b;
  if (strengthRank(a.sign) !== strengthRank(b.sign)) return strengthRank(a.sign) > strengthRank(b.sign) ? a : b;
  return (a.count ?? 0) >= (b.count ?? 0) ? a : b;
}

/** Stronger of two signs when no count is involved (lagna against its seventh, etc.). Ties go to the first. */
function strongerSign(a, b, occ) {
  return stronger({ sign: a, count: 1 }, { sign: b, count: 0 }, occ).sign;
}

/** Years of one sign in Chara Dasa (vv.155-166). Returns years and the sign counted up to. */
function charaYears(sign, signs, occ) {
  const odd = isOddPada(sign);
  const count = (to) => (odd ? forward(sign, to) : backward(sign, to));
  const lords = SIGN_LORDS[sign];
  let target;
  let note = null;
  if (lords.length === 1) {
    target = signs[lords[0]];
  } else {
    const places = lords.map((l) => signs[l]);
    const own = places.map((p) => p === sign);
    if (own[0] && own[1]) target = sign;
    else if (own[0] || own[1]) target = own[0] ? places[1] : places[0];
    else {
      const a = { sign: places[0], count: count(places[0]) };
      const b = { sign: places[1], count: count(places[1]) };
      target = stronger(a, b, occ).sign;
      note = 'two lords elsewhere: stronger sign';
    }
  }
  let years = count(target);
  if (years === 0) years = 12;
  const exalted = occ[target].some((p) => EXALTED[p] === target);
  const debilitated = occ[target].some((p) => DEBILITATED[p] === target);
  if (exalted && !debilitated) years += 1;
  if (debilitated && !exalted) years -= 1;
  return { years, target, note };
}

/**
 * The Brahma Graha (vv.170-173): among the lords of the 6th, 8th and 12th from the stronger of lagna and the 7th, the
 * one standing in an odd sign within the six signs counted backward from that house (the house itself included); the
 * one with the most degrees if several, the stronger if equal. A planet in the 8th also counts (printed note).
 */
function brahmaGraha(chart) {
  const { signs, lagnaSign, degrees } = chart;
  const occ = occupants(signs);
  const base = strongerSign(lagnaSign, (lagnaSign + 6) % 12, occ);
  const window = new Set(Array.from({ length: 6 }, (_, i) => (base - i + 12) % 12));
  const lordsOf = (house) => SIGN_LORDS[(base + house - 1) % 12].filter((l) => l !== 'Ketu');
  const candidates = new Set();
  for (const h of [6, 8, 12]) for (const l of lordsOf(h)) if (isOddSign(signs[l]) && window.has(signs[l])) candidates.add(l);
  for (const p of occ[(base + 7) % 12]) candidates.add(p);
  const list = [...candidates];
  if (!list.length) return { base, planet: null, sign: null };
  const deg = (p) => (p === 'Rahu' || p === 'Ketu' ? 30 - degrees[p] : degrees[p]);
  list.sort((a, b) => deg(b) - deg(a));
  return { base, planet: list[0], sign: signs[list[0]], candidates: list };
}

const stheraYears = (s) => [7, 8, 9][quality(s)];

/** One 12-sign cycle as [{ sign, years }] in the order the system names. */
function order(start, odd) {
  return Array.from({ length: 12 }, (_, i) => (odd ? (start + i) % 12 : (start - i + 12) % 12));
}

function chara(chart) {
  const occ = occupants(chart.signs);
  const ninth = (chart.lagnaSign + 8) % 12;
  const odd = isOddPada(ninth);
  return {
    id: 'chara', source: SOURCES.chara, start: chart.lagnaSign, forward: odd,
    detail: { ninthSign: ninth },
    periods: order(chart.lagnaSign, odd).map((s) => ({ sign: s, ...charaYears(s, chart.signs, occ) })),
  };
}

function sthira(chart) {
  const b = brahmaGraha(chart);
  if (b.sign === null) return { id: 'sthira', source: SOURCES.sthira, start: null, periods: [], detail: b, reasonTa: 'இந்த ஜாதகத்தில் நூல் சொல்லும் பிரம்ம கிரகம் அமையவில்லை.' };
  const odd = isOddSign(b.sign);
  return { id: 'sthira', source: SOURCES.sthira, start: b.sign, forward: odd, detail: b, periods: order(b.sign, odd).map((s) => ({ sign: s, years: stheraYears(s) })) };
}

function yogardha(chart) {
  const occ = occupants(chart.signs);
  const start = strongerSign(chart.lagnaSign, (chart.lagnaSign + 6) % 12, occ);
  const odd = isOddSign(start);
  return {
    id: 'yogardha', source: SOURCES.yogardha, start, forward: odd, detail: {},
    periods: order(start, odd).map((s) => ({ sign: s, years: (charaYears(s, chart.signs, occ).years + stheraYears(s)) / 2 })),
  };
}

function mandooka(chart) {
  const occ = occupants(chart.signs);
  const start = strongerSign(chart.lagnaSign, (chart.lagnaSign + 6) % 12, occ);
  const odd = isOddSign(start);
  const step = odd ? 3 : -3;
  const seq = [];
  for (let k = 0; k < 3; k += 1) for (let j = 0; j < 4; j += 1) seq.push(((start + (odd ? k : -k) + step * j) % 12 + 12) % 12);
  return { id: 'mandooka', source: SOURCES.mandooka, start, forward: odd, detail: {}, periods: seq.map((s) => ({ sign: s, years: stheraYears(s) })) };
}

/** Dirga Dasa: the 9th, 10th and 11th signs each followed by the signs it aspects, nearest first in the kind's direction. */
function dirga(chart) {
  const seq = [];
  for (const house of [9, 10, 11]) {
    const sign = (chart.lagnaSign + house - 1) % 12;
    const q = quality(sign);
    const onward = q === 1 || (q === 2 && isOddSign(sign));
    const dist = (t) => (onward ? forward(sign, t) : backward(sign, t));
    seq.push(sign, ...aspected(sign).sort((a, b) => dist(a) - dist(b)));
  }
  // A sign reached twice keeps its first place; the verse does not say what to do about the signs then left out
  // (in the printed chart the 9th, 10th and 11th are movable, fixed, dual in that order and cover all twelve).
  const distinct = [...new Set(seq)];
  const missing = Array.from({ length: 12 }, (_, i) => i).filter((s) => !distinct.includes(s));
  return {
    id: 'dirga', source: SOURCES.dirga, start: seq[0], forward: null, detail: { missing },
    reasonTa: missing.length ? 'இந்த லக்னத்தில் 9, 10, 11-ஆம் ராசிகளும் அவை பார்க்கும் ராசிகளும் சில ராசிகளை இருமுறை தொடுகின்றன; விடுபட்ட ராசிகளுக்கு நூல் வரிசை சொல்லவில்லை (நூலின் எடுத்துக்காட்டில் 9, 10, 11 முறையே சர, ஸ்திர, உபயம் என்பதால் 12-ம் வருகின்றன).' : null,
    periods: distinct.map((s) => ({ sign: s, years: stheraYears(s) })),
  };
}

/**
 * Lagnadi Rasi Dasa (vv.188-190): the elapsed part of the birth star (as a fraction of the star) times 12 signs is added
 * to the lagna longitude; the sign reached starts the twelve signs (onward if odd, backward if even) with Sthira years,
 * and the first has run `degree/30` of its years. `moonFraction` is the elapsed fraction of the Moon's star.
 */
function lagnadi(chart) {
  const lagnaLongitude = chart.lagnaLongitude ?? chart.lagnaSign * 30;
  const total = (((lagnaLongitude + chart.moonFraction * 360) % 360) + 360) % 360;
  const start = Math.floor(total / 30);
  const expired = total - start * 30;
  const odd = isOddSign(start);
  const periods = order(start, odd).map((s) => ({ sign: s, years: stheraYears(s) }));
  const balance = periods[0].years - (expired * periods[0].years) / 30;
  periods[0] = { ...periods[0], fullYears: periods[0].years, years: balance };
  return { id: 'lagnadi', source: SOURCES.lagnadi, start, forward: odd, detail: { expiredDegrees: expired, balanceYears: balance }, periods };
}

const JS = require('./jaiminiShoola');
const JR = require('./jaiminiRashiDashas');
const { aspected } = JS;

const SYSTEMS = { chara, sthira, yogardha, mandooka, dirga, lagnadi, 'niryaana-shoola': JS.niryanaShoola, 'jaimini-chara': JR.jaiminiChara, narayana: JR.narayana };
const NAMES_TA = { chara: 'சர தசை', sthira: 'ஸ்திர தசை', yogardha: 'யோகார்த்த தசை', mandooka: 'மண்டூக தசை', dirga: 'தீர்க்க (த்ருக்) தசை', lagnadi: 'லக்னாதி ராசி தசை', 'niryaana-shoola': 'நிர்யாண சூல தசை (ஜைமினி)', 'jaimini-chara': 'சர தசை (ஜைமினி — ராத்)', narayana: 'நாராயண தசை (ஜைமினி)' };

const DECLARED_TA = Object.freeze({
  'lagna-kendradi-rashi': 'கேந்திராதி: "பலத்தின் வரிசை", "பாணபர/அபோக்லிம" ஆகியவற்றுக்கு நூல் அளவுகோல் தரவில்லை; எடுத்துக்காட்டு அட்டவணையின் ஆண்டுகள் அதன் உரையுடன் பொருந்தவில்லை.',
  trikona: 'திரிகோண: எடுத்துக்காட்டு அட்டவணையின் ஆண்டுகள் (11, 11, 6, 10…) "சர தசை போன்றது" என்ற விதியுடன் பொருந்தவில்லை.',
  shoola: 'சூல: 2-ஆம்/8-ஆம் வீடுகளில் எது வலிது என்று தீர்மானிக்கும் முறையை நூல் எடுத்துக்காட்டில் மட்டுமே தருகிறது (அதிபதிகளின் ஒப்பீடு), விதியாக அல்ல.',
});

/** Dates for a period list: `birthMs` plus cumulative years (365.25 days). */
function schedule(result, birthMs, cycles = 1) {
  const out = [];
  let t = birthMs;
  const ms = 365.25 * 86400000;
  for (let c = 0; c < cycles; c += 1) {
    for (const p of result.periods) {
      const end = t + p.years * ms;
      out.push({ ...p, cycle: c + 1, startMs: t, endMs: end });
      t = end;
    }
  }
  return out;
}

module.exports = {
  BPHS_RASHI, SOURCES, SIGN_LORDS, EXALTED, DEBILITATED, PLANETS, SYSTEMS, NAMES_TA, DECLARED_TA,
  isOddSign, isOddPada, occupants, strongerSign, charaYears, brahmaGraha, chara, sthira, yogardha, mandooka, dirga, lagnadi, aspected, schedule,
};
