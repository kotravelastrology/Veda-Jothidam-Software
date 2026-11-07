/**
 * What Pulippani's book says Saturn does in each house from the Moon, in its
 * three separate passages. The 4th, 7th and 8th (Ardhashtama/Dhaiya, Kantaka,
 * Ashtama) came first; the other nine houses were added on 2026-10-03.
 *
 *   main          "Transit results of Saturn", printed pp.168-172: one long
 *                 paragraph per house. (The scan lacks printed pp.148-167, so
 *                 the same chapter's 1st-3rd houses are not available.)
 *   sundarananda  Part Three, *Sundarananda Jyotisha Kavya*, printed pp.172-175:
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
 *                 it, so a period's round is 1 + the number of times Saturn has
 *                 come back into its birth sign before the period begins. That
 *                 is usually the n-th passage through the house, but not always:
 *                 if Saturn retrogrades out of its birth sign just after birth,
 *                 the brief stay in the sign before it falls in round 1, and so
 *                 does that sign's regular passage ~29 years later, which ends
 *                 the round. The book's definition is the one applied. The Saturn
 *                 passage itself gives no example; the method is the book's,
 *                 applied from Jupiter to Saturn.
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

const R3_GENERAL = 'நூல்: "முன்பு பொதுவாகச் சொன்ன சனியின் பலன் நடக்கும்" — அதாவது மேலே உள்ள முதன்மை உரை.';

const HOUSE_RESULTS = deepFreeze({
  1: {
    namesTa: 'ஜன்மச் சனி — ஏழரைச் சனியின் நடுக் கட்டம்',
    main: null,
    sundarananda: {
      page: 'printed p.172 (PDF 165)',
      waxingTa: 'பெரும் பண, பொருள் இழப்பு; தீ விபத்து, உணவு நஞ்சு, தொற்று அச்சம்; கட்டாயமாக வெளிநாடு சென்று துன்பம்; உறவினர் எதிர்ப்பு.',
      waningTa: 'வசதி, மகிழ்ச்சி; கருப்புப் பொருள் வியாபாரத்தில் லாபம்; மேற்கு நோக்கிய பயணம், அதனால் லாபம்.',
    },
    paryaya: {
      1: { page: 'printed p.231 (PDF 224)', textTa: 'குழந்தைப் பருவம் — குழந்தைக்கு இளம்பருவ நோய்கள். முதல் சுற்றில் ஜன்ம ராசி முதல் 8 வரை பொதுவாக வறுமை என்கிறது.' },
      2: { page: 'printed p.232 (PDF 225)', textTa: 'உடல் சுகம், எளிதான வாழ்க்கை; தொழில் முன்னேற்றம், கூட்டு, பிரமுகர் நட்பு; வருமான உயர்வு, பெயர், புகழ். உடன்பிறந்தோருடன் பகை, தந்தைவழிச் சொத்துப் பிரிவினை, உடன்பிறந்தோர் உயிருக்கு ஆபத்து.' },
      3: { page: 'printed p.233 (PDF 226)', textTa: 'சிறிது வசதி; எல்லா விஷயங்களிலும் குறைந்த முன்னேற்றம்.' },
    },
  },
  2: {
    namesTa: 'ஏழரைச் சனியின் கடைசிக் கட்டம் (சுந்தரானந்தர் பகுதிக் குறிப்பு)',
    main: null,
    sundarananda: {
      page: 'printed p.172 (PDF 165)',
      waxingTa: 'முதல் பாதியில் பூர்வீகச் சொத்து இழப்பு; முயற்சிகள் தோல்வி; குடும்பத்தில் சிரமம்; நோக்கமின்றி அலைதல்; மனக் கவலை.',
      waningTa: 'முதல் பாதியில் தன் சொல்லாலேயே சிக்கல்; பண, பொருள் இழப்பு; இரண்டாம் பாதியில் வசதி, மகிழ்ச்சி.',
      noteTa: 'நூலின் குறிப்பு: இதுவும் ஏழரைச் சனி — கடைசி இரண்டரை ஆண்டு; இரண்டாம் பாதியில் துன்பம் 25% அளவுக்கே; கடைசி இரண்டரை ஆண்டின் முடிவில் விடுதலை.',
    },
    paryaya: {
      1: { page: 'printed p.231 (PDF 224)', textTa: 'அதே பலன் — இளம்பருவ நோய்கள்.' },
      2: { page: 'printed p.232 (PDF 225)', textTa: 'உயர்தர வசதி, மகிழ்ச்சியான நாட்கள்.' },
      3: { page: 'printed p.233 (PDF 226)', textTa: 'நல்ல வசதி, மகிழ்ச்சி; பிறப்பில் சனி வர்க்கோத்தமமெனில் முதுமையிலும் நல்ல வருமானம்.' },
    },
  },
  3: {
    namesTa: 'நல்ல இடம் (3, 6, 11)',
    main: null,
    sundarananda: {
      page: 'printed p.173 (PDF 166)',
      waxingTa: 'புகழ்; மேற்கு நாடுகளுக்குப் பயண வாய்ப்பு, அதனால் லாபம்; உளுந்து, எள் போன்ற கருப்புத் தானிய வியாபாரத்தில் லாபம்; முயற்சிகள் வெற்றி.',
      waningTa: 'தைரியக் குறைவு; மேற்கு நாட்டுப் பயணச் செலவு; மூத்தோர், பிரமுகர்களின் பகை.',
    },
    paryaya: {
      1: { page: 'printed p.231 (PDF 224)', textTa: '3-ஆம் இடம் மிக நல்லது என்று சொல்லப்பட்டாலும் முதல் சுற்றில் பல சிரமங்கள்.' },
      2: { page: 'printed p.232 (PDF 225)', textTa: 'வருமான உயர்வு; வீட்டில் தேவைப் பொருட்கள் நிறைவு; கல்வி முன்னேற்றம், புகழ்; தாய்க்குச் சிறிது வருமானம் அல்லது தாயிடமிருந்து சிறிது வருமானம்.' },
      3: { page: 'printed p.233 (PDF 226)', textTa: 'உடன்பிறந்தோருக்குக் கெடுதல்; பிறப்பில் சனி சொந்த வீட்டிலோ 11-லோ இருந்தாலும் அதே.' },
    },
  },
  5: {
    namesTa: '',
    main: {
      page: 'printed p.168 (PDF 161)',
      textTa: 'பிள்ளைகளுக்கு நோய், கல்வி பாதிப்பு; பகுத்தறியும் திறன் குறைவு, மனக் குழப்பம்; திட்டங்கள் தோல்வி; விபத்து, உறுப்பு இழப்பு; பண விரயம்; கீழ்நிலை வேலையில் பிழைப்பு; கெட்ட பெண் தொடர்பால் பண, உடல்நல இழப்பு; எல்லோருடனும் சண்டை; நண்பர், உறவினருடன் பகை; குடும்பப் பிரிவு. மாரக தசை நடந்தால் ஒரு பிள்ளை மறையலாம் என்கிறது.',
    },
    sundarananda: {
      page: 'printed p.173 (PDF 166)',
      waxingTa: 'சகோதரர், மகன்களால் மன வேதனை; தாய் வழியில் துக்கம்; மலைப்பகுதியில் வாழ நேரலாம்; உறவினர் பகைவராதல்.',
      waningTa: 'யோகப் பயிற்சி; மந்திர யோகத்தில் சித்தி (கனவில் இஷ்ட தெய்வ தரிசனம்); மலை, குகைகளில் வாழ்தல் — தவக் காலம்.',
    },
    paryaya: {
      1: { page: 'printed p.231 (PDF 224)', textTa: 'தாயின் உயிருக்கு ஆபத்து அபாயம் (நூல் "6, 7, 8" என்றும் சேர்க்கிறது).' },
      2: { page: 'printed p.233 (PDF 226)', textTa: 'நல்ல வருமானம்; தனக்கு நோய்; மனைவி அல்லது உறவினருக்கு ஆபத்து, கெடுதல்.' },
      3: { page: 'printed p.234 (PDF 227)', textTa: 'உடல் நலக்குறைவு.' },
    },
  },
  6: {
    namesTa: 'நல்ல இடம் (3, 6, 11)',
    main: {
      page: 'printed pp.168-169 (PDF 161-162)',
      textTa: 'பொன், நகை, பணம்; குடும்பத்தார், உறவினர் உதவி; எல்லா வசதிகளும்; எதிரிகளை வெல்லுதல்; புதிய வீடு கட்டுதல்; எல்லாம் சாதகம்; அந்தஸ்து உயர்வு, பதவி உயர்வு; நேரத்துக்கு நல்ல உணவு; ஏராளமான பணம்; உயர்தர வாகனம்; நோய்கள் நீங்கி உடல் நலம்; எல்லா சுகங்களும்.',
    },
    sundarananda: {
      page: 'printed pp.173-174 (PDF 166-167)',
      waxingTa: 'கருப்புப் பொருள் வியாபாரத்தில் நல்ல லாபம், விரிவாக்கம்; வெளிநாட்டுக் கடல் பயணம்; பயணத்திலும் எல்லா முயற்சிகளிலும் வெற்றி.',
      waningTa: 'போலி நட்பால் எதிரிகளை வெல்லுதல் (மித்ர பேதம்); வருமானம், பண லாபம்; மலைகளில் வாழ்தல்.',
    },
    paryaya: {
      1: { page: 'printed p.231 (PDF 224)', textTa: 'மாரக தசையுடன் அஷ்டமாதிபதி புத்தியும் நடந்தால் உடல் சோர்வு; கெட்ட காலம், மனச் சோர்வு, நண்பர்களின் அதிருப்தி; 6-ல் 11-ஆம் அதிபதியின் நவாம்சம் அல்லது திரேக்காணம் இருந்தால் தாய் மறையலாம் என்கிறது.' },
      2: { page: 'printed p.233 (PDF 226)', textTa: 'தந்தையின் உயிருக்கு ஆபத்து — சனி 5-ன் இறுதியில் இருக்கும்போதே நேரலாம்.' },
      3: { page: 'printed p.234 (PDF 227)', textTa: 'வீட்டிலும் வெளியிலும் நல்ல வசதி.' },
    },
  },
  9: {
    namesTa: 'இரு மரபுகள் — "பண்டைய தமிழ் நூல்கள்" ராஜயோகம்; "பாரம்பரிய சமஸ்கிருத நூல்கள்" தீயது',
    main: {
      page: 'printed p.170 (PDF 163)',
      textTa: 'பண்டைய தமிழ் நூல்கள்: இந்த இரண்டரை ஆண்டுகள் ராஜயோகம் — செல்வச் செழிப்பு, ஆடம்பரம், அந்தஸ்து; எல்லா முயற்சிகளிலும் வெற்றி; உயர்தர வாகனம், அதிகாரப் பதவி; பல வழிகளில் பணம்; பணியாளர்கள். பாரம்பரிய சமஸ்கிருத நூல்கள் (பலதீபிகை மேற்கோள்): தீய பலன் — வீண் செலவு; நற்செயல்களுக்குப் பெயர் இல்லை; தந்தை அல்லது பெரியவருக்கு மாரக காலம் (ஆயுளும் மாரக தசையும் சேர்ந்தால் அவருக்கு இறுதிச் சடங்கு செய்ய நேரலாம்); தினமும் ஏதாவது துக்கம்; 8-ல் சொன்ன தீமைகளில் பல; நோய்கள், விபத்து; வருமானம் வற்றுதல்; வாய்ப்புகள் தவறுதல்; சிறை அச்சம், குடும்பப் பிரிவு; இறை நம்பிக்கை இழப்பு. நூலின் முடிவு: இரண்டும் சேர்ந்து நடுத்தரப் பலன்.',
    },
    sundarananda: {
      page: 'printed p.174 (PDF 167)',
      waxingTa: 'உதவுபவர்களுக்குச் சிரமம்; எதிரிகள் தீவிரம், அவர்களால் துன்பம், மன வேதனை.',
      waningTa: 'மனச் சோர்வு; வாத நோய்; நஞ்சு (உணவு நஞ்சு) அச்சம்; மலைகளில் வாழ நேரலாம்; பயனற்ற கடல் பயணம்.',
    },
    paryaya: {
      1: { page: 'printed pp.231-232 (PDF 224-225)', textTa: 'பெயர், புகழ்; சொந்த வருமானம் தொடங்குதல்; வசதி.' },
      2: { page: 'printed p.233 (PDF 226)', textTa: 'உறுதியான வசதி; வருமானத்தில் சிறிது உயர்வு; பெயர், புகழ்.' },
      3: { page: 'printed p.234 (PDF 227)', textTa: 'ஆயுளும் மாரக காலமும் சேர்ந்தால் ஜாதகருக்கு மரணமும் நேரலாம் என்கிறது.' },
    },
  },
  10: {
    namesTa: '',
    main: {
      page: 'printed pp.170-171 (PDF 163-164)',
      textTa: 'அந்தஸ்து, வேலை இழப்பு; பில்லி சூனியம்; காரணமற்ற பயம்; கவலைகள் பெருகுதல்; கஞ்சத்தனம்; காசி யாத்திரை (நீண்ட காலம் குடும்பப் பிரிவு); பயனற்ற கடும் உழைப்பு அல்லது குறைந்த ஊதியம், குடும்ப வறுமை; லாபமற்ற செயல்கள்; எங்கும் தோல்வி; பல நோய்கள்; அவதூறு, பொய்க் குற்றச்சாட்டு; மதிப்பிழப்பு, அவமானம்; மனக் குழப்பம்.',
    },
    sundarananda: {
      page: 'printed p.175 (PDF 168)',
      waxingTa: 'மன வேதனை; நற்செயல்களுக்கு (தானம்) தடை; குடும்பத்தில் சிரமம்; எல்லா வகைத் தடைகளும்.',
      waningTa: 'மன வேதனை; பண, பொருள் இழப்பு; வாகன விபத்து அச்சம்; இறுதியில் சிறிது வசதி, நிம்மதி.',
      noteTa: 'நூலில் இந்தத் தலைப்பு "குரு 10-ஆம் இடத்தில்" என்று அச்சாகியுள்ளது — சனிப் பகுதியின் நடுவில் வருவதால் சனி எனப் படிக்கிறோம்.',
    },
    paryaya: {
      1: { page: 'printed p.232 (PDF 225)', textTa: 'தொழிலதிபர் அல்லது வாழ்க்கைக்கு உதவும் ஒருவரின் நட்பு; இந்த ராசியின் கடைசிப் பகுதியில், வசதி, நல்ல வேலை அல்லது செழிக்கும் தொழிலுக்குப் பின் திருமணம் நடக்கலாம்.' },
      2: { page: 'printed p.233 (PDF 226)', textTa: 'குழந்தைப் பேறு; இறுதியில் அதிகச் செலவு.' },
      3: { page: 'printed p.234 (PDF 227)', textTa: R3_GENERAL },
    },
  },
  11: {
    namesTa: 'நல்ல இடம் (3, 6, 11)',
    main: {
      page: 'printed p.171 (PDF 164)',
      textTa: 'பல வழிகளில் பணம்; நோய்கள் நீங்கி உடல் நலம்; புதிய நம்பிக்கை; தொழிலில் மதிப்பு, பதவி உயர்வு — அமைச்சர் பதவி கூட; பெண் குழந்தை பிறக்கலாம்; காம உணர்வு அதிகரிப்பு; எல்லா வசதிகளும்; சிலருக்குக் கெட்ட பெண் தொடர்பால் லாபம்; கடினமான சுபாவம்; பிறர் பணமும் கிடைக்கும்; நண்பர்கள் உதவி; வீட்டில் தானியம், பொருட்கள் நிறைவு.',
    },
    sundarananda: {
      page: 'printed p.175 (PDF 168)',
      waxingTa: 'பல வழிகளில் பணம், தானியம்; மிகுந்த மகிழ்ச்சி; தருமச் செயல்கள்; கோயில் வழிபாடு; விவாதங்கள், கூட்டங்களில் முக்கியத்துவம்.',
      waningTa: 'கணிதத் திறன் வளர்ச்சி; ஆன்மிக நூல்கள் வாசிப்பு; புண்ணியத் தலங்கள், புனித நீராடல்; கருப்புப் பொருள் வியாபாரத்தில் லாபம்.',
    },
    paryaya: {
      1: { page: 'printed p.232 (PDF 225)', textTa: 'தொழிலதிபரின் நட்பு அல்லது தொழில் கூட்டாளி; வேலையில் முன்னேற நண்பரின் உதவி.' },
      2: { page: 'printed p.233 (PDF 226)', textTa: 'அதிகச் செலவு; உடல் நலக்குறைவு, உடல் சோர்வு; நெருங்கிய உறவினருக்குக் கெடுதல், நோய்.' },
      3: { page: 'printed p.234 (PDF 227)', textTa: R3_GENERAL },
    },
  },
  12: {
    namesTa: 'ஏழரைச் சனியின் தொடக்கம்',
    main: {
      page: 'printed pp.171-172 (PDF 164-165)',
      textTa: 'வறுமை, தொழில் இழப்பு, குடும்பப் பிரிவு; நோக்கமற்ற பயணங்கள்; கட்டுப்பாடற்ற செலவு; கவலைகள் சூழ்ந்த மனம்; வேலையின்மை, வருமானமின்மை; மீதிப் பணமும் வீண் செலவில்; தெளிவின்மையால் முடிவெடுக்க முடியாமை, திட்டங்கள் தோல்வி; கால்நடை அழிவு; விரும்பாத இடமாற்றம்; புதிய தொழில், கூட்டு, முதலீடு, பிணை எல்லாம் நஷ்டம் — தொழிலில் பாதுகாப்பாக இருப்பது நல்லது. ஆயுள் முடிவும் மாரக தசையும் ஏழரைச் சனியின் 3-ஆவது அல்லது 4-ஆவது சுற்றும் சேர்ந்தால் மரணமும் நேரலாம் என்கிறது.',
    },
    sundarananda: {
      page: 'printed p.175 (PDF 168)',
      waxingTa: 'குடும்பத்தில் சிரமம்; அதிகச் செலவு; கட்டாயமாக மலைப்பகுதிக்குச் செல்லுதல்; மனைவி, பிள்ளைகள் பகை.',
      waningTa: 'மன வேதனை; மேற்கு நோக்கிய பயணம்; நீண்ட தூரம் நடத்தல்; சிறிது மகிழ்ச்சி, வசதி.',
    },
    paryaya: {
      1: { page: 'printed p.232 (PDF 225)', textTa: 'சுமார் 28 வயது வரை — முக்கியமாக உடல் நலப் பிரச்சினை; பரிகாரத்தால் குணமாகும் என்கிறது. (பிறப்பில் சனி வர்க்கோத்தமமெனில் முதல் சுற்றில் சுமார் 30 வயது வரை வசதி, கல்வி முன்னேற்றம், நல்ல யோகம்.)' },
      2: { page: 'printed p.233 (PDF 226)', textTa: 'நல்லதும் கெட்டதும் கலந்த பலன்.' },
      3: { page: 'printed p.234 (PDF 227)', textTa: R3_GENERAL },
    },
  },
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
  pageLocus: 'printed pp.168-172 (PDF 161-165), "Transit Results of Saturn"; pp.172-175 (PDF 165-168), Part Three "Sundarananda Jyotisha Kavya"; pp.231-234 (PDF 224-227), "Saturn\'s Cyclic Effects Sani Paryaya Phala"',
});

const NOTES = deepFreeze({
  sundaranandaPrintTa: 'சுந்தரானந்தர் பகுதியில் ஒவ்வொரு இடத்துக்கும் இரண்டு பத்திகள்; 6-ஆம் இடம் தவிர எல்லாவற்றிலும் இரண்டுமே "வளர்பிறையில்" (waxing) என்று அச்சாகியுள்ளன — 6-ல் இரண்டாவது "தேய்பிறையில்" (waning). அதனால் இரண்டாவதைத் தேய்பிறை எனப் படிக்கிறோம். (3-ஆம் இடத் தலைப்பு "1" என்றும், 10-ஆம் இடத் தலைப்பு "குரு" என்றும் அச்சாகியுள்ளன.)',
  mainMissingTa: 'முதன்மை உரையில் இந்த இடத்துக்கான பகுதி இந்த ஸ்கேனில் இல்லை (அச்சுப் பக்கங்கள் 148-167 விடுபட்டுள்ளன).',
  pakshaMeaningTa: 'எந்தப் பட்சம் என்பதை நூலே சொல்கிறது (அச்சுப் பக்கம் 86, முன்னுரை): சுந்தரானந்தர் கோசாரப் பலனை "வளர்பிறை, தேய்பிறை காலங்களில் தனித்தனியே" தருகிறார் — அதாவது அந்தக் கோசாரத்தின்போது நடக்கும் பட்சம் (பிறப்புப் பட்சம் அல்ல); சூரியப் பகுதியில் "பூர்வ பட்சம் ... அபர பட்சம்", சந்திரப் பகுதியில் "சந்திரன் கிருஷ்ண பட்சத்தில் இருக்கும்போது" என்று அதையே காட்டுகிறார். எனவே சனி ஒரு இடத்தில் இருக்கும் இரண்டரை ஆண்டிலும் இரண்டு பத்திகளும் ஒவ்வொரு பதினைந்து நாளுக்கு மாறி மாறிப் பொருந்தும்.',
  pakshaSourcePage: 'printed p.86 (PDF 97), Part Three introduction: "gives transit results separately during Shukla Paksha and Krishna Paksha"; preface (PDF 5); p.96 (PDF 107), Moon in the 6th',
  paryayaCountTa: 'சுற்று எண்ணும் முறையை நூல் குருவின் உதாரணத்தில் காட்டுகிறது (அச்சுப் பக்கம் 236): பிறக்கும்போது குரு மிதுனத்தில் — "ரிஷபத்தைக் கடக்கும்போது சுற்று முடியும்". அதாவது ஒரு சுற்று பிறப்பில் கிரகம் இருந்த ராசியில் தொடங்கி அதற்கு முந்தைய ராசியில் முடிகிறது. எனவே ஒரு காலத்தின் சுற்று = 1 + அந்தக் காலம் தொடங்கும் முன் சனி தன் பிறப்பு ராசிக்குத் திரும்பிய எண்ணிக்கை. பெரும்பாலும் இது "அந்த இடத்தை எத்தனையாவது முறை கடக்கிறது" என்பதற்குச் சமம்; ஆனால் பிறந்த உடனே சனி வக்கிரமாக முந்தைய ராசிக்குப் பின்சென்றால், அந்தச் சிறு காலமும் சுமார் 29 ஆண்டுக்குப் பின் அதே ராசியை வழக்கமாகக் கடப்பதும் இரண்டுமே முதல் சுற்று. சனிப் பகுதியில் உதாரணம் இல்லை; குருவுக்குக் காட்டிய முறையே சனிக்கும் பொருத்தப்படுகிறது.',
  missingPagesTa: 'இந்த ஸ்கேனில் அச்சுப் பக்கங்கள் 148-167 இல்லை; அதனால் முதன்மை உரையில் சனி 1, 2, 3-ஆம் இடங்களுக்கான பகுதி கிடைக்கவில்லை.',
  disagreeTa: 'ஒரே நூலின் பகுதிகளே வேறுபடுகின்றன: முதன்மை உரை 8-ஐ ஏழரைச் சனிக்கு அடுத்த மிகத் தீய இடம் என்கிறது; சுற்றுப் பலனில் இரண்டாம் சுற்றில் 8-ல் "பண வரவு" என்கிறது.',
});

/**
 * The texts for one house, with each lived period given its round.
 * @param house    1-12 from the Moon
 * @param periods  that house's spans from birth, in order (as computeSaturnTransits returns them)
 * @param roundOf  period → its paryaya round; computeSaturnTransits passes the
 *                 book's count (returns to the birth sign). Without it the n-th
 *                 period is round n.
 */
function houseResultsFor(house, periods, roundOf = null) {
  const r = HOUSE_RESULTS[house];
  if (!r) return null;
  return {
    house,
    namesTa: r.namesTa,
    main: r.main ? { textTa: r.main.textTa, page: r.main.page } : { textTa: null, missingTa: NOTES.mainMissingTa },
    sundarananda: {
      waxingTa: r.sundarananda.waxingTa, waningTa: r.sundarananda.waningTa, page: r.sundarananda.page,
      noteTa: r.sundarananda.noteTa ?? null,
    },
    periods: periods.map((p, i) => {
      const round = roundOf ? roundOf(p) : i + 1;
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
