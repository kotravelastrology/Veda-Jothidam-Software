/**
 * Horoscope book, planet pages (PL9 sample aniruddha_HC4): page 9 (Planetary Friendship: the natural, temporal
 * and compound relations of the seven classical planets) and page 10 (Shodashvarga summary: the sign of the
 * Ascendant and each planet in the sixteen vargas, the dignity in each, and the Vimshopaka strengths).
 * The nodes (Rahu, Ketu) are not built: the engine has no sourced natural relation or dignity table for them.
 * Each builder returns a Promise of { title, subtitle, blocks }, in the printSets shape.
 */
const { naturalRelation, temporaryRelation, compoundRelationship } = require('../../chart/planetaryRelationship');
const { dignityOfSign } = require('../../chart/shadbala');
const { vimshopaka } = require('../../chart/vimshopaka');
const { dignityOf } = require('../phaladeepikaGocharaTables');
const { vargaSign, withBirth } = require('./charts');

const NOT_BUILT = 'கட்டப்படவில்லை';
const CLASSICAL = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const PLANETS = [...CLASSICAL, 'Rahu', 'Ketu'];
const RASI_ABBR = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];
const SHODASHVARGA = [
  ['Janma', 'D1'], ['Hora', 'D2'], ['Dreshkana', 'D3'], ['Chaturthamsha', 'D4'], ['Saptamsha', 'D7'], ['Navamsha', 'D9'],
  ['Dashamsha', 'D10'], ['Dwadashamsha', 'D12'], ['Shodashamsha', 'D16'], ['Vimshamsha', 'D20'], ['Chaturvimshamsha', 'D24'],
  ['Saptavimshamsha', 'D27'], ['Trimshamsha', 'D30'], ['Khavedamsha', 'D40'], ['Akshavedamsha', 'D45'], ['Shashtiamsha', 'D60'],
];
const DIGNITY_LABEL = {
  moolatrikona: 'Moolt.', own: 'Own', greatFriend: 'Grt.Fr.', friend: 'Frnd.', neutral: 'Neutr.', enemy: 'Enemy', greatEnemy: 'Grt.En.',
};
const VIMSHOPAKA_SCHEMES = [
  ['Shadavarga', 'shadvarga'], ['Saptavarga', 'saptavarga'], ['Dashavarga', 'dasavarga'], ['Shodashavarga', 'shodasavarga'],
];

/** Panchadha lists per planet for one relation rule; Rahu and Ketu are left out (not built). */
function relationRows(relationOf) {
  return CLASSICAL.map((planet) => {
    const buckets = {};
    for (const other of CLASSICAL) {
      if (other === planet) continue;
      const key = relationOf(planet, other);
      (buckets[key] ??= []).push(other);
    }
    return [planet, buckets];
  });
}

/** Dignity label of a classical planet in a sign: exaltation and debilitation first, then own, moolatrikona and the relation to the sign lord. */
function dignityLabel(planet, sign, positions) {
  const exact = dignityOf(planet, sign);
  if (exact.exalted) return 'Exalt.';
  if (exact.debilitated) return 'Debil.';
  return DIGNITY_LABEL[dignityOfSign(planet, sign, positions)];
}

/**
 * Page 9: Naisargik (natural), Tatkalika (temporal) and Panchadha (compound) friendship of the classical planets,
 * from the Rasi positions. Rahu and Ketu have no sourced relation, so they are left out and the note says so.
 */
function buildPage9({ name = '', birth }) {
  return withBirth(birth, ({ chart }) => {
    const positions = Object.fromEntries(CLASSICAL.map((p) => [p, chart.grahas[p].rasiIndex]));
    const natural = relationRows((p, q) => naturalRelation(p, q));
    const temporal = relationRows((p, q) => temporaryRelation(positions[p], positions[q]));
    const compound = relationRows((p, q) => compoundRelationship(p, q, positions));
    const list = (names) => (names && names.length ? names.join(', ') : '—');
    const note = 'Rahu and Ketu are not built: the engine has no sourced natural or temporal relation for the nodes.';
    return {
      title: `ஜாதகம் — ${name}`.trim(),
      subtitle: `${birth.placeName} · ${birth.day}/${birth.month}/${birth.year}`,
      blocks: [
        {
          kind: 'table',
          heading: 'Naisargik Maitri Chakra (Natural Relationship)',
          columns: ['Planet', 'Friends', 'Neutral', 'Enemies'],
          rows: natural.map(([p, b]) => [p, list(b.friend), list(b.neutral), list(b.enemy)]),
          note,
        },
        {
          kind: 'table',
          heading: 'Tatkalika Maitri Chakra (Temporal Relationship)',
          columns: ['Planet', 'Friends', 'Enemies'],
          rows: temporal.map(([p, b]) => [p, list(b.friend), list(b.enemy)]),
          note,
        },
        {
          kind: 'table',
          heading: 'Panchadha Maitri Chakra (Compound Relationship)',
          columns: ['Planet', 'Fast Friends', 'Friends', 'Neutral', 'Enemies', 'Great enemies'],
          rows: compound.map(([p, b]) => [p, list(b.greatFriend), list(b.friend), list(b.neutral), list(b.enemy), list(b.greatEnemy)]),
          note,
        },
      ],
    };
  });
}

/**
 * Page 10: the sign of the Ascendant and each planet in the sixteen vargas; the dignity of each classical planet in
 * each varga; and the Vimshopaka strengths (points out of 20 for each scheme, as the engine reads them).
 */
function buildPage10({ name = '', birth }) {
  return withBirth(birth, ({ chart }) => {
    const lagnaLon = chart.lagna.longitude;
    const lonOf = (planet) => chart.grahas[planet].longitude;
    const signRows = SHODASHVARGA.map(([caption, key]) => [
      caption,
      RASI_ABBR[vargaSign(lagnaLon, key)],
      ...PLANETS.map((p) => RASI_ABBR[vargaSign(lonOf(p), key)]),
    ]);
    const dignityRows = SHODASHVARGA.map(([caption, key]) => {
      const positions = Object.fromEntries(CLASSICAL.map((p) => [p, vargaSign(lonOf(p), key)]));
      return [caption, ...PLANETS.map((p) => (CLASSICAL.includes(p)
        ? dignityLabel(p, positions[p], positions) : NOT_BUILT))];
    });
    const rasiPositions = Object.fromEntries(CLASSICAL.map((p) => [p, chart.grahas[p].rasiIndex]));
    const vimshopakaRows = VIMSHOPAKA_SCHEMES.map(([caption, scheme]) => [
      caption,
      ...PLANETS.map((p) => (CLASSICAL.includes(p)
        ? String(Math.round(vimshopaka(p, chart.grahas[p].rasiIndex, chart.grahas[p].degreeInSign, rasiPositions, scheme).total))
        : NOT_BUILT)),
    ]);
    return {
      title: `ஜாதகம் — ${name}`.trim(),
      subtitle: `${birth.placeName} · ${birth.day}/${birth.month}/${birth.year}`,
      blocks: [
        { kind: 'table', heading: 'Signs occupied by planets in Shodashvargas', columns: ['Varga', 'Lagna', ...PLANETS], rows: signRows },
        {
          kind: 'table',
          heading: 'Dignities of planets in Shodashvargas',
          columns: ['Varga', ...PLANETS],
          rows: dignityRows,
          note: 'Rahu and Ketu are not built: the engine has no sourced dignity table for the nodes.',
        },
        {
          kind: 'table',
          heading: 'Vimshopaka Bala',
          columns: ['Scheme', ...PLANETS],
          rows: vimshopakaRows,
          note: 'Rahu and Ketu are not built: the Vimshopaka engine covers the seven classical planets.',
        },
      ],
    };
  });
}

module.exports = { buildPage9, buildPage10 };
