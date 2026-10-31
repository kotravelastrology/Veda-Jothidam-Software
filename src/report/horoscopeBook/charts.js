/**
 * Horoscope book, chart pages (PL9 sample aniruddha_HC4): page 3 (Moon, Navamsha and Sripati Bhava charts
 * with the Bhava Spashta table) and pages 5-6 (the sixteen divisional charts). Every chart is the sign-fixed
 * grid the sample uses; a body (each planet, the Ascendant As and Gulika Gk) sits in the sign of its place in
 * that chart. A Sripati bhava chart places each body in the sign of the bhava madhya of the house it is in.
 * Each builder returns a Promise of { title, subtitle, blocks }, in the printSets shape.
 */
const { createChartContext } = require('../../contracts/chartContext');
const { calculateParashariChart } = require('../../chart/parashariChart');
const { withEphemeris } = require('../../ephemeris/isolation');
const { calculateVargas } = require('../../chart/vargaChart');
const { calculateUpagrahas } = require('../../report/upagraha');
const { bhavaPoints, sandhis } = require('../../chart/sripatiBhava');

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const ABBR = { Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke' };
const RASI_ABBR = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];
const ORDINAL = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eight', 'Ninth', 'Tenth', 'Eleventh', 'Twelfth'];
const MONTH_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Divisional charts in the order the sample prints them: left column, then right.
const DIVISIONAL_PAGE_5 = [
  ['Lagna', 'D1'], ['Dreshkana (happiness siblings)', 'D3'], ['Saptamsha (children)', 'D7'], ['Dashamsha (great successes)', 'D10'],
  ['Hora (wealth)', 'D2'], ['Chaturthamsha (destiny)', 'D4'], ['Navamsha (spouse)', 'D9'], ['Dwadashamsha (parents)', 'D12'],
];
const DIVISIONAL_PAGE_6 = [
  ['Shodashamsha (conveyances)', 'D16'], ['Chaturvimshamsha (knowledge)', 'D24'], ['Trimshamsha (misfortunes)', 'D30'], ['Akshavedamsha (all areas)', 'D45'],
  ['Vimshamsha (spiritual progress)', 'D20'], ['Saptavimshamsha (strength)', 'D27'], ['Kvedamsha (ausp. inausp. effects)', 'D40'], ['Shashtiamsha (all areas)', 'D60'],
];

const pad = (n) => String(n).padStart(2, '0');
const norm = (x) => ((x % 360) + 360) % 360;
const forward = (from, to) => norm(to - from);

/** H:MM:SS for a non-negative decimal value. */
function sexagesimal(x) {
  const total = Math.round(Math.abs(x) * 3600);
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`;
}

/** Sign-fixed grid cells: cells[signIndex] is the list of labels in that sign. */
function gridCells(placements) {
  const cells = Array.from({ length: 12 }, () => []);
  for (const { sign, label } of placements) cells[sign].push(label);
  return cells;
}

/** Every body that sits on a chart: the nine planets, the Ascendant and Gulika (longitudes, sidereal). */
function bodiesOf(chart, gulika) {
  return [
    ...PLANETS.map((p) => ({ abbr: ABBR[p], lon: chart.grahas[p].longitude })),
    { abbr: 'As', lon: chart.lagna.longitude },
    { abbr: 'Gk', lon: gulika.longitude },
  ];
}

const LEO = 4;
const CANCER = 3;

/** The sign a body takes in a divisional chart. A Hora (D2) has no sign of its own: the Sun's hora is Leo, the Moon's Cancer. */
function vargaSign(lon, key) {
  const v = calculateVargas(Math.floor(lon / 30), lon % 30)[key];
  if (key === 'D2') return v.lord === 'Sun' ? LEO : CANCER;
  return v.signIndex;
}

/** Placements of the bodies in a divisional chart: each body's varga sign for the given key. */
function vargaPlacements(bodies, key) {
  return bodies.map((b) => ({ sign: vargaSign(b.lon, key), label: b.abbr }));
}

/** Sripati bhava (Sripatipaddhati): bhava middles from the four angles, with the sandhi edges of each house. */
function sripatiHouses(chart) {
  const lagna = chart.lagna.longitude;
  const mc = typeof chart.mc === 'number' ? chart.mc : chart.mc.longitude;
  const middles = bhavaPoints(lagna, norm(mc + 180), norm(lagna + 180), mc);
  const edges = sandhis(middles);
  const arambha = middles.map((_, i) => edges[(i + 11) % 12]);
  const antya = middles.map((_, i) => edges[i]);
  return { middles, arambha, antya };
}

/** The house (0-11) that holds a longitude: between its arambha and the next house's arambha. */
function houseOf(houses, lon) {
  for (let i = 0; i < 12; i += 1) {
    const next = houses.arambha[(i + 1) % 12];
    if (forward(houses.arambha[i], lon) < forward(houses.arambha[i], next)) return i;
  }
  return -1;
}

/** Runs the builder inside an ephemeris session for one birth; the Ascendant and Gulika are computed once. */
function withBirth(birth, build) {
  const ctx = createChartContext({
    year: birth.year, month: birth.month, day: birth.day, hour: birth.hour, minute: birth.minute,
    ianaTimeZone: birth.ianaTimeZone ?? 'Asia/Kolkata', utcOffsetMinutes: birth.utcOffsetMinutes,
    latitude: birth.latitude, longitude: birth.longitude, placeName: birth.placeName, calendarMode: 'tirukanita', sunrise: birth.sunrise,
  });
  return withEphemeris({ ayanamsha: ctx.ayanamsha }, () => {
    const chart = calculateParashariChart(ctx);
    const gulika = calculateUpagrahas({
      sunLongitude: chart.grahas.Sun.longitude, birthJd: chart.julianDay,
      year: birth.year, month: birth.month, day: birth.day, utcOffsetMinutes: birth.utcOffsetMinutes,
      latitude: birth.latitude, longitude: birth.longitude, ayanamsha: ctx.ayanamsha, sunrise: ctx.sunrise,
    }).upagrahas.Gulika;
    return build({ chart, gulika, bodies: bodiesOf(chart, gulika) });
  });
}

function headerOf(name, birth) {
  return {
    title: `ஜாதகம் — ${name}`.trim(),
    subtitle: `${birth.placeName} · ${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year}`,
  };
}

/**
 * Page 3: the Moon chart (sign-fixed, as the sample draws it), the Navamsha, the Sripati Bhava chart and the
 * Bhava Spashta table.
 */
function buildPage3({ name = '', birth }) {
  return withBirth(birth, ({ chart, bodies }) => {
    const houses = sripatiHouses(chart);
    const moonCells = gridCells(bodies.map((b) => ({ sign: Math.floor(b.lon / 30), label: b.abbr })));
    const navCells = gridCells(vargaPlacements(bodies, 'D9'));
    const bhavaCells = gridCells(bodies.map((b) => {
      const house = houseOf(houses, b.lon);
      return { sign: Math.floor(houses.middles[house] / 30), label: b.abbr };
    }));
    const rows = houses.middles.map((middle, i) => [
      `${i + 1}. ${ORDINAL[i]}`,
      `${RASI_ABBR[Math.floor(houses.arambha[i] / 30)]} ${sexagesimal(houses.arambha[i] % 30)}`,
      `${RASI_ABBR[Math.floor(middle / 30)]} ${sexagesimal(middle % 30)}`,
      `${RASI_ABBR[Math.floor(houses.antya[i] / 30)]} ${sexagesimal(houses.antya[i] % 30)}`,
    ]);
    return {
      ...headerOf(name, birth),
      blocks: [
        { kind: 'signGrid', heading: 'Moon Chart', cells: moonCells },
        { kind: 'signGrid', heading: 'Navamsha', cells: navCells },
        { kind: 'signGrid', heading: 'Bhava (Sripati)', cells: bhavaCells },
        {
          kind: 'table',
          heading: 'Bhava Spashta - Sripati System',
          columns: ['Bhava Number', 'Bhava Arambha (house beginning)', 'Bhava Madhya (middle of house)', 'Bhava Antya (house ending)'],
          rows,
        },
      ],
    };
  });
}

/** Pages 5-6: divisional charts from a list of [caption, varga key]; each one is a sign-fixed grid. */
function divisionalBlocks(list, bodies) {
  return list.map(([caption, key]) => ({
    kind: 'signGrid',
    heading: `${caption} — ${key}`,
    cells: gridCells(vargaPlacements(bodies, key)),
  }));
}

/** Page 5: Lagna, Dreshkana, Saptamsha, Dashamsha, Hora, Chaturthamsha, Navamsha, Dwadashamsha. */
function buildPage5({ name = '', birth }) {
  return withBirth(birth, ({ bodies }) => ({
    ...headerOf(name, birth),
    blocks: divisionalBlocks(DIVISIONAL_PAGE_5, bodies),
  }));
}

/** Page 6: Shodashamsha, Chaturvimshamsha, Trimshamsha, Akshavedamsha, Vimshamsha, Saptavimshamsha, Kvedamsha, Shashtiamsha. */
function buildPage6({ name = '', birth }) {
  return withBirth(birth, ({ bodies }) => ({
    ...headerOf(name, birth),
    blocks: divisionalBlocks(DIVISIONAL_PAGE_6, bodies),
  }));
}

module.exports = { buildPage3, buildPage5, buildPage6, sripatiHouses, houseOf, vargaSign, withBirth, gridCells };
