/**
 * Horoscope book, the pages after PL9's 88 (numbered 89 on): what the HP1 print (KOTRAVEL_HP1, the Tamil prediction set) carries
 * besides the 88-page book's tables - the Mangala dosha, the Saturn Sadesati with its remedies, the gemstone advice and the dasha
 * results. PL9 prints one canned text for each; these pages are built from this software's own engines, which read every book
 * that has the passage and name each with its page, so they never give a single verdict where the books differ.
 *
 *  - Page 89, "Mangala dosha": Mars's place from the Lagna, the Moon and Venus under each reading the books give (mangalaDosha.js), and
 *    the cancellation and aggravation conditions that this chart alone meets, each with its book and page.
 *  - Page 90, "Sadhesati and its remedies": where Saturn stands from the Moon, the running or next Sadhesati, what the books give for each of its
 *    three phases, and the remedies the books record, each with its book and page (saturnTransit.js; nothing is claimed to work).
 *  - Page 91, "Gemstones": each planet's gem and what the three books held (Kapoor, Tilak Raj, Raj Kumar) say of wearing it for this Lagna and Moon
 *    sign (gemstones.js), side by side with where they agree; no gem is recommended.
 *  - Page 92, "Dasha results": the Vimshottari mahadasha running on the day of printing and the next one, with what BPHS ch.47 and ch.48 say of the
 *    dasha of that planet, each placement the book names marked as holding, not holding, or not checked (dashaEffects.js; no verdict).
 *  - Pages 100-108, "Antardasha results": one page for each of the nine mahadashas from birth, with a table for each of its nine antardashas of what
 *    BPHS ch.52-60 say of that antardasha in that dasha, each placement the book names marked the same way (antardashaEffects.js; no verdict).
 * The builders return a Promise of { title, subtitle, blocks }, in the printSets shape.
 */
const { withBirth } = require('./charts');
const M = require('../mangalaDosha');
const { citeTa } = require('../../sources/citeTa');
const { computeSaturnTransits, DEFAULT_KANTAKA } = require('../saturnTransit');
const ST = require('../saturnTransitTables');
const { gemReading } = require('../gemstones');
const GT = require('../gemstoneTables');
const DE = require('../dashaEffects');
const AE = require('../antardashaEffects');
const { buildVimshottariDasha } = require('../../dasha/vimshottariDasha');
const { planetLongitude } = require('../../ephemeris/siderealPositions');
const { PLANET_TA, RASI_TA } = require('../../sources/tamilNames');
const { treeFor, listChildren, dmy: dmyLocal } = require('./vimshottariPages');

const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** citeTa's line for a book title (and author) and a page locus; the locus is set by assignment, as the engines' own `pageLocus` literals are the citation scanner's to read. */
function located(title, locus, author) {
  const source = { title, author };
  source.pageLocus = locus;
  return citeTa(source);
}
const REFERENCE_TA = { LAGNA: 'லக்னம்', MOON: 'சந்திரன்', VENUS: 'சுக்கிரன்' };

function head(name, birth) {
  return { title: `ஜாதகம் — ${name}`.trim(), subtitle: `${birth.placeName} · ${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year}` };
}

/** Page 89: the Mangala dosha of the chart, reading by reading. */
async function buildMangalaPage({ name = '', birth }) {
  return withBirth(birth, ({ chart }) => {
    const gender = birth.gender === 'female' ? 'female' : 'male';
    const result = M.analyseChart(M.factsFromChart(chart, { input: birth, gender }));
    const house = (f, ref) => f.perReference.find((p) => p.reference === ref);
    const formationRows = result.formation.map((f) => {
      const cell = (ref) => {
        const p = house(f, ref);
        return p ? `${p.marsHouse}${p.present ? ' ✔' : ''}` : '—';
      };
      return [f.labelTa, cell('LAGNA'), cell('MOON'), cell('VENUS'), f.present ? 'உண்டு' : 'இல்லை', located(f.sourceTitle, f.sourcePage)];
    });
    const met = result.conditions.filter((c) => c.status === 'MET');
    const counts = Object.entries(result.summary).map(([key, s]) => {
      const book = result.books.find((b) => b.key === key);
      return `${book ? book.title : key}: ${s.MET} பொருந்துகிறது, ${s.NOT_MET} பொருந்தவில்லை, ${s.NEEDS_PARTNER} துணை ஜாதகம் தேவை`;
    });
    return {
      ...head(name, birth),
      blocks: [
        {
          kind: 'text',
          heading: 'செவ்வாய் (மங்கள) தோஷம்',
          text: `செவ்வாய் ${result.marsSignTa}; லக்னம் ${result.lagnaTa}. நூல்கள் வேறுபடுவதால் ஒரே தீர்ப்பு தரப்படவில்லை; ஒவ்வொரு நூலின் கணிப்பும் அதன் பக்கத்தோடு கீழே.`,
        },
        {
          kind: 'table',
          heading: 'செவ்வாய் நிற்கும் வீடு — லக்னம், சந்திரன், சுக்கிரனிலிருந்து',
          columns: ['முறை', 'லக்னம்', 'சந்திரன்', 'சுக்கிரன்', 'தோஷம்', 'நூல்'],
          rows: formationRows,
        },
        {
          kind: 'table',
          heading: 'இந்த ஜாதகத்தில் பொருந்தும் நிபந்தனைகள் (பரிகாரம், விலக்கு, கூடுதல்)',
          columns: ['நூல்', 'நிபந்தனை', 'இந்த ஜாதகத்தில்', 'பக்கம்'],
          rows: met.length
            ? met.map((c) => [c.source.title, c.ta, c.detail ?? '', located('', c.page).replace(/^\s*—\s*/, '')])
            : [['—', 'எந்த நிபந்தனையும் இந்த ஜாதகத்தால் மட்டும் பொருந்தவில்லை', '', '']],
          note: counts.join(' · '),
        },
      ],
    };
  });
}

const pad = (n) => String(n).padStart(2, '0');
/** 'dd-mm-yyyy' of an ISO instant in the zone of `offsetMinutes`. */
function dmy(iso, offsetMinutes) {
  const d = new Date(Date.parse(iso) + offsetMinutes * 60000);
  return `${pad(d.getUTCDate())}-${pad(d.getUTCMonth() + 1)}-${d.getUTCFullYear()}`;
}
const CONDITION_TA = { SADE_SATI: 'ஏழரைச் சனி', ASHTAMA: 'அஷ்டமச் சனி', KANTAKA: 'கண்டகச் சனி' };

/** Page 90: Saturn from the Moon now, the Sadhesati cycles and phases, and the remedies the books record. `atMs` is the day of printing. */
async function buildSadeSatiRemedies({ name = '', birth, atMs = Date.now() }) {
  return withBirth(birth, ({ chart }) => {
    const off = birth.utcOffsetMinutes ?? 0;
    const moon = chart.grahas.Moon;
    const r = computeSaturnTransits({
      moonRasiIndex: moon.rasiIndex, moonNakshatraIndex: Math.floor(moon.longitude / (360 / 27)) % 27,
      birthMs: (chart.julianDay - 2440587.5) * 86400000, horizonYears: 100, atMs, ayanamsha: chart.ayanamsha, kantakaConvention: DEFAULT_KANTAKA,
    });
    const span = (c) => `${dmy(c.fromUtc, off)} முதல் ${dmy(c.toUtc, off)} வரை`;
    const state = r.activeSadeSati
      ? `இப்போது ${r.activeSadeSati.ordinal}-ஆம் ஏழரைச் சனி நடக்கிறது (${span(r.activeSadeSati)}).`
      : r.nextSadeSati ? `இப்போது ஏழரைச் சனி இல்லை; அடுத்தது ${r.nextSadeSati.ordinal}-ஆம் (${span(r.nextSadeSati)}).` : 'இப்போது ஏழரைச் சனி இல்லை.';
    const phaseRows = r.phases.map((p) => [p.nameTa, `${p.house}-ஆம் வீடு`, p.bodyPart, p.resultTa, citeTa(ST.SADE_SATI_PHASES[p.house].source)]);
    const remedyRows = ST.REMEDIES.map((m) => [m.appliesTo.map((a) => CONDITION_TA[a]).join(', '), m.textTa, citeTa(m.source)]);
    return {
      ...head(name, birth),
      blocks: [
        {
          kind: 'text',
          heading: 'ஏழரைச் சனி',
          text: `ஜனன சந்திரன் ${r.moonRasi}. சனி இப்போது சந்திரனிலிருந்து ${r.now.houseFromMoon}-ஆம் வீட்டில். ${state}`,
        },
        {
          kind: 'table',
          heading: 'ஏழரைச் சனியின் மூன்று கட்டங்கள்',
          columns: ['கட்டம்', 'சந்திரனிலிருந்து', 'உடல் பகுதி', 'பலன்', 'நூல்'],
          rows: phaseRows,
        },
        {
          kind: 'table',
          heading: 'பரிகாரம் — நூல்களில் பதிவானவை',
          columns: ['பொருந்தும்', 'பரிகாரம்', 'நூல்'],
          rows: remedyRows,
          note: 'இவை நூல்கள் குறிப்பிடும் வழக்கங்கள்; பலன் தரும் என்று இந்த மென்பொருள் கூறவில்லை. மந்திர வரிகள் நகலெடுக்கப்படவில்லை — நூலைப் பார்க்கவும்.',
        },
      ],
    };
  });
}

const AGREEMENT_TA = {
  AGREE_FAVOURABLE: 'நூல்கள் ஒத்தன — சாதகம்', AGREE_UNFAVOURABLE: 'நூல்கள் ஒத்தன — சாதகமற்றது', DISAGREE: 'நூல்கள் முரண்படுகின்றன',
  PARTIAL: 'ஓரளவு ஒத்தன', ONE_SOURCE: 'ஒரு நூல் மட்டும்', NONE: 'எந்த நூலும் சொல்லவில்லை',
};
const LISTED_TA = { BENEFIC: 'சுபர் பட்டியலில்', MALEFIC: 'பாபர் பட்டியலில்' };

/** Page 91: the gem each book holds for each planet, for this Lagna and Moon sign, with where the books agree. */
async function buildGemstonesPage({ name = '', birth }) {
  return withBirth(birth, ({ chart }) => {
    const rasi = Object.fromEntries([...GT.PLANETS, 'Rahu', 'Ketu'].map((g) => [g, chart.grahas[g].rasiIndex]));
    const r = gemReading({ lagna: chart.lagna.rasiIndex, moon: rasi.Moon, rasi });
    const rows = r.rows.map((x) => [
      `${x.planetTa} — ${x.gemTa}`,
      `${x.place.signTa}, ${x.place.house}-ஆம் வீடு${x.place.exalted ? ' (உச்சம்)' : x.place.debilitated ? ' (நீசம்)' : x.place.own ? ' (ஆட்சி)' : ''}`,
      x.kapoor.verdictTa, x.tilakRaj.verdictTa, LISTED_TA[x.rajKumarLagna.listed] ?? 'பட்டியலில் இல்லை', AGREEMENT_TA[x.agreement],
    ]);
    const bookLine = r.books.map((b) => `${b.title}, ${b.author}`).join(' · ');
    return {
      ...head(name, birth),
      blocks: [
        {
          kind: 'text',
          heading: 'ரத்தினங்கள்',
          text: `லக்னம் ${r.lagnaTa}, சந்திர ராசி ${r.moonTa}. மூன்று நூல்கள் இந்த லக்னத்துக்கு ஒவ்வொரு ரத்தினத்தைப் பற்றியும் சொல்வதை அருகருகே வைக்கிறோம்; நூல்கள் முரண்படும் இடத்தில் எதையும் பரிந்துரைக்கவில்லை. நூல்கள்: ${bookLine}.`,
        },
        {
          kind: 'table',
          heading: 'ஏழு கிரகங்களின் ரத்தினங்கள்',
          columns: ['கிரகம் — ரத்தினம்', 'ஜாதகத்தில்', 'காபூர்', 'திலக் ராஜ்', 'ராஜ் குமார் (லக்னம்)', 'ஒப்பீடு'],
          rows,
          note: `காபூரின் ஆட்சி ரத்தினம்: ${r.kapoor.rulingStone.gemTa} (${r.kapoor.page}). திலக் ராஜ்: ஜீவன் ரத்னம் ${GT.PLANET_GEMS[r.tilakRaj.ratna.jeevan].ta}, காரக ரத்னம் ${GT.PLANET_GEMS[r.tilakRaj.ratna.karaka].ta}, பாக்ய ரத்னம் ${GT.PLANET_GEMS[r.tilakRaj.ratna.bhagya].ta} (${r.tilakRaj.ratnaPage.replace(/\s*\(PDF[^)]*\)/, '')}). எந்த நன்மையும் உறுதி கூறப்படவில்லை.`,
        },
      ],
    };
  });
}

const TAG_TA = {
  EXALTED: 'உச்சம்', DEBILITATED: 'நீசம்', OWN_SIGN: 'சொந்த வீடு', MOOLATRIKONA: 'மூலத்திரிகோணம்', KENDRA: 'கேந்திரம்', TRIKONA: 'திரிகோணம்',
  CONJ_MALEFIC: 'பாபருடன் சேர்க்கை', BENEFIC_CONJ: 'சுபருடன் சேர்க்கை', WANING: 'தேய்பிறைச் சந்திரன்', STRONG_VARGA: 'வர்க்க பலம்',
  BENEFIC_NAVAMSA: 'சுப நவாம்சம்', OWN_NAVAMSA: 'சொந்த நவாம்சம்', EXALTED_NAVAMSA: 'உச்ச நவாம்சம்', FRIEND_SIGN: 'நட்பு வீடு', BENEFIC_SIGN: 'சுப வீடு',
  BENEFIC_ASPECT: 'சுபர் பார்வை', MALEFIC_ASPECT: 'பாபர் பார்வை', COMBUST: 'அஸ்தமனம்',
  // the antardasha reading (ch.52-60)
  ASPECT_BENEFIC: 'சுபர் பார்வை', ASPECT_MALEFIC: 'பாபர் பார்வை', CONJ_BENEFIC: 'சுபருடன் சேர்க்கை', CONJ_DL: 'தசாநாதனுடன் சேர்க்கை',
  D_KENDRA: 'தசாநாதனிலிருந்து கேந்திரம்', D_TRIKONA: 'தசாநாதனிலிருந்து திரிகோணம்', D_AUSPICIOUS: 'தசாநாதனிலிருந்து நல்ல இடம்',
  BENEFIC_D_1_9_KENDRA: 'தசாநாதனிலிருந்து 1, 9, கேந்திரத்தில் சுபர்', WAXING: 'வளர்பிறைச் சந்திரன்', STRENGTH: 'பலம்', WEAK: 'பலவீனம்',
  YOGAKARAKA: 'யோககாரகன்', INAUSPICIOUS_PLACE: 'அசுப இடம்', DEEP_EXALTATION: 'பரம உச்சம்', CRUEL_NAVAMSA: 'கொடிய நவாம்சம்', ENEMY_SIGN: 'பகை வீடு',
  FRIEND_NAVAMSA: 'நட்பு நவாம்சம்', WITH_FRIEND: 'நட்புக் கிரகத்துடன்', OWN_VARGA: 'சொந்த வர்க்கம்', NOT_EXALTED: 'உச்சத்தில் இல்லை',
  NEITHER_EXALTED_NOR_DEBILITATED: 'உச்சமும் நீசமும் இல்லை', IN_MALEFIC_SIGN: 'பாப ராசி', WITH_DEBILITATED: 'நீசக் கிரகத்துடன்',
  ASPECT_LORD_1_9_10: 'லக்ன, 9, 10-ஆம் அதிபதி பார்வை', DEBILITATED_NAVAMSA: 'நீச நவாம்சம்',
};
const tagTa = (tag) => {
  let m;
  if (TAG_TA[tag]) return TAG_TA[tag];
  if ((m = /^H(\d+)$/.exec(tag))) return `${m[1]}-ஆம் வீடு`;
  if ((m = /^D(\d+)$/.exec(tag))) return `தசாநாதனிலிருந்து ${m[1]}-ஆம் வீடு`;
  if ((m = /^LORD_(\d+)$/.exec(tag))) return `${m[1]}-ஆம் அதிபதி`;
  if ((m = /^WITH_LORD_(\d+)$/.exec(tag))) return `${m[1]}-ஆம் அதிபதியுடன்`;
  if ((m = /^SIGN_(\d+)$/.exec(tag))) return RASI_TA[Number(m[1])];
  if ((m = /^WITH_([A-Z][a-z]+)$/.exec(tag))) return `${PLANET_TA[m[1]] ?? m[1]} சேர்க்கை`;
  if ((m = /^ASPECT_([A-Z][a-z]+)$/.exec(tag))) return `${PLANET_TA[m[1]] ?? m[1]} பார்வை`;
  return tag;
};
const KIND_TA = { fav: 'நல்ல பலன்', unfav: 'தீய பலன்', mixed: 'கலப்புப் பலன்', remedy: 'பரிகாரம்', cond: 'நிபந்தனைப் பலன்', note: 'மொழிபெயர்ப்பாளர் குறிப்பு' };
const tags = (list) => list.map(tagTa).join(', ') || '—';
const nullToDash = (x) => x || '—';

/** The chart as the dasha-effects engines take it: the Lagna sign, each planet's sign and degree in it, and whether the Moon is waning. */
function chartFacts(chart) {
  const signs = Object.fromEntries(GT.PLANETS.concat(['Rahu', 'Ketu']).map((g) => [g, chart.grahas[g].rasiIndex]));
  const degrees = Object.fromEntries(Object.keys(signs).map((g) => [g, chart.grahas[g].longitude % 30]));
  const elongation = (((chart.grahas.Moon.longitude - chart.grahas.Sun.longitude) % 360) + 360) % 360;
  return { lagnaSign: Math.floor(chart.lagna.longitude / 30), signs, degrees, moonWaning: elongation >= 180 };
}

/** Page 92: the BPHS ch.47-48 reading of the Vimshottari mahadasha running on `atMs` and of the next, against the chart. */
async function buildDashaResults({ name = '', birth, dashaOptions, atMs = Date.now() }) {
  return withBirth(birth, ({ chart }) => {
    const off = birth.utcOffsetMinutes ?? 0;
    const options = dashaOptions ?? { yearDays: 365.25, balance: 'degree' };
    const tree = buildVimshottariDasha(chart.julianDay, chart.grahas.Moon.longitude, off, {
      depth: 1, yearDays: options.yearDays, balance: options.balance, moonLongitudeAt: (jd) => planetLongitude(jd, 'Moon', chart.ayanamsha),
    });
    const nowJd = atMs / 86400000 + 2440587.5;
    let at = tree.dashas.findIndex((d) => d.startJulianDay <= nowJd && nowJd < d.endJulianDay);
    if (at < 0) at = nowJd < tree.dashas[0].startJulianDay ? 0 : tree.dashas.length - 1;
    const facts = chartFacts(chart);
    const dateOf = (jd) => dmy(new Date((jd - 2440587.5) * 86400000).toISOString(), off);
    const cite = (source, page) => located(source.title, `printed p.${page}`, source.author);
    const blocks = [{
      kind: 'text',
      heading: 'தசைப் பலன்கள் — பிருஹத் பராசர ஹோரா சாஸ்திரம் (அத். 47, 48)',
      text: 'விம்சோத்தரி மகாதசை நடக்கும் கிரகத்தைப் பற்றி நூல் சொல்லும் இடங்களை ஜாதகத்தோடு ஒப்பிடுகிறோம். நூல் எத்தனை நிபந்தனைகள் பொருந்த வேண்டும் என்று சொல்லவில்லை; எனவே எவை பொருந்துகின்றன, எவை பொருந்தவில்லை, எவற்றை இங்கே சோதிக்கவில்லை என்று மட்டும் காட்டுகிறோம் — தீர்ப்பு இல்லை.',
    }];
    for (const d of [tree.dashas[at], tree.dashas[at + 1]].filter(Boolean)) {
      const effects = DE.dashaEffects(d.lord, facts);
      const lordship = DE.lordshipRules(d.lord, facts);
      blocks.push({
        kind: 'table',
        heading: `${PLANET_TA[d.lord] ?? d.lord} மகாதசை — ${dateOf(d.startJulianDay)} முதல் ${dateOf(d.endJulianDay)} வரை · ${effects.sign === undefined ? '' : `ஜாதகத்தில் ${effects.house}-ஆம் வீட்டில்`}`,
        columns: ['வகை', 'நூல் சொல்வது', 'பொருந்தும்', 'பொருந்தாதவை', 'சோதிக்கவில்லை', 'நூல்'],
        rows: effects.sections.map((x) => [KIND_TA[x.kind] ?? x.kind, x.ta, tags(x.held), tags(x.failed), tags(x.unknown), cite(DE.FIXTURE.source, x.page)]),
      });
      const houseRows = lordship.houseLords.map((h) => [`${h.house}-ஆம் அதிபதி`, h.ta, cite(DE.FIXTURE_48.source, h.page)]);
      const ruleRows = lordship.rules.filter((r) => r.holds === true).map((r) => [r.kind === 'fav' ? 'நல்ல பலன்' : 'தீய பலன்', r.ta, cite(DE.FIXTURE_48.source, r.page)]);
      if (houseRows.length || ruleRows.length) {
        blocks.push({
          kind: 'table',
          heading: `${PLANET_TA[d.lord] ?? d.lord} — அதிபதியாக உள்ள வீடுகளின் தசைப் பலன் (அத். 48)`,
          columns: ['வீடு / வகை', 'நூல் சொல்வது', 'நூல்'],
          rows: [...houseRows, ...ruleRows].map((r) => r.map(nullToDash)),
        });
      }
    }
    return { ...head(name, birth), blocks };
  });
}

/**
 * Pages 100-108: the antardashas of the `index`-th mahadasha from birth (0 to 8) against what BPHS ch.52-60 say of each, in the order the
 * mahadasha runs them. An antardasha that ended before birth has no dates. Each placement the book names is marked as holding, not holding
 * or not checked; no verdict.
 */
async function buildAntardashaResults({ name = '', birth, dashaOptions, index }) {
  const { tree, chart } = await treeFor(birth, dashaOptions, 2);
  const md = tree.dashas[index];
  const facts = chartFacts(chart);
  const source = AE.FIXTURE.source;
  const chapter = AE.FIXTURE.chapters[md.lord];
  const cite = (x) => located(source.title, `Chapter ${chapter} v.${x.verses.replace(/^(\d+)-\1$/, '$1')}, printed p.${x.page}`, source.author);
  const blocks = [{
    kind: 'text',
    heading: `${PLANET_TA[md.lord] ?? md.lord} மகாதசை — ${dmyLocal(md.startLocal)} முதல் ${dmyLocal(md.endLocal)} வரை · உப-தசைப் பலன்கள் (பிருஹத் பராசர ஹோரா சாஸ்திரம், அத். ${chapter})`,
    text: 'இந்த மகாதசையின் ஒவ்வொரு புக்தியைப் பற்றியும் நூல் சொல்லும் இடங்களை ஜாதகத்தோடு ஒப்பிடுகிறோம். நூல் எத்தனை நிபந்தனைகள் பொருந்த வேண்டும் என்று சொல்லவில்லை; எனவே எவை பொருந்துகின்றன, எவை பொருந்தவில்லை, எவற்றை இங்கே சோதிக்கவில்லை என்று மட்டும் காட்டுகிறோம் — தீர்ப்பு இல்லை. "தசாநாதனிலிருந்து" என்பது இந்த மகாதசையின் அதிபதியிலிருந்து எண்ணுவது; மற்றவை லக்னத்திலிருந்து.',
  }];
  for (const { lord, node } of listChildren(md, 'Bhukti')) {
    const e = AE.antardashaEffects(md.lord, lord, facts);
    const place = `${PLANET_TA[lord] ?? lord} ஜாதகத்தில் ${e.house}-ஆம் வீட்டில் (${RASI_TA[e.sign]})${e.houseFromDasaLord ? `, தசாநாதனிலிருந்து ${e.houseFromDasaLord}-ஆம் வீடு` : ''}`;
    blocks.push({
      kind: 'table',
      heading: `${PLANET_TA[md.lord] ?? md.lord} தசை — ${PLANET_TA[lord] ?? lord} புக்தி`,
      aside: node ? `${dmyLocal(node.startLocal)} → ${dmyLocal(node.endLocal)}` : 'பிறப்புக்கு முன் முடிந்தது',
      columns: ['வகை', 'நூல் சொல்வது', 'பொருந்தும்', 'பொருந்தாதவை', 'சோதிக்கவில்லை', 'நூல்'],
      rows: e.sections.map((x) => [KIND_TA[x.kind] ?? x.kind, x.ta, tags(x.held), tags(x.failed), tags(x.unknown), cite(x)]),
      note: place,
    });
  }
  return { ...head(name, birth), blocks };
}

module.exports = { buildMangalaPage, buildSadeSatiRemedies, buildGemstonesPage, buildDashaResults, buildAntardashaResults };
