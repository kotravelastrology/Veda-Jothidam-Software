/**
 * Horoscope book, page 11 (PL9 sample aniruddha_HC4): the Shad Bala table. The six sources of strength, each planet's
 * parts (Sthana, Dig, Kaala and their sub-parts, Chesta, Naisargika, Drik), the minimum Pinda, and the component
 * "% of required" rows, all from the BPHS reading (ch.27). Not built: the total and the rupas (the engine refuses to
 * total Shad Bala under BPHS), the rank, Ishta and Kashta Phala, the Drik minimum (BPHS gives none), and the Bhava Bala
 * table (the engine's Bhava Bala is the Ashtakavarga reading; BPHS ch.27 vv.26-31 is the source to build from).
 * Returns a Promise of { title, subtitle, blocks }, in the printSets shape.
 */
const { julianDay } = require('@swisseph/node');
const {
  calculateShadbala, computeVarshaMasaDinaHoraLords, SHADBALA_MINIMUM_VIRUPAS, SHADBALA_COMPONENT_MINIMUMS,
  VARSHA_MASA_DINA_HORA_VIRUPAS,
} = require('../../chart/shadbala');
const { withBirth } = require('./charts');

const NOT_BUILT = 'கட்டப்படவில்லை';
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const GROUP_OF = Object.fromEntries(Object.values(SHADBALA_COMPONENT_MINIMUMS).flatMap((group) => group.planets.map((p) => [p, group])));

const fixed = (value) => value.toFixed(2);

/**
 * The page's rows, from one planet's Shad Bala entry. The lords of Varsha, Masa, Vaara and Hora come from the same
 * birth as the engine's own calculation (v.13), so the four Kaala rows are split, not estimated.
 */
function planetRows(entry, planet, lords) {
  const sthana = entry.sthana;
  const kaala = entry.kaala;
  const group = GROUP_OF[planet];
  const lordShare = (key) => (lords[key] === planet ? VARSHA_MASA_DINA_HORA_VIRUPAS[key] : 0);
  return {
    ochcha: sthana.uchchaBala,
    sapta: sthana.saptavargajaBala,
    ojh: sthana.ojhayugmarasyamsaBala,
    kendradi: sthana.kendradiBala,
    drekkana: sthana.drekkanaBala,
    sthana: entry.sthanaBala,
    dig: entry.digBala,
    nata: kaala.nathonnataBala,
    paksha: kaala.pakshaBala,
    tri: kaala.tribhagaBala,
    varsha: lordShare('varsha'),
    masa: lordShare('masa'),
    vaara: lordShare('dina'),
    hora: lordShare('hora'),
    ayana: kaala.ayanaBala,
    yuddha: entry.yuddhaBala,
    kaala: entry.kaalaBala,
    chesta: entry.cheshtaBala,
    naisargika: entry.naisargikaBala,
    drik: entry.drikBala,
    minimum: SHADBALA_MINIMUM_VIRUPAS[planet],
    sthanaOfRequired: entry.sthanaBala / group.sthanaBala,
    digOfRequired: entry.digBala / group.digBala,
    kaalaOfRequired: entry.kaalaBala / group.kaalaBala,
    cheshtaOfRequired: entry.cheshtaBala / group.cheshtaBala,
  };
}

/** Page 11: the Shad Bala table for the birth the book is built from (the BPHS reading; see the module note). */
function buildPage11({ name = '', birth }) {
  return withBirth(birth, ({ chart }) => {
    const longitudes = Object.fromEntries(PLANETS.map((p) => [p, chart.grahas[p].longitude]));
    const shadbala = calculateShadbala({
      longitudes,
      lagnaRasiIndex: chart.lagna.rasiIndex,
      ascendant: chart.lagna.longitude,
      mc: chart.mc,
      birthJd: chart.julianDay,
      latitude: birth.latitude,
      longitude: birth.longitude,
      year: birth.year,
      month: birth.month,
      day: birth.day,
      utcOffsetMinutes: birth.utcOffsetMinutes,
    });
    const jdLocalMidnight = julianDay(birth.year, birth.month, birth.day, -birth.utcOffsetMinutes / 60);
    const lords = computeVarshaMasaDinaHoraLords(chart.julianDay, birth.latitude, birth.longitude, jdLocalMidnight);
    const rows = Object.fromEntries(PLANETS.map((p) => [p, planetRows(shadbala.perPlanet[p], p, lords)]));

    const line = (label, key) => [label, ...PLANETS.map((p) => fixed(rows[p][key]))];
    const refused = (label) => [label, ...PLANETS.map(() => NOT_BUILT)];
    const shadbalaRows = [
      line('Ochcha Bala', 'ochcha'),
      line('Sapta-vargaja Bala', 'sapta'),
      line('Ojhayugma Bala', 'ojh'),
      line('Kendradi Bala', 'kendradi'),
      line('Drekkana Bala', 'drekkana'),
      line('1. Sthana Bala', 'sthana'),
      line('2. Dig Bala', 'dig'),
      line('Nata-Unnata Bala', 'nata'),
      line('Paksha Bala', 'paksha'),
      line('Tri-Bhaga Bala', 'tri'),
      line('Varsha Bala', 'varsha'),
      line('Maasa Bala', 'masa'),
      line('Vaara Bala', 'vaara'),
      line('Hora Bala', 'hora'),
      line('Ayana Bala', 'ayana'),
      line('Yuddha Bala', 'yuddha'),
      line('3. Kaala Bala', 'kaala'),
      line('4. Chesta Bala', 'chesta'),
      line('5. Naisargika Bala', 'naisargika'),
      line('6. Drik Bala', 'drik'),
      refused('Total Shadbala'),
      refused('Shadbala in Rupas'),
      [
        'Minimum requirements', ...PLANETS.map((p) => String(rows[p].minimum)),
      ],
      line('Sthana Bala % of required', 'sthanaOfRequired'),
      line('Dig Bala % of required', 'digOfRequired'),
      line('Kaala Bala % of required', 'kaalaOfRequired'),
      line('Chesta Bala % of required', 'cheshtaOfRequired'),
      refused('Drik Bala % of required'),
      refused('Relative Rank'),
      refused('Ishta Phala'),
      refused('Kashta Phala'),
    ];

    return {
      title: `ஜாதகம் — ${name}`.trim(),
      subtitle: `${birth.placeName} · ${birth.day}/${birth.month}/${birth.year}`,
      blocks: [
        {
          kind: 'table',
          heading: 'Shad Bala',
          columns: ['', ...PLANETS],
          rows: shadbalaRows,
          note: 'BPHS ch.27 throughout. Minimum requirements: v.32-33 (Santhanam, p.287). Component minimums by group: v.34-36 '
            + '(p.287-288), Kaala 50 and Chesta 112 for Sun, Mercury and Jupiter; PL9 prints them the other way round. Ayana, '
            + 'Chesta and Drik differ from PL9\'s own readings, so those rows will not match its page.',
        },
        {
          kind: 'table',
          heading: 'Bhava Bala',
          columns: ['Bhava Bala'],
          rows: [[NOT_BUILT]],
          note: 'Not built. The engine\'s Bhava Bala is the Ashtakavarga reading in src/chart/bhavaBala.js, not the BPHS one. '
            + 'The BPHS rules (ch.27 vv.26-31, Santhanam p.286-287): the bhava strength from the Nadir, Meridian, Ascendant or '
            + 'Descendant, divided by 3; a quarter added or reduced by aspect; Jupiter and Mercury aspects; the lord\'s '
            + 'strength; and the special rules.',
        },
      ],
    };
  });
}

module.exports = { buildPage11 };
