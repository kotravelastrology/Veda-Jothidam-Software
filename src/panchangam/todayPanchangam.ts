import { utcOffsetMinutes } from '../sources/places/timezone';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateTirukanitaPanchangam } = require('./tirukanitaPanchangam');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateDailyMuhurtham } = require('./muhurtham');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { NAKSHATRA_TA, WEEKDAY_TA, YOGA_TA, KARANA_TA, tithiTa } = require('../sources/tamilNames');

export interface TodayPlace {
  latitude: number;
  longitude: number;
  /** IANA zone of the place; the day's offset is read from it (summer time abroad). */
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
 * The panchangam of the local day at `atMs` in the place's zone: the five limbs at sunrise with the time each ends (Tirukanita, Karanam
 * Ramakumar, Panchangam Calculations, S1-B), and Rahu kalam, Yamagandam and Gulika kalam (same source, file pages 22-23). The home
 * page's card (app/todayActions.ts computeToday) and the morning notification (src/notify/schedulerHost.ts) both read it.
 */
export function todayPanchangam(place: TodayPlace, atMs: number = Date.now()) {
  const offset = utcOffsetMinutes(place.timeZone, atMs);
  const now = new Date(atMs + offset * 60000);
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
