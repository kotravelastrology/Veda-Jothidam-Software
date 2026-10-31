/**
 * Horoscope book, page 2 (PL9 sample aniruddha_HC4, p.2): the birth chart. Three sign grids (Birth
 * Chart, Moon, Navamsha) with the planets, the Ascendant and Gulika, and the planet table: sign,
 * degree, speed, nakshatra, pada, the four KP lords, status and combustion. Shad Bala is not built:
 * the engine refuses a total (see the register). Lords and nakshatra use the sidereal longitude, as
 * the sample does. Returns { title, subtitle, blocks } in the printSets shape.
 */
const { createChartContext } = require('../../contracts/chartContext');
const { calculateParashariChart } = require('../../chart/parashariChart');
const { withEphemeris } = require('../../ephemeris/isolation');
const { planetLongitude, nodeLongitude } = require('../../ephemeris/siderealPositions');
const { calculateVargas } = require('../../chart/vargaChart');
const { calculateUpagrahas } = require('../../report/upagraha');
const { kpChain } = require('../../report/kpSystem');
const { dignityOf, combustionOrb } = require('../phaladeepikaGocharaTables');
const { compoundRelationship } = require('../../chart/planetaryRelationship');
const { NAKSHATRA_NAMES } = require('../../panchangam/tirukanitaPanchangam');
const { RASI_LORD } = require('../../chart/karaka');

const NOT_BUILT = 'கட்டப்படவில்லை';
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const ABBR = { Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke' };
const RASI_ABBR = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];
const RELATION_LABEL = { greatFriend: 'Great friend', friend: 'Friend', neutral: 'Neutr.', enemy: 'Enemy', greatEnemy: 'Great enemy' };
const MONTH_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const NAK_SPAN = 360 / 27;
const PADA_SPAN = 360 / 108;

const pad = (n) => String(n).padStart(2, '0');

/** H:MM:SS for a non-negative decimal value (degrees, or degrees per day). */
function sexagesimal(x) {
  const total = Math.round(Math.abs(x) * 3600);
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`;
}

/** Degrees and minutes for a sign label, e.g. 17:43 (the grid's short form; minutes are truncated, as the sample does). */
function degMin(x) {
  const total = Math.floor(Math.abs(x) * 60);
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

/** Nakshatra index (0-26) and pada (1-4) of a sidereal longitude. */
function nakshatraOf(lon) {
  const index = Math.min(Math.floor(lon / NAK_SPAN), 26);
  const pada = Math.floor((lon % NAK_SPAN) / PADA_SPAN) + 1;
  return { index, name: NAKSHATRA_NAMES[index], pada };
}

/** Signed difference between two longitudes, in (-180, 180]. */
const wrap = (d) => ((((d + 540) % 360) + 360) % 360) - 180;

/** Angular gap between two longitudes, 0-180. */
const angularGap = (a, b) => {
  const d = Math.abs(wrap(a - b));
  return d;
};

/** Sign-fixed grid cells: cells[signIndex] is the list of labels placed in that sign. */
function gridCells(placements) {
  const cells = Array.from({ length: 12 }, () => []);
  for (const { sign, label } of placements) cells[sign].push(label);
  return cells;
}

/**
 * @param input { name, birth: { year, month, day, hour, minute, utcOffsetMinutes, ianaTimeZone,
 *   latitude, longitude, placeName } }
 * @returns Promise of { title, subtitle, blocks } — the page-2 document.
 */
function buildPage2({ name = '', birth }) {
  const { latitude: lat, longitude: lon, utcOffsetMinutes: off } = birth;
  const ctx = createChartContext({
    year: birth.year, month: birth.month, day: birth.day, hour: birth.hour, minute: birth.minute,
    ianaTimeZone: birth.ianaTimeZone ?? 'Asia/Kolkata', utcOffsetMinutes: off,
    latitude: lat, longitude: lon, placeName: birth.placeName, calendarMode: 'tirukanita', sunrise: birth.sunrise,
  });
  const ayan = ctx.ayanamsha;

  return withEphemeris({ ayanamsha: ayan }, () => {
    const chart = calculateParashariChart(ctx);
    const jd = chart.julianDay;
    const lagna = chart.lagna;

    // Daily speed: the central difference over one day, in degrees per day (negative = retrograde).
    const longitudeAt = (planet) => (t) => (planet === 'Rahu' || planet === 'Ketu'
      ? nodeLongitude(t, ayan, 'mean') : planetLongitude(t, planet, ayan));
    const speedOf = (planet) => {
      const f = longitudeAt(planet === 'Ketu' ? 'Rahu' : planet);
      return wrap(f(jd + 0.5) - f(jd - 0.5));
    };

    const sunLongitude = chart.grahas.Sun.longitude;
    const positions = Object.fromEntries(
      PLANETS.filter((p) => p !== 'Rahu' && p !== 'Ketu').map((p) => [p, chart.grahas[p].rasiIndex]),
    );

    const planetRows = PLANETS.map((planet) => {
      const g = chart.grahas[planet];
      const speed = speedOf(planet);
      const retro = speed < 0 && planet !== 'Rahu' && planet !== 'Ketu';
      const node = planet === 'Rahu' || planet === 'Ketu';
      const orb = node ? null : combustionOrb(planet, retro);
      const combust = !node && planet !== 'Sun' && orb !== null && angularGap(g.longitude, sunLongitude) <= orb;
      const nak = nakshatraOf(g.longitude);
      const kp = kpChain(g.longitude);
      let status = NOT_BUILT;
      if (!node) {
        const d = dignityOf(planet, g.rasiIndex);
        if (d.exalted) status = 'Exalt.';
        else if (d.debilitated) status = 'Debil.';
        else if (d.own) status = 'Own';
        else status = RELATION_LABEL[compoundRelationship(planet, RASI_LORD[g.rasiIndex], positions)];
      }
      return {
        planet, g, speed, retro, combust, nak, kp, status,
      };
    });

    const lagnaNak = nakshatraOf(lagna.longitude);
    const lagnaKp = kpChain(lagna.longitude);
    const upagraha = calculateUpagrahas({
      sunLongitude, birthJd: jd, year: birth.year, month: birth.month, day: birth.day,
      utcOffsetMinutes: off, latitude: lat, longitude: lon, ayanamsha: ayan, sunrise: ctx.sunrise,
    }).upagrahas.Gulika;

    const speedText = (v) => `${v < 0 ? '-' : ''}${sexagesimal(v)}`;
    const tableRows = [
      ['Lagna', '', RASI_ABBR[lagna.rasiIndex], sexagesimal(lagna.degreeInSign), '', lagnaNak.name, String(lagnaNak.pada),
        lagnaKp.signLord, lagnaKp.starLord, lagnaKp.sub, lagnaKp.subSub, '', NOT_BUILT],
      ...planetRows.map((r) => [
        r.planet,
        r.retro ? 'R' : (r.combust ? 'C' : ''),
        RASI_ABBR[r.g.rasiIndex],
        sexagesimal(r.g.degreeInSign),
        speedText(r.speed),
        r.nak.name,
        String(r.nak.pada),
        r.kp.signLord,
        r.kp.starLord,
        r.kp.sub,
        r.kp.subSub,
        r.status,
        NOT_BUILT,
      ]),
    ];

    // Charts: planets in their Rasi signs; Ascendant and Gulika as extra labels; Navamsha by D9 sign.
    const rasiPlacements = [
      ...planetRows.map((r) => ({ sign: r.g.rasiIndex, label: `${ABBR[r.planet]} ${degMin(r.g.degreeInSign)}` })),
      { sign: lagna.rasiIndex, label: `As ${degMin(lagna.degreeInSign)}` },
    ];
    rasiPlacements.push({ sign: upagraha.rasiIndex, label: `Gk ${degMin(upagraha.degreeInSign)}` });
    const rasiCells = gridCells(rasiPlacements);
    const gulikaVarga = calculateVargas(upagraha.rasiIndex, upagraha.degreeInSign);

    const navPlacements = [
      ...planetRows.map((r) => ({ sign: calculateVargas(r.g.rasiIndex, r.g.degreeInSign).D9.signIndex, label: ABBR[r.planet] })),
      { sign: calculateVargas(lagna.rasiIndex, lagna.degreeInSign).D9.signIndex, label: 'As' },
      { sign: gulikaVarga.D9.signIndex, label: 'Gk' },
    ];
    const navCells = gridCells(navPlacements);

    const dateText = `${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year}`;
    return {
      title: `ஜாதகம் — ${name}`.trim(),
      subtitle: `${birth.placeName} · ${dateText}`,
      blocks: [
        { kind: 'signGrid', heading: 'பிறப்பு ஜாதகம் (Birth Chart)', cells: rasiCells },
        { kind: 'signGrid', heading: 'சந்திர ஜாதகம் (Moon)', cells: rasiCells },
        { kind: 'signGrid', heading: 'நவாம்சம் (Navamsha)', cells: navCells },
        {
          kind: 'table',
          heading: 'கிரக நிலை (Planets)',
          columns: ['Planet', 'R/C', 'Sign', 'Degree', 'Speed', 'Nakshatra', 'Pada', 'RL', 'NL', 'SL', 'SS', 'Status', 'SB'],
          rows: tableRows,
          note: 'SB (Shad Bala) is not built: the engine refuses a total while Ayana Bala has a source contradiction (see the register). '
            + 'Status: exaltation, debilitation or the Panchadha relation with the sign lord. Nodes have no sourced status.',
        },
      ],
    };
  });
}

module.exports = { buildPage2 };
