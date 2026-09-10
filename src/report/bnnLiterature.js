/**
 * பிருகு நந்தி நாடி — இலக்கிய அடுக்கு (BNN literature layer).
 *
 * Ported from the Nadi-sw project (`public/nadi-literature.js` +
 * `public/transit-insights.js`), stripped of its browser UI. Two parts:
 *
 *  1. karakaLiterature — per-graha bilingual notes comparing K.N. Rao's
 *     karaka list, the "Gemini" character text and a cautious synthesis.
 *     Pure reference data (src/report/data/nadi-karaka-literature.json).
 *  2. A reading engine over the chart's NATAL CONJUNCTIONS (same-sign pairs)
 *     and the SATURN / JUPITER / RAHU / KETU transit contacts (1 = same sign,
 *     5/7/9 = Nadi trine / opposition, plus Saturn's 3/10 special aspects).
 *     Each contact yields cited, bilingual, CONDITIONAL readings — a
 *     favourable branch and a challenging branch, never a verdict — from the
 *     book's own conjunction / node-transit / house-lord-transit tables
 *     (src/report/data/bnn-reading-rules.json), with a "why" breakdown of
 *     what was actually calculated (angular gap, natal house, owned houses,
 *     dasha-lord match) and an explicit list of what was NOT assessed.
 *
 * Geometry is computed; textual outcomes stay conditional. Nothing here
 * establishes an event, a date or a strength score.
 */
const RULES = require('./data/bnn-reading-rules.json');
const KARAKA_LITERATURE = require('./data/nadi-karaka-literature.json');

const PLANET_IDS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const RASI_LORDS = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
const TA = ['சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி', 'ராகு', 'கேது'];
const SIGN_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];
const SIGN_EN = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

const mod = (v, n) => ((v % n) + n) % n;
const distance = (a, b) => Math.abs(mod(a - b + 180, 360) - 180);
const signOf = (p) => Math.floor(mod(p.longitude, 360) / 30);
const nameTa = (id) => TA[PLANET_IDS.indexOf(id)] || id;

/** Whole-sign houses (1-12) that graha `id` rules, counted from the natal Ascendant. */
function ownedHouses(natal, id) {
  const asc = natal.find((p) => p.id === 'Ascendant');
  if (!asc) return [];
  return Array.from({ length: 12 }, (_, i) => i + 1)
    .filter((h) => RASI_LORDS[mod(signOf(asc) + h - 1, 12)] === id);
}

/**
 * Contacts of a transiting graha (`kind` = Saturn/Jupiter/Rahu/Ketu) onto the
 * natal grahas, or — with kind='natal' — every same-sign natal pair.
 * offset 1 = same sign; 5/7/9 = Nadi trine / opposition; 3/10 = Saturn aspects.
 */
function contacts(natal, transit, kind = 'Saturn', includeNodeAspects = true) {
  const nat = natal.filter((p) => PLANET_IDS.includes(p.id) && Number.isFinite(p.longitude));
  if (kind === 'natal') {
    return nat.flatMap((a, i) => nat.slice(i + 1)
      .filter((b) => signOf(a) === signOf(b))
      .map((b) => ({ from: a, to: b, offset: 1, gap: distance(a.longitude, b.longitude), type: 'natal' })))
      .sort((a, b) => a.gap - b.gap);
  }
  const from = (transit || []).find((p) => p.id === kind);
  if (!from || !Number.isFinite(from.longitude)) return [];
  const offsets = kind === 'Saturn' ? [1, 3, 5, 7, 9, 10]
    : kind === 'Jupiter' ? [1, 5, 7, 9]
      : includeNodeAspects ? [1, 5, 7, 9] : [1];
  return nat.flatMap((to) => {
    const offset = mod(signOf(to) - signOf(from), 12) + 1;
    return offsets.includes(offset)
      ? [{ from, to, offset, type: offset === 1 ? 'transit' : 'aspect', gap: distance(from.longitude + (offset - 1) * 30, to.longitude) }]
      : [];
  }).sort((a, b) => (a.offset !== 1) - (b.offset !== 1) || a.gap - b.gap);
}

function relationLabel(offset, en = false) {
  if (offset === 1) return en ? 'Same-sign conjunction' : 'ஒரே ராசிச் சேர்க்கை';
  if (offset === 5 || offset === 9) return `${offset} · ${en ? 'Nadi trine' : 'நாடி திரிகோணம்'}`;
  if (offset === 7) return en ? '7 · Opposite sign' : '7 · எதிர் ராசித் தொடர்பு';
  return `${offset} · ${en ? 'Saturn special aspect' : 'சனியின் சிறப்புப் பார்வை'}`;
}

const src = (title, page) => ({ title, page });

/** The book rows for one contact — conjunction / node-transit / house-lord tables. */
function directReadings(natal, transit, dashaLords, c) {
  if (c.type === 'aspect') {
    if (!['Saturn', 'Jupiter'].includes(c.from.id)) return [];
    const other = c.from.id === 'Saturn' ? 'Jupiter' : 'Saturn';
    // book's Sa+Ju convergence marker: fire only when the OTHER slow graha also
    // contacts this same target this transit.
    const shared = contacts(natal, transit, other).some((x) => x.to.id === c.to.id);
    if (!shared) return [];
    const active = (dashaLords || []).slice(0, 2).includes(c.to.id);
    const t = active
      ? ['சனி–குரு இரண்டும் நடப்புத் தசை அல்லது புக்தி அதிபதியைத் தொடர்புகொள்கின்றன. இந்நூல் இதை முக்கிய மாற்றங்களுக்கான ஆய்வுக் குறியாகக் குறிப்பிடுகிறது; நல்லதா கெட்டதா என்பதை இந்த விதி மட்டும் தீர்மானிக்காது.', '', 'Both Saturn and Jupiter contact the current dasha or bhukti lord. This source treats it as a marker for significant change, without deciding whether it is favourable.', '', 41]
      : ['சனி–குரு இரண்டும் இந்த ராசியைத் தொடர்புகொள்கின்றன. இந்நூல் இதை அந்தப் பாவத்தில் முக்கிய நிகழ்வுகளை ஆய்வு செய்யும் குறியாகக் குறிப்பிடுகிறது; நிகழ்வின் தன்மையைத் தனியாக மதிப்பிட வேண்டும்.', '', 'Both Saturn and Jupiter contact this sign. The source flags significant house-related events; their nature requires separate assessment.', '', 40];
    return [{ data: t, source: src('Practical Application of Nadi Techniques', active ? 41 : 40), basis: 'matrix' }];
  }

  if (c.type === 'natal') {
    const key = [c.from.id, c.to.id].sort((a, b) => PLANET_IDS.indexOf(a) - PLANET_IDS.indexOf(b)).join(':');
    const data = RULES.natalRules[key];
    return data ? [{ data, source: src('கிரக இணைவு மகா களஞ்சியம்', data[4]), basis: 'natal' }] : [];
  }

  const key = `${c.from.id}:${c.to.id}`;
  const rows = [];
  if (RULES.nodeRules[key]) rows.push({ data: RULES.nodeRules[key], source: src('கோச்சார ராகு–கேது', RULES.nodeRules[key][4]), basis: 'planet' });
  const m = RULES.matrix[c.from.id] && RULES.matrix[c.from.id][c.to.id];
  if (m) rows.push({ data: [m[0], '', m[1], '', 61], source: src('Practical Application of Nadi Techniques', 61), basis: 'matrix' });
  for (const h of ownedHouses(natal, c.to.id)) {
    const data = RULES.houseRules[c.from.id] && RULES.houseRules[c.from.id][h - 1];
    if (data) rows.push({ data, source: src('Practical Application of Nadi Techniques', data[4]), basis: 'lord', house: h });
  }
  return rows;
}

function readings(natal, transit, dashaLords, c) {
  if (c.type === 'natal-aspect') {
    return directReadings(natal, transit, dashaLords, { ...c, type: 'natal' }).map((r) => ({
      ...r,
      method: ['கீழுள்ளவை கிரக இணைவு அத்தியாயத்தின் பொதுக் கருத்துகள். இந்த 5/7/9 பிறப்புத் தொடர்பிற்கான நேரடி பலன் உரை இன்னும் சரிபார்க்கப்படவில்லை; ஆய்வுக்கான ஒப்பீடு மட்டும்.',
        'These are general conjunction-chapter meanings for comparison. A direct prediction for this natal 5/7/9 contact has not yet been verified.'],
    }));
  }
  if (c.type !== 'aspect') return directReadings(natal, transit, dashaLords, c);
  const node = ['Rahu', 'Ketu'].includes(c.from.id);
  const method = node
    ? ['1–5–7–9 தொடர்பு விதி: கோச்சார ராகு–கேது, PDF 15–22. கீழுள்ள கிரகப் பலன் அத்தியாயத்துடன் இணைத்த நாடி விளக்கம்.',
      'Nadi synthesis of the 1/5/7/9 contact rule (கோச்சார ராகு–கேது, PDF 15–22) and the planet chapter below.']
    : ['நாடி/பார்வைத் தொடர்புடன் கிரகம் மற்றும் பாவ அதிபத்தியப் பலன்களை இணைத்த விளக்கம். இது தனிப் பார்வைக்கான நேரடி நூல் மேற்கோள் அல்ல. தொடர்பு ஆய்வு: Practical Application of Nadi Techniques, PDF 40–41.',
      'Interpretive synthesis of Nadi/aspect contact with planet and house-lord meanings, not a direct quotation for this individual aspect. Contact framework: Practical Application of Nadi Techniques, PDF 40–41.'];
  return [
    ...directReadings(natal, transit, dashaLords, { ...c, type: 'transit' }).map((r) => ({ ...r, method })),
    ...directReadings(natal, transit, dashaLords, c),
  ];
}

/** Shape one contact + its readings for the report. */
function shapeContact(natal, transit, dashaLords, c) {
  const asc = natal.find((p) => p.id === 'Ascendant');
  const rows = readings(natal, transit, dashaLords, c).map((r) => ({
    basis: r.basis,
    house: r.house || null,
    method: r.method ? { ta: r.method[0], en: r.method[1] } : null,
    support: { ta: r.data[0] || null, en: r.data[2] || null },
    challenge: { ta: r.data[1] || null, en: r.data[3] || null },
    source: { title: r.source.title, page: String(r.source.page) },
  }));
  return {
    from: c.from.id,
    fromTa: nameTa(c.from.id),
    to: c.to.id,
    toTa: nameTa(c.to.id),
    offset: c.offset,
    relation: { ta: relationLabel(c.offset, false), en: relationLabel(c.offset, true) },
    gap: Math.round(c.gap * 100) / 100,
    fromSign: { ta: SIGN_TA[signOf(c.from)], en: SIGN_EN[signOf(c.from)] },
    toSign: { ta: SIGN_TA[signOf(c.to)], en: SIGN_EN[signOf(c.to)] },
    natalHouse: asc ? mod(signOf(c.to) - signOf(asc), 12) + 1 : null,
    ownedHouses: ownedHouses(natal, c.to.id),
    dashaLordMatch: (dashaLords || []).slice(0, 2).flatMap((l, i) => (l === c.to.id ? [['Dasha', 'Bhukti'][i]] : [])),
    readings: rows,
  };
}

const CAVEAT = {
  ta: 'கிரக பலம், நவாம்ச ஆதரவு, நட்சத்திர அதிபதியின் பலம் மற்றும் முழுத் தசை நிபந்தனைகள் தானாக மதிப்பிடப்படவில்லை. சாதக–சவாலான பலன்கள் மாற்றுக் கிளைகள்; அனைத்தும் ஒன்றாக நிகழும் என்ற முடிவு அல்ல.',
  en: 'Planetary strength, Navamsa support, star-lord strength and complete dasha conditions have not been automatically assessed. Favourable and challenging outcomes are alternative branches, not simultaneous certainties.',
};

/**
 * @param q.natal     [{ id, longitude, sign?, retrograde? }] incl. 'Ascendant'
 * @param q.transit   [{ id, longitude }] transiting Sa/Ju/Ra/Ke (+ others ok)
 * @param q.dashaLords running Vimshottari lords, mahādaśā first
 */
function calculateBnnLiterature(q) {
  const natal = (q.natal || []).filter((p) => Number.isFinite(p.longitude));
  const transit = q.transit || [];
  const dashaLords = q.dashaLords || [];

  const natalConjunctions = contacts(natal, transit, 'natal').map((c) => shapeContact(natal, transit, dashaLords, c));
  const transitContacts = {};
  for (const kind of ['Saturn', 'Jupiter', 'Rahu', 'Ketu']) {
    transitContacts[kind] = contacts(natal, transit, kind, true).map((c) => shapeContact(natal, transit, dashaLords, c));
  }

  return {
    available: true,
    karakas: KARAKA_LITERATURE,          // { Sun..Ketu : { pages, rao:[ta,en], gemini:[ta,en], synthesis:[ta,en] } }
    natalConjunctions,
    transitContacts,
    caveat: CAVEAT,
  };
}

/** Build the { natal, transit, dashaLords } input from a buildReportData result
 *  plus a computeTransitPositions result. */
function fromReportData(reportData, transitPositions) {
  const natal = [{ id: 'Ascendant', longitude: reportData.chart.lagna.longitude }];
  for (const id of PLANET_IDS) {
    const g = reportData.chart.grahas[id];
    if (g) natal.push({ id, longitude: g.longitude, retrograde: false });
  }
  const transit = (transitPositions && transitPositions.planets ? transitPositions.planets : [])
    .map((p) => ({ id: p.planet, longitude: p.longitude }));
  // running Vimshottari chain: mahādaśā + bhukti lords
  const jd = Date.now() / 86400000 + 2440587.5;
  const dashaLords = [];
  const maha = (reportData.dasha.dashas || []).find((d) => jd >= d.startJulianDay && jd < d.endJulianDay);
  if (maha) {
    dashaLords.push(maha.lord);
    const bh = (maha.Bhukti || []).find((d) => jd >= d.startJulianDay && jd < d.endJulianDay);
    if (bh) dashaLords.push(bh.lord);
  }
  return { natal, transit, dashaLords };
}

module.exports = {
  calculateBnnLiterature, fromReportData,
  contacts, ownedHouses, readings, relationLabel,
  KARAKA_LITERATURE, PLANET_IDS,
};
