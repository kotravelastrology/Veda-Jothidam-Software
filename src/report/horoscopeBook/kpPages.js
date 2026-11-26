/**
 * Horoscope book, pages 81-82 (PL9 sample aniruddha_HC4): Krishnamurti Paddhati.
 *
 *  - Page 81, "Krishnamurti Paddhati - Chart": the planets with sign, degree, nakshatra, pada and the four lords (RL sign lord, NL star lord,
 *    SL sub lord, SS sub-sub lord), the KP birth chart, and the Placidus house cusps with the same columns.
 *  - Page 82, "Krishnamurti Paddhati - Significators": the significations of the houses in four levels (planets in the star of the
 *    occupants, the occupants, planets in the star of the cusp's sign lord, the cusp's sign lord), the ruling planets and the
 *    Vimshottari lords of the birth Moon.
 * All from kpSystem.js (K.S. Krishnamurti's Readers; the Krishnamurti ayanamsha and the Placidus houses). Not built: the sample's
 * "Houses Signified by Planets" strength classes (very strong / strong / normal / weak) and the cuspal chart.
 * Each builder returns a Promise of { title, subtitle, blocks }.
 */
const { calculateKpSystem, kpChain, SIGNS } = require('../kpSystem');
const { julianDay, calculatePosition, setSiderealMode, Planet, SiderealMode, CalculationFlag } = require('@swisseph/node');
const { withEphemeris } = require('../../ephemeris/isolation');
const { birthNakshatraAndBalance } = require('../../dasha/vimshottariDasha');
const { ymdText } = require('./calendarAge');
const { trueAyanamsa } = require('../../ephemeris/swissEphemeris');
const { PLANET_TA } = require('../../sources/tamilNames');

const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ABBR = { Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke' };
const pad = (n) => String(n).padStart(2, '0');
const ab = (l) => ABBR[l] ?? l ?? '';
const ORDINAL = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth', 'Eleventh', 'Twelfth'];

/** dd:mm:ss of a degree within a sign; the seconds are cut off, not rounded, as PL9 prints them (a lagna of 25:42:09.6 is 25:42:09). */
function dms(deg) {
  const total = Math.min(Math.floor(deg * 3600 + 1e-6), 30 * 3600 - 1);
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`;
}

/** The Krishnamurti ayanamsha at the birth, in degrees (the true one, with the nutation: Arjun's -23:31:22). */
function trueAyanamsaKp(birth) {
  const jd = julianDay(birth.year, birth.month, birth.day, birth.hour + birth.minute / 60 + (birth.second ?? 0) / 3600 - (birth.utcOffsetMinutes ?? 0) / 60);
  return withEphemeris({ ayanamsha: 'Krishnamurti' }, () => { setSiderealMode(SiderealMode.Krishnamurti); return trueAyanamsa(jd); });
}

function head(name, birth) {
  return { title: `ஜாதகம் — ${name}`.trim(), subtitle: `${birth.placeName} · ${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year}` };
}

/** Page 81: the KP planets, the KP birth chart and the Placidus cusps. */
async function buildKpChart({ name = '', birth }) {
  const kp = calculateKpSystem(birth);
  if (!kp.available) throw new Error('KP அட்டவணை கிடைக்கவில்லை.');
  const asc = kpChain(kp.ascendant);
  const row = (label, p, flag = '') => [label, flag, p.sign.slice(0, 3), dms(p.degreeInSign), p.nakshatra, String(p.pada), ab(p.signLord), ab(p.starLord), ab(p.sub), ab(p.subSub)];
  // Uranus, Neptune and Pluto, which PL9 lists after the nodes: the Swiss ephemeris's sidereal positions in the Krishnamurti ayanamsha
  const jd = julianDay(birth.year, birth.month, birth.day, birth.hour + birth.minute / 60 + (birth.second ?? 0) / 3600 - (birth.utcOffsetMinutes ?? 0) / 60);
  const outer = await withEphemeris({ ayanamsha: 'Krishnamurti' }, () => {
    setSiderealMode(SiderealMode.Krishnamurti);
    return ['Uranus', 'Neptune', 'Pluto'].map((name) => {
      const p = calculatePosition(jd, Planet[name], CalculationFlag.SwissEphemeris | CalculationFlag.Sidereal | CalculationFlag.Speed);
      return { name, ...kpChain(p.longitude), retrograde: p.longitudeSpeed < 0 };
    });
  });
  const planets = [
    row('Lagna', asc),
    ...kp.positions.map((p) => row(p.name, p, p.retrograde && p.name !== 'Rahu' && p.name !== 'Ketu' ? 'R' : '')),
    ...outer.map((p) => row(p.name, p, p.retrograde ? 'R' : '')),
  ];
  const cells = Array.from({ length: 12 }, () => []);
  cells[SIGNS.indexOf(asc.sign)].push('As');
  for (const p of kp.positions) cells[SIGNS.indexOf(p.sign)].push(ab(p.name));
  const cusps = kp.cusps.map((c) => {
    const k = kpChain(c.longitude);
    return [`${c.number}.${ORDINAL[c.number - 1]}`, k.sign.slice(0, 3), dms(k.degreeInSign), k.nakshatra, String(k.pada), ab(k.signLord), ab(k.starLord), ab(k.sub), ab(k.subSub)];
  });
  return {
    ...head(name, birth),
    blocks: [
      { kind: 'text', heading: 'Krishnamurti Paddhati', text: `${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year} · ${pad(birth.hour)}:${pad(birth.minute)} · ${birth.placeName} · ${kp.ayanamsha} ayanamsha, ${kp.houseSystem} houses` },
      { kind: 'table', heading: 'Planets', columns: ['Planet', 'R', 'Sign', 'Degree', 'Nakshatra', 'Pada', 'RL', 'NL', 'SL', 'SS'], rows: planets },
      { kind: 'signGrid', heading: 'Birth Chart (KP)', cells },
      { kind: 'table', heading: 'Bhava Details (Placidus System)', columns: ['House cusp', 'Sign', 'Degree', 'Nakshatra', 'Pada', 'RL', 'NL', 'SL', 'SS'], rows: cusps },
    ],
  };
}

/** Page 82: the significations of the houses, the ruling planets and the dasha lords of the Moon. */
async function buildKpSignificators({ name = '', birth, dashaOptions }) {
  const kp = calculateKpSystem(birth);
  if (!kp.available) throw new Error('KP அட்டவணை கிடைக்கவில்லை.');
  const list = (a) => (a && a.length ? a.map(ab).join(', ') : '');
  const houses = kp.houseSignificators.map((h) => [`${h.house}. ${ORDINAL[h.house - 1]}`, list(h.level1), list(h.level2), list(h.level3), ab(h.owner)]);
  const ruling = kp.rulingPlanets.factors.map(([k, v]) => [k, `${PLANET_TA[v] ?? v} (${v})`]);
  const dbas = kp.dbas ? [['Vimshottari lords of the Moon (MD · AD · PD · SD)', kp.dbas.map((l) => PLANET_TA[l] ?? l).join(' · ')]] : [];
  // What PL9 adds to its Ruling Planets box: the sub lords of the Lagna and the Moon, Fortuna (Lagna + Moon - Sun), the dasha balance by the KP Moon and the KP ayanamsha
  const asc = kpChain(kp.ascendant);
  const moon = kp.positions.find((p) => p.name === 'Moon');
  const sun = kp.positions.find((p) => p.name === 'Sun');
  const fortuna = kpChain(((asc.longitude + moon.longitude - sun.longitude) % 360 + 360) % 360);
  const yearDays = dashaOptions?.yearDays ?? 365.25;
  const nak = birthNakshatraAndBalance(moon.longitude);
  const balanceYears = nak.totalYears * (1 - nak.elapsedFraction);
  const birthMs = Date.UTC(birth.year, birth.month - 1, birth.day, birth.hour, birth.minute, birth.second ?? 0) - (birth.utcOffsetMinutes ?? 0) * 60000;
  const extra = [
    ['Lagna Sub Lord', `${PLANET_TA[asc.sub] ?? asc.sub} (${asc.sub})`],
    ['Moon Sub Lord', `${PLANET_TA[moon.sub] ?? moon.sub} (${moon.sub})`],
    ['Fortuna', `${fortuna.sign.slice(0, 3)} ${dms(fortuna.degreeInSign)}`],
    ['Balance of dasha', `${nak.lord} ${ymdText(birthMs, birthMs + balanceYears * yearDays * 86400000, birth.utcOffsetMinutes ?? 0)}`],
    ['KP Ayanamsha', `-${dms(await trueAyanamsaKp(birth))}`],
  ];
  return {
    ...head(name, birth),
    blocks: [
      { kind: 'table', heading: 'Significations of the Houses', columns: ['House', 'Planets in nak. of occupants', 'Occupants', 'Planets in nak. of cusp sign lord', 'Cusp sign lord'], rows: houses, note: 'Four levels of KP: a planet in the star of an occupant, an occupant, a planet in the star of the cusp\'s sign lord, and the sign lord itself.' },
      { kind: 'table', heading: 'Ruling Planets', columns: ['Factor', 'Planet'], rows: [...ruling, ...extra, ...dbas] },
    ],
  };
}

module.exports = { buildKpChart, buildKpSignificators };
