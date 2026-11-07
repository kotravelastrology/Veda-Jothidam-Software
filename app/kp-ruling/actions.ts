'use server';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const R = require('../../src/report/kpRulingTime');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { horaryRulingPlanets } = require('../../src/report/kpHorary');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateKpSystem } = require('../../src/report/kpSystem');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { julianDay } = require('../../src/report/kpTransit');

export type KpRulingMode = 'ASCENDANT' | 'MOON' | 'SUN' | 'JUPITER' | 'BIRTH';

export interface KpRulingRequest {
  /** the moment of judgment and its place */
  year: number; month: number; day: number; hour: number; minute: number; utcOffsetMinutes: number; latitude: number; longitude: number;
  mode: KpRulingMode;
  /** ASCENDANT: hours ahead; MOON: days; SUN: days; JUPITER: days */
  span?: number;
  /** BIRTH: the date and the window of the day the birth is known to lie in, at the birth place */
  birth?: { year: number; month: number; day: number; fromHour: number; fromMinute: number; toHour: number; toMinute: number; utcOffsetMinutes: number; latitude: number; longitude: number };
  /** drop the ruling planets that stand in the star of a retrograde planet (printed p.123) */
  rejectRetrogradeStar?: boolean;
}

const finite = (xs: unknown[]) => xs.every((x) => typeof x === 'number' && Number.isFinite(x));

/** The ruling planets of the moment of judgment and the positions they rule, with the instants those positions rise or are reached (src/report/kpRulingTime.js). */
export async function computeKpRuling(req: KpRulingRequest) {
  if (!finite([req.year, req.month, req.day, req.hour, req.minute, req.utcOffsetMinutes, req.latitude, req.longitude])) throw new Error('தேதி, நேரம், இடம் முழுமையாக இல்லை.');
  const kp = calculateKpSystem({ year: req.year, month: req.month, day: req.day, hour: req.hour, minute: req.minute, utcOffsetMinutes: req.utcOffsetMinutes, latitude: req.latitude, longitude: req.longitude });
  const ruling = horaryRulingPlanets(kp);
  const used = ruling.planets.filter((r: any) => !(req.rejectRetrogradeStar && r.inRetrogradeStar)).map((r: any) => r.planet);
  const fromJd = julianDay(req.year, req.month, req.day, req.hour + req.minute / 60 - req.utcOffsetMinutes / 60);
  const clock = (jd: number | null, off: number, from: number) => (jd === null ? null : R.clockOf(jd, off, from));
  let out: any;
  if (req.mode === 'ASCENDANT') {
    const hours = Math.min(Math.max(req.span ?? 6, 1), 24);
    const raw = R.rulingRisingMoments(used, { latitude: req.latitude, longitude: req.longitude, fromJd, hours });
    const shape = (rows: any[]) => rows.map((r) => ({ ...pickLords(r), times: r.jds.map((jd: number, i: number) => ({ start: clock(jd, req.utcOffsetMinutes, fromJd), end: clock(r.ends[i], req.utcOffsetMinutes, fromJd) })) }));
    out = { kind: 'ASCENDANT', hours, bySub: shape(raw.bySub), bySubSub: shape(raw.bySubSub) };
  } else if (req.mode === 'BIRTH') {
    const b = req.birth;
    if (!b || !finite([b.year, b.month, b.day, b.fromHour, b.fromMinute, b.toHour, b.toMinute, b.utcOffsetMinutes, b.latitude, b.longitude])) throw new Error('பிறந்த தேதி, நேர வரம்பு, இடம் முழுமையாக இல்லை.');
    const from = b.fromHour + b.fromMinute / 60;
    const to = b.toHour + b.toMinute / 60;
    const hours = to - from;
    if (!(hours > 0 && hours <= 24)) throw new Error('பிறந்த நேர வரம்பு 0-24 மணிக்குள் இருக்க வேண்டும்.');
    const birthFrom = julianDay(b.year, b.month, b.day, from - b.utcOffsetMinutes / 60);
    const raw = R.rulingRisingMoments(used, { latitude: b.latitude, longitude: b.longitude, fromJd: birthFrom, hours });
    const shape = (rows: any[]) => rows.map((r) => ({ ...pickLords(r), times: r.jds.map((jd: number, i: number) => ({ start: clock(jd, b.utcOffsetMinutes, birthFrom - from / 24), end: clock(r.ends[i], b.utcOffsetMinutes, birthFrom - from / 24) })) }));
    out = { kind: 'BIRTH', hours, bySub: shape(raw.bySub), bySubSub: shape(raw.bySubSub) };
  } else {
    const body = req.mode === 'MOON' ? 'Moon' : req.mode === 'SUN' ? 'Sun' : 'Jupiter';
    const days = Math.min(Math.max(req.span ?? (body === 'Moon' ? 30 : body === 'Sun' ? 365 : 1460), 1), body === 'Moon' ? 90 : body === 'Sun' ? 730 : 4380);
    const raw = R.rulingTransitMoments(used, { body, fromJd, days });
    const shape = (rows: any[]) => rows.map((r) => ({ ...pickLords(r), times: r.times.map((t: any) => ({ start: R.clockOf(t.enterJd, req.utcOffsetMinutes, fromJd), end: clock(t.leaveJd, req.utcOffsetMinutes, fromJd), enterJd: t.enterJd - fromJd })) }));
    out = { kind: body, days, bySub: shape(raw.bySub), bySubSub: shape(raw.bySubSub) };
  }
  return JSON.parse(JSON.stringify({ ruling, used, ...out, source: R.SOURCE }));
}

function pickLords(r: any) {
  return { signLord: r.signLord, starLord: r.starLord, subLord: r.subLord, subSubLord: r.subSubLord ?? null, from: r.from, to: r.to };
}
