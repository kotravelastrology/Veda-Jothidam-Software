/**
 * What Patel says each planet's transit brings — chapters VI to XII of C.S. Patel and Subramania Aiyar's *Ashtakavarga*.
 *
 * Each chapter opens with the same three slokas for one planet: (1) the results of the planet's transit through a bhava
 * holding 8 to 0 bindus in its own Ashtakavarga, with a second list "given by other authors" that is shorter and
 * different for each planet; (2) the results while it crosses a Kakshya that has a bindu; (3) the results while it
 * crosses a Kakshya void of a bindu. Read from the page images (the scan's text layer scrambles the columns). The
 * Tamil is ours, close to the English; the cell is the book's. Saturn's first sloka is the one `/saturn-transit`
 * already holds (`saturnAshtakavargaTables.js`, PATEL_BY_BINDUS).
 */

const { PATEL, PATEL_BY_BINDUS, PATEL_OTHER_AUTHORS } = require('./saturnAshtakavargaTables');

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object') deepFreeze(v); });
  return Object.freeze(o);
};

const loc = (chapter, printed, pdf, quote) => ({ ...PATEL, pageLocus: `Chapter ${chapter}, printed ${printed} (PDF ${pdf}): ${quote}` });

const RESULTS = deepFreeze({
  Sun: {
    primary: {
      8: 'அரசு / அதிகாரிகளின் ஆதரவால் பெரும் மதிப்பும் செல்வமும்', 7: 'வியத்தகு ஒளியும் மகிழ்ச்சிப் பெருக்கமும்', 6: 'வீரமும் செழிப்பும்', 5: 'செல்வம் சேர்தல்',
      4: 'நன்மையும் தீமையும் கலந்த பலன்', 3: 'பயணத்தால் களைப்பு', 2: 'பாவச் செயல்கள்', 1: 'துன்பம் வருமோ என்ற பயம்', 0: 'மரணம் (அல்லது அதற்கு நிகரான துன்பங்கள்)',
    },
    others: {
      8: 'அரச மகிமை — செல்வம், நல்ல ஆலோசகர் முதலிய எல்லாத் துணைகளுடன்', 7: 'பெண்களால் வெற்றி, வீரம், பிறரிடம் மரியாதை',
      6: 'செல்வம், புகழ், நல்ல வாகனம், முயற்சிகளில் வெற்றி', 5: 'நல்லோர் சேர்க்கை; செல்வமும் கல்வியும் பெருகுதல்',
      4: 'செல்வம் வந்து உடனே செலவாதல்; இன்பமும் துன்பமும் கலந்த பலன்', 3: 'அலைச்சல் வாழ்க்கை, பல உடல் தொல்லைகள், மனக் கலக்கம்',
      2: 'ஏமாற்றங்கள், அரசின் அதிருப்தி, திருட்டால் இழப்பு, அவதூறு, உணவு பெறுவதிலும் சிரமம்', 1: 'நோய், கவலைகள், துன்பங்கள்',
    },
    kakshyaBindu: 'பகைவர் தோல்வி; எதிர்பாராமலோ சொந்த முயற்சியாலோ லட்சியம் நிறைவேறுதல் — பாவத்தின் இயல்புக்கேற்ப',
    kakshyaVoid: 'சொல்லொணாத் துன்பம், மிகுந்த மன வேதனை, துரதிர்ஷ்டம்; நோயும் துயரமும்; காரணமின்றி அரசின் அதிருப்தி',
    sources: [loc('VI sloka 1', 'pp.76-77', '111-112', '"When the Sun in his Ashtakavarga transits bhavas containing 8 to 0 bindus he results are as follows"; "Additional results given by other authors"'),
      loc('VI slokas 2-3', 'p.77', '112', '"When the Sun transits a Kakshya having a bindu in his Ashtakavarga the defeat of one\'s enemies, attainment of one\'s ambitions unexpectedly"; "While transiting a Kakshya void of a bindu he (the Sun) will be the cause of untold miseries"')],
  },
  Moon: {
    primary: {
      8: 'எல்லா வகை வசதிகள், பொலிவு, அருள், பல நண்பர்கள் சேர்தல்', 7: 'நல்ல ஆடைகள், சுவையான செழிப்பான உணவு, வாசனைப் பொருள், விழாக்கள்',
      6: 'மந்திர உபதேசம்; நல்ல பிராமணர்களுடன் தொடர்பு', 5: 'மனத் துணிவு', 4: 'மகிழ்ச்சியும் இல்லை, துயரமும் இல்லை', 3: 'உறவினர், நண்பருடன் மனவேற்றுமை',
      2: 'மனைவி அல்லது செல்வம் (சொத்து) காரணமாகச் சண்டை', 1: 'எதிர்பாராத, தவிர்க்க முடியாத துன்பங்கள்', 0: 'துயரம், கவலை, மரணம் முதலியன',
    },
    others: {
      8: 'புகழ்', 7: 'பொதுவான செயல்பாடு', 6: 'மூத்த சகோதரரின் உதவி', 5: 'மனநிறைவு, நலம்', 4: 'மகிழ்ச்சி', 3: 'பிறரின் பகை',
      2: 'நண்பர், உறவினரைப் பிரிதல்; செல்வ இழப்பு', 1: 'ஆபத்து', 0: 'எதிர்பாராத மரணம்',
    },
    kakshyaBindu: 'நல்ல ஆடை, அணிகலன், அலங்காரம் கிடைத்தல்; உயர்நிலையினரால் அங்கீகாரம்; இலக்குகள் (செயல்கள்) விரைவில் நிறைவேறுதல்',
    kakshyaVoid: 'தீய பலன்கள், பகைவருடன் சண்டை, அடிக்கடி கெட்ட கனவுகள், பண இழப்பு',
    sources: [loc('VII sloka 1', 'pp.87-88', '122-123', '"When the Moon in her Ashtakavarga transits bhavas containing 8 to 0 bindus the results are as follows"; "Additional results given by other authors"'),
      loc('VII slokas 2-3', 'p.88', '123', '"When the Moon transits a Kakshya having a bindu in her Ashtakavarga one gets good clothes, ornaments and decorations"; "While transiting a Kakshya void of a bindu the effects are evil results, quarrels with enemies, frequent bad dreams and loss of money"')],
  },
  Mars: {
    primary: {
      8: 'செல்வமும் நிலமும் சேர்தல்; பகைவர் மீது வெற்றி', 7: 'சகோதரர்களிடமிருந்தும் அவர்களுக்கும் செல்வம்', 6: 'அரசனின் (எஜமானின்) அன்புக்குரியவராதல்', 5: 'இனிய நடத்தை',
      4: 'இன்பமும் துன்பமும் கலந்து சமமாக', 3: 'சகோதரர், மனைவியைப் பிரிதல்', 2: 'விரும்பிய பொருள், பணம் பற்றிச் சண்டை',
      1: 'ஆயுதத்தால் (அறுவை), தீயால், காய்ச்சலால், அம்மையால் உடல் துன்பம்', 0: 'வயிற்று வலி, கண் நோய், மயக்கம், மரணம்',
    },
    others: {
      7: 'பெரிய அதிர்ஷ்டமும் செல்வக் குவிப்பும்', 5: 'அழகிய தோற்றம்', 4: 'பொது மகிழ்ச்சி', 3: 'ஆபத்து',
      2: 'சகோதரர், மனைவியைப் பிரிதல்; பகைவர், எதிரிகளால் நிந்தை, அவமதிப்பு',
    },
    kakshyaBindu: 'பணம் கிடைத்தல்; உடல்நலம், ஆயுள், உடல் ஒளி மேம்படுதல்',
    kakshyaVoid: 'எப்போதும் அஜீரணம்; தலைவலி; அசுத்த இரத்தம், பித்தத்தால் தொல்லைகள்',
    sources: [loc('VIII sloka 1', 'pp.96-97', '131-132', '"When Mars in his Ashtakavarga transits bhavas containing 8 to 0 bindus the results are as follows"; "Additional results given by other authors"'),
      loc('VIII slokas 2-3', 'p.97', '132', '"When Mars transits a Kakshya having a bindu in his Ashtakavarga, the person acquires money, improves health, life and bodily lustre"; "While transitting a Kakshya void of a bindu, he (Mars) always produces Dyspepsia (indigestion), creates headache and gives troubles due to impurities of blood and bile"')],
  },
  Mercury: {
    primary: {
      8: 'அரசு / ஆளும் அதிகாரத்திடமிருந்து மதிப்பு', 7: 'செல்வச் செழிப்பு, அறிவு, கல்வி, மகிழ்ச்சி', 6: 'எல்லா முயற்சிகளிலும் வெற்றி', 5: 'புதிய நண்பர்கள், உறவினர்கள்',
      4: 'வேலையில் ஊக்கமின்மை', 3: 'மனக் கவலைகளால் அமைதியின்மை', 2: 'வாத, பித்த, கபம் என்ற முத்தோஷங்களால் நோய்', 1: 'கட்டாயச் சிறை, பிற ஆபத்துகள், துயரம்', 0: 'எல்லாவற்றையும் இழத்தல்; அதன் விளைவாக மரணம்',
    },
    others: {
      8: 'எல்லா வகை நல்ல அதிர்ஷ்டம்', 7: 'பரந்த மனம், கவலையின்றி பிறருக்கு உதவும் வாழ்க்கை', 6: 'மிகச் சிக்கலான, நுட்பமான பிரச்சினைகளையும் எளிதாகப் புரிந்து முடிக்கும் திறன்',
      4: 'மனநிறைவு', 1: 'பகைவரால் அடிக்கடி வதைக்கப்படுதல்', 0: 'பகைவரின் சூழ்ச்சியால் எல்லாச் சொத்தையும் இழத்தல்; இறுதியில் மரணம்',
    },
    kakshyaBindu: 'எப்போதும் இன்பமும் சுவையான உணவும்; தானம், தர்மச் செயல்களில் மகிழ்வு; பிராமணர், தெய்வம், அக்னி வழிபாட்டில் ஈடுபாடு',
    kakshyaVoid: 'சிறு காயங்கள்; பகைவருடன் சண்டை; கெட்ட கனவுகள்; உரிய நேரமில்லாத உணவு',
    sources: [loc('IX sloka 1', 'pp.105-106', '140-141', '"When Mercury in his Ashtakavarga transits bhavas containing 8 to 0 bindus the results are as follows"; "Additional results given by other authors"'),
      loc('IX slokas 2-3', 'p.106', '141', '"When Mercury transits a Kakshya having a bindu in his Ashtakavarga one gets happiness and sweetmeats (sumptuous meal) always and rejoices in giving alms"; "While transiting a Kakshya void of a bindu, he (Mercury) will give minor injuries; the native quarrels with enemies, gets bad dreams and untimely meals"')],
  },
  Jupiter: {
    primary: {
      8: 'அரசனாதல் அல்லது அரசனுக்கு நிகரான அதிகாரமும் நிலையும்', 7: 'பலவகைச் செல்வமும் பொது மகிழ்ச்சியும்', 6: 'நல்ல ஆடை, வாகனம், தங்கம் முதலியன', 5: 'பகைவர் அழிவு; முயற்சிகளில் வெற்றி',
      4: 'இலாபமும் இல்லை, நட்டமும் இல்லை', 3: 'காது நோய்; உயிர்ச்சத்து குறைவு', 2: 'ஆளும் அதிகாரத்தின் அதிருப்தி', 1: 'செல்வம், உறவினர் இழப்பு', 0: 'அறிவு, செல்வம், பிள்ளைகள் நலிவு',
    },
    others: {
      7: 'செல்வமும் பிள்ளைகளும் கிடைத்தல்', 5: 'நல்ல, உண்மையான நண்பர்களுடன் தொடர்பும் வசிப்பும்', 4: 'இழிவு; பிறரின் கேலி', 3: 'வறுமை, துன்பம், நிலையான வசிப்பிடம் இன்மை',
      2: 'மனைவி, பிள்ளைகள், நிலச் சொத்து இழப்பு', 1: 'பகைவரின் துன்புறுத்தல்', 0: 'பிள்ளைகளின் மரணம்',
    },
    kakshyaBindu: 'செல்வப் பெருக்கு, பொது மகிழ்ச்சி, இல்லற இன்பம்; பகைவரை அழிப்பவர், மதிப்பும் ஊக்கமும் உள்ளவர்; மிகுந்த செழிப்பு, நல்ல ஆடை, தங்கம் பெருகுதல்; எல்லா இன்பமும் நிறைவாக; உறவினரிடமிருந்து பரிசுகள் பெறுதல்',
    kakshyaVoid: 'செல்வமும் அறிவும் இழந்த துயரம்; பணம் பற்றி மனக் கவலை; பயணத்தில் அடிக்கடி தடைகள், வாகனத்திலிருந்து விழுதல்; எல்லாருடனும் சண்டை, பேச்சால் அவமானம்; பகைவரால் தொல்லை, அதிகச் செலவு; அவசரத்தால் முயற்சிகள் வீணாதல்',
    sources: [loc('X sloka 1', 'p.115', '150', '"When Jupiter in his Ashtakavarga transits bhavas containing 8 to 0 bindus, the results are as follows"; "Additional results given by other authors"'),
      loc('X slokas 2-3', 'p.116', '151', '"When Jupiter transits a Kakshya having a bindu in his Ashtakavarga, increase in wealth, general happiness and conjugal bliss are the results"; "While transiting a Kakshya void of a bindu, one suffers from misery due to loss of wealth and intelligence"')],
  },
  Venus: {
    primary: {
      8: 'எல்லா இன்பமும்: நல்ல ஆடை, பெண்கள், மணமுள்ள பூக்கள், பலவகை உணவு, பானங்கள் முதலியன', 7: 'அணிகலன்களும் விலை உயர்ந்த கற்களும்', 6: 'அன்பான மனைவியைச் சந்தித்தல்', 5: 'நண்பர்களுடன் தொடர்பு',
      4: 'நன்மையும் தீமையும் கலந்த பலன்', 3: 'அண்டை வீட்டார், ஊர் மக்களுடன் பகை; சுவையின்மை', 2: 'தரம் தாழ்தல்; நோய்', 1: 'கபம், நீர் அல்லது நஞ்சால் வரும் நோய் பயம்', 0: 'எல்லா வகைத் துன்பங்களும்',
    },
    others: {},
    kakshyaBindu: 'அரசுப் பணியில் நிலையும் மதிப்பும் உயர்தல்; மகள் பிறத்தல்; உடல் இன்பம், நீண்ட ஆயுள்; விளையாட்டுகளில் ஈடுபாடு; விரிந்த அறிவு; நோக்கத்தில் வெற்றி; செல்வம்; மகிழ்ச்சியும் பொது நலமும் பெருகுதல்',
    kakshyaVoid: 'துன்பங்கள்; பகைவரால் செல்வ இழப்பு; மனைவிக்குத் துன்பம்; மிகுந்த சண்டை; நிலச் சொத்து இழப்பு; துயரம்; மனக் குழப்பம்; அடிக்கடி செலவு; குதிரையிலிருந்து விழுதல் அல்லது பயணத்தில் தடைகள் (இந்தக் காலம் முழுதும்)',
    sources: [loc('XI sloka 1', 'p.139', '174', '"When Venus in her Ashtakavarga transits bhavas containing 8 to 0 bindus the results are as follows" (no list of other authors)'),
      loc('XI slokas 2-3', 'p.140', '175', '"When Venus transits a Kakshya having a bindu in her Ashtakavarga, one\'s status and respect in Government service are enhanced and he gets a daughter"; "While transiting a Kakshya void of a bindu, she (Venus) causes troubles, loss of wealth through enemies, affliction to wife, extreme quarrels"')],
  },
  Saturn: {
    primary: PATEL_BY_BINDUS,
    others: PATEL_OTHER_AUTHORS,
    kakshyaBindu: 'பரம்பரைச் சொத்தாகச் செல்வம்; அரசன் மூலம் முயற்சிகளில் வெற்றி; நல்லோருடன் தொடர்பு; நிலம்; ஏமாற்றுபவர்கள் மீது வெற்றி; புனித, சமயக் கடமைகளில் (ஸ்நானம், தானம், அர்ச்சனம்) ஈடுபாடு; இனிப்புப் பண்டங்கள்; அரசனின் வரம்; விளைச்சல் பெருக்கம்',
    kakshyaVoid: 'துயரம்; அரசனிடம் பயம்; உறவினர்களிடமிருந்து தொல்லைகள் பெருகுதல்; ஆயுதங்களால் தற்செயல் காயம்; பண இழப்பு; பல வகையில் மனக் கலக்கம்; நில இழப்பு அல்லது சண்டை; மனக் குழப்பம்; பயணத்தில் இழப்பு',
    sources: [loc('XII sloka 1', 'p.153', '188', '"When Saturn in his Ashtakavarga transits bhavas containing 8 to 0 bindus, the results are as follows"; "Additional results given by other authors"'),
      loc('XII slokas 2-3', 'p.154', '189', '"When Saturn transits a Kakshya having a bindu in his Ashtakavarga he confers wealth by way of legacy, success in undertakings through a king"; "While transiting a Kakshya void of a bindu, he causes misery, fear from a King, increase of troubles from or to relatives, accidental wounds from weapons"')],
  },
});

const OUR_READINGS_TA = Object.freeze([
  'இந்த ஏழு அத்தியாயங்களும் (VI-XII) ஒரே வடிவில் உள்ளன: பாவத்தின் பிந்து எண்ணிக்கை (8-0) → பலன்; பிந்து உள்ள காக்ஷ்யை → நன்மை; பிந்து இல்லாத காக்ஷ்யை → தீமை. இங்கே அவை அப்படியே; தமிழ் எங்கள் மொழிபெயர்ப்பு.',
  '"மற்ற ஆசிரியர்கள் தரும் கூடுதல் பலன்" ஒவ்வொரு கிரகத்துக்கும் வேறு எண்களில் மட்டுமே உள்ளது (சுக்கிரனுக்கு இல்லை); இல்லாத எண்ணுக்கு நூல் எதுவும் சொல்லவில்லை.',
  'சனியின் முதல் ஸ்லோகம் /saturn-transit இல் உள்ளவாறே; அதன் 2, 3-ஆம் ஸ்லோகங்கள் இங்கே புதிதாகச் சேர்ந்தவை.',
  'ஒவ்வொரு ஸ்லோகத்திலும் உள்ள "சுமார்", "அல்லது" சொற்கள் அப்படியே; பலன்கள் நூலின் கூற்றுகள், முன்கணிப்பு அல்ல.',
]);

module.exports = { RESULTS, OUR_READINGS_TA };
