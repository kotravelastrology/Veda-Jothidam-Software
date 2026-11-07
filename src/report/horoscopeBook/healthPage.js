/**
 * Horoscope book, page 19 (PL9 sample aniruddha_HC4, "Health - Influence of Grahas on Physiology"): the Sookshma and Sthoola
 * schemes for each graha.
 *
 * Sookshma (minute) scheme: the limb of the decanate (BPHS ch.12 v.12-15, printed pp.94-96; healthBphs.js) that the graha's own
 * house and decanate, counted from the Ascendant, name. Sthoola (broad) scheme: the two limbs of the graha's house and of the
 * house five places from it (the 5th from the graha's house, which is the house four places on), from the twelve limbs of
 * Kalapurusha (BPHS ch.4 v.4-4.5; printed p.27). The sthoola pairing is the rule that matches all nine grahas on this birth,
 * and is not stated in the book; it is kept as the sample prints it.
 *
 * Not built: the Nakshatra scheme. Its second opinion matches a nakshatra body-part list in the library, but the first
 * opinion has no source identified, and the Rahu entry disagrees with that list. Rahu's Sookshma limb also differs from PL9
 * (PL9 Right chest; BPHS, as healthBphs.js reads it, Right stomach), a difference of printed source at the sixth house's
 * second decanate.
 *
 * Returns a Promise of { title, subtitle, blocks }, in the printSets shape.
 */
const { withBirth } = require('./charts');
const H = require('../healthBphs');

const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

const capitalise = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

/** A Sookshma limb as the page prints it: "Right Shoulder", "Left Calf", "Head (both)". */
function sookshmaText({ limb, side }) {
  return side === 'BOTH' ? `${limb} (both)` : `${capitalise(side)} ${limb}`;
}

/** Page 19: the Sookshma and Sthoola limbs of the nine grahas. */
function buildPage19({ name = '', birth }) {
  return withBirth(birth, ({ chart }) => {
    const lagnaSign = Math.floor(chart.lagna.longitude / 30);
    const placed = GRAHAS.map((graha) => {
      const lon = chart.grahas[graha].longitude;
      const house = ((Math.floor(lon / 30) - lagnaSign + 12) % 12) + 1;
      const decanate = Math.floor((lon % 30) / 10);
      const fifth = ((house + 3) % 12) + 1;
      return {
        graha,
        sookshma: sookshmaText(H.sookshmaLimb(house, decanate)),
        sthoola: [H.STHOOLA[fifth - 1][0], H.STHOOLA[house - 1][0]],
      };
    });

    return {
      title: `ஜாதகம் — ${name}`.trim(),
      subtitle: `${birth.placeName} · ${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year}`,
      blocks: [
        {
          kind: 'table',
          heading: 'Sookshma Scheme',
          columns: ['Planet', 'Body Part'],
          rows: placed.map((p) => [p.graha, p.sookshma]),
          note: 'The limb of the graha\'s house and decanate, counted from the Ascendant (BPHS ch.12 v.12-15, printed pp.94-96).',
        },
        {
          kind: 'table',
          heading: 'Sthoola Scheme',
          columns: ['Planet', 'Body Part', 'Body Part'],
          rows: placed.map((p) => [p.graha, ...p.sthoola]),
          note: 'The limbs of the graha\'s house and of the house five places from it, from the twelve limbs of Kalapurusha '
            + '(BPHS ch.4 v.4-4.5, printed p.27).',
        },
      ],
    };
  });
}

module.exports = { buildPage19, sookshmaText };
