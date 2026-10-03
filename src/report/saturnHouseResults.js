/**
 * What Pulippani's book says Saturn does in the 4th, 7th and 8th from the Moon —
 * Ardhashtama (Dhaiya), Kantaka and Ashtama — in its three separate passages.
 *
 *   main          "Transit results of Saturn", printed pp.168-170: one long
 *                 paragraph per house. (The scan lacks printed pp.148-167, so
 *                 the same chapter's 1st-3rd houses are not available.)
 *   sundarananda  Part Three, *Sundarananda Jyotisha Kavya*, printed pp.173-174:
 *                 two readings per house, the first for the waxing Moon and the
 *                 second — by the pattern the 6th house shows — for the waning
 *                 Moon. The print says "waxing" for both in every house but the
 *                 6th; that is recorded. *Which* fortnight is meant the book
 *                 does say, on printed p.86 and in its preface: Sundarananda
 *                 gives transit results "separately during Shukla Paksha and
 *                 Krishna Paksha" — the fortnight running at the time, as the
 *                 Sun's section ("Poorva Paksha ... Amara [Apara] Pakshas")
 *                 and the Moon's ("when Moon is in Krishna Paksha") show. So the
 *                 reading alternates every fortnight through a Saturn stay;
 *                 `pakshaAt` says which fortnight it is now and when it turns.
 *   paryaya       "Saturn's cyclic effects — Sani Paryaya Phala", printed
 *                 pp.231-234: a text for each house in Saturn's 1st, 2nd and 3rd
 *                 round "through the 12 places from Janma Rasi". How a round is
 *                 counted the book shows in its Jupiter example (printed p.236):
 *                 Jupiter "in Gemini during his 1st round" at birth — "when he
 *                 passes through Taurus, the paryaya will end". A round starts
 *                 in the planet's sign at birth and ends with the sign before
 *                 it, so each round holds exactly one passage through every
 *                 house: a period's round is the number of times Saturn has
 *                 passed through that house since birth (a passage under way at
 *                 birth is the first). The test checks the two counts agree.
 *                 The Saturn passage itself gives no example; the method is the
 *                 book's, applied from Jupiter to Saturn.
 *
 * The texts are condensed into Tamil, not translated sentence by sentence: the
 * book is in copyright. They are the book's statements, not predictions, and
 * the page says so. Where the book adds "if the life span is ending and a
 * maraka dasa runs", that condition is kept, because without it the sentence
 * says something the book does not.
 */

const { SOURCES } = require('./saturnTransitTables');
const { planetLongitude } = require('../ephemeris/siderealPositions');

const { PULIPPANI } = SOURCES;

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object') deepFreeze(v); });
  return Object.freeze(o);
};

const HOUSE_RESULTS = deepFreeze({
  4: {
    namesTa: 'அர்த்தாஷ்டமச் சனி அல்லது கண்டகச் சனி (முதன்மை உரை); "லகு கல்யாணி" — மிகவும் தீயது (சுந்தரானந்தர் பகுதி)',
    main: {
      page: 'printed p.168 (PDF 161)',
      textTa: 'அரசால் தொல்லை; கால்நடை அழிவு; சேமிப்பு வீண் செலவில் கரைந்து வறுமை; உடைமைகளை விட்டு வீட்டையோ ஊரையோ விட்டு வெளியேற நேரலாம்; சொத்துகள் கைநழுவும்; மனைவியுடன் சண்டை, பிரிவு; பக்கவாதம், மூட்டுவலி போன்ற வாத நோய்கள், ஒரு கால் செயலிழக்கலாம்; நாய்க்கடி அல்லது கொம்புள்ள விலங்கால் தாக்குதல்; மனைவி அல்லது பெண் உறவினருக்கு நோய்; மதிப்பிழப்பு, அவமானம்; நல்ல இருப்பிடம் இன்மை; எதையோ அஞ்சும் மனம், செயல்படத் தயக்கம்; எதிரிகளால் தொல்லை. ஆயுள் முடியும் காலமும் மாரக தசையும் சேர்ந்தால் மரணமும் நேரலாம் என்கிறது.',
    },
    sundarananda: {
      page: 'printed p.173 (PDF 166)',
      waxingTa: 'மன வேதனை; தாயைப் பிரிந்திருத்தல்; வீட்டில் குடும்பச் சண்டை; வீண் செலவு, கவலை; மனைவிக்கு நோய்; முடிவில்லாத துன்பம்; வெளிநாட்டுப் பயணத்தில் பண இழப்பு.',
      waningTa: 'வாகன விபத்து அபாயம்; எருமையால் தாக்குதல்; தொழில் இழப்பு; நெல், பருத்தி விளைச்சல் குறைவு.',
    },
    paryaya: {
      1: { page: 'printed p.231 (PDF 224)', textTa: 'அர்த்தாஷ்டமம் என்றாலும் துன்பம் குறைவு; பலன் அஷ்டகவர்க்கப் பரல்களைப் பொறுத்தது. இது சுமார் 10 வயது வரை நிகழலாம் என்கிறது.' },
      2: { page: 'printed pp.232-233 (PDF 225-226)', textTa: 'பண வரவு, குழந்தைப் பேறு (குறிப்பாகப் பெண்ணுக்கு); வீட்டிலும் வெளியிலும் வசதி. ஆனால் மூத்த தந்தைவழி உறவினர் ஒருவர் மறையலாம்; பங்காளிகளிடையே சொத்துச் சண்டை.' },
      3: { page: 'printed p.234 (PDF 227)', textTa: 'சில உறவினர் மறையலாம்; முயற்சிகள் பயனற்றவை; வழக்கால் இழப்பு.' },
    },
  },
  7: {
    namesTa: 'கண்டகச் சனி — "4-ஐ விட மோசம்" (முதன்மை உரை)',
    main: {
      page: 'printed p.169 (PDF 162)',
      textTa: 'ஏதாவது ஒரு தொல்லை தொடரும்; விரும்பாத இடமாற்றம் அல்லது பதவி இறக்கம்; பயணத்தில் விபத்து; கால்நடை அழிவு; பணியாளர்கள் விலகுவர்; மதிப்பிழப்பு, அந்தஸ்து இழப்பு; சிலருக்குக் கடும் உடலுழைப்பால் பிழைப்பு; தலைவலி போன்ற உடல் நலக்குறைவு; நோக்கமற்ற பயணம்; பயமும் தயக்கமும்; ஒருவரின் மறைவுக்குத் துக்கம்; அசாதாரணப் பசி; இருப்பிடம் இன்மை; வெளிநாடு சென்று துன்பம். மாரக தசையும் ஆயுளும் சேர்ந்தால் மனைவியின் உயிருக்கு ஆபத்து என்கிறது.',
    },
    sundarananda: {
      page: 'printed p.174 (PDF 167)',
      waxingTa: 'பெண்களால் மன உளைச்சல்; தலைவலி; கட்டாயத்தின் பேரில் வெளிநாடு சென்று துன்பம்; பயணத்திலும் துன்பம்; மன அழுத்தம்.',
      waningTa: 'மனைவியால் மனக்கவலை; உணவுப் பற்றாக்குறை; கருப்பு நிறப் பொருள் வியாபாரத்தில் இழப்பு.',
    },
    paryaya: {
      1: { page: 'printed p.231 (PDF 224)', textTa: 'தனக்கோ உடன்பிறந்தோருக்கோ நோய்; 6, 7-ஆம் இடங்களில் மனக்கவலை, ஹிஸ்டீரியா போன்ற நிலை, விரும்பாத இடமாற்றம், தேவையற்ற பயம் — சனி 8-ஐக் கடக்கும் வரை தொடரும்.' },
      2: { page: 'printed p.233 (PDF 226)', textTa: 'பிரமுகர்களின் நட்பும் உதவியும்; நடுத்தர எதிர்காலம், நடுத்தர வசதி; பிள்ளைகளுக்குக் கெடுதல் அல்லது அவர்களைப் பற்றிய கவலை.' },
      3: { page: 'printed p.234 (PDF 227)', textTa: 'மனைவிக்குக் கெடுதல்; மனைவியின் மரணமும் நேரலாம் என்கிறது.' },
    },
  },
  8: {
    namesTa: 'அஷ்டம கண்டகச் சனி — "மரணத்துக்கு நிகரான துன்பம்"; "ஏழரைச் சனிக்கு அடுத்து மிகத் தீய இடம்" (முதன்மை உரை)',
    main: {
      page: 'printed pp.169-170 (PDF 162-163)',
      textTa: 'கடும் வயிற்றுவலி; பணப் பற்றாக்குறை, நிலையற்ற வாழ்க்கை, முயற்சிகள் தோல்வி; கால்நடை அழிவு; பிள்ளைகளுக்குக் கண் நோய் போன்ற நோய்கள்; நண்பர்களுக்கும் சிரமம்; அரசால் தொல்லை, சிறை போன்ற தடைகளுக்கு அச்சம்; மதிப்பு, பதவி இழப்பு, அவமானம்; மனைவியுடன் பகை; பல தடைகள்; வீண் செலவு; வழக்கு, அபராதம்; விரும்பாத இடமாற்றம், புதிய இடத்திலும் துன்பம்; பொய் சொல்லத் தயங்காமை; இழிவான வேலை; உணவுக்கும் சிரமம்; கெட்ட பெண் தொடர்பால் அவதூறு; வளர்ந்த பிள்ளைகளின் எதிர்ப்பு; சொல்லுக்கு மதிப்பின்மை. ஆயுளும் மாரக தசையும் சேர்ந்தால் உயிருக்கு ஆபத்து என்கிறது.',
    },
    sundarananda: {
      page: 'printed p.174 (PDF 167)',
      waxingTa: 'முயற்சிகள் தோல்வி; மகன்கள், நண்பர்களால் கவலை; வீண் செலவு; குடும்பத்தில் சண்டை.',
      waningTa: 'மூலநோய்; மூத்தோரின் பகை; மன நோய்; நோக்கமின்றி அலைதல்.',
    },
    paryaya: {
      1: { page: 'printed pp.231-232 (PDF 224-225)', textTa: '6, 7-ஆம் இடங்களின் மனக்கவலை சனி 8-ஐக் கடக்கும் வரை தொடரும்; முதல் சுற்றில் ஜன்ம ராசி முதல் 8 வரை பொதுவாக வறுமை என்கிறது.' },
      2: { page: 'printed p.233 (PDF 226)', textTa: 'பண வரவு.' },
      3: { page: 'printed p.234 (PDF 227)', textTa: 'நோய், உடல் துன்பம்.' },
    },
  },
});

const HOUSE_RESULTS_SOURCE = Object.freeze({
  ...PULIPPANI,
  pageLocus: 'printed pp.168-170 (PDF 161-163), "Transit Results of Saturn"; pp.173-174 (PDF 166-167), Part Three "Sundarananda Jyotisha Kavya"; pp.231-234 (PDF 224-227), "Saturn\'s Cyclic Effects Sani Paryaya Phala"',
});

const NOTES = deepFreeze({
  sundaranandaPrintTa: 'சுந்தரானந்தர் பகுதியில் ஒவ்வொரு இடத்துக்கும் இரண்டு பத்திகள்; 6-ஆம் இடம் தவிர எல்லாவற்றிலும் இரண்டுமே "வளர்பிறையில்" (waxing) என்று அச்சாகியுள்ளன — 6-ல் இரண்டாவது "தேய்பிறையில்" (waning). அதனால் இரண்டாவதைத் தேய்பிறை எனப் படிக்கிறோம். (3-ஆம் இடத் தலைப்பும் "1" என்று அச்சாகியுள்ளது.)',
  pakshaMeaningTa: 'எந்தப் பட்சம் என்பதை நூலே சொல்கிறது (அச்சுப் பக்கம் 86, முன்னுரை): சுந்தரானந்தர் கோசாரப் பலனை "வளர்பிறை, தேய்பிறை காலங்களில் தனித்தனியே" தருகிறார் — அதாவது அந்தக் கோசாரத்தின்போது நடக்கும் பட்சம் (பிறப்புப் பட்சம் அல்ல); சூரியப் பகுதியில் "பூர்வ பட்சம் ... அபர பட்சம்", சந்திரப் பகுதியில் "சந்திரன் கிருஷ்ண பட்சத்தில் இருக்கும்போது" என்று அதையே காட்டுகிறார். எனவே சனி ஒரு இடத்தில் இருக்கும் இரண்டரை ஆண்டிலும் இரண்டு பத்திகளும் ஒவ்வொரு பதினைந்து நாளுக்கு மாறி மாறிப் பொருந்தும்.',
  pakshaSourcePage: 'printed p.86 (PDF 97), Part Three introduction: "gives transit results separately during Shukla Paksha and Krishna Paksha"; preface (PDF 5); p.96 (PDF 107), Moon in the 6th',
  paryayaCountTa: 'சுற்று எண்ணும் முறையை நூல் குருவின் உதாரணத்தில் காட்டுகிறது (அச்சுப் பக்கம் 236): பிறக்கும்போது குரு மிதுனத்தில் — "ரிஷபத்தைக் கடக்கும்போது சுற்று முடியும்". அதாவது ஒரு சுற்று பிறப்பில் கிரகம் இருந்த ராசியில் தொடங்கி அதற்கு முந்தைய ராசியில் முடிகிறது; ஒவ்வொரு சுற்றிலும் ஒவ்வொரு இடமும் ஒரு முறை வரும். எனவே ஒரு காலத்தின் சுற்று = பிறந்தது முதல் சனி அந்த இடத்தைக் கடப்பது எத்தனையாவது முறை. சனிப் பகுதியில் உதாரணம் இல்லை; குருவுக்குக் காட்டிய முறையே சனிக்கும் பொருத்தப்படுகிறது.',
  missingPagesTa: 'இந்த ஸ்கேனில் அச்சுப் பக்கங்கள் 148-167 இல்லை; அதனால் முதன்மை உரையில் சனி 1, 2, 3-ஆம் இடங்களுக்கான பகுதி கிடைக்கவில்லை.',
  disagreeTa: 'ஒரே நூலின் பகுதிகளே வேறுபடுகின்றன: முதன்மை உரை 8-ஐ ஏழரைச் சனிக்கு அடுத்த மிகத் தீய இடம் என்கிறது; சுற்றுப் பலனில் இரண்டாம் சுற்றில் 8-ல் "பண வரவு" என்கிறது.',
});

/**
 * The texts for one house, with each lived period given its round.
 * @param house    4, 7 or 8
 * @param periods  that house's spans from birth, in order (as computeSaturnTransits returns them)
 */
function houseResultsFor(house, periods) {
  const r = HOUSE_RESULTS[house];
  if (!r) return null;
  return {
    house,
    namesTa: r.namesTa,
    main: { textTa: r.main.textTa, page: r.main.page },
    sundarananda: { waxingTa: r.sundarananda.waxingTa, waningTa: r.sundarananda.waningTa, page: r.sundarananda.page },
    periods: periods.map((p, i) => {
      const round = i + 1;
      const t = r.paryaya[round] ?? null;
      return { fromUtc: p.fromUtc, toUtc: p.toUtc, years: p.years, round, paryayaTa: t ? t.textTa : null, paryayaPage: t ? t.page : null };
    }),
    paryayaAll: Object.entries(r.paryaya).map(([round, t]) => ({ round: Number(round), textTa: t.textTa, page: t.page })),
  };
}

const DAY_MS = 86400000;
const elongation = (ms) => {
  const jd = ms / DAY_MS + 2440587.5;
  return (((planetLongitude(jd, 'Moon', 'Lahiri') - planetLongitude(jd, 'Sun', 'Lahiri')) % 360) + 360) % 360;
};

/**
 * The lunar fortnight at an instant, and when it turns. Shukla (waxing) while the
 * Moon is less than 180° ahead of the Sun; the tithi is each 12° of that. The
 * ayanamsha cancels out of the difference.
 */
function pakshaAt(atMs) {
  const e = elongation(atMs);
  const waxing = e < 180;
  const tithi = Math.floor(e / 12) + 1; // 1-30
  // Step to the next 0° or 180° crossing, then bisect to the minute.
  const half = (ms) => (elongation(ms) < 180 ? 0 : 1);
  const start = half(atMs);
  let lo = atMs; let hi = atMs;
  for (let i = 1; i <= 80; i += 1) {
    hi = atMs + i * 0.25 * DAY_MS;
    if (half(hi) !== start) break;
    lo = hi;
  }
  while (hi - lo > 60000) {
    const mid = (lo + hi) / 2;
    if (half(mid) === start) lo = mid; else hi = mid;
  }
  return {
    atUtc: new Date(atMs).toISOString(), waxing, tithi: waxing ? tithi : tithi - 15,
    nameTa: waxing ? 'வளர்பிறை (சுக்ல பட்சம்)' : 'தேய்பிறை (கிருஷ்ண பட்சம்)',
    turnsUtc: new Date(hi).toISOString(),
  };
}

module.exports = { HOUSE_RESULTS, HOUSE_RESULTS_SOURCE, NOTES, houseResultsFor, pakshaAt };
