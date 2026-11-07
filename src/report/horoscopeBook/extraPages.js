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
 *  - Page 128, "Yogas leading to asceticism": BPHS ch.79's yogas read against the chart (pravrajyaYoga.js) with the order each names; strength and combustion are not checked.
 *  - Page 129, "Propitiation of the planets": how BPHS ch.84 says each planet is to be propitiated (idol, mantra, havana wood, food, gift), with the running dasha for reference;
 *    the book names no planet for a chart and none is chosen.
 *  - Page 130, "Ashtakavarga: Saturn's transit": BPHS ch.70's rule for each planet (the house, its rekhas times the Yoga Pinda, divided by 27 and 12) worked on the chart, the nakshatras
 *    and signs of Saturn's transit that follow and what the book says is harmed (ashtakavargaEffects.js).
 *  - Page 131, "Panchamahapurusha yogas": the five yogas of BPHS ch.75 read against the chart (mahapurushaYoga.js) with the features the book gives for each that holds.
 *  - Pages 132-133, "Sudarshana Chakra dasha": the twelve solar years from the one running on the day of printing and the twelve months of that year, the house that is the Ascendant of each
 *    in each circle (Ascendant, Moon, Sun) and the facts BPHS ch.74 v.24-26 asks for (sudarshanaDasha.js; no verdict, the Ashtakavarga cross-check is not done).
 *  - Page 134, "Elements and gunas": the element and guna of each planet and the temperament and class that follow from the planet leading by each of the two BPHS Shadbala figures
 *    (BPHS ch.76-77, elementsGunas.js); the books name no measure of strength, so none is chosen.
 *  - Page 135, "Ashtakavarga longevity": the span of life each of the eight Ashtakavargas gives by its rekhas and half their sum (BPHS ch.71, ashtakavargaLongevity.js).
 *  - Page 136, "Samudaya Ashtakavarga": the aggregate rekhas read for the signs, houses, the wealth condition, the three parts of life and the month of the Sun in each sign with the
 *    book's remedies (BPHS ch.72, samudayaEffects.js; nothing is claimed to work).
 *  - Page 137, "Female horoscopy": what BPHS ch.80 says of a woman's chart, read rule by rule (femaleHoroscopy.js); given only for a chart marked female, for the astrologer, no verdicts.
 *  - Pages 138-139, "Curses of the previous birth": the yogas of BPHS ch.83 (the serpent's, the father's, the mother's, a brother's, the maternal uncle's, a Brahmin's, the wife's and the
 *    ancestors' curse, ending in want of a male issue) read condition by condition (curseYogas.js), with the remedies the book names; strength and combustion are not checked.
 *  - Page 140, "Rays of the planets": the rays (rashmi) of the seven planets by BPHS ch.73's rule with the dignity corrections and what the total says (planetaryRays.js).
 *  - Page 141, "Ashtakavarga ch.70, the rest": the years of distress from Saturn's Ashtakavarga (v.37-40), the father's yogas the birth chart shows (v.16-18) and the Sun's and Moon's
 *    Ashtakavarga for auspicious acts (v.19-23), with the running dasha at the start of each year (ashtakavargaYears.js).
 *  - Page 142, "Character": what the classical books say of the rising sign, the Moon's sign and the birth star, each book apart (lagnaRasi.js, janmaRasi.js, janmaNakshatra.js, lagnaLordNature.js),
 *    the sourced counterpart of the nature and character text that PL9's HP1 prints.
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
const { PLANET_TA, RASI_TA, NAKSHATRA_TA } = require('../../sources/tamilNames');
const { treeFor, listChildren, dmy: dmyLocal, dmyHm } = require('./vimshottariPages');
const KP = require('./kalachakraPages');
const KE = require('../kalachakraEffects');
const J = require('../janmaDosha');
const PY = require('../pravrajyaYoga');
const AV = require('../ashtakavargaEffects');
const MP = require('../mahapurushaYoga');
const SD = require('../sudarshanaDasha');
const EG = require('../elementsGunas');
const AL = require('../ashtakavargaLongevity');
const SE = require('../samudayaEffects');
const FH = require('../femaleHoroscopy');
const CY = require('../curseYogas');
const PR = require('../planetaryRays');
const AY = require('../ashtakavargaYears');
const SP = require('../saturnPassages');
const LR = require('../lagnaRasi');
const JR = require('../janmaRasi');
const JN = require('../janmaNakshatra');
const LL = require('../lagnaLordNature');
const { calculateBhinnashtakavarga } = require('../../chart/ashtakavarga');
const { varaAt } = require('../rogaArambha');
const { whenSunAt, sunLon } = require('../masaPravesha');
const { calculateShadbala, SHADBALA_MINIMUM_VIRUPAS } = require('../../chart/shadbala');
const REM = require('../../../fixtures/remedies/bphs-84.json');
const { WAR_ELIGIBLE_PLANETS, warWinner } = require('../../chart/planetaryWar');
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

/**
 * Page 128, "Yogas leading to asceticism": BPHS ch.79's yogas read against the chart (pravrajyaYoga.js), with the order the book names; strength, combustion and
 * whether a Rajayoga is present are not checked, so no order is chosen and there is no verdict.
 */
async function buildPravrajyaYogas({ name = '', birth }) {
  const facts = await withBirth(birth, ({ chart }) => {
    const longitudes = Object.fromEntries(PY.PLANETS.map((p) => [p, chart.grahas[p].longitude]));
    const wars = [];
    for (let i = 0; i < WAR_ELIGIBLE_PLANETS.length; i += 1) {
      for (let j = i + 1; j < WAR_ELIGIBLE_PLANETS.length; j += 1) {
        const w = warWinner(WAR_ELIGIBLE_PLANETS[i], WAR_ELIGIBLE_PLANETS[j], longitudes, chart.julianDay);
        if (w) wars.push([WAR_ELIGIBLE_PLANETS[i], WAR_ELIGIBLE_PLANETS[j], w]);
      }
    }
    return { signs: Object.fromEntries(PY.PLANETS.map((p) => [p, chart.grahas[p].rasiIndex])), lagnaSign: chart.lagna.rasiIndex, moonLongitude: longitudes.Moon, wars };
  });
  const source = PY.DATA.source;
  const cite = (r) => located(source.title, `Chapter 79 v.${r.verses}, printed ${pagesText(r.page)}`, source.author);
  const label = { held: 'உள்ளது', 'not-held': 'இல்லை', unknown: 'பகுதி — முழுமையாகச் சோதிக்க இயலாது', 'not-checked': 'சோதிக்கப்படவில்லை' };
  const rows = PY.evaluate(facts).map((r) => {
    const rule = PY.byId[r.id];
    const orders = r.orders ? ` நெறிகள்: ${[...new Set(r.orders)].map((p) => `${PLANET_TA[p] ?? p} — ${PY.DATA.orders[p]}`).join('; ')}.` : '';
    return [rule.ta, `${label[r.status]} — ${r.detail}${orders}`, cite(rule)];
  });
  return {
    ...head(name, birth),
    blocks: [
      {
        kind: 'text',
        heading: 'துறவுக்கு இட்டுச்செல்லும் யோகங்கள் (பிருஹத் பராசர ஹோரா சாஸ்திரம், அத். 79)',
        text: `${PY.DATA.scope} ஏழு நெறிகளும் நூல் கூறியபடி: ${Object.entries(PY.DATA.orders).map(([p, o]) => `${PLANET_TA[p] ?? p} — ${o}`).join('; ')}.`,
      },
      { kind: 'table', heading: 'நூலின் விதிகள் — இந்த ஜாதகத்தில்', columns: ['நூல் சொல்வது', 'இந்த ஜாதகத்தில்', 'நூல்'], rows },
    ],
  };
}

/**
 * Page 129, "Propitiation of the planets": how BPHS ch.84 says each of the nine planets is to be propitiated (the idol and its form, the mantra and the number of
 * its recitations, the wood for the havana, the food for Brahmins and the gift), with the Vimshottari mahadasha and antardasha running on the day of printing for
 * reference. The book names no planet for a chart, only the one that causes adverse effects at any time; none is chosen here and nothing is claimed to work.
 */
async function buildPlanetRemedies({ name = '', birth, dashaOptions, asOf = new Date() }) {
  const { tree } = await treeFor(birth, dashaOptions, 2);
  const jd = asOf.getTime() / 86400000 + 2440587.5;
  const md = tree.dashas.find((d) => d.startJulianDay <= jd && jd < d.endJulianDay);
  const ad = md?.Bhukti?.find((b) => b.startJulianDay <= jd && jd < b.endJulianDay);
  const source = REM.source;
  const cite = (c) => located(source.title, `Chapter 84 v.${c.verses}, printed ${pagesText(c.page)}`, source.author);
  const g = REM.general;
  const running = md
    ? `அச்சிடும் நாளில் நடப்பது: ${PLANET_TA[md.lord] ?? md.lord} மகாதசை${ad ? `, ${PLANET_TA[ad.lord] ?? ad.lord} புக்தி` : ''}. `
    : '';
  const rows = Object.keys(REM.planets).map((p) => {
    const r = REM.planets[p];
    const now = (md && md.lord === p) || (ad && ad.lord === p) ? ' (நடப்பு தசை/புக்தி)' : '';
    return [
      `${PLANET_TA[p] ?? p}${now}`,
      `${r.idol}. ${r.form}`,
      `${r.mantra} — ${r.count} முறை`,
      r.wood,
      r.food,
      r.gift,
      [REM.citations.idol, REM.citations.mantra, REM.citations.wood].map(cite).map((c, i) => (i ? c.replace(/^.*— /, '') : c)).join(' · '),
    ];
  });
  return {
    ...head(name, birth),
    blocks: [
      {
        kind: 'text',
        heading: 'கிரகங்களை அமைதிப்படுத்தும் வழிபாடு (பிருஹத் பராசர ஹோரா சாஸ்திரம், அத். 84)',
        text: `${g.why.ta} (${cite(g.why)}.) ${g.idols.ta} (${cite(g.idols)}.) ${g.offering.ta} (${cite(g.offering)}.) ${REM.havana.ta} (${cite(REM.havana)}.) ${g.which.ta} (${cite(g.which)}.) ${running}நூல் எந்த ஜாதகத்துக்கு எந்த கிரகம் என்று சொல்லவில்லை; இங்கு எந்தக் கிரகமும் தேர்ந்தெடுக்கப்படவில்லை, எதுவும் பலிக்கும் என்றும் கூறப்படவில்லை. உணவு, தானம் ஆகியவை அத். 84 v.23-25 (ப.1007).`,
      },
      {
        kind: 'table',
        heading: 'ஒன்பது கிரகங்களுக்கும் நூல் கூறுவது',
        columns: ['கிரகம்', 'சிலையும் உருவமும்', 'மந்திரம் (தொடக்கம்), ஜப எண்ணிக்கை', 'ஹோம விறகு', 'அந்தணருக்கு உணவு', 'தானம்', 'நூல்'],
        rows,
      },
    ],
  };
}

/**
 * Page 130, "Ashtakavarga: Saturn's transit": BPHS ch.70's rule for each of the seven planets, worked on the chart (ashtakavargaEffects.js): the house the book takes from the
 * planet, its rekhas times the Yoga Pinda, the nakshatras and signs of Saturn's transit that follow, and what the book says is harmed. No verdict: the book says the harm
 * reaches death only if the dasha then running is unfavourable.
 */
async function buildAshtakavargaEffects({ name = '', birth }) {
  const eff = await withBirth(birth, ({ chart }) => AV.chartEffects(chart));
  const source = AV.DATA.source;
  const cite = (x) => located(source.title, `Chapter 70 v.${x.verses}, printed ${pagesText(x.page)}`, source.author);
  const nak = (list) => list.map((n) => NAKSHATRA_TA[n - 1]).join(', ');
  const sign = (list) => list.map((r) => RASI_TA[r - 1]).join(', ');
  const rows = AV.PLANETS.map((p) => {
    const e = eff[p];
    const d = AV.DATA.planets[p];
    const t = e.targets;
    return [
      `${PLANET_TA[p] ?? p} — ${d.matter}`,
      `${d.house}-ஆம் வீடு: ${RASI_TA[e.sign]}`,
      e.rekhas === 0 ? `0 ரேகை — நூல் இதற்கு விடை தரவில்லை` : `${e.rekhas} × ${e.yogaPinda} (${e.rashiPinda} + ${e.grahaPinda}) = ${t.product}`,
      e.rekhas === 0 ? '—' : nak(t.nakshatras),
      e.rekhas === 0 ? '—' : sign(t.rasis),
      d.ta,
      cite(d),
    ];
  });
  return {
    ...head(name, birth),
    blocks: [
      {
        kind: 'text',
        heading: 'அஷ்டகவர்க்கமும் சனியின் கோசாரமும் (பிருஹத் பராசர ஹோரா சாஸ்திரம், அத். 70)',
        text: `${AV.DATA.matters.ta} (${cite(AV.DATA.matters)}.) ${AV.DATA.method.ta} (${cite(AV.DATA.method)}.) கீழே ஒவ்வொரு கிரகத்துக்கும் நூல் குறிக்கும் வீட்டின் ரேகைகள் (குறைப்புக்கு முன்), அக்கிரகத்தின் யோக பிண்டம் (ராசி பிண்டம் + கிரக பிண்டம்), பெருக்கல் ÷27, ÷12 மீதிகளால் வரும் நட்சத்திரம்-ராசி (அவற்றுடன் திரிகோணங்கள்) காட்டப்படுகின்றன; தீர்ப்பு இல்லை.`,
      },
      {
        kind: 'table',
        heading: 'சனி செல்லும் நட்சத்திரங்களும் ராசிகளும்',
        columns: ['கிரகம் — பொருள்', 'நூல் குறிக்கும் வீடு', 'ரேகை × யோக பிண்டம்', 'சனி செல்லும் நட்சத்திரங்கள் (தானும் திரிகோணமும்)', 'சனி செல்லும் ராசிகள் (தானும் திரிகோணமும்)', 'நூல் சொல்வது', 'நூல்'],
        rows,
      },
    ],
  };
}

/**
 * Page 131, "Panchamahapurusha yogas": the five yogas of BPHS ch.75 read against the chart (mahapurushaYoga.js), with the features the book gives for the native of each yoga that
 * holds. The chapter asks only that the planet be in its own or exalted sign and in a kendra; no verdict.
 */
async function buildMahapurushaYogas({ name = '', birth }) {
  const facts = await withBirth(birth, ({ chart }) => ({
    signs: Object.fromEntries(['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].map((p) => [p, chart.grahas[p].rasiIndex])),
    lagnaSign: chart.lagna.rasiIndex,
  }));
  const source = MP.DATA.source;
  const cite = (x) => located(source.title, `Chapter 75 v.${x.verses}, printed ${pagesText(x.page)}`, source.author);
  const dignityTa = { own: 'சொந்த ராசி', exalted: 'உச்ச ராசி' };
  const YOGA_TA = { Ruchaka: 'ருசகம்', Bhadra: 'பத்ரம்', Hamsa: 'ஹம்சம்', Malavya: 'மாளவ்யம்', Sasa: 'சசம்' };
  const rows = MP.evaluate(facts).map((r) => {
    const y = MP.DATA.yogas[r.yoga];
    const where = `${PLANET_TA[r.planet] ?? r.planet}: ${RASI_TA[r.sign]} ராசி, லக்னத்திலிருந்து ${r.house}-ஆம் வீடு`;
    const why = r.status === 'held'
      ? `${where}, ${dignityTa[r.dignity]}, கேந்திரம்.`
      : `${where}; ${r.dignity ? 'கேந்திரம் அல்ல' : MP.KENDRA.includes(r.house) ? 'சொந்த-உச்ச ராசி அல்ல' : 'சொந்த-உச்ச ராசியும் அல்ல, கேந்திரமும் அல்ல'}.`;
    return [`${YOGA_TA[r.yoga]} (${PLANET_TA[r.planet] ?? r.planet})`, `${r.status === 'held' ? 'உள்ளது' : 'இல்லை'} — ${why}`, r.status === 'held' ? y.ta : '—', cite(y)];
  });
  return {
    ...head(name, birth),
    blocks: [
      {
        kind: 'text',
        heading: 'பஞ்சமகாபுருஷ யோகங்கள் (பிருஹத் பராசர ஹோரா சாஸ்திரம், அத். 75)',
        text: `${MP.DATA.general.ta} (${cite(MP.DATA.general)}.) நூல் வேறு நிபந்தனை (கிரகத்தின் பலம், பார்வை, பாகை) கேட்கவில்லை; எனவே அதுவே சோதிக்கப்படுகிறது. யோகம் உள்ளவற்றுக்கு மட்டும் நூல் தரும் உடல்-குண அடையாளங்கள் காட்டப்படுகின்றன. நூலில் கூறப்படும் நாடுகள் பராசரர் காலத்தில் இருந்தவை; இப்போது அடையாளம் காண இயலாது என்று மொழிபெயர்ப்பாளர் குறிப்பிடுகிறார். தீர்ப்பு இல்லை.`,
      },
      { kind: 'table', heading: 'ஐந்து யோகங்கள் — இந்த ஜாதகத்தில்', columns: ['யோகம்', 'இந்த ஜாதகத்தில்', 'நூல் தரும் அடையாளங்கள்', 'நூல்'], rows },
    ],
  };
}

/** Pages 132-133: the Sudarshana Chakra dasha of BPHS ch.74. `part` 0: the twelve solar years from the one running on `asOf`; `part` 1: the twelve months of that year. */
async function buildSudarshanaDasha({ name = '', birth, part = 0, asOf = new Date() }) {
  const facts = await withBirth(birth, ({ chart }) => ({
    signs: { lagna: chart.lagna.rasiIndex, ...Object.fromEntries(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].map((p) => [p, chart.grahas[p].rasiIndex])) },
    sunLongitude: chart.grahas.Sun.longitude,
    birthMs: Math.round((chart.julianDay - 2440587.5) * 86400000),
  }));
  const offset = birth.utcOffsetMinutes ?? 0;
  const local = (ms) => dmyHm(new Date(ms + offset * 60000).toISOString().slice(0, 16).replace('T', ' '));
  const source = SD.DATA.source;
  const cite = (x) => located(source.title, `Chapter 74 v.${x.verses}, printed ${pagesText(x.page)}`, source.author);
  const circles = SD.circlesOf(facts.signs);
  const CIRCLE_TA = { lagna: 'லக்னம்', moon: 'சந்திரன்', sun: 'சூரியன்' };
  const REF_KEY = { lagna: 'lagna', moon: 'Moon', sun: 'Sun' };
  const tamilPlanets = (list) => (list.length ? list.map((x) => `${PLANET_TA[x.planet]} (${x.house})`).join(', ') : 'இல்லை');
  const houses = (list) => (list.length ? list.join(', ') : 'இல்லை');
  const reading = (n, ref) => {
    const r = SD.readPeriod(facts.signs, SD.periodAscendant(ref, n));
    return {
      sign: r.ascSign,
      text: `சுபர் 1, 4, 5, 7, 8, 9, 10-இல்: ${tamilPlanets(r.goodBenefics)} · பாவர் 3, 6, 11-இல்: ${tamilPlanets(r.maleficsIn3611)} · ராகு/கேது மட்டும் உள்ள வீடு: ${houses(r.nodesOnly)} · பாவர் மிகுந்த வீடு: ${houses(r.maleficMajority)} · 6 அல்லது 12-ஆம் வீட்டில் சுபர் உள்ள வீடு: ${houses(r.beneficsIn6Or12)}`,
    };
  };
  const separate = circles.length === 3
    ? 'இந்த ஜாதகத்தில் லக்னம், சந்திரன், சூரியன் மூவரும் வெவ்வேறு ராசிகளில் உள்ளனர்; எனவே மூன்று வட்டங்களும் படிக்கப்படுகின்றன.'
    : 'இந்த ஜாதகத்தில் லக்னம், சூரியன், சந்திரன் ஆகியவற்றில் இருவர் அல்லது மூவர் ஒரே ராசியில் உள்ளனர்; எனவே நூல் சொல்வதுபோல் பிறப்பு ஜாதகம் (லக்னவட்டம்) மட்டுமே படிக்கப்படுகிறது.';
  const running = SD.yearNumberAt(facts.birthMs, facts.sunLongitude, asOf.getTime());
  const monthNote = part === 1
    ? ' மாதத்தின் லக்னம் ஒவ்வொரு ஆண்டிலும் 1-ஆம் வீட்டிலிருந்து தொடங்குவதாக அச்சிட்ட ஆங்கிலம் கூறுவதால் அவ்வாறே கொள்ளப்பட்டது; சமஸ்கிருத வரிகள் இதைத் தெளிவுபடுத்தவில்லை. 2½ நாள் பிரத்யந்தரமும் 12½ நாழிகை விதசையும் இதே முறையில் வரும்; அவை பட்டியலிடப்படவில்லை.'
    : '';
  const blocks = [{
    kind: 'text',
    heading: part === 0
      ? 'சுதர்சன சக்கர தசை — ஆண்டுகள் (பிருஹத் பராசர ஹோரா சாஸ்திரம், அத். 74) — அச்சிடும் நாளில் நடக்கும் ஆண்டிலிருந்து 12 ஆண்டுகள்'
      : `சுதர்சன சக்கர தசை — ${running}-ஆம் ஆண்டின் 12 மாதங்கள் (பிருஹத் பராசர ஹோரா சாஸ்திரம், அத். 74)`,
    text: `${SD.DATA.general.ta} (${cite(SD.DATA.general)}.) ${SD.DATA.dasha.ta} (${cite(SD.DATA.dasha)}.) ${SD.DATA.separate.ta} (${cite(SD.DATA.separate)}.) ${separate} ஆண்டும் மாதமும் சூரியனின் பிறந்த நிலையிலிருந்து கணிக்கப்பட்டவை: ஆண்டு = சூரியன் பிறப்பு பாகைக்குத் திரும்பும் வரை; மாதம் = சூரியன் 30° நகரும் வரை. கீழே நூல் கேட்கும் நிலைகள் (${cite(SD.DATA.favourable)}) ஒவ்வொரு காலத்துக்கும் பட்டியலிடப்படுகின்றன; அவற்றை எப்படி எடைபோடுவது என்று நூல் சொல்லவில்லை (வலிமை மிக்கது தீர்மானிக்கும் என்று மட்டும்), எனவே தீர்ப்பு இல்லை. நூலின் உதாரணத்தில்போல சந்திரனும் புதனும் சுபர்; சூரியன், செவ்வாய், சனி, ராகு, கேது பாவர். அஷ்டகவர்க்கத்தால் மறுசரிபார்த்தல் (${cite(SD.DATA.ashtakavarga)}) செய்யப்படவில்லை.${monthNote}`,
  }];
  const rows = [];
  if (part === 0) {
    for (const y of SD.yearBounds(facts.birthMs, facts.sunLongitude, running, 12)) {
      for (const c of circles) {
        const r = reading(y.year, facts.signs[REF_KEY[c.id]]);
        rows.push([`${y.year}-ஆம் ஆண்டு (வயது ${y.year - 1}) · ${local(y.startMs)} முதல் ${local(y.endMs)} வரை`, CIRCLE_TA[c.id], `${RASI_TA[r.sign]} (${((y.year - 1) % 12) + 1}-ஆம் வீடு லக்னம்)`, r.text]);
      }
    }
  } else {
    for (const m of SD.monthBounds(facts.birthMs, facts.sunLongitude, running)) {
      for (const c of circles) {
        const r = reading(m.month, facts.signs[REF_KEY[c.id]]);
        rows.push([`மாதம் ${m.month} · ${local(m.startMs)} முதல் ${local(m.endMs)} வரை`, CIRCLE_TA[c.id], `${RASI_TA[r.sign]} (${m.month}-ஆம் வீடு லக்னம்)`, r.text]);
      }
    }
  }
  blocks.push({ kind: 'table', heading: part === 0 ? 'ஆண்டுகள் — நூல் கேட்கும் நிலைகள்' : `${running}-ஆம் ஆண்டின் மாதங்கள் — நூல் கேட்கும் நிலைகள்`, columns: ['காலம்', 'வட்டம்', 'லக்னமாகும் ராசி', 'நிலைகள் (எண்கள் = அந்தக் காலத்தின் லக்னத்திலிருந்து வீடு)'], rows });
  return { ...head(name, birth), blocks };
}

/** Page 134: the five elements (BPHS ch.76) and the three gunas (ch.77) of the chart's planets, with the planet that leads by each of the two Shadbala figures. */
async function buildElementsGunas({ name = '', birth }) {
  const facts = await withBirth(birth, ({ chart }) => {
    const longitudes = Object.fromEntries(EG.PLANETS.map((p) => [p, chart.grahas[p].longitude]));
    const shadbala = calculateShadbala({
      longitudes, lagnaRasiIndex: chart.lagna.rasiIndex, ascendant: chart.lagna.longitude, mc: chart.mc, birthJd: chart.julianDay,
      latitude: birth.latitude, longitude: birth.longitude, year: birth.year, month: birth.month, day: birth.day, utcOffsetMinutes: birth.utcOffsetMinutes, reading: 'pl9',
    });
    return Object.fromEntries(EG.PLANETS.map((p) => [p, { sign: chart.grahas[p].rasiIndex, total: shadbala.perPlanet[p].shadbalaTotal }]));
  });
  const total = Object.fromEntries(EG.PLANETS.map((p) => [p, facts[p].total]));
  const ratio = Object.fromEntries(EG.PLANETS.map((p) => [p, facts[p].total / SHADBALA_MINIMUM_VIRUPAS[p]]));
  const source = EG.DATA.source;
  const cite77 = (x) => located(source.title, `Chapter 77 v.${x.verses}, printed ${pagesText(x.page)}`, source.author);
  const cite76 = (x) => located(source.title, `Chapter 76 v.${x.verses}, printed ${pagesText(x.page)}`, source.author);
  const GUNA_TA = { sattva: 'சத்வம்', rajas: 'ரஜஸ்', tamas: 'தமஸ்' };
  const ELEMENT_TA = Object.fromEntries(Object.entries(EG.DATA.elements).map(([k, v]) => [k, v.name]));
  const f2 = (x) => x.toFixed(2);
  const names = (list) => list.map((p) => PLANET_TA[p]).join(', ');
  const planetRows = EG.PLANETS.map((p) => [PLANET_TA[p], ELEMENT_TA[EG.DATA.element[p]], GUNA_TA[EG.DATA.guna[p]], f2(total[p]), `${f2(ratio[p] * 100)} %`, `${RASI_TA[facts[p].sign]}${EG.debilitated(p, facts[p].sign) ? ' (நீசம்)' : ''}`]);
  const measures = [['Shadbala மொத்தம் (விருபம்)', total], ['Shadbala மொத்தம் ÷ தேவையான குறைந்தபட்சம்', ratio]];
  const elementRows = measures.map(([label, values]) => {
    const r = EG.elementOf(values);
    if (r.element === 'mixed') return [label, names(r.leaders), 'கலப்பு', 'பல கிரகங்கள் சம வலிமை; நூல் கலப்பு இயல்பு என்கிறது.', '—', cite76(EG.DATA.elementVerses)];
    const e = EG.DATA.elements[r.element];
    const lead = r.leaders[0];
    const adverse = EG.debilitated(lead, facts[lead].sign) ? ' ' + `${PLANET_TA[lead]} நீச ராசியில் உள்ளது: நூல் (v.17) பலன் எதிராக இருக்கும் என்கிறது.` : '';
    return [label, names(r.leaders), e.name, `${e.temperament}${adverse}`, e.predominant, `${cite76(e)}`];
  });
  const gunaRows = [];
  for (const [label, values] of measures) {
    const byLeader = EG.gunaOfLeader(values);
    const sums = EG.gunaTotals(values);
    const byGroup = EG.gunaLeading(sums);
    const classRow = (how, g, detail) => {
      const c = EG.DATA.classes[g === 'equal' ? 'equal' : g];
      gunaRows.push([`${label} — ${how}`, detail, g === 'equal' ? 'சமம்' : GUNA_TA[g], c.name, c.ta, cite77(c)]);
    };
    classRow('வலிமை மிக்க கிரகம்', byLeader, names(EG.leaders(values)));
    classRow('குணவாரிக் கூட்டுத்தொகை', byGroup, EG.GUNAS.map((g) => `${GUNA_TA[g]} ${f2(sums[g])}`).join(' · '));
  }
  return {
    ...head(name, birth),
    blocks: [
      {
        kind: 'text',
        heading: 'ஐம்பூதங்களும் முக்குணங்களும் (பிருஹத் பராசர ஹோரா சாஸ்திரம், அத். 76–77)',
        text: `${EG.DATA.elementVerses.ta} (${cite76(EG.DATA.elementVerses)}.) ${EG.DATA.strength.ta} (${cite76(EG.DATA.strength)}.) ${EG.DATA.gunaVerses.ta} (${cite77(EG.DATA.gunaVerses)}.) ${EG.DATA.job.ta} (${cite77(EG.DATA.job)}.) இரு அத்தியாயங்களும் கிரகத்தின் வலிமையை எதனால் அளப்பது என்று சொல்லவில்லை; இங்கு பிருஹத் பராசரத்தின் அத். 27 ஷட்பலம் (பக்கம் 11 போல) எடுக்கப்பட்டு, அதன் இரு அளவுகளில் (மொத்த விருபம்; தேவையான குறைந்தபட்சத்துடன் விகிதம்) முன்னிற்கும் கிரகம் தனித்தனியாகக் காட்டப்படுகிறது; குணங்களுக்கு வலிமை மிக்க கிரகமும் குணவாரிக் கூட்டுத்தொகையும் காட்டப்படுகின்றன. நூல் எதைத் தேர்வது என்று சொல்லாததால் எதுவும் தேர்ந்தெடுக்கப்படவில்லை; அசுப வீடு எவை என்று நூல் சொல்லாததால் அது சோதிக்கப்படவில்லை (நீச ராசி மட்டும்). தீர்ப்பு இல்லை.`,
      },
      { kind: 'table', heading: 'கிரகங்கள் — பூதம், குணம், வலிமை', columns: ['கிரகம்', 'பூதம்', 'குணம்', 'Shadbala (விருபம்)', 'தேவையானதில்', 'ராசி'], rows: planetRows },
      { kind: 'table', heading: 'பிறப்பில் பூத இயல்பு (அத். 76) — ஒவ்வொரு அளவிலும் முன்னிற்கும் கிரகம்', columns: ['அளவு', 'முன்னிற்கும் கிரகம்', 'பூதம்', 'இயல்பு (v.6–10) — நீச நிலை', 'அது மிகுந்தால் (v.11–15)', 'நூல்'], rows: elementRows },
      { kind: 'table', heading: 'பிறப்பில் குணம் (அத். 77)', columns: ['அளவு — முறை', 'கிரகம் / கூட்டுத்தொகை', 'குணம்', 'வகை', 'நூல் தரும் இயல்புகள் (v.5–8)', 'நூல்'], rows: gunaRows },
    ],
  };
}

const ymdTa = (g) => `${g.years} ஆண்டு ${g.months} மாதம் ${g.days} நாள் ${g.ghatikas} நாழிகை`;

/** Page 135: the longevity the eight Ashtakavargas give (BPHS ch.71). */
async function buildAshtakavargaLongevity({ name = '', birth }) {
  const rasi = await withBirth(birth, ({ chart }) => AL.rasiPositions(chart));
  const r = AL.longevity(rasi);
  const source = AL.DATA.source;
  const cite = (x) => located(source.title, `Chapter 71 v.${x.verses}, printed ${pagesText(x.page)}`, source.author);
  const CHART_TA = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Lagna: 'லக்னம்' };
  const rows = r.charts.map((c) => [CHART_TA[c.chart], c.rekhas.join(' '), ymdTa(AL.toYmd(c.span)), ymdTa(AL.toYmd(c.half))]);
  rows.push(['எட்டின் பாதிகளின் கூட்டு', '', '', ymdTa(AL.toYmd(r.total))]);
  return {
    ...head(name, birth),
    blocks: [
      {
        kind: 'text',
        heading: 'அஷ்டகவர்க்க ஆயுள் (பிருஹத் பராசர ஹோரா சாஸ்திரம், அத். 71)',
        text: `${AL.DATA.spans.ta} (${cite(AL.DATA.spans)}.) எடுக்கப்பட்ட ரேகைகள் குறைப்புக்கு (சோதனம்) முன்னுள்ள பின்னாஷ்டகவர்க்க எண்ணிக்கைகள்; நூல் எந்தக் குறைப்பையும் சொல்லவில்லை. லக்னத்தின் அஷ்டகவர்க்கம் இந்த மென்பொருளின் (சி.எஸ். படேல் அட்டவணை) தான். ஓராண்டு 12 மாதம், மாதம் 30 நாள், நாள் 60 நாழிகை (நூலின் சொந்த மொத்தங்கள் கூடும் அலகுகள்). நூலின் உதாரணத்தில் சூரியனின் ரேகைகள் மட்டுமே முழுமையாக உள்ளன (14 ஆண்டு 18 நாள் 30 நாழிகை, பாதி 7 ஆண்டு 9 நாள் 15 நாழிகை); அது சோதனையில் மீண்டும் வருகிறது (${located(source.title, `Chapter 71 worked example, printed p.${AL.DATA.example.page}`, source.author)}). இது இவர் எவ்வளவு காலம் வாழ்வார் என்று சொல்வதில்லை — வேறு முறைகளோடு ஒப்பிடுவதற்கான எண் மட்டும்; தீர்ப்பு இல்லை.`,
      },
      { kind: 'table', heading: 'எட்டு அஷ்டகவர்க்கங்களின் ஆயுள்', columns: ['அஷ்டகவர்க்கம்', 'ரேகைகள் (மேஷம் முதல் மீனம் வரை)', 'ராசிகளின் ஆயுள் கூட்டு', 'பாதி (நூலின் ஆயுள்)'], rows },
    ],
  };
}

/** The dates of the solar month in which the Sun is in `sign` (0-11): the one running on `asOf`, or the next. */
function sunMonthOf(sign, asOfMs, offsetMinutes) {
  const L0 = sunLon(asOfMs);
  let rel = (((sign * 30 - L0) % 360) + 360) % 360;
  if (rel > 330) rel -= 360;
  const entry = whenSunAt(sign * 30, asOfMs + (rel / 0.9856) * 86400000);
  const exit = whenSunAt(((sign + 1) * 30) % 360, entry + 30.4 * 86400000);
  const f = (ms) => dmyLocal(new Date(ms + offsetMinutes * 60000).toISOString().slice(0, 10));
  return { from: f(entry), to: f(exit), current: entry <= asOfMs && asOfMs < exit };
}

/** Page 136: the Samudaya Ashtakavarga of BPHS ch.72 read for the signs, houses, wealth condition, the three parts of life and the Sun's months. */
async function buildSamudayaEffects({ name = '', birth, asOf = new Date() }) {
  const facts = await withBirth(birth, ({ chart }) => ({
    rasi: AL.rasiPositions(chart),
    signs: Object.fromEntries(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].map((p) => [p, chart.grahas[p].rasiIndex])),
    lagnaSign: chart.lagna.rasiIndex,
  }));
  const offset = birth.utcOffsetMinutes ?? 0;
  const sam = SE.samudaya(facts.rasi);
  const counts = SE.houseCounts(sam, facts.lagnaSign);
  const source = SE.DATA.source;
  const cite = (x) => located(source.title, `Chapter 72 v.${x.verses}, printed ${pagesText(x.page)}`, source.author);
  const BAND_TA = { favourable: 'நற்பலன் (30-க்கு மேல்)', medium: 'நடுத்தரம் (25–30)', adverse: 'தீய பலன் (25-க்குக் குறைவு)' };
  const signRows = Array.from({ length: 12 }, (_, s) => {
    const house = ((s - facts.lagnaSign + 12) % 12) + 1;
    const b = SE.band(sam[s]);
    const month = sunMonthOf(s, asOf.getTime(), offset);
    const entry = SE.monthEntry(sam[s]);
    const bandText = `${BAND_TA[b.band]}${b.exactly30 ? ' — சரியாக 30: செய்யுள் "30-க்கு மேல்" என்கிறது, நூலின் உதாரணம் 30-ஐ சாதகமாகக் கொள்கிறது' : ''}`;
    return [
      `${RASI_TA[s]} (${house}-ஆம் வீடு)`,
      `${sam[s]}`,
      bandText,
      `${month.from} முதல் ${month.to} வரை${month.current ? ' (நடப்பு மாதம்)' : ''}`,
      entry ? entry.effect : `${SE.DATA.above.ta}`,
      entry ? entry.remedy : '—',
      cite(entry ? SE.DATA.month : SE.DATA.above),
    ];
  });
  const w = SE.wealthCondition(counts);
  const yn = (x) => (x ? 'பொருந்துகிறது' : 'பொருந்தவில்லை');
  const wealthRows = [
    ['11-ஆம் வீடு 10-ஆம் வீட்டைவிட அதிகம்', `${counts[10]} / ${counts[9]}`, yn(w.eleventhOverTenth)],
    ['12-ஆம் வீடு 11-ஆம் வீட்டைவிடக் குறைவு', `${counts[11]} / ${counts[10]}`, yn(w.twelfthUnderEleventh)],
    ['லக்னத்தில் மற்ற எல்லா வீடுகளையும்விட அதிகம்', `${counts[0]} / அதிகபட்சம் மற்றவை ${Math.max(...counts.slice(1))}`, yn(w.lagnaLargest)],
    ['மூன்றும் சேர்ந்தால் (v.7–8: செல்வமும் இன்பமும்)', '', w.held ? 'மூன்றும் பொருந்துகின்றன' : w.reverse ? 'மூன்றும் எதிராக உள்ளன (சமஸ்கிருதம்: வறுமை)' : 'சில மட்டும் பொருந்துகின்றன'],
  ];
  const houseRows = counts.map((c, i) => {
    const b = SE.band(c);
    return [`${i + 1}-ஆம் வீடு (${RASI_TA[(facts.lagnaSign + i) % 12]})`, `${c}`, `${BAND_TA[b.band]}${b.exactly30 ? ' — சரியாக 30' : ''}${[6, 8, 12].includes(i + 1) ? ' · மொழிபெயர்ப்பாளர் குறிப்பு: 6, 8, 12-இல் குறைவு சாதகம்' : ''}`];
  });
  const partTa = ['குழந்தைப் பருவம் (1–4)', 'இளமை (5–8)', 'முதுமை (9–12)'];
  const sectionRows = SE.sections(facts.signs, facts.lagnaSign).map((s) => [
    partTa[s.part - 1],
    s.benefics.length ? s.benefics.map((p) => PLANET_TA[p]).join(', ') : 'இல்லை',
    s.malefics.length ? s.malefics.map((p) => PLANET_TA[p]).join(', ') : 'இல்லை',
    s.reading === 'benefics' ? 'சுபர் அதிகம் — மகிழ்ச்சி' : s.reading === 'malefics' ? 'பாவிகள் அதிகம் — துன்பம்' : 'சமம் — கலப்புப் பலன்',
  ]);
  return {
    ...head(name, birth),
    blocks: [
      {
        kind: 'text',
        heading: 'சமுதாய அஷ்டகவர்க்கம் (பிருஹத் பராசர ஹோரா சாஸ்திரம், அத். 72)',
        text: `${SE.DATA.limits.ta} (${cite(SE.DATA.limits)}.) ${SE.DATA.houses.ta} (${cite(SE.DATA.houses)}.) ${SE.DATA.month.ta} (${cite(SE.DATA.month)}.) சமுதாயம் லக்னம் உட்பட எட்டு அஷ்டகவர்க்கங்களின் கூட்டு (நூலின் உதாரணத்தில் லக்னத்தின் 5 சேர்க்கப்படுகிறது); இது கூட்டு 337 ஐக் கொண்ட பலதீபிகை முறையிலிருந்து வேறு. சூரியன் அந்த ராசியில் செல்லும் மாதத்தின் தேதிகள் அச்சிடும் நாளிலிருந்து நடப்பு அல்லது அடுத்த மாதத்துக்குக் காட்டப்படுகின்றன. பரிகாரங்கள் நூல் சொன்னபடி சுருக்கப்பட்டுள்ளன; எதுவும் பலிக்கும் என்று சொல்லப்படவில்லை. ${SE.DATA.afford.ta} (மொழிபெயர்ப்பாளர், ப.904.) தீர்ப்பு இல்லை.`,
      },
      { kind: 'table', heading: 'ராசிகள் — சமுதாய ரேகைகளும் அந்த ராசியில் சூரியன் செல்லும் மாதமும்', columns: ['ராசி', 'ரேகை', 'வகை (v.3–5)', 'சூரியன் இந்த ராசியில்', 'அந்த மாதத்தின் பலன்', 'நூல் தரும் பரிகாரம்', 'நூல்'], rows: signRows },
      { kind: 'table', heading: `வீடுகள் (v.6) — ${cite(SE.DATA.houses)}`, columns: ['வீடு', 'ரேகை', 'வகை'], rows: houseRows },
      { kind: 'table', heading: `செல்வ நிபந்தனை (v.7–8) — ${cite(SE.DATA.wealth)}`, columns: ['நிபந்தனை', 'ரேகைகள்', 'இந்த ஜாதகத்தில்'], rows: wealthRows },
      { kind: 'table', heading: `வாழ்வின் மூன்று பகுதிகள் (v.9–10) — ${cite(SE.DATA.sections)}`, columns: ['பகுதி', 'சுபர்', 'பாவிகள்', 'நூலின் வாசிப்பு'], rows: sectionRows },
    ],
  };
}

/** Page 137: the readings of BPHS ch.80 (Female Horoscopy) against a woman's chart. Given only for a chart marked female. */
async function buildFemaleHoroscopy({ name = '', birth }) {
  const source = FH.DATA.source;
  const cite = (x) => located(source.title, `Chapter 80 v.${x.verses}, printed ${pagesText(x.page)}`, source.author);
  if (birth.gender !== 'female') {
    return {
      ...head(name, birth),
      blocks: [{
        kind: 'text',
        heading: 'பெண் ஜாதகம் (பிருஹத் பராசர ஹோரா சாஸ்திரம், அத். 80)',
        text: `இந்த அத்தியாயம் பெண்ணின் ஜாதகத்துக்கான பலன்களைச் சொல்கிறது; இந்த ஜாதகம் பெண் என்று குறிக்கப்படவில்லை, எனவே இங்கு கணிக்கப்படவில்லை. (${cite(FH.DATA.principle)}.)`,
      }],
    };
  }
  const jf = await J.janmaFacts(birth);
  const facts = await withBirth(birth, ({ chart }) => ({
    signs: Object.fromEntries(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].map((p) => [p, chart.grahas[p].rasiIndex])),
    longitudes: Object.fromEntries(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].map((p) => [p, chart.grahas[p].longitude])),
    lagnaSign: chart.lagna.rasiIndex,
    lagnaLongitude: chart.lagna.longitude,
    atMs: Math.round((chart.julianDay - 2440587.5) * 86400000),
  }));
  const vara = varaAt(facts.atMs, birth.latitude, birth.longitude, birth.utcOffsetMinutes ?? 0);
  const rows = FH.evaluate({ ...facts, vara, nakshatra: jf.nak.index, tithi: jf.tithi.index + 1 });
  const STATUS_TA = { held: 'பொருந்துகிறது', unknown: 'தெளிவில்லை', 'not-checked': 'சோதிக்கப்படவில்லை', 'not-held': 'பொருந்தவில்லை' };
  const citeRow = (r) => cite({ verses: r.verses, page: r.page });
  const bodyOf = (r) => (r.id === 'SIGN_NATURE' || r.id.startsWith('TRIMSAMSA') || r.id === 'NAVAMSA7' ? r.effect : r.text);
  const activeRows = rows.filter((r) => r.status !== 'not-held').map((r) => [bodyOf(r), r.detail, STATUS_TA[r.status], citeRow(r)]);
  const quietRows = rows.filter((r) => r.status === 'not-held').map((r) => [r.text.length > 70 ? `${r.text.slice(0, 70)}…` : r.text, r.detail, citeRow(r)]);
  return {
    ...head(name, birth),
    blocks: [
      {
        kind: 'text',
        heading: 'பெண் ஜாதகம் (பிருஹத் பராசர ஹோரா சாஸ்திரம், அத். 80) — ஜோதிடர் பயன்பாட்டுக்கு',
        text: `${FH.DATA.principle.ta} (${cite(FH.DATA.principle)}.) நூலின் ஒவ்வொரு கூற்றும் அதன் சொற்களில் தரப்படுகிறது; எதுவும் இந்த நபர்மீதான தீர்ப்பு அல்ல. லக்னம் அல்லது சந்திரனில் எது பலம் என்று நூல் சொல்லாததால் இரண்டும் படிக்கப்படுகின்றன; கிரகங்களின் பலம், வக்ரம், சம வலிமை சோதிக்கப்படவில்லை; v.40, v.44 நூலின் வரிகள் தெளிவற்றவை என்பதால் உண்மைகளாக மட்டும் காட்டப்படுகின்றன. கிரகப் பார்வைகள் அத். 26-இன்படி ராசிகளால் எண்ணப்படுகின்றன; சுபர் சந்திரன், புதன், குரு, சுக்கிரன்; பாவிகள் சூரியன், செவ்வாய், சனி, ராகு, கேது.`,
      },
      { kind: 'table', heading: 'பொருந்துபவை, தெளிவற்றவை, சோதிக்கப்படாதவை', columns: ['நூலின் கூற்று', 'இந்த ஜாதகத்தில்', 'நிலை', 'நூல்'], rows: activeRows },
      { kind: 'table', heading: 'பொருந்தாதவை', columns: ['நூலின் கூற்று (சுருக்கம்)', 'இந்த ஜாதகத்தில்', 'நூல்'], rows: quietRows },
    ],
  };
}

/** Pages 138-139: the yogas of BPHS ch.83 (curses of the previous birth that end in want of a male issue) read against the chart; `part` 0 the general yogas, the serpent's, the father's and the mother's, `part` 1 the rest. */
async function buildCurseYogas({ name = '', birth, part = 0 }) {
  const facts = await withBirth(birth, ({ chart, gulika }) => ({
    signs: Object.fromEntries(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].map((p) => [p, chart.grahas[p].rasiIndex])),
    longitudes: Object.fromEntries(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].map((p) => [p, chart.grahas[p].longitude])),
    lagnaSign: chart.lagna.rasiIndex,
    gulikaSign: gulika.rasiIndex,
  }));
  const results = CY.evaluate(facts);
  const source = CY.DATA.source;
  const cite = (x) => located(source.title, `Chapter 83 v.${x.verses}, printed ${pagesText(x.page)}`, source.author);
  const STATUS_TA = { held: 'பொருந்துகிறது', unknown: 'தெளிவில்லை (வலிமை/அஸ்தங்கம் சோதிக்கப்படவில்லை)', 'not-checked': 'சோதிக்கப்படவில்லை (வலிமை மட்டுமே)' };
  const yogaRows = (id, yogas) => {
    const rows = [];
    const quiet = [];
    for (const y of yogas) {
      const r = results.find((x) => x.id === id && x.n === y.n);
      if (r.status === 'not-held') { quiet.push(y.n); continue; }
      const cond = y.atoms.map(CY.describe).join('; ');
      rows.push([`${y.n}`, cond, r.loose ? 'மொழிபெயர்ப்பாளரின் தளர்வான வாசிப்பில் மட்டும் (சூரியன், செவ்வாய், சனியில் ஒருவர் லக்னத்திலும் ஒருவர் 5-இலும்; ராகு, குருவில் ஒருவர் 8-இலும் ஒருவர் 12-இலும்)' : STATUS_TA[r.status]]);
    }
    return { rows, quiet };
  };
  const block = (title, citeText, yogas, id, remedy, note) => {
    const { rows, quiet } = yogaRows(id, yogas);
    if (!rows.length) return [];
    return [
      {
        kind: 'text',
        heading: title,
        text: `${citeText}. நூலின் ${yogas.length} யோகங்களில் ${rows.length} பொருந்துகின்றன அல்லது தெளிவற்றவை; பொருந்தாதவை: ${quiet.length ? quiet.join(', ') : 'இல்லை'}.${note ? ` ${note}` : ''}${remedy ? ` பரிகாரம் (நூல் சொன்னபடி, எதுவும் பலிக்கும் என்று சொல்லப்படவில்லை): ${remedy.ta} (${cite(remedy)}.)` : ''}`,
      },
      { kind: 'table', heading: `${title} — பொருந்துபவை`, columns: ['யோகம்', 'நிபந்தனைகள் (லக்னத்திலிருந்து வீடுகள்)', 'இந்த ஜாதகத்தில்'], rows },
    ];
  };
  const blocks = [];
  if (part === 0) {
    blocks.push({
      kind: 'text',
      heading: 'முன்பிறப்புச் சாபங்களும் மகனற்ற நிலையும் (பிருஹத் பராசர ஹோரா சாஸ்திரம், அத். 83) — ஜோதிடர் பயன்பாட்டுக்கு',
      text: `அத்தியாயம் தரும் யோகங்கள் முன்பிறப்புச் சாபத்தால் வரும் மகனற்ற நிலையைக் காட்டுபவை (நூலின் குறிப்பு: இங்கு "குழந்தையின்மை" என்பது ஆண் வாரிசு இன்மை; ப.990). ஒவ்வொரு யோகமும் நிபந்தனைகளாகப் பிரிக்கப்பட்டு ஜாதகத்தில் படிக்கப்படுகிறது: வீடுகள் லக்னத்திலிருந்து; பார்வை அத். 26-இன்படி ராசிகளால்; "பாவிகளுக்கு நடுவில்" என்பது சொல்லப்பட்ட ராசிக்கு 12-இலும் 2-இலும் பாவி; சுபர் சந்திரன், புதன், குரு, சுக்கிரன்; பாவிகள் சூரியன், செவ்வாய், சனி, ராகு, கேது. கிரகத்தின் வலிமை, அஸ்தங்கம் தேவைப்படும் நிபந்தனைகள் சோதிக்கப்படுவதில்லை; மற்றவை அனைத்தும் பொருந்தினால் அந்த யோகம் "தெளிவில்லை" எனக் காட்டப்படுகிறது. நூல் எந்த யோகத்தை எவ்வளவு வலுவாகக் கொள்வது என்று சொல்லவில்லை; எதுவும் தீர்ப்பு அல்ல. ஒரு சாபத்தின் எந்த யோகமும் பொருந்தாவிட்டால் அதன் பரிகாரம் காட்டப்படுவதில்லை (அது ஒரு சாபம் இருப்பதாகக் குறிக்கக்கூடாது); பொருந்தினால் நூல் சொன்னபடி சுருக்கமாகக் காட்டப்படும். யோகங்கள் நூலின் வரிசையில் எண்ணப்பட்டுள்ளன.`,
    });
    blocks.push(...block('பொதுவான யோகங்கள் (v.7–8)', `${CY.DATA.general.ta} (${cite(CY.DATA.general)})`, CY.DATA.general.yogas, 'GENERAL', null, ''));
  }
  const wanted = part === 0 ? ['SERPENT', 'FATHER', 'MOTHER'] : ['BROTHER', 'UNCLE', 'BRAHMIN', 'WIFE', 'ANCESTORS'];
  for (const c of CY.DATA.curses.filter((x) => wanted.includes(x.id))) {
    const note = c.yogas.filter((y) => y.note).map((y) => `யோகம் ${y.n}: ${y.note}`).join(' ');
    blocks.push(...block(`${c.ta} (v.${c.verses})`, cite(c), c.yogas, c.id, c.remedy, note));
  }
  const noneIds = CY.DATA.curses.filter((c) => wanted.includes(c.id)).filter((c) => !results.some((r) => r.id === c.id && r.status !== 'not-held'));
  blocks.push({
    kind: 'text',
    heading: 'எந்த யோகமும் பொருந்தாதவை',
    text: noneIds.length
      ? `இந்தப் பக்கத்தின் சாபங்களில் ${noneIds.map((c) => `${c.ta} (${cite(c)})`).join('; ')} ஆகியவற்றின் எந்த யோகமும் இந்த ஜாதகத்தில் பொருந்தவில்லை; அவற்றின் பரிகாரங்கள் காட்டப்படவில்லை.`
      : 'இந்தப் பக்கத்தின் எல்லாச் சாபங்களிலும் ஏதேனும் ஒரு யோகம் பொருந்துகிறது அல்லது தெளிவற்றதாக உள்ளது.',
  });
  if (part === 1 && results.some((r) => r.status === 'held' || r.status === 'unknown')) blocks.push({ kind: 'text', heading: 'கிரகங்களின் தீங்கால் மகனற்றவர்க்கான பரிகாரங்கள் (v.109–111)', text: `${CY.DATA.grahaRemedies.ta} (${cite(CY.DATA.grahaRemedies)}.) எதுவும் பலிக்கும் என்று சொல்லப்படவில்லை.` });
  return { ...head(name, birth), blocks };
}

/** Page 140: the rays of the planets of BPHS ch.73 and what the total says. */
async function buildPlanetaryRays({ name = '', birth }) {
  const longitudes = await withBirth(birth, ({ chart }) => Object.fromEntries(PR.PLANETS.map((p) => [p, chart.grahas[p].longitude])));
  const r = PR.rays(longitudes);
  const source = PR.DATA.source;
  const cite = (x) => located(source.title, `Chapter 73 v.${x.verses}, printed ${pagesText(x.page)}`, source.author);
  const DIGNITY_TA = { exalted: 'உச்ச ராசி', moolatrikona: 'மூலத்திரிகோணம்', own: 'சொந்த ராசி', greatFriend: 'அதிமித்திரன் வீடு', friend: 'நண்பன் வீடு', neutral: 'நடுநிலையன் வீடு', enemy: 'பகைவன் வீடு', greatEnemy: 'அதிசத்ரு வீடு' };
  const FACTOR_TA = { exalted: '× 3', moolatrikona: '× 2', own: '× 3/2', greatFriend: '× 4/3', friend: '× 6/5', neutral: '× 1', enemy: '× 1/2', greatEnemy: '× 2/5' };
  const f2 = (x) => x.toFixed(2);
  const dm = (lon) => { const t = Math.round(((lon % 30) + 30) % 30 * 60); return `${RASI_TA[Math.floor((((lon % 360) + 360) % 360) / 30)]} ${Math.floor(t / 60)}° ${String(t % 60).padStart(2, '0')}′`; };
  const rows = PR.PLANETS.map((p) => {
    const x = r.planets[p];
    return [PLANET_TA[p], dm(x.longitude), `${f2(x.distance / 30)} ராசி`, f2(x.gross), DIGNITY_TA[x.dignity], FACTOR_TA[x.dignity], f2(x.net), x.direction === 'ascending' ? 'நீசத்திலிருந்து உச்சத்தை நோக்கி (பலன் முழுமை)' : 'உச்சத்திலிருந்து நீசத்தை நோக்கி (பலன் குறைவு)'];
  });
  rows.push(['மொத்தம்', '', '', '', '', '', f2(r.total), '']);
  const effects = PR.effectRows(r.total);
  const effectText = effects.length
    ? effects.map((e) => `${e.max === null ? `${e.min}-க்கு மேல்` : e.min === e.max ? `${e.min}` : `${e.min} முதல் ${e.max}`} கதிர்கள்: ${e.ta}`).join('; ')
    : 'மொத்தம் 1-க்குக் குறைவு: இதற்கு நூல் பலன் சொல்லவில்லை';
  const blocks = [
    {
      kind: 'text',
      heading: 'கிரகங்களின் கதிர்கள் (பிருஹத் பராசர ஹோரா சாஸ்திரம், அத். 73)',
      text: `${PR.DATA.rule.ta} (${cite(PR.DATA.rule)}.) ${PR.DATA.corrections.ta} (${cite(PR.DATA.corrections)}.) நண்பன், அதிமித்திரன் முதலியவை அத். 3-இன் கூட்டுறவு (பஞ்சதா மைத்ரி) முறைப்படி ஜாதகத்தில் கண்டவை; மூலத்திரிகோணம் அத். 3 v.51–54-இன் பாகைகளின்படி; உச்ச ராசியில் உள்ள கிரகம் முதலில் உச்சம் எனக் கொள்ளப்படுகிறது. நூலின் உதாரணத்தை (ப.906–908) அதன் தீர்க்கங்களிலிருந்து மீண்டும் கணித்தேன்: புதன், குரு, சனிக்கு அதில் அச்சிட்ட கதிர்கள் விதிப்படி வருகின்றன; சூரியன், சந்திரன், செவ்வாய், சுக்கிரனுக்கு வரவில்லை (அவற்றின் ராசி-பாகை-கலைக் கணக்கு தவறுகிறது). எனவே இங்கு விதி பின்பற்றப்படுகிறது; அச்சிட்ட எண்கள் நகலெடுக்கப்படவில்லை. கதிர்களின் பலன்கள் நூலுடையவை, தீர்ப்பு அல்ல.`,
    },
    { kind: 'table', heading: 'கதிர்கள்', columns: ['கிரகம்', 'தீர்க்கம்', 'நீசப் புள்ளியிலிருந்து தூரம்', 'திருத்தத்துக்கு முன் கதிர்', 'ராசி நிலை', 'திருத்தம்', 'நிகரக் கதிர்', 'திசை (v.21)'], rows },
    {
      kind: 'text',
      heading: 'மொத்தக் கதிர்களின் பலன் (v.8–18)',
      text: `${f2(r.total)} — ${effectText}. (${cite(PR.DATA.effects)}.) ${PR.DATA.effects.note} ${PR.DATA.status.ta} (${cite(PR.DATA.status)}.) ${PR.DATA.direction.ta} (${cite(PR.DATA.direction)}.) ${PR.DATA.closing.ta} (${cite(PR.DATA.closing)}.)`,
    },
  ];
  return { ...head(name, birth), blocks };
}

/** Page 141: the rest of BPHS ch.70: the years of distress from Saturn's Ashtakavarga, the father's yogas and the Sun's and the Moon's Ashtakavarga for auspicious acts. */
async function buildAshtakavargaRest({ name = '', birth, dashaOptions, asOf = new Date() }) {
  const { tree, chart } = await treeFor(birth, dashaOptions, 2);
  const rasi = AL.rasiPositions(chart);
  const signs = Object.fromEntries(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].map((p) => [p, chart.grahas[p].rasiIndex]));
  const lagnaSign = chart.lagna.rasiIndex;
  const source = AY.DATA.source;
  const cite = (x) => located(source.title, `Chapter 70 v.${x.verses}, printed ${pagesText(x.page)}`, source.author);
  const offset = birth.utcOffsetMinutes ?? 0;
  const yearStart = (n) => new Date(Date.UTC(birth.year + n - 1, birth.month - 1, birth.day));
  const dmyOfDate = (d) => `${String(d.getUTCDate()).padStart(2, '0')}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${d.getUTCFullYear()}`;
  const dashaAt = (n) => {
    const ms = Date.UTC(birth.year + n - 1, birth.month - 1, birth.day, birth.hour, birth.minute ?? 0) - offset * 60000;
    const jd = ms / 86400000 + 2440587.5;
    const md = tree.dashas.find((d) => d.startJulianDay <= jd && jd < d.endJulianDay);
    const ad = md && (md.Bhukti || []).find((b) => b.startJulianDay <= jd && jd < b.endJulianDay);
    return md ? `${PLANET_TA[md.lord] ?? md.lord} மகாதசை${ad ? ` — ${PLANET_TA[ad.lord] ?? ad.lord} புக்தி (${dmyLocal(ad.startLocal)} முதல் ${dmyLocal(ad.endLocal)})` : ''}` : '—';
  };

  // v.37-40: the years from Saturn's own Bhinnashtakavarga
  const saturnRekhas = calculateBhinnashtakavarga('Saturn', rasi);
  const yrs = AY.saturnYears(saturnRekhas, lagnaSign, signs.Saturn);
  const yearRow = (label, n, note) => [label, `${n}`, `${n}-ஆம் ஆண்டு`, `${dmyOfDate(yearStart(n))} முதல் ${dmyOfDate(yearStart(n + 1))} வரை`, dashaAt(n), note];
  const yearRows = [
    yearRow(`லக்னம் (${RASI_TA[lagnaSign]}) முதல் சனி (${RASI_TA[signs.Saturn]}) வரை`, yrs.toSaturn, 'துன்பம்'),
    yearRow('சனி முதல் லக்னம் வரை', yrs.fromSaturn, 'துன்பம்'),
    yearRow('இரண்டின் கூட்டு', yrs.total, 'அரிஷ்ட தசையும் நடந்தால் மரணம் அல்லது மரணத்துக்கு நிகரான துன்பம் சாத்தியம் (நூல்)'),
  ];

  // v.16-18: the father's yogas the birth chart shows
  const fy = AY.fatherYogas({ signs, lagnaSign });
  const lord4Md = tree.dashas.find((d) => d.lord === fy.lord4);
  const houseOrNo = (h) => `${h}-ஆம் வீடு`;
  const fatherRows = [
    ['(1) 4-ஆம் அதிபதியின் தசையில் தந்தை மகிழ்ச்சியாக இருப்பார்', `4-ஆம் அதிபதி ${PLANET_TA[fy.lord4]}; அவரது மகாதசை ${lord4Md ? `${dmyLocal(lord4Md.startLocal)} முதல் ${dmyLocal(lord4Md.endLocal)} வரை` : 'முதல் 120 ஆண்டுகளில் வரவில்லை'}`, 'காலம்'],
    ['(2) 4-ஆம் அதிபதி லக்னத்திலோ 11-ஆம் வீட்டிலோ, அல்லது சந்திரனுக்கு 11 அல்லது 10-ஆம் வீட்டிலோ இருந்தால் தந்தைக்குக் கீழ்ப்படிந்தவன்', `${PLANET_TA[fy.lord4]} லக்னத்திலிருந்து ${houseOrNo(fy.lord4House)}, சந்திரனிலிருந்து ${houseOrNo(fy.lord4HouseFromMoon)}`, fy.obedient ? 'பொருந்துகிறது' : 'பொருந்தவில்லை'],
    ['(3) தந்தையின் லக்னம்/சந்திரனிலிருந்து 3-ஆம் ராசியில் பிறப்பு', 'தந்தையின் ஜாதகம் தேவை', 'சோதிக்கப்படவில்லை'],
    ['(4) தந்தையின் லக்னம்/சந்திரனிலிருந்து 10-ஆம் ராசியில் பிறப்பு', 'தந்தையின் ஜாதகம் தேவை', 'சோதிக்கப்படவில்லை'],
    ['(5) 10-ஆம் அதிபதி லக்னத்தில் இருந்தால் தந்தையைவிடச் சிறந்தவன்', `10-ஆம் அதிபதி ${PLANET_TA[fy.lord10]} ${RASI_TA[signs[fy.lord10]]} ராசியில்`, fy.tenthLordInLagna ? 'பொருந்துகிறது' : 'பொருந்தவில்லை'],
    ['v.15: தந்தையின் மறைவுக்குப்பின் அவன் பொறுப்புகளை ஏற்பவன்', 'தந்தையின் ஜாதகம் தேவை', 'சோதிக்கப்படவில்லை'],
  ];

  // v.19-23: the Sun's and the Moon's Ashtakavarga
  const sunBav = calculateBhinnashtakavarga('Sun', rasi);
  const moonBav = calculateBhinnashtakavarga('Moon', rasi);
  const sx = AY.extremes(sunBav);
  const mx = AY.extremes(moonBav);
  const signRows = Array.from({ length: 12 }, (_, s) => {
    const month = sunMonthOf(s, asOf.getTime(), offset);
    const marks = [
      sx.most.includes(s) ? 'சூரிய அஷ்டகவர்க்கத்தில் அதிக ரேகை' : '',
      sx.fewest.includes(s) ? 'சூரிய அஷ்டகவர்க்கத்தில் குறைந்த ரேகை (அதிகப் புள்ளி)' : '',
      mx.most.includes(s) ? 'சந்திர அஷ்டகவர்க்கத்தில் அதிக ரேகை' : '',
      mx.fewest.includes(s) ? 'சந்திர அஷ்டகவர்க்கத்தில் குறைந்த ரேகை (அதிகப் புள்ளி)' : '',
    ].filter(Boolean).join('; ') || '—';
    return [RASI_TA[s], `${sunBav[s]} (புள்ளி ${8 - sunBav[s]})`, `${month.from} முதல் ${month.to} வரை${month.current ? ' (நடப்பு மாதம்)' : ''}`, `${moonBav[s]} (புள்ளி ${8 - moonBav[s]})`, marks];
  });

  // the dates of Saturn's passages through the signs and the nakshatras page 130 gives for each matter, from six years before the day of printing (to find where a passage began) to fifteen years after it
  const targets = AV.chartEffects(chart);
  const fromJd = asOf.getTime() / 86400000 + 2440587.5 - 6 * 365.25;
  const nowJd = asOf.getTime() / 86400000 + 2440587.5;
  const toJd = nowJd + 15 * 365.25;
  const dayText = (jd) => dmyLocal(new Date((jd - 2440587.5) * 86400000 + offset * 60000).toISOString().slice(0, 10));
  const spans = (list, label) => list.filter((w) => w.toJd >= nowJd).map((w) => `${label(w.key)} ${w.continuesBefore ? 'முன்பே தொடங்கியது' : dayText(w.fromJd)} முதல் ${w.continuesAfter ? 'தொடர்கிறது' : dayText(w.toJd)} வரை${w.fromJd <= nowJd && w.toJd >= nowJd ? ' (நடப்பில்)' : ''}`).join(' · ') || 'இந்த 15 ஆண்டுகளில் இல்லை';
  const passageRows = AV.PLANETS.map((p) => {
    const t = targets[p].targets;
    if (!t.rasis.length) return [`${PLANET_TA[p]} — ${AV.DATA.planets[p].matter}`, '—', '0 ரேகை: நூல் இலக்கு தரவில்லை', '—', '—'];
    const signList = t.rasis.map((r) => r - 1);
    return [
      `${PLANET_TA[p]} — ${AV.DATA.planets[p].matter}`,
      t.rasis.map((r) => RASI_TA[r - 1]).join(', '),
      spans(SP.signPassages(signList, fromJd, toJd, chart.ayanamsha), (s) => RASI_TA[s]),
      t.nakshatras.map((n) => NAKSHATRA_TA[n - 1]).join(', '),
      spans(SP.nakshatraPassages(t.nakshatras, fromJd, toJd, chart.ayanamsha), (n) => NAKSHATRA_TA[n - 1]),
    ];
  });

  return {
    ...head(name, birth),
    blocks: [
      {
        kind: 'text',
        heading: 'அஷ்டகவர்க்கம் அத். 70-இன் மீதிப் பகுதிகள் (பிருஹத் பராசர ஹோரா சாஸ்திரம்) — ஜோதிடர் பயன்பாட்டுக்கு',
        text: `${AY.DATA.years.ta} (${cite(AY.DATA.years)}.) சனியின் பின்னாஷ்டகவர்க்க ரேகைகள் (மேஷம் முதல் மீனம் வரை): ${saturnRekhas.join(' ')}. நூலின் உதாரணம்: ${AY.DATA.yearsExample.ta} ஆண்டுகள் வாழ்வின் எண்ணிக்கை ஆண்டுகள் (30-ஆம் ஆண்டு = 29-ஆம் பிறந்தநாள் முதல் 30-ஆம் பிறந்தநாள் வரை); அவ்வாண்டின் தொடக்கத்தில் நடக்கும் விம்சோத்தரி மகாதசை, புக்தி காட்டப்படுகின்றன. அரிஷ்ட தசை எது என்று இங்கு நூல் சொல்லவில்லை (v.41–42-இன் உதாரணம் மாரகேச தசை என்கிறது), எனவே அது தீர்மானிக்கப்படவில்லை. நூலின் சொற்கள் மென்மையாக்கப்படவில்லை; தீர்ப்பு அல்ல.`,
      },
      { kind: 'table', heading: `சனியின் அஷ்டகவர்க்கத்தால் துன்ப ஆண்டுகள் (v.37–40, ${cite(AY.DATA.years)})`, columns: ['கணக்கு', 'ரேகை', 'ஆண்டு', 'அந்த ஆண்டின் காலம்', 'ஆண்டின் தொடக்கத்தில் தசை', 'நூல்'], rows: yearRows },
      {
        kind: 'text',
        heading: 'தந்தையின் நற்பேறு (v.16–18)',
        text: `${AY.DATA.father.ta} (${cite(AY.DATA.father)}.) ${AY.DATA.father.succession.ta} (${cite(AY.DATA.father.succession)}.) நூலின் v.12–14 (தந்தைக்கு அரிஷ்டம்: சனி கோசாரத்தில் திரிகோண ராசிகளில் செல்லும்போது சூரியனுக்கு 4-ஆம் இடத்தில் ராகு, சனி, செவ்வாய் இருத்தல் முதலியவை) சூரியனுக்கு 4-ஆம் இடம் பிறப்பு ஜாதகத்திலா கோசார ஜாதகத்திலா, எந்த நிலைகள் கோசாரத்தவை என்று தெளிவாகச் சொல்லாததால் இங்கு கட்டப்படவில்லை.`,
      },
      { kind: 'table', heading: 'தந்தையின் நற்பேறு — பிறப்பு ஜாதகம் காட்டுவன', columns: ['நூலின் கூற்று', 'இந்த ஜாதகத்தில்', 'நிலை'], rows: fatherRows },
      {
        kind: 'text',
        heading: 'சுப காரியங்களுக்குச் சூரிய-சந்திர அஷ்டகவர்க்கம் (v.19–23)',
        text: `${AY.DATA.sun.ta} (${cite(AY.DATA.sun)}.) ${AY.DATA.moon.ta} (${cite(AY.DATA.moon)}.) "அதிகப் புள்ளி" என்பது குறைந்த ரேகை (ஒரு ராசியில் எட்டு பங்களிப்பாளர்கள் என்பதால் புள்ளிகள் = 8 − ரேகைகள்). எந்த எண்ணிலிருந்து "அதிகம்" என்று நூல் வரம்பு தரவில்லை; எனவே சூரிய, சந்திர அஷ்டகவர்க்கங்களில் அதிக, குறைந்த ரேகைகள் உள்ள ராசிகள் மட்டும் குறிக்கப்படுகின்றன; வேறு எதுவும் நல்லது-தீயது எனச் சொல்லப்படவில்லை. மத்யம குரு ராசியில் செல்லும் சம்வத்சரம் கணிக்கப்படவில்லை. சூரியன் அந்த ராசியில் செல்லும் மாதத்தின் தேதிகள் அச்சிடும் நாளிலிருந்து நடப்பு அல்லது அடுத்த மாதத்துக்குக் காட்டப்படுகின்றன.`,
      },
      { kind: 'table', heading: 'ராசிகள் — சூரிய, சந்திர அஷ்டகவர்க்க ரேகைகள்', columns: ['ராசி', 'சூரிய அஷ்டகவர்க்க ரேகை', 'சூரியன் இந்த ராசியில்', 'சந்திர அஷ்டகவர்க்க ரேகை', 'குறிப்பு'], rows: signRows },
      {
        kind: 'text',
        heading: 'சனியின் கோசாரக் காலங்கள் — பக்கம் 130-இன் இலக்குகளுக்கு',
        text: `${AV.DATA.method.ta} (${cite(AV.DATA.method)}.) பக்கம் 130 ஒவ்வொரு பொருளுக்கும் சனி செல்லும்போது தீங்கு என்று நூல் குறிக்கும் ராசிகளையும் நட்சத்திரங்களையும் (மூன்று, மூன்று) தருகிறது; இங்கு அவற்றில் சனி உண்மையில் செல்லும் காலங்கள் கோள் நிலைக் கணிப்பிலிருந்து தரப்படுகின்றன (வக்ர மீளல்களும் தனி வரிசையாக). அச்சிடும் நாளுக்குப் பின் 15 ஆண்டுகள் காட்டப்படுகின்றன. நூல் சொல்வது: அந்தக் காலத்தில் அசுப தசை நடந்தால் மட்டுமே மரணம்; சாதகமான தசையில் துன்பம் மட்டும் (இங்கு தசை சோதிக்கப்படவில்லை; எந்த தசை அசுபம் என்று நூல் இங்கு சொல்லவில்லை). இவை நூலின் கூற்றுகள்; தீர்ப்பு அல்ல; ஜோதிடர் பயன்பாட்டுக்கு.`,
      },
      { kind: 'table', heading: 'சனி இந்த ராசிகளிலும் நட்சத்திரங்களிலும் செல்லும் காலங்கள்', columns: ['பொருள்', 'நூல் குறிக்கும் ராசிகள்', 'சனி அவற்றில் செல்லும் காலம்', 'நூல் குறிக்கும் நட்சத்திரங்கள்', 'சனி அவற்றில் செல்லும் காலம்'], rows: passageRows },
    ],
  };
}

/** Page 142: what the classical books say of the rising sign, the Moon's sign and the birth star (the nature and character that PL9's HP1 prints as canned text), each book apart. */
async function buildCharacterReadings({ name = '', birth }) {
  const f = await withBirth(birth, ({ chart }) => ({
    signs: Object.fromEntries(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].map((p) => [p, chart.grahas[p].rasiIndex])),
    lagnaSign: chart.lagna.rasiIndex,
    moonLongitude: chart.grahas.Moon.longitude,
  }));
  const moon = JR.janmaRasi(f.signs);
  const star = JN.janmaNakshatra(f.moonLongitude);
  const aspecting = PY.aspectors(f.signs, f.signs.Moon, 'Moon');
  const lord = LL.lagnaLordInLagna(f.lagnaSign);
  const lordInLagna = f.signs[lord.planet] === f.lagnaSign;
  const names = (ps) => (ps.length ? ps.map((p) => PLANET_TA[p] ?? p).join(', ') : 'இல்லை');
  const cellCite = (r) => `${citeTa(r.source)} — ${r.verses ? `v.${r.verses}, ` : ''}ப.${r.page}`;
  const rows = [];
  for (const r of LR.readings(f.lagnaSign)) rows.push([`லக்னம் — ${RASI_TA[f.lagnaSign]}`, `${r.source.title}`, r.ta, cellCite(r)]);
  if (lordInLagna) rows.push([`லக்னாதிபதி ${PLANET_TA[lord.planet]} லக்னத்திலேயே (${RASI_TA[f.lagnaSign]})`, 'Bhrigu Samhita (T.M. Rao)', lord.ta, lord.citation]);
  for (const r of moon.readings) rows.push([`சந்திரன் — ${RASI_TA[moon.sign]} ராசி`, `${r.source.title}`, r.ta, cellCite(r)]);
  for (const r of star.readings) rows.push([`ஜன்ம நட்சத்திரம் — ${NAKSHATRA_TA[star.star - 1]}`, `${r.source.title}`, r.ta, cellCite(r)]);
  return {
    ...head(name, birth),
    blocks: [
      {
        kind: 'text',
        heading: 'சுபாவமும் குணமும் — நூல்களின்படி (லக்னம், சந்திர ராசி, ஜன்ம நட்சத்திரம்)',
        text: `லக்னம் ${RASI_TA[f.lagnaSign]}; சந்திரன் ${RASI_TA[moon.sign]} ராசியில், ${NAKSHATRA_TA[star.star - 1]} நட்சத்திரம் ${star.pada}-ஆம் பாதம். PL9 இவற்றை ஒரே தயார் உரையாக அச்சிடுகிறது; இங்கு ஒவ்வொரு நூலின் கூற்றும் தனித்தனியே, ஒன்றாகக் கலக்காமல், பக்கத்துடன் காட்டப்படுகிறது (நூல் எதைத் தேர்வது என்று யாரும் சொல்லவில்லை; தீர்ப்பு இல்லை). சந்திரன் இருக்கும் ராசியில் சேர்ந்த கிரகங்கள்: ${names(moon.joined)}; அதைப் பார்க்கும் கிரகங்கள் (அத். 26-இன்படி ராசிகளால்): ${names(aspecting)} (ஹோரா சாரம்: இவை இல்லாவிட்டால் மட்டுமே கூறிய பலன்கள்; இருந்தால் அந்தக் கிரகத்தின் பலன்கள் வரும்). ப்ருஹத் ஜாதகம்: ராசி, அதன் அதிபதி, சந்திரன் மூவரும் வலிமையாக இருந்தால் மட்டுமே முழுப் பலன்; வலிமை சோதிக்கப்படவில்லை. லக்னாதிபதி லக்னத்தில் இருந்தால் மட்டுமே ப்ருகு சம்ஹிதைக் கூற்று பொருந்தும்: ${lordInLagna ? 'இங்கு இருக்கிறார்' : `இங்கு ${PLANET_TA[lord.planet]} லக்னத்தில் இல்லை, எனவே காட்டப்படவில்லை`}.`,
      },
      { kind: 'table', heading: 'நூல்கள் சொல்வது', columns: ['எதைப் பற்றி', 'நூல்', 'நூலின் கூற்று (சுருக்கம்)', 'மூலம்'], rows },
      {
        kind: 'text',
        heading: 'ஒவ்வொரு நூலின் வரம்பு',
        text: 'சரவளி அத். 48: இழந்த ஜாதகத்தைக் கண்டுபிடிக்க எழுதப்பட்டது; அதன் விதிகள் அறிந்த ஜாதகத்துக்கும் பொருந்தும் என்று நூல் கூறுகிறது; லக்னமோ லக்னாதிபதியோ வலிமையாக இருந்தால் பலன்கள் முழுமையாக வரும் (வலிமை சோதிக்கப்படவில்லை); கும்ப லக்னத்தை சத்யாசார்யரும் யவனரும் சுபமாகக் கொள்ளவில்லை, சாணக்கியர் ஒப்பவில்லை என்ற நூலின் குறிப்பு அந்த வரியுடன் உள்ளது. ஹோரா சாரம் அத். 28: 27 நட்சத்திரங்களுக்குச் சில வாக்கியங்கள்; சுபப் பார்வை அல்லது சேர்க்கை பலனை முழுமையாக்கும்; திருவாதிரை, ஆயில்யம், சதயம், பூசம், மூலம், சித்திரை, கேட்டை, கார்த்திகையில் பிறந்த பெண் தவிர்க்கப்பட வேண்டியவள்; தந்தையின் நட்சத்திரத்தில் பிறந்த மகன் தாயின் மரணத்தையும், தாயின் நட்சத்திரத்தில் பிறந்த மகன் தந்தையின் மரணத்தையும் தருவான்; பெண்களுக்கு இது இல்லை. ப்ருஹத் ஜாதகம் அத். 16: 27 நட்சத்திரங்களுக்கு ஒரு வரி, பாதங்கள் இல்லை; பலன்கள் சந்திரனின் வலிமைக்கு ஏற்ப (மொழிபெயர்ப்பாளர் குறிப்பு); நட்சத்திர சூடாமணி பாதவாரியாகத் தருகிறது.',
      },
    ],
  };
}

module.exports = { buildPlanetaryRays, buildAshtakavargaRest, buildCharacterReadings, buildCurseYogas, buildFemaleHoroscopy, buildAshtakavargaLongevity, buildSamudayaEffects, buildElementsGunas, buildSudarshanaDasha, buildMangalaPage, buildSadeSatiRemedies, buildGemstonesPage, buildDashaResults, buildAntardashaResults, buildPratyantarResults, buildSookshmaResults, buildPranaResults, buildKalachakraResults, buildJanmaDoshas, buildPravrajyaYogas, buildPlanetRemedies, buildAshtakavargaEffects, buildMahapurushaYogas };







