'use server';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const N = require('../../src/report/nashtaJataka');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RASI_TA, NAKSHATRA_TA } = require('../../src/sources/tamilNames');

export interface NashtaJatakaRequest {
  /** The moment of the question, as the local wall-clock date and time at `place`. */
  query: { date: string; time: string; utcOffsetMinutes: number; ianaTimeZone?: string };
  place: { name?: string; latitude: number; longitude: number };
  /** The querist's approximate age, in years. */
  age: { min: number; max: number };
  /** Where the querist was born, when that is not the place of the question; the sunrise of the birth day is taken there. */
  birthPlace?: { name?: string; latitude: number; longitude: number; utcOffsetMinutes: number; ianaTimeZone?: string };
}

const bad = (m: string) => { throw new Error(m); };
const okLatLon = (p: { latitude: number; longitude: number }) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude) && Math.abs(p.latitude) <= 90 && Math.abs(p.longitude) <= 180;

/** The chart of a local moment, for its Ascendant, Jupiter and Moon. */
function chartAt(y: number, m: number, d: number, hh: number, mm: number, place: any, offset: number, iana: string) {
  const ctx = createChartContext({
    name: '', gender: 'male', year: y, month: m, day: d, hour: hh, minute: mm, ianaTimeZone: iana, utcOffsetMinutes: offset,
    latitude: place.latitude, longitude: place.longitude, placeName: place.name ?? '', calendarMode: 'tirukanita',
  });
  return calculateParashariChart(ctx);
}

/**
 * The birth moments the chart of a question points to, step by step (BPHS ch.78): the Prasna chart, the steps of v.5-9, and for each year in the age window in which Jupiter stood
 * where the Dwadasamsa says, the Istakala from sunrise and the birth chart's Ascendant, Moon sign and star.
 */
export async function computeNashtaJataka(req: NashtaJatakaRequest) {
  const { date, time } = req.query;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) bad('வினவிய தேதி, நேரம் தேவை.');
  if (!okLatLon(req.place)) bad('இடத்தின் அட்சரேகை, தீர்க்கரேகை சரியில்லை.');
  const { min, max } = req.age;
  if (!Number.isFinite(min) || !Number.isFinite(max) || min < 0 || max < min || max > 120) bad('தோராய வயதின் குறைந்த, கூடிய எல்லைகள் சரியில்லை.');
  const off = Number.isFinite(req.query.utcOffsetMinutes) ? req.query.utcOffsetMinutes : 0;
  const iana = req.query.ianaTimeZone ?? 'Asia/Kolkata';
  const [y, mo, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const queryMs = Date.UTC(y, mo - 1, d, hh, mm) - off * 60000;

  const prasnaChart = chartAt(y, mo, d, hh, mm, req.place, off, iana);
  const lagnaLongitude = prasnaChart.lagna.longitude;
  const lagnaSign = prasnaChart.lagna.rasiIndex;
  const jupiterSign = prasnaChart.grahas.Jupiter.rasiIndex;
  const prasna = N.readPrasna(lagnaLongitude);
  const bp = req.birthPlace ?? { ...req.place, utcOffsetMinutes: off, ianaTimeZone: iana };
  if (!okLatLon(bp)) bad('பிறந்த இடத்தின் அட்சரேகை, தீர்க்கரேகை சரியில்லை.');
  const bOff = Number.isFinite(bp.utcOffsetMinutes) ? bp.utcOffsetMinutes : off;
  const bIana = bp.ianaTimeZone ?? iana;
  const place = { offsetMinutes: bOff, latitude: bp.latitude, longitude: bp.longitude };

  const found = N.birthYears({ prasna, lagnaSign, queryMs, ageMin: min, ageMax: max, ...place });
  const jupiterBack = (((jupiterSign - prasna.samvatsaraSign) % 12) + 12) % 12;
  const candidates = found.candidates.map((c: any) => {
    const t = N.istakala({ sunLongitude: prasna.sunLongitude, year: c.year, ...place });
    const local = new Date(N.msOfJd(t.birthJd) + bOff * 60000);
    const sr = new Date(N.msOfJd(t.sunriseJd) + bOff * 60000);
    const p2 = (n: number) => String(n).padStart(2, '0');
    const hm = (x: Date) => `${p2(x.getUTCHours())}:${p2(x.getUTCMinutes())}`;
    const gh = Math.floor(t.ghatikas);
    const pala = Math.round((t.ghatikas - gh) * 60);
    const birthChart = chartAt(local.getUTCFullYear(), local.getUTCMonth() + 1, local.getUTCDate(), local.getUTCHours(), local.getUTCMinutes(), { ...bp, name: bp.name }, bOff, bIana);
    const moonStar = Math.floor(birthChart.grahas.Moon.longitude / (360 / 27));
    return {
      year: c.year,
      ageYears: c.age,
      date: `${local.getUTCFullYear()}-${p2(local.getUTCMonth() + 1)}-${p2(local.getUTCDate())}`,
      time: hm(local),
      sunrise: hm(sr),
      sunriseDate: `${sr.getUTCFullYear()}-${p2(sr.getUTCMonth() + 1)}-${p2(sr.getUTCDate())}`,
      ghatikas: gh, palas: pala === 60 ? 59 : pala,
      sunAtSunrise: t.sunAtSunriseLongitude,
      sunMotion: t.motion,
      exactDifferenceMinutes: t.differenceMinutes,
      lagnaSign: birthChart.lagna.rasiIndex, lagnaTa: RASI_TA[birthChart.lagna.rasiIndex],
      moonSignTa: RASI_TA[birthChart.grahas.Moon.rasiIndex], moonStarTa: NAKSHATRA_TA[moonStar],
      jupiterSignTa: RASI_TA[c.jupiterSign],
      form: { year: local.getUTCFullYear(), month: local.getUTCMonth() + 1, day: local.getUTCDate(), hour: local.getUTCHours(), minute: local.getUTCMinutes(), utcOffsetMinutes: bOff, latitude: bp.latitude, longitude: bp.longitude, placeName: bp.name ?? '' },
    };
  });
  return JSON.parse(JSON.stringify({
    query: { date, time, placeName: req.place.name ?? '', lagnaTa: RASI_TA[lagnaSign], lagnaDegree: prasnaChart.lagna.degreeInSign, jupiterTa: RASI_TA[jupiterSign] },
    steps: {
      samvatsaraTa: RASI_TA[prasna.samvatsaraSign],
      yearsBackToFirst: jupiterBack,
      ayana: prasna.ayana,
      drekkanaSignTa: RASI_TA[prasna.drekkanaSign], drekkanaLord: prasna.drekkanaLord,
      ritu: prasna.ritu, rituByLord: prasna.rituByLord, exchanged: prasna.exchanged, usedLord: prasna.usedLord, contradiction: prasna.contradiction,
      half: prasna.half, monthSignTa: RASI_TA[prasna.monthSign], expiredDegrees: prasna.expiredDegrees, sunDegrees: prasna.sunDegrees,
    },
    years: found.years.map((e: any) => ({ year: e.year, age: e.age, jupiterSignTa: RASI_TA[e.jupiterSign], matches: e.matches })),
    viaTrikona: found.viaTrikona,
    candidates,
    data: N.DATA,
    lagnaNotes: N.DATA.lagnaNotes.signs,
  }));
}
