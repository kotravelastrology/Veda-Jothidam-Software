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
 *  - Pages 109-117, "Pratyantardasha results": the same nine mahadashas, a table for each antardasha with its nine pratyantardashas, their dates, and what BPHS
 *    ch.61 says of each (the same 81 entries in every mahadasha), with where the antardasha lord stands (antardashaEffects.js; no verdict).
 *  - Pages 118-121, "Sookshma results": the thirty-six pratyantardashas from the one running on the day of printing (the same as pages 30-32), nine to a page, each
 *    with its nine sookshma dashas, their date-times, and what BPHS ch.62 says of each (antardashaEffects.js; no verdict).
 *  - Pages 122-123, "Prana results": the nine prana dashas of each of eighteen sookshma dashas from the one running on the day of printing, their date-times, and what
 *    BPHS ch.63 says of each (no verdict).
 *  - Pages 124-126, "Kalachakra dasha results": the twelve mahadashas from birth with what BPHS ch.65 says of the dasha of each sign in its Amsa, and the twelve antardashas
 *    of each with what ch.64 says of each (kalachakraEffects.js); the book gives both for the Savya chakra only, so an Apsavya birth gets the book's rule and no table.
 *  - Page 127, "Inauspicious births": the births BPHS ch.85-96 call inauspicious (Amavasya, dark Chaturdashi, Bhadra, the three Gandantas, Abhukta Moola and others) read against
 *    the chart (janmaDosha.js), the effect the book gives and the book's remedy for each that holds; what the chart cannot say is listed and not checked.
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
const { treeFor, listChildren, dmy: dmyLocal, dmyHm } = require('./vimshottariPages');
const KP = require('./kalachakraPages');
const KE = require('../kalachakraEffects');
const J = require('../janmaDosha');
const K = require('../../dasha/kalachakraBphs');

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

/**
 * Pages 109-117: the pratyantardashas of the `index`-th mahadasha from birth against BPHS ch.61, antardasha by antardasha. The book gives one
 * effect for each pair of antardasha and pratyantardasha lords, the same in every mahadasha, and adds that the bad ones do not come if the
 * antardasha lord is well placed; the page shows where that lord stands and gives no verdict.
 */
async function buildPratyantarResults({ name = '', birth, dashaOptions, index }) {
  const { tree, chart } = await treeFor(birth, dashaOptions, 3);
  const md = tree.dashas[index];
  const facts = chartFacts(chart);
  const source = AE.PRATYANTAR.source;
  const cite = (x) => located(source.title, `Chapter 61 v.${x.verse}, printed p.${x.page}`, source.author);
  const g = AE.PRATYANTAR.general;
  const blocks = [{
    kind: 'text',
    heading: `${PLANET_TA[md.lord] ?? md.lord} மகாதசை — ${dmyLocal(md.startLocal)} முதல் ${dmyLocal(md.endLocal)} வரை · பிரத்யந்தர தசைப் பலன்கள் (பிருஹத் பராசர ஹோரா சாஸ்திரம், அத். 61)`,
    text: `நூல் ஒவ்வொரு புக்தி-பிரத்யந்தர ஜோடிக்கும் ஒரு பலனைத் தருகிறது; அது எல்லா மகாதசையிலும் ஒன்றே. ${g.rule.ta} ${g.method.ta} புக்தி அதிபதி ஜாதகத்தில் நிற்கும் இடத்தை மட்டும் காட்டுகிறோம் — தீர்ப்பு இல்லை. ${cite(g.rule)}.`,
  }];
  for (const { lord, node: ad } of listChildren(md, 'Bhukti')) {
    const house = DE.houseOf(facts.lagnaSign, facts.signs[lord]);
    const place = `${PLANET_TA[lord] ?? lord} ஜாதகத்தில் ${house}-ஆம் வீட்டில் (${RASI_TA[facts.signs[lord]]}) — ${[1, 5, 9].includes(house) ? 'திரிகோணத்தில் உள்ளது' : 'திரிகோணத்தில் இல்லை'}${[1, 4, 7, 10].includes(house) ? ', கேந்திரத்தில் உள்ளது' : ''}`;
    const rows = listChildren(ad ?? { lord, Antara: [] }, 'Antara').map(({ lord: pd, node }) => {
      const e = AE.pratyantarEffect(lord, pd);
      return [PLANET_TA[pd] ?? pd, node ? dmyLocal(node.startLocal) : '—', node ? dmyLocal(node.endLocal) : '—', e.ta, cite(e)];
    });
    blocks.push({
      kind: 'table',
      heading: `${PLANET_TA[md.lord] ?? md.lord} தசை — ${PLANET_TA[lord] ?? lord} புக்தி`,
      aside: ad ? `${dmyLocal(ad.startLocal)} → ${dmyLocal(ad.endLocal)}` : 'பிறப்புக்கு முன் முடிந்தது',
      columns: ['பிரத்யந்தரம்', 'ஆரம்பம்', 'முடிவு', 'நூல் சொல்வது', 'நூல்'],
      rows,
      note: place,
    });
  }
  return { ...head(name, birth), blocks };
}

/** The index in `flat` of the period (`.node`) running at `asOf`; the first before birth, `span` from the end after the last one ends. */
function runningIndex(flat, asOf, span) {
  const jd = asOf.getTime() / 86400000 + 2440587.5;
  const at = flat.findIndex((x) => x.node.startJulianDay <= jd && jd < x.node.endJulianDay);
  if (at >= 0) return at;
  return jd < flat[0].node.startJulianDay ? 0 : Math.max(0, flat.length - span);
}

/** One table of the nine sub-periods of `node`, each with its date-times, the book's effect (`look(outer, inner)`) and its citation. */
function effectTable({ heading, node, childKey, look, chapter, source }) {
  const rows = listChildren(node, childKey).map(({ lord, node: c }) => {
    const e = look(node.lord, lord);
    return [PLANET_TA[lord] ?? lord, c ? dmyHm(c.startLocal) : '—', c ? dmyHm(c.endLocal) : '—', e.ta, located(source.title, `Chapter ${chapter} v.${e.verse}, printed p.${e.page}`, source.author)];
  });
  return { kind: 'table', heading, aside: `${dmyHm(node.startLocal)} → ${dmyHm(node.endLocal)}`, columns: [childKey === 'Sookshma' ? 'சூக்ஷ்மம்' : 'பிராணம்', 'ஆரம்பம்', 'முடிவு', 'நூல் சொல்வது', 'நூல்'], rows };
}

/** Pages 118-121: nine of the thirty-six pratyantardashas from the one running on `asOf` (`part` 0 to 3), each with its nine sookshma dashas and BPHS ch.62's effect of each. */
async function buildSookshmaResults({ name = '', birth, dashaOptions, part, asOf = new Date() }) {
  const { tree } = await treeFor(birth, dashaOptions, 4);
  const flat = [];
  for (const md of tree.dashas) for (const ad of md.Bhukti || []) for (const pd of ad.Antara || []) flat.push({ md, ad, node: pd });
  const first = runningIndex(flat, asOf, 36);
  const source = AE.SOOKSHMA.source;
  const g = AE.SOOKSHMA.general;
  const slice = flat.slice(first + part * 9, first + part * 9 + 9);
  const blocks = [{
    kind: 'text',
    heading: 'சூக்ஷ்ம தசைப் பலன்கள் (பிருஹத் பராசர ஹோரா சாஸ்திரம், அத். 62) — அச்சிடும் நாளில் நடப்பதிலிருந்து 36 பிரத்யந்தரங்கள் (பக்கங்கள் 30–32 போல)',
    text: `நூல் ஒவ்வொரு பிரத்யந்தர-சூக்ஷ்ம ஜோடிக்கும் ஒரு பலனைத் தருகிறது; அது எல்லா மகாதசை-புக்தியிலும் ஒன்றே. ${g.method.ta} (${located(source.title, `Chapter 62 v.${g.method.verse}, printed p.${g.method.page}`, source.author)}.) ${g.note.ta} (${located(source.title, `Chapter 62 translator's note, printed p.${g.note.page}`, source.author)}.) நூல் இவற்றை எப்படி எடைபோடுவது என்று சொல்லவில்லை; எனவே தீர்ப்பு இல்லை.`,
  }];
  for (const { md, ad, node } of slice) {
    blocks.push(effectTable({
      heading: `${PLANET_TA[md.lord] ?? md.lord} தசை — ${PLANET_TA[ad.lord] ?? ad.lord} புக்தி — ${PLANET_TA[node.lord] ?? node.lord} பிரத்யந்தரம்`,
      node, childKey: 'Sookshma', look: AE.sookshmaEffect, chapter: 62, source,
    }));
  }
  return { ...head(name, birth), blocks };
}

/** Pages 122-123: nine of the eighteen sookshma dashas from the one running on `asOf` (`part` 0 or 1), each with its nine prana dashas and BPHS ch.63's effect of each. */
async function buildPranaResults({ name = '', birth, dashaOptions, part, asOf = new Date() }) {
  const { tree } = await treeFor(birth, dashaOptions, 5);
  const flat = [];
  for (const md of tree.dashas) for (const ad of md.Bhukti || []) for (const pd of ad.Antara || []) for (const sd of pd.Sookshma || []) flat.push({ md, ad, pd, node: sd });
  const first = runningIndex(flat, asOf, 18);
  const source = AE.PRANA.source;
  const g = AE.PRANA.general;
  const slice = flat.slice(first + part * 9, first + part * 9 + 9);
  const blocks = [{
    kind: 'text',
    heading: 'பிராண தசைப் பலன்கள் (பிருஹத் பராசர ஹோரா சாஸ்திரம், அத். 63) — அச்சிடும் நாளில் நடக்கும் சூக்ஷ்மத்திலிருந்து 18 சூக்ஷ்மங்கள்',
    text: `நூல் ஒவ்வொரு சூக்ஷ்ம-பிராண ஜோடிக்கும் ஒரு பலனைத் தருகிறது; அது எல்லா மேல்நிலைத் தசைகளிலும் ஒன்றே. ${g.method.ta} (${located(source.title, `Chapter 63 v.${g.method.verse}, printed p.${g.method.page}`, source.author)}.) ${g.rule.ta} (${located(source.title, `Chapter 63 v.${g.rule.verse}, printed p.${g.rule.page}`, source.author)}.) நூல் ஐந்தையும் எப்படி எடைபோடுவது என்று சொல்லவில்லை; எனவே தீர்ப்பு இல்லை.`,
  }];
  for (const { md, ad, pd, node } of slice) {
    blocks.push(effectTable({
      heading: `${PLANET_TA[md.lord] ?? md.lord} — ${PLANET_TA[ad.lord] ?? ad.lord} — ${PLANET_TA[pd.lord] ?? pd.lord} — ${PLANET_TA[node.lord] ?? node.lord} சூக்ஷ்மம்`,
      node, childKey: 'Prana', look: AE.pranaEffect, chapter: 63, source,
    }));
  }
  return { ...head(name, birth), blocks };
}

/** 'p.835' for one page, 'pp.835-836' for a range, as the citation scanner reads a locus. */
const pagesText = (p) => (String(p).includes('-') ? `pp.${p}` : `p.${p}`);

/**
 * Pages 124-126, "Kalachakra dasha results": page 124 the twelve mahadashas from birth with what BPHS ch.65 says of the dasha of each sign in its Amsa; pages 125-126 the
 * twelve antardashas of six mahadashas each with what ch.64 says of each (kalachakraEffects.js). The book gives both for the Savya chakra only; for an Apsavya birth
 * the pages say so and give the book's rule (ch.64 v.56-58). No verdict.
 */
async function buildKalachakraResults({ name = '', birth, dashaOptions, part }) {
  const { k, facts, off, at } = await KP.setup(birth, dashaOptions, 12);
  const s64 = KE.ANTARDASHA.source;
  const s65 = KE.DASHA.source;
  const where = `${k.chakra === 'savya' ? 'சவ்ய' : 'அப்சவ்ய'} சக்கர`;
  const apsavya = KE.ANTARDASHA.general.apsavya;
  const noTable = `இந்த ஜாதகத்தில் சந்திரன் நிற்கும் நட்சத்திரம் ${where}த்தைச் சேர்ந்தது. நூல் இந்தப் பலன்களை சவ்ய சக்கரத்துக்கு மட்டுமே தருகிறது; அப்சவ்யத்துக்கு அட்டவணை இல்லை. ${apsavya.ta} (${located(s64.title, `Chapter 64 v.${apsavya.verse}, printed ${pagesText(apsavya.page)}`, s64.author)}.) எனவே இங்கு பலன் எதுவும் தரப்படவில்லை.`;
  const lead = {
    kind: 'text',
    heading: part === 0
      ? 'காலச்சக்ர தசைப் பலன்கள் (பிருஹத் பராசர ஹோரா சாஸ்திரம், அத். 65) — முதல் 12 மகாதசைகள்'
      : `காலச்சக்ர புக்திப் பலன்கள் (பிருஹத் பராசர ஹோரா சாஸ்திரம், அத். 64) — மகாதசைகள் ${part === 1 ? '1–6' : '7–12'}`,
    text: k.chakra === 'savya'
      ? (part === 0
        ? `ஒவ்வொரு மகாதசைக்கும் நூல் அதன் அம்சத்தையும் (சந்திரன் நிற்கும் பாதத்தின் நவாம்சம்) வரிசையில் அதன் இடத்தையும் கொண்டு ஒரு பலன் தருகிறது. ${KE.DASHA.general.remedy.ta} (${located(s65.title, `Chapter 65 v.${KE.DASHA.general.remedy.verse}, printed ${pagesText(KE.DASHA.general.remedy.page)}`, s65.author)}.) தீர்ப்பு இல்லை.`
        : `ஒவ்வொரு மகாதசையின் அம்சத்தில், புக்தி ராசியின் அதிபதி பெயரில் நூல் சொல்லும் பலன்கள் இவை. ${KE.ANTARDASHA.general.lords.ta} (${located(s64.title, `Chapter 64 translator's note, printed ${pagesText(KE.ANTARDASHA.general.lords.page)}`, s64.author)}.) நூல் சில அதிபதிகளுக்குப் பலன் சொல்லவில்லை; அங்கு "—" காட்டப்படுகிறது. புக்தி நாட்கள் பக்கம் 41-இன் கணக்கே (PL9 மாதிரி), அத். 64 v.1-இன் சமமற்ற அட்டவணை அல்ல. தீர்ப்பு இல்லை.`)
      : noTable,
  };
  const blocks = [lead];
  if (k.chakra === 'savya') {
    if (part === 0) {
      blocks.push({
        kind: 'table',
        heading: `அம்சம்: ${RASI_TA[k.mahas[0].amsa]} — தசைகள்`,
        columns: ['தசை', 'ஆரம்பம்', 'முடிவு', 'அம்சம்-வரிசை', 'நூல் சொல்வது', 'நூல்'],
        rows: k.mahas.map((m) => {
          const e = KE.dashaEffect(m);
          const cite = e ? located(s65.title, `Chapter 65 v.${e.verses}, printed ${pagesText(e.page)}`, s65.author) : '—';
          return [`${RASI_TA[m.sign]} (${m.fullYears} ஆண்டு)`, KP.dmyOf(at(m.startYears), off), KP.dmyOf(at(m.endYears), off), e ? `${RASI_TA[m.amsa]} அம்சம், ${m.position}-ஆவது` : '—', e ? e.ta : 'அப்சவ்யம் — நூலில் இல்லை', cite];
        }),
      });
    } else {
      for (const m of k.mahas.slice((part - 1) * 6, (part - 1) * 6 + 6)) {
        const rows = K.subPeriods(m, facts).map((a) => {
          const e = KE.antardashaEffect(m, a.sign);
          const cite = e.ta.length ? located(s64.title, `Chapter 64 v.${e.verses}, printed ${pagesText(e.page)}`, s64.author) : '—';
          return [`${RASI_TA[a.sign]} (${PLANET_TA[e.lord] ?? e.lord})`, a.elapsed ? 'பிறப்புக்கு முன் முடிந்தது' : KP.dmyOf(at(a.startYears), off), a.elapsed ? '—' : KP.dmyOf(at(a.endYears), off), e.ta.length ? e.ta.join(' / ') : '—', cite];
        });
        blocks.push({
          kind: 'table',
          heading: `${RASI_TA[m.sign]} தசை — ${RASI_TA[m.amsa]} அம்சம்`,
          aside: `${KP.dmyOf(at(m.startYears), off)} → ${KP.dmyOf(at(m.endYears), off)}`,
          columns: ['புக்தி', 'ஆரம்பம்', 'முடிவு', 'நூல் சொல்வது', 'நூல்'],
          rows,
        });
      }
    }
  }
  return { ...head(name, birth), blocks };
}

/**
 * Page 127, "Inauspicious births": the births BPHS ch.85-96 name as inauspicious although the Lagna and planets are well placed, each read against the chart
 * (janmaDosha.js) with the effect the book gives, and the book's remedy for each that holds. What the chart cannot say is listed and not checked; no verdict.
 */
async function buildJanmaDoshas({ name = '', birth }) {
  const facts = await J.janmaFacts(birth);
  const results = J.evaluate(facts);
  const source = J.DATA.source;
  const cite = (x) => located(source.title, `Chapter ${x.ch} v.${x.verses}, printed ${pagesText(x.page)}`, source.author);
  const label = { held: 'உள்ளது', 'not-held': 'இல்லை', unknown: 'தெரியவில்லை' };
  const rows = results.map((r) => {
    const c = J.byId[r.id];
    const effect = r.status === 'held' && r.part && c.parts ? c.parts[r.part - 1] : [c.effect.ta, ...(c.parts ?? [])].join(' ');
    const define = c.define ? `வரையறை (அத். ${c.define.ch} v.${c.define.verses}, ${pagesText(c.define.page).replace('pp.', 'ப.').replace('p.', 'ப.')}): ${c.define.ta} ` : '';
    return [c.ta, `${label[r.status]} — ${r.detail}`, `${define}${effect}`, cite(c.effect)];
  });
  for (const u of J.DATA.unchecked) rows.push([u.ta, `சோதிக்கப்படவில்லை — ${u.reason}`, u.effect.ta, cite(u.effect)]);
  const held = results.filter((r) => r.status === 'held');
  const blocks = [
    {
      kind: 'text',
      heading: 'அசுபப் பிறப்புகளும் அவற்றுக்கான பரிகாரங்களும் (பிருஹத் பராசர ஹோரா சாஸ்திரம், அத். 85–96)',
      text: `${J.DATA.list.ta} (${cite({ ch: 85, verses: J.DATA.list.verses, page: J.DATA.list.page })}.) நாழிகை = 24 நிமிடம் எனக் கொள்ளப்பட்டது. நூல் தரும் பலன்களையும் பரிகாரங்களையும் மட்டும் காட்டுகிறோம்; தீர்ப்பு இல்லை, எந்தப் பரிகாரமும் பலிக்கும் என்று கூறப்படவில்லை.`,
    },
    { kind: 'table', heading: 'நூல் பெயரிடும் நிலைகள் — இந்த ஜாதகத்தில்', columns: ['நிலை', 'இந்த ஜாதகத்தில்', 'நூல் சொல்வது', 'நூல்'], rows },
  ];
  if (held.length) {
    blocks.push({
      kind: 'table',
      heading: 'உள்ள நிலைகளுக்கு நூல் கூறும் பரிகாரங்கள்',
      columns: ['நிலை', 'நூல் கூறும் பரிகாரம்', 'நூல்'],
      rows: held.map((r) => { const c = J.byId[r.id]; return [c.ta, c.remedy.ta, cite(c.remedy)]; }),
    });
  } else {
    blocks.push({ kind: 'text', heading: 'பரிகாரங்கள்', text: 'நூல் பெயரிடும் நிலைகளில் ஜாதகக் குறிப்பிலிருந்து சோதிக்கக்கூடிய எதுவும் இந்த ஜாதகத்தில் இல்லை; எனவே எந்தப் பரிகாரமும் இங்கு தரப்படவில்லை.' });
  }
  return { ...head(name, birth), blocks };
}

module.exports = { buildMangalaPage, buildSadeSatiRemedies, buildGemstonesPage, buildDashaResults, buildAntardashaResults, buildPratyantarResults, buildSookshmaResults, buildPranaResults, buildKalachakraResults, buildJanmaDoshas };



