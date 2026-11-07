'use server';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const H = require('../../src/report/kpHorary');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const T = require('../../src/report/kpHoraryTopics');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const R = require('../../src/report/kpRulingTime');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { julianDay } = require('../../src/report/kpTransit');

export interface KpHoraryRequest {
  number: number;
  year: number; month: number; day: number; hour: number; minute: number; second?: number;
  utcOffsetMinutes: number; latitude: number; longitude: number; placeName?: string;
  topic?: string; hours?: number;
}

/** The table of the 249 subs and the list of questions the book names houses for (no person needed). */
export async function loadKpHoraryTables() {
  return JSON.parse(JSON.stringify({
    subs: H.TABLE, topics: T.TOPICS, source: H.SOURCE,
  }));
}

/** The horary chart for a number at the moment and place of judgment (src/report/kpHorary.js), with the houses of the chosen question. */
export async function computeKpHorary(req: KpHoraryRequest) {
  const bad = [req.number, req.year, req.month, req.day, req.hour, req.minute, req.utcOffsetMinutes, req.latitude, req.longitude].some((x) => !Number.isFinite(x));
  if (bad) throw new Error('எண், தேதி, நேரம், இடம் முழுமையாக இல்லை.');
  if (!Number.isInteger(req.number) || req.number < 1 || req.number > 249) throw new Error('எண் 1 முதல் 249 வரை இருக்க வேண்டும்.');
  const chart = H.horaryChart(req);
  const analysis = req.topic ? T.analyseTopic(chart.kp, chart.ruling, req.topic) : null;
  // the zodiac positions ruled by the ruling planets and the instants the ascendant reaches them (printed pp.126-130)
  const fromJd = julianDay(req.year, req.month, req.day, req.hour + (req.minute || 0) / 60 + (req.second || 0) / 3600 - req.utcOffsetMinutes / 60);
  const hours = Number.isFinite(req.hours) && (req.hours as number) > 0 ? Math.min(req.hours as number, 24) : 6;
  const raw = R.rulingRisingMoments(chart.ruling.planets.map((r: any) => r.planet), { latitude: req.latitude, longitude: req.longitude, fromJd, hours });
  const shape = (rows: any[]) => rows.map((r) => ({ signLord: r.signLord, starLord: r.starLord, subLord: r.subLord, subSubLord: r.subSubLord ?? null, from: r.from, to: r.to,
    times: r.jds.map((jd: number, i: number) => ({ start: R.clockOf(jd, req.utcOffsetMinutes, fromJd), end: R.clockOf(r.ends[i], req.utcOffsetMinutes, fromJd) })) }));
  const rising = { hours, bySub: shape(raw.bySub), bySubSub: shape(raw.bySubSub), source: R.SOURCE };
  return JSON.parse(JSON.stringify({ ...chart, analysis, rising, source: H.SOURCE }));
}
