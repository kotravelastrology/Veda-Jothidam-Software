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
    level: 'STRUCTURE_ONLY',
    implemented: true,
    notes: '108 ஆண்டு சுழற்சி, 8 அதிபதிகள். `altDashas.js`-இல் முந்தைய '
      + 'AstrologicLab engine-லிருந்து port செய்யப்பட்டது; அதன் குறிப்பு BPHS '
      + 'அத்.49-ஐச் சுட்டுகிறது, ஆனால் `attachSource` முத்திரை இல்லை, பக்கமும் '
      + 'சரிபார்க்கப்படவில்லை.',
  }),

  createCoverage({
    id: 'yogini',
    name: 'Yogini', nameTa: 'யோகினி',
    family: 'nakshatra',
    level: 'STRUCTURE_ONLY',
    implemented: true,
    notes: '36 ஆண்டு சுழற்சி, 8 யோகினிகள் (மங்களா 1 … சங்கடா 8). '
      + '`altDashas.js`-இல் port செய்யப்பட்டது; தொடக்க விதி (nakIdx+3) mod 8 '
      + 'ஒரு BPHS உத்தர மேற்கோளுடன் குறிப்பிடப்பட்டுள்ளது, ஆனால் `attachSource` '
      + 'முத்திரையும் சரிபார்க்கப்பட்ட பக்கமும் இல்லை.',
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
  declared('shodashottari', 'Shodashottari', 'ஷோடசோத்தரி'),
  declared('dwadashottari', 'Dwadashottari', 'த்வாதசோத்தரி'),
  declared('panchottari', 'Panchottari', 'பஞ்சோத்தரி'),
  declared('shatabdika', 'Shatabdika', 'சதாப்திகா'),
  declared('chaturashiti-sama', 'Chaturashiti-sama', 'சதுராசீதி சம'),
  declared('dwisaptati-sama', 'Dwisaptati-sama', 'த்விசப்ததி சம'),
  declared('shashtihayani', 'Shashtihayani', 'ஷஷ்டிஹாயனி'),
  declared('shattrimshat-sama', 'Shattrimshat-sama', 'ஷட்த்ரிம்சத் சம'),

  declared('chara', 'Chara', 'சர',
    'ஜைமினி ராசி தசை. நட்சத்திர அட்டவணை அல்ல — ராசியிலிருந்து அதன் அதிபதி '
    + 'வரையிலான எண்ணிக்கையால் காலம் தீர்மானிக்கப்படுகிறது. ஜைமினி சூத்திரங்களின் '
    + 'சரிபார்க்கப்பட்ட பதிப்பு தேவை.'),
  declared('sthira', 'Sthira', 'ஸ்திர',
    'ஜைமினி ராசி தசை (நிலையான காலங்கள்). மேலே உள்ள அதே தேவை.'),
  declared('narayana', 'Narayana', 'நாராயண',
    'ஜைமினி பத ராசி தசை. மேலே உள்ள அதே தேவை.'),
  declared('niryaana-shoola', 'Niryaana Shoola', 'நிர்யாண சூல',
    'ஆயுள் தொடர்பான ஜைமினி தசை. மேலே உள்ள அதே தேவை.'),
  declared('drig', 'Drig', 'த்ருக்',
    'ஜைமினி பார்வை அடிப்படையிலான ராசி தசை. மேலே உள்ள அதே தேவை.'),
  declared('lagna-kendradi-rashi', 'Lagna Kendradi Rashi', 'லக்ன கேந்திராதி ராசி',
    'ஜைமினி ராசி தசை. மேலே உள்ள அதே தேவை.'),
  declared('navamsha-dasha', 'Navamsha Dasha', 'நவாம்ச தசை',
    'நவாம்சத்தை அடிப்படையாகக் கொண்ட தசை. சரிபார்க்கப்பட்ட ஆதாரம் தேவை.'),
  declared('padanadhamsa', 'Padanadhamsa', 'பாதநாதாம்ச',
    'சரிபார்க்கப்பட்ட ஆதாரம் தேவை.'),
  declared('shoola', 'Shoola', 'சூல',
    'சரிபார்க்கப்பட்ட ஆதாரம் தேவை.'),
];

const BY_ID = new Map(METHODS.map((m) => [m.id, m]));

const TABLES = { tribhagi: TRIBHAGI_TABLE };

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
