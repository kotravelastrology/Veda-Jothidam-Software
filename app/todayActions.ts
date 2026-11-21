'use server';

import { utcOffsetMinutes } from '../src/sources/places/timezone';
import type { BirthFormInput } from './report/actions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createCalculationRequest } = require('../src/contracts/calculationRequest');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withEphemeris } = require('../src/ephemeris/isolation');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildVimshottariDasha } = require('../src/dasha/vimshottariDasha');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { planetLongitude } = require('../src/ephemeris/siderealPositions');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { personalToday } = require('../src/report/personalToday');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateTirukanitaPanchangam } = require('../src/panchangam/tirukanitaPanchangam');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateDailyMuhurtham } = require('../src/panchangam/muhurtham');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { NAKSHATRA_TA, WEEKDAY_TA, YOGA_TA, KARANA_TA, tithiTa } = require('../src/sources/tamilNames');

export interface TodayPlace {
  latitude: number;
  longitude: number;
  /** IANA zone of the place; today's offset is read from it (summer time abroad). */
  timeZone: string;
  placeName: string;
}

/** "HH:MM" of an engine local date-time ('YYYY-MM-DD HH:MM:SS' or ISO-like); the date part is kept when it is not today. */
function clock(local: string, today: string): string {
  const [d, t] = String(local).replace('T', ' ').split(' ');
  const hm = (t ?? '').slice(0, 5);
  return d && d !== today ? `${hm} (${Number(d.slice(8, 10))}/${Number(d.slice(5, 7))})` : hm;
}

/**
 * Today's panchangam for the home page: the five limbs at sunrise with the time each ends (Tirukanita, Karanam Ramakumar,
 * Panchangam Calculations, S1-B), and Rahu kalam, Yamagandam and Gulika kalam (same source, file pages 22-23).
 */
export async function computeToday(place: TodayPlace) {
  const offset = utcOffsetMinutes(place.timeZone, Date.now());
  const now = new Date(Date.now() + offset * 60000);
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();
  const ctx = createChartContext({
    year, month, day, hour: 12,
    ianaTimeZone: place.timeZone, utcOffsetMinutes: offset,
    latitude: place.latitude, longitude: place.longitude, placeName: place.placeName,
    calendarMode: 'tirukanita',
  });
  const p = calculateTirukanitaPanchangam(ctx);
  const m = calculateDailyMuhurtham(ctx);
  const today = p.date;
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  const tithi = tithiTa(p.tithi.index);
  return {
    date: today,
    placeName: place.placeName,
    weekdayTa: WEEKDAY_TA[weekday] as string,
    sunrise: clock(p.sunriseLocal, today),
    tithi: { ...tithi, until: clock(p.tithi.endLocal, today) },
    nakshatra: { name: NAKSHATRA_TA[p.nakshatra.index] as string, until: clock(p.nakshatra.endLocal, today) },
    yoga: { name: YOGA_TA[p.yoga.index] as string, until: clock(p.yoga.endLocal, today) },
    karana: { name: (KARANA_TA[p.karana.name] ?? p.karana.name) as string, until: clock(p.karana.endLocal, today) },
    rahuKalam: `${clock(m.rahuKalam.startLocal, today)}–${clock(m.rahuKalam.endLocal, today)}`,
    yamagandam: `${clock(m.yamagandam.startLocal, today)}–${clock(m.yamagandam.endLocal, today)}`,
    gulikaKalam: `${clock(m.gulikaKalam.startLocal, today)}–${clock(m.gulikaKalam.endLocal, today)}`,
  };
}

/**
 * "Today for you" (src/report/personalToday.js): the running dasha, bhukti and antara of one chart, the Moon of the day against the birth
 * star (tara), and Saturn's and Jupiter's houses from the birth Moon with the Sade Sati phase, as of this moment. The chart is computed with
 * the settings it carries (ayanamsha, house system, nodes) and the dasha options of the Settings, like the dasha page.
 */
export async function computePersonalToday(input: BirthFormInput, dashaOptions?: { yearDays: number; balance: 'degree' | 'time' }) {
  const request = createCalculationRequest({
    input,
    settings: { ayanamsha: input.ayanamsha, houseSystem: input.houseSystem, nodeType: input.nodeType },
    outputs: ['parashariChart', 'vimshottari'],
  });
  const options = dashaOptions ?? { yearDays: 365.25, balance: 'degree' };
  return withEphemeris({ ayanamsha: request.settings.ayanamsha }, async () => {
    const chart = calculateParashariChart(request.chartContext);
    const dasha = buildVimshottariDasha(chart.julianDay, chart.grahas.Moon.longitude, input.utcOffsetMinutes, {
      depth: 1,
      yearDays: options.yearDays,
      balance: options.balance,
      moonLongitudeAt: (jd: number) => planetLongitude(jd, 'Moon', request.settings.ayanamsha),
    });
    const mahadashas = dasha.dashas.map((d: any) => ({
      lord: d.lord,
      startJd: d.startJulianDay,
      endJd: d.endJulianDay,
      ...(d.fullStartJulianDay !== undefined ? { fullStartJd: d.fullStartJulianDay } : {}),
    }));
    return JSON.parse(JSON.stringify(personalToday({
      natalMoonLongitude: chart.grahas.Moon.longitude,
      mahadashas,
      utcOffsetMinutes: input.utcOffsetMinutes,
      atMs: Date.now(),
      ayanamsha: request.settings.ayanamsha,
    })));
  });
}
