/**
 * How to wear each gem — what each of the three books says, side by side.
 *
 * All three give a minimum weight, a metal, a finger, a day and gems not to
 * combine it with, and they differ on most of them: Kapoor and Raj Kumar set
 * red coral in gold mixed with copper, Tilak Raj in silver; Kapoor asks at
 * least 4 carats of blue sapphire, Raj Kumar 3; Tilak Raj counts in rattis and
 * prints a quarter-ratti diamond on the same spread where he says no gem should
 * weigh less than 3 rattis. Weights are kept in the unit each book uses — no
 * book here gives a ratti-to-carat conversion, so none is made.
 *
 * `notWith` lists the planets whose gems the book says must not be worn with
 * this one. The books do not always state it both ways round (Kapoor: yellow
 * sapphire is not to be worn with emerald, but emerald's own list names only
 * pearl and coral); the test reports where.
 *
 * Raj Kumar's PDF drops a line at some page breaks; where that cut a list, the
 * entry says `lostLine` and gives only what is printed.
 */

const { SOURCES } = require('./gemstoneTables');

const { KAPOOR, TILAK_RAJ, RAJ_KUMAR } = SOURCES;

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object') deepFreeze(v); });
  return Object.freeze(o);
};

const W = (weight, metal, finger, when, notWith, page, x = {}) => ({ weight, metal, finger, when, notWith, page, ...x });

const WEARING = deepFreeze({
  kapoor: {
    source: { ...KAPOOR, pageLocus: 'printed pp.81-99 (PDF 77-95): the last paragraph of each gem\'s section and its "Important" note; fingers p.86, buying and purifying p.78' },
    general: 'இரண்டு ரத்தினங்கள் அணிந்தால் முதன்மைக் கல் வலக்கை உரிய விரலிலும் துணைக் கல் இடக்கை உரிய விரலிலும் (ப.86). வளர்பிறையில், அந்தக் கிரகத்தின் கிழமையில், கங்கை நீர் அல்லது காய்ச்சாத பாலில் தூய்மைப்படுத்தி, மந்திரம் 108 முறை ஜபித்து அணிய வேண்டும் (ப.78).',
    gems: {
      Sun: W({ min: 2.5, unit: 'ct' }, 'செம்பு கலந்த தங்கம்', 'வலக்கை மோதிர விரல்', 'வளர்பிறை ஞாயிறு காலை, சூரிய உதயத்துக்குப் பின்', ['Venus', 'Saturn', 'Rahu', 'Ketu'], 81, { goodWith: ['Moon', 'Mars', 'Mercury', 'Jupiter'] }),
      Moon: W({ min: 2, unit: 'ct' }, 'வெள்ளி', 'வலக்கை மோதிர விரல்', 'வளர்பிறை திங்கள் காலை', ['Mercury', 'Venus', 'Saturn', 'Rahu', 'Ketu'], 83),
      Mars: W({ min: 6, unit: 'ct' }, 'செம்பு கலந்த தங்கம்', 'வலக்கை மோதிர விரல்', 'வளர்பிறை செவ்வாய் காலை', ['Mercury', 'Venus', 'Saturn', 'Rahu', 'Ketu'], 86),
      Mercury: W({ min: 3, unit: 'ct' }, 'வெள்ளி', 'வலக்கை சுண்டு விரல்', 'வளர்பிறை புதன் காலை', ['Moon', 'Mars'], 89),
      Jupiter: W({ min: 3, unit: 'ct' }, 'தங்கம்', 'வலக்கை ஆள்காட்டி விரல் (ப.86: ஆள்காட்டி அல்லது மோதிர விரல்)', 'வளர்பிறை வியாழன் காலை', ['Mercury', 'Venus', 'Saturn', 'Rahu', 'Ketu'], 92),
      Venus: W({ min: 0.5, unit: 'ct', note: '"குறைந்தபட்ச எடையை நிர்ணயிக்க முடியாது", ஆனாலும் ½ கேரட்டாவது' }, 'தங்கம் அல்லது வெள்ளியுடன் பிளாட்டினம்', 'வலக்கை சுண்டு விரல்', 'வளர்பிறை வெள்ளி காலை', ['Sun', 'Moon', 'Mars'], 95),
      Saturn: W({ min: 4, unit: 'ct' }, 'எஃகு', 'வலக்கை நடு விரல்', 'வளர்பிறை சனி பிற்பகல் (சூரிய அஸ்தமனத்துக்கு முன்)', ['Sun', 'Moon', 'Mars', 'Jupiter'], 98, { extraTa: 'சோதித்த பின்பே அணிய வேண்டும் — சில நீலக் கற்கள் துரதிர்ஷ்டமானவை (ப.96).' }),
      Rahu: W({ min: 6, unit: 'ct' }, 'அஷ்டதாது', 'நடு அல்லது சுண்டு விரல்', 'வியாழன், அந்தி சாய்ந்து இரண்டு மணி நேரம் கழித்து', ['Sun', 'Moon', 'Mars', 'Jupiter'], 99, { extraTa: 'ராகு தசையில் மட்டும் (நிபந்தனையுடன்).' }),
      Ketu: W({ min: 5, unit: 'ct' }, 'அஷ்டதாது', 'நடு அல்லது சுண்டு விரல்', 'வியாழன் நள்ளிரவு', ['Sun', 'Moon', 'Mars', 'Jupiter'], 99, { extraTa: 'கேது தசையில் மட்டும் (நிபந்தனையுடன்).' }),
    },
  },
  tilakRaj: {
    source: { ...TILAK_RAJ, pageLocus: 'printed p.22 (PDF 26), "Details regarding gems" and "Period of gems and gems not to be worn with"; weight rule p.20 (PDF 24); fingers p.24 (PDF 28)' },
    general: 'வளர்பிறையில், குறித்த கிழமையில், குறித்த நேரத்தில், தகுதியானவரால் பிரதிஷ்டை செய்து அணிய வேண்டும்; அன்று அந்த ரத்தினத்துக்குரிய பொருட்களைத் தானம் செய்ய வேண்டும் (ப.22). எடை: குறைந்தது 3 ரத்தி; பெரும்பாலான அறிஞர்கள் உடல் எடையில் 10 கிலோவுக்கு 1 ரத்தி என்கின்றனர் (ப.20).',
    gems: {
      Sun: W({ min: 3.25, unit: 'ratti', printed: '314 Rattis' }, 'தங்கம்', 'மோதிர விரல்', 'ஞாயிறு காலை', ['Venus', 'Saturn', 'Rahu'], 22, { life: '4 ஆண்டு' }),
      Moon: W({ min: 3.25, unit: 'ratti' }, 'வெள்ளி', 'சுண்டு விரல்', 'திங்கள் காலை', ['Rahu', 'Ketu'], 22, { life: '2¼ ஆண்டு' }),
      Mars: W({ min: 6.25, unit: 'ratti' }, 'வெள்ளி', 'மோதிர விரல்', 'செவ்வாய் காலை', ['Venus', 'Saturn', 'Rahu'], 22, { life: '3 ஆண்டு' }),
      Mercury: W({ min: 4.25, unit: 'ratti' }, 'தங்கம்', 'சுண்டு விரல்', 'புதன் காலை', ['Moon'], 22, { life: '4 ஆண்டு' }),
      Jupiter: W({ min: 4.25, unit: 'ratti' }, 'தங்கம்', 'ஆள்காட்டி விரல்', 'வியாழன் காலை', ['Venus', 'Saturn'], 22, { life: '4 ஆண்டு' }),
      Venus: W({ min: 0.25, unit: 'ratti' }, 'வெள்ளி / பிளாட்டினம்', 'சுண்டு விரல்', 'வெள்ளி காலை', ['Sun', 'Mars', 'Jupiter'], 22, { life: '7 ஆண்டு' }),
      Saturn: W({ min: 4.25, unit: 'ratti' }, 'பஞ்சதாது / வெள்ளி', 'நடு விரல்', 'சனி மாலை', ['Sun', 'Mars', 'Jupiter'], 22, { life: '5 ஆண்டு' }),
      Rahu: W({ min: 5.25, unit: 'ratti' }, 'அஷ்டதாது / வெள்ளி', 'நடு விரல்', 'சனி, சூரிய அஸ்தமனம்', ['Sun', 'Moon', 'Mars'], 22, { life: '3 ஆண்டு' }),
      Ketu: W({ min: 6.25, unit: 'ratti' }, 'வெள்ளி', 'மோதிர விரல்', 'செவ்வாய் / வியாழன், சூரிய அஸ்தமனம்', ['Moon'], 22, { life: '3 ஆண்டு' }),
    },
  },
  rajKumar: {
    source: { ...RAJ_KUMAR, pageLocus: 'PDF pages 126-143, item iii) and iv) of each "Who should wear ... and how?"; shelf life PDF 145' },
    general: 'ஒவ்வொரு ரத்தினத்தையும் முதல் முறை அணியும் முன் "சக்தியூட்ட" வேண்டும் என்கிறது (PDF 146-150); ரத்தினத்துக்கு ஒரு "பயன் ஆயுள்" உண்டு, அது முடிந்ததும் மீண்டும் சக்தியூட்ட வேண்டும் (PDF 144-145). ஒவ்வொரு ரத்தினத்துக்கும் தொழில்கள், நோய்களின் பட்டியலும் தருகிறது — அவை இங்கு எடுக்கப்படவில்லை.',
    gems: {
      Sun: W({ min: 3, unit: 'ct', note: '600 மி.கி.; மாற்றுக் கல் 6 கேரட்டாவது' }, 'தங்கம், அல்லது (விரும்பத்தக்கது) செம்பு கலந்த தங்கம்', 'மோதிர விரல்', 'வளர்பிறை ஞாயிறு — உதயத்துக்குப் பின் முதல் ஹோரை அல்லது நண்பகல்; அல்லது திங்கள் / செவ்வாய் / வியாழனில் சூரிய ஹோரை', ['Venus', 'Saturn', 'Rahu', 'Ketu'], 126, { life: '4 ஆண்டு', substitutes: 'ரெட் ஸ்பைனல், கார்னெட், ரூபெல்லைட், சூரியகாந்தக் கல்', extraTa: 'கடும் காய்ச்சல், இரத்தப்போக்கு, உயர் இரத்த அழுத்தம், தொற்று நோய் இருக்கும்போது அணியக் கூடாது.' }),
      Moon: W({ min: 4, max: 6, unit: 'ct', note: 'மாற்றுக் கல் 5 கேரட்டுக்கு மேல்' }, 'வெள்ளி', 'எந்தக் கையிலும் மோதிர விரல்', 'திங்கள் உதயத்துக்குப் பின் முதல் ஹோரை, அல்லது வியாழனில் சந்திர ஹோரை; வளர்பிறை', ['Venus', 'Saturn'], 128, { lostLine: true, life: '2 ஆண்டு', substitutes: 'வளர்ப்பு முத்து, சந்திரகாந்தக் கல், வெள்ளை புஷ்பராகம்' }),
      Mars: W({ min: 6, unit: 'ct' }, 'செம்பு கலந்த தங்கம்', 'வலக்கை மோதிர விரல்', 'செவ்வாய் உதயத்திலிருந்து ஒரு மணி நேரத்துக்குள், அல்லது திங்கள் 4-ஆம் ஹோரை / வியாழன் 2-ஆம் ஹோரை; வளர்பிறை', ['Mercury', 'Venus', 'Saturn'], 130, { lostLine: true, life: '3 ஆண்டு 3 நாள்', substitutes: 'கார்னீலியன், ரெட் அகேட்' }),
      Mercury: W({ min: 3, unit: 'ct' }, 'வெள்ளி அல்லது தங்கம்', 'எந்தக் கையிலும் சுண்டு விரல்', 'புதன் உதயத்துக்குப் பின் முதல் ஹோரை, அல்லது வெள்ளி / சனியில் (நூல் சொல்லும் ஹோரை); வளர்பிறை', ['Moon', 'Mars'], 132, { life: '3 ஆண்டு', substitutes: 'பெரிடாட், ஜேட்', extraTa: 'நூல் "Sapphire" உடனும் கூடாது என்கிறது — எந்த sapphire என்று சொல்லவில்லை. மேஷ, விருச்சிக லக்னத்தினர் அணியக் கூடாது என்கிறது.' }),
      Jupiter: W({ min: 3, unit: 'ct' }, 'தங்கம்', 'வலக்கை ஆள்காட்டி விரல் (சிலர்: மோதிர விரல் மட்டும்)', 'வியாழன் உதயத்திலிருந்து ஒரு மணி நேரத்துக்குள், அல்லது திங்கள் 6-ஆம் ஹோரை; வளர்பிறை', ['Venus', 'Saturn', 'Rahu', 'Ketu'], 134, { life: '4 ஆண்டு 4 மாதம் 18 நாள்' }),
      Venus: W({ min: 1, unit: 'ct', note: 'மாற்றுக் கல் 3-4 கேரட்' }, 'வெள்ளி அல்லது பிளாட்டினம்', 'வலக்கை சுண்டு அல்லது நடு விரல்', 'வெள்ளி காலை உதயத்திலிருந்து ஒரு மணி நேரத்துக்குள், அல்லது சனி 4-ஆம் ஹோரை; வளர்பிறை', ['Sun', 'Moon', 'Mars', 'Jupiter'], 136, { life: '4 ஆண்டு 4 மாதம் 18 நாள்', substitutes: 'வெள்ளை சிர்கான், ஓபல், படிகம்' }),
      Saturn: W({ min: 3, unit: 'ct' }, 'எஃகு அல்லது அஷ்டதாது', 'எந்தக் கையிலும் நடு விரல்', 'சனி — உதயத்துக்குப் பின் முதல் மணி அல்லது அஸ்தமனத்துக்கு முன் கடைசி மணி; அல்லது வெள்ளி 5-ஆம் ஹோரை', ['Sun', 'Moon', 'Mars'], 139, { life: '5 ஆண்டு', substitutes: 'அமெதிஸ்ட், லாபிஸ் லசூலி, புளூ ஸ்பைனல்', extraTa: 'மோதிரத்தில் பதிக்கும் முன் சட்டைப்பையில் அல்லது தலையணைக்கடியில் வைத்துச் சோதிக்க வேண்டும்; ஏழரைச் சனியின்போது அணியக் கூடாது.' }),
      Rahu: W({ min: 3, unit: 'ct' }, 'தங்கம் / வெள்ளி', 'எந்தக் கையிலும் நடு விரல்', 'சனி அஸ்தமனத்துக்கு முன், அல்லது ஜாதகத்தில் ராகு நிற்கும் ராசியின் அதிபதியின் கிழமை', ['Sun', 'Moon', 'Mars', 'Jupiter'], 141, { life: '3 ஆண்டு', extraTa: 'தசை / புத்தியில் மட்டும்.' }),
      Ketu: W({ min: 3, unit: 'ct' }, 'வெள்ளி / அஷ்டதாது', 'வலக்கை சுண்டு விரல் (அல்லது அதன் ராசி அதிபதியின் விரல்)', 'கேது நிற்கும் ராசியின் அதிபதியின் கிழமை நள்ளிரவு; வளர்பிறை', ['Sun', 'Moon', 'Mars', 'Jupiter'], 142, { life: '3 ஆண்டு', substitutes: 'டைகர்ஸ் ஐ', extraTa: 'தசை / புத்தியில் மட்டும்.' }),
    },
  },
});

const UNIT_TA = Object.freeze({ ct: 'கேரட்', ratti: 'ரத்தி' });

module.exports = { WEARING, UNIT_TA };
