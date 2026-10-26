'use server';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const H = require('../../src/report/kpHorary');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const T = require('../../src/report/kpHoraryTopics');

export interface KpHoraryRequest {
  number: number;
  year: number; month: number; day: number; hour: number; minute: number; second?: number;
  utcOffsetMinutes: number; latitude: number; longitude: number; placeName?: string;
  topic?: string;
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
  return JSON.parse(JSON.stringify({ ...chart, analysis, source: H.SOURCE }));
}
