/**
 * VJ-018 — what each porutham governs, how this engine decided it, and where
 * the rule is *not* yet backed by a verified source.
 *
 * `calcPorutham` answers "did it pass". A practitioner reading a match to a
 * family needs three more things: what the factor is taken to indicate, the
 * rule that produced this verdict, and how far that rule can be trusted. A
 * bare ✓ invites the reader to supply all three from memory.
 *
 * ## On sources
 *
 * None of the ten rule tables has a verified classical locator. They were
 * ported from the prior AstrologicLab matching screen, whose own note cites
 * only "the Marriage reference workbook" — not an edition, not a page. Under
 * PLAN-001 that is `sourceRequired`, so every factor here emits
 * `withheldEvidence`, and the UI shows the verdicts next to the statement that
 * the rule behind them is unverified.
 *
 * The verdicts themselves are not withheld: they are a real computation from a
 * real table, not a fabricated substitute. What must not happen is a reader
 * taking "our software says ✓" for "the classical text says ✓".
 *
 * ## On divergences
 *
 * `divergence` is only ever a fact about *this code*, read off the tables in
 * `tamilPorutham.js` — never a claim about what the tradition says, which is
 * exactly what is unverified. `test-tamil-porutham.js` asserts each one, so a
 * disclosure cannot quietly go stale when a table is edited.
 */

const { withheldEvidence } = require('../contracts/ruleEvidence');

const list = (a) => a.join(', ');

/**
 * The reason attached to every withheld factor. One string, because the gap is
 * one gap: the whole table came from an uncited workbook.
 */
const UNVERIFIED = 'விதி அட்டவணை முந்தைய AstrologicLab matching screen-லிருந்து '
  + 'port செய்யப்பட்டது; அதன் ஆதாரக் குறிப்பு "Marriage reference workbook" மட்டுமே — '
  + 'பதிப்போ பக்கமோ இல்லை. செம்மையான நூல் ஒப்பீடு நிலுவையில் உள்ளது.';

const FACTORS = [
  {
    id: 'DINA',
    governs: 'நாள் பொருத்தம் — தம்பதியரின் உடல்நலம், ஆயுள் தொடர்பாகக் கருதப்படுவது.',
    rule: 'மணமகள் நட்சத்திரத்திலிருந்து மணமகன் நட்சத்திரம் வரை எண்ணி, 9-ஆல் வகுத்த மீதி '
      + 'எடுக்கப்படுகிறது (மீதி 0 என்பது 9 எனக் கொள்ளப்படுகிறது).',
    why: (m, ok) => `எண்ணிக்கை ${m.count} · 9-ஆல் வகுத்த மீதி ${m.remainder} · `
      + `தள்ளுபடி மீதிகள் ${list(m.rejected)} — மீதி ${m.remainder} அவற்றுள் `
      + `${ok ? 'இல்லை, எனவே பொருந்துகிறது' : 'உள்ளது, எனவே பொருந்தவில்லை'}.`,
  },
  {
    id: 'GANA',
    governs: 'குணப் பொருத்தம் — தேவர் / மனிதர் / இராட்சதர் என்ற மூன்று இயல்புப் பிரிவுகள்.',
    rule: 'இரு கணமும் ஒன்றெனில் பொருந்தும்; தேவர்–மனிதர் சேர்க்கையும் பொருந்தும்; '
      + 'இராட்சத கணம் வேறு கணத்துடன் சேரின் பொருந்தாது.',
    why: (m, ok) => `பெண் ${m.girl} கணம், ஆண் ${m.boy} கணம் — `
      + `${m.same ? 'இரண்டும் ஒன்றே' : 'வெவ்வேறு'}, எனவே ${ok ? 'பொருந்துகிறது' : 'பொருந்தவில்லை'}.`,
    divergence: 'இந்த விதி இங்கே சமச்சீராகப் (symmetric) பயன்படுத்தப்படுகிறது — '
      + 'பெண் தேவர் / ஆண் மனிதர் என்பதும், அதன் எதிர்மறையும் ஒரே முடிவைத் தருகின்றன. '
      + 'ஆனால் இதே கோப்பின் குறிப்பே பொருத்தங்கள் சமச்சீரற்றவை என்கிறது.',
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
      + '7 அல்லது அதற்கு மேல் இருக்க வேண்டும்.',
    why: (m, ok) => `எண்ணிக்கை ${m.count} — தேவையான குறைந்தபட்சம் ${m.minimum}; `
      + `${ok ? 'நிறைவேறுகிறது' : 'நிறைவேறவில்லை'}.`,
    divergence: 'ஒரே வரம்பு (≥7) மட்டுமே பயன்படுகிறது — உத்தமம் / மத்திமம் என்ற '
      + 'படிநிலைப் பிரிவு இந்தக் கணிப்பில் இல்லை.',
  },
  {
    id: 'YONI',
    governs: 'யோனிப் பொருத்தம் — தம்பதியரின் உடல் ஒத்திசைவு, நட்சத்திரத்திற்குரிய '
      + 'விலங்குக் குறியீட்டின் அடிப்படையில்.',
    rule: 'இரு நட்சத்திரத்தின் யோனிக் குழு ஒன்றெனில், அல்லது குழு எண்கள் '
      + 'அடுத்தடுத்து இருப்பின், பொருந்தும்.',
    why: (m, ok) => `பெண் குழு ${m.girl}, ஆண் குழு ${m.boy} — இடைவெளி ${m.gap}; `
      + `${ok ? 'அனுமதிக்கப்பட்ட வரம்புக்குள்' : 'வரம்பைத் தாண்டுகிறது'}.`,
    divergence: 'இரண்டு முக்கியக் குறைபாடுகள்: (1) இந்த அட்டவணையில் 9 குழுக்கள் மட்டுமே '
      + 'உள்ளன — செம்மையாக அறியப்படும் 14 யோனி முறை அல்ல; (2) விலங்குப் பகை '
      + 'அட்டவணைக்குப் பதிலாக குழு எண்களின் அருகாமை (|இடைவெளி| ≤ 1) சோதிக்கப்படுகிறது. '
      + 'குழுக்களுக்கு விலங்குப் பெயர்களும் port-இல் கொண்டுவரப்படவில்லை.',
  },
  {
    id: 'RASI',
    governs: 'ராசிப் பொருத்தம் — மனப் பொருத்தமும் குடும்ப ஒற்றுமையும்.',
    rule: 'மணமகள் ராசியிலிருந்து மணமகன் ராசிக்கான இடைவெளி '
      + `${list([1, 2, 5, 6, 7, 11])} இவற்றுள் ஒன்றாக இருக்க வேண்டும் (1 = ஒரே ராசி).`,
    why: (m, ok) => `இடைவெளி ${m.gap} — ஏற்கப்படும் இடைவெளிகள் ${list(m.accepted)}; `
      + `${ok ? 'பொருந்துகிறது' : 'பொருந்தவில்லை'}.`,
  },
  {
    id: 'RASI_ADHIPATHI',
    governs: 'ராசி அதிபதிப் பொருத்தம் — இரு ராசிநாதர்களுக்கிடையிலான உறவு.',
    rule: 'இரு ராசிநாதரும் வெவ்வேறு கிரகங்களாக இருப்பின் பொருந்தும்.',
    why: (m, ok) => `பெண் ராசிநாதன் ${m.girl}, ஆண் ராசிநாதன் ${m.boy} — `
      + `${m.same ? 'இருவரும் ஒரே கிரகம்' : 'வெவ்வேறு கிரகங்கள்'}, `
      + `எனவே ${ok ? 'பொருந்துகிறது' : 'பொருந்தவில்லை'}.`,
    divergence: 'இது நட்பு / சமம் / பகை என்ற நைசர்கிக மைத்ரியைப் பார்ப்பதில்லை — '
      + 'கிரகங்கள் வேறுபட்டனவா என்பதை மட்டுமே சோதிக்கிறது. எனவே ஒரே ராசிநாதன் '
      + 'அமையும் ஜோடி இங்கே தவறுகிறது. இதே repo-வின் `extendedPorutham.js` '
      + 'வேறொரு காரணிக்கு நைசர்கிக மைத்ரியைப் பயன்படுத்துகிறது — இரண்டும் ஒரே '
      + 'அளவுகோலைப் பின்பற்றவில்லை.',
  },
  {
    id: 'VASYA',
    governs: 'வசியப் பொருத்தம் — ஒருவர் மற்றவரிடம் கொள்ளும் ஈர்ப்பு.',
    rule: 'ஒரு ராசியின் வசிய அட்டவணையில் மற்ற ராசி இடம்பெற்றிருந்தால் — '
      + 'எந்தத் திசையிலும் — பொருந்தும்.',
    why: (m, ok) => {
      if (!ok) return 'இரு ராசியின் வசிய அட்டவணையிலும் மற்றது இடம்பெறவில்லை.';
      const dir = m.girlControlsBoy && m.boyControlsGirl ? 'இருதிசையிலும்'
        : m.girlControlsBoy ? 'பெண் ராசியின் அட்டவணையில் ஆண் ராசி'
          : 'ஆண் ராசியின் அட்டவணையில் பெண் ராசி';
      return `${dir} இடம்பெறுகிறது, எனவே பொருந்துகிறது.`;
    },
    divergence: 'வசியம் செம்மையாகத் திசைசார்ந்தது (எந்த ராசி எதை வசப்படுத்துகிறது). '
      + 'இங்கே எந்தத் திசையிலும் பொருந்தினால் போதும் எனக் கொள்ளப்படுகிறது; '
      + 'திசை `measure`-இல் பதிவாகிறது, ஆனால் முடிவை மாற்றுவதில்லை.',
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
    divergence: 'ஐந்து ரஜ்ஜுக் குழுக்களும் இங்கே சமமாக நடத்தப்படுகின்றன — '
      + 'எந்தக் குழுவில் ஒத்துப்போகிறது என்பதற்கேற்ப வேறுபட்ட தீவிரம் '
      + 'இந்தக் கணிப்பில் இல்லை.',
  },
  {
    id: 'VEDHA',
    governs: 'வேதைப் பொருத்தம் — ஒன்றையொன்று பாதிக்கும் நட்சத்திர ஜோடிகள்.',
    rule: 'இரு நட்சத்திரமும் வேதை ஜோடியாக இல்லாதிருக்க வேண்டும்.',
    why: (m) => (m.present
      ? 'இவ்விரு நட்சத்திரமும் வேதை ஜோடி, எனவே பொருந்தவில்லை.'
      : 'இவ்விரு நட்சத்திரமும் வேதை ஜோடி அல்ல, எனவே பொருந்துகிறது.'),
    divergence: 'அட்டவணையில் 12 ஜோடிகள் (24 நட்சத்திரங்கள்) மட்டுமே உள்ளன. '
      + 'மூலம், திருவோணம், அவிட்டம் — இம்மூன்றுக்கும் ஜோடி இல்லை, எனவே இவை '
      + 'இக்கணிப்பில் ஒருபோதும் வேதையால் தவற முடியாது.',
  },
];

const BY_ID = new Map(FACTORS.map((f) => [f.id, f]));

/**
 * Attaches the explanation to each row from `calcPorutham`.
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
    return {
      ...row,
      governs: factor.governs,
      rule: factor.rule,
      why: factor.why(row.measure, row.result),
      divergence: factor.divergence ?? null,
      sourceStatus: 'SOURCE_REQUIRED',
    };
  });
}

/**
 * The same ten factors as VJ-006 RuleEvidence, for the evidence panel and for
 * citing a match into a consultation record.
 *
 * All ten are withheld. `appliedTo` still carries the measurement, so the
 * record shows what was computed and that its rule is unverified — a gap must
 * not read as a finding.
 */
function poruthamEvidence(rows) {
  return rows.map((row) => {
    const factor = BY_ID.get(row.id);
    if (!factor) {
      throw new Error(`no factor description for porutham row "${row.id ?? row.name}"`);
    }
    return withheldEvidence({
      ruleId: `PORUTHAM_${row.id}`,
      name: row.name,
      reason: factor.divergence ? `${UNVERIFIED} கூடுதல் வேறுபாடு: ${factor.divergence}` : UNVERIFIED,
      appliedTo: { measure: row.measure, computedResult: row.result },
    });
  });
}

module.exports = { describePorutham, poruthamEvidence, FACTORS, UNVERIFIED };
