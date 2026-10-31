/**
 * Horoscope book, page 8 (PL9 sample aniruddha_HC4, p.8): the Birth Charts. Twelve sign-fixed grids: Birth, Moon,
 * Sun, Sripati Bhava, Equal Bhava, KP Bhava, Arudha Lagna, Karkamsha in Birth Chart, Karkamsha in Navamsha, Bhava
 * Lagna, Hora Lagna and Ghatika Lagna. The Sun chart and the Moon chart are the sign-fixed Rasi grid, as the sample
 * prints them. The marker charts (Arudha, Karkamsha, Bhava, Hora and Ghatika lagna) add their own label (AL, Ka, BL,
 * HL, GL) at the sign of that point. The sample prints only As on these, so the marker is a difference. Returns a
 * Promise of { title, subtitle, blocks }, in the printSets shape.
 */
const swe = require('@swisseph/node');
const { createChartContext } = require('../../contracts/chartContext');
const { calculateParashariChart } = require('../../chart/parashariChart');
const { withEphemeris } = require('../../ephemeris/isolation');
const { sunriseJulianDay, planetLongitude } = require('../../ephemeris/siderealPositions');
const { calculateKpSystem, houseForLongitude } = require('../../report/kpSystem');
const { calculateBhavaArudhas, calculateKarkamsha } = require('../../report/jaimini');
const { specialLagnas } = require('../../chart/specialLagnas');
const { calculateVargas } = require('../../chart/vargaChart');
const { calculateUpagrahas } = require('../../report/upagraha');
const { gridCells, sripatiHouses, houseOf } = require('./charts');

const MONTH_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const norm = (x) => ((x % 360) + 360) % 360;

/** The sign index (0-11) of a longitude. */
const signOf = (lon) => Math.floor(norm(lon) / 30);

/** The Equal Bhava house (from the Ascendant, 30 degrees each) holds a longitude; its middle sign is where it is printed. */
function equalBhavaSign(lon, lagna) {
  const h = Math.floor(norm(lon - lagna) / 30);
  return signOf(lagna + 30 * h + 15);
}

/** Placements of the bodies in a grid, with an optional marker (label, longitude) at its own sign. */
function withMarker(placements, marker) {
  return marker ? [...placements, { sign: signOf(marker.lon), label: marker.label }] : placements;
}

/** The Hindu day's sunrise and the Sun's longitude there, for the Hora and Ghatika lagnas. */
function sunAtHinduSunrise(birth, birthJd, ayan) {
  const civilSunrise = sunriseJulianDay(swe.julianDay(birth.year, birth.month, birth.day, 0), birth.latitude, birth.longitude);
  const day = birthJd < civilSunrise ? [birth.year, birth.month, birth.day - 1] : [birth.year, birth.month, birth.day];
  const rise = sunriseJulianDay(swe.julianDay(day[0], day[1], day[2], 0), birth.latitude, birth.longitude);
  return { rise, sunLongitude: planetLongitude(rise, 'Sun', ayan) };
}

/**
 * @param input { name, birth }
 * @returns Promise of { title, subtitle, blocks } — the page-8 document.
 */
function buildPage8({ name = '', birth }) {
  const ctx = createChartContext({
    year: birth.year, month: birth.month, day: birth.day, hour: birth.hour, minute: birth.minute,
    ianaTimeZone: birth.ianaTimeZone ?? 'Asia/Kolkata', utcOffsetMinutes: birth.utcOffsetMinutes,
    latitude: birth.latitude, longitude: birth.longitude, placeName: birth.placeName, calendarMode: 'tirukanita', sunrise: birth.sunrise,
  });
  return withEphemeris({ ayanamsha: ctx.ayanamsha }, () => {
    const chart = calculateParashariChart(ctx);
    const jdBirth = chart.julianDay;
    const lagnaLon = chart.lagna.longitude;
    const { rise, sunLongitude } = sunAtHinduSunrise(birth, jdBirth, ctx.ayanamsha);
    const hoursSinceSunrise = (jdBirth - rise) * 24;
    const grahas = Object.fromEntries(Object.entries(chart.grahas).map(([p, g]) => [p, g.longitude]));

    const gulika = calculateUpagrahas({
      sunLongitude: chart.grahas.Sun.longitude, birthJd: jdBirth,
      year: birth.year, month: birth.month, day: birth.day, utcOffsetMinutes: birth.utcOffsetMinutes,
      latitude: birth.latitude, longitude: birth.longitude, ayanamsha: ctx.ayanamsha, sunrise: ctx.sunrise,
    }).upagrahas.Gulika;
    const bodies = [
      ...Object.keys(chart.grahas).map((p) => ({ abbr: ABBR[p], lon: chart.grahas[p].longitude })),
      { abbr: 'As', lon: lagnaLon },
      { abbr: 'Gk', lon: gulika.longitude },
    ];
    const rasiPlacements = bodies.map((b) => ({ sign: signOf(b.lon), label: b.abbr }));
    const rasi = gridCells(rasiPlacements);

    // Equal Bhava: each body in the middle sign of its equal house.
    const equal = gridCells(bodies.map((b) => ({ sign: equalBhavaSign(b.lon, lagnaLon), label: b.abbr })));

    // Sripati Bhava, as page 3 has it.
    const houses = sripatiHouses(chart);
    const sripati = gridCells(bodies.map((b) => ({ sign: signOf(houses.middles[houseOf(houses, b.lon)]), label: b.abbr })));

    // KP Bhava: each body in the sign where its KP house begins (the cusp's sign).
    const kp = calculateKpSystem(ctx.input);
    // The Ascendant is house 1 by definition; the KP cusp of house 1 can sit a tenth of a degree past it.
    const kpPlacements = bodies.map((b) => {
      const house = b.abbr === 'As' ? 1 : houseForLongitude(b.lon, kp.cusps);
      return { sign: signOf(kp.cusps[house - 1].longitude), label: b.abbr };
    });
    const kpCells = gridCells(kpPlacements);

    // Special points: Arudha Lagna (the first house's arudha), Karkamsha, Bhava, Hora and Ghatika Lagna.
    const arudhaLagna = calculateBhavaArudhas(lagnaLon, grahas)[0];
    const karkamsha = calculateKarkamsha(grahas);
    const karkamshaSign = karkamsha.rasiIndex ?? karkamsha.rashi0 ?? karkamsha.sign;
    const special = specialLagnas({ lagnaLongitude: lagnaLon, sunLongitudeAtSunrise: sunLongitude, hoursSinceSunrise });
    const bhavaLon = typeof special.bhava === 'number' ? special.bhava : special.bhava.longitude;
    const horaLon = typeof special.hora === 'number' ? special.hora : special.hora.longitude;
    const ghatikaLon = typeof special.ghatika === 'number' ? special.ghatika : special.ghatika.longitude;

    const navPlacements = bodies.map((b) => ({ sign: calculateVargas(Math.floor(b.lon / 30), b.lon % 30).D9.signIndex, label: b.abbr }));
    const navCells = gridCells(navPlacements);

    const titled = (heading, cells, note) => ({ kind: 'signGrid', heading, cells, ...(note ? { note } : {}) });
    const markerNote = 'Marker label (AL, Ka, BL, HL, GL) is placed at the sign of that point. The sample prints only As here.';

    const dateText = `${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year}`;
    return {
      title: `ஜாதகம் — ${name}`.trim(),
      subtitle: `${birth.placeName} · ${dateText}`,
      blocks: [
        titled('Birth Chart', rasi),
        titled('Moon Chart', rasi),
        titled('Sun Chart', rasi),
        titled('Sripati Bhava', sripati),
        titled('Equal Bhava', equal),
        titled('KP Bhava', kpCells),
        titled('Arudha Lagna Chart', gridCells(withMarker(rasiPlacements, { label: 'AL', lon: arudhaLagna.rasiIndex * 30 + 15 })), markerNote),
        titled('Karkamsha in Birth Chart', gridCells(withMarker(rasiPlacements, { label: 'Ka', lon: karkamshaSign * 30 + 15 })), markerNote),
        titled('Karkamsha in Navamsha', gridCells(withMarker(navPlacements, { label: 'Ka', lon: karkamshaSign * 30 + 15 }))),
        titled('Bhava Lagna', gridCells(withMarker(rasiPlacements, { label: 'BL', lon: bhavaLon })), markerNote),
        titled('Hora Lagna', gridCells(withMarker(rasiPlacements, { label: 'HL', lon: horaLon })), markerNote),
        titled('Ghatika Lagna', gridCells(withMarker(rasiPlacements, { label: 'GL', lon: ghatikaLon })), markerNote),
      ],
    };
  });
}

const ABBR = { Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke' };

module.exports = { buildPage8 };
