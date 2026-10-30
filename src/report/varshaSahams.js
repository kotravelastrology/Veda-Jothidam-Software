/**
 * The sahams as Tajika Bhushana gives them (Ganesha Daivajna; corpus C28), chapter on the sahams, printed pp.68-71 (printed = PDF - 4): nineteen
 * formulas A - B + C over the varsha chart, each for day and night or the same for both, with the book's reading rule (v.11).
 * Read on the page images 2026-10-26; the formulas are in fixtures/varshaphala/tajika-bhushana.json under `sahams` and embedded in
 * varshaInterpretationTables.js.
 *
 * This is a second reading beside the app's own saham table (sahams.js, after Tajika Neelakanthi and a Tamil textbook). The two are compared saham by
 * saham: `compareWithApp` says, for each saham of this book that the app also has, whether the formula is the same, differs, or has no counterpart.
 * The 30-degree correction that sahams.js applies when the third point does not lie between the first two is not in the pages read; the values here are
 * plain A - B + C. Day is the engine's local 6-18 hour test (the book does not say how the day is decided).
 */
const T = require('./varshaInterpretationTables');

const RASI_LORDS = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
const norm = (x) => ((x % 360) + 360) % 360;
const SIGN_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];

const SOURCE = {
  title: 'Tajika Bhushana',
  author: 'Ganesha Daivajna',
  tradition: 'Tajika (Varshaphala)',
  file: 'C28_Tajika_Bhushana_Ganesha.pdf',
  pageLocus: 'Chapter on the sahams, printed pp.68-71: formulas v.1-10 and the reading rule v.11',
};

/** The app's saham key that has the same meaning, where there is one (sahams.js). */
const APP_KEY = {
  punya: 'punya', rajya: 'raja', jiva: 'ayul', mrityu: 'marana_simple', matri: 'thai', bhratri: 'sagodhara', pitri: 'thagappan', putra: 'puthira',
  bala: 'mahatmya', vidya: 'vidya', gaurava: 'gauravam', karma: 'kariya', paradesha: 'velinaattu', dhana: 'panavarumana', labha: 'labha',
  karyasiddhi: 'karyasiddhi', vyapara: 'vyapara',
};

function operandResolver(v, isDay) {
  const g = v.varshaChart.grahas;
  const lagna = v.varshaChart.lagna.longitude;
  const cusp = (h) => v.varshaChart.cusps[h];
  const janmaLagna = (() => {
    // the janma lagna: its sign is the Muntha's sign minus the years elapsed, its degree is carried on `natal`
    const sign = (((v.muntha.rasiIndex - v.yearsElapsed) % 12) + 12) % 12;
    const deg = v.natal && v.natal.lagnaDegree != null ? v.natal.lagnaDegree : null;
    return deg == null ? null : sign * 30 + deg;
  })();
  const lon = (p) => g[p].longitude;
  const lagnaLord = RASI_LORDS[v.varshaChart.lagna.rasiIndex];
  const lordOfSignOf = (longitude) => RASI_LORDS[Math.floor(norm(longitude) / 30)];
  const memo = {};
  const get = (op) => {
    if (op === 'L') return lagna;
    if (op === 'JL') return janmaLagna;
    if (op === 'LL') return lon(lagnaLord);
    if (op === 'H2') return cusp(2);
    if (op === 'H7') return cusp(7);
    if (op === 'H8') return cusp(8);
    if (op === 'LORD2') return lon(lordOfSignOf(cusp(2)));
    if (op === 'LORD7') return lon(lordOfSignOf(cusp(7)));
    if (op === 'SUNLORD') return lon(RASI_LORDS[g.Sun.rasiIndex]);
    if (op.startsWith('SAHAM:')) return memo[op.slice(6)] ?? null;
    if (op.startsWith('LORD:')) { const s = memo[op.slice(5)]; return s == null ? null : lon(lordOfSignOf(s)); }
    return lon(op);
  };
  return { get, memo };
}

/**
 * @param v  the object calculateVarshaphala returns
 * @returns { source, isDay, sahams: [{key, nameTa, verse, printedPage, when, formulaTa, longitude, signIndex, signTa, degree, status, app}], reading, notApplied }
 */
function varshaSahams(v) {
  const hour = Number(String(v.solarReturn.time).slice(0, 2));
  const isDay = hour >= 6 && hour < 18;
  const { get, memo } = operandResolver(v, isDay);
  const out = [];
  for (const f of T.sahams.formulas) {
    let [a, b, c] = f.operands;
    const reverse = f.when === 'DAY' && !isDay;
    if (reverse) [a, b] = [b, a];
    let status = 'COMPUTED';
    let value = null;
    if (f.key === 'karyasiddhi' && !isDay) status = 'NIGHT_UNCLEAR';
    else {
      const A = get(a); const B = get(b); const C = get(c);
      if (A == null || B == null || C == null) status = 'NEEDS_JANMA_LAGNA_DEGREE';
      else value = norm(A - B + C);
    }
    if (value != null) memo[f.key] = value;
    out.push({
      key: f.key, nameTa: f.nameTa, verse: f.verse, printedPage: f.printedPage, when: f.when, textTa: f.textTa,
      operands: reverse ? [a, b, c] : f.operands, reversed: reverse, status,
      longitude: value, signIndex: value == null ? null : Math.floor(value / 30), signTa: value == null ? null : SIGN_TA[Math.floor(value / 30)], degree: value == null ? null : value % 30,
    });
  }
  const appByKey = Object.fromEntries((v.sahams || []).map((s) => [s.key, s]));
  for (const s of out) {
    const app = appByKey[APP_KEY[s.key]];
    s.app = app ? { key: app.key, nameTa: app.name, longitude: app.longitude, signTa: SIGN_TA[Math.floor(app.longitude / 30)], corrected: app.corrected,
      same: s.longitude != null && Math.abs(((app.longitude - s.longitude + 540) % 360) - 180) < 0.02,
      differenceDeg: s.longitude == null ? null : Math.round((((app.longitude - s.longitude + 540) % 360) - 180) * 100) / 100,
      onlyThe30: s.longitude != null && Math.abs(Math.abs(((app.longitude - s.longitude + 540) % 360) - 180) - 30) < 0.02 } : null;
  }
  return { source: SOURCE, isDay, sahams: out, reading: T.sahams.reading, notApplied: T.sahams.notRead, notes: T.sahams.notes };
}

module.exports = { varshaSahams, SOURCE, APP_KEY };
