/**
 * Kala Chakra dasha by BPHS (Santhanam, ch.46 vv.52-111; antardashas ch.64 and the note to ch.46 v.91), the reckoning the PL9 sample prints.
 *
 *  - The 27 nakshatras fall in four groups, the Savya chakra (15) and the Apsavya (12) (vv.56-58, 65, 71-72, 77): the Savya "Ashwini" group
 *    (Ashwini, Krittika, Punarvasu, Ashlesha, Hasta, Swati, Moola, Uttarashada, Poorvabhadra, Revati) and the Bharani group (Bharani, Pushya, Chitra,
 *    Poorvashada, Uttarabhadra); the Apsavya Rohini group (Rohini, Makha, Visakha, Sravana) and the Mrigasira group (Mrigasira, Ardra, Purvaphalguni,
 *    Uttaraphalguni, Anuradha, Jyeshtha, Dhanishta, Satabhisha).
 *  - Each pada has a sequence of nine signs (vv.60-70, 73-81), the dasha signs in order; the first is the Deha sign and the last the Jeeva sign in the Savya
 *    chakra, the reverse in the Apsavya (vv.94-95). The sequences of the Apsavya groups are those of the Savya groups reversed, with the padas in reverse order
 *    (the translation of vv.73-81 reads so in every pada that is legible). The Savya padas are checked by their years, which sum to the Poorna Ayu of v.89:
 *    100, 85, 83 and 86 for the four padas of a group.
 *  - The years of the signs (v.84): Aries 7, Taurus 16, Gemini 9, Cancer 21, Leo 5, Virgo 9, Libra 16, Scorpio 7, Sagittarius 10, Capricorn 4, Aquarius 4, Pisces 10.
 *  - The balance at birth (vv.90-91 and the worked example): the pada's total years times the share of the pada the Moon has passed is the expired part; it is
 *    taken off the sequence's years in order, and the sign it ends in has the balance. Here the share is by longitude.
 *  - The antardashas (as the sample prints them; Rath's Jaimini Upadesa Sutras 2.4.13 for the start): twelve equal parts of a dasha, from the sign itself or the
 *    seventh from it, whichever is the stronger (jaiminiShoola.strongerOfPair), onward if that sign is odd and backward if even. The pratyantardashas divide an
 *    antardasha the same way.
 * After a pada's nine signs the dasha goes on with the next pada's sequence.
 */
const { strongerOfPair } = require('./jaiminiShoola');

const SIGN_YEARS = [7, 16, 9, 21, 5, 9, 16, 7, 10, 4, 4, 10];
const NAK_SPAN = 360 / 27;
const [Ari, Tau, Gem, Can, Leo, Vir, Lib, Sco, Sag, Cap, Aqu, Pis] = Array.from({ length: 12 }, (_, i) => i);

/** Savya chakra: the nine-sign sequences of the four padas of the two groups. */
const SAVYA = {
  ashwini: [
    [Ari, Tau, Gem, Can, Leo, Vir, Lib, Sco, Sag],
    [Cap, Aqu, Pis, Sco, Lib, Vir, Can, Leo, Gem],
    [Tau, Ari, Pis, Aqu, Cap, Sag, Ari, Tau, Gem],
    [Can, Leo, Vir, Lib, Sco, Sag, Cap, Aqu, Pis],
  ],
  bharani: [
    [Sco, Lib, Vir, Can, Leo, Gem, Tau, Ari, Pis],
    [Aqu, Cap, Sag, Ari, Tau, Gem, Can, Leo, Vir],
    [Lib, Sco, Sag, Cap, Aqu, Pis, Sco, Lib, Vir],
    [Can, Leo, Gem, Tau, Ari, Pis, Aqu, Cap, Sag],
  ],
};
/** Apsavya: the Savya groups reversed, pada by pada from the last. */
const reversed = (padas) => padas.map((_, i) => [...padas[3 - i]].reverse());
const APSAVYA = { mrigasira: reversed(SAVYA.ashwini), rohini: reversed(SAVYA.bharani) };

const GROUP_OF = {};
for (const n of [0, 2, 6, 8, 12, 14, 18, 20, 24, 26]) GROUP_OF[n] = { chakra: 'savya', group: 'ashwini' };
for (const n of [1, 7, 13, 19, 25]) GROUP_OF[n] = { chakra: 'savya', group: 'bharani' };
for (const n of [3, 9, 15, 21]) GROUP_OF[n] = { chakra: 'apsavya', group: 'rohini' };
for (const n of [4, 5, 10, 11, 16, 17, 22, 23]) GROUP_OF[n] = { chakra: 'apsavya', group: 'mrigasira' };

const sequenceOf = (nakshatra, pada) => {
  const g = GROUP_OF[nakshatra];
  return (g.chakra === 'savya' ? SAVYA : APSAVYA)[g.group][pada - 1];
};
const sum = (seq) => seq.reduce((n, s) => n + SIGN_YEARS[s], 0);

/** The pada after (nakshatra, pada), through the 108 in order. */
function nextPada(nakshatra, pada) {
  return pada === 4 ? { nakshatra: (nakshatra + 1) % 27, pada: 1 } : { nakshatra, pada: pada + 1 };
}

/**
 * The mahadashas from birth, in years from birth.
 * @param {number} moonLongitude sidereal
 * @param {number} count how many mahadashas
 */
function kalachakraMahadashas(moonLongitude, count = 12) {
  const lon = ((moonLongitude % 360) + 360) % 360;
  const nakshatra = Math.floor(lon / NAK_SPAN) % 27;
  const within = lon - nakshatra * NAK_SPAN;
  const pada = Math.floor(within / (NAK_SPAN / 4)) + 1;
  const share = (within % (NAK_SPAN / 4)) / (NAK_SPAN / 4);
  const g = GROUP_OF[nakshatra];
  const seq = sequenceOf(nakshatra, pada);
  const total = sum(seq);
  const expired = total * share;
  const deha = g.chakra === 'savya' ? seq[0] : seq[8];
  const jeeva = g.chakra === 'savya' ? seq[8] : seq[0];

  const mahas = [];
  let at = { nakshatra, pada };
  let signs = seq;
  let index = 0;
  let begin = -expired; // the sequence's start, in years from birth
  while (mahas.length < count) {
    const s = signs[index];
    const years = SIGN_YEARS[s];
    const start = begin;
    const end = begin + years;
    if (end > 1e-9) {
      mahas.push({
        sign: s, years: end - Math.max(start, 0), startYears: Math.max(start, 0), endYears: end,
        fullYears: years, ...(start < -1e-9 ? { fullStartYears: start } : {}),
        // the pada whose sequence this sign belongs to: its Navamsha sign (BPHS ch.65 calls it the Amsa), the sign's place in the sequence, and the chakra
        amsa: (at.nakshatra * 4 + at.pada - 1) % 12, position: index + 1, chakra: GROUP_OF[at.nakshatra].chakra,
      });
    }
    begin = end;
    index += 1;
    if (index === signs.length) {
      at = nextPada(at.nakshatra, at.pada);
      signs = sequenceOf(at.nakshatra, at.pada);
      index = 0;
    }
  }
  return {
    nakshatra, pada, chakra: g.chakra, group: g.group, deha, jeeva, totalYears: total, expiredYears: expired, balanceYears: mahas[0].years, mahas,
  };
}

/**
 * The twelve signs of a period for the sign `sign`: the start (the sign or its seventh, the stronger), then onward from an odd sign and backward from an even one.
 * @param chart { signs, degrees, lagnaSign } as strongerOfPair takes them
 */
function walkOf(sign, chart) {
  const { winner } = strongerOfPair(sign, (sign + 6) % 12, chart);
  const forward = winner % 2 === 0; // Aries (0) and the other odd-numbered signs go onward
  return Array.from({ length: 12 }, (_, i) => (forward ? (winner + i) % 12 : (winner - i + 12) % 12));
}

/**
 * The twelve equal parts of a period ({ sign, startYears, endYears, fullStartYears? }); a part that ended before birth is marked `elapsed`.
 */
function subPeriods(period, chart) {
  const fullStart = period.fullStartYears ?? period.startYears;
  const part = (period.endYears - fullStart) / 12;
  return walkOf(period.sign, chart).map((sign, i) => {
    const s = fullStart + i * part;
    const e = s + part;
    if (e <= 1e-9) return { sign, elapsed: true, startYears: s, endYears: e };
    return { sign, startYears: Math.max(s, period.startYears), endYears: e, ...(s < period.startYears - 1e-9 ? { fullStartYears: s } : {}) };
  });
}

module.exports = { SIGN_YEARS, SAVYA, APSAVYA, GROUP_OF, sequenceOf, kalachakraMahadashas, walkOf, subPeriods };
