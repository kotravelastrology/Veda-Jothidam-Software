/**
 * VJ-018 — what each porutham governs, how this engine decided it, and how far
 * the rule can be trusted.
 *
 * `calcPorutham` answers "did it pass". A practitioner reading a match to a
 * family needs three more things: what the factor is taken to indicate, the
 * rule that produced this verdict, and where that rule comes from. A bare ✓
 * invites the reader to supply all three from memory.
 *
 * ## On sources
 *
 * The ten rules were first ported from an earlier AstrologicLab screen whose
 * only reference was "the Marriage reference workbook". VJ-018 could only say
 * so. Two primary texts have since been read, page by page, and compared with
 * that port over every possible input (`poruthamSourceComparison.js`):
 *
 *   - **Kalaprakasika** (N.P. Subramania Iyer's translation, printed pp.69-76)
 *     is the AUTHORITY the calculation now follows.
 *   - **Sudamani Ullamudaiyan** (Saraswati Mahal, 2007; verses 183-199) is the
 *     cross-check.
 *
 * The comparison found errors, not only tradition differences — Gana's table
 * split the stars 12/5/10 where the classical division is 9/9/9, and Dina was
 * inverted — and those are corrected. `SOURCE_COMPARISON` below records, per
 * factor, how the code stands against each text.
 *
 * Where the two texts agree, the rule is well supported. Where they differ, the
 * code follows Kalaprakasika and says that Sudamani differs: neither is the only
 * tradition, and choosing between them is the practitioner's call, not a fact.
 *
 * Rasi Adhipathi is the exception. Kalaprakasika lists each planet's friends but
 * states no rule for what the two lords must be, so there is nothing to
 * implement it from; it keeps the earlier port and is reported as unsourced.
 *
 * `test-porutham-source.js` asserts every status against the live comparison,
 * so none can drift from what is true.
 */

const { withheldEvidence, createRuleEvidence } = require('../contracts/ruleEvidence');

const list = (a) => a.join(', ');

/** Why a factor with no source of its own still has a rule at all. */
const UNVERIFIED = 'விதி முந்தைய AstrologicLab matching screen-லிருந்து port செய்யப்பட்டது; '
  + 'அதன் ஆதாரக் குறிப்பு "Marriage reference workbook" மட்டுமே — பதிப்போ பக்கமோ இல்லை.';

/**
 * The authority, in the shape `attachSource` and `createRuleEvidence` demand.
 * Registered as KALAPRAKASIKA_NPS_IYER in sources/registry.js.
 */
const KALAPRAKASIKA = Object.freeze({
  title: 'Kalaprakasika',
  author: 'N.P. Subramania Iyer (translator)',
  file: 'kalaprakasika-nps-iyer-1982/raw-scans/full-scan.pdf',
  tradition: 'Tamil / Sanskrit classical (muhurta)',
});

/**
 * How each factor stands against each text. Every status is asserted against
 * the live comparison in `test-porutham-source.js`.
 *
 * `fixed` says what the earlier port had wrong, where the comparison found a
 * genuine error rather than a variant — so the correction is visible instead of
 * silent.
 */
const SOURCE_COMPARISON = {
  DINA: {
    kalaprakasika: { status: 'MATCHES', printedPages: '69, 71' },
    sudamani: {
      status: 'DIVERGES', verses: '183-184', printedPage: 78,
      summary: 'சூடாமணி எண்ணிக்கைப் பட்டியலைத் தருகிறது (2, 4, 6, 8, 9, 12, 14, 16, 19, 22, 23, 25, 29). '
        + '2–9 வரை கலாப்பிரகாசிகையுடன் ஒத்தது; 10-க்கு மேல் வேறு — குறிப்பாக 22-ஐ ஏற்கிறது, '
        + 'கலாப்பிரகாசிகை அதைத் தள்ளுகிறது.',
    },
    fixed: 'தலைகீழாக இருந்தது — இரு நூல்களும் நன்று என்கிற 2, 4, 6, 8, 9-ஐத் தள்ளிக்கொண்டிருந்தது.',
  },
  GANA: {
    kalaprakasika: { status: 'MATCHES', printedPages: '72' },
    sudamani: {
      status: 'MATCHES', verses: '186-187', printedPage: 78,
      summary: 'சூடாமணியும் இதே 9-9-9 பிரிவைத் தருகிறது.',
    },
    fixed: '8 நட்சத்திரம் தவறான கணத்தில் இருந்தது (12 தேவர் · 5 மனிதர் · 10 இராட்சதர்) — '
      + 'உரோகணி, திருவாதிரை, உத்திரம், உத்திராடம், உத்திரட்டாதி (மனிதர்), விசாகம், '
      + 'கேட்டை (இராட்சதர்), அனுசம் (தேவர்).',
  },
  MAHENDRA: {
    kalaprakasika: { status: 'MATCHES', printedPages: '72' },
    sudamani: {
      status: 'DIVERGES', verses: '188', printedPage: 79,
      summary: 'சூடாமணி 1, 4, 7, 10, 13, 16, 19, 20, 22, 25 என்கிறது — கூடுதலாக 1 (ஒரே நட்சத்திரம்) '
        + 'மற்றும் 20 (செய்யுளின் கணக்கால் தெளிவாகவில்லை).',
    },
    fixed: null,
  },
  STREE_DEERGHA: {
    kalaprakasika: { status: 'MATCHES', printedPages: '72' },
    sudamani: {
      status: 'MATCHES', verses: '188', printedPage: 79,
      summary: 'சூடாமணி "பதிமூன்று நாட்களாகிலும் அதற்கு மேற்படிலும்" என்று தெளிவாகக் கூறுகிறது.',
    },
    fixed: 'முன்பு 7 அல்லது அதற்கு மேல் — கலாப்பிரகாசிகை இதைச் "சிலர் கூறும்" சிறுபான்மைக் கருத்தாகக் '
      + 'குறிப்பிடுகிறது; முதன்மை விதி 13.',
  },
  YONI: {
    kalaprakasika: { status: 'MATCHES', printedPages: '73' },
    sudamani: {
      status: 'DIFFERENT_MODEL', verses: '189-192', printedPage: 80,
      summary: 'சூடாமணி விலங்குகளுடன் பாலையும் தருகிறது; ஆண்–ஆண் யோனிகள் பகை; யானைக்குப் பகை '
        + 'மனிதர். விலங்குகள் பெரும்பாலும் ஒன்றே, ஆனால் விதி வேறு — ஒப்பிட முடியாது.',
    },
    fixed: 'முன்பு 9 எண் குழுக்களும் அருகாமைச் சோதனையும் இருந்தது — இரு நூல்களிலும் இல்லாத அமைப்பு.',
  },
  RASI: {
    kalaprakasika: { status: 'MATCHES', printedPages: '73-74' },
    sudamani: {
      status: 'MATCHES', verses: '192', printedPage: 81,
      summary: 'சூடாமணி: மணமகள் ராசியிலிருந்து 7 அல்லது அதற்கு மேல் உத்தமம், 7-க்குக் குறைந்தால் ஆகாது.',
    },
    fixed: 'முன்பு 1, 2, 5, 6, 7, 11 மட்டுமே ஏற்கப்பட்டது — இரு நூல்களும் 7 முதல் 12-ஐ ஏற்று '
      + '2 முதல் 6-ஐத் தள்ளுகின்றன; சூடாமணியுடன் 144 ராசி ஜோடிகளில் 48-இல் மட்டுமே ஒத்தது.',
  },
  RASI_ADHIPATHI: {
    kalaprakasika: { status: 'RULE_NOT_STATED', printedPages: '74-75' },
    sudamani: {
      status: 'DIVERGES', verses: '193-194', printedPage: 81,
      summary: 'சூடாமணி ராசிவாரியான நட்பு அட்டவணையைத் தருகிறது; இங்குள்ள "அதிபதிகள் வேறு" என்ற '
        + 'எளிய சோதனையுடன் அது 144 ஜோடிகளில் 94-இல் மட்டுமே ஒத்தது.',
    },
    fixed: null,
  },
  VASYA: {
    kalaprakasika: { status: 'MATCHES', printedPages: '75' },
    sudamani: {
      status: 'DIVERGES', verses: '195-196', printedPage: 82,
      summary: 'சூடாமணியின் வசிய அட்டவணை சில உள்ளீடுகளில் வேறுபடுகிறது '
        + '(எ.கா. இடபம்: சூடாமணி கடகம், துலாம்; கலாப்பிரகாசிகை கடகம், சிங்கம்).',
    },
    fixed: 'முன்பு இரு நூல்களிலும் இல்லாத அட்டவணை (எ.கா. மேடம்–கடகம், தனுசு; நூல்களில் மேடம்–சிங்கம், விருச்சிகம்).',
  },
  RAJJU: {
    kalaprakasika: { status: 'MATCHES', printedPages: '75' },
    sudamani: {
      status: 'MATCHES', verses: '197-198', printedPage: 83,
      summary: 'சூடாமணியின் ஐந்து ரஜ்ஜுப் பிரிவுகள் நட்சத்திரம் நட்சத்திரமாக அதே.',
    },
    fixed: null,
  },
  VEDHA: {
    kalaprakasika: { status: 'MATCHES', printedPages: '76' },
    sudamani: {
      status: 'DIVERGES', verses: '199', printedPage: 84,
      summary: 'சூடாமணியின் வேதை ஜோடிகள் (பரணி–கேட்டை, கார்த்திகை–அனுசம்…) வேறு; '
        + 'இரு நூல்களுக்கும் பொதுவான ஜோடி ஏதுமில்லை.',
    },
    fixed: 'முன்பு 12 ஜோடிகளில் அசுபதி–கேட்டை மட்டுமே ஒரு நூலுடன் ஒத்தது; மற்ற 11 இரு நூல்களிலும் இல்லை.',
  },
};

/**
 * The single status a row shows, derived from the two comparisons so it cannot
 * disagree with them.
 */
function sourceStatusOf(comparison) {
  const k = comparison.kalaprakasika.status;
  const s = comparison.sudamani.status;
  if (k === 'MATCHES' && s === 'MATCHES') return 'AGREED_BY_BOTH';
  if (k === 'MATCHES') return 'FOLLOWS_KALAPRAKASIKA';
  return 'NOT_SOURCED';
}

const FACTORS = [
  {
    id: 'DINA',
    governs: 'நாள் பொருத்தம் — தம்பதியரின் உடல்நலம், ஆயுள் தொடர்பாகக் கருதப்படுவது.',
    rule: 'மணமகள் நட்சத்திரத்திலிருந்து மணமகன் நட்சத்திரம் வரை (இரண்டும் சேர்த்து) எண்ணி, '
      + 'ஒன்பது நிலைச் சுழற்சியில் பார்க்கப்படுகிறது: 2, 4, 6, 8, 9-ஆம் நிலை நன்று; 3, 5, 7 ஆகாது. '
      + 'முதல் சுழற்சிக்குப் பின் (10–27) 22-ஆம் எண் தள்ளப்படுகிறது; 27-ஆம் எண் ஒரே ராசியாக '
      + 'இருந்தால் மட்டுமே. ஒரே நட்சத்திரமெனில் அந்த நட்சத்திரமே தரத்தைத் தீர்மானிக்கும்.',
    why: (m, ok) => {
      const verdict = ok ? 'பொருந்துகிறது' : 'பொருந்தவில்லை';
      switch (m.basis) {
        case 'SAME_STAR': {
          const grade = { excellent: 'உத்தமம்', neutral: 'மத்திமம்', unsuitable: 'ஆகாது' }[m.grade];
          return `இருவருக்கும் ஒரே நட்சத்திரம் — நூலில் இந்த நட்சத்திரத்தின் தரம்: ${grade}; எனவே ${verdict}.`;
        }
        case 'FIRST_CYCLE':
          return `எண்ணிக்கை ${m.count} — முதல் சுழற்சியில் ${m.position}-ஆம் நிலை. நன்று: 2, 4, 6, 8, 9 · `
            + `ஆகாது: 3, 5, 7 — எனவே ${verdict}.`;
        case 'SECOND_CYCLE':
          return `எண்ணிக்கை ${m.count} — இரண்டாம் சுழற்சி. நூல் இதை முழுமையாகத் தள்ளுவதில்லை `
            + '(3, 5, 7-ஆம் நிலைகளின் குறிப்பிட்ட பாதங்கள் மட்டும் ஆகாது — பாதம் இங்கே '
            + `கணக்கிடப்படவில்லை); எனவே ${verdict}.`;
        case 'THIRD_CYCLE':
          return `எண்ணிக்கை ${m.count} — மூன்றாம் சுழற்சி; நூலின்படி இது தீங்கு தருவதில்லை; எனவே ${verdict}.`;
        case 'VAINASIKA':
          return `எண்ணிக்கை ${m.count} — 22-ஆம் நட்சத்திரம் (வத-வைநாசிகை); நூல் இதைத் தவிர்க்கச் சொல்கிறது.`;
        case 'TWENTY_SEVENTH':
          return `எண்ணிக்கை 27 — ${m.sameSign
            ? 'இரு நட்சத்திரமும் ஒரே ராசியில் உள்ளன, எனவே தீங்கு குறைகிறது'
            : 'வெவ்வேறு ராசிகள் என்பதால் நூல் இதைத் தீங்கு என்கிறது'}; எனவே ${verdict}.`;
        default:
          return `எண்ணிக்கை ${m.count}; ${verdict}.`;
      }
    },
    divergence: 'இரண்டாம் சுழற்சியில் 3, 5, 7-ஆம் நட்சத்திரங்களின் குறிப்பிட்ட பாதங்கள் ஆகாது என்பதும், '
      + 'நூலில் பெயரிடப்பட்ட சில நட்சத்திர ஜோடி விதிவிலக்குகளும் இங்கே சேர்க்கப்படவில்லை '
      + '(பாதம் இங்குள்ள கணக்கில் இல்லை). அவை பொருந்துவனவாகவே கொள்ளப்படுகின்றன.',
  },
  {
    id: 'GANA',
    governs: 'குணப் பொருத்தம் — தேவர் / மனிதர் / இராட்சதர் என்ற மூன்று இயல்புப் பிரிவுகள்.',
    rule: 'இரு கணமும் ஒன்றெனில் உத்தமம்; தேவர்–மனிதர் சேர்க்கை மத்திமம் (பொருந்தும்); '
      + 'இராட்சத கணம் வேறு கணத்துடன் சேரின் பொருந்தாது.',
    why: (m, ok) => `பெண் ${m.girl} கணம், ஆண் ${m.boy} கணம் — `
      + `${m.same ? 'இரண்டும் ஒன்றே' : 'வெவ்வேறு'}, எனவே ${ok ? 'பொருந்துகிறது' : 'பொருந்தவில்லை'}.`,
    divergence: 'அச்சிட்ட கலாப்பிரகாசிகை மனித கணத்தில் ஐந்து நட்சத்திரங்களை மட்டுமே பட்டியலிடுகிறது; '
      + 'உத்திரம், பூராடம், உத்திராடம், பூரட்டாதி ஆகியவை மனித கணம் என்பது எஞ்சிய 27−9−9 என்ற '
      + 'கணக்கால் பெறப்பட்டது (சூடாமணியும் அவ்வாறே கூறுகிறது). தேவர்–மனிதர் சேர்க்கை இரு '
      + 'திசையிலும் ஒரே முடிவு. இராட்சத கணத்தின் "14-க்கு அப்பால்" விதிவிலக்கு சேர்க்கப்படவில்லை.',
  },
  {
    id: 'MAHENDRA',
    governs: 'மகேந்திரப் பொருத்தம் — சந்ததி, வளம் தொடர்பாகக் கருதப்படுவது.',
    rule: 'மணமகள் நட்சத்திரத்திலிருந்து மணமகன் நட்சத்திரம் வரையிலான எண்ணிக்கை '
      + `${list([4, 7, 10, 13, 16, 19, 22, 25])} இவற்றுள் ஒன்றாக இருக்க வேண்டும்.`,
    why: (m, ok) => `எண்ணிக்கை ${m.count} — ஏற்கப்படும் எண்கள் ${list(m.accepted)}; `
      + `${m.count} அவற்றுள் ${ok ? 'உள்ளது' : 'இல்லை'}.`,
    divergence: 'தினம், மகேந்திரம், ஸ்திரீ தீர்க்கம் — இம்மூன்றும் ஒரே அளவீட்டை '
      + '(பெண்ணிலிருந்து ஆணுக்கான நட்சத்திர எண்ணிக்கை) வெவ்வேறு வகையில் சோதிக்கின்றன. '
      + 'எனவே இவை ஒன்றுக்கொன்று சாராதவை அல்ல.',
  },
  {
    id: 'STREE_DEERGHA',
    governs: 'ஸ்திரீ தீர்க்கம் — மணமகளின் நலனும் ஆயுளும் தொடர்பாகக் கருதப்படுவது.',
    rule: 'மணமகள் நட்சத்திரத்திலிருந்து மணமகன் நட்சத்திரம் வரையிலான எண்ணிக்கை '
      + '13 அல்லது அதற்கு மேல் இருக்க வேண்டும்.',
    why: (m, ok) => `எண்ணிக்கை ${m.count} — தேவையான குறைந்தபட்சம் ${m.minimum}; `
      + `${ok ? 'நிறைவேறுகிறது' : 'நிறைவேறவில்லை'}.`,
    divergence: 'கலாப்பிரகாசிகை "13-க்கு அப்பால்" என்கிறது (இது 14 எனவும் பொருள்படலாம்); '
      + 'சூடாமணி "13 அல்லது அதற்கு மேல்" என்று தெளிவாகக் கூறுவதால் இங்கே 13 — இரண்டும் '
      + 'எண்ணிக்கை சரியாக 13 ஆக இருக்கும்போது மட்டுமே வேறுபடும். "7 போதும்" என்பது நூல் '
      + 'குறிப்பிடும் சிறுபான்மைக் கருத்து. உத்தமம் / மத்திமம் என்ற படிநிலைப் பிரிவு இல்லை.',
  },
  {
    id: 'YONI',
    governs: 'யோனிப் பொருத்தம் — தம்பதியரின் உடல் ஒத்திசைவு, நட்சத்திரத்திற்குரிய '
      + 'விலங்குக் குறியீட்டின் அடிப்படையில்.',
    rule: 'ஒவ்வொரு நட்சத்திரத்துக்கும் ஒரு விலங்கு (13 வகை). ஒரே யோனி நன்று; வேறு யோனி '
      + 'நடுநிலை (பொருந்தும்); பகை யோனிகள் விலக்கப்பட வேண்டும்.',
    why: (m, ok) => `பெண் ${m.girl}, ஆண் ${m.boy} — `
      + `${m.same ? 'ஒரே யோனி' : m.hostile ? 'பகை யோனிகள்' : 'வேறு யோனி, பகை இல்லை'}; `
      + `எனவே ${ok ? 'பொருந்துகிறது' : 'பொருந்தவில்லை'}.`,
    divergence: 'நூல் அச்சிட்ட பகை ஜோடிகளிலேயே முரண்பாடுகள் உள்ளன: "பாம்பு–எலி" மற்றும் '
      + '"பாம்பு–கீரி" (கீரி எந்த நட்சத்திரத்துக்கும் இல்லை, எனவே அது ஒருபோதும் பொருந்தாது), '
      + 'யானைக்குப் பகை "மான்" (பரவலான முறையில் சிங்கம்), சிங்கத்துக்குப் பகை பட்டியலில் இல்லை. '
      + 'அச்சிட்டபடியே செயல்படுத்தப்பட்டுள்ளது.',
  },
  {
    id: 'RASI',
    governs: 'ராசிப் பொருத்தம் — மனப் பொருத்தமும் குடும்ப ஒற்றுமையும்.',
    rule: 'மணமகள் ராசியிலிருந்து மணமகன் ராசிக்கான இடைவெளி 7 முதல் 12 வரை இருந்தால் நன்று; '
      + '2 முதல் 6 வரை ஆகாது. (1 = ஒரே ராசி: கலாப்பிரகாசிகை இதைச் சொல்லவில்லை; சூடாமணியின் '
      + '"7-க்குக் குறையில் ஆகாது" படி ஏற்கப்படாது.)',
    why: (m, ok) => `இடைவெளி ${m.gap} — குறைந்தபட்சம் ${m.minimum}; `
      + `${ok ? 'பொருந்துகிறது' : 'பொருந்தவில்லை'}.`,
    divergence: 'நூலின் மூன்று விதிவிலக்குகள் சேர்க்கப்படவில்லை: இரட்டைப்படை ராசியில் 2-ஆம் இடம், '
      + 'ஆறாம் இடத்தில் சில ராசி ஜோடிகள், மற்றும் இரு ராசிநாதரும் ஒருவர்/நண்பர்/நேரெதிர் ராசி எனில் '
      + 'ரஜ்ஜு, வேதை, கணம், ராசி தோஷங்களைக் கருதாமை.',
  },
  {
    id: 'RASI_ADHIPATHI',
    governs: 'ராசி அதிபதிப் பொருத்தம் — இரு ராசிநாதர்களுக்கிடையிலான உறவு.',
    rule: 'இரு ராசிநாதரும் வெவ்வேறு கிரகங்களாக இருப்பின் பொருந்தும்.',
    why: (m, ok) => `பெண் ராசிநாதன் ${m.girl}, ஆண் ராசிநாதன் ${m.boy} — `
      + `${m.same ? 'இருவரும் ஒரே கிரகம்' : 'வெவ்வேறு கிரகங்கள்'}, `
      + `எனவே ${ok ? 'பொருந்துகிறது' : 'பொருந்தவில்லை'}.`,
    divergence: 'இந்தக் காரணிக்கு ஆதாரம் இல்லை. கலாப்பிரகாசிகை ஒவ்வொரு கிரகத்தின் நண்பர்களைச் '
      + 'சொல்கிறது, ஆனால் இந்தப் பொருத்தத்துக்கு இரு அதிபதிகள் எப்படி இருக்க வேண்டும் என்ற '
      + 'விதியைச் சொல்லவில்லை. சூடாமணி ராசிவாரியான நட்பு அட்டவணையைத் தருகிறது; அது '
      + 'கலாப்பிரகாசிகையின் நட்புப் பட்டியலுடன் ஒத்துப்போகவும் இல்லை. எனவே முந்தைய '
      + 'எளிய சோதனையே தொடர்கிறது: ஒரே ராசிநாதன் அமையும் ஜோடி இங்கே தவறுகிறது.',
  },
  {
    id: 'VASYA',
    governs: 'வசியப் பொருத்தம் — ஒருவர் மற்றவரிடம் கொள்ளும் ஈர்ப்பு.',
    rule: 'ஒரு ராசியின் வசிய அட்டவணையில் மற்ற ராசி இடம்பெற்றிருந்தால் — எந்தத் திசையிலும் '
      + '("அல்லது எதிர்த்திசையிலும்" என்று நூலே கூறுகிறது) — பொருந்தும்.',
    why: (m, ok) => {
      if (!ok) return 'இரு ராசியின் வசிய அட்டவணையிலும் மற்றது இடம்பெறவில்லை.';
      const dir = m.girlControlsBoy && m.boyControlsGirl ? 'இருதிசையிலும்'
        : m.girlControlsBoy ? 'பெண் ராசியின் அட்டவணையில் ஆண் ராசி'
          : 'ஆண் ராசியின் அட்டவணையில் பெண் ராசி';
      return `${dir} இடம்பெறுகிறது, எனவே பொருந்துகிறது.`;
    },
    divergence: 'எந்தத் திசையில் ராசி இடம்பெற்றது என்பது பதிவாகிறது, ஆனால் நூல் இரு திசையையும் ஏற்பதால் முடிவை மாற்றுவதில்லை.',
  },
  {
    id: 'RAJJU',
    governs: 'ரஜ்ஜுப் பொருத்தம் — தாம்பத்திய நீடிப்புக்கு மிக முக்கியமானதாகக் '
      + 'கருதப்படுவது. நட்சத்திரங்கள் கால் / இடுப்பு / வயிறு / கழுத்து / தலை என '
      + 'ஐந்து குழுக்களாகப் பிரிக்கப்படுகின்றன.',
    rule: 'இருவரின் ரஜ்ஜுக் குழு வேறுபட்டிருக்க வேண்டும்.',
    why: (m, ok) => `பெண் ${m.girl} ரஜ்ஜு, ஆண் ${m.boy} ரஜ்ஜு — `
      + `${m.same ? 'ஒரே குழு' : 'வெவ்வேறு குழு'}, `
      + `எனவே ${ok ? 'பொருந்துகிறது' : 'பொருந்தவில்லை'}.`,
    divergence: 'இரு நூல்களும் ஒவ்வொரு பிரிவுக்கும் தனி விளைவைச் சொல்கின்றன, ஆனால் ஒன்றுக்கொன்று '
      + 'முரண்படுகின்றன (கழுத்து: கலாப்பிரகாசிகை "பெண் மரணம்", சூடாமணி "கணவன் மரணம்"; தலை: '
      + 'நேர்மாறு). இந்தக் கணிப்பு "ஒரே பிரிவெனில் ஆகாது" என்ற பொது விதியை மட்டுமே பயன்படுத்துகிறது; '
      + 'விளைவுகள் காட்டப்படுவதில்லை.',
  },
  {
    id: 'VEDHA',
    governs: 'வேதைப் பொருத்தம் — ஒன்றையொன்று பாதிக்கும் நட்சத்திர ஜோடிகள்.',
    rule: 'இரு நட்சத்திரமும் ஒரே வேதைத் தொகுப்பில் இல்லாதிருக்க வேண்டும்.',
    why: (m) => (m.present
      ? 'இவ்விரு நட்சத்திரமும் ஒரே வேதைத் தொகுப்பில் உள்ளன, எனவே பொருந்தவில்லை.'
      : 'இவ்விரு நட்சத்திரமும் ஒரே வேதைத் தொகுப்பில் இல்லை, எனவே பொருந்துகிறது.'),
    divergence: 'நூல் 12 ஜோடிகளையும் மிருகசீரிடம்–சித்திரை–அவிட்டம் மூவரையும் தருகிறது — 27 '
      + 'நட்சத்திரங்களும் ஒரு தொகுப்பில் உள்ளன. சூடாமணியின் பட்டியல் இதிலிருந்து வேறு.',
  },
];

const BY_ID = new Map(FACTORS.map((f) => [f.id, f]));

/**
 * Attaches the explanation and the source comparison to each row from
 * `calcPorutham`.
 *
 * Throws on an unknown id rather than silently emitting a row with no
 * explanation — a factor shown without one is the defect this module exists to
 * remove.
 */
function describePorutham(rows) {
  return rows.map((row) => {
    const factor = BY_ID.get(row.id);
    if (!factor) {
      throw new Error(`no factor description for porutham row "${row.id ?? row.name}"`);
    }
    const comparison = SOURCE_COMPARISON[row.id];
    if (!comparison) {
      throw new Error(`no source comparison for porutham row "${row.id}"`);
    }
    return {
      ...row,
      governs: factor.governs,
      rule: factor.rule,
      why: factor.why(row.measure, row.result),
      divergence: factor.divergence ?? null,
      sourceStatus: sourceStatusOf(comparison),
      sourceComparison: comparison,
    };
  });
}

/**
 * The same ten factors as VJ-006 RuleEvidence, for the evidence panel and for
 * citing a match into a consultation record.
 *
 * Nine carry evidence that is actually *applied*: the rule was read from the
 * printed page of Kalaprakasika and reproduces on every input. The tenth,
 * Rasi Adhipathi, stays withheld — the book states no rule for it — and says so.
 *
 * `appliedTo` carries the measurement either way, so the record shows what was
 * computed even where its rule is not backed.
 */
function poruthamEvidence(rows) {
  return rows.map((row) => {
    const factor = BY_ID.get(row.id);
    const comparison = SOURCE_COMPARISON[row.id];
    if (!factor || !comparison) {
      throw new Error(`no factor description for porutham row "${row.id ?? row.name}"`);
    }
    const appliedTo = { measure: row.measure, computedResult: row.result };
    const status = sourceStatusOf(comparison);

    if (status === 'NOT_SOURCED') {
      return withheldEvidence({
        ruleId: `PORUTHAM_${row.id}`,
        name: row.name,
        reason: `${factor.divergence} · ${UNVERIFIED}`,
        appliedTo,
      });
    }

    const s = comparison.sudamani;
    const crossCheck = s.status === 'MATCHES'
      ? `சூடாமணி (செய்யுள் ${s.verses}, அச்சுப் பக்கம் ${s.printedPage}) இதனுடன் ஒத்துப்போகிறது.`
      : `சூடாமணி (செய்யுள் ${s.verses}, அச்சுப் பக்கம் ${s.printedPage}) வேறுபடுகிறது: ${s.summary}`;

    return createRuleEvidence({
      ruleId: `PORUTHAM_${row.id}`,
      name: row.name,
      outcome: { passed: row.result, measure: row.measure },
      source: {
        ...KALAPRAKASIKA,
        pageLocus: `அச்சுப் பக்கம் ${comparison.kalaprakasika.printedPages} `
          + '(PDF பக்கம் = அச்சுப் பக்கம் + 30); பக்கப் படத்திலிருந்து நேரடியாகச் சரிபார்க்கப்பட்டது',
        convention: factor.rule,
      },
      appliedTo,
      notes: crossCheck,
    });
  });
}

module.exports = {
  describePorutham, poruthamEvidence, sourceStatusOf,
  FACTORS, SOURCE_COMPARISON, KALAPRAKASIKA, UNVERIFIED,
};
