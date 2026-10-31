/**
 * Printable documents for PL9's Print menu: Ephemeris, Panchang, Krishnamurti (KP chart), 1-5 level dashas, the compact lifetime dasha (3 levels) and the Transit/dasha
 * report, and the two plain-text exports of the Research menu (birth data, ephemeris). Each builder returns a document { title, subtitle, blocks } of tables and notes that
 * the /print page shows on screen and prints; nothing here is a prediction and no rule of astrology is applied: the values come from the engines already in the app
 * (Swiss ephemeris with the chosen ayanamsha, the Tirukanita panchangam, the KP system, the Vimshottari tree).
 *
 * A block is { kind: 'table', heading, columns: [string], rows: [[string]], note? } or { kind: 'text', heading, text }.
 */
const { julianDay } = require('@swisseph/node');
const { createChartContext } = require('../contracts/chartContext');
const { calculateParashariChart } = require('../chart/parashariChart');
const { planetLongitude, nodeLongitude, sunMoonLongitudes } = require('../ephemeris/siderealPositions');
const { calculateTirukanitaPanchangam } = require('../panchangam/tirukanitaPanchangam');
const { calculateKpSystem } = require('./kpSystem');
const { buildVimshottariDasha } = require('../dasha/vimshottariDasha');
const { RASI_TA: SIGN_TA } = require('../sources/tamilNames');

const PLANET_TA = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' };
const PLANET_SHORT = { Sun: 'சூ', Moon: 'சந்', Mars: 'செ', Mercury: 'புத', Jupiter: 'குரு', Venus: 'சுக்', Saturn: 'சனி', Rahu: 'ரா', Ketu: 'கே' };
const BODIES = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const DASHA_LEVEL_TA = ['தசை', 'புக்தி', 'அந்தரம்', 'சூக்ஷ்மம்', 'பிராணன்'];
const DASHA_KEYS = ['Dasha', 'Bhukti', 'Antara', 'Sookshma', 'Prana'];
const norm = (x) => ((x % 360) + 360) % 360;
const pad = (n, w = 2) => String(n).padStart(w, '0');

/**
 * The Vimshottari tree for a print, with the Dasha Options (`dashaOptions`: { yearDays, balance }, the settings' Dasha Year and
 * Dasha Balance Method). Without options the engine's own defaults (365.25-day year, balance by degree) are used.
 */
function dashaTree(chart, ctx, depth, dashaOptions = {}) {
  return buildVimshottariDasha(chart.julianDay, chart.grahas.Moon.longitude, ctx.input.utcOffsetMinutes, {
    depth,
    yearDays: dashaOptions.yearDays ?? 365.25,
    balance: dashaOptions.balance ?? 'degree',
    moonLongitudeAt: (jd) => planetLongitude(jd, 'Moon', ctx.ayanamsha),
  });
}

/** "மேஷம் 12°34′56″" for a longitude. */
function dms(lon, withSign = true) {
  const x = norm(lon);
  const sign = Math.floor(x / 30);
  const inSign = x - sign * 30;
  let d = Math.floor(inSign);
  let m = Math.floor((inSign - d) * 60);
  let s = Math.round(((inSign - d) * 60 - m) * 60);
  if (s === 60) { s = 0; m += 1; }
  if (m === 60) { m = 0; d += 1; }
  return `${withSign ? `${SIGN_TA[sign]} ` : ''}${pad(d)}°${pad(m)}′${pad(s)}″`;
}
/** Speed in degrees per day as hh:mm:ss of arc, signed (the form PL9's ephemeris file uses). */
function speedText(v) {
  const a = Math.abs(v);
  const d = Math.floor(a);
  const m = Math.floor((a - d) * 60);
  const s = Math.round(((a - d) * 60 - m) * 60);
  return `${v < 0 ? '-' : ''}${pad(d)}:${pad(m)}:${pad(s % 60)}`;
}

function longitudeAt(jd, body, ayanamsha, nodeType) {
  if (body === 'Rahu') return nodeLongitude(jd, ayanamsha, nodeType);
  if (body === 'Ketu') return norm(nodeLongitude(jd, ayanamsha, nodeType) + 180);
  if (body === 'Sun' || body === 'Moon') {
    const r = sunMoonLongitudes(jd, ayanamsha);
    return body === 'Sun' ? r.sunLongitude : r.moonLongitude;
  }
  return planetLongitude(jd, body, ayanamsha);
}
const speedAt = (jd, body, ayanamsha, nodeType) => (((longitudeAt(jd + 0.5, body, ayanamsha, nodeType) - longitudeAt(jd - 0.5, body, ayanamsha, nodeType)) + 540) % 360) - 180;

const daysIn = (year, month) => new Date(Date.UTC(year, month, 0)).getUTCDate();
const MONTH_TA = ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'];

/** One row per day at 0h UT: the nine grahas' sidereal longitudes and their speeds. */
function ephemerisRows(year, month, { ayanamsha = 'Lahiri', nodeType = 'mean', offsetMinutes = 0 } = {}) {
  const out = [];
  for (let day = 1; day <= daysIn(year, month); day += 1) {
    const jd = julianDay(year, month, day, -offsetMinutes / 60);
    const lon = Object.fromEntries(BODIES.map((b) => [b, longitudeAt(jd, b, ayanamsha, nodeType)]));
    const speed = Object.fromEntries(BODIES.map((b) => [b, speedAt(jd, b, ayanamsha, nodeType)]));
    out.push({ date: `${pad(day)}-${pad(month)}-${year}`, jd, lon, speed });
  }
  return out;
}

/** Ephemeris print: a month at 0h UT, or at 0h local time when `offsetMinutes` is the place's UTC offset (PL9's ephemeris file is at local midnight). */
function ephemerisDocument({ year, month, ayanamsha = 'Lahiri', nodeType = 'mean', offsetMinutes = 0 }) {
  const rows = ephemerisRows(year, month, { ayanamsha, nodeType, offsetMinutes });
  return {
    title: `எபிமெரிஸ் — ${MONTH_TA[month - 1]} ${year}`,
    subtitle: `${offsetMinutes ? `0h உள்ளூர் (UT${offsetMinutes >= 0 ? '+' : '-'}${pad(Math.floor(Math.abs(offsetMinutes) / 60))}:${pad(Math.abs(offsetMinutes) % 60)})` : '0h UT'} · நிரயண தீர்க்கம் · ${ayanamsha} அயனாம்சம் · ${nodeType === 'true' ? 'உண்மை' : 'சராசரி'} ராகு`,
    blocks: [
      { kind: 'table', heading: 'தீர்க்கம் (ஆர் = வக்ரம்)', columns: ['தேதி', ...BODIES.map((b) => PLANET_TA[b])], rows: rows.map((r) => [r.date, ...BODIES.map((b) => `${dms(r.lon[b])}${r.speed[b] < 0 ? ' ஆர்' : ''}`)]) },
      { kind: 'table', heading: 'தினசரி வேகம் (பாகை:கலை:விகலை)', columns: ['தேதி', ...BODIES.map((b) => PLANET_TA[b])], rows: rows.map((r) => [r.date, ...BODIES.map((b) => speedText(r.speed[b]))]) },
    ],
    rows,
  };
}

/** Plain CSV of the same ephemeris (the Research menu's "Export Ephemeris"): date, jd, then longitude (degrees) and speed (degrees per day) per body. */
function ephemerisCsv({ year, month, ayanamsha = 'Lahiri', nodeType = 'mean', offsetMinutes = 0 }) {
  const rows = ephemerisRows(year, month, { ayanamsha, nodeType, offsetMinutes });
  const head = ['date', 'julian_day_ut', ...BODIES.flatMap((b) => [`longitude_${b}`, `speed_${b}`])];
  const lines = rows.map((r) => [r.date, r.jd.toFixed(5), ...BODIES.flatMap((b) => [r.lon[b].toFixed(6), r.speed[b].toFixed(6)])].join(','));
  return `${[head.join(','), ...lines].join('\n')}\n`;
}

/** Panchang print: each day of a month at a place (the Tirukanita panchangam of the app, sunrise-day rule). */
function panchangDocument({ year, month, place }) {
  const rows = [];
  for (let day = 1; day <= daysIn(year, month); day += 1) {
    const ctx = createChartContext({
      year, month, day, hour: 12, minute: 0, ianaTimeZone: place.ianaTimeZone ?? 'Asia/Kolkata', utcOffsetMinutes: place.utcOffsetMinutes, latitude: place.latitude, longitude: place.longitude,
      placeName: place.placeName, calendarMode: 'tirukanita',
    });
    const p = calculateTirukanitaPanchangam(ctx);
    const t = (x) => String(x).slice(11, 16);
    rows.push([`${pad(day)}-${pad(month)}`, p.vara, p.sunriseLocal ? t(p.sunriseLocal) : '—', `${p.tithi.name} (→ ${p.tithi.endLocal})`, `${p.nakshatra.name} (→ ${p.nakshatra.endLocal})`, `${p.yoga.name} (→ ${p.yoga.endLocal})`, `${p.karana.name} (→ ${p.karana.endLocal})`]);
  }
  return {
    title: `பஞ்சாங்கம் — ${MONTH_TA[month - 1]} ${year}`,
    subtitle: `${place.placeName ?? ''} · அட்சம் ${place.latitude}, தீர்க்கம் ${place.longitude} · திருக்கணித முறை (சூரிய உதய நாள் எல்லை)`,
    blocks: [{ kind: 'table', heading: 'தினசரி பஞ்சாங்கம்', columns: ['தேதி', 'வாரம்', 'உதயம்', 'திதி (முடிவு)', 'நட்சத்திரம் (முடிவு)', 'யோகம் (முடிவு)', 'கரணம் (முடிவு)'], rows }],
  };
}

/** KP chart print: cusps, planets and the four-level house significators. */
function kpDocument({ birth, name }) {
  const kp = calculateKpSystem(birth);
  if (!kp.available) throw new Error('KP அட்டவணை கிடைக்கவில்லை.');
  const sl = (x) => (PLANET_TA[x] ?? x ?? '—');
  return {
    title: `கிருஷ்ணமூர்த்தி பத்ததி — ${name ?? ''}`,
    subtitle: `${birth.year}-${pad(birth.month)}-${pad(birth.day)} ${pad(birth.hour)}:${pad(birth.minute)} · ${birth.placeName ?? ''} · பிளாசிடஸ் வீடுகள்`,
    blocks: [
      { kind: 'table', heading: 'கஸ்ப்கள்', columns: ['வீடு', 'தீர்க்கம்', 'நட்சத்திரம்', 'ராசி அதிபதி', 'நட்சத்திர அதிபதி', 'உப அதிபதி', 'உப-உப'], rows: kp.cusps.map((c) => [String(c.number), dms(c.longitude), c.nakshatra, sl(c.signLord), sl(c.starLord), sl(c.sub), sl(c.subSub)]) },
      { kind: 'table', heading: 'கிரகங்கள்', columns: ['கிரகம்', 'தீர்க்கம்', 'நட்சத்திரம்', 'வீடு', 'ராசி அதிபதி', 'நட்சத்திர அதிபதி', 'உப அதிபதி', 'உப-உப'], rows: kp.positions.map((p) => [`${PLANET_TA[p.name] ?? p.name}${p.retrograde ? ' (வ)' : ''}`, dms(p.longitude), `${p.nakshatra} ${p.pada ?? ''}`.trim(), String(p.house ?? '—'), sl(p.signLord), sl(p.starLord), sl(p.sub), sl(p.subSub)]) },
      ...(kp.houseSignificators ? [{ kind: 'table', heading: 'வீட்டுக் குறிகாட்டிகள் (4 நிலை)', columns: ['வீடு', 'நிலை 1', 'நிலை 2', 'நிலை 3', 'நிலை 4'], rows: kp.houseSignificators.map((h) => [String(h.house), ...[h.level1, h.level2, h.level3, h.level4].map((l) => (l ?? []).map((n) => PLANET_SHORT[n] ?? n).join(' ') || '—')]) }] : []),
    ],
  };
}

function walkTree(periods, depth, want, out = [], prefix = []) {
  for (const p of periods) {
    const here = [...prefix, p];
    if (here.length === depth) out.push(here);
    else {
      const kids = p[DASHA_KEYS[here.length]];
      if (kids) walkTree(kids, depth, want, out, here);
    }
  }
  return out;
}

/** Dasha print: Vimshottari to `levels` (1-5); levels 4 and 5 are limited to a window of years from `fromYear` so the page stays readable. */
function dashaDocument({ birth, name, levels = 3, fromYear = null, toYear = null, dashaOptions = {} }) {
  const L = Math.min(Math.max(levels, 1), 5);
  const ctx = createChartContext({ ...birth, calendarMode: 'tirukanita' });
  const chart = calculateParashariChart(ctx);
  const tree = dashaTree(chart, ctx, L, dashaOptions);
  const all = walkTree(tree.dashas ?? tree.mahadashas ?? tree.periods ?? [], L);
  const yr = (p) => Number(String(p.startLocal).slice(0, 4));
  const from = fromYear ?? birth.year;
  const to = toYear ?? (L >= 4 ? from + 4 : birth.year + 120);
  const inRange = all.filter((chain) => yr(chain[L - 1]) >= from && yr(chain[L - 1]) <= to);
  const MAX_ROWS = 800;
  const rows = inRange.slice(0, MAX_ROWS);
  return {
    title: `தசைகள் (${L} நிலை) — ${name ?? ''}`,
    subtitle: `விம்சோத்தரி · ${from}–${to} · சந்திரன் ${dms(chart.grahas.Moon.longitude)}`,
    blocks: [{
      kind: 'table', heading: DASHA_LEVEL_TA.slice(0, L).join(' – '), columns: [...DASHA_LEVEL_TA.slice(0, L), 'தொடக்கம்', 'முடிவு'],
      rows: rows.map((chain) => [...chain.map((p) => PLANET_TA[p.lord] ?? p.lord), String(chain[L - 1].startLocal).slice(0, 10), String(chain[L - 1].endLocal).slice(0, 10)]),
      note: [L >= 4 ? 'நான்கு, ஐந்து நிலைகள் தெரிவு செய்த ஆண்டு வரம்புக்குள் மட்டும் (அச்சு நீளம் கருதி).' : null, inRange.length > MAX_ROWS ? `முதல் ${MAX_ROWS} வரிசைகள் மட்டும் (மொத்தம் ${inRange.length}); ஆண்டு வரம்பைச் சுருக்கவும்.` : null].filter(Boolean).join(' ') || undefined,
    }],
  };
}

/** The compact lifetime: every bhukti of the whole life in a row per dasha, the antara lords in the cells (3 levels). */
function compactLifetimeDocument({ birth, name, dashaOptions = {} }) {
  const ctx = createChartContext({ ...birth, calendarMode: 'tirukanita' });
  const chart = calculateParashariChart(ctx);
  const tree = dashaTree(chart, ctx, 3, dashaOptions);
  const dashas = tree.dashas ?? tree.mahadashas ?? tree.periods ?? [];
  const d10 = (p) => String(p.startLocal).slice(0, 10);
  const blocks = dashas.map((d) => ({
    kind: 'table', heading: `${PLANET_TA[d.lord]} தசை ${d10(d)} → ${String(d.endLocal).slice(0, 10)}`, columns: ['புக்தி', 'தொடக்கம்', 'அந்தரங்கள் (தொடக்கம்)'],
    rows: (d.Bhukti ?? []).map((b) => [PLANET_TA[b.lord], d10(b), (b.Antara ?? []).map((a) => `${PLANET_SHORT[a.lord]} ${d10(a).slice(2)}`).join(' · ')]),
  }));
  return { title: `வாழ்நாள் தசைகள் (சுருக்கம், 3 நிலை) — ${name ?? ''}`, subtitle: `விம்சோத்தரி · சந்திரன் ${dms(chart.grahas.Moon.longitude)}`, blocks };
}

/** Transit/dasha report: the dasha chain running on a date and the grahas' transit positions with the houses counted from the birth lagna and the birth Moon. */
function transitDocument({ birth, name, on, ayanamsha = 'Lahiri', nodeType = 'mean', dashaOptions = {} }) {
  const ctx = createChartContext({ ...birth, calendarMode: 'tirukanita' });
  const chart = calculateParashariChart(ctx);
  const jd = julianDay(on.year, on.month, on.day, (on.hour ?? 12) - (ctx.input.utcOffsetMinutes || 0) / 60);
  const lagnaSign = chart.lagna.rasiIndex;
  const moonSign = chart.grahas.Moon.rasiIndex;
  const tree = dashaTree(chart, ctx, 5, dashaOptions);
  const jdNow = jd;
  const inside = (p) => p.startJulianDay !== undefined ? p.startJulianDay <= jdNow && jdNow < p.endJulianDay : true;
  const chain = [];
  let list = tree.dashas ?? tree.mahadashas ?? tree.periods ?? [];
  for (let level = 0; level < 5; level += 1) {
    const cur = list.find((p) => (p.startJulianDay !== undefined ? inside(p) : String(p.startLocal).slice(0, 10) <= `${on.year}-${pad(on.month)}-${pad(on.day)}` && `${on.year}-${pad(on.month)}-${pad(on.day)}` < String(p.endLocal).slice(0, 10)));
    if (!cur) break;
    chain.push(cur);
    list = cur[DASHA_KEYS[level + 1]] ?? [];
  }
  const rows = BODIES.map((b) => {
    const lon = longitudeAt(jd, b, ayanamsha, nodeType);
    const sign = Math.floor(lon / 30);
    const natal = Math.floor(norm(chart.grahas[b].longitude) / 30);
    return [PLANET_TA[b], dms(lon), `${((sign - lagnaSign + 12) % 12) + 1}`, `${((sign - moonSign + 12) % 12) + 1}`, SIGN_TA[natal], `${((sign - natal + 12) % 12) + 1}`];
  });
  return {
    title: `கோசாரம்-தசை அறிக்கை — ${name ?? ''}`,
    subtitle: `${on.year}-${pad(on.month)}-${pad(on.day)} · ஜன்ம லக்னம் ${SIGN_TA[lagnaSign]} · ஜன்ம சந்திரன் ${SIGN_TA[moonSign]}`,
    blocks: [
      { kind: 'table', heading: 'நடப்பு விம்சோத்தரி தசை', columns: ['நிலை', 'அதிபதி', 'தொடக்கம்', 'முடிவு'], rows: chain.map((p, i) => [DASHA_LEVEL_TA[i], PLANET_TA[p.lord] ?? p.lord, String(p.startLocal).slice(0, 10), String(p.endLocal).slice(0, 10)]) },
      { kind: 'table', heading: 'கோசார கிரகங்கள்', columns: ['கிரகம்', 'தீர்க்கம்', 'லக்னத்திலிருந்து வீடு', 'சந்திரனிலிருந்து வீடு', 'ஜன்ம ராசி', 'ஜன்ம ராசியிலிருந்து'], rows },
    ],
  };
}

/** The Research menu's birth-data export: one tab-separated record of the birth and the nine grahas and the lagna (this software's own layout). */
function birthExportText({ birth, name }) {
  const ctx = createChartContext({ ...birth, calendarMode: 'tirukanita' });
  const c = calculateParashariChart(ctx);
  const head = ['name', 'place', 'date_dd:mm:yyyy', 'time_hh:mm:ss', 'julian_day_ut', 'utc_offset_hours', 'longitude_east', 'latitude_north', 'ayanamsha', 'lagna', ...BODIES.map((b) => b.toLowerCase())];
  const row = [name ?? '', birth.placeName ?? '', `${pad(birth.day)}:${pad(birth.month)}:${birth.year}`, `${pad(birth.hour)}:${pad(birth.minute)}:${pad(birth.second ?? 0)}`, c.julianDay.toFixed(9), ((birth.utcOffsetMinutes || 0) / 60).toFixed(4), birth.longitude, birth.latitude, ctx.ayanamsha, c.lagna.longitude.toFixed(6), ...BODIES.map((b) => c.grahas[b].longitude.toFixed(6))];
  return `${head.join('\t')}\n${row.join('\t')}\n`;
}

module.exports = { ephemerisDocument, ephemerisCsv, panchangDocument, kpDocument, dashaDocument, compactLifetimeDocument, transitDocument, birthExportText, dms, speedText, MONTH_TA };
