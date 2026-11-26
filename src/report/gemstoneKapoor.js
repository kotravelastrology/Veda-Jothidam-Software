/**
 * Kapoor, *Remedial Measures in Astrology*, chapter V "Suitability of gemstones
 * according to Ascendants" (printed pp.78-99, PDF 74-95): for each gem, a
 * paragraph for each of the twelve Ascendants.
 *
 * Of the three books held, this is the one that explains most — each paragraph
 * gives the houses the planet rules, why that makes it good or bad for the
 * Ascendant (trine, maraka, friend or enemy of the Ascendant lord), the
 * condition under which the gem may be worn (often "only in its major period,
 * if it stands in its own sign in the 3rd"), what the book says the gem will
 * give, and which other gem to wear with it. So it is encoded in full here,
 * not reduced to his general rule.
 *
 * ## How a paragraph is encoded
 *
 *   lords   the houses Kapoor says the planet rules (checked against the real
 *           lordship in the test; two printed errors are recorded in `slip`)
 *   v       his verdict when no listed placement applies:
 *             LIFELONG     "for the whole of their life" / "always" / "protective charm"
 *             FAV          "will prove beneficial" / "can be worn"
 *             DASHA        "beneficial if worn in the major period of <planet>"
 *             IF_NEED      only in a stated circumstance (Cancer, ruby)
 *             ONLY_THESE   allowed only in the placements listed in `cases`
 *             NOT_ADVISED  "not advisable" / "should not" / "would not advise"
 *             AVOID        "avoid as far as possible"
 *             NEVER        "should never wear" / "never touch"
 *   cases   placements that change the verdict, tried in the book's order; the
 *           first that matches the chart applies:
 *             at        houses from the Ascendant where the planet stands
 *             own       and in its own sign
 *             exalted   and in its exaltation sign
 *             withPlanet / withAny   and in the same sign as that planet
 *             v         PERMIT (may be worn in its major period), DASHA (the book
 *                       says it will do good in its major period), FAV, NOT,
 *                       NEUTRALISES (worn to undo the bad placement), JUDGE (the
 *                       book's condition cannot be decided here), NARROWED (the
 *                       book allows it, then advises against it)
 *   dasha   the book says the good is "more pronounced" in the planet's major period
 *   must    the book's word "must": DASHA (in the major period) or AFFLICTED
 *   with    gems the book says to wear it together with (as the planet whose gem it is)
 *   page    the printed page the paragraph begins on
 *
 * The book's reasons (`reasons`), the results it names (`results`), books it
 * cites (`cites`) and conditions this software cannot judge (`notJudged`) are
 * codes; their Tamil is below. The Tamil sentence shown to the reader is built
 * from these fields, so it cannot say more than the encoding does.
 *
 * Tables are embedded (Next replaces `__dirname`); the second transcription is
 * `fixtures/gemstones/definitions.json` → `kapoor`.
 */

const { SOURCES } = require('./gemstoneTables');

const { KAPOOR } = SOURCES;

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object') deepFreeze(v); });
  return Object.freeze(o);
};

const K = (lords, v, page, x = {}) => ({ lords, v, page, ...x });

/** One array per planet, indexed by Ascendant (0 Aries … 11 Pisces), in the book's order. */
const KAPOOR_BY_GEM = deepFreeze({
  Sun: [ // RUBY, printed pp.78-81
    K([5], 'LIFELONG', 79, { dasha: true, reasons: ['TRINE', 'FRIEND'], results: ['INTELLIGENCE', 'SPIRITUAL', 'CHILDREN', 'FAME', 'GOVT'] }),
    K([4], 'DASHA', 79, { reasons: ['KENDRA', 'ENEMY'], results: ['PEACE', 'COMFORTS', 'EDUCATION', 'PROPERTY', 'MOTHER', 'VEHICLE'] }),
    K([3], 'NOT_ADVISED', 79, { cases: [{ at: [3], own: true, v: 'PERMIT' }] }),
    K([2], 'IF_NEED', 79, { dasha: true, with: ['Moon'], reasons: ['FRIEND', 'MARAKA'], notJudged: ['NEED_WEALTH_EYES'] }),
    K([1], 'LIFELONG', 79, { charm: true, must: 'AFFLICTED', reasons: ['LAGNA_LORD'], results: ['PROTECTION', 'HEALTH', 'LONGEVITY', 'PROFESSION', 'WEALTH', 'SPIRITUAL'] }),
    K([12], 'NEVER', 80, { cases: [{ at: [12], own: true, v: 'PERMIT' }], reasons: ['DUSTHANA'] }),
    K([11], 'DASHA', 80, { alwaysIf: 'AFFLICTED_LOSSES', reasons: ['ENEMY'], results: ['WEALTH'] }),
    K([10], 'FAV', 80, { dasha: true, reasons: ['FRIEND'], results: ['GOVT', 'HONOURS', 'PROFESSION', 'WEALTH'] }),
    K([9], 'FAV', 80, { dasha: true, with: ['Jupiter'], reasons: ['FRIEND'], slip: 'SAG_LORD_MARS', results: ['FORTUNE', 'FATHER'] }),
    K([8], 'NOT_ADVISED', 80, { cases: [{ at: [8], own: true, v: 'PERMIT' }], reasons: ['DUSTHANA'], cites: ['ASHTAMESH_EXEMPT'] }),
    K([7], 'NOT_ADVISED', 80, { evenOwn: true, reasons: ['MARAKA', 'ENEMY'] }),
    K([6], 'ONLY_THESE', 81, { cases: [{ at: [6], own: true, v: 'PERMIT' }], reasons: ['DUSTHANA'] }),
  ],
  Moon: [ // PEARL, printed pp.81-83
    K([4], 'FAV', 81, { dasha: true, with: ['Mars'], reasons: ['FRIEND'], results: ['PEACE', 'MOTHER', 'EDUCATION', 'PROPERTY'] }),
    K([3], 'NOT_ADVISED', 81, { cases: [{ at: [3], own: true, v: 'PERMIT' }], reasons: ['ENEMY'] }),
    K([2], 'AVOID', 81, { dashaAllowed: true, cases: [{ at: [12], exalted: true, v: 'PERMIT' }, { at: [11, 9], v: 'PERMIT' }], reasons: ['MARAKA'], notJudged: ['ILL_SHORT_LIFE'], cites: ['RAMAN'] }),
    K([1], 'LIFELONG', 82, { charm: true, reasons: ['LAGNA_LORD'], results: ['HEALTH', 'LONGEVITY', 'WEALTH', 'PROFESSION'] }),
    K([12], 'NOT_ADVISED', 82, { cases: [{ at: [12], own: true, v: 'PERMIT' }], reasons: ['DUSTHANA'] }),
    K([11], 'DASHA', 82, { results: ['WEALTH', 'FAME', 'CHILDREN'] }),
    K([10], 'FAV', 82, { dasha: true, reasons: ['NOT_FRIENDS'], results: ['PROFESSION', 'FAME', 'RESPECT', 'HONOURS', 'GOVT'] }),
    K([9], 'FAV', 82, { dasha: true, with: ['Mars'], results: ['FORTUNE', 'SUCCESS', 'FATHER', 'FAME'] }),
    K([8], 'NOT_ADVISED', 82, { cases: [{ at: [8], own: true, v: 'PERMIT' }], with: ['Jupiter'], reasons: ['DUSTHANA'] }),
    K([7], 'NOT_ADVISED', 83, { reasons: ['MARAKA'] }),
    K([6], 'ONLY_THESE', 83, { cases: [{ at: [6], own: true, v: 'PERMIT' }], reasons: ['DUSTHANA'] }),
    K([5], 'FAV', 83, { dasha: true, reasons: ['TRINE'], results: ['CHILDREN', 'INTELLIGENCE', 'EDUCATION', 'RESPECT', 'FAME', 'HONOURS', 'COMPETITION', 'LOVE', 'FORTUNE'] }),
  ],
  Mars: [ // RED CORAL, printed pp.83-86
    K([1, 8], 'LIFELONG', 83, { reasons: ['LAGNA_PREVAILS'], results: ['LONGEVITY', 'HEALTH', 'FAME', 'RESPECT', 'COMFORTS'] }),
    K([7, 12], 'AVOID', 84, { reasons: ['DUSTHANA', 'MARAKA'] }),
    K([6, 11], 'AVOID', 84, { cases: [{ at: [6, 11], own: true, v: 'PERMIT' }], reasons: ['ENEMY'] }),
    K([5, 10], 'LIFELONG', 84, { dasha: true, with: ['Moon'], reasons: ['YOGAKARAKA'], results: ['CHILDREN', 'INTELLIGENCE', 'RESPECT', 'FAME', 'GOVT', 'PROFESSION'] }),
    K([4, 9], 'FAV', 84, { dasha: true, with: ['Sun'], reasons: ['YOGAKARAKA'], results: ['PEACE', 'DOMESTIC', 'PROPERTY', 'WEALTH', 'SUCCESS', 'FORTUNE', 'PARENTS'] }),
    K([3, 8], 'AVOID', 84, { reasons: ['DUSTHANA'] }),
    K([2, 7], 'AVOID', 84, { cases: [{ at: [2, 7], own: true, v: 'PERMIT' }], reasons: ['MARAKA', 'NOT_FRIENDS'], notJudged: ['OLD_AGE_SHORT_LIFE'], cites: ['MARAKA_AVERSION'] }),
    K([1, 6], 'LIFELONG', 85, { reasons: ['LAGNA_PREVAILS'], results: ['LONGEVITY', 'HEALTH', 'FAME', 'RESPECT', 'COMFORTS'] }),
    K([5, 12], 'FAV', 85, { dasha: true, with: ['Jupiter'], reasons: ['TRINE'], results: ['CHILDREN', 'INTELLIGENCE', 'FAME', 'FORTUNE', 'COMPETITION'] }),
    K([4, 11], 'DASHA', 85, { results: ['MOTHER', 'DOMESTIC', 'PROPERTY', 'WEALTH'] }),
    K([3, 10], 'NOT_ADVISED', 85, { cases: [{ at: [10], own: true, v: 'DASHA' }, { at: [3], own: true, v: 'PERMIT' }], cites: ['RUCHAKA'], results: ['GOVT', 'WEALTH', 'PROFESSION'] }),
    K([2, 9], 'FAV', 85, { dasha: true, with: ['Jupiter'], reasons: ['WEALTH_FORTUNE'] }),
  ],
  Mercury: [ // EMERALD, printed pp.86-89
    K([3, 6], 'NOT_ADVISED', 86, { cases: [{ at: [3, 6], own: true, v: 'PERMIT' }], reasons: ['DUSTHANA'] }),
    K([2, 5], 'FAV', 87, { dasha: true, with: ['Venus'], reasons: ['TRINE', 'LIKE_YOGAKARAKA'], results: ['FAMILY', 'WEALTH', 'INTELLIGENCE', 'CHILDREN', 'FAME', 'FORTUNE', 'COMPETITION'] }),
    K([1, 4], 'LIFELONG', 87, { charm: true, dasha: true, reasons: ['LAGNA_LORD'], results: ['HEALTH', 'WEALTH', 'LONGEVITY', 'MOTHER', 'EDUCATION', 'PEACE', 'PROPERTY', 'VEHICLE', 'DOMESTIC'] }),
    K([3, 12], 'NOT_ADVISED', 87, { cases: [{ at: [3, 12], own: true, v: 'PERMIT' }], reasons: ['DUSTHANA'] }),
    K([2, 11], 'DASHA', 87, { outsideDashaIf: 'AFFLICTED', reasons: ['WEALTH_HOUSES'], notJudged: ['AFFLICTED'], results: ['FAMILY', 'WEALTH', 'FAME'] }),
    K([1, 10], 'LIFELONG', 87, { dasha: true, reasons: ['LAGNA_LORD'], results: ['HEALTH', 'LONGEVITY', 'PROFESSION', 'GOVT', 'RESPECT', 'HONOURS', 'FAME'] }),
    K([9, 12], 'FAV', 88, { dasha: true, with: ['Venus'], reasons: ['TRINE'] }),
    K([8, 11], 'ONLY_THESE', 88, { cases: [{ at: [11], own: true, v: 'DASHA' }, { at: [1, 2, 4, 5, 9], v: 'DASHA' }], reasons: ['ENEMY'], results: ['WEALTH'] }),
    K([7, 10], 'ONLY_THESE', 88, { cases: [{ at: [10], own: true, v: 'DASHA' }, { at: [1, 2, 4, 5, 9, 11], v: 'DASHA' }, { at: [6, 8, 12], v: 'NEUTRALISES' }], reasons: ['KENDRADHIPATI'], results: ['WEALTH', 'PROFESSION'] }),
    K([6, 9], 'FAV', 88, { dasha: true, with: ['Venus'], also: ['Saturn'], reasons: ['TRINE', 'FRIEND'], results: ['GAIN'] }),
    K([5, 8], 'DASHA', 88, { with: ['Venus'], also: ['Saturn'], reasons: ['TRINE'] }),
    K([4, 7], 'ONLY_THESE', 89, { cases: [{ at: [4], own: true, v: 'PERMIT' }, { at: [1, 2, 5, 9, 10, 11], v: 'PERMIT' }], reasons: ['KENDRADHIPATI', 'MARAKA'], notJudged: ['ILL_OLD_SHORT_LIFE'] }),
  ],
  Jupiter: [ // YELLOW SAPPHIRE, printed pp.89-93
    K([9, 12], 'FAV', 89, { dasha: true, with: ['Mars'], reasons: ['TRINE'], results: ['KNOWLEDGE', 'INTELLIGENCE', 'WEALTH', 'FAME', 'FORTUNE', 'FATHER'] }),
    K([8, 11], 'ONLY_THESE', 90, { cases: [{ at: [1, 2, 4, 5, 9, 11], v: 'DASHA' }], reasons: ['NOT_AUSPICIOUS', 'ENEMY'] }),
    K([7, 10], 'ONLY_THESE', 90, { cases: [{ at: [1, 2, 4, 5, 9, 10, 11], v: 'DASHA' }], reasons: ['KENDRADHIPATI', 'MARAKA'], notJudged: ['ILL_OLD_SHORT_LIFE'], note: 'TENTH_OWN_SUCCESS' }),
    K([6, 9], 'FAV', 90, { dasha: true, with: ['Mars', 'Moon'], reasons: ['TRINE'], results: ['CHILDREN', 'KNOWLEDGE', 'RELIGION', 'FORTUNE', 'FAME', 'WEALTH', 'FATHER'] }),
    K([5, 8], 'FAV', 90, { dasha: true, with: ['Mars', 'Sun'], reasons: ['TRINE'], results: ['INTELLIGENCE', 'CHILDREN', 'FAME', 'COMPETITION'] }),
    K([4, 7], 'ONLY_THESE', 91, { cases: [{ at: [1, 2, 4, 5, 7, 9, 10, 11], v: 'DASHA' }], reasons: ['MARAKA'], notJudged: ['ILL_OLD_SHORT_LIFE'], results: ['CHILDREN', 'WEALTH', 'FAME'] }),
    K([3, 6], 'NOT_ADVISED', 91, { cases: [{ at: [3, 6], own: true, v: 'PERMIT' }], reasons: ['DUSTHANA', 'ENEMY'], cites: ['BHAVARTH_RATNAKAR'] }),
    K([2, 5], 'FAV', 91, { dasha: true, reasons: ['TRINE', 'FRIEND'], results: ['WEALTH', 'CHILDREN', 'FAME', 'FORTUNE'] }),
    K([1, 4], 'LIFELONG', 92, { charm: true, with: ['Sun'], reasons: ['LAGNA_LORD'], results: ['HEALTH', 'LONGEVITY', 'WEALTH', 'EDUCATION', 'PEACE', 'DOMESTIC', 'PROPERTY', 'VEHICLE', 'PROFESSION'] }),
    K([3, 12], 'ONLY_THESE', 92, { cases: [{ at: [3, 12], own: true, v: 'PERMIT' }], reasons: ['DUSTHANA'], cites: ['UTTARA_KALAMRITA'] }),
    K([2, 12], 'DASHA', 92, { reasons: ['NOT_FRIENDS', 'MARAKA'], slip: 'AQU_JUP_12', results: ['CHILDREN', 'WEALTH', 'EDUCATION'] }),
    K([1, 10], 'FAV', 92, { with: ['Mars'], reasons: ['LAGNA_LORD'], results: ['HEALTH', 'LONGEVITY', 'FAME', 'GOVT', 'WEALTH', 'PROFESSION'] }),
  ],
  Venus: [ // DIAMOND, printed pp.93-95
    K([2, 7], 'ONLY_THESE', 93, { cases: [{ own: true, v: 'FAV' }, { exalted: true, v: 'FAV' }], reasons: ['MARAKA', 'NOT_FRIENDS'], notJudged: ['WELL_PLACED', 'SHORT_LIFE'], results: ['WEALTH', 'FAMILY', 'MARITAL', 'VEHICLE'] }),
    K([1, 6], 'LIFELONG', 93, { charm: true, dasha: true, with: ['Mercury'], reasons: ['LAGNA_PREVAILS'], results: ['HEALTH', 'LONGEVITY', 'OBSTACLES'] }),
    K([5, 12], 'DASHA', 93, { with: ['Mercury'], reasons: ['TRINE', 'FRIEND'], results: ['CHILDREN', 'INTELLIGENCE', 'FAME', 'FORTUNE', 'WEALTH', 'COMPETITION'] }),
    K([4, 11], 'DASHA', 94, { reasons: ['NOT_AUSPICIOUS', 'ENEMY'], cites: ['KAPOOR_VIEW_4_11'], results: ['WEALTH', 'EDUCATION', 'DOMESTIC', 'PROPERTY', 'VEHICLE'] }),
    K([3, 10], 'ONLY_THESE', 94, { cases: [{ at: [1, 2, 4, 5, 7, 9, 10, 11], v: 'DASHA' }], reasons: ['NOT_AUSPICIOUS'], results: ['PROFESSION', 'WEALTH', 'HONOURS'] }),
    K([2, 9], 'FAV', 94, { with: ['Mercury'], reasons: ['LIKE_YOGAKARAKA'], results: ['WEALTH', 'KNOWLEDGE', 'FORTUNE', 'SUCCESS'] }),
    K([1, 8], 'LIFELONG', 94, { charm: true, must: 'DASHA', reasons: ['LAGNA_PREVAILS'], results: ['HEALTH', 'LONGEVITY', 'FAME', 'SUCCESS', 'WEALTH'] }),
    K([7, 12], 'NOT_ADVISED', 94, { reasons: ['MARAKA', 'DUSTHANA'] }),
    K([6, 11], 'ONLY_THESE', 95, { cases: [{ at: [1, 2, 4, 5, 6, 7, 9, 11], v: 'DASHA' }], reasons: ['NOT_AUSPICIOUS', 'ENEMY'], results: ['WEALTH'] }),
    K([5, 10], 'FAV', 95, { must: 'DASHA', with: ['Saturn'], reasons: ['YOGAKARAKA'], results: ['EVERY_WAY'] }),
    K([4, 9], 'FAV', 95, { must: 'DASHA', with: ['Saturn'], reasons: ['YOGAKARAKA'], results: ['EVERY_WAY'] }),
    K([3, 8], 'NOT_ADVISED', 95, { reasons: ['DUSTHANA', 'ENEMY'] }),
  ],
  Saturn: [ // BLUE SAPPHIRE, printed pp.95-98
    K([10, 11], 'ONLY_THESE', 96, { cases: [{ at: [1, 2, 4, 5, 7, 9, 10], v: 'DASHA' }], reasons: ['NOT_AUSPICIOUS'], results: ['PROFESSION', 'WEALTH'] }),
    K([9], 'DASHA', 96, { with: ['Mercury'], reasons: ['TRINE'], slip: 'TAU_SAT_EMERALD' }),
    K([8, 9], 'NOT_ADVISED', 96, {
      cases: [
        { at: [6, 8, 12], v: 'NOT' }, { at: [9, 5], v: 'PERMIT' },
        { at: [10], withPlanet: 'Jupiter', v: 'PERMIT' }, { withAny: ['Venus', 'Mercury'], v: 'JUDGE' },
      ],
      note: 'GEMINI_SATURN_AMBIGUOUS', notJudged: ['BENEFICIAL_HOUSES'],
    }),
    K([7, 8], 'NEVER', 96, { reasons: ['MARAKA'] }),
    K([6, 7], 'NEVER', 97, { reasons: ['DUSTHANA', 'ENEMY'] }),
    K([5, 6], 'FAV', 97, { with: ['Mercury'], reasons: ['TRINE'] }),
    K([4, 5], 'FAV', 97, { with: ['Venus'], also: ['Mercury'], reasons: ['YOGAKARAKA', 'FRIEND'], results: ['DOMESTIC', 'PROPERTY', 'MOTHER', 'CHILDREN', 'INTELLIGENCE', 'FORTUNE', 'COMPETITION'] }),
    K([3, 4], 'ONLY_THESE', 97, { cases: [{ at: [3, 4], own: true, v: 'DASHA' }], reasons: ['NOT_AUSPICIOUS'] }),
    K([2, 3], 'NOT_ADVISED', 97, { cases: [{ at: [1], v: 'DASHA' }], reasons: ['MARAKA'], cites: ['BRIHAT_JATAKA'], notJudged: ['CHART_NOT_WEAK'] }),
    K([1, 2], 'LIFELONG', 98, { charm: true, with: ['Venus'], reasons: ['LAGNA_NEVER_MARAKA'], results: ['HEALTH', 'LONGEVITY', 'WEALTH', 'SUCCESS'] }),
    K([1, 12], 'LIFELONG', 98, { charm: true, with: ['Venus'], reasons: ['MOOLATRIKONA_LAGNA'], results: ['HEALTH', 'LONGEVITY', 'WEALTH', 'SUCCESS'] }),
    K([11, 12], 'ONLY_THESE', 98, { cases: [{ at: [1, 11], v: 'DASHA' }, { at: [2, 4, 5, 9], v: 'NARROWED' }], reasons: ['NOT_AUSPICIOUS'], results: ['WEALTH'] }),
  ],
});

const KAPOOR_SECTION = Object.freeze({
  ...KAPOOR,
  pageLocus: 'printed pp.78-99 (PDF 74-95), chapter V "Suitability of gemstones according to Ascendants": ruby pp.78-81, pearl pp.81-83, red coral pp.83-86, emerald pp.86-89, yellow sapphire pp.89-93, diamond pp.93-95, blue sapphire pp.95-98, gomedh and cat\'s eye p.99',
});

/** Kapoor's one rule for the gems of Rahu and Ketu together, printed p.99. */
const KAPOOR_NODES = deepFreeze({
  houses: [3, 6, 11],
  source: { ...KAPOOR, pageLocus: 'printed p.99 (PDF 95), "GOMEDH AND CAT\'S EYE"' },
  textTa: 'கோமேதகம் (ராகு), வைடூரியம் (கேது) — அவற்றின் தசையில், அவை 3, 6 அல்லது 11-ஆம் இடத்தில் இருந்தால், அல்லது ஒரு சுப பாவ அதிபதியுடன் (குறிப்பாகத் திரிகோண அதிபதி) அல்லது யோககாரகருடன் சேர்ந்திருந்தால் அணியலாம்.',
});

/** Verdict codes: Tamil and how each counts when the books are compared. */
const KAPOOR_VERDICTS = deepFreeze({
  LIFELONG: { ta: 'வாழ்நாள் முழுவதும் அணியலாம்', stance: 'FAV' },
  FAV: { ta: 'அணிவது நன்மை தரும்', stance: 'FAV' },
  DASHA: { ta: '{p} தசையில் அணிந்தால் நன்மை', stance: 'FAV' },
  IF_NEED: { ta: 'நூல் சொல்லும் தேவை இருந்தால் அணியலாம்', stance: 'COND' },
  ONLY_THESE: { ta: 'நூல் சொல்லும் நிலைகளில் மட்டுமே அனுமதி', stance: 'UNFAV' },
  NOT_ADVISED: { ta: 'அணிவது நல்லதல்ல', stance: 'UNFAV' },
  AVOID: { ta: 'முடிந்தவரை தவிர்க்க வேண்டும்', stance: 'UNFAV' },
  NEVER: { ta: 'ஒருபோதும் அணியக் கூடாது', stance: 'UNFAV' },
  // case verdicts
  PERMIT: { ta: '{p} தசையில் மட்டும் அணியலாம் (நூலின் அனுமதி)', stance: 'COND' },
  NOT: { ta: 'இந்த இடத்தில் இருந்தால் அணியக் கூடாது', stance: 'UNFAV' },
  NEUTRALISES: { ta: '{p} தசையில் அணிந்தால் அந்த நிலையின் தீய பலனை நீக்கும் என்கிறது', stance: 'FAV' },
  JUDGE: { ta: 'நூலின் நிபந்தனையை இங்கு தீர்மானிக்க முடியவில்லை', stance: 'COND' },
  NARROWED: { ta: 'நூல் முதலில் அனுமதித்து, பின் 11-ல் சொந்த ராசி அல்லது லக்னத்தில் இருக்கும்போது மட்டுமே என்று அறிவுறுத்துகிறது', stance: 'COND' },
});

const KAPOOR_REASONS_TA = Object.freeze({
  TRINE: 'திரிகோண அதிபதி', KENDRA: 'கேந்திர அதிபதி', FRIEND: 'லக்ன அதிபதியின் நண்பர்',
  ENEMY: 'லக்ன அதிபதியின் பகைவர்', NOT_FRIENDS: 'லக்ன அதிபதியுடன் நட்பில்லை', MARAKA: 'மாரக ஸ்தான அதிபதி',
  YOGAKARAKA: 'யோககாரகர்', LIKE_YOGAKARAKA: 'ஏறக்குறைய யோககாரகர்', KENDRADHIPATI: 'கேந்திராதிபத்திய தோஷம்',
  LAGNA_PREVAILS: 'லக்ன அதிபத்தியம் மற்ற அதிபத்தியத்தை மிஞ்சும்', DUSTHANA: 'அசுப பாவ அதிபதி',
  NOT_AUSPICIOUS: 'பராசரி விதிப்படி இந்த லக்னத்துக்குச் சுபர் அல்ல', LAGNA_LORD: 'லக்ன அதிபதி',
  WEALTH_HOUSES: 'இரண்டும் செல்வ பாவங்கள்', WEALTH_FORTUNE: 'செல்வ (2), பாக்கிய (9) பாவ அதிபதி',
  LAGNA_NEVER_MARAKA: 'லக்ன அதிபதி ஒருபோதும் மாரகம் செய்யமாட்டார்',
  MOOLATRIKONA_LAGNA: 'மூலத்திரிகோண ராசி லக்னத்தில் — லக்ன அதிபதியாகவே செயல்படுவார்',
});

const KAPOOR_RESULTS_TA = Object.freeze({
  INTELLIGENCE: 'அறிவுக் கூர்மை', SPIRITUAL: 'ஆன்மிக வலிமை', CHILDREN: 'மக்கட்பேறு', FAME: 'பெயர், புகழ்',
  GOVT: 'அரசு ஆதரவு', PEACE: 'மன அமைதி', COMFORTS: 'வசதிகள்', EDUCATION: 'கல்வி வெற்றி',
  PROPERTY: 'நிலம், வீடு', MOTHER: 'தாய் வழி மகிழ்ச்சி', VEHICLE: 'வாகனம்', PROTECTION: 'பகைவரிடமிருந்து பாதுகாப்பு',
  HEALTH: 'உடல் நலம்', LONGEVITY: 'நீண்ட ஆயுள்', PROFESSION: 'தொழில் வெற்றி, பதவி உயர்வு', WEALTH: 'செல்வம்',
  FORTUNE: 'பாக்கியம்', FATHER: 'தந்தையின் நலம்', HONOURS: 'கௌரவம்', FAMILY: 'குடும்ப ஒற்றுமை',
  COMPETITION: 'போட்டிகளில் வெற்றி', LOVE: 'காதல் விஷயங்களில் வெற்றி', RELIGION: 'சமய நூல்களில் ஈடுபாடு',
  KNOWLEDGE: 'கல்வி, ஞானம்', DOMESTIC: 'இல்லற மகிழ்ச்சி', PARENTS: 'பெற்றோரின் நலம்', SUCCESS: 'முயற்சிகளில் வெற்றி',
  OBSTACLES: 'தடைகள் நீங்குதல்', MARITAL: 'மண வாழ்க்கை மகிழ்ச்சி', RESPECT: 'மதிப்பு', GAIN: 'பெரும் ஆதாயம்',
  EVERY_WAY: 'எல்லா வகையிலும் நன்மை',
});

const KAPOOR_NOT_JUDGED_TA = Object.freeze({
  NEED_WEALTH_EYES: 'பண இழப்பு அல்லது கண் நோய் இருக்கிறதா',
  ILL_SHORT_LIFE: 'கடும் நோய் அல்லது குறுகிய ஆயுள் காட்டும் ஜாதகமா (அப்படியெனில் அணியக் கூடாது)',
  ILL_OLD_SHORT_LIFE: 'கடும் நோய், முதுமை அல்லது குறுகிய ஆயுள் காட்டும் ஜாதகமா (அப்படியெனில் அணியக் கூடாது)',
  OLD_AGE_SHORT_LIFE: 'அந்தத் தசை முதுமையில் வருகிறதா, ஜாதகம் குறுகிய ஆயுள் காட்டுகிறதா (இரண்டும் இல்லையெனில் மட்டும்)',
  SHORT_LIFE: 'ஜாதகம் நீண்ட ஆயுள் காட்டுகிறதா (இல்லையெனில் தவிர்க்க வேண்டும்)',
  AFFLICTED: 'கிரகம் பாதிக்கப்பட்டுள்ளதா / நல்ல நிலையில் இல்லையா',
  WELL_PLACED: '"வேறு வகையில் நல்ல நிலை" — நூல் வரையறுக்கவில்லை',
  CHART_NOT_WEAK: 'ஜாதகம் வேறு வகையில் பலவீனமில்லையா',
  BENEFICIAL_HOUSES: '"பிற சுப பாவங்கள்" எவை — நூல் வரையறுக்கவில்லை',
});

const KAPOOR_EXTRA_TA = Object.freeze({
  // cites
  ASHTAMESH_EXEMPT: 'சூரியன், சந்திரனுக்கு அஷ்டமாதிபத்திய தோஷம் இல்லை என்ற கருத்தைக் குறிப்பிட்டும், காபூர் அணிவதை அறிவுறுத்தவில்லை.',
  RAMAN: 'பி.வி. ராமன் (Hindu Predictive Astrology): மிதுன லக்னத்துக்குச் சந்திரன் மாரக அதிபதியாக இருந்தும் மரணம் தருவதில்லை.',
  MARAKA_AVERSION: 'காபூர்: லக்ன அதிபதிக்கு நண்பரல்லாத மாரக அதிபதிகளின் ரத்தினத்தைப் பொதுவாகப் பரிந்துரைப்பதில்லை.',
  RUCHAKA: 'பத்தில் சொந்த ராசியில் செவ்வாய் — ருசக யோகப் பலனும் கிடைக்கும் என்கிறது.',
  BHAVARTH_RATNAKAR: 'பாவார்த்த ரத்னாகரம்: 3, 6-ஆம் அதிபதியாக இருந்தும் குரு யோகம் தருபவர் — அதனால் காபூர் சொந்த ராசியில் இருந்தால் தசையில் அனுமதிக்கிறார்.',
  UTTARA_KALAMRITA: 'உத்தர காலாமிர்தம்: 3, 12-ஆம் அதிபதியாக இருந்தும் குரு யோகம் தருபவர் — பராசரி விதிக்கு எதிரானது என்று காபூர் இதை ஏற்கவில்லை.',
  BRIHAT_JATAKA: 'பிருஹஜ்ஜாதகம்: தனுசு, மீனம், கும்பம், மகரம், துலாம் லக்னத்தில் சனி இருந்தால் அரசனுக்கு நிகர் — அதனால் லக்னத்தில் சனி இருந்தால் தசையில் அணியலாம்.',
  KAPOOR_VIEW_4_11: 'பராசரி விதிப்படி சுபர் அல்ல; ஆனால் 4, 11-ஆம் பாவங்கள் அசுபமல்ல என்பது காபூரின் சொந்தக் கருத்து.',
  // notes
  TENTH_OWN_SUCCESS: 'பத்தில் சொந்த ராசியில் (ஹம்ச யோகம்) இருக்கும்போது அணிந்தால் தொழிலில் பெரும் வெற்றி, அரசு கௌரவம் என்கிறது.',
  GEMINI_SATURN_AMBIGUOUS: 'நூலே இதை "தெளிவற்ற நிலை" என்கிறது: 6, 8, 12-ல் இருந்தால் அணியக் கூடாது; 9 அல்லது 5-ல், அல்லது பிற சுப பாவங்களில் சுக்கிரன்/புதனுடன் இருந்தால் அணியலாம்; 10-ல் குருவுடன் இருந்தால் சனி தசையில் அணியலாம்; இல்லையெனில் "முதல்தர மாரகர்".',
  // other flags
  evenOwn: 'சொந்த ராசியில் இருந்தாலும் அணிவது நல்லதல்ல என்கிறது.',
  dashaAllowed: 'தசையில் அணியலாம் என்று சொல்லிவிட்டு, "முடிந்தவரை தவிர்ப்பது நல்லது" என்கிறது.',
  'alwaysIf:AFFLICTED_LOSSES': 'சூரியன் பாதிக்கப்பட்டு எல்லா முயற்சிகளிலும் இழப்பு இருந்தால் எப்போதும் அணியலாம் என்கிறது.',
  'outsideDashaIf:AFFLICTED': 'புதன் நல்ல நிலையில் இல்லையெனில் அல்லது பாதிக்கப்பட்டிருந்தால் தசைக்கு வெளியிலும் அணியலாம் என்கிறது.',
  'must:AFFLICTED': 'சூரியன் பாதிக்கப்பட்டுத் துன்பம் இருந்தால் இது "கட்டாயம்" என்கிறது.',
  'must:DASHA': '{p} தசையில் இது "கட்டாயம்" என்கிறது.',
  charm: 'பாதுகாப்புக் கவசம் என்கிறது.',
});

/** Printed errors in Kapoor's chapter, each confirmed on the page image. Recorded, not corrected. */
const KAPOOR_SLIPS = deepFreeze({
  SAG_LORD_MARS: { page: 80, ta: 'நூலில் தனுசு லக்ன அதிபதி "செவ்வாய்" என்று அச்சாகியுள்ளது; உண்மையில் குரு.' },
  AQU_JUP_12: { page: 92, ta: 'நூல் குருவை 2, 12-ஆம் அதிபதி, "இரண்டும் செல்வ பாவங்கள்" என்கிறது; கும்ப லக்னத்துக்குக் குரு 2, 11-ஆம் அதிபதி.' },
  TAU_SAT_EMERALD: { page: 96, ta: 'நூல் "லக்ன அதிபதியின் ரத்தினமான மரகதத்துடன்" என்கிறது; ரிஷப லக்ன அதிபதி சுக்கிரன், அவரது ரத்தினம் வைரம். மரகதம் புதனுடையது.' },
});

module.exports = {
  KAPOOR_BY_GEM, KAPOOR_SECTION, KAPOOR_NODES, KAPOOR_VERDICTS, KAPOOR_REASONS_TA, KAPOOR_RESULTS_TA,
  KAPOOR_NOT_JUDGED_TA, KAPOOR_EXTRA_TA, KAPOOR_SLIPS,
};
