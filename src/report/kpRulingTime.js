/**
 * K.S. Krishnamurti, Reader VI (C34), printed pp.123-142, "Ruling planets": for an event that is to happen within minutes or hours the book does not use a dasa; it takes
 * the ruling planets of the moment and finds when the zodiac position whose sign lord, star lord, sub lord (and sub-sub lord) are all among them rises in the east of the place
 * (printed p.126: "Venus sign, Jupiter star, Sun sub, Venus sub sub ... 29 20 Thula"; p.129: "Taurus sign and Sun star ... take the sub"). Here every such position is listed
 * with the instant the ascendant reaches it in the next hours. The significators that must also hold (kpHoraryTopics) are not applied here; this lists the moments only.
 */
const { TABLE, instantOfAscendant } = require('./kpHorary');
const { subSubTable, bodyLongitude } = require('./kpTransit');

const SOURCE = {
  title: 'Krishnamurti Padhdhati, Reader VI: Horary Astrology',
  author: 'K.S. Krishnamurti',
  tradition: 'Krishnamurti Paddhati (KP)',
  file: 'C34_KP_Reader_VI_Horary_KSK.pdf',
  pageLocus: 'Ruling planets and the worked timing examples, printed pp.123-142 (PDF page = printed + 19)',
};

/** Instants (JD) in [fromJd, fromJd + hours/24] at which the ascendant reaches `longitude` (sidereal, Krishnamurti ayanamsha). */
function reach(longitude, latitude, lon, fromJd, hours) {
  const out = [];
  let jd = instantOfAscendant(longitude, latitude, lon, fromJd + 0.5);
  while (jd < fromJd) jd += 0.99727;
  while (jd > fromJd + 0.99727) jd -= 0.99727;
  if (jd < fromJd) jd += 0.99727;
  for (let k = 0; k < 2 && jd <= fromJd + hours / 24; k += 1) { out.push(jd); jd += 0.99727; }
  return out;
}

/**
 * @param ruling names of the ruling planets (kpHorary.horaryRulingPlanets(...).planets[].planet)
 * @param opts { latitude, longitude, fromJd, hours = 12 }
 * @returns { bySub: [{ signLord, starLord, subLord, from, to, jds }], bySubSub: [... subSubLord] } sorted by first instant
 */
function rulingRisingMoments(ruling, { latitude, longitude, fromJd, hours = 12 }) {
  const set = new Set(ruling);
  const within = (r, keys) => keys.every((k) => set.has(r[k]));
  const shape = (r) => { const jds = reach(r.from, latitude, longitude, fromJd, hours); return { ...r, jds, ends: jds.map((jd) => instantOfAscendant(r.to % 360, latitude, longitude, jd + 0.01)) }; };
  const byFirst = (a, b) => a.jds[0] - b.jds[0];
  const bySub = TABLE.filter((r) => within(r, ['signLord', 'starLord', 'subLord'])).map(shape).filter((r) => r.jds.length).sort(byFirst);
  const bySubSub = subSubTable().filter((r) => within(r, ['signLord', 'starLord', 'subLord', 'subSubLord'])).map(shape).filter((r) => r.jds.length).sort(byFirst);
  return { bySub, bySubSub };
}


const STEP_DAYS = { Moon: 1 / 12, Sun: 1, Jupiter: 5, Saturn: 5 };
const wrap = (x) => ((x + 540) % 360) - 180;

/**
 * Printed p.131 (N.B.): what moves depends on how long the matter takes. Minutes or hours: the ascendant (rulingRisingMoments). Days, within a month: the Moon. More than a month:
 * the Sun ("which month"). Years: Jupiter ("in which year one will build a house"). Here the body's passage through every position ruled by the ruling planets.
 * @param opts { body: 'Moon'|'Sun'|'Jupiter', fromJd, days, ayanamsha = 'Krishnamurti', nodeType = 'mean' }
 * @returns { bySub, bySubSub (Moon only) } each row with `times: [{ enterJd, leaveJd }]` (leaveJd null when the span ends first)
 */
function rulingTransitMoments(ruling, { body, fromJd, days, ayanamsha = 'Krishnamurti', nodeType = 'mean' }) {
  const step = STEP_DAYS[body];
  if (!step) throw new RangeError('body must be Moon, Sun or Jupiter');
  const lon = (jd) => bodyLongitude(jd, body, ayanamsha, nodeType);
  const series = [];
  for (let t = fromJd; t <= fromJd + days + step; t += step) series.push([t, lon(t)]);
  const upward = (target) => {
    const out = [];
    for (let i = 1; i < series.length; i += 1) {
      const a = wrap(series[i - 1][1] - target);
      const b = wrap(series[i][1] - target);
      if (a < 0 && b >= 0 && b - a < 90) {
        let lo = series[i - 1][0]; let hi = series[i][0];
        for (let k = 0; k < 45; k += 1) { const m = (lo + hi) / 2; if (wrap(lon(m) - target) < 0) lo = m; else hi = m; }
        out.push(hi);
      }
    }
    return out.filter((t) => t >= fromJd && t <= fromJd + days);
  };
  const set = new Set(ruling);
  const shape = (r) => {
    const enters = upward(r.from % 360);
    const leaves = upward(r.to % 360);
    const times = enters.map((enterJd) => ({ enterJd, leaveJd: leaves.find((l) => l > enterJd) ?? null }));
    return { ...r, times };
  };
  const pick = (rows, keys) => rows.filter((r) => keys.every((k) => set.has(r[k]))).map(shape).filter((r) => r.times.length).sort((a, b) => a.times[0].enterJd - b.times[0].enterJd);
  return { bySub: pick(TABLE, ['signLord', 'starLord', 'subLord']), bySubSub: body === 'Moon' ? pick(subSubTable(), ['signLord', 'starLord', 'subLord', 'subSubLord']) : [] };
}

/** Local clock time "H:MM:SS" and the day offset (0 = same civil day as `fromJd`'s local day) of a JD at the given offset from UTC. */
function clockOf(jd, utcOffsetMinutes, fromJd) {
  const local = (x) => x + utcOffsetMinutes / 1440 + 0.5;
  const sec = Math.round((local(jd) - Math.floor(local(jd))) * 86400) % 86400;
  const h = Math.floor(sec / 3600);
  return { text: `${h}:${String(Math.floor((sec % 3600) / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`, dayOffset: Math.floor(local(jd)) - Math.floor(local(fromJd)) };
}

module.exports = { rulingRisingMoments, rulingTransitMoments, clockOf, SOURCE };
