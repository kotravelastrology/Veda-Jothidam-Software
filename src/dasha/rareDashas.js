/**
 * VJ-027 — the dasha method register.
 *
 * Every method this software knows about, with its coverage label. This is
 * the list the UI reads, so a method cannot be shown without having been
 * labelled, and cannot be promoted without a source and a worked example.
 *
 * ## Why so many are DECLARED rather than implemented
 *
 * A nakshatra dasha needs three things: the lords in order, the years each
 * holds, and **the rule mapping the birth nakshatra to the starting lord**.
 * The first two are widely repeated and arithmetically self-checking. The
 * third is not, and it is the consequential one: with the right years table
 * and the wrong start rule, every date the system produces is wrong, and
 * wrong in a way that looks entirely plausible — the periods have the right
 * lengths and the right lords, just assigned to the wrong person.
 *
 * For most of the rare systems the start rule could not be established
 * without guessing. Guessing it and labelling the result anything at all
 * would be the defect this whole plan exists to remove, so those methods are
 * `DECLARED`: named, with a note saying exactly what is missing, and with no
 * table at all.
 *
 * Closing them needs the BPHS pages — the same blocker as the eight `TBD`
 * locators VJ-026 surfaced.
 */

const { createCoverage } = require('./coverage');
const { createDashaTable } = require('./nakshatraDashaEngine');
const B = require('./bphsDashas');
const RS = require('./bphsRashiDashas');

const BPHS = {
  title: 'Brihat Parashara Hora Shastra (BPHS)',
  author: 'R. Santhanam (translation)',
  file: 'C23_BPHS_Santhanam.pdf',
  tradition: 'Parashari',
};

const VIMSHOTTARI_CYCLE = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const VIMSHOTTARI_YEARS = {
  Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17, Ketu: 7, Venus: 20,
};
const vimshottariLordOf = (n) => VIMSHOTTARI_CYCLE[n % 9];

/**
 * Tribhagi — Vimshottari with each period reduced to two-thirds, so the cycle
 * is 80 years instead of 120.
 *
 * This is the one rare system that can be built honestly here, because it
 * does not need a start rule of its own: it reuses Vimshottari's nakshatra
 * lords, which are cited to a verified page. Only the durations are scaled,
 * and the scaling is stated rather than transcribed.
 *
 * It is `SOURCED`, not `VERIFIED` — the derivation rests on Vimshottari's
 * cited table, but no published Tribhagi result has been reproduced.
 */
const TRIBHAGI_SCALE = 2 / 3;
const TRIBHAGI_TABLE = createDashaTable({
  id: 'tribhagi',
  cycle: VIMSHOTTARI_CYCLE,
  years: Object.fromEntries(
    Object.entries(VIMSHOTTARI_YEARS).map(([lord, y]) => [lord, y * TRIBHAGI_SCALE]),
  ),
  totalYears: 120 * TRIBHAGI_SCALE,
  lordOfNakshatra: vimshottariLordOf,
});

/** What a DECLARED nakshatra dasha is waiting for. */
const NEEDS_START_RULE = 'ஆண்டுகளின் அட்டவணை பரவலாகச் சொல்லப்படுவது; ஆனால் பிறப்பு '
  + 'நட்சத்திரத்திலிருந்து தொடக்க அதிபதியைத் தீர்மானிக்கும் விதி (start rule) '
  + 'நூலைப் பார்க்காமல் நிறுவ முடியவில்லை. தவறான தொடக்க விதியுடன் ஒவ்வொரு '
  + 'காலமும் தவறாகும் — ஆனால் நம்பத்தகுந்ததாகவே தோன்றும். எனவே அட்டவணை '
  + 'எழுதப்படவில்லை.';

const declared = (id, name, nameTa, notes = NEEDS_START_RULE) => createCoverage({
  id, name, nameTa, family: 'nakshatra', level: 'DECLARED', implemented: false, notes,
});

const METHODS = [
  createCoverage({
    id: 'vimshottari',
    name: 'Vimshottari', nameTa: 'விம்சோத்தரி',
    family: 'nakshatra',
    level: 'VERIFIED',
    implemented: true,
    source: {
      ...BPHS,
      pageLocus: 'file pages 407-411 / printed pages 400-404 (Ch.46 vv.12-16: order, '
        + 'durations, balance-at-birth)',
      convention: '120-year cycle, nakshatra lords in Ketu..Mercury order',
    },
    workedExample: 'vimshottari-chennai-1990',
    notes: '120 ஆண்டு சுழற்சி. இந்த software-இன் ஒரே முழுமையாகச் சரிபார்க்கப்பட்ட '
      + 'தசை முறை.',
  }),

  createCoverage({
    id: 'tribhagi',
    name: 'Tribhagi', nameTa: 'திரிபாகி',
    family: 'nakshatra',
    level: 'SOURCED',
    implemented: true,
    source: {
      ...BPHS,
      pageLocus: 'derived from the Vimshottari table at file pages 407-411 / printed '
        + 'pages 400-404 by the stated two-thirds reduction; the reduction itself is '
        + 'not quoted from a verified page',
      convention: '80-year cycle — Vimshottari durations x 2/3, same nakshatra lords',
    },
    notes: 'விம்சோத்தரியின் அதே நட்சத்திர அதிபதிகள்; காலங்கள் மட்டும் 2/3 ஆகக் '
      + 'குறைக்கப்படுகின்றன (120 → 80 ஆண்டு). தொடக்க விதி விம்சோத்தரியுடையது, '
      + 'எனவே ஊகம் எதுவும் இல்லை. வெளியிடப்பட்ட ஒரு முடிவு இன்னும் '
      + 'மீளுருவாக்கப்படவில்லை.',
  }),

  createCoverage({
    id: 'ashtottari',
    name: 'Ashtottari', nameTa: 'அஷ்டோத்தரி',
    family: 'nakshatra',
    level: 'SOURCED',
    implemented: true,
    source: { ...B.BPHS, pageLocus: B.ASHTOTTARI_SOURCE.pageLocus },
    workedExample: 'bphs-46-ashtottari-uttarashada',
    notes: '108 ஆண்டு; 8 அதிபதிகள் 28 பிரிவுகளில் (அபிஜித் உட்பட) 3 அல்லது 4 பிரிவுகளைப் பெறுகிறார்கள்; '
      + 'நூலின் எடுத்துக்காட்டு (உத்திராடம்: 6 ஆண்டு 2 மாதம் 25 நாள் இருப்பு) மீளுருவாக்கப்படுகிறது — '
      + 'நூலின் சில கணக்குப் பிழைகள் `test-bphs-dashas.js` இல் பதிவாகியுள்ளன. 2026-10-21 இல் நூலைப் பார்த்துத் '
      + 'திருத்தப்பட்டது: முந்தைய port 27 நட்சத்திரங்களை 4,3,4,3,4,3,4,2 எனப் பிரித்து தனிஷ்டா முதல் கிருத்திகை வரை தவறாக ஒதுக்கியது. '
      + 'துணைக் காலங்கள் விம்சோத்தரி போலவே விகிதப்படி (நூல் தனியாகச் சொல்லவில்லை).',
  }),

  createCoverage({
    id: 'yogini',
    name: 'Yogini', nameTa: 'யோகினி',
    family: 'nakshatra',
    level: 'SOURCED',
    implemented: true,
    source: { ...RS.SOURCES.yogini },
    workedExample: 'bphs-46-yogini-mrigashira',
    notes: '36 ஆண்டு சுழற்சி, 8 யோகினிகள் (மங்களா 1 … சங்கடா 8; சந்திரன், சூரியன், குரு, செவ்வாய், புதன், சனி, சுக்கிரன், ராகு). '
      + 'தொடக்கம்: நட்சத்திர எண் + 3 ஐ 8 ஆல் வகுத்த மீதி (0 = சங்கடா) — நூலின் எடுத்துக்காட்டு மிருகசீரிடம் → சங்கடா மீளுருவாக்கப்படுகிறது. '
      + 'இருப்பு பாயத்/பபோகத்தின் விகிதப்படி. துணைக் காலங்கள் விகிதப்படி (நூல் தனியாகச் சொல்லவில்லை).',
  }),

  createCoverage({
    id: 'kalachakra',
    name: 'Kalachakra', nameTa: 'காலசக்கரம்',
    family: 'rasi',
    level: 'SOURCED',
    implemented: true,
    source: {
      title: 'காலச்சக்கரம் (தெளிவான உரையுடன்) — தில்லைநாயகப் புலவர்',
      author: 'தில்லைநாயகப் புலவர்; பதிப்பாசிரியர் வித்துவான் அடிகளாசிரியர்',
      file: 'தஞ்சாவூர் சரசுவதி மகால் நூலகம் வெளியீடு எண். 125, 7th edn. 2007 '
        + '(TVA_BOK_0008536)',
      pageLocus: "முன்னுரை pp.2-4 (savya/apasavya classification, 108-pada starting "
        + "rasi table) + pp.9-11 (gati and the rasi walks) — see the module header "
        + "for which walks are stated outright and which are derived by the source's "
        + 'own rotation rule',
      tradition: 'Tamil classical — rasi dasha keyed to nakshatra padas',
      convention: 'nakshatra-pada keyed rasi dasha, 108-pada table',
    },
    notes: 'நட்சத்திரப் பாதத்தை அடிப்படையாகக் கொண்ட ராசி தசை. மூலத்தில் '
      + 'நேரடியாகக் கூறப்பட்டவை எவை, சுழற்சி விதியால் பெறப்பட்டவை எவை என்பதை '
      + 'module header வேறுபடுத்திக் காட்டுகிறது.',
  }),

  // ── Known, deliberately not implemented ──────────────────────────────
  ...Object.entries(B.SYSTEMS).map(([id, sys]) => createCoverage({
    id,
    name: id.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join('-'), nameTa: sys.nameTa,
    family: 'nakshatra',
    level: 'SOURCED',
    implemented: true,
    source: { ...sys.source },
    workedExample: sys.example && !sys.example.disagrees ? `bphs-46-${id}-first-lord` : (id === 'shodashottari' ? 'bphs-46-shodashottari-rohini' : null),
    notes: `${B.TABLES[id].totalYears} ஆண்டு சுழற்சி; தொடக்க அதிபதி: ${sys.dir === 'TO_BIRTH' ? 'நட்சத்திரம்' : 'பிறப்பு நட்சத்திரத்திலிருந்து'} எண்ணி ${sys.mod} ஆல் வகுத்த மீதி — நூலின் விதிப்படி. `
      + `பொருந்தும் நிலை (நூல்): ${sys.whenTa}; இது இங்கே சரிபார்க்கப்படுவதில்லை, குறிப்பாக மட்டும். `
      + (sys.example?.disagrees ? 'நூலின் எடுத்துக்காட்டு (மிருகசீரிடம் → செவ்வாய்) அதன் சொந்த விதியுடன் (→ புதன்) ஒத்துப்போகவில்லை; விதி அப்படியே. ' : '')
      + 'துணைக் காலங்கள் விம்சோத்தரி போலவே விகிதப்படி (நூல் தனியாகச் சொல்லவில்லை).',
  })),
  declared('shashtihayani', 'Shashtihayani', 'ஷஷ்டிஹாயனி', B.SHASTIHAYANI_PROBLEM_TA),

  ...['chara', 'sthira', 'yogardha', 'mandooka', 'dirga', 'lagnadi'].map((id) => createCoverage({
    id,
    name: id[0].toUpperCase() + id.slice(1), nameTa: RS.NAMES_TA[id],
    family: 'rashi',
    level: 'SOURCED',
    implemented: true,
    source: { ...RS.SOURCES[id] },
    workedExample: `bphs-46-${id}`,
    notes: 'ராசி தசை — நூலின் விதிப்படி (BPHS அத்.46), தொடக்கம் பிறப்பில்; இருப்பு இல்லை. '
      + 'நூலின் எடுத்துக்காட்டு அட்டவணையுடன் ஒப்பிட்டு, ஒத்துப்போகாத கட்டங்கள் test-bphs-rashi-dashas.js-இல் பட்டியலிடப்பட்டுள்ளன.',
  })),
  declared('narayana', 'Narayana', 'நாராயண',
    'ஜைமினி பத ராசி தசை. மேலே உள்ள அதே தேவை.'),
  declared('niryaana-shoola', 'Niryaana Shoola', 'நிர்யாண சூல',
    'ஆயுள் தொடர்பான ஜைமினி தசை. மேலே உள்ள அதே தேவை.'),
  declared('drig', 'Drig', 'த்ருக்',
    'ஜைமினி பார்வை அடிப்படையிலான ராசி தசை. மேலே உள்ள அதே தேவை.'),
  declared('lagna-kendradi-rashi', 'Lagna Kendradi Rashi', 'லக்ன கேந்திராதி ராசி', RS.DECLARED_TA['lagna-kendradi-rashi']),
  declared('navamsha-dasha', 'Navamsha Dasha', 'நவாம்ச தசை',
    'நவாம்சத்தை அடிப்படையாகக் கொண்ட தசை. சரிபார்க்கப்பட்ட ஆதாரம் தேவை.'),
  declared('padanadhamsa', 'Padanadhamsa', 'பாதநாதாம்ச',
    'சரிபார்க்கப்பட்ட ஆதாரம் தேவை.'),
  declared('shoola', 'Shoola', 'சூல', RS.DECLARED_TA.shoola),
];

const BY_ID = new Map(METHODS.map((m) => [m.id, m]));

const TABLES = { tribhagi: TRIBHAGI_TABLE, ashtottari: B.ASHTOTTARI, ...B.TABLES };

const getMethod = (id) => BY_ID.get(id) ?? null;
const getTable = (id) => TABLES[id] ?? null;
const promotedMethods = () => METHODS.filter((m) => m.promoted);
const implementedMethods = () => METHODS.filter((m) => m.implemented);

/** How far the register has got, for the UI and for the record. */
function coverageSummary() {
  const byLevel = {};
  for (const m of METHODS) byLevel[m.level] = (byLevel[m.level] ?? 0) + 1;
  return {
    total: METHODS.length,
    byLevel,
    promoted: promotedMethods().length,
    implemented: implementedMethods().length,
  };
}

module.exports = {
  METHODS, TABLES, TRIBHAGI_TABLE, TRIBHAGI_SCALE,
  VIMSHOTTARI_CYCLE, VIMSHOTTARI_YEARS, vimshottariLordOf,
  getMethod, getTable, promotedMethods, implementedMethods, coverageSummary,
};
