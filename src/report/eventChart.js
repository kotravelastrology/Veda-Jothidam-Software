/**
 * PL9's event worksheets (116-123): a moment ("event") set against the birth chart. For an event at a date, time and place this gathers
 *  - the event chart itself (planets by sign, lagna, and the houses counted from the lagna and from the Moon);
 *  - the event's planets over the birth chart: each planet's Kakshya and whether its lord gave a bindu in the planet's own Ashtakavarga,
 *    with that sign's Ashtakavarga bindus and the Sarvashtakavarga of the sign (kakshyaTransit.js, the by-sign reading);
 *  - the event's gochara facts: Tara from the birth star to the event star, the event Moon's sign counted from the birth Moon, the
 *    tithi, nakshatra, yoga and karana at the instant;
 *  - the dasha lords running at the event: Vimshottari to five levels, and Yogini, Ashtottari, Chara and Sthira at the periods the
 *    engines build;
 *  - the Graha Bala components of the event chart (Shadbala has no honest total; its parts are given) and its Vimshopaka.
 *
 * Nothing here is a verdict: PL9's glosses ("Janma: Danger to body", "Preeti: Loved by all") are not used because no classical source is
 * held for them; the names and counts are given and the other pages carry the sources.
 */
const { julianDay } = require('@swisseph/node');
const { createChartContext } = require('../contracts/chartContext');
const { calculateParashariChart } = require('../chart/parashariChart');
const { sunMoonLongitudes } = require('../ephemeris/siderealPositions');
const { buildVimshottariDasha } = require('../dasha/vimshottariDasha');
const { chainAtJulianDay } = require('../dasha/timeline');
const { buildYoginiDasha, buildAshtottariDasha, currentPeriod } = require('../dasha/altDashas');
const RS = require('../dasha/bphsRashiDashas');
const { kakshyaTransit } = require('./kakshyaTransit');
const { TITHI_NAMES, NAKSHATRA_NAMES, YOGA_NAMES, karanaName } = require('../panchangam/tirukanitaPanchangam');
const { calculateShadbala } = require('../chart/shadbala');
const V = require('../chart/vimshopaka');

const GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const ALL = [...GRAHAS, 'Rahu', 'Ketu'];
const norm = (x) => ((x % 360) + 360) % 360;
const TARA = [
  ['Janma', 'ஜென்மம்'], ['Sampat', 'சம்பத்து'], ['Vipat', 'விபத்து'], ['Kshema', 'சேமம்'], ['Pratyari', 'பிரத்யரி'],
  ['Sadhaka', 'சாதகம்'], ['Vadha', 'வதை'], ['Mitra', 'மித்திரம்'], ['Ati-Mitra', 'பரம மித்திரம்'],
];

/** Julian day (UT) of a local date and time at the offset. */
const jdOfEvent = (e) => julianDay(e.year, e.month, e.day, e.hour + (e.minute || 0) / 60 + (e.second || 0) / 3600 - (e.utcOffsetMinutes || 0) / 60);

function chartOf(input, base) {
  const ctx = createChartContext({
    ...input,
    ianaTimeZone: input.ianaTimeZone ?? base.ianaTimeZone,
    ayanamsha: base.ayanamsha,
    houseSystem: base.houseSystem,
    nodeType: base.nodeType,
    calendarMode: 'tirukanita',
  });
  return { ctx, chart: calculateParashariChart(ctx) };
}

const housesFrom = (firstSign, signs) => Array.from({ length: 12 }, (_, i) => ({
  house: i + 1, sign: (firstSign + i) % 12, planets: ALL.filter((p) => signs[p] === (firstSign + i) % 12),
}));

/**
 * @param natal      { chart (calculateParashariChart result), ctx (its chart context) }
 * @param event      { year, month, day, hour, minute, second?, latitude, longitude, utcOffsetMinutes, ianaTimeZone?, placeName? }
 * @param levels     how many Vimshottari levels (1-5)
 */
function eventChart({ natal, event, levels = 5 }) {
  const ay = natal.ctx.ayanamsha;
  const base = { ayanamsha: ay, houseSystem: natal.ctx.houseSystem, nodeType: natal.ctx.nodeType, ianaTimeZone: natal.ctx.input.ianaTimeZone };
  const { ctx: eCtx, chart: eChart } = chartOf(event, base);
  const eJd = eChart.julianDay;
  const eMs = (eJd - 2440587.5) * 86400000;

  // the event chart
  const signs = Object.fromEntries(ALL.map((p) => [p, eChart.grahas[p].rasiIndex]));
  const lagnaSign = eChart.lagna.rasiIndex;
  const moonSign = signs.Moon;
  const chart = {
    lagnaSign, lagnaDegree: eChart.lagna.degreeInSign, moonSign,
    planets: ALL.map((p) => ({ planet: p, sign: signs[p], degree: eChart.grahas[p].degreeInSign, longitude: eChart.grahas[p].longitude })),
    fromLagna: housesFrom(lagnaSign, signs),
    fromMoon: housesFrom(moonSign, signs),
    fromNatalLagna: housesFrom(natal.chart.lagna.rasiIndex, signs),
  };

  // kakshas of the event's planets over the birth chart (by-sign reading)
  const natalLon = Object.fromEntries(GRAHAS.map((p) => [p, natal.chart.grahas[p].longitude]));
  const ks = kakshyaTransit({ natal: { lagnaLongitude: natal.chart.lagna.longitude, mcLongitude: natal.chart.mc, longitudes: natalLon }, atMs: eMs, ayanamsha: ay, method: 'SIGN' });
  const kakshas = ks.planets.map((p) => ({
    planet: p.planet, sign: p.rasiIndex, kakshya: p.kakshya, lord: p.lord, bindu: p.bindu, bhinna: p.bhavaBindus, sarva: ks.sarva[p.unit],
  }));

  // gochara facts
  const natalStar = Math.floor(norm(natal.chart.grahas.Moon.longitude) / (360 / 27));
  const eventStar = Math.floor(norm(eChart.grahas.Moon.longitude) / (360 / 27));
  const count = ((eventStar - natalStar + 27) % 27) + 1;
  const cat = ((count - 1) % 9);
  const { sunLongitude, moonLongitude } = sunMoonLongitudes(eJd, ay);
  const tithiIdx = Math.floor(norm(moonLongitude - sunLongitude) / 12);
  const yogaIdx = Math.floor(norm(sunLongitude + moonLongitude) / (360 / 27));
  const karanaSerial = Math.floor(norm(moonLongitude - sunLongitude) / 6);
  const gochara = {
    tara: { count, category: cat + 1, name: TARA[cat][0], nameTa: TARA[cat][1] },
    chandraFromBirthMoon: ((moonSign - natal.chart.grahas.Moon.rasiIndex + 12) % 12) + 1,
    chandraFromBirthLagna: ((moonSign - natal.chart.lagna.rasiIndex + 12) % 12) + 1,
    tithi: { index: tithiIdx + 1, name: TITHI_NAMES[tithiIdx % 15] ?? String(tithiIdx), paksha: tithiIdx < 15 ? 'SHUKLA' : 'KRISHNA', nameFull: TITHI_NAMES[tithiIdx] ?? null },
    nakshatra: { index: eventStar, name: NAKSHATRA_NAMES[eventStar] },
    yoga: { index: yogaIdx, name: YOGA_NAMES[yogaIdx] },
    karana: { serial: karanaSerial, name: karanaName(karanaSerial) },
  };

  // dashas running at the event, from the birth chart
  const bi = natal.ctx.input;
  const birthJd = natal.chart.julianDay;
  const vim = buildVimshottariDasha(birthJd, natal.chart.grahas.Moon.longitude, bi.utcOffsetMinutes, { depth: Math.min(Math.max(levels, 1), 5) });
  const birthMs = (birthJd - 2440587.5) * 86400000;
  const yog = buildYoginiDasha(natal.chart.grahas.Moon.longitude, birthMs);
  const asht = buildAshtottariDasha(natal.chart.grahas.Moon.longitude, birthMs);
  const pick = (d) => currentPeriod(d.periods, eMs);
  const nSigns = Object.fromEntries(ALL.slice(0, 7).concat(['Rahu', 'Ketu']).map((p) => [p, natal.chart.grahas[p].rasiIndex]));
  const nDeg = Object.fromEntries(ALL.map((p) => [p, natal.chart.grahas[p].longitude % 30]));
  const rashiFacts = {
    signs: nSigns, degrees: nDeg, lagnaSign: natal.chart.lagna.rasiIndex, lagnaLongitude: natal.chart.lagna.longitude,
    moonFraction: (natal.chart.grahas.Moon.longitude % (360 / 27)) / (360 / 27),
  };
  const rashi = (id) => {
    try {
      const r = RS.SYSTEMS[id](rashiFacts);
      const sched = RS.schedule(r, birthMs, 3).find((s) => s.startMs <= eMs && eMs < s.endMs);
      return sched ? { sign: sched.sign, startMs: sched.startMs, endMs: sched.endMs, years: sched.years } : null;
    } catch (e) { return null; }
  };
  const dashas = {
    vimshottari: chainAtJulianDay(vim, eJd).map((c) => ({ level: c.level, lord: c.lord, startLocal: c.startLocal, endLocal: c.endLocal })),
    yogini: (() => { const p = pick(yog); return p && { yogini: p.yogini, yoginiTa: p.yoginiTa, lord: p.lord, start: p.start, end: p.end }; })(),
    ashtottari: (() => { const p = pick(asht); return p && { lord: p.lord, start: p.start, end: p.end }; })(),
    chara: rashi('chara'),
    sthira: rashi('sthira'),
  };

  // Graha Bala parts and Vimshopaka of the event chart
  const dSigns = Object.fromEntries(V.PLANETS.map((p) => [p, signs[p]]));
  const dDegrees = Object.fromEntries(V.PLANETS.map((p) => [p, eChart.grahas[p].longitude % 30]));
  const vim5 = V.allVimshopaka({ signs: dSigns, degrees: dDegrees }, Object.keys(V.SCHEMES)[0]).map((r) => ({ planet: r.planet, total: r.total, reading: r.reading }));

  return { event: { ...event, julianDay: eJd, ayanamsha: ay }, chart, kakshas, kakshaMethod: ks.method.id, gochara, dashas, vimshopaka: { scheme: Object.keys(V.SCHEMES)[0], planets: vim5 }, eventCtx: eCtx, eventChart: eChart };
}

module.exports = { eventChart, TARA, jdOfEvent, GRAHAS, ALL };
