/**
 * Horoscope book, page 11 (PL9 sample aniruddha_HC4): the Shad Bala table and the Bhava Bala table.
 *
 * Shad Bala: the six sources of strength, each planet's parts (Sthana, Dig, Kaala and their sub-parts, Chesta,
 * Naisargika, Drik, Yuddha), the total and rupas, the minimum Pinda, the "% of required" rows and the rank, all from the BPHS
 * reading (ch.27). Not built: Ishta and Kashta Phala, and the Drik minimum (BPHS gives none).
 *
 * Bhava Bala: the house lord's BPHS Shadbala total (ch.27 v.29, "the strength acquired by the lord"), the Digbala and the
 * Drigbala (Raman, Art.131-132: BPHS has no form of these), and the BPHS planets-in and day-night rules (ch.27 vv.30-31).
 * See bhavaBalaRaman.js.
 *
 * Returns a Promise of { title, subtitle, blocks }, in the printSets shape.
 */
const { julianDay } = require('@swisseph/node');
const {
  calculateShadbala, computeVarshaMasaDinaHoraLords, findDayNightThird,
  SHADBALA_MINIMUM_VIRUPAS, SHADBALA_COMPONENT_MINIMUMS, VARSHA_MASA_DINA_HORA_VIRUPAS,
} = require('../../chart/shadbala');
const { ramanBhavaBala } = require('../../chart/bhavaBalaRaman');
const { withBirth, sripatiHouses } = require('./charts');

const NOT_BUILT = 'கட்டப்படவில்லை';
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const GROUP_OF = Object.fromEntries(Object.values(SHADBALA_COMPONENT_MINIMUMS).flatMap((group) => group.planets.map((p) => [p, group])));
const RASI_ABBR = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

const fixed = (value) => value.toFixed(2);

/**
 * The page's rows, from one planet's BPHS Shad Bala entry. The lords of Varsha, Masa, Vaara and Hora come from the same
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

/** Page 11: the Shad Bala table (BPHS) and the Bhava Bala table (Raman's lord, Digbala and Drigbala, with the BPHS rules). */
function buildPage11({ name = '', birth }) {
  return withBirth(birth, ({ chart }) => {
    const longitudes = Object.fromEntries(PLANETS.map((p) => [p, chart.grahas[p].longitude]));
    const common = {
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
    };
    const shadbala = calculateShadbala(common);
    const jdLocalMidnight = julianDay(birth.year, birth.month, birth.day, -birth.utcOffsetMinutes / 60);
    const lords = computeVarshaMasaDinaHoraLords(chart.julianDay, birth.latitude, birth.longitude, jdLocalMidnight);
    const rows = Object.fromEntries(PLANETS.map((p) => [p, planetRows(shadbala.perPlanet[p], p, lords)]));

    const line = (label, key) => [label, ...PLANETS.map((p) => fixed(rows[p][key]))];
    const refused = (label) => [label, ...PLANETS.map(() => NOT_BUILT)];
    // The total over the minimum, and the rank by it (largest first, as PL9 prints it: the strongest is 1).
    const totalOfRequired = Object.fromEntries(PLANETS.map((p) => [p, shadbala.perPlanet[p].shadbalaTotal / rows[p].minimum]));
    const rankOf = Object.fromEntries([...PLANETS]
      .sort((a, b) => totalOfRequired[b] - totalOfRequired[a])
      .map((p, i) => [p, i + 1]));
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
      ['Total Shadbala', ...PLANETS.map((p) => fixed(shadbala.perPlanet[p].shadbalaTotal))],
      ['Shadbala in Rupas', ...PLANETS.map((p) => fixed(shadbala.perPlanet[p].shadbalaTotal / 60))],
      ['Minimum requirements', ...PLANETS.map((p) => String(rows[p].minimum))],
      ['Shadbala % of required', ...PLANETS.map((p) => fixed(totalOfRequired[p]))],
      line('Sthana Bala % of required', 'sthanaOfRequired'),
      line('Dig Bala % of required', 'digOfRequired'),
      line('Kaala Bala % of required', 'kaalaOfRequired'),
      line('Chesta Bala % of required', 'cheshtaOfRequired'),
      refused('Drik Bala % of required'),
      ['Relative Rank', ...PLANETS.map((p) => String(rankOf[p]))],
      refused('Ishta Phala'),
      refused('Kashta Phala'),
    ];

    const { isDaytime } = findDayNightThird({
      birthJd: chart.julianDay, latitude: birth.latitude, longitude: birth.longitude, jdLocalMidnight,
    });
    const lordPinda = Object.fromEntries(PLANETS.map((p) => [p, shadbala.perPlanet[p].shadbalaTotal]));
    const { middles } = sripatiHouses(chart);
    const bhava = ramanBhavaBala({
      middles,
      longitudes,
      isWaxingMoon: ((longitudes.Moon - longitudes.Sun) % 360 + 360) % 360 <= 180,
      lordPinda,
      dayPart: isDaytime ? 'day' : 'night',
    });
    const bhavaLine = (label, key, format = (v) => String(Math.round(v))) => [label, ...bhava.map((b) => format(b[key]))];
    const bhavaRows = [
      ['Rashi', ...bhava.map((b) => RASI_ABBR[b.rasiIndex])],
      ['Degree', ...bhava.map((b) => String(Math.floor(b.midpoint % 30)))],
      bhavaLine('From Lord', 'fromLord'),
      bhavaLine('Dig Bala', 'dig'),
      bhavaLine('Drishti', 'drishti'),
      bhavaLine('Planets in', 'plantsIn'),
      bhavaLine('Day-Night', 'dayNight'),
      bhavaLine('Bhava Bala Total', 'total'),
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
            + 'Chesta, Saptavargaja and Drik differ from PL9\'s own readings, so the totals differ from its page too (Sun 214 '
            + 'against 275, Jupiter 467 against 536, Mercury 428 against 391). Rank: Mars, Jupiter, Mercury and Sun agree with '
            + 'PL9; Moon, Saturn and Venus are placed differently.',
        },
        {
          kind: 'table',
          heading: 'Bhava Bala',
          columns: ['', ...ROMAN],
          rows: bhavaRows,
          note: 'From Lord is the house lord\'s BPHS Shadbala total (v.29). Dig and '
            + 'Drishti are Raman\'s (Art.131-132); Planets in is BPHS v.30 (Jupiter and Mercury +60, Saturn, Mars and the Sun '
            + '-60); Day-Night is BPHS v.31 (+15 in the Seershodaya signs by day, Prishtodaya by night; Ubhayodaya needs a sourced '
            + 'twilight, which is not built, so Gemini and Pisces get 0). Raman\'s Example 59 reproduces for houses I-IV. Against '
            + 'PL9 on this birth: Planets in and Day-Night match, Digbala is within one unit except XII (ours 20, PL9 10), and '
            + 'Drishti and From Lord do not match PL9\'s own readings.',
        },
      ],
    };
  });
}

module.exports = { buildPage11 };
