/**
 * T.M. Rao's Bhrigu Samhita, "Predictions of <planet> in <lagna> Ascendant": the entries for the planets in the 1st to 4th
 * houses from each lagna (9 planets x 12 lagnas x 4 houses = 432). Each entry is the book's prose as printed (`en`, joined
 * from the page extract; OCR slips are kept), its Tamil summary (`ta`, ours) and the printed page the entry starts on.
 * `planetSign` is the sign the planet stands in (the lagna for house 1, and the sign that many places on for houses 2 to 4).
 * The printed page is the scan's page number plus five, checked against the printed numbers in the scan and the page
 * images for Libra (p.156) and Leo (p.104). Extracted by scratch scripts; the text is the book's.
 */

const PLANET_IN_HOUSE = [
  {
    house: 1, lagna: "Aries", planetSign: "Aries", planet: "Sun", page: 21,
    en: "The native is learned, gets good education, self-knowledge, is of tall stature, happy with children, mentally shrewd, somewhat deficient in the house of wife, lacks sexual interest, and does not care for occupational pursuits",
    ta: "கற்றவர், நல்ல கல்வி, சுய அறிவு; உயரமானவர்; குழந்தைகளால் மகிழ்ச்சி; அறிவுக் கூர்மை; மனைவி வழியில் சிறு குறை; பாலியல் ஆர்வம் குறைவு; தொழிலில் அக்கறை குறைவு.",
  },
  {
    house: 1, lagna: "Aries", planetSign: "Aries", planet: "Moon", page: 23,
    en: "Gets happiness and enjoys all pleasures, gets mother's affection and enjoys land and house, good-looking, happiness from wife, sexual pleasure, gets success, respect in occupation, contact with good helpers and enjoys luxury",
    ta: "இன்பம் அனுபவிப்பவர்; தாயின் அன்பு; நிலம், வீடு வசதி; அழகானவர்; மனைவியால் மகிழ்ச்சி; தொழிலில் வெற்றியும் மரியாதையும்; நல்ல உதவியாளர்கள்; ஆடம்பர வாழ்வு.",
  },
  {
    house: 1, lagna: "Aries", planetSign: "Aries", planet: "Mars", page: 25,
    en: "Gets fame and physical greatness, has spiritual powers with mother not encouraging, lacking happiness from wife and family pleasures, is restless",
    ta: "புகழும் உடல் வலிமையும் பெறுவார்; தாயின் ஆதரவு குறைவு; மனைவி, குடும்ப இன்பம் குறைவு; அமைதியற்றவர்.",
  },
  {
    house: 1, lagna: "Aries", planetSign: "Aries", planet: "Mercury", page: 27,
    en: "Sisters and brothers are friendly, gets help from maternal grandfather's side, overcomes enemies, able to get over disputes and hindrances, gets his work done cleverly, support from wife and family, improves his working conditions with planning and industry",
    ta: "உடன்பிறப்புகள் நட்புடன்; தாய்வழி தாத்தாவிடம் உதவி; எதிரிகளை வெல்வார்; தடைகளைத் தாண்டுவார்; திட்டமிட்டு வேலை செய்வார்; மனைவி, குடும்ப ஆதரவு; உழைப்பால் வேலை நிலை மேம்படும்.",
  },
  {
    house: 1, lagna: "Aries", planetSign: "Aries", planet: "Jupiter", page: 29,
    en: "Handsome, fortunate and honoured, spending in a right way, maintains good health, religious, has children, well-educated, domestic happiness, successful in occupations, good forethought and kind-hearted",
    ta: "அழகும் அதிர்ஷ்டமும் மரியாதையும்; நல்ல வழியில் செலவு; நல்ல உடல்நலம்; தர்ம சிந்தனை; குழந்தைகள்; நல்ல கல்வி; குடும்ப மகிழ்ச்சி; தொழிலில் வெற்றி; இரக்க குணம்.",
  },
  {
    house: 1, lagna: "Aries", planetSign: "Aries", planet: "Venus", page: 31,
    en: "Has a good profession, earns wealth, possesses beautiful wife and enjoys good sexual pleasures, artistic and clever, good family, very able and successful in worldly affairs, enjoy the domestic life, skilful and honourable",
    ta: "நல்ல தொழில், செல்வம்; அழகான மனைவி; நல்ல பாலியல் இன்பம்; கலையிலும் அறிவிலும் திறமை; நல்ல குடும்பம்; உலக விவகாரங்களில் வெற்றி; மதிப்புக்குரியவர்.",
  },
  {
    house: 1, lagna: "Aries", planetSign: "Aries", planet: "Saturn", page: 33,
    en: "Not attractive in appearance, no happiness from father, is dependent, has to work hard for money, is very industrious and energetic, gives special importance to wife and is a bit lazy",
    ta: "அழகற்ற தோற்றம்; தந்தையால் மகிழ்ச்சி இல்லை; பிறரைச் சார்ந்திருப்பவர்; பணத்துக்கு கடின உழைப்பு; மிகுந்த முயற்சி; மனைவிக்கு முக்கியத்துவம்; சிறிது சோம்பல்.",
  },
  {
    house: 1, lagna: "Aries", planetSign: "Aries", planet: "Rahu", page: 35,
    en: "Feels sickly and has a diseased face, courageous, becomes popular, makes unauthorised efforts, secretive, faces the calamities bravely",
    ta: "உடல்நலக் குறைவு, முகத்தில் நோய் அடையாளம்; தைரியசாலி; பிரபலமாவார்; அனுமதியின்றி முயற்சிகள்; ரகசியமானவர்; ஆபத்துகளை தைரியமாக எதிர்கொள்வார்.",
  },
  {
    house: 1, lagna: "Aries", planetSign: "Aries", planet: "Ketu", page: 37,
    en: "Feels restless and is weak in body, may experience some fatal stroke of pain, has good patience, not under pressure from others, rash and obstinate, lacks self-confidence",
    ta: "உடல் பலவீனம், அமைதியின்மை; ஆபத்தான வலி ஏற்படலாம்; பொறுமை; பிறர் அழுத்தத்துக்கு உட்படாதவர்; முரட்டுத்தனமும் பிடிவாதமும்; தன்னம்பிக்கை குறைவு.",
  },
  {
    house: 1, lagna: "Taurus", planetSign: "Taurus", planet: "Sun", page: 42,
    en: "Gets some landed property and also happiness through occupation, happiness through wife and family, and also sexual pleasures",
    ta: "சில நிலச் சொத்து; தொழிலில் மகிழ்ச்சி; மனைவி, குடும்ப இன்பம்; பாலியல் இன்பமும்.",
  },
  {
    house: 1, lagna: "Taurus", planetSign: "Taurus", planet: "Moon", page: 44,
    en: "Help from brothers and sisters, courageous and ambitious, little unhappy with wife and also with profession and also in sexual pleasures, feels restless in domestic alfairs",
    ta: "சகோதர சகோதரிகளின் உதவி; தைரியமும் லட்சியமும்; மனைவி, தொழில், பாலியல் இன்பத்தில் சிறு அதிருப்தி; குடும்ப விவகாரங்களில் அமைதியின்மை.",
  },
  {
    house: 1, lagna: "Taurus", planetSign: "Taurus", planet: "Mars", page: 46,
    en: "Blood gets impure, expenditure in daily life, gives importance to wife and not to mother, happiness through lands and buildings, wanders, toils hard and is somewhat restless in family",
    ta: "ரத்தம் கெட்டுப்போகும்; தினசரி செலவு; மனைவிக்கு முக்கியத்துவம், தாயிடம் குறைவு; நிலம், கட்டிடத்தால் மகிழ்ச்சி; அலைச்சல்; கடின உழைப்பு; குடும்பத்தில் சிறு அமைதியின்மை.",
  },
  {
    house: 1, lagna: "Taurus", planetSign: "Taurus", planet: "Mercury", page: 48,
    en: "Gets wisdom and education, earns wealth with discriminations, looks handsome, respect in family and through wife, has the desires of sexual pleasure, becomes rich and clever",
    ta: "ஞானமும் கல்வியும்; விவேகத்துடன் பொருள் ஈட்டுவார்; அழகானவர்; குடும்பத்திலும் மனைவி வழியிலும் மரியாதை; பாலியல் ஆசை; பணக்காரர், திறமையானவர்.",
  },
  {
    house: 1, lagna: "Taurus", planetSign: "Taurus", planet: "Jupiter", page: 50,
    en: "Clever, suffers from some health problems, gets importance and dignity in the daily routine, good education, sufferings of children",
    ta: "திறமையானவர்; சில உடல்நலப் பிரச்சினைகள்; அன்றாட வாழ்வில் முக்கியத்துவமும் கௌரவமும்; நல்ல கல்வி; குழந்தைகளால் துன்பம்.",
  },
  {
    house: 1, lagna: "Taurus", planetSign: "Taurus", planet: "Venus", page: 52,
    en: "Proud, gains from wife, keeps huge influence in the house of enemies, success in daily occupation, gets some disease, is of firm determination, and is obstinate",
    ta: "பெருமைக்காரர்; மனைவியால் ஆதாயம்; எதிரிகள் இடத்தில் செல்வாக்கு; அன்றாட தொழிலில் வெற்றி; சில நோய்; உறுதியான மனம், பிடிவாதம்.",
  },
  {
    house: 1, lagna: "Taurus", planetSign: "Taurus", planet: "Saturn", page: 54,
    en: "Influential, thought to be fortunate, gets the respect from father, government and society, interested in politics and tries hard for progress, not much help from brothers and sisters, enmity with wife, deficiency in sexual pleasures, does hard work, and is obstinate",
    ta: "செல்வாக்குள்ளவர்; அதிர்ஷ்டசாலி என்று கருதப்படுவார்; தந்தை, அரசு, சமூகத்தில் மரியாதை; அரசியலில் ஆர்வம்; சகோதரர் ஆதரவு குறைவு; மனைவியுடன் பகை; பாலியல் இன்பக் குறைவு; கடின உழைப்பு; பிடிவாதம்.",
  },
  {
    house: 1, lagna: "Taurus", planetSign: "Taurus", planet: "Rahu", page: 56,
    en: "Weak constitution, gets worries and anxieties, secretive and clever, is courageous",
    ta: "பலவீனமான உடல்; கவலைகளும் பதற்றமும்; ரகசியமானவர், புத்திசாலி; தைரியசாலி.",
  },
  {
    house: 1, lagna: "Taurus", planetSign: "Taurus", planet: "Ketu", page: 58,
    en: "Weakness in body and mentally backward, restlessness, secretive and brave, and becomes unfair",
    ta: "உடல் பலவீனம், மனத்தில் பின்தங்கல்; அமைதியின்மை; ரகசியமானவர், வீரம்; நியாயமற்ற செயல்.",
  },
  {
    house: 1, lagna: "Gemini", planetSign: "Gemini", planet: "Sun", page: 62,
    en: "Does influential deeds, has the support of brothers and sisters, works with great strength and influence in the house of wife, increase in the strength of sexual pleasures",
    ta: "செல்வாக்குள்ள செயல்கள்; சகோதர சகோதரிகளின் ஆதரவு; மனைவி வழியில் வலிமையுடன் செயல்படுவார்; பாலியல் இன்பம் அதிகரிக்கும்.",
  },
  {
    house: 1, lagna: "Gemini", planetSign: "Gemini", planet: "Moon", page: 64,
    en: "Gets wealth and looks handsome, beauty in the house of wife, success in daily occupation, wears costly things, more attention in the side of sexual pleasures, respect from father-in-law, is of stable mind",
    ta: "செல்வம், அழகான தோற்றம்; மனைவி வழியில் அழகு; தினசரி தொழிலில் வெற்றி; விலையுயர்ந்த பொருட்கள்; பாலியல் இன்பத்தில் அதிக கவனம்; மாமனாரிடம் மரியாதை; நிலையான மனம்.",
  },
  {
    house: 1, lagna: "Gemini", planetSign: "Gemini", planet: "Mars", page: 66,
    en: "Gains through physical labour, gets huge gains, gets some diseases and weakness in the body, restlessness in the house of mother, some hindrance in peace and happiness, keeps influence in the house of enemies, some anxiety in the house of wife, somewhat rash",
    ta: "உடல் உழைப்பால் பெரும் ஆதாயம்; சில நோய்கள், உடல் பலவீனம்; தாய் வகையில் அமைதியின்மை; மகிழ்ச்சிக்கு தடைகள்; எதிரிகள் இடத்தில் செல்வாக்கு; மனைவி பற்றி சிறு கவலை; சிறிது அவசரம்.",
  },
  {
    house: 1, lagna: "Gemini", planetSign: "Gemini", planet: "Mercury", page: 68,
    en: "Is very handsome and is of good body, has the strength of lands and buildings, strength from others, happy in the occupation, gets honour, self-knowledge, happiness from wife and happy",
    ta: "மிக அழகானவர், நல்ல உடல்; நிலம், கட்டிடத்தால் வலிமை; பிறரிடம் இருந்து பலம்; தொழிலில் மகிழ்ச்சி; மரியாதை; சுய அறிவு; மனைவியால் மகிழ்ச்சி.",
  },
  {
    house: 1, lagna: "Gemini", planetSign: "Gemini", planet: "Jupiter", page: 70,
    en: "Gets importance in the house of wife, has an occupation which gives special importance, help from father, gains from government and society, gets strength of children, gains good education, gets good healthy body, works hard",
    ta: "மனைவி வழியில் முக்கியத்துவம்; சிறப்புப் பதவி தரும் தொழில்; தந்தையின் ஆதரவு; அரசு, சமூகத்தில் ஆதாயம்; குழந்தைகளின் பலம்; நல்ல கல்வி; ஆரோக்கியமான உடல்; கடின உழைப்பு.",
  },
  {
    house: 1, lagna: "Gemini", planetSign: "Gemini", planet: "Venus", page: 72,
    en: "Healthy body, has strength of mind, clever, deficiency with regard to loss of children, speaks much on wife and sexual pleasures",
    ta: "ஆரோக்கியமான உடல்; மன வலிமை; திறமையானவர்; குழந்தைகளை இழக்கும் குறை; மனைவி, பாலியல் இன்பம் பற்றி அதிகம் பேசுவார்.",
  },
  {
    house: 1, lagna: "Gemini", planetSign: "Gemini", planet: "Saturn", page: 74,
    en: "Fortunate, worries about progress, good longevity, worry in the house of brothers and sisters",
    ta: "அதிர்ஷ்டசாலி; முன்னேற்றம் பற்றிய கவலை; நீண்ட ஆயுள்; சகோதர சகோதரிகள் வகையில் கவலை.",
  },
  {
    house: 1, lagna: "Gemini", planetSign: "Gemini", planet: "Rahu", page: 76,
    en: "Gets tall stature, follows deep and bitter policies in heart, has self- pride, succeeds in getting fame, moves his ideas more than necessary beyond limit, has spiritual knowledge",
    ta: "உயரமான உடல்; இதயத்தில் ஆழமான, கசப்பான கொள்கைகள்; தன்னம்பிக்கை மிகுதி; புகழ் பெறுவார்; எண்ணங்களை அளவுக்கு மீறி பரப்புவார்; ஆன்மிக அறிவு.",
  },
  {
    house: 1, lagna: "Gemini", planetSign: "Gemini", planet: "Ketu", page: 78,
    en: "Great weakness and anxiety in the body, deficiency of beauty, sometimes gets some fatal stroke or danger to body, feels weakness in heart, has great sense of patience, secretive and obstinate fellow",
    ta: "உடலில் பெரும் பலவீனமும் கவலையும்; அழகில் குறை; சில நேரம் உயிருக்கு ஆபத்தான அடி; இதயத்தில் பலவீனம்; மிகுந்த பொறுமை; ரகசியமானவர், பிடிவாதம்.",
  },
  {
    house: 1, lagna: "Cancer", planetSign: "Cancer", planet: "Sun", page: 82,
    en: "Is dignified and wealthy, glorious, some dullness in the gains from the side of wife and occupational pursuits and in addition feels some hindrances also, possesses family",
    ta: "செல்வமும் கௌரவமும்; மனைவி வழி வருமானத்தில் மந்தம், தொழிலிலும் தடைகள்; குடும்பம் அமையும்.",
  },
  {
    house: 1, lagna: "Cancer", planetSign: "Cancer", planet: "Moon", page: 85,
    en: "Is of fair complexion and symmetrical body, can control the desires, is a stable person, has self-respect, pays final attention to the family circumstances, day-to-day affairs and occupation, wants and gets pleasures, is respected, acts according to his own will, lives independent, some problem in the house of wife, is famous and is of stable mind",
    ta: "நல்ல நிறம், சீரான உடல்; ஆசைகளைக் கட்டுப்படுத்துவார்; நிலையான குணம்; சுயமரியாதை; குடும்பம், தொழில் மீது கவனம்; மரியாதை பெறுவார்; சுதந்திரமானவர்; மனைவி வழியில் சில சிக்கல்; புகழ்; நிலையான மனம்.",
  },
  {
    house: 1, lagna: "Cancer", planetSign: "Cancer", planet: "Mars", page: 87,
    en: "Is not influential, does not get good respect from parents, pays great attention to occupation, some respect in the house of wife, unhappy with children, lacks in education, dullness in life, wants some sexual pleasures",
    ta: "செல்வாக்கு குறைவு; பெற்றோரிடம் நல்ல மரியாதை இல்லை; தொழிலில் அதிக கவனம்; மனைவி வழியில் சில மரியாதை; குழந்தைகளால் அதிருப்தி; கல்வியில் குறை; வாழ்வில் சலிப்பு; சில பாலியல் ஆசை.",
  },
  {
    house: 1, lagna: "Cancer", planetSign: "Cancer", planet: "Mercury", page: 89,
    en: "Has a good physique, spends majestically, is a businessman and courageous, much strength in occupation and domestic affairs, some deficiency in the house of brothers and sisters, is respectable, goes to foreign countries",
    ta: "நல்ல உடல்; பெருமையுடன் செலவு செய்வார்; வணிகர், தைரியசாலி; தொழிலிலும் குடும்பத்திலும் வலிமை; உடன்பிறப்பு வகையில் சிறு குறை; மரியாதைக்குரியவர்; வெளிநாடு செல்வார்.",
  },
  {
    house: 1, lagna: "Cancer", planetSign: "Cancer", planet: "Jupiter", page: 91,
    en: "Is self-conscious, dignified, fortunate, virtuous, brave in heart, likes justice and truth, understands Dharma and vice very much, gets great respect, is of golden complexion and handsome, is very intelligent and has broad forehead, is of tall stature, has children, some deficiency in sexual pleasures, is a bit careless regarding family, has the power of influence, is learned and loves strongly, very clever, defeats his enemies",
    ta: "தன்னுணர்வும் கௌரவமும் அதிர்ஷ்டமும் நல்லொழுக்கமும்; இதயத்தில் தைரியம்; நீதியையும் உண்மையையும் விரும்புவார்; தர்மத்தையும் தீமையையும் நன்கு அறிவார்; மிகுந்த மரியாதை; அழகும் பொன்னிறமும்; அறிவாளி; குழந்தைகள்; பாலியல் இன்பத்தில் சிறு குறை; குடும்பத்தில் சிறிது அசட்டை; கற்றவர்; பகைவரை வெல்வார்.",
  },
  {
    house: 1, lagna: "Cancer", planetSign: "Cancer", planet: "Venus", page: 93,
    en: "Gets power of mother, keeps the body handsome and in comfort, gets buildings and property, gets happiness in the house of wife, gains and happiness in the daily occupation, calm nature and success in family and worldly affairs",
    ta: "தாயின் ஆதரவு; அழகான உடல், வசதி; நிலம், சொத்து; மனைவி வழியில் மகிழ்ச்சி; தொழிலில் ஆதாயம்; அமைதியான குணம்; குடும்ப, உலக விவகாரங்களில் வெற்றி.",
  },
  {
    house: 1, lagna: "Cancer", planetSign: "Cancer", planet: "Saturn", page: 95,
    en: "Pursues daily occupation diligently, good longevity, not satisfied with wife, works with high and obscure tactics in connection with sexual pleasures, hardships in connection with occupation, carelessness in the house of government and in the house of father, avaricious and careless",
    ta: "அன்றாட தொழிலில் கடின உழைப்பு; நீண்ட ஆயுள்; மனைவியிடம் திருப்தி குறைவு; பாலியல் விஷயத்தில் மறைமுக வழிகள்; தொழிலில் சிரமங்கள்; அரசு, தந்தை வகையில் அசட்டை; பேராசையும் அசட்டையும்.",
  },
  {
    house: 1, lagna: "Cancer", planetSign: "Cancer", planet: "Rahu", page: 97,
    en: "Some deficiency and some calamity in the body, mental distress, anxiety in his thoughts, struggles for the rise in the happiness",
    ta: "உடலில் சில குறைகளும் ஆபத்தும்; மனத் துன்பம்; எண்ணங்களில் கவலை; மகிழ்ச்சி உயர போராட்டம்.",
  },
  {
    house: 1, lagna: "Cancer", planetSign: "Cancer", planet: "Ketu", page: 99,
    en: "Weakness in the body, emaciation in physique, some fatal trouble, is courageous and obstinate",
    ta: "உடல் பலவீனம், மெலிந்த தோற்றம்; சில ஆபத்தான துன்பம்; தைரியமும் பிடிவாதமும்.",
  },
  {
    house: 1, lagna: "Leo", planetSign: "Leo", planet: "Sun", page: 104,
    en: "Great dignity, gets fame, majestic and of tall stature, is very much conceited and haughty, does not show interest in occupation and domestic affairs, opposition in sexual pleasures, and is brave",
    ta: "பெரும் கௌரவம், புகழ், கம்பீரமும் உயரமும்; கர்வமும் திமிரும்; தொழில், குடும்ப விஷயங்களில் ஆர்வம் குறைவு; பாலியல் இன்பத்தில் தடை; துணிச்சலானவர்.",
  },
  {
    house: 1, lagna: "Leo", planetSign: "Leo", planet: "Moon", page: 106,
    en: "Possesses the power to travel to various places, some weakness in the body, spends majestically and influentially, some weakness in the daily occupation and in the house of wife, is of weak heart and suspicious mind",
    ta: "பல இடங்களுக்கு பயணம் செய்யும் ஆற்றல்; உடலில் சில பலவீனம்; ஆடம்பரமாகவும் செல்வாக்குடனும் செலவு; தொழிலிலும் மனைவி வழியிலும் சிறு பலவீனம்; பலவீனமான இதயம், சந்தேக மனம்.",
  },
  {
    house: 1, lagna: "Leo", planetSign: "Leo", planet: "Mars", page: 108,
    en: "Gets land and property, gets an ideal mother, gets very high means and influence to acquire happiness, has a good physique, dullness in the house of wife, family and daily occupation",
    ta: "நிலம், சொத்து; இலட்சிய தாய்; மகிழ்ச்சி அடைய பெரும் வசதியும் செல்வாக்கும்; நல்ல உடல்; மனைவி, குடும்பம், தினசரி தொழிலில் மந்தம்.",
  },
  {
    house: 1, lagna: "Leo", planetSign: "Leo", planet: "Mercury", page: 110,
    en: "Gets heavy gains and much wealth, gets great success in daily occupation, great advantage in the house of wife, great success in worldly affairs and of sexual pleasures, is respectable and clever",
    ta: "பெரும் ஆதாயமும் செல்வமும்; தொழிலில் சிறந்த வெற்றி; மனைவி வழியில் பெரும் நன்மை; உலக விவகாரங்களிலும் பாலியல் இன்பத்திலும் வெற்றி; மரியாதைக்குரியவர், திறமையானவர்.",
  },
  {
    house: 1, lagna: "Leo", planetSign: "Leo", planet: "Jupiter", page: 112,
    en: "Gets good longevity and acquires much education, gets the strength of the children, spends the daily routine of his life with eminence, some deficiency in handsomeness, shows great scholarship, insipidness in family environment",
    ta: "நீண்ட ஆயுள்; நிறைய கல்வி; குழந்தைகளின் வலிமை; சிறப்புடன் தினசரி வாழ்க்கை; அழகில் சிறு குறை; சிறந்த புலமை; குடும்பச் சூழலில் சுவையின்மை.",
  },
  {
    house: 1, lagna: "Leo", planetSign: "Leo", planet: "Venus", page: 114,
    en: "Works much with his strength and energy, gets honour and progress in trade and occupation, honour and strength in the house of wife and special powers and sexual pleasures, exerts a bit hard for securing the rise of honour in government and society, gets his work done tactfully, and is very industrious",
    ta: "தன் பலத்தாலும் ஆற்றலாலும் அதிகம் உழைப்பார்; தொழிலிலும் வியாபாரத்திலும் மரியாதையும் முன்னேற்றமும்; மனைவி வழியில் மரியாதையும் வலிமையும்; சிறப்பு ஆற்றல், பாலியல் இன்பம்; அரசு, சமூகத்தில் மரியாதைக்கு சிறிது முயற்சி; தந்திரமாக வேலை முடிப்பார்; மிகுந்த உழைப்பாளி.",
  },
  {
    house: 1, lagna: "Leo", planetSign: "Leo", planet: "Saturn", page: 116,
    en: "Pursues some laborious daily occupation through his body, happiness in the house of family and wife, gets some diseases, special conjunction of sexual passions, great vigour in the way of progress and works with the power of hard labour and tactics",
    ta: "உடலால் கடின உழைப்பு; குடும்ப, மனைவி வகையில் மகிழ்ச்சி; சில நோய்கள்; பாலியல் ஆர்வம் மிகுதி; முன்னேற்றத்தில் பெரும் முயற்சி; கடின உழைப்பும் தந்திரமும்.",
  },
  {
    house: 1, lagna: "Leo", planetSign: "Leo", planet: "Rahu", page: 118,
    en: "Weakness in body, some anxiety and some stress in the brain, feels inner fear, selfish and keeps influence",
    ta: "உடல் பலவீனம்; மூளையில் சிறு கவலையும் அழுத்தமும்; உள்ளார்ந்த பயம்; சுயநலம்; செல்வாக்கு வைத்திருப்பார்.",
  },
  {
    house: 1, lagna: "Leo", planetSign: "Leo", planet: "Ketu", page: 120,
    en: "Some weakness in the body, death like danger in the body, does hard physical labour, is courageous, proud, possesses the great power of sexual pleasures, and labours very hard",
    ta: "உடல் பலவீனம், மரண ஆபத்து போன்ற நிலை; கடின உடல் உழைப்பு; தைரியம், பெருமை; பாலியல் இன்பத்தில் பெரும் ஆற்றல்; மிகக் கடினமாக உழைப்பார்.",
  },
  {
    house: 1, lagna: "Virgo", planetSign: "Virgo", planet: "Sun", page: 125,
    en: "Spends much, is of weak and emaciated body, manages his expenditure by physical labour, conducts the daily occupation with the power of expenditure, gets weakness in the house of wife, gets some losses and weakness in occupation, is haughty",
    ta: "அதிகம் செலவழிப்பார்; உடல் பலவீனம், மெலிவு; உடல் உழைப்பால் செலவை சமாளிப்பார்; மனைவி வகையில் குறை; தொழிலில் இழப்பும் பலவீனமும்; பெருமை.",
  },
  {
    house: 1, lagna: "Virgo", planetSign: "Virgo", planet: "Moon", page: 127,
    en: "Gets gains with physical and mental happiness, is handsome, is of calm nature, gets a beautiful wife, gains heavily in the occupation, gets all pleasures and enjoyments, is much respected, is of delightful nature, is interested in the house of wife, gains from the house of father-in-law, is very careful about income and daily occupation, wants special sexual pleasures",
    ta: "உடல், மன மகிழ்ச்சி; அழகானவர்; அமைதியான குணம்; அழகான மனைவி; தொழிலில் பெரும் ஆதாயம்; எல்லா இன்பங்களும்; மிகுந்த மரியாதை; இனிய குணம்; மனைவி வழியில் அக்கறை; மாமனாரிடம் ஆதாயம்; வருமானத்தில் கவனம்; சிறப்பு பாலியல் இன்பம்.",
  },
  {
    house: 1, lagna: "Virgo", planetSign: "Virgo", planet: "Mars", page: 129,
    en: "Gets a long life, feels some distress the body, is very powerful, some loss in the house of mother, feels some distress in the side of wife, gets some efficiency and cooperation on the side of brothers and sisters",
    ta: "நீண்ட ஆயுள்; உடலில் சில துன்பம்; மிகுந்த வலிமை; தாய் வகையில் சிறு இழப்பு; மனைவி வகையில் சிறு துன்பம்; உடன்பிறப்புகளிடம் சிறு ஒத்துழைப்பு.",
  },
  {
    house: 1, lagna: "Virgo", planetSign: "Virgo", planet: "Mercury", page: 131,
    en: "Is tall and of symmetrical nature, enjoys the royal grandeur, is very influential, progress from the house of father, conducts business, some deficiency in the side of wife, gets some deficiency on the side of sexual pleasures, is very clever, wise and skilful, is a great politician, is diligent and has good manners",
    ta: "உயரமும் சீரான அமைப்பும்; அரச வாழ்வு; மிகுந்த செல்வாக்கு; தந்தை வழியில் முன்னேற்றம்; வணிகம் செய்வார்; மனைவி, பாலியல் இன்பத்தில் சில குறைகள்; மிகத் திறமையானவர், அறிவாளி; சிறந்த அரசியல் அறிவு; கடின உழைப்பு; நல்ல பழக்கவழக்கம்.",
  },
  {
    house: 1, lagna: "Virgo", planetSign: "Virgo", planet: "Jupiter", page: 133,
    en: "Gets domestic happiness, gets a very clever wife, gets the pleasant occupation, is thought to be fortunate, is careful about Dharma and also in family affairs, feels some deficiency in the side of children, some weakness in wisdom and education, intellectual worries due to the reasons of family regarding wife, is of fat body, is the owner of property, is very clever and happy",
    ta: "குடும்ப மகிழ்ச்சி; மிகத் திறமையான மனைவி; இனிய தொழில்; அதிர்ஷ்டசாலி என்று கருதப்படுவார்; தர்மத்திலும் குடும்ப விவகாரத்திலும் கவனம்; குழந்தைகள் வகையில் சிறு குறை; அறிவிலும் கல்வியிலும் சிறு பலவீனம்; மனைவி பற்றிய குடும்பக் கவலைகள்; பருத்த உடல்; சொத்துக்கு உரிமையாளர்; மிகத் திறமையானவர், மகிழ்ச்சியானவர்.",
  },
  {
    house: 1, lagna: "Virgo", planetSign: "Virgo", planet: "Venus", page: 136,
    en: "Some weakness in body, gets some deficiency in wealth, gets a fortunate wife, pursues a big daily occupation, gets excess in enjoying the sexual pleasures, progress in occupation after marriage",
    ta: "உடலில் சிறு பலவீனம்; செல்வத்தில் சிறு குறை; அதிர்ஷ்டமான மனைவி; பெரிய தினசரி தொழில்; பாலியல் இன்பத்தில் மிகுதி; திருமணத்துக்குப் பின் தொழில் முன்னேற்றம்.",
  },
  {
    house: 1, lagna: "Virgo", planetSign: "Virgo", planet: "Saturn", page: 138,
    en: "Is victorious, serious and is of deep intricate policies, gets able children and also the education, gets progress in connection with daily occupation, some enmity and some separation in the side of children, some illness in the body",
    ta: "வெற்றியாளர், தீவிரமானவர், ஆழமான தந்திர நெறிகள்; திறமையான குழந்தைகளும் கல்வியும்; தினசரி தொழிலில் முன்னேற்றம்; குழந்தைகள் வகையில் சில பகையும் பிரிவும்; உடலில் சில நோய்.",
  },
  {
    house: 1, lagna: "Virgo", planetSign: "Virgo", planet: "Rahu", page: 140,
    en: "Talks very cunningly and cleverly, keeps his influence, gets much success due to occult power, bears some trouble in the body, keeps great care in the house of wife and occultism, and labours hard",
    ta: "மிகவும் தந்திரமாகவும் சாமர்த்தியமாகவும் பேசுவார்; செல்வாக்கு வைத்திருப்பார்; மறை ஞானத்தால் நிறைய வெற்றி; உடலில் சில தொல்லை; மனைவி, மறைக்கலை விஷயங்களில் அதிக கவனம்; கடினமாக உழைப்பார்.",
  },
  {
    house: 1, lagna: "Virgo", planetSign: "Virgo", planet: "Ketu", page: 142,
    en: "Is much self-conceited, gets weakness in the body, experiences some weakness of a special kind in his body, keeps firmness in outward show, is very clever, respectable, works rashly",
    ta: "மிகுந்த தன்னம்பிக்கை; உடல் பலவீனம்; உடலில் சிறப்பு வகை பலவீனம்; வெளித்தோற்றத்தில் உறுதி; மிகவும் அறிவாளி, மரியாதைக்குரியவர்; அவசரமாக வேலை செய்வார்.",
  },
  {
    house: 1, lagna: "Libra", planetSign: "Libra", planet: "Sun", page: 146,
    en: "Gets the income through physical labour but gets some weakness in income and physique also, gets firmness in the daily occupation, special gains in the house of wife and family, gets special sexual pleasures, is of lean and thin body",
    ta: "உடல் உழைப்பால் வருமானம், வருமானத்தில் சிறு பலவீனம்; உடலிலும் குறை; தினசரி தொழிலில் உறுதி; மனைவி, குடும்ப வகையில் சிறப்பு ஆதாயம்; சிறப்பு பாலியல் இன்பம்; ஒல்லியான, மெலிந்த உடல்.",
  },
  {
    house: 1, lagna: "Libra", planetSign: "Libra", planet: "Moon", page: 148,
    en: "Dignified, majestic and respected, gets progress in the house of father, enjoys high class sexual pleasures, gets the happiness of wife, works very majestically in connection with occupation, gets honour in government and society",
    ta: "கம்பீரமும் மரியாதையும்; தந்தை வீட்டில் முன்னேற்றம்; உயர்தர பாலியல் இன்பம்; மனைவியால் மகிழ்ச்சி; தொழிலில் கம்பீரமாக செயல்படுவார்; அரசு, சமூகத்தில் மரியாதை.",
  },
  {
    house: 1, lagna: "Libra", planetSign: "Libra", planet: "Mars", page: 150,
    en: "Is very rich and respectable, gets emaciation in his physique, pursues valuable occupation, gets very able and beautiful wife, gets ideal pleasures, gets great happiness, gets the household profits, buildings, etc",
    ta: "மிகுந்த செல்வமும் மரியாதையும்; உடல் மெலிவு; மதிப்புமிக்க தொழில்; மிகத் திறமையான அழகான மனைவி; சிறந்த இன்பங்கள்; பெரும் மகிழ்ச்சி; வீடு, கட்டிடம் மூலம் ஆதாயம்.",
  },
  {
    house: 1, lagna: "Libra", planetSign: "Libra", planet: "Mercury", page: 152,
    en: "Fortunate, enjoys the happiness of physique, has a thin and lean body, enjoys domestic happiness in connection with wife, gets success in occupation, is very clever, is very wise and does justice, is influential, and is of tender nature",
    ta: "அதிர்ஷ்டசாலி; உடல் இன்பம்; மெலிந்த உடல்; மனைவியுடன் குடும்ப மகிழ்ச்சி; தொழிலில் வெற்றி; மிகுந்த அறிவாளி, ஞானி, நீதி செய்பவர்; செல்வாக்குள்ளவர்; மென்மையான குணம்.",
  },
  {
    house: 1, lagna: "Libra", planetSign: "Libra", planet: "Jupiter", page: 154,
    en: "Does very influential deeds, has great courage, does hard physical labour, is very wise and follows shrewd policies, follows occupation tactfully, is careful about religious behaviour, gets some enmity in the house of children, dignity in the side of wife",
    ta: "செல்வாக்குள்ள செயல்கள்; பெரும் தைரியம்; கடின உடல் உழைப்பு; மிகுந்த ஞானம், புத்திசாலித்தனமான வழிகள்; தொழிலை சாமர்த்தியமாகச் செய்வார்; மதக் கடமைகளில் கவனம்; குழந்தைகள் வகையில் சில பகை; மனைவி வழியில் மரியாதை.",
  },
  {
    house: 1, lagna: "Libra", planetSign: "Libra", planet: "Venus", page: 156,
    en: "Gets non-cooperation in his progress, gets a long life, is very respectable, gets fame, gets some weakness in the body, has very good knowledge of self, is farsighted, is a diplomat and is influential",
    ta: "முன்னேற்றத்தில் ஒத்துழைப்பின்மை; நீண்ட ஆயுள்; மிகுந்த மரியாதை; புகழ்; உடலில் சிறு பலவீனம்; சுய அறிவு மிக்கவர்; தூரநோக்குடையவர்; இராஜதந்திரி; செல்வாக்குள்ளவர்.",
  },
  {
    house: 1, lagna: "Libra", planetSign: "Libra", planet: "Saturn", page: 158,
    en: "Is of very handsome physique, enjoys pleasures very much, gets much education, is very wise, influential, diligent and pays attention towards a big business, faces troubles with wife in domestic affairs due to speech and intellect, some deficiency in the side of sexual pleasures and in the sphere of wife, gets much pleasure and happiness of property, possesses self-pride",
    ta: "அழகான உடல்; இன்பங்களை மிகவும் அனுபவிப்பார்; மிகுந்த கல்வி; ஞானி, செல்வாக்கு, உழைப்பாளி; பெரிய வியாபாரத்தில் கவனம்; பேச்சாலும் அறிவாலும் மனைவியுடன் சிக்கல்கள்; பாலியல், மனைவி துறையில் சில குறை; சொத்தால் மகிழ்ச்சி; தன்னம்பிக்கை மிக்கவர்.",
  },
  {
    house: 1, lagna: "Libra", planetSign: "Libra", planet: "Rahu", page: 160,
    en: "Gets the work done with great tactics and cleverness, is very cautious, physically and mentally worried, gets some fame, bears special blows on body, becomes nervous",
    ta: "திறமையான தந்திரத்தால் வேலை முடிப்பார்; மிகவும் எச்சரிக்கையானவர்; உடலும் மனமும் கவலையுற்றவர்; சிறு புகழ்; உடலில் சிறப்பான அடிகள்; பதற்றம்.",
  },
  {
    house: 1, lagna: "Libra", planetSign: "Libra", planet: "Ketu", page: 162,
    en: "Some weakness in body, some incompleteness in himself, lives in a manner of pride and bravery, works in hardships, stays permanently at his place and pursues his work, is obstinate",
    ta: "உடலில் சிறு பலவீனம்; தன்னிடம் சில குறைகள்; பெருமையும் தைரியமும்; கஷ்டங்களில் வேலை செய்வார்; நிலையாக தன் இடத்தில் தங்கி வேலை செய்வார்; பிடிவாதம்.",
  },
  {
    house: 1, lagna: "Scorpio", planetSign: "Scorpio", planet: "Sun", page: 167,
    en: "Gets royal grandeur, is very glorious and influential, gets much pride, gets his work done by order, some deficiency in the house of wife, gets sexual pleasures, gets the power in the house of father, conducts a very big business, wears beautiful garments and ornaments, does the occupation with grandeur and pride",
    ta: "அரச செல்வமும் பெருமையும்; மிகுந்த கர்வம்; ஆணையின்படி வேலை முடியும்; மனைவி வகையில் சிறு குறை; பாலியல் இன்பம்; தந்தை வழியில் அதிகாரம்; பெரிய வியாபாரம் நடத்துவார்; அழகான ஆடை, ஆபரணங்கள்.",
  },
  {
    house: 1, lagna: "Scorpio", planetSign: "Scorpio", planet: "Moon", page: 170,
    en: "Gets mental anxieties and some weakness of destiny, toils hard for the occupation, gets a lean body, takes lull care of the family, has special mental fascination in wife and in the side of sexual pleasures etc, progresses in connection with occupation by mental power and the power of destiny, rears Dharma incompletely",
    ta: "மன கவலைகளும் விதியின் சிறு பலவீனமும்; தொழிலுக்கு கடின உழைப்பு; மெலிந்த உடல்; குடும்பத்தை மிகவும் கவனிப்பார்; மனைவியிலும் பாலியல் விஷயங்களிலும் மன ஈர்ப்பு; மன வலிமையாலும் விதியாலும் தொழிலில் முன்னேற்றம்; தர்மத்தை முழுமையாகக் கடைப்பிடிக்க மாட்டார்.",
  },
  {
    house: 1, lagna: "Scorpio", planetSign: "Scorpio", planet: "Mars", page: 172,
    en: "Is influential and possesses a short body, is furious and proud, some disorder in the body due to heat in the shape of some diseases, faces loss of mother, gets difficulties about buildings and in peace and happiness, gets some restlessness and distress in the house of wife, bears some difficulties in occupation, is very courageous",
    ta: "செல்வாக்கு; குட்டையான உடல்; கோபமும் பெருமையும்; வெப்பத்தால் உடலில் கோளாறு; தாயை இழக்க நேரும்; கட்டிடம், அமைதி, மகிழ்ச்சியில் சிரமம்; மனைவி வழியில் தொந்தரவு; தொழிலில் சில சிரமம்; மிகத் துணிச்சலானவர்.",
  },
  {
    house: 1, lagna: "Scorpio", planetSign: "Scorpio", planet: "Mercury", page: 174,
    en: "Gets gains and income, is of gentle behaviour and gentle nature, has a long life, gains in occupation, takes full care of family through the power of income",
    ta: "ஆதாயமும் வருமானமும்; மென்மையான நடத்தையும் குணமும்; நீண்ட ஆயுள்; தொழிலில் ஆதாயம்; வருமான வலிமையால் குடும்பத்தை முழுமையாகக் கவனிப்பார்.",
  },
  {
    house: 1, lagna: "Scorpio", planetSign: "Scorpio", planet: "Jupiter", page: 176,
    en: "Is very wise, learned, religious and is a diplomat, gets the strength of wealth, gets children, gets progress through son, takes great care of family and occupation, loves justice, loves astrology, possesses spiritual knowledge, influential, keeps faith in God",
    ta: "மிகுந்த ஞானம், கல்வி, மதப்பற்று; இராஜதந்திரி; செல்வத்தின் வலிமை; குழந்தைகள்; மகன் வழியில் முன்னேற்றம்; குடும்பத்தையும் தொழிலையும் கவனிப்பார்; நீதியை விரும்புவார்; ஜோதிடத்தில் ஆர்வம்; ஆன்மிக அறிவு; கடவுள் நம்பிக்கை; செல்வாக்குள்ளவர்.",
  },
  {
    house: 1, lagna: "Scorpio", planetSign: "Scorpio", planet: "Venus", page: 178,
    en: "Gets a good occupation, spends majestically, works very carefully, acquires some happiness in the house of wife, spends much, gets some weakness on account of wife, goes from place to place due to occupation, gets honour, is clever and wants to enjoy pleasures of high standard, conducts the worldly affairs very ably, is skilful, careful and farsighted, likes beauty",
    ta: "நல்ல தொழில்; கம்பீரமாக செலவு; மிகக் கவனமாக வேலை; மனைவியால் சிறு மகிழ்ச்சி; நிறைய செலவு; மனைவி வகையில் சிறு பலவீனம்; தொழிலுக்காக ஊர்விட்டு ஊர் செல்வார்; மரியாதை; உயர்தர இன்பங்களை விரும்புவார்; உலக விவகாரங்களை திறமையாக நடத்துவார்; தூரநோக்குள்ளவர்; அழகை விரும்புவார்.",
  },
  {
    house: 1, lagna: "Scorpio", planetSign: "Scorpio", planet: "Saturn", page: 180,
    en: "Is very energetic and zealous, gets the power of brothers and sisters, acquires progress in occupation, some perplexity in the house of government and big business, possesses pungency, wants sexual pleasures, labours hard for progress, is industrious and courageous",
    ta: "மிகுந்த ஆற்றலும் ஆர்வமும்; சகோதர சகோதரிகளின் பலம்; தொழிலில் முன்னேற்றம்; அரசு, பெரிய வியாபாரத்தில் சில குழப்பம்; கூர்மையான பேச்சு; பாலியல் இன்பத்தை விரும்புவார்; முன்னேற்றத்துக்கு கடின உழைப்பு; உழைப்பாளி, தைரியசாலி.",
  },
  {
    house: 1, lagna: "Scorpio", planetSign: "Scorpio", planet: "Rahu", page: 182,
    en: "Gets emaciated physique, gets physical shocks many times, unable to maintain the gentle nature, undertakes very strong tactics to acquire some great power, is very courageous and clever",
    ta: "மெலிந்த உடல்; பல முறை உடல் அதிர்ச்சி; மென்மையான குணத்தைக் காக்க முடியாதவர்; பெரும் சக்தி பெற வலிமையான தந்திரங்கள்; மிகுந்த தைரியமும் சாமர்த்தியமும்.",
  },
  {
    house: 1, lagna: "Scorpio", planetSign: "Scorpio", planet: "Ketu", page: 184,
    en: "Gets weakness and wounds in the body, has great patience in his heart, does not care for anybody before his excessive strength, is of heroic nature, feels the deficiency of knowledge, possesses sensual power very much, bears more troubles, is anxious and solemn",
    ta: "உடலில் பலவீனமும் காயங்களும்; இதயத்தில் பெரும் பொறுமை; தன் பலத்தை முன்னிட்டு யாரையும் மதிக்காதவர்; வீர குணம்; அறிவு குறைவாக உணர்வார்; புலனின்பத்தில் மிகுந்த ஆற்றல்; மேலும் துன்பங்கள்; கவலையும் கம்பீரமும்.",
  },
  {
    house: 1, lagna: "Sagittarius", planetSign: "Sagittarius", planet: "Sun", page: 189,
    en: "Is very fortunate and handsome, follows Dharma and benevolence, possesses faith in God, gets success in occupation, has influence in the matters connected with wife and family also, is very influential and illustrious",
    ta: "மிக அதிர்ஷ்டசாலி, அழகானவர்; தர்மத்தையும் கருணையையும் கடைப்பிடிப்பார்; கடவுள் நம்பிக்கை; தொழிலில் வெற்றி; மனைவி, குடும்ப விஷயங்களிலும் செல்வாக்கு; மிகுந்த செல்வாக்கும் புகழும்.",
  },
  {
    house: 1, lagna: "Sagittarius", planetSign: "Sagittarius", planet: "Moon", page: 191,
    en: "Has a long life, experiences some weakness and deficiency in the handsomeness of the body, gets some worries in occupation, bears some perplexity in the house of wife",
    ta: "நீண்ட ஆயுள்; உடலின் அழகில் சிறு பலவீனம்; தொழிலில் சில கவலைகள்; மனைவி வீட்டில் சிறு குழப்பம்.",
  },
  {
    house: 1, lagna: "Sagittarius", planetSign: "Sagittarius", planet: "Mars", page: 193,
    en: "Travels much, has a weak physique, does high standard tasks, gets work done by talking very cunningly and implicating others, experiences loss of mother, gets the conjunction of loss and distress in wife's house, laces great restlessness in the daily routine of life, spends much, has some deficiency in the children's side",
    ta: "நிறைய பயணம்; பலவீனமான உடல்; உயர்தர வேலைகள் செய்வார்; தந்திரமாகப் பேசி பிறரை சிக்க வைத்து வேலை முடிப்பார்; தாய் வகையில் இழப்பு; மனைவி வீட்டில் இழப்பும் துன்பமும்; தினசரி வாழ்வில் பெரும் அமைதியின்மை; அதிகம் செலவழிப்பார்; குழந்தைகள் வகையில் சிறு குறை.",
  },
  {
    house: 1, lagna: "Sagittarius", planetSign: "Sagittarius", planet: "Mercury", page: 195,
    en: "Conducts an elegant and dexterous occupation, is very industrious and also sinful, possesses good knowledge of worldly affairs and gets satisfactory success in worldly affairs, achieves honour in domestic affairs, gets an influential wife, faces loss in sexual pleasure and respect, has deficiency in the house of father, is very clever, intelligent and a good manager",
    ta: "நேர்த்தியும் சாமர்த்தியமும் உள்ள தொழில்; மிகுந்த உழைப்பாளி, ஆனால் பாவச் செயலும் உண்டு; உலக விவகாரங்களில் நல்ல அறிவு; குடும்பத்தில் மரியாதை; செல்வாக்குள்ள மனைவி; பாலியல் இன்பத்திலும் மரியாதையிலும் இழப்பு; தந்தை வகையில் குறை; திறமையான, அறிவாளியான நிர்வாகி.",
  },
  {
    house: 1, lagna: "Sagittarius", planetSign: "Sagittarius", planet: "Jupiter", page: 197,
    en: "Enjoys happiness and gets honour, possesses a bulky body, is respectable and loves peace, wants sweet and delicious food, gets happiness from wife, has a comfortable occupation, lives at his own place, gets the happiness of education and Dharma, gets children, is fortunate",
    ta: "மகிழ்ச்சியும் மரியாதையும்; பருமனான உடல்; மதிப்புக்குரியவர், அமைதியை விரும்புவார்; இனிப்பு உணவு விருப்பம்; மனைவியால் மகிழ்ச்சி; வசதியான தொழில்; சொந்த இடத்தில் வாழ்வு; கல்வி, தர்மத்தில் மகிழ்ச்சி; குழந்தைகள்; அதிர்ஷ்டசாலி.",
  },
  {
    house: 1, lagna: "Sagittarius", planetSign: "Sagittarius", planet: "Venus", page: 199,
    en: "Gets income due to his physical labours, gets some disease in body, pays great attention to his occupation, faces some perplexity and also advantage in the wife's house, earns very much, suppresses the enemies, wants ornamentation and joy",
    ta: "உடல் உழைப்பால் வருமானம்; உடலில் சில நோய்; தொழிலில் பெரும் கவனம்; மனைவி வீட்டில் சிக்கலும் ஆதாயமும்; நிறைய சம்பாதிப்பார்; எதிரிகளை அடக்குவார்; அலங்காரத்தையும் மகிழ்ச்சியையும் விரும்புவார்.",
  },
  {
    house: 1, lagna: "Sagittarius", planetSign: "Sagittarius", planet: "Saturn", page: 201,
    en: "Very energetic and industrious, increases wealth working diligently, gets the strength of brothers and sisters, some restlessness in his body, conducts a big business, gets the power of wife and father",
    ta: "மிகுந்த ஆற்றலும் உழைப்பும்; கடின உழைப்பால் செல்வம் பெருக்குவார்; சகோதர சகோதரிகளின் பலம்; உடலில் சில அமைதியின்மை; பெரிய வியாபாரம்; மனைவி, தந்தை வகையில் வலிமை.",
  },
  {
    house: 1, lagna: "Sagittarius", planetSign: "Sagittarius", planet: "Rahu", page: 203,
    en: "Bears physical distress and worry, gets the deficiency in handsomeness of body and sometimes bears physical blows, faces risk of his body, gets the work done with tactics, undertakes very difficult deeds for his progress, sometimes has to depend on others",
    ta: "உடல் துன்பமும் கவலையும்; உடலின் அழகில் குறை; சில நேரம் உடல் அடிகள்; உடலுக்கு ஆபத்து; தந்திரத்தால் வேலை முடிப்பார்; முன்னேற்றத்துக்கு மிகக் கடினமான செயல்கள்; சில நேரம் பிறரைச் சார்ந்திருக்க வேண்டும்.",
  },
  {
    house: 1, lagna: "Sagittarius", planetSign: "Sagittarius", planet: "Ketu", page: 205,
    en: "Is of tall stature, is brave, diligent and conceited, also superstitious and careless, gets deficiency in physical handsomeness, thinks himself to be great, has the power of concealment and bravery, is selfish",
    ta: "உயரமானவர், தைரியசாலி, கடின உழைப்பாளி; ஆனால் கர்வம், மூட நம்பிக்கை, கவனக்குறைவு; உடல் அழகில் குறை; தன்னை பெரியவராக நினைப்பார்; மறைக்கும் ஆற்றலும் வீரமும்; சுயநலம்.",
  },
  {
    house: 1, lagna: "Capricorn", planetSign: "Capricorn", planet: "Sun", page: 210,
    en: "Bears physical affliction and does difficult works, gets diseases like smallpox and syphilis, has a long life, has some restlessness in life, feces some calamity in the house of wife, bears some perplexity in the house of education, has some deficiency in charm and complexion, is haughty, and gets the power of concealment",
    ta: "உடல் துன்பமும் கடின வேலைகளும்; அம்மை, சிபிலிஸ் போன்ற நோய்கள்; நீண்ட ஆயுள்; வாழ்வில் சிறு அமைதியின்மை; மனைவி வீட்டில் சில ஆபத்து; கல்வியில் சிறு சிக்கல்; அழகிலும் நிறத்திலும் குறை; கர்வம்; மறைக்கும் ஆற்றல்.",
  },
  {
    house: 1, lagna: "Capricorn", planetSign: "Capricorn", planet: "Moon", page: 212,
    en: "Conducts the occupation through a high standard of concentration, has some deficiency in the beauty and happiness in wife's house, wants sexual pleasures very much and gets the same, is of white complexion, is very diligent",
    ta: "உயர்தர கவனத்துடன் தொழில் நடத்துவார்; மனைவி வீட்டில் அழகிலும் மகிழ்ச்சியிலும் குறை; பாலியல் இன்பத்தை மிகவும் விரும்பி அடைவார்; வெள்ளை நிறம்; மிகுந்த உழைப்பாளி.",
  },
  {
    house: 1, lagna: "Capricorn", planetSign: "Capricorn", planet: "Mars", page: 214,
    en: "Gets happiness very much, gets lot of property and gains, speciality in mother's house, gets deficiency in occupation and also from wife's house, deficiency in sexual pleasures, creates the means of happiness in the side of occupation and sexual pleasures Is self conceited and proud",
    ta: "மிகுந்த மகிழ்ச்சி, பெரும் சொத்து, ஆதாயம்; தாய் வீட்டில் சிறப்பு; தொழிலிலும் மனைவி வீட்டிலும் குறை; பாலியல் இன்பத்தில் குறை; தொழிலிலும் பாலியல் இன்பத்திலும் மகிழ்ச்சிக்கான வழி; தன்னம்பிக்கை மிக்கவர், பெருமை.",
  },
  {
    house: 1, lagna: "Capricorn", planetSign: "Capricorn", planet: "Mercury", page: 216,
    en: "Is clever, fortunate, gentle and influential, has faith in Dharma, gets victory over enemies, gets some ordinary diseases in physique, pursues the occupation, has ordinary liking for sexual pleasures",
    ta: "திறமையானவர், அதிர்ஷ்டசாலி, மென்மையானவர், செல்வாக்குள்ளவர்; தர்மத்தில் நம்பிக்கை; எதிரிகளை வெல்வார்; உடலில் சாதாரண நோய்கள்; தொழிலைக் கவனிப்பார்; பாலியல் இன்பத்தில் சாதாரண ஆர்வம்.",
  },
  {
    house: 1, lagna: "Capricorn", planetSign: "Capricorn", planet: "Jupiter", page: 218,
    en: "Bears physical troubles and has an emaciated body, has deficiency in expenditure, has weakness from the side of brothers and sisters, has deficiency in physical handsomeness, gets some elegance in the wife's house, acquires the progress of occupation, gains strength from children's side",
    ta: "உடல் துன்பமும் மெலிந்த உடலும்; செலவில் குறை; சகோதர சகோதரிகள் வகையில் பலவீனம்; உடல் அழகில் குறை; மனைவி வீட்டில் சிறு நயம்; தொழிலில் முன்னேற்றம்; குழந்தைகள் வகையில் பலம்.",
  },
  {
    house: 1, lagna: "Capricorn", planetSign: "Capricorn", planet: "Venus", page: 220,
    en: "Is very respectable, clever, wise and does very nice and high standard deeds, pursues big occupation, gets honour and advantage from father, gets advantage from the government, gets respect in public, does many occupations, enjoys the sexual pleasures and gets the happiness of children, likes beauty, and is very much a lover of astrology",
    ta: "மிகுந்த மரியாதை, திறமை, ஞானம்; மிக நல்ல, உயர்தரமான செயல்கள்; பெரிய தொழில்; தந்தை வழியில் மரியாதையும் ஆதாயமும்; அரசிடமிருந்து ஆதாயம்; பொதுவெளியில் மரியாதை; பல தொழில்கள்; பாலியல் இன்பமும் குழந்தைகளின் மகிழ்ச்சியும்; அழகை விரும்புவார்; ஜோதிடத்தில் பெரும் ஆர்வம்.",
  },
  {
    house: 1, lagna: "Capricorn", planetSign: "Capricorn", planet: "Saturn", page: 222,
    en: "Is very rich, lives aristocratically, wears costly dresses, gets progress from father's house, pursue a big business occupation, deficiency in brothers' house, gets name and honour in the society, gets some opposition in family and is honourable",
    ta: "மிகுந்த செல்வம், ஆடம்பர வாழ்வு, விலையுயர்ந்த ஆடை; தந்தை வீட்டு முன்னேற்றம்; பெரிய வணிகத் தொழில்; சகோதரர் வகையில் குறை; சமூகத்தில் பெயரும் மரியாதையும்; குடும்பத்தில் சில எதிர்ப்பு; மரியாதைக்குரியவர்.",
  },
  {
    house: 1, lagna: "Capricorn", planetSign: "Capricorn", planet: "Rahu", page: 224,
    en: "Bears some physical perplexity and feels a sort of intoxication, some deficiency in his body, finds the way of progress very cleverly and through the power of concealment, gets some firmness after bearing some worries, gets his work done through very gentle manner not caring for truth or falsehood",
    ta: "சில உடல் குழப்பமும் போதை போன்ற உணர்வும்; உடலில் சிறு குறை; மறைக்கும் ஆற்றலால் முன்னேற்றப் பாதையைத் தேடுவார்; கவலைகளுக்குப் பின் சிறு உறுதி; உண்மையையோ பொய்யையோ கருதாமல் மென்மையாக வேலை முடிப்பார்.",
  },
  {
    house: 1, lagna: "Capricorn", planetSign: "Capricorn", planet: "Ketu", page: 226,
    en: "Is very obstinate, gets wounds in the body, bears some physical worries, does not care about disrepute for acquiring the fame, does not care about the troubles, is physically passionate, gets his work done through secret means, is selfish",
    ta: "மிகவும் பிடிவாதமானவர்; உடலில் காயங்கள்; உடல் கவலைகள்; புகழுக்காக அவமானத்தைப் பொருட்படுத்தாதவர்; தொல்லைகளைக் கவனியாதவர்; உடல் ஆசை மிகுந்தவர்; மறைவான வழிகளில் வேலை முடிப்பார்; சுயநலம்.",
  },
  {
    house: 1, lagna: "Aquarius", planetSign: "Aquarius", planet: "Sun", page: 231,
    en: "Gets influential wife and pursues influential occupation, gets some weakness in the body, gets the power of enjoying sexual pleasures, gives much dignity to wife with some enmity, gets honour, possesses vigour, and feels unsatisfied even on accomplishing big tasks",
    ta: "செல்வாக்குள்ள மனைவியும் செல்வாக்குள்ள தொழிலும்; உடலில் சிறு பலவீனம்; பாலியல் இன்பம் அனுபவிக்கும் ஆற்றல்; மனைவிக்கு மிகுந்த கௌரவம், சிறு பகை; மரியாதை; வலிமை; பெரிய பணிகளை முடித்தாலும் திருப்தி இல்லாதவர்.",
  },
  {
    house: 1, lagna: "Aquarius", planetSign: "Aquarius", planet: "Moon", page: 234,
    en: "Gets honour through the power of concentration, suffers from physical perplexities and from cold, gets some mental disorder, faces struggle with wife, uses secret policies in the line of occupation",
    ta: "ஒருமுகப்பட்ட மனத்தால் மரியாதை; உடல் துன்பங்களும் குளிர் பாதிப்பும்; சில மன நோய்; மனைவியுடன் போராட்டம்; தொழிலில் மறைமுக வழிகள்.",
  },
  {
    house: 1, lagna: "Aquarius", planetSign: "Aquarius", planet: "Mars", page: 236,
    en: "Progresses due to the vigour of his body, uses good working power and courage, secures the association of father and brother in an ordinary way, faces uneasiness in the side of mother, acquires progress in occupation, achieves honour and good name with government and society, bears some perplexity in the wife's house, gets some seminal defects",
    ta: "உடல் வலிமையால் முன்னேற்றம்; நல்ல வேலைத் திறனும் தைரியமும்; தந்தை, சகோதரர் ஆதரவு சாதாரண அளவில்; தாய் வகையில் அசௌகரியம்; தொழிலில் முன்னேற்றம்; அரசு, சமூகத்தில் மரியாதையும் நல்ல பெயரும்; மனைவி வீட்டில் சிறு சிக்கல்; விந்து சம்பந்தமான குறைபாடு.",
  },
  {
    house: 1, lagna: "Aquarius", planetSign: "Aquarius", planet: "Mercury", page: 238,
    en: "Has a long life, spends the daily routine majestically, gets good education and wisdom, feces some perplexity in the side of children, has some friendship and some perplexity in the house of wife, uses shrewdness in business",
    ta: "நீண்ட ஆயுள்; நாள் வாழ்க்கை கம்பீரமாக; நல்ல கல்வியும் ஞானமும்; குழந்தைகள் வகையில் சில சிக்கல்; மனைவி வீட்டில் சில நட்பும் சிக்கலும்; வியாபாரத்தில் சாமர்த்தியம்.",
  },
  {
    house: 1, lagna: "Aquarius", planetSign: "Aquarius", planet: "Jupiter", page: 240,
    en: "Gets income and power of wealth by his diligence, gets the respect and honour of the body, gets advantage of children, education, utters good things, acquires the progress in destiny, gains from occupation, gets advantage in the house of wife, gets his wants satisfied, and is somewhat dependent",
    ta: "உழைப்பால் வருமானமும் செல்வ வலிமையும்; உடலில் மரியாதையும் கௌரவமும்; குழந்தைகள், கல்வியில் ஆதாயம்; நல்ல வார்த்தைகள் பேசுவார்; விதியில் முன்னேற்றம்; தொழிலில் ஆதாயம்; மனைவி வீட்டில் ஆதாயம்; ஆசைகள் நிறைவேறும்; சிறிது சார்ந்திருப்பவர்.",
  },
  {
    house: 1, lagna: "Aquarius", planetSign: "Aquarius", planet: "Venus", page: 242,
    en: "Enjoys happiness very much on account of his good luck, gets happiness from mother, gets lands and buildings, gets food, drink and clothes, rears the Dharma properly, gets the divine support and fame, gets the power of occupation and happiness of wife in connection with family with some enmity",
    ta: "நல்ல அதிர்ஷ்டத்தால் பெரும் மகிழ்ச்சி; தாயால் மகிழ்ச்சி; நிலமும் வீடும்; உணவு, பானம், உடை; தர்மத்தை சரியாகக் கடைப்பிடிப்பார்; தெய்வ ஆதரவும் புகழும்; தொழில் ஆற்றல்; மனைவி வகையில் மகிழ்ச்சி, சிறு பகை.",
  },
  {
    house: 1, lagna: "Aquarius", planetSign: "Aquarius", planet: "Saturn", page: 244,
    en: "Possesses will-power and self-respect, gets some fame, bears loss in the house of brother, faces affliction in the house of wife and father, gets weakness in occupation, business and prestige, gets weakness in the house of government and society",
    ta: "மன உறுதியும் சுயமரியாதையும்; சிறு புகழ்; சகோதரர் வகையில் இழப்பு; மனைவி, தந்தை வகையில் துன்பம்; தொழில், வியாபாரம், கௌரவத்தில் பலவீனம்; அரசு, சமூக வகையில் குறை.",
  },
  {
    house: 1, lagna: "Aquarius", planetSign: "Aquarius", planet: "Rahu", page: 246,
    en: "Gets some physical perplexity and faces some calamities, uses secret tactics, tries to work hard to acquire name and fame, is always busy in trying something to serve his selfishness",
    ta: "சில உடல் குழப்பமும் ஆபத்துகளும்; ரகசிய வழிகள்; பெயரும் புகழும் பெற கடினமாக உழைப்பார்; சுயநலத்துக்காக எதையாவது செய்வதில் எப்போதும் ஈடுபட்டிருப்பார்.",
  },
  {
    house: 1, lagna: "Aquarius", planetSign: "Aquarius", planet: "Ketu", page: 248,
    en: "Feels some deficiency in his body, does not care about the good or bad for others, is of firm determination",
    ta: "உடலில் குறை; பிறருக்கு நன்மையோ தீமையோ பற்றிக் கவலைப்படாதவர்; உறுதியான மனம்.",
  },
  {
    house: 1, lagna: "Pisces", planetSign: "Pisces", planet: "Sun", page: 253,
    en: "Is very influential and gets victory over enemies, faces some distress in the physique, experiences some bondage, is very haughty, experiences troubles in wife's house and some deficiency in the side of sexual pleasures, feces some hindrances in occupation, and is very industrious",
    ta: "மிகுந்த செல்வாக்கு; எதிரிகளை வெல்வார்; உடலில் சில துன்பம்; சில கட்டுப்பாடுகள்; மிகுந்த கர்வம்; மனைவி வீட்டில் துன்பம்; பாலியல் இன்பத்தில் சிறு குறை; தொழிலில் சில தடைகள்; மிகுந்த உழைப்பாளி.",
  },
  {
    house: 1, lagna: "Pisces", planetSign: "Pisces", planet: "Moon", page: 255,
    en: "Gets ideal strength of mind, has a peculiar splendour in education, has a dignity in speech, gets grandeur in children's side, gets beauty and satisfaction from wife, is attracted towards her, gets success in occupation, gets the strength of sexual pleasures, possesses hidden knowledge",
    ta: "சிறந்த மன வலிமை; கல்வியில் தனிச் சிறப்பு; பேச்சில் கௌரவம்; குழந்தைகள் வகையில் பெருமை; மனைவியால் அழகும் திருப்தியும்; அவரிடம் ஈர்ப்பு; தொழிலில் வெற்றி; பாலியல் இன்பத்தில் வலிமை; மறைந்த ஞானம்.",
  },
  {
    house: 1, lagna: "Pisces", planetSign: "Pisces", planet: "Mars", page: 257,
    en: "Gets wealth due to destiny, follows Dharma, is thought to be fortunate, gets lands, buildings and happiness from mother, gets good fortune from wife's side, maintains an aristocratic standard in the daily life, gets the pleasures of the family",
    ta: "விதியால் செல்வம்; தர்மத்தைப் பின்பற்றுவார்; அதிர்ஷ்டசாலி என்று கருதப்படுவார்; நிலம், வீடு, தாய் வழியில் மகிழ்ச்சி; மனைவி வீட்டில் நல்ல அதிர்ஷ்டம்; அன்றாட வாழ்வில் கம்பீர தரம்; குடும்ப இன்பங்கள்.",
  },
  {
    house: 1, lagna: "Pisces", planetSign: "Pisces", planet: "Mercury", page: 259,
    en: "Has a slim body, faces some deficiency in the happiness from mother, gets some weakness in buildings, lands and property, has some deficiency in wife's house, gets the progress in occupation after doing hard physical labour, enjoys more advantages in sexual affairs in an unjustified manner",
    ta: "மெலிந்த உடல்; தாய் வகையில் மகிழ்ச்சிக் குறை; நிலம், சொத்தில் சிறு பலவீனம்; மனைவி வீட்டில் சிறு குறை; கடின உடல் உழைப்புக்குப் பின் தொழில் முன்னேற்றம்; பாலியல் விஷயங்களில் நியாயமற்ற முறையில் அதிக ஆதாயம்.",
  },
  {
    house: 1, lagna: "Pisces", planetSign: "Pisces", planet: "Jupiter", page: 261,
    en: "Gets dignity, does ideal deeds, possesses a host of worldly and divine qualities, has a good physique, gets support from the father, gets good education, gets the special power of the children, gets honour in government and society, gets honour in wife's side, lives majestically and possesses great self-respect",
    ta: "கௌரவம்; சிறந்த செயல்கள்; உலகியல், தெய்வீக குணங்கள்; நல்ல உடல்; தந்தை ஆதரவு; நல்ல கல்வி; குழந்தைகளால் சிறப்பு; அரசு, சமூகத்தில் மரியாதை; மனைவி வழியிலும் மரியாதை; கம்பீர வாழ்வு; மிகுந்த சுயமரியாதை.",
  },
  {
    house: 1, lagna: "Pisces", planetSign: "Pisces", planet: "Venus", page: 264,
    en: "Is of tall stature, is very diligent and energetic, gets an increased age, spends life majestically, bears some deficiency in wife's house, faces some deficiency in diurnal occupation",
    ta: "உயரமானவர்; மிகுந்த உழைப்பாளி, ஆற்றல் மிக்கவர்; ஆயுள் அதிகரிக்கும்; கம்பீரமாக வாழ்வார்; மனைவி வீட்டில் சிறு குறை; அன்றாட தொழிலில் சில குறைகள்.",
  },
  {
    house: 1, lagna: "Pisces", planetSign: "Pisces", planet: "Saturn", page: 266,
    en: "Is physically weak internally hut appears to be good from the outside, faces opposition from father, has some friendly and some weak relation with the brother, bears losses in the house of wife, labours hard in occupation, finds some hindrance in the government and society",
    ta: "உள்ளே உடல் பலவீனம், வெளியே நன்றாகத் தெரிவார்; தந்தைக்கு எதிர்ப்பு; சகோதரருடன் சில நட்பும் சில பலவீனமும்; மனைவி வீட்டில் இழப்புகள்; தொழிலில் கடின உழைப்பு; அரசு, சமூகத்தில் சில தடைகள்.",
  },
  {
    house: 1, lagna: "Pisces", planetSign: "Pisces", planet: "Rahu", page: 268,
    en: "Feels physical anxieties and experiences some physical deficiency, sometimes experiences blows on the body, gets his work done very cleverly and cautiously, does very laborious deeds, follows secret tactics",
    ta: "உடலில் கவலைகளும் சில குறைகளும்; சில நேரம் உடலில் அடிகள்; வேலையை மிக சாமர்த்தியமாகவும் எச்சரிக்கையாகவும் முடிப்பார்; மிகக் கடினமான செயல்கள்; மறைமுக வழிகள்.",
  },
  {
    house: 1, lagna: "Pisces", planetSign: "Pisces", planet: "Ketu", page: 270,
    en: "Bears fatal blows on his body and passes through some clangers, also faces some deficiency in the handsomeness of physique, experiences bondage and dependence, uses his strength secretly",
    ta: "உடலில் ஆபத்தான அடிகள்; சில ஆபத்துகளில் சிக்குவார்; உடல் அழகில் குறை; பந்தமும் சார்புநிலையும்; தன் பலத்தை மறைவாகப் பயன்படுத்துவார்.",
  },
  {
    house: 2, lagna: "Aries", planetSign: "Taurus", planet: "Sun", page: 21,
    en: "Feels difficulties in acquiring education, mentally worried, gains wealth by routine work, problems with children, weak finances",
    ta: "கல்வி பெறுவதில் சிரமம்; மன கவலை; வழக்கமான வேலையால் பொருள்; பிள்ளைகளால் பிரச்சினை; நிதி நிலை பலவீனம்.",
  },
  {
    house: 2, lagna: "Aries", planetSign: "Taurus", planet: "Moon", page: 23,
    en: "Gets wealth, lands and house property, large family, gets wealth but cannot enjoy it, mentally happy, disturbance in daily routine, help from others",
    ta: "செல்வம், நிலம், வீடு; பெரிய குடும்பம்; செல்வம் இருந்தும் அனுபவிக்க முடியாது; மனத்தில் மகிழ்ச்சி; தினசரி வாழ்வில் குழப்பம்; பிறர் உதவி.",
  },
  {
    house: 2, lagna: "Aries", planetSign: "Taurus", planet: "Mars", page: 25,
    en: "Always busy in earning money, but loses wealth, enjoys illegal gains, loses something from children, hindered by harsh speech, irreligious",
    ta: "பொருள் ஈட்டுவதில் எப்போதும் ஈடுபட்டிருப்பார்; ஆனால் பொருள் இழப்பு; சட்டவிரோத ஆதாயம்; பிள்ளைகள் வகையில் இழப்பு; கடுமையான பேச்சால் தடை; தர்மத்தில் நாட்டம் குறைவு.",
  },
  {
    house: 2, lagna: "Aries", planetSign: "Taurus", planet: "Mercury", page: 27,
    en: "Earns wealth, is intelligent, has mixed relations with family, does not get good support from brothers and sisters, ambitious, wants to earn more",
    ta: "செல்வம் ஈட்டுவார்; அறிவாளி; குடும்பத்துடன் கலந்த உறவு; உடன்பிறப்புகளின் ஆதரவு குறைவு; லட்சியம் மிக்கவர்; மேலும் ஈட்ட விரும்புவார்.",
  },
  {
    house: 2, lagna: "Aries", planetSign: "Taurus", planet: "Jupiter", page: 29,
    en: "Fortunate, earns good wealth, Divine help, slight loss in accumulated wealth, controls expenditure, sometimes spends more, religious in outlook, conquers enemies, feels happy with daily routine",
    ta: "அதிர்ஷ்டசாலி, நல்ல செல்வம்; தெய்வ உதவி; சேர்த்த செல்வத்தில் சிறு இழப்பு; செலவைக் கட்டுப்படுத்துவார்; சில நேரம் அதிகம் செலவிடுவார்; தர்ம நோக்கு; எதிரிகளை வெல்வார்; தினசரி வாழ்வில் மகிழ்ச்சி.",
  },
  {
    house: 2, lagna: "Aries", planetSign: "Taurus", planet: "Venus", page: 31,
    en: "Gets good wealth, large family, undertakes different professions, accumulates good wealth, happy with wife and enjoys sexual pleasures, gets honour and respect",
    ta: "நல்ல செல்வம், பெரிய குடும்பம்; பல தொழில்கள்; நல்ல செல்வம் சேர்ப்பார்; மனைவியால் மகிழ்ச்சி; பாலியல் இன்பம்; மரியாதையும் கௌரவமும்.",
  },
  {
    house: 2, lagna: "Aries", planetSign: "Taurus", planet: "Saturn", page: 33,
    en: "Earns well, gains from government and society, does not get affection fiom mother, is restless in daily life, works hard to increase wealth",
    ta: "நல்ல வருமானம்; அரசு, சமூகத்தில் ஆதாயம்; தாயின் அன்பு குறைவு; தினசரி வாழ்வில் அமைதியின்மை; செல்வம் பெருக்க கடின உழைப்பு.",
  },
  {
    house: 2, lagna: "Aries", planetSign: "Taurus", planet: "Rahu", page: 35,
    en: "Loss of wealth and separation from family, clever in earning wealth, makes unauthorised efforts secretly to get wealth, faces domestic problems and family bickering, courageous, feels restlessness",
    ta: "செல்வ இழப்பும் குடும்பப் பிரிவும்; செல்வம் ஈட்டுவதில் சாமர்த்தியம்; ரகசியமாக அனுமதியற்ற முயற்சிகள்; குடும்பத்தில் பிரச்சினையும் சண்டையும்; தைரியம்; மனத்தில் அமைதியின்மை.",
  },
  {
    house: 2, lagna: "Aries", planetSign: "Taurus", planet: "Ketu", page: 37,
    en: "Loss in wealth and feels shortage of money, experiences family unhappiness",
    ta: "செல்வ இழப்பும் பணத் தட்டுப்பாடும்; குடும்பத்தில் மகிழ்ச்சியின்மை.",
  },
  {
    house: 2, lagna: "Taurus", planetSign: "Gemini", planet: "Sun", page: 42,
    en: "Enjoys wealth, land, some bondage in connection with mother, happiness of family and also through buildings",
    ta: "செல்வமும் நிலமும்; தாயின் வகையில் சில கட்டுப்பாடு; குடும்ப மகிழ்ச்சியும் கட்டிடங்களால் மகிழ்ச்சியும்.",
  },
  {
    house: 2, lagna: "Taurus", planetSign: "Gemini", planet: "Moon", page: 44,
    en: "Accumulates wealth, happy with brothers and sisters, feels weak in physical strength, gains in the daily life through career, puts lot of labour",
    ta: "செல்வம் சேர்ப்பார்; உடன்பிறப்புகளால் மகிழ்ச்சி; உடல் வலிமை குறைவு; தொழில் வழியில் தினசரி வாழ்வில் ஆதாயம்; மிகுந்த உழைப்பு.",
  },
  {
    house: 2, lagna: "Taurus", planetSign: "Gemini", planet: "Mars", page: 46,
    en: "Difficulties relating to monetary gains and family, distress in profession and in the house of wife, troubles in education and in the house of children",
    ta: "பொருள் ஆதாயத்திலும் குடும்பத்திலும் சிரமம்; தொழிலிலும் மனைவி வீட்டிலும் கவலை; கல்வியிலும் பிள்ளைகள் வீட்டிலும் தொல்லை.",
  },
  {
    house: 2, lagna: "Taurus", planetSign: "Gemini", planet: "Mercury", page: 48,
    en: "Accumulates huge wealth and much education, gets bondage of children, a good planner and always ambitious in life",
    ta: "பெரும் செல்வமும் நிறைய கல்வியும்; பிள்ளைகள் வகையில் கட்டுப்பாடு; நல்ல திட்டமிடுபவர்; வாழ்வில் எப்போதும் லட்சியம்.",
  },
  {
    house: 2, lagna: "Taurus", planetSign: "Gemini", planet: "Jupiter", page: 50,
    en: "Gains wealth, progress in the house of wealth, some unhappiness from father, worries in connection with government and society, tries to come out of worries",
    ta: "செல்வம் ஈட்டுவார், செல்வ வீட்டில் முன்னேற்றம்; தந்தை வகையில் சில மனவருத்தம்; அரசு, சமூகத்தில் கவலைகள்; கவலைகளிலிருந்து வெளிவர முயல்வார்.",
  },
  {
    house: 2, lagna: "Taurus", planetSign: "Gemini", planet: "Venus", page: 52,
    en: "Makes whole-hearted efforts for the increase of wealth, troubles in the house of wealth and family, and somewhat diseased",
    ta: "செல்வம் பெருக்க முழு முயற்சி; செல்வ, குடும்ப வீட்டில் தொல்லைகள்; சிறிது நோய்.",
  },
  {
    house: 2, lagna: "Taurus", planetSign: "Gemini", planet: "Saturn", page: 54,
    en: "Gets wealth with the help of Destiny, gets respect from government and society, some satisfaction through mother, deficiency in the management of lands and buildings, works hard for enjoying wealth, somewhat restless, bondage in the house of government and society and father",
    ta: "விதியின் உதவியால் செல்வம்; அரசு, சமூகத்தில் மரியாதை; தாய் வழியில் சிறு திருப்தி; நிலம், கட்டிடங்களை நிர்வகிப்பதில் குறை; செல்வத்தை அனுபவிக்க கடின உழைப்பு; சிறிது அமைதியின்மை; அரசு, தந்தை வகையில் கட்டுப்பாடு.",
  },
  {
    house: 2, lagna: "Taurus", planetSign: "Gemini", planet: "Rahu", page: 56,
    en: "Works hard for getting wealth, plans for wealth, sometimes faces troubles in getting wealth, makes great efforts to the house of wealth permanently",
    ta: "செல்வத்துக்காகக் கடின உழைப்பு; திட்டமிடுவார்; சில நேரம் செல்வம் பெறுவதில் தொல்லை; செல்வ வீட்டில் நிலையான பெரும் முயற்சி.",
  },
  {
    house: 2, lagna: "Taurus", planetSign: "Gemini", planet: "Ketu", page: 58,
    en: "Loss in wealth, bears pains and becomes restless, deep loss in wealth",
    ta: "செல்வ இழப்பு; வலியும் அமைதியின்மையும்; ஆழ்ந்த செல்வ இழப்பு.",
  },
  {
    house: 2, lagna: "Gemini", planetSign: "Cancer", planet: "Sun", page: 62,
    en: "Labours hard for increasing the wealth, separation in connection with brothers and sisters, influence in connection with wealth, success of his physical strength only in the monetary progress",
    ta: "செல்வம் பெருக்க கடினமாக உழைப்பார்; உடன்பிறப்புகளுடன் பிரிவு; செல்வத்தில் செல்வாக்கு; உடல் வலிமை பண முன்னேற்றத்தில் மட்டும் வெற்றி.",
  },
  {
    house: 2, lagna: "Gemini", planetSign: "Cancer", planet: "Moon", page: 64,
    en: "Gets huge wealth, follows Dharma, progress in the house of wealth and respectable",
    ta: "பெரும் செல்வம்; தர்மத்தைப் பின்பற்றுவார்; செல்வ வீட்டில் முன்னேற்றம்; மதிப்புக்குரியவர்.",
  },
  {
    house: 2, lagna: "Gemini", planetSign: "Cancer", planet: "Mars", page: 66,
    en: "Heavy loss in wealth, also in family, weakness on the side of maternal and paternal house, works hard to get wealth, some secret gains by intricate policies, some distress in the house of children, obstacles in Dharma",
    ta: "செல்வத்தில் பெரும் இழப்பு; குடும்பத்திலும் இழப்பு; தாய், தந்தை வீட்டில் பலவீனம்; செல்வத்துக்காக கடின உழைப்பு; தந்திரமான வழிகளில் சில ரகசிய ஆதாயம்; பிள்ளைகள் வகையில் சிரமம்; தர்மத்தில் தடைகள்.",
  },
  {
    house: 2, lagna: "Gemini", planetSign: "Cancer", planet: "Mercury", page: 68,
    en: "Accumulates huge wealth, gets lands and buildings, maternal happiness, increase in family and wealth, feels happy in the daily routine",
    ta: "பெரும் செல்வம்; நிலமும் கட்டிடமும்; தாய் வழி மகிழ்ச்சி; குடும்பமும் செல்வமும் பெருகும்; தினசரி வாழ்வில் மகிழ்ச்சி.",
  },
  {
    house: 2, lagna: "Gemini", planetSign: "Cancer", planet: "Jupiter", page: 70,
    en: "Increase in wealth by his efforts, help from father, some bondage and help from the house of wife, worry in the daily routine of life, keeps huge influence in the house of enemy, gets wealth due to work in the government and society, comes from a wealthy family",
    ta: "முயற்சியால் செல்வம் பெருகும்; தந்தையின் உதவி; மனைவி வீட்டில் சில கட்டுப்பாடும் உதவியும்; தினசரி வாழ்வில் கவலை; எதிரி வீட்டில் பெரும் செல்வாக்கு; அரசு, சமூக வேலையால் செல்வம்; செல்வந்தர் குடும்பம்.",
  },
  {
    house: 2, lagna: "Gemini", planetSign: "Cancer", planet: "Venus", page: 72,
    en: "Some loss in wealth, earns wealth by planning, acquires education, feels some mental worries, works hard for wealth",
    ta: "செல்வத்தில் சிறு இழப்பு; திட்டமிட்டு செல்வம் ஈட்டுவார்; கல்வி பெறுவார்; மனத்தில் சில கவலைகள்; செல்வத்துக்காக கடினமாக உழைப்பார்.",
  },
  {
    house: 2, lagna: "Gemini", planetSign: "Cancer", planet: "Saturn", page: 74,
    en: "Loss in accumulated wealth, spends the daily routine lazily, weakness in the house of family and also hindrances",
    ta: "சேர்த்த செல்வத்தில் இழப்பு; நாள் வாழ்க்கையை சோம்பலாகக் கழிப்பார்; குடும்பத்தில் பலவீனமும் தடைகளும்.",
  },
  {
    house: 2, lagna: "Gemini", planetSign: "Cancer", planet: "Rahu", page: 76,
    en: "Gets losses in the house of wealth, highly worried on account of loss, great distress in the house of family, makes secret schemes for making wealth, takes the best of others",
    ta: "செல்வ வீட்டில் இழப்பு; இழப்பால் மிகுந்த கவலை; குடும்பத்தில் பெரும் துன்பம்; செல்வம் ஈட்ட ரகசியத் திட்டங்கள்; பிறரிடமிருந்து சிறந்ததைப் பறிப்பார்.",
  },
  {
    house: 2, lagna: "Gemini", planetSign: "Cancer", planet: "Ketu", page: 78,
    en: "Great loss and frustrations in the house of wealth, distress in the family, works hard to get wealth, finally gets success",
    ta: "செல்வ வீட்டில் பெரும் இழப்பும் ஏமாற்றமும்; குடும்பத்தில் துன்பம்; செல்வம் ஈட்ட கடினமாக உழைப்பார்; இறுதியில் வெற்றி பெறுவார்.",
  },
  {
    house: 2, lagna: "Cancer", planetSign: "Leo", planet: "Sun", page: 82,
    en: "Is very rich and possesses a big family, anxiety in the daily routine of life, influence from the side of wealth, increases the wealth and is much respected",
    ta: "மிகுந்த செல்வந்தர்; பெரிய குடும்பம்; தினசரி வாழ்வில் கவலை; செல்வ வகையில் செல்வாக்கு; செல்வத்தைப் பெருக்குவார்; மிகுந்த மரியாதை.",
  },
  {
    house: 2, lagna: "Cancer", planetSign: "Leo", planet: "Moon", page: 85,
    en: "Earns huge wealth, maintains aristocracy in the daily routine and keeps dignity, engages himself in worldly affairs, gets respect, selfish",
    ta: "பெரும் செல்வம் ஈட்டுவார்; தினசரி வாழ்வில் குலப் பெருமையைக் காப்பார்; உலக விவகாரங்களில் ஈடுபடுவார்; மரியாதை பெறுவார்; சுயநலம்.",
  },
  {
    house: 2, lagna: "Cancer", planetSign: "Leo", planet: "Mars", page: 87,
    en: "Does great and valuable deeds in his life through wisdom, earns huge wealth, rises, gets happy children, gets education, gets respect in the house of government and society and family, enjoys gains due to his cleverness, some restlessness in the daily life, is very witty",
    ta: "ஞானத்தால் பெரிய, மதிப்புமிக்க செயல்கள்; பெரும் செல்வம்; முன்னேற்றம்; மகிழ்ச்சியான பிள்ளைகள்; கல்வி; அரசு, சமூகத்திலும் குடும்பத்திலும் மரியாதை; தன் சாமர்த்தியத்தால் ஆதாயம்; தினசரி வாழ்வில் சிறு அமைதியின்மை; மிகுந்த நகைச்சுவை.",
  },
  {
    house: 2, lagna: "Cancer", planetSign: "Leo", planet: "Mercury", page: 89,
    en: "Earns money, some incomplete happiness in the house of brothers and sisters, tries to control the expenditure, gets respect",
    ta: "பணம் ஈட்டுவார்; உடன்பிறப்புகள் வகையில் சில முழுமையற்ற மகிழ்ச்சி; செலவைக் கட்டுப்படுத்த முயல்வார்; மரியாதை பெறுவார்.",
  },
  {
    house: 2, lagna: "Cancer", planetSign: "Leo", planet: "Jupiter", page: 91,
    en: "Earns huge wealth, does influential deeds, puts hard labour, gets much honour, respect and honour with some ordinary difficulties from the house of government and society and father",
    ta: "பெரும் செல்வம் ஈட்டுவார்; செல்வாக்கான செயல்கள்; கடின உழைப்பு; பெரும் மரியாதையும் கௌரவமும்; அரசு, சமூகம், தந்தை வகையில் சாதாரண சிரமங்கள்.",
  },
  {
    house: 2, lagna: "Cancer", planetSign: "Leo", planet: "Venus", page: 93,
    en: "Straggles to gain wealth, some loss in the house of motherland and in the happiness of mother, aristocracy in the daily routine and is respectable",
    ta: "செல்வம் பெற போராடுவார்; தாய்நாடு, தாய் வகையில் சில இழப்பு; தினசரி வாழ்வில் கம்பீரம்; மரியாதைக்குரியவர்.",
  },
  {
    house: 2, lagna: "Cancer", planetSign: "Leo", planet: "Saturn", page: 95,
    en: "Good longevity, restlessness in connection with wife and family, aristocracy in the daily routine of life, gets the already accumulated wealth, is delightful",
    ta: "நல்ல ஆயுள்; மனைவி, குடும்ப வகையில் அமைதியின்மை; தினசரி வாழ்வில் கம்பீரம்; ஏற்கெனவே சேர்த்த செல்வம் கிடைக்கும்; மகிழ்ச்சியானவர்.",
  },
  {
    house: 2, lagna: "Cancer", planetSign: "Leo", planet: "Rahu", page: 97,
    en: "Loss of wealth, worries in the head due to loss of wealth, takes loans and is anxious",
    ta: "செல்வ இழப்பு; செல்வ இழப்பால் தலையில் கவலை; கடன் வாங்குவார்; பதற்றம்.",
  },
  {
    house: 2, lagna: "Cancer", planetSign: "Leo", planet: "Ketu", page: 99,
    en: "Gets great power of his physical and energetic strength and attains good success through great power of patience, gets success and courage due to power of hard labour",
    ta: "உடல், ஆற்றல் வலிமையால் பெரும் சாதனை; மிகுந்த பொறுமையால் நல்ல வெற்றி; கடின உழைப்பால் வெற்றியும் தைரியமும்.",
  },
  {
    house: 2, lagna: "Leo", planetSign: "Virgo", planet: "Sun", page: 104,
    en: "Earns wealth, is called very rich, maintains an aristocratic lifestyle, long-lived, has the influence on family",
    ta: "செல்வம் ஈட்டுவார்; மிகுந்த செல்வந்தர் என அழைக்கப்படுவார்; கம்பீர வாழ்வு; நீண்ட ஆயுள்; குடும்பத்தில் செல்வாக்கு.",
  },
  {
    house: 2, lagna: "Leo", planetSign: "Virgo", planet: "Moon", page: 106,
    en: "Some loss and some weakness in the house of accumulation of wealth, some loss in the family, is fully engaged mentally to accumulate wealth, and is aristocratic",
    ta: "செல்வம் சேர்ப்பதில் சில இழப்பும் குறைவும்; குடும்ப இழப்பு; செல்வம் சேர்க்க மனத்தை முழுமையாக ஈடுபடுத்துவார்; கம்பீரமானவர்.",
  },
  {
    house: 2, lagna: "Leo", planetSign: "Virgo", planet: "Mars", page: 108,
    en: "Is very fortunate, gets increment in the natural wealth, gets land and property, makes some nuisance like in the house of domestic happiness and in the side of mother, gets the pleasures of children, bears gentleness in the house of education",
    ta: "மிகுந்த அதிர்ஷ்டசாலி; இயற்கைச் செல்வம் பெருகும்; நிலமும் சொத்தும்; வீட்டு மகிழ்ச்சியிலும் தாய் வகையிலும் சில தொல்லை; பிள்ளைகளின் இன்பம்; கல்வியில் மென்மை.",
  },
  {
    house: 2, lagna: "Leo", planetSign: "Virgo", planet: "Mercury", page: 110,
    en: "Accumulates much wealth, gets high income, has a big family, carelessness in the daily routine of life, limited way in the house of income, acquires respect",
    ta: "பெரும் செல்வம்; அதிக வருமானம்; பெரிய குடும்பம்; தினசரி வாழ்வில் அசட்டை; வருமான வகையில் குறுகிய வழி; மரியாதை பெறுவார்.",
  },
  {
    house: 2, lagna: "Leo", planetSign: "Virgo", planet: "Jupiter", page: 112,
    en: "Spends life in a very aristocratic way and some weakness, experiences some perplexity with regard to children",
    ta: "மிகவும் கம்பீரமான வாழ்வு; சில பலவீனம்; பிள்ளைகள் வகையில் சில குழப்பம்.",
  },
  {
    house: 2, lagna: "Leo", planetSign: "Virgo", planet: "Venus", page: 114,
    en: "Some weakness in the house of wealth and family",
    ta: "செல்வ வீட்டிலும் குடும்பத்திலும் சில பலவீனம்.",
  },
  {
    house: 2, lagna: "Leo", planetSign: "Virgo", planet: "Saturn", page: 116,
    en: "Some success and also losses in the house of wealth, hindrances in the house of happiness and mother, some restlessness in the buildings and residential places, restlessness in the house of wife and daily occupation",
    ta: "செல்வ வீட்டில் சில வெற்றியும் இழப்பும்; மகிழ்ச்சி, தாய் வகையில் தடைகள்; கட்டிடங்கள், குடியிருப்புகளில் சிறு அமைதியின்மை; மனைவி வீட்டிலும் தினசரி தொழிலிலும் அமைதியின்மை.",
  },
  {
    house: 2, lagna: "Leo", planetSign: "Virgo", planet: "Rahu", page: 118,
    en: "Some loss in the house of wealth, experiences some weakness in the house of family, uses secret means to acquire wealth, and is somewhat restless",
    ta: "செல்வ வீட்டில் சில இழப்பு; குடும்ப வீட்டில் சில பலவீனம்; செல்வம் பெற ரகசிய வழிகள்; சிறிது அமைதியின்மை.",
  },
  {
    house: 2, lagna: "Leo", planetSign: "Virgo", planet: "Ketu", page: 120,
    en: "Some deficiency in the store of wealth, some weakness in the house of family, and works very patiently regarding his worldly wisdom",
    ta: "செல்வக் களஞ்சியத்தில் சில குறை; குடும்ப வீட்டில் சில பலவீனம்; உலக ஞானத்துடன் மிகப் பொறுமையாக வேலை செய்வார்.",
  },
  {
    house: 2, lagna: "Virgo", planetSign: "Libra", planet: "Sun", page: 125,
    en: "Great loss of wealth, spends money unnecessarily, faces the loss of family, gets some influence in the daily routine of life, serves his purpose through deep and intricate policies",
    ta: "பெரும் செல்வ இழப்பு; தேவையின்றி பணம் செலவழிப்பார்; குடும்ப இழப்பு; தினசரி வாழ்வில் சில செல்வாக்கு; ஆழமான, சிக்கலான வழிகளால் தன் நோக்கத்தை நிறைவேற்றுவார்.",
  },
  {
    house: 2, lagna: "Virgo", planetSign: "Libra", planet: "Moon", page: 127,
    en: "Earns huge wealth and accumulates it, has a big family, feels great happiness of gains during the period of life, lives long, remains busy in deep politics, is respectable",
    ta: "பெரும் செல்வம் ஈட்டி சேர்ப்பார்; பெரிய குடும்பம்; வாழ்வில் ஆதாய மகிழ்ச்சி; நீண்ட ஆயுள்; ஆழ்ந்த அரசியலில் ஈடுபடுவார்; மரியாதைக்குரியவர்.",
  },
  {
    house: 2, lagna: "Virgo", planetSign: "Libra", planet: "Mars", page: 129,
    en: "Spends his life rolling in wealth, gets a long life, feels some deficiency on the side of brother, some loss in accumulating wealth, some loss in family, and is very talkative",
    ta: "செல்வக் குவியலில் வாழ்வார்; நீண்ட ஆயுள்; சகோதரர் வகையில் சில குறை; செல்வம் சேர்ப்பதில் சில இழப்பு; குடும்பத்தில் சில இழப்பு; அதிகம் பேசுவார்.",
  },
  {
    house: 2, lagna: "Virgo", planetSign: "Libra", planet: "Mercury", page: 131,
    en: "Earns huge wealth, progresses through business, links the progress of family and wealth, is very rich, has a long life",
    ta: "பெரும் செல்வம்; வணிகத்தில் முன்னேற்றம்; குடும்ப முன்னேற்றத்தையும் செல்வத்தையும் இணைப்பார்; மிகுந்த செல்வந்தர்; நீண்ட ஆயுள்.",
  },
  {
    house: 2, lagna: "Virgo", planetSign: "Libra", planet: "Jupiter", page: 133,
    en: "Gets honour and power of wealth, gets the pleasure of property, some bondage in the pleasures in the house of mother and wife, gets wealth from the daily occupation, gets the help from the house of father, gets honour and happiness in government and society, some happiness in life, has a long life, has influence in the house of enemies, happiness in the side of maternal grandfather's family",
    ta: "மரியாதையும் செல்வ வலிமையும்; சொத்தின் இன்பம்; தாய், மனைவி வகையில் சில கட்டுப்பாடு; தினசரி தொழிலில் பொருள்; தந்தை வீட்டின் உதவி; அரசு, சமூகத்தில் மரியாதையும் மகிழ்ச்சியும்; சில மகிழ்ச்சி; நீண்ட ஆயுள்; எதிரி வீட்டில் செல்வாக்கு; தாய்வழி தாத்தா குடும்பத்தில் மகிழ்ச்சி.",
  },
  {
    house: 2, lagna: "Virgo", planetSign: "Libra", planet: "Venus", page: 136,
    en: "Is very rich, is very fortunate and respectable, has a family, spends his life in an aristocratic way",
    ta: "மிகுந்த செல்வந்தர்; மிக அதிர்ஷ்டசாலி, மரியாதைக்குரியவர்; குடும்பம் உண்டு; கம்பீரமாக வாழ்வார்.",
  },
  {
    house: 2, lagna: "Virgo", planetSign: "Libra", planet: "Saturn", page: 138,
    en: "Earns huge wealth and does some grand deeds, injures the house of mother a bit, some carelessness with age, gets progress with some difficulties on the side of children, somewhat restlessness",
    ta: "பெரும் செல்வம் ஈட்டுவார்; சில பெரிய செயல்கள்; தாய் வீட்டுக்கு சிறு காயம்; வயதில் சில அசட்டை; பிள்ளைகள் வகையில் சில சிரமங்களுடன் முன்னேற்றம்; சிறிது அமைதியின்மை.",
  },
  {
    house: 2, lagna: "Virgo", planetSign: "Libra", planet: "Rahu", page: 140,
    en: "Some weakness in the side of wealth, gets some family troubles, manages his affairs for some time by taking loans, gets sudden loss in the matter of wealth",
    ta: "செல்வ வகையில் சில பலவீனம்; குடும்பத் தொல்லைகள்; கடன் வாங்கி சிலகாலம் காரியங்களை நடத்துவார்; செல்வ விஷயத்தில் திடீர் இழப்பு.",
  },
  {
    house: 2, lagna: "Virgo", planetSign: "Libra", planet: "Ketu", page: 142,
    en: "Unable to hoard wealth, gets family distress also, feels internal weakness in comparison to outward firmness of wealth, manages to increase wealth with great efibrts",
    ta: "செல்வத்தைச் சேர்க்க முடியாது; குடும்பத்தில் துன்பம்; வெளித்தோற்றத்தின் உறுதிக்கு மாறாக உள்ளே பலவீனம்; பெரும் முயற்சியால் செல்வத்தை பெருக்குவார்.",
  },
  {
    house: 2, lagna: "Libra", planetSign: "Scorpio", planet: "Sun", page: 146,
    en: "Accumulates much wealth, gets heavy income, gets the advantage of the family and wealth, apparently seems to be rich, is glorious and respectable",
    ta: "மிகுந்த செல்வம்; அதிக வருமானம்; குடும்பம், செல்வம் இரண்டிலும் ஆதாயம்; செல்வந்தர் போலத் தோன்றுவார்; கம்பீரமும் மரியாதையும்.",
  },
  {
    house: 2, lagna: "Libra", planetSign: "Scorpio", planet: "Moon", page: 148,
    en: "Weakness in the house of wealth, loss of fortune through business, increase in longevity, works secretly to get wealth",
    ta: "செல்வ வீட்டில் பலவீனம்; வணிகத்தால் அதிர்ஷ்ட இழப்பு; ஆயுள் நீடிக்கும்; ரகசியமாக செல்வம் தேடுவார்.",
  },
  {
    house: 2, lagna: "Libra", planetSign: "Scorpio", planet: "Mars", page: 150,
    en: "Gets increment in wealth through the house of business and occupation, gets much power, deficiency in the happiness from the house of wife, gets excess of sexual pleasures, some happiness from son",
    ta: "வணிகமும் தொழிலும் வழியாக செல்வம் பெருகும்; மிகுந்த வலிமை; மனைவி வீட்டில் மகிழ்ச்சி குறைவு; பாலியல் இன்பம் மிகுதி; மகனால் சில மகிழ்ச்சி.",
  },
  {
    house: 2, lagna: "Libra", planetSign: "Scorpio", planet: "Mercury", page: 152,
    en: "Is wealthy and respectable, experiences pleasures in life due to power of expenditure and destiny, gets progress with some weakness in the house of family",
    ta: "செல்வந்தர், மரியாதைக்குரியவர்; செலவின் வலிமையாலும் விதியாலும் வாழ்வில் இன்பம்; குடும்பத்தில் சில பலவீனத்துடன் முன்னேற்றம்.",
  },
  {
    house: 2, lagna: "Libra", planetSign: "Scorpio", planet: "Jupiter", page: 154,
    en: "Gets huge wealth, gets respect, keeps influence in the house of enemies, some progress with father and is wise",
    ta: "மிகுந்த செல்வம்; மரியாதை; எதிரி வீட்டில் செல்வாக்கு; தந்தை வகையில் சில முன்னேற்றம்; ஞானமுள்ளவர்.",
  },
  {
    house: 2, lagna: "Libra", planetSign: "Scorpio", planet: "Venus", page: 156,
    en: "Gets advantage of wealth, gets long life, uses strength to increase wealth, sometimes gets losses in the house of wealth, some pleasures and some struggles in his family, is dependent",
    ta: "செல்வ நன்மை; நீண்ட ஆயுள்; செல்வம் பெருக்க வலிமையைப் பயன்படுத்துவார்; சில நேரம் செல்வ வீட்டில் இழப்பு; குடும்பத்தில் சில இன்பமும் போராட்டமும்; சார்ந்திருப்பவர்.",
  },
  {
    house: 2, lagna: "Libra", planetSign: "Scorpio", planet: "Saturn", page: 158,
    en: "Gets powers of land and property, cares much about the accumulated cash deposit, feels great happiness due to power of intellect, people and wealth, improves the house of mother, gets the problems and bondage in the side of mother and children",
    ta: "நிலமும் சொத்தும் வலிமை; சேமிப்புப் பணத்தில் அதிக அக்கறை; அறிவால், மக்களால், செல்வத்தால் பெரும் மகிழ்ச்சி; தாய் வீட்டை மேம்படுத்துவார்; தாய், பிள்ளைகள் வகையில் சிக்கலும் கட்டுப்பாடும்.",
  },
  {
    house: 2, lagna: "Libra", planetSign: "Scorpio", planet: "Rahu", page: 160,
    en: "Some unhappiness in the place of accumulating wealth, some distress in connection with family, bears severe blows on wealth and people",
    ta: "செல்வம் சேர்க்கும் இடத்தில் சில மனக்குறை; குடும்பத்தில் சில துன்பம்; செல்வத்திலும் மனிதர்களிலும் கடுமையான அடிகள்.",
  },
  {
    house: 2, lagna: "Libra", planetSign: "Scorpio", planet: "Ketu", page: 162,
    en: "Some loss in the house of wealth, some loss of family, faces sudden losses, toils hard for accumulating wealth",
    ta: "செல்வ வீட்டில் சில இழப்பு; குடும்பத்தில் சில இழப்பு; திடீர் இழப்புகள்; செல்வம் சேர்க்க கடினமாக உழைப்பார்.",
  },
  {
    house: 2, lagna: "Scorpio", planetSign: "Sagittarius", planet: "Sun", page: 167,
    en: "Earns a lot of wealth from his business and occupation, enjoys gains firm government and society, gets influence in family, gets hereditary gains, is very industrious and honourable",
    ta: "தொழிலிலும் வேலையிலும் பெரும் செல்வம்; அரசு, சமூகத்தில் ஆதாயம்; குடும்பத்தில் செல்வாக்கு; பரம்பரைச் சொத்து; மிகுந்த உழைப்பும் மரியாதையும்.",
  },
  {
    house: 2, lagna: "Scorpio", planetSign: "Sagittarius", planet: "Moon", page: 170,
    en: "Is very fortunate and wealthy, gets a lot of wealth by the pow* of destiny, gets pleasures of family, gets the success in worldly affairs, increases in age",
    ta: "மிக அதிர்ஷ்டசாலி, செல்வந்தர்; விதியின் வலிமையால் பெரும் செல்வம்; குடும்ப இன்பம்; உலக விவகாரங்களில் வெற்றி; ஆயுள் கூடும்.",
  },
  {
    house: 2, lagna: "Scorpio", planetSign: "Sagittarius", planet: "Mars", page: 172,
    en: "Rich due to his physique, always puts in special efforts for getting wealth, toils hard for accumulating wealth, acquires education, some enmity in the side of children, follows low Dharma",
    ta: "உடல் வலிமையால் செல்வந்தர்; செல்வம் பெற எப்போதும் சிறப்பு முயற்சி; செல்வம் சேர்க்க கடுமையாக உழைப்பார்; கல்வி பெறுவார்; பிள்ளைகள் வகையில் சில பகை; தாழ்ந்த தர்மத்தைப் பின்பற்றுவார்.",
  },
  {
    house: 2, lagna: "Scorpio", planetSign: "Sagittarius", planet: "Mercury", page: 174,
    en: "Gets success in accumulating wealth, faces some losses also, gets some deficiency in accumulating wealth on account of rich standard of living in the daily routine of life, has a long life, is respectable and enjoys riches, gets heavy gains",
    ta: "செல்வம் சேர்ப்பதில் வெற்றி; சில இழப்பும் உண்டு; உயர்ந்த வாழ்க்கைத் தரத்தால் செல்வம் சேர்ப்பதில் சிறு குறை; நீண்ட ஆயுள்; மரியாதைக்குரியவர்; பெரும் ஆதாயம்.",
  },
  {
    house: 2, lagna: "Scorpio", planetSign: "Sagittarius", planet: "Jupiter", page: 176,
    en: "Accumulates wealth through the power of intellect and education, gets advantage from the government and society, gets children",
    ta: "அறிவாலும் கல்வியாலும் செல்வம் சேர்ப்பார்; அரசு, சமூகத்தில் ஆதாயம்; பிள்ளைகள் பெறுவார்.",
  },
  {
    house: 2, lagna: "Scorpio", planetSign: "Sagittarius", planet: "Venus", page: 178,
    en: "Gets wealth from occupation, gets some weakness in the house of accumulating wealth and gets some monetary loss, wants more sexual pleasures, tries to check the expenditure",
    ta: "தொழிலில் செல்வம்; செல்வம் சேர்க்கும் இடத்தில் சில பலவீனம், பண இழப்பு; பாலியல் இன்பத்தை மிகவும் விரும்புவார்; செலவைக் கட்டுப்படுத்த முயல்வார்.",
  },
  {
    house: 2, lagna: "Scorpio", planetSign: "Sagittarius", planet: "Saturn", page: 180,
    en: "Gets the income from land and property, feels pleasure in accumulating wealth, some bondage in the happiness of mother, gets good income, some happiness in longevity and daily routine, always attempts to increase the wealth, and is always happy",
    ta: "நிலம், சொத்தின் மூலம் வருமானம்; செல்வம் சேர்ப்பதில் மகிழ்ச்சி; தாய் மகிழ்ச்சியில் சில கட்டுப்பாடு; நல்ல வருமானம்; ஆயுளிலும் நாள் வாழ்விலும் சில மகிழ்ச்சி; செல்வத்தை எப்போதும் பெருக்க முயல்வார்.",
  },
  {
    house: 2, lagna: "Scorpio", planetSign: "Sagittarius", planet: "Rahu", page: 182,
    en: "Distress of wealth, bears the loss and the shortage of wealth, loss and deficiency in family, is poor, and has devotion to do the work",
    ta: "செல்வத்தில் துன்பம்; இழப்பும் செல்வக் குறையும்; குடும்பத்தில் இழப்பும் குறையும்; ஏழ்மை; வேலையில் பக்தி.",
  },
  {
    house: 2, lagna: "Scorpio", planetSign: "Sagittarius", planet: "Ketu", page: 184,
    en: "Tries to increase the wealth, great disorder about the progress of the family, gets a show of aristocracy, has to face great troubles in connection with acquiring wealth",
    ta: "செல்வத்தைப் பெருக்க முயல்வார்; குடும்ப முன்னேற்றத்தில் பெரும் குழப்பம்; கம்பீரத் தோற்றம்; செல்வம் பெறுவதில் பெரும் சிரமங்கள்.",
  },
  {
    house: 2, lagna: "Sagittarius", planetSign: "Capricorn", planet: "Sun", page: 189,
    en: "Gets wealth with great difficulty, faces problems in family matters, has difficulties in accumulating wealth, has a long life, faces some loss in the side of Dharma, gives more importance to wealth than to Dharma, spends life in a civilised way, and is fortunate",
    ta: "பெரும் சிரமத்துடன் செல்வம்; குடும்ப விவகாரங்களில் சிக்கல்; செல்வம் சேர்ப்பதில் கடினம்; நீண்ட ஆயுள்; தர்ம வகையில் சில இழப்பு; தர்மத்தைவிட செல்வத்துக்கு முக்கியத்துவம்; நாகரிகமான வாழ்வு; அதிர்ஷ்டசாலி.",
  },
  {
    house: 2, lagna: "Sagittarius", planetSign: "Capricorn", planet: "Moon", page: 191,
    en: "Spends the daily routine or life in an aristocratic manner, experiences loss and deficiency in the accumulation of wealth, gets family loss, has a long life, works through difficulties",
    ta: "தினசரி வாழ்வை கம்பீரமாகக் கழிப்பார்; செல்வம் சேர்ப்பதில் இழப்பும் குறையும்; குடும்ப இழப்பு; நீண்ட ஆயுள்; கடின வழிகளில் வேலை செய்வார்.",
  },
  {
    house: 2, lagna: "Sagittarius", planetSign: "Capricorn", planet: "Mars", page: 193,
    en: "Loss and gain in the house of wealth, gets much wealth due to his wisdom, spends the existing wealth of very high and deep intellectual power",
    ta: "செல்வ வீட்டில் இழப்பும் ஆதாயமும்; தன் அறிவால் மிகுந்த செல்வம்; இருக்கும் செல்வத்தை மிக உயர்ந்த ஆழ்ந்த அறிவாற்றலுடன் செலவிடுவார்.",
  },
  {
    house: 2, lagna: "Sagittarius", planetSign: "Capricorn", planet: "Mercury", page: 195,
    en: "Earns much wealth through business and occupation, gets progress in business, gets lot of wealth from father, possesses a big family, faces some bondage in wife and family, wants more sexual pleasures, accumulates wealth, gets advantage from the government, is very wise and clever",
    ta: "வணிகத்தாலும் தொழிலாலும் பெரும் செல்வம்; வணிகத்தில் முன்னேற்றம்; தந்தை வழியில் பெரும் செல்வம்; பெரிய குடும்பம்; மனைவி, குடும்ப வகையில் சில கட்டுப்பாடு; பாலியல் இன்பத்தை மிகவும் விரும்புவார்; அரசு வகையில் ஆதாயம்; மிகுந்த அறிவாளி.",
  },
  {
    house: 2, lagna: "Sagittarius", planetSign: "Capricorn", planet: "Jupiter", page: 197,
    en: "Takes even the risk of life for acquiring wealth, gives more importance to wealth than his life, remains unhappy in the side of wealth, bears loss in the house of mother, gets deficiency in land and buildings, gets weakness in physique, bears distress of family, is happy from business and occupation, and is respectable",
    ta: "செல்வம் பெற உயிரையும் பணயம் வைப்பார்; உயிரைவிட செல்வத்துக்கு முக்கியத்துவம்; செல்வ வகையில் மனவருத்தம்; தாய் வீட்டில் இழப்பு; நிலம், கட்டிடங்களில் குறை; உடல் பலவீனம்; குடும்ப வருத்தம்; தொழில், வணிகத்தால் மகிழ்ச்சி; மரியாதைக்குரியவர்.",
  },
  {
    house: 2, lagna: "Sagittarius", planetSign: "Capricorn", planet: "Venus", page: 199,
    en: "Earns much wealth and accumulates it, gets some loss, and is respectable",
    ta: "அதிக செல்வம் ஈட்டி சேர்ப்பார்; சில இழப்பு; மரியாதைக்குரியவர்.",
  },
  {
    house: 2, lagna: "Sagittarius", planetSign: "Capricorn", planet: "Saturn", page: 201,
    en: "Is very rich and gets the means to increase land and buildings, some loss in the house of mother, gets heavy income, some resdessness in the daily routine of life",
    ta: "மிகுந்த செல்வந்தர்; நிலமும் கட்டிடமும் பெருக்கும் வசதி; தாய் வகையில் சில இழப்பு; அதிக வருமானம்; தினசரி வாழ்வில் சில அமைதியின்மை.",
  },
  {
    house: 2, lagna: "Sagittarius", planetSign: "Capricorn", planet: "Rahu", page: 203,
    en: "Loss in the house of wealth, bears some affliction in the family, uses deep tactics for getting wealth, bears some unhappiness in wealth",
    ta: "செல்வ வீட்டில் இழப்பு; குடும்பத்தில் சில துன்பம்; செல்வம் பெற ஆழ்ந்த தந்திரங்கள்; செல்வத்தில் சில மனவருத்தம்.",
  },
  {
    house: 2, lagna: "Sagittarius", planetSign: "Capricorn", planet: "Ketu", page: 205,
    en: "Bears troubles in connection with wealth, gets loss in the house of family, always works for the accumulation of wealth and uses occult practices",
    ta: "செல்வ வகையில் தொல்லைகள்; குடும்ப வீட்டில் இழப்பு; எப்போதும் செல்வம் சேர்க்கவே வேலை செய்வார்; மாயவித்தைகளைப் பயன்படுத்துவார்.",
  },
  {
    house: 2, lagna: "Capricorn", planetSign: "Aquarius", planet: "Sun", page: 210,
    en: "Bears loss and deficiency in the house of wealth and separation from family members, spends the daily routine of life very aristocratically and with elegance, gets increased longevity and bears troubles in accumulating wealth",
    ta: "செல்வ வீட்டில் இழப்பும் குறையும், குடும்பத்தினரிடமிருந்து பிரிவும்; தினசரி வாழ்வில் கம்பீரமாகவும் நயத்துடனும் வாழ்வார்; ஆயுள் கூடும்; செல்வம் சேர்ப்பதில் துன்பம்.",
  },
  {
    house: 2, lagna: "Capricorn", planetSign: "Aquarius", planet: "Moon", page: 212,
    en: "Accumulates much wealth through the line of occupation, faces bondage and deficiency in the house of wife, bears some unpleasantness in family",
    ta: "தொழில் வழியில் பெரும் செல்வம்; மனைவி வீட்டில் கட்டுப்பாடும் குறையும்; குடும்பத்தில் சில அதிருப்தி.",
  },
  {
    house: 2, lagna: "Capricorn", planetSign: "Aquarius", planet: "Mars", page: 214,
    en: "Gets monetary gains, land and property, happiness with some deficiency in the house of children and education",
    ta: "பொருள் ஆதாயம், நிலமும் சொத்தும்; பிள்ளைகள், கல்வி வகையில் சில குறையுடன் மகிழ்ச்சி.",
  },
  {
    house: 2, lagna: "Capricorn", planetSign: "Aquarius", planet: "Mercury", page: 216,
    en: "Is very wealthy and fortunate, gets advantage from the family but also has a little deficiency in the family, has some restlessness in acquiring wealth",
    ta: "மிகுந்த செல்வந்தர், அதிர்ஷ்டசாலி; குடும்பத்தால் ஆதாயம், ஆனால் குடும்பத்தில் சிறு குறை; செல்வம் சேர்ப்பதில் சில அமைதியின்மை.",
  },
  {
    house: 2, lagna: "Capricorn", planetSign: "Aquarius", planet: "Jupiter", page: 218,
    en: "Bears loss and deficiency in the house of wealth, has deficiency in brother's side, does not achieve the required success, some deficiency in the house of family",
    ta: "செல்வ வீட்டில் இழப்பும் குறையும்; சகோதரர் வகையில் குறை; எதிர்பார்த்த வெற்றி கிடைக்காது; குடும்பத்தில் சில குறை.",
  },
  {
    house: 2, lagna: "Capricorn", planetSign: "Aquarius", planet: "Venus", page: 220,
    en: "Accumulates much wealth, gets power from father's house, earns wealth cleverly through education and intellect, manages a big business, has good luck, faces bondage from the children's side, gets the advantage from the government and society, acquires honour and respect in the daily routine",
    ta: "மிகுந்த செல்வம்; தந்தை வீட்டிலிருந்து ஆற்றல்; கல்வியாலும் அறிவாலும் சாமர்த்தியமாகச் செல்வம் ஈட்டுவார்; பெரிய வியாபாரம்; நல்ல அதிர்ஷ்டம்; பிள்ளைகள் வகையில் கட்டுப்பாடு; அரசு, சமூகத்தில் ஆதாயம்; தினசரி வாழ்வில் மரியாதையும் கௌரவமும்.",
  },
  {
    house: 2, lagna: "Capricorn", planetSign: "Aquarius", planet: "Saturn", page: 222,
    en: "Is very rich and accumulates wealth, risks his life for wealth, acquires progress of the family, weakness from other's side, deficiency in landed property, deficiency in the house of happiness, restlessness in the daily routine of life",
    ta: "மிகுந்த செல்வந்தர், செல்வம் சேர்ப்பார்; செல்வத்துக்காக உயிரை பணயம் வைப்பார்; குடும்ப முன்னேற்றம்; பிறர் வகையில் பலவீனம்; நில சொத்தில் குறை; மகிழ்ச்சி வீட்டில் குறை; தினசரி வாழ்வில் அமைதியின்மை.",
  },
  {
    house: 2, lagna: "Capricorn", planetSign: "Aquarius", planet: "Rahu", page: 224,
    en: "Gets loss in the house of wealth, is always worried for the increase in the wealth, does difficult deeds for increasing the wealth, sometimes faces great calamity for wealth, gets the separation of family",
    ta: "செல்வ வீட்டில் இழப்பு; செல்வம் பெருக்க எப்போதும் கவலை; செல்வத்துக்காக கடின செயல்கள்; சில நேரம் பெரும் ஆபத்து; குடும்பப் பிரிவு.",
  },
  {
    house: 2, lagna: "Capricorn", planetSign: "Aquarius", planet: "Ketu", page: 226,
    en: "Has deficiency in the side of wealth, works hard for acquiring wealth, feces severe calamities",
    ta: "செல்வ வகையில் குறை; செல்வம் சேர்க்க கடினமாக உழைப்பார்; கடுமையான ஆபத்துகளைச் சந்திப்பார்.",
  },
  {
    house: 2, lagna: "Aquarius", planetSign: "Pisces", planet: "Sun", page: 231,
    en: "Earns wealth through occupation, gets fascination in the house of wife, has some influence in the daily routine of life, does valuable deeds and possesses family",
    ta: "தொழிலால் செல்வம் ஈட்டுவார்; மனைவி வீட்டில் ஈர்ப்பு; தினசரி வாழ்வில் சில செல்வாக்கு; மதிப்புமிக்க செயல்கள்; குடும்பம் உண்டு.",
  },
  {
    house: 2, lagna: "Aquarius", planetSign: "Pisces", planet: "Moon", page: 234,
    en: "Accumulates wealth, faces some separation in family, keeps the influence over the enemy, spends life majestically",
    ta: "செல்வம் சேர்ப்பார்; குடும்பத்தில் சில பிரிவு; எதிரியின் மீது செல்வாக்கு; கம்பீர வாழ்வு.",
  },
  {
    house: 2, lagna: "Aquarius", planetSign: "Pisces", planet: "Mars", page: 236,
    en: "Acquires respect, gets the support of the father, faces some bondage ofbrother, puts good efforts for acquiring wealth, pays some attention to religious deeds, gets the power of education, gains some power of children, tries hard for the progress of the destiny",
    ta: "மரியாதை பெறுவார்; தந்தையின் ஆதரவு; சகோதரர் வகையில் சில கட்டுப்பாடு; செல்வம் சேர்க்க நல்ல முயற்சி; சிறிது தர்ம நாட்டம்; கல்வித் திறன்; பிள்ளைகளின் வலிமை; விதியின் முன்னேற்றத்துக்கு கடுமையான முயற்சி.",
  },
  {
    house: 2, lagna: "Aquarius", planetSign: "Pisces", planet: "Mercury", page: 238,
    en: "Has deficiency in education and also in children, has some weakness in wealth, gets loss and distress in the family, causes loss to already accumulated wealth, gets wisdom, spends life through the narrow way of education and wisdom, and talks with obstinate power of intellect",
    ta: "கல்வியிலும் பிள்ளைகளிலும் குறை; செல்வத்தில் சிறு பலவீனம்; குடும்பத்தில் இழப்பும் துன்பமும்; ஏற்கெனவே சேர்த்த செல்வத்துக்கு இழப்பு; ஞானம் பெறுவார்; கல்வி, அறிவின் குறுகிய வழியில் வாழ்வார்; பிடிவாத அறிவுடன் பேசுவார்.",
  },
  {
    house: 2, lagna: "Aquarius", planetSign: "Pisces", planet: "Jupiter", page: 240,
    en: "Is very rich and gets heavy gains, tries whole-heartedly to accumulate income, possesses great influence in the house of enemies, labours hard, follows tricks and pursues big business occupation to get wealth, gets heavy gains from the house of father, gains respect from government and society, is respectable, and possesses an influential family",
    ta: "மிகுந்த செல்வந்தர், பெரும் ஆதாயம்; வருமானம் ஈட்ட முழு முயற்சி; எதிரி வீட்டில் பெரும் செல்வாக்கு; கடின உழைப்பு; தந்திரம்; செல்வத்துக்காக பெரிய வணிகத் தொழில்; தந்தை வீட்டில் பெரும் ஆதாயம்; அரசு, சமூகத்தில் மரியாதை; மரியாதைக்குரியவர்; செல்வாக்குள்ள குடும்பம்.",
  },
  {
    house: 2, lagna: "Aquarius", planetSign: "Pisces", planet: "Venus", page: 242,
    en: "Gets much wealth, experiences the happiness and prosperity in the increase of wealth, gets a big family, gets lands and buildings, accumulates virtue, increases the wealth with the help of destiny, experiences some deficiency in the daily routine of life, works very cleverly for the increase of wealth, faces some weakness in connection with age",
    ta: "மிகுந்த செல்வம்; செல்வ வளர்ச்சியால் மகிழ்ச்சியும் செழிப்பும்; பெரிய குடும்பம்; நிலமும் வீடும்; விதியின் உதவியால் செல்வம் பெருகும்; தினசரி வாழ்வில் சில குறை; வயதில் சில பலவீனம்.",
  },
  {
    house: 2, lagna: "Aquarius", planetSign: "Pisces", planet: "Saturn", page: 244,
    en: "Tries to increase wealth with the help of his physique, sometimes bears loss in wealth, tries to control expenditure, gets some advantage from mother and land",
    ta: "உடல் வலிமையால் செல்வம் பெருக்க முயல்வார்; சில நேரம் செல்வ இழப்பு; செலவைக் கட்டுப்படுத்த முயல்வார்; தாய், நிலத்தால் சில ஆதாயம்.",
  },
  {
    house: 2, lagna: "Aquarius", planetSign: "Pisces", planet: "Rahu", page: 246,
    en: "Has deficiency in wealth, bears loss in the family, manages the expenditure by taking loans and support from others, bears fatal blows in the house of wealth, and is restless",
    ta: "செல்வக் குறை; குடும்பத்தில் இழப்பு; கடன் வாங்கியும் பிறர் உதவியாலும் செலவை சமாளிப்பார்; செல்வ வீட்டில் கடுமையான அடிகள்; அமைதியின்மை.",
  },
  {
    house: 2, lagna: "Aquarius", planetSign: "Pisces", planet: "Ketu", page: 248,
    en: "Faces deficiency in accumulating wealth, bears loss in wealth, faces disturbance and separation in the family, labours very hard to get wealth",
    ta: "செல்வம் சேர்ப்பதில் குறை; செல்வ இழப்பு; குடும்பத்தில் தொந்தரவும் பிரிவும்; செல்வம் பெற மிகக் கடுமையாக உழைப்பார்.",
  },
  {
    house: 2, lagna: "Pisces", planetSign: "Aries", planet: "Sun", page: 253,
    en: "Gets a lot of wealth after hard labour, gets some influence and some separation in the family, faces restlessness in the daily routine of life",
    ta: "கடின உழைப்புக்குப் பின் பெரும் செல்வம்; குடும்பத்தில் சில செல்வாக்கும் பிரிவும்; தினசரி வாழ்வில் அமைதியின்மை.",
  },
  {
    house: 2, lagna: "Pisces", planetSign: "Aries", planet: "Moon", page: 255,
    en: "Gets education, earns wealth through will-power, is happy with the progress in family and increase in wealth, faces some bondage regarding children, finds happiness in life, is said to be wealthy and is respectable",
    ta: "கல்வி பெறுவார்; மன உறுதியால் செல்வம் ஈட்டுவார்; குடும்ப முன்னேற்றத்திலும் செல்வ வளர்ச்சியிலும் மகிழ்ச்சி; பிள்ளைகள் வகையில் சில கட்டுப்பாடு; வாழ்வில் மகிழ்ச்சி; செல்வந்தர் என்று சொல்லப்படுவார்; மரியாதைக்குரியவர்.",
  },
  {
    house: 2, lagna: "Pisces", planetSign: "Aries", planet: "Mars", page: 257,
    en: "Is rich and fortunate, gets wealthier through destiny, experiences some deficiency and restlessness in the children's side, has deficiency in education and wisdom, maintains aristocracy in the daily life, has faith in God, and possesses fame",
    ta: "செல்வந்தர், அதிர்ஷ்டசாலி; விதியால் மேலும் செல்வம் பெறுவார்; பிள்ளைகள் வகையில் சில குறையும் அமைதியின்மையும்; கல்வி, அறிவில் குறை; தினசரி வாழ்வில் கம்பீரம்; இறைநம்பிக்கை; புகழ்.",
  },
  {
    house: 2, lagna: "Pisces", planetSign: "Aries", planet: "Mercury", page: 259,
    en: "Earns wealth through a respectable occupation, gets the strength of property, faces some bondage in family happiness, deficiency in mother's house, faces some bondage from wife's side, has deficiency in sexual pleasures, finds happiness in the daily routine of life",
    ta: "மரியாதைக்குரிய தொழிலால் செல்வம்; சொத்தின் வலிமை; குடும்ப மகிழ்ச்சியில் சில கட்டுப்பாடு; தாய் வீட்டில் குறை; மனைவி வீட்டில் சில கட்டுப்பாடு; பாலியல் இன்பத்தில் குறை; தினசரி வாழ்வில் மகிழ்ச்சி.",
  },
  {
    house: 2, lagna: "Pisces", planetSign: "Aries", planet: "Jupiter", page: 261,
    en: "Gets strength of wealth of his father, earns much wealth, manages a big occupation, gets great respect in government and society, gets great dignity in wealth and family, holds great influence in the house of enemies, gets victory over difficulties, and is very influential",
    ta: "தந்தையின் செல்வ வலிமை; அதிகம் சம்பாதிப்பார்; பெரிய தொழில்; அரசு, சமூகத்தில் பெரும் மரியாதை; செல்வத்திலும் குடும்பத்திலும் பெரும் கௌரவம்; எதிரி வீட்டில் பெரும் செல்வாக்கு; கஷ்டங்களில் வெற்றி; மிகுந்த செல்வாக்கு.",
  },
  {
    house: 2, lagna: "Pisces", planetSign: "Aries", planet: "Venus", page: 264,
    en: "Faces some bondage in connection with brother, gets the aristocracy in the daily routine of life, gets a long age, bears some loss in existing wealth, acquires wealth through very diplomatic devices, bears some loss in wealth",
    ta: "சகோதரர் வகையில் சில கட்டுப்பாடு; தினசரி வாழ்வில் கம்பீரம்; நீண்ட வயது; இருக்கும் செல்வத்தில் சில இழப்பு; மிகத் தந்திரமான வழிகளில் செல்வம் ஈட்டுவார்; செல்வத்தில் சில இழப்பு.",
  },
  {
    house: 2, lagna: "Pisces", planetSign: "Aries", planet: "Saturn", page: 266,
    en: "Experiences weakness in accumulation of wealth, bears heavy loss in the house of wealth, bears some loss in mother's house, finds joy in the diurnal occupation and routine of life, has some deficiency in the house of family",
    ta: "செல்வம் சேர்ப்பதில் பலவீனம்; செல்வ வீட்டில் பெரும் இழப்பு; தாய் வீட்டில் சில இழப்பு; தினசரி தொழிலிலும் வாழ்விலும் மகிழ்ச்சி; குடும்ப வீட்டில் சில குறை.",
  },
  {
    house: 2, lagna: "Pisces", planetSign: "Aries", planet: "Rahu", page: 268,
    en: "Bears loss in wealth, faces loss and distress in the family, secures progress after struggling very hard and bearing risks, uses secret power for wealth and labours hard",
    ta: "செல்வ இழப்பு; குடும்பத்தில் இழப்பும் துன்பமும்; மிகுந்த போராட்டத்துக்கும் ஆபத்துக்கும் பின் முன்னேற்றம்; செல்வத்துக்காக ரகசிய சக்தி பயன்படுத்தி கடினமாக உழைப்பார்.",
  },
  {
    house: 2, lagna: "Pisces", planetSign: "Aries", planet: "Ketu", page: 270,
    en: "Bears great difficulty in the side of wealth, bears severe pain due to the deficiency of the wealth, bears distress in the house of family, labours very hard and tries his best to get an increase the wealth, is somewhat restless",
    ta: "செல்வ வகையில் மிகுந்த சிரமம்; செல்வக் குறையால் கடும் வலி; குடும்பத்தில் துன்பம்; செல்வத்தை அதிகரிக்க மிகக் கடினமாக உழைப்பார்; சற்று அமைதியற்றவர்.",
  },
  {
    house: 3, lagna: "Aries", planetSign: "Gemini", planet: "Sun", page: 21,
    en: "Powerful intellect, gets education, power of children, influence of speech, physically strong, hard-working, peace with brothers, believes in Dharma and has faith in God, very courageous and speaks bravely",
    ta: "வலிமையான அறிவு; கல்வி; குழந்தைகளின் ஆற்றல்; பேச்சில் செல்வாக்கு; உடல் வலிமை; கடின உழைப்பு; உடன்பிறப்புகளுடன் அமைதி; தர்மத்திலும் இறைநம்பிக்கையிலும் நம்பிக்கை; மிகுந்த தைரியம்; துணிச்சலாகப் பேசுவார்.",
  },
  {
    house: 3, lagna: "Aries", planetSign: "Gemini", planet: "Moon", page: 23,
    en: "Happiness through brothers and sisters, gains from mother, gets fame, has faith in God, loves Dharrna, enjoys landed property, help through brothers",
    ta: "உடன்பிறப்புகளால் மகிழ்ச்சி; தாயால் ஆதாயம்; புகழ்; இறைநம்பிக்கை; தர்மத்தில் பற்று; நிலச் சொத்து; உடன்பிறப்புகளின் உதவி.",
  },
  {
    house: 3, lagna: "Aries", planetSign: "Gemini", planet: "Mars", page: 25,
    en: "Energetic, unhappy with brothers, recognised by government and society, comes up by his own merit, does good business, conquers the enemies, overcomes difficulties, gains happiness through father",
    ta: "சுறுசுறுப்பு; உடன்பிறப்புகளால் மனவருத்தம்; அரசு, சமூகத்தில் அங்கீகாரம்; தன் தகுதியால் உயர்வார்; நல்ல வணிகம்; எதிரிகளை வெல்வார்; தடைகளைக் கடப்பார்; தந்தை வழியில் மகிழ்ச்சி.",
  },
  {
    house: 3, lagna: "Aries", planetSign: "Gemini", planet: "Mercury", page: 27,
    en: "Intelligent and perfectionist, not much support from brothers and sisters, improves wealth by hard work, is influential and conquers over enemies",
    ta: "அறிவாளி, முழுமை நாடுபவர்; உடன்பிறப்புகளின் ஆதரவு குறைவு; கடின உழைப்பால் செல்வம் பெருக்குவார்; செல்வாக்குள்ளவர்; எதிரிகளை வெல்வார்.",
  },
  {
    house: 3, lagna: "Aries", planetSign: "Gemini", planet: "Jupiter", page: 29,
    en: "Fortunate, controls the expenditure, brothers and sisters are helpful, works hard, successful in occupation, enjoys family happiness",
    ta: "அதிர்ஷ்டசாலி; செலவைக் கட்டுப்படுத்துவார்; உடன்பிறப்புகள் உதவுவார்கள்; கடினமாக உழைப்பார்; தொழிலில் வெற்றி; குடும்ப மகிழ்ச்சி.",
  },
  {
    house: 3, lagna: "Aries", planetSign: "Gemini", planet: "Venus", page: 31,
    en: "Earns huge wealth through his cleverness, occupies good position, has many helpful brothers and sisters, has influential and good- looking wife, religious, enjoys good sexual pleasures, careful about duty and religion, does different efforts to improve his lot, a man of prestige and is influential and handsome, enjoys domestic and worldly affairs",
    ta: "தன் சாமர்த்தியத்தால் பெரும் செல்வம் ஈட்டுவார்; நல்ல நிலை; உதவும் உடன்பிறப்புகள் பலர்; செல்வாக்கும் அழகும் உள்ள மனைவி; இறைப்பற்று; பாலியல் இன்பம்; கடமையிலும் மதத்திலும் கவனம்; முயற்சிகளால் நிலையை உயர்த்துவார்; மரியாதைக்குரியவர்.",
  },
  {
    house: 3, lagna: "Aries", planetSign: "Gemini", planet: "Saturn", page: 33,
    en: "Is energetic and valorous, gets education and help from brothers and sisters, gets honour from government and society, spends much, unhappy with children, is insipid about religion and is proud",
    ta: "சுறுசுறுப்பும் வீரமும்; கல்வியும் உடன்பிறப்புகளின் உதவியும்; அரசு, சமூகத்தில் மரியாதை; அதிகம் செலவழிப்பார்; குழந்தைகள் வகையில் மனவருத்தம்; மதத்தில் ஆர்வம் குறைவு; பெருமை.",
  },
  {
    house: 3, lagna: "Aries", planetSign: "Gemini", planet: "Rahu", page: 35,
    en: "Has courage and works hard to earn wealth, controls brothers and sisters, no fear of any kind, exerts pressure on others and is influential",
    ta: "தைரியமும் பொருள் ஈட்ட கடின உழைப்பும்; உடன்பிறப்புகளைக் கட்டுப்படுத்துவார்; எந்த பயமும் இல்லை; பிறர் மீது அழுத்தம் கொடுப்பார்; செல்வாக்குள்ளவர்.",
  },
  {
    house: 3, lagna: "Aries", planetSign: "Gemini", planet: "Ketu", page: 37,
    en: "Unhappiness and enmity with brothers and sisters, weak, follows improper methods, does not lose self-confidence, seems to serve his selfish motives",
    ta: "உடன்பிறப்புகளுடன் மனவருத்தமும் பகையும்; பலவீனம்; முறையற்ற வழிகள்; தன்னம்பிக்கை இழக்காதவர்; சுயநலத்துக்காகச் செயல்படுவது போலத் தோன்றும்.",
  },
  {
    house: 3, lagna: "Taurus", planetSign: "Cancer", planet: "Sun", page: 42,
    en: "Gets the influential happiness from brothers and sisters, gets happiness of buildings and property, help from mother, but is irreligious",
    ta: "உடன்பிறப்புகளால் செல்வாக்கான மகிழ்ச்சி; கட்டிடம், சொத்தின் மகிழ்ச்சி; தாயின் உதவி; ஆனால் தர்ம நாட்டம் குறைவு.",
  },
  {
    house: 3, lagna: "Taurus", planetSign: "Cancer", planet: "Moon", page: 44,
    en: "Does industrious work, gets very good cooperation from brothers and sisters, hard-working, mental gains, believes in God, has patience",
    ta: "சுறுசுறுப்பான வேலை; உடன்பிறப்புகளின் நல்ல ஒத்துழைப்பு; கடின உழைப்பாளி; மன ஆதாயம்; இறைநம்பிக்கை; பொறுமை.",
  },
  {
    house: 3, lagna: "Taurus", planetSign: "Cancer", planet: "Mars", page: 46,
    en: "Feels distress and deficiency in the house of wife, separation from brothers, some weakness and wavering in the house of occupation, makes efforts to get influence in the house of enemies",
    ta: "மனைவி வீட்டில் கவலையும் குறையும்; உடன்பிறப்புகளைப் பிரிவு; தொழிலில் சிறு பலவீனமும் தடுமாற்றமும்; எதிரிகள் இடத்தில் செல்வாக்குக்கு முயல்வார்.",
  },
  {
    house: 3, lagna: "Taurus", planetSign: "Cancer", planet: "Mercury", page: 48,
    en: "Gets good education and earnings and also power of children, has discretion power, gets fame and power of brothers and sisters, a good conversationalist",
    ta: "நல்ல கல்வியும் வருமானமும்; குழந்தைகளின் ஆற்றல்; விவேகம்; உடன்பிறப்புகளால் புகழும் ஆற்றலும்; நல்ல பேச்சாளர்.",
  },
  {
    house: 3, lagna: "Taurus", planetSign: "Cancer", planet: "Jupiter", page: 50,
    en: "Gets huge gains, valorous, influential, great dignity on the daily routine of life, has influence on brothers and sisters, gains little importance to Dharma and God",
    ta: "பெரும் ஆதாயம்; வீரம்; செல்வாக்கு; தினசரி வாழ்வில் பெரும் கௌரவம்; உடன்பிறப்புகள் மீது செல்வாக்கு; தர்மத்தையும் இறையையும் சிறிது மதிப்பார்.",
  },
  {
    house: 3, lagna: "Taurus", planetSign: "Cancer", planet: "Venus", page: 52,
    en: "Progress by laborious and daily hard work, enmity with brothers and sisters, has great cause, fortunate, help from maternal grandfather's house",
    ta: "கடின உழைப்பாலும் தினசரி வேலையாலும் முன்னேற்றம்; உடன்பிறப்புகளுடன் பகை; பெரிய காரணம்; அதிர்ஷ்டசாலி; தாய்வழி தாத்தாவின் வீட்டிலிருந்து உதவி.",
  },
  {
    house: 3, lagna: "Taurus", planetSign: "Cancer", planet: "Saturn", page: 54,
    en: "Makes huge progress by his hard labour, gets success and fame, dissatisfaction through brothers and sisters, a good conversationalist careless in expenditure, follows religious duties, is very influential, courageous and help from father",
    ta: "கடின உழைப்பால் பெரும் முன்னேற்றம்; வெற்றியும் புகழும்; உடன்பிறப்புகளால் அதிருப்தி; நல்ல பேச்சாளர், செலவில் அக்கறையற்றவர்; மதக் கடமைகளைப் பின்பற்றுவார்; மிகுந்த செல்வாக்கும் தைரியமும்; தந்தை வகையில் உதவி.",
  },
  {
    house: 3, lagna: "Taurus", planetSign: "Cancer", planet: "Rahu", page: 56,
    en: "Gets some loss or separation in the house of brothers and sisters, works secretly, and is selfish",
    ta: "உடன்பிறப்புகள் வகையில் சிறு இழப்பும் பிரிவும்; ரகசியமாக வேலை செய்வார்; சுயநலம்.",
  },
  {
    house: 3, lagna: "Taurus", planetSign: "Cancer", planet: "Ketu", page: 58,
    en: "Does energetic deeds, toils hard for progress, separation from brothers and sisters and restless, brave, worried and diligent",
    ta: "ஆற்றலுடன் செயல்படுவார்; முன்னேற்றத்துக்காக கடுமையாக உழைப்பார்; உடன்பிறப்புகளைப் பிரிந்து அமைதியற்றவர்; தைரியம், கவலை, சுறுசுறுப்பு.",
  },
  {
    house: 3, lagna: "Gemini", planetSign: "Leo", planet: "Sun", page: 62,
    en: "Has great physical strength, gets dignity in the house of brothers and sisters, has less faith in God",
    ta: "பெரும் உடல் வலிமை; உடன்பிறப்புகள் வீட்டில் கம்பீரம்; இறைநம்பிக்கை குறைவு.",
  },
  {
    house: 3, lagna: "Gemini", planetSign: "Leo", planet: "Moon", page: 64,
    en: "Does very costly labour, earns huge wealth, hurdles and bondage in the house of brothers and sisters, does hard work to earn wealth, earns fame and courageous",
    ta: "மிகுந்த செலவுடன் கடின வேலை; பெரும் செல்வம் ஈட்டுவார்; உடன்பிறப்புகள் வீட்டில் தடைகளும் கட்டுப்பாடும்; செல்வத்துக்காகக் கடின உழைப்பு; புகழ்; தைரியம்.",
  },
  {
    house: 3, lagna: "Gemini", planetSign: "Leo", planet: "Mars", page: 66,
    en: "Great influence on the house of enemy, heavy gains by his labour, works with great pride, enmity with brothers, gets much influence and gains in government and society, enmity with father, brave, courageous, and feels some enmity in Dharma",
    ta: "எதிரி வீட்டில் பெரும் செல்வாக்கு; உழைப்பால் பெரும் ஆதாயம்; பெருமையுடன் வேலை செய்வார்; சகோதரருடன் பகை; அரசு, சமூகத்தில் செல்வாக்கும் ஆதாயமும்; தந்தையுடன் பகை; தைரியம்; தர்மத்தில் சிறு பகை.",
  },
  {
    house: 3, lagna: "Gemini", planetSign: "Leo", planet: "Mercury", page: 68,
    en: "Happiness with brothers and sisters, gets land, happy with mother, honours Dharma, gets fame, thinks fair, gets courage and enthusiasm",
    ta: "உடன்பிறப்புகளுடன் மகிழ்ச்சி; நிலம் கிடைக்கும்; தாயுடன் மகிழ்ச்சி; தர்மத்தை மதிப்பார்; புகழ்; நேர்மையாக சிந்திப்பார்; தைரியமும் உற்சாகமும்.",
  },
  {
    house: 3, lagna: "Gemini", planetSign: "Leo", planet: "Jupiter", page: 70,
    en: "Gets special importance, strength and beauty in the house of wife, connected with government and society, enjoys huge strength of power of sexual pleasures, help from brothers and sisters, deficiency in Dharma, is very energetic and courageous",
    ta: "மனைவி வீட்டில் சிறப்பு, வலிமையும் அழகும்; அரசு, சமூகத்துடன் தொடர்பு; பாலியல் இன்பத்தில் பெரும் வலிமை; உடன்பிறப்புகளின் உதவி; தர்மத்தில் குறை; மிகுந்த சுறுசுறுப்பும் தைரியமும்.",
  },
  {
    house: 3, lagna: "Gemini", planetSign: "Leo", planet: "Venus", page: 72,
    en: "Deficiency in the house of brothers and sisters, deficiency in education, unhappy with children, very clever and courageous",
    ta: "உடன்பிறப்புகள் வீட்டில் குறை; கல்வியில் குறை; பிள்ளைகளால் மனவருத்தம்; மிகவும் அறிவாளி, தைரியசாலி.",
  },
  {
    house: 3, lagna: "Gemini", planetSign: "Leo", planet: "Saturn", page: 74,
    en: "Labours very hard, unhappy with brothers and sisters, good longevity, follows Tammasic Dharma, toils very hard and spends much",
    ta: "மிகக் கடினமாக உழைப்பார்; உடன்பிறப்புகளால் மனவருத்தம்; நல்ல ஆயுள்; தாமச தர்மத்தைப் பின்பற்றுவார்; மிகுந்த முயற்சி, அதிக செலவு.",
  },
  {
    house: 3, lagna: "Gemini", planetSign: "Leo", planet: "Rahu", page: 76,
    en: "Loss and distress of brothers and sisters, does not lose courage, does hard labour, gets fatigued and is timid, selfish, very courageous",
    ta: "உடன்பிறப்புகள் வகையில் இழப்பும் துன்பமும்; தைரியம் இழக்காதவர்; கடின உழைப்பு; சோர்வும் கோழைத்தனமும்; சுயநலம்; மிகுந்த தைரியம்.",
  },
  {
    house: 3, lagna: "Gemini", planetSign: "Leo", planet: "Ketu", page: 78,
    en: "Great worries and difficulties in the house of brothers and sisters, loses brotherly effect, does serious labour, toils hard",
    ta: "உடன்பிறப்புகள் வீட்டில் பெரும் கவலையும் தடைகளும்; சகோதர உணர்வு குறையும்; கடுமையான வேலை; மிகக் கடினமாக உழைப்பார்.",
  },
  {
    house: 3, lagna: "Cancer", planetSign: "Virgo", planet: "Sun", page: 82,
    en: "Earns wealth and fame, progress of religion, supposed to be lucky, has brothers and sisters, works hard with high remuneration and is respected, strength of influencing others",
    ta: "செல்வமும் புகழும் ஈட்டுவார்; மதம் முன்னேறும்; அதிர்ஷ்டசாலி என்று கருதப்படுவார்; உடன்பிறப்புகள் உண்டு; கடினமாக உழைத்து அதிக ஊதியம் பெறுவார்; மரியாதைக்குரியவர்; பிறரைப் பாதிக்கும் ஆற்றல்.",
  },
  {
    house: 3, lagna: "Cancer", planetSign: "Virgo", planet: "Moon", page: 85,
    en: "Is energetic and works whole-heartedly for the development, is always happy, is faith in Dharma, is lucky, loves brothers and sisters very much, gets handsome physique, gets the fame and does the work peacefully and has strong will-power",
    ta: "ஆற்றலுடன் வளர்ச்சிக்காக முழு முயற்சி; எப்போதும் மகிழ்ச்சி; தர்மத்தில் நம்பிக்கை; அதிர்ஷ்டசாலி; உடன்பிறப்புகளை மிகவும் நேசிப்பார்; அழகான உடல்; புகழ்; அமைதியாக வேலை செய்வார்; வலுவான மன உறுதி.",
  },
  {
    house: 3, lagna: "Cancer", planetSign: "Virgo", planet: "Mars", page: 87,
    en: "Is very dignified and gets much respect in government and society, respect in the house of father, keeps influence in the house of enemy, never feels nervous or loses courage, does not care for brothers, children, father or Dharma, successful and brave, is very skilful",
    ta: "அரசு, சமூகத்தில் பெரும் மதிப்பும் மரியாதையும்; தந்தை வீட்டில் மரியாதை; எதிரி வீட்டில் செல்வாக்கு; பதற்றமோ தைரியமிழப்போ இல்லை; உடன்பிறப்பு, பிள்ளைகள், தந்தை, தர்மம் பற்றி அக்கறையற்றவர்; வெற்றியும் தைரியமும்; மிகுந்த திறமை.",
  },
  {
    house: 3, lagna: "Cancer", planetSign: "Virgo", planet: "Mercury", page: 89,
    en: "Is very energetic, gets the advantage ofbrothers and sisters, has little faith in Dharma, is of good height, possesses the power of expenditure, has great courage, ambition and modesty",
    ta: "மிகுந்த சுறுசுறுப்பு; உடன்பிறப்புகளால் நன்மை; தர்மத்தில் சிறு நம்பிக்கை; நல்ல உயரம்; செலவு செய்யும் வலிமை; பெரும் தைரியம், லட்சியம், அடக்கம்.",
  },
  {
    house: 3, lagna: "Cancer", planetSign: "Virgo", planet: "Jupiter", page: 91,
    en: "Rises due to his vigour and physical strength, thinks much of wife and merriments, small family, gets the power of brothers, gets success in the big way in the house of enemy, always busy, gets deficiency in sexual pleasures and anxiety in family",
    ta: "தன் வலிமையாலும் உடல் பலத்தாலும் உயர்வார்; மனைவி, மகிழ்ச்சி பற்றி அதிகம் நினைப்பார்; சிறிய குடும்பம்; சகோதரர் ஆற்றல்; எதிரி வீட்டில் பெரும் வெற்றி; எப்போதும் வேலையில்; பாலியல் இன்பத்தில் குறை; குடும்பத்தில் கவலை.",
  },
  {
    house: 3, lagna: "Cancer", planetSign: "Virgo", planet: "Venus", page: 93,
    en: "Weakness in wealth, deficiency in the side of brother, happiness in the house of Dharma, weakness from the house of mother, some weakness in the house of buildings and property and is somewhat lazy",
    ta: "செல்வ வகையில் குறை; சகோதரர் வகையில் பலவீனம்; தர்ம வீட்டில் மகிழ்ச்சி; தாய் வழியில் பலவீனம்; கட்டிடம், சொத்தில் சிறு குறை; சிறிது சோம்பல்.",
  },
  {
    house: 3, lagna: "Cancer", planetSign: "Virgo", planet: "Saturn", page: 95,
    en: "Puts in great energy, follows the daily occupation with energetic deeds, experiences some hardship in the side of children, gets the power in the side of wife and sexual pleasures, perplexity in the house of brothers and sisters, selfish, speaks very bitterly, causes injury to Dharm a",
    ta: "பெரும் ஆற்றலுடன் தினசரி வேலையைச் செய்வார்; பிள்ளைகள் வகையில் சில கஷ்டம்; மனைவி, பாலியல் இன்பத்தில் ஆற்றல்; உடன்பிறப்புகள் வகையில் குழப்பம்; சுயநலம்; மிகக் கடுமையாகப் பேசுவார்; தர்மத்துக்குக் கேடு.",
  },
  {
    house: 3, lagna: "Cancer", planetSign: "Virgo", planet: "Rahu", page: 97,
    en: "Unhappiness with brothers and sisters, does not follow justice and takes to unjust courses, very clever, careful, patient and courageous",
    ta: "உடன்பிறப்புகளால் மகிழ்ச்சியின்மை; நீதியைப் பின்பற்றாமல் தவறான வழிகளில் செல்வார்; மிகுந்த சாமர்த்தியம், கவனம், பொறுமை, தைரியம்.",
  },
  {
    house: 3, lagna: "Cancer", planetSign: "Virgo", planet: "Ketu", page: 99,
    en: "Gets heavy loss in the house of wealth, labours hard to increase the wealth, sometimes finds problems in earnings, unable to accumulate wealth",
    ta: "செல்வ வீட்டில் பெரும் இழப்பு; செல்வம் பெருக்க கடினமாக உழைப்பார்; சில நேரம் வருமானத்தில் சிக்கல்; செல்வம் சேர்க்க இயலாது.",
  },
  {
    house: 3, lagna: "Leo", planetSign: "Libra", planet: "Sun", page: 104,
    en: "Is supposed to be very lucky, has faith in God, gives importance to Dharma, dissatisfaction in the house of brothers and sisters, gets some weakness in the house of vigour, great hopelessness, and is courageous",
    ta: "மிகவும் அதிர்ஷ்டசாலி; இறைநம்பிக்கை; தர்மத்துக்கு முக்கியத்துவம்; உடன்பிறப்புகள் வீட்டில் அதிருப்தி; ஆற்றல் குறைவில் சில பலவீனம்; பெரும் நம்பிக்கையின்மை; தைரியசாலி.",
  },
  {
    house: 3, lagna: "Leo", planetSign: "Libra", planet: "Moon", page: 106,
    en: "Losses and weakness in the house of brothers and sisters, spends on brothers and sisters, expresses weakness in the vigour due to reasons of heavy expenditure, is calm and energetic",
    ta: "உடன்பிறப்புகள் வீட்டில் இழப்பும் பலவீனமும்; உடன்பிறப்புகளுக்காகச் செலவழிப்பார்; பெரும் செலவால் ஆற்றல் குறைவு; அமைதியும் சுறுசுறுப்பும்.",
  },
  {
    house: 3, lagna: "Leo", planetSign: "Libra", planet: "Mars", page: 108,
    en: "Is very fortunate, achieves great success through his physical strength and vigour, great influence in the house of enemy, does not care a bit for the diseases and difficulties, is very courageous, gets the power of brothers and sisters, and is very influential",
    ta: "மிக அதிர்ஷ்டசாலி; உடல் வலிமையாலும் ஆற்றலாலும் பெரும் வெற்றி; எதிரி வீட்டில் பெரும் செல்வாக்கு; நோய்களையும் கஷ்டங்களையும் பொருட்படுத்தாதவர்; மிகுந்த தைரியம்; உடன்பிறப்புகளின் ஆற்றல்; செல்வாக்குள்ளவர்.",
  },
  {
    house: 3, lagna: "Leo", planetSign: "Libra", planet: "Mercury", page: 110,
    en: "Earns wealth and many ways of gains, gets the advantage of brothers and sisters, much confidence in God, is very clever",
    ta: "செல்வமும் பல வழி ஆதாயமும்; உடன்பிறப்புகளின் ஆதாயம்; இறைநம்பிக்கை மிகுதி; மிகுந்த அறிவாளி.",
  },
  {
    house: 3, lagna: "Leo", planetSign: "Libra", planet: "Jupiter", page: 112,
    en: "Good longevity, pain in the house of brothers and sisters, gets education",
    ta: "நல்ல ஆயுள்; உடன்பிறப்புகள் வீட்டில் வலி; கல்வி பெறுவார்.",
  },
  {
    house: 3, lagna: "Leo", planetSign: "Libra", planet: "Venus", page: 114,
    en: "Gets the power of brothers, sisters and father, honour in connection with government and society, gets fame, does religious deeds, gets progress from business, industrious, courageous and skilful",
    ta: "சகோதரர், சகோதரி, தந்தை ஆகியோரின் ஆற்றல்; அரசு, சமூகத்தில் மரியாதை; புகழ்; மதச் செயல்கள்; வணிகத்தில் முன்னேற்றம்; கடின உழைப்பு, தைரியம், திறமை.",
  },
  {
    house: 3, lagna: "Leo", planetSign: "Libra", planet: "Saturn", page: 116,
    en: "Gets victory in the house of enemies, great power in everyday occupation, works courageously, some restlessness in the house of children, some restless in the house of expenditure",
    ta: "எதிரி வீட்டில் வெற்றி; தினசரி தொழிலில் பெரும் ஆற்றல்; தைரியமாக வேலை செய்வார்; பிள்ளைகள் வகையில் சில அமைதியின்மை; செலவு வீட்டில் சில அமைதியின்மை.",
  },
  {
    house: 3, lagna: "Leo", planetSign: "Libra", planet: "Rahu", page: 118,
    en: "Gets power of great influence, some separation and some restlessness, possesses the great power of patience and diplomacy in acquiring the most difficult task, does not care for troubles and difficulties, is very clever and in the end seems the increase of wealth",
    ta: "பெரும் செல்வாக்கு; சில பிரிவும் அமைதியின்மையும்; மிகக் கடினமான செயலை சாதிக்க பொறுமையும் ராஜதந்திரமும்; துன்பங்களைப் பொருட்படுத்தாதவர்; மிகுந்த சாமர்த்தியம்; முடிவில் செல்வ வளர்ச்சி.",
  },
  {
    house: 3, lagna: "Leo", planetSign: "Libra", planet: "Ketu", page: 120,
    en: "Some restlessness in the house of brothers and sisters, great rise in influence, does not care for politeness and gentility, always keen to accomplish his selfishness, and is powerful",
    ta: "உடன்பிறப்புகள் வீட்டில் சில அமைதியின்மை; செல்வாக்கில் பெரும் உயர்வு; கண்ணியத்தையும் நாகரிகத்தையும் பொருட்படுத்தாதவர்; சுயநலத்தை நிறைவேற்ற எப்போதும் ஆர்வம்; ஆற்றல் மிக்கவர்.",
  },
  {
    house: 3, lagna: "Virgo", planetSign: "Scorpio", planet: "Sun", page: 125,
    en: "Manages the expenditure by his own power, injures brothers, experiences some anxieties, has a weak destiny, is very industrious",
    ta: "தன் சக்தியால் செலவை நிர்வகிப்பார்; உடன்பிறப்புகளுக்கு காயம்; சில கவலைகள்; விதி பலவீனம்; மிகுந்த உழைப்பாளி.",
  },
  {
    house: 3, lagna: "Virgo", planetSign: "Scorpio", planet: "Moon", page: 127,
    en: "Gets ordinary gains through hard labour of brain, is thought to be fortunate due to laborious working, has faith in God and Dharma, distress in the side of brothers",
    ta: "மூளை உழைப்பால் சாதாரண ஆதாயம்; கடின உழைப்பால் அதிர்ஷ்டசாலி என்று கருதப்படுவார்; இறையிலும் தர்மத்திலும் நம்பிக்கை; உடன்பிறப்புகள் வகையில் மனவருத்தம்.",
  },
  {
    house: 3, lagna: "Virgo", planetSign: "Scorpio", planet: "Mars", page: 129,
    en: "Labours hard, injures the side of father, gets some weakness in the duty of keeping influence on the side of enemies",
    ta: "கடுமையாக உழைப்பார்; தந்தை வகையில் பாதிப்பு; எதிரிகள் இடத்தில் செல்வாக்கைக் காப்பதில் சிறு பலவீனம்.",
  },
  {
    house: 3, lagna: "Virgo", planetSign: "Scorpio", planet: "Mercury", page: 131,
    en: "Is handsome and energetic, gets the power of brothers and sisters, success due to his efficiency, lives with decency, has self-pride, and is a believer in God",
    ta: "அழகும் சுறுசுறுப்பும்; உடன்பிறப்புகளின் ஆற்றல்; திறமையால் வெற்றி; கண்ணியமாக வாழ்வார்; சுயபெருமை; இறைநம்பிக்கை.",
  },
  {
    house: 3, lagna: "Virgo", planetSign: "Scorpio", planet: "Jupiter", page: 133,
    en: "Gains heavily by undertaking many pleasant occupations, gets a beautiful and influential wife, is of good stature, gets sufficient sexual pleasures, brings up the family well, has faith in Dharma, has brothers and sisters, gets the power from the house of mother, labours hard, gets some power from the father-in-law's house, rises after the marriage, gets the development of all these things after the age of sixteen, and is fortunate",
    ta: "பல இனிய தொழில்களால் பெரும் ஆதாயம்; அழகும் செல்வாக்கும் உள்ள மனைவி; நல்ல உயரம்; போதிய பாலியல் இன்பம்; குடும்பத்தை நன்கு வளர்ப்பார்; தர்மத்தில் நம்பிக்கை; உடன்பிறப்புகள்; தாய் வீட்டின் ஆற்றல்; கடுமையாக உழைப்பார்; மாமனார் வீட்டிலிருந்து சில ஆற்றல்; திருமணத்துக்குப் பின் உயர்வு; பதினாறு வயதுக்குப் பின் வளர்ச்சி; அதிர்ஷ்டசாலி.",
  },
  {
    house: 3, lagna: "Virgo", planetSign: "Scorpio", planet: "Venus", page: 136,
    en: "Gets increase in wealth due to the power of destiny, gets much fame, is very religious, has brothers and sisters, honourable and influential",
    ta: "விதியின் வலிமையால் செல்வ வளர்ச்சி; பெரும் புகழ்; மிகுந்த மத நம்பிக்கை; உடன்பிறப்புகள்; மரியாதைக்குரியவர், செல்வாக்குள்ளவர்.",
  },
  {
    house: 3, lagna: "Virgo", planetSign: "Scorpio", planet: "Saturn", page: 138,
    en: "Does very energetic deeds through the wisdom, gets some bitterness in the plans of special expenditure, wins the enemies, keeps the influence on the side of brother, quarrelsome, is very courageous and influential",
    ta: "அறிவால் மிகச் சுறுசுறுப்பான செயல்கள்; சிறப்புச் செலவுத் திட்டங்களில் சில கசப்பு; எதிரிகளை வெல்வார்; சகோதரர் பக்கம் செல்வாக்கு; சண்டைக்காரர்; மிகுந்த தைரியமும் செல்வாக்கும்.",
  },
  {
    house: 3, lagna: "Virgo", planetSign: "Scorpio", planet: "Rahu", page: 140,
    en: "Is very industrious and full of valour, gets some distress in the side of brothers, is very courageous and selfish",
    ta: "மிகுந்த உழைப்பாளி, வீரம் நிறைந்தவர்; உடன்பிறப்புகள் வகையில் சில துன்பம்; மிகுந்த தைரியம்; சுயநலம்.",
  },
  {
    house: 3, lagna: "Virgo", planetSign: "Scorpio", planet: "Ketu", page: 142,
    en: "Works hard, gets some loss in the side of brothers and sisters and bears separation, works with great courage, is fearless",
    ta: "கடுமையாக உழைப்பார்; உடன்பிறப்புகள் வகையில் சில இழப்பும் பிரிவும்; மிகுந்த தைரியத்துடன் வேலை செய்வார்; அஞ்சாதவர்.",
  },
  {
    house: 3, lagna: "Libra", planetSign: "Sagittarius", planet: "Sun", page: 146,
    en: "Has great power and influence and is courageous, gets advantage of brothers, gets wealth and gains from the house of Dharma, is very energetic",
    ta: "பெரும் ஆற்றலும் செல்வாக்கும் தைரியமும்; உடன்பிறப்புகளின் ஆதாயம்; தர்ம வீட்டிலிருந்து செல்வமும் ஆதாயமும்; மிகுந்த சுறுசுறுப்பு.",
  },
  {
    house: 3, lagna: "Libra", planetSign: "Sagittarius", planet: "Moon", page: 148,
    en: "Gets the conjunction of brothers and sisters, is very fortunate and successful, rears Dharma, has full faith in God, very clever and industrious",
    ta: "உடன்பிறப்புகளுடன் இணைப்பு; மிக அதிர்ஷ்டசாலி, வெற்றியாளர்; தர்மத்தைக் காப்பவர்; இறையில் முழு நம்பிக்கை; மிகுந்த அறிவாளி, உழைப்பாளி.",
  },
  {
    house: 3, lagna: "Libra", planetSign: "Sagittarius", planet: "Mars", page: 150,
    en: "Does influential labour, influence and progress in connection with occupation, gets influential and beautiful wife, but gets some bondage in the side ofwife and brother, some dissatisfaction in the house of father, some weakness on account of sexual pleasures, occupation, wealth and power, some deficiency in the house of government and society, perplexities in the house of enemies",
    ta: "தொழிலில் செல்வாக்கான உழைப்பும் முன்னேற்றமும்; செல்வாக்கும் அழகும் உள்ள மனைவி; ஆனால் மனைவி, சகோதரருடன் சில பிணைப்பு; தந்தையிடம் சில அதிருப்தி; பாலியல், தொழில், செல்வம், ஆற்றலில் சில பலவீனம்; அரசு, சமூகத்தில் சில குறை; எதிரிகள் வீட்டில் சிக்கல்கள்.",
  },
  {
    house: 3, lagna: "Libra", planetSign: "Sagittarius", planet: "Mercury", page: 152,
    en: "Thought to be very fortunate, is courageous, possesses tender physique, renews contact with brother and sister after some weakness, is respectable and reserved",
    ta: "மிக அதிர்ஷ்டசாலி என்று கருதப்படுவார்; தைரியம்; மென்மையான உடல்; சில பலவீனத்துக்குப் பின் சகோதர சகோதரியுடன் மீண்டும் தொடர்பு; மரியாதைக்குரியவர், அடக்கமானவர்.",
  },
  {
    house: 3, lagna: "Libra", planetSign: "Sagittarius", planet: "Jupiter", page: 154,
    en: "Does very good and influential energetic deeds, gets gains in occupation, thought to be very fortunate, gets the power and authority in the house of brother",
    ta: "மிகச் சிறந்த, செல்வாக்கான செயல்கள்; தொழிலில் ஆதாயம்; மிக அதிர்ஷ்டசாலி என்று கருதப்படுவார்; சகோதரர் வீட்டில் அதிகாரமும் ஆற்றலும்.",
  },
  {
    house: 3, lagna: "Libra", planetSign: "Sagittarius", planet: "Venus", page: 156,
    en: "Is very energetic, toils hard, some deficiency in the house ofbrother, and is very clever",
    ta: "மிகுந்த ஆற்றல், கடின உழைப்பு; சகோதரர் வீட்டில் சில குறை; மிகவும் சாமர்த்தியமானவர்.",
  },
  {
    house: 3, lagna: "Libra", planetSign: "Sagittarius", planet: "Saturn", page: 158,
    en: "Is very energetic and has the great power of intellect, is very talkative, is not gentle, talks very freely, has keen children, spends much, puts in labour, opposition in the house of mother",
    ta: "மிகுந்த ஆற்றலும் அறிவின் வலிமையும்; அதிகம் பேசுவார்; மென்மை இல்லாதவர்; வெளிப்படையாகப் பேசுவார்; பிள்ளைகள் மீது அதிக ஆர்வம்; அதிகம் செலவழிப்பார்; உழைப்பார்; தாய் வகையில் எதிர்ப்பு.",
  },
  {
    house: 3, lagna: "Libra", planetSign: "Sagittarius", planet: "Rahu", page: 160,
    en: "Loss in the house of brothers, uses occult power, somewhat inactive and lazy, gets some weakness in physique",
    ta: "சகோதரர் வீட்டில் இழப்பு; மறை ஆற்றலைப் பயன்படுத்துவார்; சிறிது செயலற்றவர், சோம்பல்; உடலில் சில பலவீனம்.",
  },
  {
    house: 3, lagna: "Libra", planetSign: "Sagittarius", planet: "Ketu", page: 162,
    en: "Toils very hard, some special and incomplete importance in the house of brother, is very influential, hard worker and diligent, is cunning and violent",
    ta: "கடுமையாக உழைப்பார்; சகோதரர் வகையில் சிறப்பான ஆனால் முழுமையற்ற முக்கியத்துவம்; மிகுந்த செல்வாக்கு; கடின உழைப்பாளி, விடாமுயற்சி; தந்திரமும் வன்முறையும்.",
  },
  {
    house: 3, lagna: "Scorpio", planetSign: "Capricorn", planet: "Sun", page: 167,
    en: "Very energetic and industrious, gets the power of the house of father and brother with some enmity, progresses through his diligence, gets respect and honour, is said to be fortunate, earns fame, unable to get M success",
    ta: "மிகுந்த சுறுசுறுப்பு; தந்தை, சகோதரர் வீட்டில் வலிமை, சில பகை; தன் முயற்சியால் முன்னேறுவார்; மரியாதையும் கௌரவமும்; அதிர்ஷ்டசாலி என்று கருதப்படுவார்; புகழ்; வெற்றி கிடைக்காது.",
  },
  {
    house: 3, lagna: "Scorpio", planetSign: "Capricorn", planet: "Moon", page: 170,
    en: "Very enthusiastic and fortunate, religious and a devotee to God, gets unforeseen joy of brothers and sisters, always works with lofty ideas for progress",
    ta: "மிகுந்த ஆர்வம், அதிர்ஷ்டம்; மத நம்பிக்கை, இறைபக்தி; உடன்பிறப்புகளின் எதிர்பாராத மகிழ்ச்சி; முன்னேற்றத்துக்காக உயர்ந்த எண்ணங்களுடன் எப்போதும் வேலை.",
  },
  {
    house: 3, lagna: "Scorpio", planetSign: "Capricorn", planet: "Mars", page: 172,
    en: "Is very influential, gets dignity by doing grand deeds, strength in maternal grandfather's house, gets victory over hindrances, acquires full influence over enemies, gets progress in business, weakness in the house of father, keeps his severity over on the house of brother and is lull of self-respect",
    ta: "மிகுந்த செல்வாக்கு; பெரிய செயல்களால் மதிப்பு; தாய்வழி தாத்தா வீட்டில் வலிமை; தடைகளை வெல்வார்; எதிரிகள் மீது முழு செல்வாக்கு; தொழிலில் முன்னேற்றம்; தந்தை வீட்டில் பலவீனம்; சகோதரர் வீட்டில் கண்டிப்பு; மிகுந்த சுயமரியாதை.",
  },
  {
    house: 3, lagna: "Scorpio", planetSign: "Capricorn", planet: "Mercury", page: 174,
    en: "Does energetic deeds in a gende manner, has a long life, intimacy in connection with brothers and sisters with some hardship, selfish tactics in connection with Dharma",
    ta: "சாந்தமான முறையில் ஆற்றல் மிக்க செயல்கள்; நீண்ட ஆயுள்; சகோதர சகோதரியுடன் சில கஷ்டங்களுடன் நெருக்கம்; தர்ம விஷயத்தில் சுயநல வழிகள்.",
  },
  {
    house: 3, lagna: "Scorpio", planetSign: "Capricorn", planet: "Jupiter", page: 176,
    en: "Causes injury to his brothers, weakness in the house of kith and kin, gets weakness in education, is religious, has great faith in God, enjoys heavy gains from the house of occupation, gets cooperation from the wife, enjoys sexual pleasures, ahd is of weak heart",
    ta: "சகோதரர்களுக்குக் காயம்; உறவினர் வீட்டில் பலவீனம்; கல்வியில் சிறு குறை; மதப்பற்று; இறையில் மிகுந்த நம்பிக்கை; தொழில் வீட்டிலிருந்து பெரும் ஆதாயம்; மனைவியின் ஒத்துழைப்பு; பாலியல் இன்பம்; ஆனால் இதயம் பலவீனம்.",
  },
  {
    house: 3, lagna: "Scorpio", planetSign: "Capricorn", planet: "Venus", page: 178,
    en: "Labours hard, puts energies in the occupation, gets enthusiasm and sexual pleasures from wife, gets some power of brothers and sisters, gets cooperation of wife and enjoys the expenditure through his own and wife's energies, pays attention towards justice also in occupation",
    ta: "கடுமையாக உழைப்பார்; தொழிலில் ஆற்றலைச் செலுத்துவார்; மனைவியிடமிருந்து ஆர்வமும் பாலியல் இன்பமும்; சகோதர சகோதரியிடமிருந்து சில ஆற்றல்; மனைவியின் ஒத்துழைப்பு; தன் மற்றும் மனைவியின் ஆற்றலால் செலவை அனுபவிப்பார்; தொழிலில் நீதியிலும் கவனம்.",
  },
  {
    house: 3, lagna: "Scorpio", planetSign: "Capricorn", planet: "Saturn", page: 180,
    en: "Very energetic and does grand deeds, gets the happiness of brothers and sisters, spends too much, progress in the house of children a bit late, some strength of land and property, has a habit of saying cold and hot, happiness from other places",
    ta: "மிகுந்த சுறுசுறுப்பு, பெரிய செயல்கள்; சகோதர சகோதரியின் மகிழ்ச்சி; மிகுந்த செலவு; பிள்ளைகள் வீட்டில் முன்னேற்றம் சற்றுத் தாமதம்; நில, சொத்தில் சில வலிமை; குளிர், வெப்பம் பற்றி பேசும் பழக்கம்; வேறு இடங்களிலிருந்து மகிழ்ச்சி.",
  },
  {
    house: 3, lagna: "Scorpio", planetSign: "Capricorn", planet: "Rahu", page: 182,
    en: "Is full of valour, is very courageous and smart, moves on the path of progress, gets success with the help of strong devices, opposes the brother, maintains patience even when facing weaknesses, sometimes loses courage but emerges victorious",
    ta: "மிகுந்த வீரம், தைரியம், சாமர்த்தியம்; முன்னேற்றப் பாதையில் செல்வார்; வலுவான உபாயங்களால் வெற்றி; சகோதரரை எதிர்ப்பார்; பலவீனங்களின்போதும் பொறுமை; சில நேரம் தைரியமிழந்தாலும் வெற்றி பெறுவார்.",
  },
  {
    house: 3, lagna: "Scorpio", planetSign: "Capricorn", planet: "Ketu", page: 184,
    en: "Is of heroic nature, has long arms, is diligent, faces separation, goes forward enthusiastically though there may be numerous failures, and in the end gets some strong power",
    ta: "வீர இயல்புடையவர்; நீண்ட கரங்கள்; சுறுசுறுப்பானவர்; பிரிவைச் சந்திப்பார்; பல தோல்விகள் இருந்தாலும் ஆர்வத்துடன் முன்னேறுவார்; இறுதியில் சில வலிமையான சக்தி பெறுவார்.",
  },
  {
    house: 3, lagna: "Sagittarius", planetSign: "Aquarius", planet: "Sun", page: 189,
    en: "Rears Dharma, works with great courage, but faces some weakness in his diligence, some deficiency from the brothers and sisters though gets their cooperation, is famous and fortunate",
    ta: "தர்மத்தைக் காப்பார்; மிகுந்த தைரியத்துடன் வேலை செய்வார்; சுறுசுறுப்பில் சில பலவீனம்; உடன்பிறப்புகளின் ஒத்துழைப்பு இருந்தாலும் சிலவற்றில் குறை; புகழ்பெற்றவர்; அதிர்ஷ்டசாலி.",
  },
  {
    house: 3, lagna: "Sagittarius", planetSign: "Aquarius", planet: "Moon", page: 191,
    en: "Gets loss in the house of brothers and sisters, faces some loss in Dharma, is a man having numerous tactics, and is oveijoyed",
    ta: "உடன்பிறப்புகள் வீட்டில் இழப்பு; தர்மத்தில் சில இழப்பு; பல தந்திரங்கள் உடையவர்; மிகவும் மகிழ்ச்சியானவர்.",
  },
  {
    house: 3, lagna: "Sagittarius", planetSign: "Aquarius", planet: "Mars", page: 193,
    en: "Loss in the brother's house, maintains the influence in the house of enemies, experiences deficiency in children, faces some loss in occupation, gets the work done with conceited intellect, is very courageous",
    ta: "சகோதரர் வீட்டில் இழப்பு; எதிரி வீட்டில் செல்வாக்கைப் பராமரிப்பார்; பிள்ளைகளில் குறை; தொழிலில் சில இழப்பு; செருக்கான அறிவுடன் வேலையைச் சாதிப்பார்; மிகுந்த தைரியம்.",
  },
  {
    house: 3, lagna: "Sagittarius", planetSign: "Aquarius", planet: "Mercury", page: 195,
    en: "Gets the power of brothers and sisters, gets progress in family and wife, gets remarkable success in business occupation, works cleverly and diligently, is self-conceited, fortunate and wise",
    ta: "உடன்பிறப்புகளின் ஆற்றல்; குடும்பத்திலும் மனைவியிலும் முன்னேற்றம்; வணிகத் தொழிலில் குறிப்பிடத்தக்க வெற்றி; சாமர்த்தியமாகவும் சுறுசுறுப்பாகவும் வேலை செய்வார்; தன்னம்பிக்கை மிக்கவர், அதிர்ஷ்டசாலி, அறிவாளி.",
  },
  {
    house: 3, lagna: "Sagittarius", planetSign: "Aquarius", planet: "Jupiter", page: 197,
    en: "Gets monetary gains, gains happiness from wife's house, has deficiency in the side of mother and brother, gets family happiness, and is industrious",
    ta: "பண ஆதாயம்; மனைவி வீட்டில் மகிழ்ச்சி; தாய், சகோதரர் வகையில் குறை; குடும்ப மகிழ்ச்சி; சுறுசுறுப்பானவர்.",
  },
  {
    house: 3, lagna: "Sagittarius", planetSign: "Aquarius", planet: "Venus", page: 199,
    en: "Gets numerous advantages and a heavy income, gets some cooperation and antagonism in the house of brothers",
    ta: "பல ஆதாயங்களும் நல்ல வருமானமும்; சகோதரர் வீட்டில் சில ஒத்துழைப்பும் எதிர்ப்பும்.",
  },
  {
    house: 3, lagna: "Sagittarius", planetSign: "Aquarius", planet: "Saturn", page: 201,
    en: "Narrow wisdom in the affairs connected with wealth, speaks bitterly and rudely, gets deficiency in education also in children's side, spends much with uneasiness, some distress in Dharma, is very industrious and courageous",
    ta: "செல்வம் சம்பந்தமான விஷயங்களில் குறுகிய அறிவு; கடுமையாகவும் முரட்டுத்தனமாகவும் பேசுவார்; கல்வியிலும் பிள்ளைகள் பக்கம் குறை; அமைதியின்மையுடன் அதிகம் செலவழிப்பார்; தர்மத்தில் சில கஷ்டம்; மிகுந்த சுறுசுறுப்பும் தைரியமும்.",
  },
  {
    house: 3, lagna: "Sagittarius", planetSign: "Aquarius", planet: "Rahu", page: 203,
    en: "Is very energetic, works very courageously, achieves success by using great tactics, faces some wrangling in the house of brother",
    ta: "மிகுந்த சுறுசுறுப்பு, மிகத் தைரியமாக வேலை; பெரும் தந்திரத்தால் வெற்றி; சகோதரர் வீட்டில் சில சண்டை.",
  },
  {
    house: 3, lagna: "Sagittarius", planetSign: "Aquarius", planet: "Ketu", page: 205,
    en: "Loss in the house of brother, labours very hard for his progress, lives with great influence",
    ta: "சகோதரர் வீட்டில் இழப்பு; முன்னேற்றத்துக்காக மிகக் கடினமாக உழைப்பார்; பெரும் செல்வாக்குடன் வாழ்வார்.",
  },
  {
    house: 3, lagna: "Capricorn", planetSign: "Pisces", planet: "Sun", page: 210,
    en: "Spends his life with influence, gets a long age, injures the house of fortune and Dharnia, feces distress in the house of brother",
    ta: "செல்வாக்குடன் வாழ்வார்; நீண்ட வயது; தர்மம், அதிர்ஷ்டத்தின் வீட்டில் சேதம்; சகோதரர் வீட்டில் கஷ்டம்.",
  },
  {
    house: 3, lagna: "Capricorn", planetSign: "Pisces", planet: "Moon", page: 212,
    en: "Works very hard for occupation, gets an influential and beautiful wife, gets special sexual powers, pays attention to the rise of wealth, has conjunction of brothers and sisters",
    ta: "தொழிலுக்கு மிகுந்த உழைப்பு; செல்வாக்கும் அழகும் உள்ள மனைவி; சிறப்பான பாலியல் ஆற்றல்; செல்வ வளர்ச்சியில் கவனம்; உடன்பிறப்புகளின் இணைப்பு.",
  },
  {
    house: 3, lagna: "Capricorn", planetSign: "Pisces", planet: "Mars", page: 214,
    en: "Gets the power of brothers, gets advantage of land and mother's house, advantage in business occupation, also happiness from government and society, gets honour and prestige and is carefree",
    ta: "சகோதரர் ஆற்றல்; நிலம், தாய் வீட்டின் ஆதாயம்; வணிகத் தொழிலில் ஆதாயம்; அரசு, சமூகத்தில் மகிழ்ச்சி; மரியாதையும் கௌரவமும்; கவலையற்றவர்.",
  },
  {
    house: 3, lagna: "Capricorn", planetSign: "Pisces", planet: "Mercury", page: 216,
    en: "Is idle, thinks destiny to be great, feels worried from enemy side but gets the protection from destiny, faces some delay in the rise of fate",
    ta: "சோம்பலானவர்; விதியைப் பெரிதாக நினைப்பார்; எதிரி பக்கம் கவலை; ஆனால் விதியின் பாதுகாப்பு கிடைக்கும்; விதியின் உயர்வில் சில தாமதம்.",
  },
  {
    house: 3, lagna: "Capricorn", planetSign: "Pisces", planet: "Jupiter", page: 218,
    en: "Spends much, gets advantage with family and profession, possesses a special desire for sexual pleasures, and gets weakness in brothers' house",
    ta: "அதிகம் செலவழிப்பார்; குடும்பத்தாலும் தொழிலாலும் ஆதாயம்; பாலியல் இன்பத்தில் சிறப்பு விருப்பம்; சகோதரர் வீட்டில் பலவீனம்.",
  },
  {
    house: 3, lagna: "Capricorn", planetSign: "Pisces", planet: "Venus", page: 220,
    en: "Is very influential and possesses a handsome stature, has brothers and sisters, gets much wisdom and education, gets advantage in government affairs, gets loss in Dharma, is a good manager",
    ta: "மிகுந்த செல்வாக்கும் அழகான தோற்றமும்; உடன்பிறப்புகள் உண்டு; மிகுந்த ஞானமும் கல்வியும்; அரசு விவகாரங்களில் ஆதாயம்; தர்மத்தில் இழப்பு; நல்ல நிர்வாகி.",
  },
  {
    house: 3, lagna: "Capricorn", planetSign: "Pisces", planet: "Saturn", page: 222,
    en: "Is very influential, and energetic, works very hard, has deficiency in the house of brothers and sisters, deficiency in expenditure, believes in God",
    ta: "மிகுந்த செல்வாக்கும் சுறுசுறுப்பும்; மிகக் கடினமாக உழைப்பார்; உடன்பிறப்புகள் வீட்டில் குறை; செலவில் குறை; இறைநம்பிக்கை.",
  },
  {
    house: 3, lagna: "Capricorn", planetSign: "Pisces", planet: "Rahu", page: 224,
    en: "Is very influential and works very courageously, faces some loss in the house of brother, uses very secret tactics to increase his influence, is very clever, cautious and haughty",
    ta: "சுறுசுறுப்பாகவும் தைரியமாகவும் வேலை செய்வார்; பெரிய தந்திரங்களால் வெற்றி; சகோதரர் வீட்டில் சில சண்டை.",
  },
  {
    house: 3, lagna: "Capricorn", planetSign: "Pisces", planet: "Ketu", page: 226,
    en: "Is very energetic and works diligently, bears loss of brothers and sisters, feces severe failures, feels deficiency in the strength",
    ta: "மிகுந்த சுறுசுறுப்பும் கடின உழைப்பும்; சகோதர சகோதரி இழப்பு; கடுமையான தோல்விகளைச் சந்திப்பார்; ஆற்றலில் குறை.",
  },
  {
    house: 3, lagna: "Aquarius", planetSign: "Aries", planet: "Sun", page: 231,
    en: "Pursues a great business, accomphshes the daily task very influentially, gets very influential wife, gets the dignity of the power of brother and family, gets excess of sexual pleasures, labours very hard, weakness in destiny, deficiency in Dharma",
    ta: "பெரும் தொழில் நடத்துவார்; தினசரி வேலையை மிக செல்வாக்குடன் செய்வார்; செல்வாக்கான மனைவி; சகோதரர், குடும்பத்தின் வலிமை; பாலியல் இன்பம் மிகுதி; கடுமையாக உழைப்பார்; விதியில் பலவீனம்; தர்மத்தில் குறை.",
  },
  {
    house: 3, lagna: "Aquarius", planetSign: "Aries", planet: "Moon", page: 234,
    en: "Puts forward energetic deeds, gets influence due to the power of concentration, suppresses the enemy, faces opposition from the brother, takes great care about Dharma, toils hard and is powerful",
    ta: "சுறுசுறுப்பான செயல்கள்; ஒருமுகப்படுத்தும் ஆற்றலால் செல்வாக்கு; எதிரியை அடக்குவார்; சகோதரர் எதிர்ப்பு; தர்மத்தில் மிகுந்த அக்கறை; கடுமையாக உழைத்து வலிமையானவர்.",
  },
  {
    house: 3, lagna: "Aquarius", planetSign: "Aries", planet: "Mars", page: 236,
    en: "Possesses great authority and influence in government and society, defeats the enemy, gets the power of brother, is very dignified and energetic",
    ta: "அரசு, சமூகத்தில் பெரும் அதிகாரமும் செல்வாக்கும்; எதிரியை வெல்வார்; சகோதரரின் ஆற்றல்; மிகுந்த கம்பீரமும் சுறுசுறுப்பும்.",
  },
  {
    house: 3, lagna: "Aquarius", planetSign: "Aries", planet: "Mercury", page: 238,
    en: "Gets the power of education and intellect, gets children but feces some distress in the side of children, gains some power and also distress from brother and sisters, gets increased longevity, speaks authoritatively and forcibly on worldly affairs, uses intellect and courage in the matters of travelling, and is very carefree",
    ta: "கல்வியின் வலிமையும் அறிவும்; பிள்ளைகள் உண்டு, ஆனால் பிள்ளைகள் வகையில் சில துன்பம்; சகோதர சகோதரி வகையில் சில ஆற்றலும் துன்பமும்; நீண்ட ஆயுள்; உலக விவகாரங்களில் அதிகாரத்துடனும் வலுவாகவும் பேசுவார்; பயணத்தில் அறிவும் தைரியமும்; மிகவும் கவலையற்றவர்.",
  },
  {
    house: 3, lagna: "Aquarius", planetSign: "Aries", planet: "Jupiter", page: 240,
    en: "Earns wealth through his vigour, pursues the occupation vigorously, makes much profit in business, gets a beautiful wife and secures her help, gets help from brother, rears Dharma also, gets many kinds of gains, clothes, ornaments, wealth etc, has fascination regarding sexual pleasures in his heart, and loves beauty",
    ta: "தன் வலிமையால் செல்வம் ஈட்டுவார்; தொழிலை சுறுசுறுப்பாக நடத்துவார்; வணிகத்தில் மிகுந்த ஆதாயம்; அழகான மனைவி, அவரது உதவி; சகோதரர் உதவி; தர்மத்தையும் காப்பார்; பல ஆதாயங்கள், உடை, அணிகலன், செல்வம்; பாலியல் இன்பத்தில் ஈடுபாடு; அழகை விரும்புவார்.",
  },
  {
    house: 3, lagna: "Aquarius", planetSign: "Aries", planet: "Venus", page: 242,
    en: "Gets the progress of destiny comfortably, gets buildings and property, gets brothers and also a mother, possesses cleverness and farsightedness, gets fame, uses the strength of justice, loves peace",
    ta: "விதியின் முன்னேற்றம் சுலபமாக வரும்; நிலமும் சொத்தும்; சகோதரர் மற்றும் தாய் உண்டு; சாமர்த்தியமும் தொலைநோக்கும்; புகழ்; நீதியின் வலிமையைப் பயன்படுத்துவார்; அமைதியை விரும்புவார்.",
  },
  {
    house: 3, lagna: "Aquarius", planetSign: "Aries", planet: "Saturn", page: 244,
    en: "Gets easily tired, labours secretly, has physical weakness, is of short stature, has deficiency in handsomeness, spends much, tries to curtail expenditure, bears loss of brothers, follows a narrow and wrong path and spends in a wrong way, faces some loss and some strength in the side of education and children",
    ta: "எளிதில் சோர்வடைவார்; ரகசியமாக உழைப்பார்; உடல் பலவீனம்; குறுகிய உயரம்; அழகில் குறை; அதிகம் செலவழிப்பார்; செலவைக் குறைக்க முயல்வார்; சகோதரர் இழப்பு; குறுகிய, தவறான வழியில் செல்வார்; கல்வி, பிள்ளைகள் வகையில் சில இழப்பும் சில வலிமையும்.",
  },
  {
    house: 3, lagna: "Aquarius", planetSign: "Aries", planet: "Rahu", page: 246,
    en: "Faces troubles in brother's house, labours very hard to progress, uses secret devices to serve his selfishness, remains cautioned even when bearing severe blows on his power, is very influential and energetic",
    ta: "சகோதரர் வீட்டில் சிக்கல்; முன்னேற்றத்துக்காகக் கடினமாக உழைப்பார்; சுயநலத்துக்காக ரகசிய உபாயங்கள்; தன் வலிமைக்கு கடுமையான அடிகள் விழுந்தாலும் எச்சரிக்கையாக இருப்பார்; மிகுந்த செல்வாக்கும் ஆற்றலும்.",
  },
  {
    house: 3, lagna: "Aquarius", planetSign: "Aries", planet: "Ketu", page: 248,
    en: "Is very energetic and works with great courage, faces distress in the house of brother, possesses secret plans, feels deficiency in his strength",
    ta: "மிகுந்த சுறுசுறுப்பு, பெரும் தைரியமாக வேலை; சகோதரர் வீட்டில் துன்பம்; ரகசியத் திட்டங்கள் உண்டு; வலிமையில் குறை.",
  },
  {
    house: 3, lagna: "Pisces", planetSign: "Taurus", planet: "Sun", page: 253,
    en: "Is very diligent, respects Dharma, feces opposition from brothers and sisters, feels some fatigue due to labour, is clever and illustrious",
    ta: "மிகுந்த உழைப்பாளி; தர்மத்தை மதிப்பார்; சகோதர சகோதரியின் எதிர்ப்பு; உழைப்பால் சில சோர்வு; புத்திசாலி, புகழ்பெற்றவர்.",
  },
  {
    house: 3, lagna: "Pisces", planetSign: "Taurus", planet: "Moon", page: 255,
    en: "Has reliance on education and intellect, gets the power of children and strength of brothers and sisters, is unable to care for Dharma, has less faith in God, gets happiness from mother, gets buildings and property, gets rise in honour in government and society, develops business",
    ta: "கல்வியிலும் அறிவிலும் நம்பிக்கை; பிள்ளைகளின் ஆற்றல், சகோதர சகோதரியின் வலிமை; தர்மத்தைக் காக்க முடியாது; இறைநம்பிக்கை குறைவு; தாயால் மகிழ்ச்சி; நிலமும் சொத்தும்; அரசு, சமூகத்தில் மரியாதை உயரும்; தொழில் வளரும்.",
  },
  {
    house: 3, lagna: "Pisces", planetSign: "Taurus", planet: "Mars", page: 257,
    en: "Rears Dharma, gets advantage from government and society, gains advantage from father's house, gets the strength from brother, gains influence in the side of enemies",
    ta: "தர்மத்தைக் காப்பார்; அரசு, சமூகத்தில் ஆதாயம்; தந்தை வீட்டில் ஆதாயம்; சகோதரரின் வலிமை; எதிரி வீட்டில் செல்வாக்கு.",
  },
  {
    house: 3, lagna: "Pisces", planetSign: "Taurus", planet: "Mercury", page: 259,
    en: "Gets success in occupation, gets power from mother, gets the strength of land, buildings, brothers and sisters and of wife, lives comfortably, gets sexual pleasures",
    ta: "தொழிலில் வெற்றி; தாயிடமிருந்து ஆற்றல்; நிலம், கட்டிடம், சகோதர சகோதரி, மனைவி ஆகியோரின் வலிமை; வசதியாக வாழ்வார்; பாலியல் இன்பம்.",
  },
  {
    house: 3, lagna: "Pisces", planetSign: "Taurus", planet: "Jupiter", page: 261,
    en: "Acquires the progress after labouring very hard and through hereditary deeds, gets the support of government and society, faces some opposition from brother, feels deficiency in income, rears Dharma, gets dignity in the line of occupation, gets grandeur in wife, gets influence and pleasures of the family, is of obstinate nature, and is influential",
    ta: "மிகுந்த கடின உழைப்புக்கும் பரம்பரைச் செயல்களுக்கும் பின் முன்னேற்றம்; அரசு, சமூகத்தின் ஆதரவு; சகோதரரிடம் சில எதிர்ப்பு; வருமானக் குறை; தர்மத்தைக் காப்பார்; தொழிலில் கௌரவம்; மனைவி வீட்டில் சிறப்பு; குடும்பத்தின் செல்வாக்கும் இன்பமும்; பிடிவாத இயல்பு; செல்வாக்குள்ளவர்.",
  },
  {
    house: 3, lagna: "Pisces", planetSign: "Taurus", planet: "Venus", page: 264,
    en: "Faces some troubles with brothers and sisters, possesses great pride in the daily routine of life, gets good age, injures Dharma, is fearless and influential",
    ta: "சகோதர சகோதரியுடன் சில தொல்லைகள்; தினசரி வாழ்வில் பெரும் பெருமை; நல்ல ஆயுள்; தர்மத்துக்கு கேடு; அஞ்சாதவர், செல்வாக்குள்ளவர்.",
  },
  {
    house: 3, lagna: "Pisces", planetSign: "Taurus", planet: "Saturn", page: 266,
    en: "Is very energetic, spends more than he earns, bears some loss through brother, has some deficiency in education, bears loss in the side of children, bears some loss in the house of Dharma, has deficiency in fame, has some weakness in his physical strength",
    ta: "மிகுந்த சுறுசுறுப்பு; வருமானத்தை விட அதிகம் செலவழிப்பார்; சகோதரர் வகையில் சில இழப்பு; கல்வியில் குறை; பிள்ளைகள் வகையில் இழப்பு; தர்மத்தின் வீட்டில் சில இழப்பு; புகழ் குறைவு; உடல் வலிமையில் சில பலவீனம்.",
  },
  {
    house: 3, lagna: "Pisces", planetSign: "Taurus", planet: "Rahu", page: 268,
    en: "Gets success in his energetic deeds, labours hard, gets somewhat worried in brothers' house, follows some unjust devices, is very clever and carefree",
    ta: "மிகுந்த உழைப்பால் வெற்றி; கடின உழைப்பு; சகோதரர் வீட்டில் சற்று கவலை; சில அநீதியான உபாயங்களைப் பின்பற்றுவார்; மிகவும் சாமர்த்தியமானவர், கவலையற்றவர்.",
  },
  {
    house: 3, lagna: "Pisces", planetSign: "Taurus", planet: "Ketu", page: 270,
    en: "Is very bold and labours very hard, is restless in the house ofbrother, possesses great physical strength, possesses great courage, faces some severe calamities, works very patiently, does not consider anything impossible",
    ta: "மிகத் தைரியமும் கடின உழைப்பும்; சகோதரர் வீட்டில் அமைதியின்மை; மிகுந்த உடல் வலிமை; மிகுந்த தைரியம்; சில கடுமையான ஆபத்துகளைச் சந்திப்பார்; மிகப் பொறுமையாக வேலை செய்வார்; எதுவும் இயலாததாக நினைக்க மாட்டார்.",
  },
  {
    house: 4, lagna: "Aries", planetSign: "Cancer", planet: "Sun", page: 21,
    en: "Gets good education, gets the power of children and qualities of a mother, speaks sweetly, gets land and property, uninterested in the house of father, gets slack at times, malicious in respect of government and society, wise",
    ta: "நல்ல கல்வி; குழந்தைகளின் ஆற்றலும் தாயின் குணங்களும்; இனிமையாகப் பேசுவார்; நிலமும் சொத்தும்; தந்தை வீட்டில் ஆர்வம் குறைவு; சில நேரம் சோம்பல்; அரசு, சமூக வகையில் பொறாமை; அறிவாளி.",
  },
  {
    house: 4, lagna: "Aries", planetSign: "Cancer", planet: "Moon", page: 23,
    en: "Gets good motherly affection and landed property through her, is caiefiee and mentally happy, considers mother as superior to father, undertakes works relating to government and society and enjoys pleasures and luxuries",
    ta: "தாயின் நல்ல அன்பும் நிலச் சொத்தும்; அக்கறையுடன் மனத்தில் மகிழ்ச்சி; தந்தையைவிட தாயை உயர்வாக நினைப்பார்; அரசு, சமூக வேலைகளைச் செய்வார்; இன்பமும் வசதியும் அனுபவிப்பார்.",
  },
  {
    house: 4, lagna: "Aries", planetSign: "Cancer", planet: "Mars", page: 25,
    en: "Short in stature, loses motherly affection, becomes restless, loses lands and buildings, not happy with wife, hard-working",
    ta: "உயரம் குறைவு; தாயின் அன்பை இழப்பார்; அமைதியின்மை; நிலமும் கட்டிடமும் இழப்பு; மனைவியுடன் மகிழ்ச்சியின்மை; கடின உழைப்பாளி; ஞானமும் அவசரமும்; குழந்தைகளுடன் அதிருப்தி; அதிகம் செலவழிப்பார்; லட்சியமானவர்.",
  },
  {
    house: 4, lagna: "Aries", planetSign: "Cancer", planet: "Mercury", page: 27,
    en: "Energetic and industrious, faces hindrances from brothers and sisters, happiness from maternal grandfather, dislikes mother, problems in the property, restless, wins over the enemies, gains from occupation, honour from state and society",
    ta: "சுறுசுறுப்பும் உழைப்பும்; உடன்பிறப்புகளால் தடைகள்; தாய்வழி தாத்தாவால் மகிழ்ச்சி; தாயிடம் விருப்பமின்மை; சொத்தில் சிக்கல்; அமைதியின்மை; எதிரிகளை வெல்வார்; தொழிலில் ஆதாயம்; அரசு, சமூகத்தில் மரியாதை.",
  },
  {
    house: 4, lagna: "Aries", planetSign: "Cancer", planet: "Jupiter", page: 29,
    en: "Happiness through houses and gains, has good luck, is showy and religious, pleasures from the side of mother, gets no happiness from father and is fortunate",
    ta: "வீடு, ஆதாயங்களால் மகிழ்ச்சி; நல்ல அதிர்ஷ்டம்; ஆடம்பரமும் தர்ம நாட்டமும்; தாய் வழியில் இன்பம்; தந்தையால் மகிழ்ச்சி இல்லை; அதிர்ஷ்டசாலி.",
  },
  {
    house: 4, lagna: "Aries", planetSign: "Cancer", planet: "Venus", page: 31,
    en: "Happy and wealthy, gets a good wife, has affection from mother, occupies good position, gets honour in government and society, father helpful, enjoys worldly pleasures and is clever in approach",
    ta: "மகிழ்ச்சியும் செல்வமும்; நல்ல மனைவி; தாயின் அன்பு; நல்ல நிலை; அரசு, சமூகத்தில் மரியாதை; தந்தையின் உதவி; உலக இன்பங்களை அனுபவிப்பார்; சாமர்த்தியமானவர்.",
  },
  {
    house: 4, lagna: "Aries", planetSign: "Cancer", planet: "Saturn", page: 33,
    en: "Happiness from father, help from government and society, not much affection from mother, suffers from enemies, a bit careless and has to work very hard",
    ta: "தந்தையால் மகிழ்ச்சி; அரசு, சமூகத்தின் உதவி; தாயின் அன்பு குறைவு; எதிரிகளால் துன்பம்; சிறிது அசட்டை; மிகக் கடினமாக உழைக்க வேண்டும்.",
  },
  {
    house: 4, lagna: "Aries", planetSign: "Cancer", planet: "Rahu", page: 35,
    en: "Loses mother, unhappy and loses peace, loses property and lands, bears mental stress, makes others astonish",
    ta: "தாயை இழப்பார்; மகிழ்ச்சியின்றி அமைதியை இழப்பார்; சொத்தும் நிலமும் இழப்பார்; மன அழுத்தம்; மற்றவர்களை வியக்க வைப்பார்.",
  },
  {
    house: 4, lagna: "Aries", planetSign: "Cancer", planet: "Ketu", page: 37,
    en: "Lacks motherly affection, gets separated from family, finds losses in immovable properties, lands and buildings, feels restless and unhappy, has to bear grave calamities in his own place and finally succeeds in achieving gains and pleasures",
    ta: "தாயின் அன்பு குறைவு; குடும்பத்தைப் பிரிவார்; அசையாச் சொத்து, நிலம், கட்டிடங்களில் இழப்பு; அமைதியின்மை, மகிழ்ச்சியின்மை; சொந்த ஊரில் பெரும் ஆபத்துகளைத் தாங்குவார்; இறுதியில் ஆதாயமும் இன்பமும் பெறுவார்.",
  },
  {
    house: 4, lagna: "Taurus", planetSign: "Leo", planet: "Sun", page: 42,
    en: "Gets land and property, happiness from mother, not much help from father, contacts with government and feels happy in his own house",
    ta: "நிலமும் சொத்தும்; தாயால் மகிழ்ச்சி; தந்தையிடம் பெரிய உதவி இல்லை; அரசுடன் தொடர்பு; தன் வீட்டில் மகிழ்ச்சி.",
  },
  {
    house: 4, lagna: "Taurus", planetSign: "Leo", planet: "Moon", page: 44,
    en: "Happiness through brothers and sisters, gets lands and buildings, help from others, not cordial relations with father, enterprise and happiness",
    ta: "உடன்பிறப்புகளால் மகிழ்ச்சி; நிலமும் கட்டிடமும் பெறுவார்; பிறரின் உதவி; தந்தையுடன் நெருக்கமற்ற உறவு; முயற்சியும் மகிழ்ச்சியும்.",
  },
  {
    house: 4, lagna: "Taurus", planetSign: "Leo", planet: "Mars", page: 46,
    en: "Loss of mother, gets separated from motherland, happiness in occupation, strong happiness in the side of wife, works hard to earn more wealth, weakness in sexual pleasures, respect from government and society",
    ta: "தாயை இழப்பார்; தாய்நாட்டைப் பிரிவார்; தொழிலில் மகிழ்ச்சி; மனைவி வகையில் பெரும் மகிழ்ச்சி; செல்வம் பெருக்க கடினமாக உழைப்பார்; பாலியல் இன்பத்தில் பலவீனம்; அரசு, சமூகத்தில் மரியாதை.",
  },
  {
    house: 4, lagna: "Taurus", planetSign: "Leo", planet: "Mercury", page: 48,
    en: "Acquires good education, gets happiness of children and also gets wealth and also buildings and property, has decent ideas and happiness and comforts, does happy deeds and has good oratorical ability, progress in business",
    ta: "நல்ல கல்வி; பிள்ளைகளின் மகிழ்ச்சி; செல்வமும் கட்டிடமும் சொத்தும்; நல்ல எண்ணங்களும் மகிழ்ச்சியும் வசதியும்; மகிழ்ச்சியான செயல்கள்; நல்ல பேச்சுத் திறன்; வணிகத்தில் முன்னேற்றம்.",
  },
  {
    house: 4, lagna: "Taurus", planetSign: "Leo", planet: "Jupiter", page: 50,
    en: "Lives long, lame in life and career, separation in the house of mother, benefit from contact of foreign countries, mixed relations with father, opposition from government and society, has occult powers",
    ta: "நீண்ட ஆயுள்; தொழிலிலும் வாழ்விலும் நொண்டித்தன்மை; தாய் வீட்டில் பிரிவு; வெளிநாட்டுத் தொடர்பால் ஆதாயம்; தந்தையுடன் கலந்த உறவு; அரசு, சமூகத்தில் எதிர்ப்பு; மறை ஆற்றல்.",
  },
  {
    house: 4, lagna: "Taurus", planetSign: "Leo", planet: "Venus", page: 52,
    en: "Enmity with mother, gets some loss and disease in the physical happiness, some unhappiness in the house of father, honour through government and society, problem with regard to land and buildings, tries very hard for the progress of business and house, slight restlessness due to enemies",
    ta: "தாயுடன் பகை; உடல் மகிழ்ச்சியில் சிறு இழப்பும் நோயும்; தந்தை வீட்டில் சிறு அதிருப்தி; அரசு, சமூகத்தில் மரியாதை; நிலம், கட்டிடத்தில் சிக்கல்; தொழிலையும் வீட்டையும் முன்னேற்ற கடினமாக முயல்வார்; எதிரிகளால் சிறு அமைதியின்மை.",
  },
  {
    house: 4, lagna: "Taurus", planetSign: "Leo", planet: "Saturn", page: 54,
    en: "Dissatisfaction from parents, gets the influence and high power in the house of enemies, gets honour from government and society, feels a little unhappy, undertakes troublesome deeds and is religious",
    ta: "பெற்றோர் மீது அதிருப்தி; எதிரி வீட்டில் செல்வாக்கும் உயர் அதிகாரமும்; அரசு, சமூகத்தில் மரியாதை; சிறிது மனவருத்தம்; தொல்லை தரும் செயல்களைச் செய்வார்; தர்மத்தில் நாட்டம்.",
  },
  {
    house: 4, lagna: "Taurus", planetSign: "Leo", planet: "Rahu", page: 56,
    en: "Loss in house of mother, loses land and buildings, unhappy, leaves his birthplace, suffering in life, happiness through secret methods, fatal and deep plans in the place of living and happiness, feels restless",
    ta: "தாய் வீட்டில் இழப்பு; நிலமும் கட்டிடமும் இழப்பு; மகிழ்ச்சியின்மை; பிறந்த ஊரை விட்டு விலகுவார்; வாழ்வில் துன்பம்; ரகசிய வழிகளால் மகிழ்ச்சி; ஆபத்தான ஆழமான திட்டங்கள்; அமைதியின்மை.",
  },
  {
    house: 4, lagna: "Taurus", planetSign: "Leo", planet: "Ketu", page: 58,
    en: "Separation from motherland, troubles in buildings and property, many kinds of losses and unhappy, gets happiness after suffering a lot",
    ta: "தாய்நாட்டைப் பிரிவார்; வீடு, சொத்தில் தொல்லைகள்; பல வகை இழப்புகள்; மகிழ்ச்சியின்மை; மிகுந்த துன்பத்துக்குப் பின் மகிழ்ச்சி.",
  },
  {
    house: 4, lagna: "Gemini", planetSign: "Virgo", planet: "Sun", page: 62,
    en: "Gets happiness of brothers and sisters, gets the strength of buildings and property, gets progress by labour happily, gets influence in the house of mother, respect to father, gets honour and influence in connection with government and society, gets and influence in the house of business",
    ta: "உடன்பிறப்புகளால் மகிழ்ச்சி; கட்டிடம், சொத்தின் வலிமை; மகிழ்ச்சியுடன் உழைப்பால் முன்னேற்றம்; தாய் வீட்டில் செல்வாக்கு; தந்தைக்கு மரியாதை; அரசு, சமூகத்தில் மரியாதையும் செல்வாக்கும்; தொழில் வீட்டில் செல்வாக்கு.",
  },
  {
    house: 4, lagna: "Gemini", planetSign: "Virgo", planet: "Moon", page: 64,
    en: "Accumulates wealth, lands and buildings and bondage with mother, gets success in wealth and business, honour in the house of government and society, has great patience and peace of mind",
    ta: "செல்வம், நிலம், கட்டிடம் சேர்ப்பார்; தாயுடன் கட்டுப்பாடு; செல்வமும் தொழிலும் வெற்றி; அரசு, சமூகத்தில் மரியாதை; பெரும் பொறுமையும் மன அமைதியும்.",
  },
  {
    house: 4, lagna: "Gemini", planetSign: "Virgo", planet: "Mars", page: 66,
    en: "Some gains and some loss in the house of mother, help from the side of maternal grandfather's house, gets gains from lands and buildings, mixed feeling with regard to happiness, does not care for enemies but gains from them, mixed relations from the side of wife, some industry in the house of father and the government and society",
    ta: "தாய் வீட்டில் சில இழப்பும் சில ஆதாயமும்; தாய்வழி தாத்தா வீட்டில் உதவி; நிலம், கட்டிடத்தால் ஆதாயம்; மகிழ்ச்சியில் கலந்த உணர்வுகள்; எதிரிகளைப் பொருட்படுத்தாவிட்டாலும் அவர்களால் ஆதாயம்; மனைவி வகையில் கலந்த உறவு; தந்தை, அரசு, சமூக வகையில் சில முயற்சி.",
  },
  {
    house: 4, lagna: "Gemini", planetSign: "Virgo", planet: "Mercury", page: 68,
    en: "Lives happily, has a good physique, deficiency in the house of father, does not care for government and society, gets buildings and property, happy with spiritual powers, careless",
    ta: "மகிழ்ச்சியாக வாழ்வார்; நல்ல உடல்; தந்தை வீட்டில் குறை; அரசு, சமூகத்தைப் பொருட்படுத்தார்; நிலமும் சொத்தும்; ஆன்மிக ஆற்றலில் மகிழ்ச்சி; அசட்டையானவர்.",
  },
  {
    house: 4, lagna: "Gemini", planetSign: "Virgo", planet: "Jupiter", page: 70,
    en: "Gets happiness of business and occupation, gets honour from the house of mother, also happiness from the house of father, does the daily occupation with dignity and in a lofty manner, gets happiness from government and society, gets the strength of lands and buildings, is industrious and honourable",
    ta: "தொழிலிலும் வேலையிலும் மகிழ்ச்சி; தாய் வீட்டில் மரியாதை; தந்தை வீட்டிலும் மகிழ்ச்சி; தினசரி வேலையை கௌரவத்துடனும் உயர்வுடனும் செய்வார்; அரசு, சமூகத்தில் மகிழ்ச்சி; நிலம், கட்டிடங்களின் வலிமை; உழைப்பாளி, மரியாதைக்குரியவர்.",
  },
  {
    house: 4, lagna: "Gemini", planetSign: "Virgo", planet: "Venus", page: 72,
    en: "Loss with mother and separation from motherland and birthplace progress in government and society, weak in education, unhappy with children, feels mental worry due to some domestic unhappiness",
    ta: "தாய் வகையில் இழப்பும், தாய்நாடு, பிறந்த ஊரைப் பிரிவும்; அரசு, சமூகத்தில் முன்னேற்றம்; கல்வியில் பலவீனம்; குழந்தைகளால் அதிருப்தி; குடும்பத்தில் சில கவலைகள்.",
  },
  {
    house: 4, lagna: "Gemini", planetSign: "Virgo", planet: "Saturn", page: 74,
    en: "Some loss in the maternal affection, spends the daily routine of life with influence, some worry and some fortune, engaged in acquiring buildings",
    ta: "தாய்ப் பாசத்தில் சில இழப்பு; வாழ்க்கையை செல்வாக்குடன் கழிப்பார்; சிறு கவலையும் சில அதிர்ஷ்டமும்; கட்டிடங்களைச் சேர்ப்பதில் ஈடுபாடு.",
  },
  {
    house: 4, lagna: "Gemini", planetSign: "Virgo", planet: "Rahu", page: 76,
    en: "Deficiency in the happiness of mother, gets loss in connection with lands and buildings, unhappy in domestic life, very serious",
    ta: "தாயின் மகிழ்ச்சியில் குறை; நிலம், கட்டிடத்தில் இழப்பு; குடும்ப வாழ்வில் மகிழ்ச்சியின்மை; மிகவும் கடுமையானவர்.",
  },
  {
    house: 4, lagna: "Gemini", planetSign: "Virgo", planet: "Ketu", page: 78,
    en: "Loss and deficiency in the house of mother, some hindrances in connection with lands and buildings, stable position in the house of happiness after many disturbances and difficulties",
    ta: "தாய் வீட்டில் இழப்பும் குறையும்; நிலம், கட்டிடத்தில் சில தடைகள்; பல குழப்பங்களுக்கும் கஷ்டங்களுக்கும் பின் நிலையான மகிழ்ச்சி.",
  },
  {
    house: 4, lagna: "Cancer", planetSign: "Libra", planet: "Sun", page: 82,
    en: "Feels troublesome on account of wealth, restlessness in the house of happiness, some deficiency in the house of father, some deficiency in the house of mother, honour in business, lacks in cash possessions, experiencing troubles regarding land and property, gets respect in government and society, restlessness in the house of family and wealth",
    ta: "வருமானத்தில் கவலை; மகிழ்ச்சியில் அமைதியின்மை; தந்தை வீட்டில் சில குறை; தாய் வீட்டில் சில குறை; தொழிலில் மரியாதை; பணம் குறைவு; நிலம், சொத்தில் சிக்கல்; அரசு, சமூகத்தில் மரியாதை; குடும்பத்திலும் செல்வத்திலும் அமைதியின்மை.",
  },
  {
    house: 4, lagna: "Cancer", planetSign: "Libra", planet: "Moon", page: 85,
    en: "Lives happily at his birthplace, is of handsome physique, gets the happiness of lands and property, does big works, makes others cheerful, respects parents, feels troublesome to go to foreign places, gets name and appreciation from government and society, lives peacefully and gets success",
    ta: "பிறந்த ஊரில் மகிழ்ச்சியாக வாழ்வார்; அழகான உடல்; நிலம், சொத்தின் மகிழ்ச்சி; பெரிய வேலைகளைச் செய்வார்; பிறரை மகிழ்விப்பார்; பெற்றோரை மதிப்பார்; வெளிநாடு செல்வது கடினம்; அரசு, சமூகத்தில் பெயரும் பாராட்டும்; அமைதியாக வாழ்ந்து வெற்றி பெறுவார்.",
  },
  {
    house: 4, lagna: "Cancer", planetSign: "Libra", planet: "Mars", page: 87,
    en: "Gains much intelligence, has a huge business and big undertakings, is an expert in conducting the domestic and worldly affairs, gains profit in the daily routine of life, gets much honour and influence in his own house and in the side of his wife, happiness from father, son and mother, gets land and property, wants to get more sexual pleasures, gets fame in government and society and gets special sexual pleasures",
    ta: "மிகுந்த அறிவு; பெரிய வியாபாரமும் பெரிய முயற்சிகளும்; வீட்டு, உலக விவகாரங்களை நடத்துவதில் நிபுணர்; தினசரி வாழ்வில் ஆதாயம்; தன் வீட்டில், மனைவி வகையில் மரியாதையும் செல்வாக்கும்; தந்தை, மகன், தாய் வகையில் மகிழ்ச்சி; நிலம், சொத்து; மேலும் பாலியல் இன்பம் விரும்புவார்; அரசு, சமூகத்தில் புகழ்.",
  },
  {
    house: 4, lagna: "Cancer", planetSign: "Libra", planet: "Mercury", page: 89,
    en: "Does his work and manages the expenditure with happiness, deficiency in the house of parents, loss of some land and property, some deficiency in the house of brothers and sisters, meets success and failures in relation to government and society",
    ta: "தன் வேலையைச் செய்து, மகிழ்ச்சியுடன் செலவை நிர்வகிப்பார்; பெற்றோர் வீட்டில் குறை; நிலம், சொத்தில் சிறு இழப்பு; உடன்பிறப்புகள் வீட்டில் சிறு குறை; அரசு, சமூக விவகாரங்களில் வெற்றியும் தோல்வியும்.",
  },
  {
    house: 4, lagna: "Cancer", planetSign: "Libra", planet: "Jupiter", page: 91,
    en: "Supposed to be lucky, spends much, mixed troubles in the house of mother",
    ta: "அதிர்ஷ்டசாலி; அதிகம் செலவழிப்பார்; தாய் வீட்டில் கலந்த துன்பங்கள்.",
  },
  {
    house: 4, lagna: "Cancer", planetSign: "Libra", planet: "Venus", page: 93,
    en: "Gets the great advantage of the house and land, gets income at ease, gets some decent things of pleasure, fear from the father, gets restless, is respectable and humble, enjoys happiness from government and society, does very decent deeds",
    ta: "வீட்டிலும் நிலத்திலும் பெரும் ஆதாயம்; எளிதாக வருமானம்; இன்பத்துக்குரிய சில நல்ல பொருட்கள்; தந்தையிடம் பயம்; அமைதியின்மை; மரியாதைக்குரியவர், பணிவானவர்; அரசு, சமூகத்தில் மகிழ்ச்சி; நல்ல செயல்கள்.",
  },
  {
    house: 4, lagna: "Cancer", planetSign: "Libra", planet: "Saturn", page: 95,
    en: "Great happiness and joyousness, good longevity, deficiency in the house of government and society, enjoys happiness with solemn delusion in the daily occupation, increment in the house of enemies, much happiness in connection with wife, sexual and family pleasures",
    ta: "பெரும் மகிழ்ச்சியும் ஆனந்தமும்; நல்ல ஆயுள்; அரசு, சமூக வகையில் குறை; தினசரி வேலையில் மாயையான அமைதியுடன் மகிழ்ச்சி; எதிரி வீட்டில் அதிகரிப்பு; மனைவியுடன் மிகுந்த மகிழ்ச்சி; பாலியல், குடும்ப இன்பங்கள்.",
  },
  {
    house: 4, lagna: "Cancer", planetSign: "Libra", planet: "Rahu", page: 97,
    en: "Hindrance in peace and happiness, no cordial relations with the mother, loss of land, buildings and property, unhappiness in the residence, some happiness at the end, is very clever",
    ta: "அமைதிக்கும் மகிழ்ச்சிக்கும் தடை; தாயுடன் நல்ல உறவின்மை; நிலம், கட்டிடம், சொத்து இழப்பு; வீட்டில் மகிழ்ச்சியின்மை; முடிவில் சில மகிழ்ச்சி; மிகவும் சாமர்த்தியமானவர்.",
  },
  {
    house: 4, lagna: "Cancer", planetSign: "Libra", planet: "Ketu", page: 99,
    en: "Loss and deficiency in the house of mother and happiness, loss of land and buildings, labours hard, hardship in the house of residence and hindrance in the happiness, yet in the end gets happiness",
    ta: "தாய் வீட்டிலும் மகிழ்ச்சியிலும் இழப்பும் குறையும்; நிலம், கட்டிட இழப்பு; கடுமையாக உழைப்பார்; வசிப்பிடத்தில் கஷ்டமும் மகிழ்ச்சிக்குத் தடையும்; இறுதியில் மகிழ்ச்சி கிடைக்கும்.",
  },
  {
    house: 4, lagna: "Leo", planetSign: "Scorpio", planet: "Sun", page: 104,
    en: "Great power in the house of mother, earns happiness of land and property, lives happily in his own place, some problems in the house of father and business, unhappy in foreign travel, is fearless, wants peace, and is haughty",
    ta: "தாய் வீட்டில் பெரும் வலிமை; நிலமும் சொத்தும் மகிழ்ச்சி; தன் ஊரில் மகிழ்ச்சியாக வாழ்வார்; தந்தை, தொழில் வகையில் சில பிரச்சினைகள்; வெளிநாட்டுப் பயணத்தில் அதிருப்தி; அஞ்சாதவர்; அமைதி விரும்புவார்; கர்வமானவர்.",
  },
  {
    house: 4, lagna: "Leo", planetSign: "Scorpio", planet: "Moon", page: 106,
    en: "Gets weakness and deficiency in the house of mother, gets many hindrances in peace and happiness, gets the loss and weakness of his own house and property, bears mental worries",
    ta: "தாய் வீட்டில் பலவீனமும் குறையும்; அமைதிக்கும் மகிழ்ச்சிக்கும் பல தடைகள்; சொந்த வீடு, சொத்தில் இழப்பும் பலவீனமும்; மன கவலைகள்.",
  },
  {
    house: 4, lagna: "Leo", planetSign: "Scorpio", planet: "Mars", page: 108,
    en: "Gets the power of land and property and mother, enjoys good luck, peace and happiness, insipidness in the house of business and occupation, assumes some dissatisfaction in the house of government and society, worldly affairs, promotion of honour, some insipidness in the house of wife and father, is happy and joyous",
    ta: "நிலமும் சொத்தும் தாயும் கிடைக்கும் வலிமை; நல்ல அதிர்ஷ்டம், அமைதி, மகிழ்ச்சி; தொழிலிலும் வேலையிலும் சலிப்பு; அரசு, சமூகத்தில் சில அதிருப்தி; உலக விவகாரங்கள், மரியாதையின் உயர்வு; மனைவி, தந்தை வகையில் சில சலிப்பு; மகிழ்ச்சியும் உற்சாகமும்.",
  },
  {
    house: 4, lagna: "Leo", planetSign: "Scorpio", planet: "Mercury", page: 110,
    en: "Accumulates wealth, gets the power of building and property, gets his every want satisfied happily sitting at his house, gets good garments and ornaments etc, conducts business through the power of wealth, gets respect in government and society, is a clever worker",
    ta: "செல்வம் சேர்ப்பார்; வீடு, சொத்தின் வலிமை; வீட்டில் அமர்ந்தே எல்லா விருப்பங்களும் மகிழ்ச்சியாக நிறைவேறும்; நல்ல ஆடை, அணிகலன்; செல்வ வலிமையால் வணிகம்; அரசு, சமூகத்தில் மரியாதை; திறமையான உழைப்பாளி.",
  },
  {
    house: 4, lagna: "Leo", planetSign: "Scorpio", planet: "Jupiter", page: 112,
    en: "Spends his daily routine of life with great happiness, some deficiency in the house of mother, gets the power of children with some deficiency, some difficulty in local pleasure",
    ta: "தினசரி வாழ்வை பெரும் மகிழ்ச்சியுடன் கழிப்பார்; தாய் வீட்டில் சில குறை; குழந்தைகளின் ஆற்றல், சில குறையுடன்; உள்ளூர் இன்பத்தில் சில சிரமம்.",
  },
  {
    house: 4, lagna: "Leo", planetSign: "Scorpio", planet: "Venus", page: 114,
    en: "Embarks on a great business, gets the happiness from brothers, sisters and father, gets power from government and society, great strengths of buildings and property, acquires happiness, a skilled worker",
    ta: "பெரிய தொழிலைத் தொடங்குவார்; சகோதர சகோதரி, தந்தையிடமிருந்து மகிழ்ச்சி; அரசு, சமூகத்தில் ஆற்றல்; நிலமும் சொத்தும் பெரும் வலிமை; மகிழ்ச்சி; திறமையான உழைப்பாளி.",
  },
  {
    house: 4, lagna: "Leo", planetSign: "Scorpio", planet: "Saturn", page: 116,
    en: "Loss in the affection of house of mother, some dislike in the house of wife, labours hard, is very steady and obstinate on gaining victory over troubles of life and diseases, etc",
    ta: "தாய் வீட்டின் பாசத்தில் இழப்பு; மனைவி வகையில் சில வெறுப்பு; கடுமையாக உழைப்பார்; வாழ்வின் கஷ்டங்களையும் நோய்களையும் வெல்வதில் மிக நிலையானவர், பிடிவாதம்.",
  },
  {
    house: 4, lagna: "Leo", planetSign: "Scorpio", planet: "Rahu", page: 118,
    en: "Gets the loss or separation of mother or in the house of mother, some loss in acquiring happiness, does secret deeds for acquiring happiness, distress in the domestic environment, acquires happiness after much time and many perplexities",
    ta: "தாய் அல்லது தாய் வீட்டில் இழப்பு அல்லது பிரிவு; மகிழ்ச்சி அடைவதில் சில இழப்பு; மகிழ்ச்சிக்காக ரகசியச் செயல்கள்; வீட்டுச் சூழலில் துன்பம்; நீண்ட காலத்துக்குப் பின் பல குழப்பங்களுக்குப் பின் மகிழ்ச்சி.",
  },
  {
    house: 4, lagna: "Leo", planetSign: "Scorpio", planet: "Ketu", page: 120,
    en: "Some deficiency in the house of mother, gets the separation from his motherland and birthplace, faces great obstacles getting happiness, deficiency in connection with residential place and buildings",
    ta: "தாய் வீட்டில் சில குறை; தாய்நாடு, பிறந்த ஊரிலிருந்து பிரிவு; மகிழ்ச்சி அடைவதில் பெரும் தடைகள்; வசிப்பிடம், கட்டிடங்களில் குறை.",
  },
  {
    house: 4, lagna: "Virgo", planetSign: "Sagittarius", planet: "Sun", page: 125,
    en: "Manages the expenditure with deficient in the means of happiness, separation in the house of mother, some weakness in the house of father and in big business occupation, deficiency in the case of honour and in connection with government and society affairs",
    ta: "வசதிக் குறையுடன் செலவை நிர்வகிப்பார்; தாயிடமிருந்து பிரிவு; தந்தை வீட்டிலும் பெரிய தொழிலிலும் சில பலவீனம்; மரியாதையில் குறை; அரசு, சமூக விவகாரங்களில் குறை.",
  },
  {
    house: 4, lagna: "Virgo", planetSign: "Sagittarius", planet: "Moon", page: 127,
    en: "Gets huge income comfortably, gets the gains of lands and buildings, gets the pleasure of parents, gains in business of occupation, gains from government and society, is mentally delighted, gets beautiful things, clothes and ornaments, gets happiness from the house of mother",
    ta: "வசதியாக பெரும் வருமானம்; நிலம், கட்டிடங்களின் ஆதாயம்; பெற்றோரின் மகிழ்ச்சி; தொழிலில் ஆதாயம்; அரசு, சமூக வகையில் ஆதாயம்; மன மகிழ்ச்சி; அழகான பொருட்கள், ஆடை, அணிகலன்; தாய் வீட்டில் மகிழ்ச்சி.",
  },
  {
    house: 4, lagna: "Virgo", planetSign: "Sagittarius", planet: "Mars", page: 129,
    en: "Has a long life, enjoys the whole period of life, some loss in the house of mother, gets wealth and gains, injures the house of wife a little, some deficiency in the house of income, deficiency in the house of father",
    ta: "நீண்ட ஆயுள்; வாழ்நாள் முழுவதும் இன்பம்; தாய் வீட்டில் சில இழப்பு; செல்வமும் ஆதாயமும்; மனைவி வீட்டுக்கு சிறு காயம்; வருமானத்தில் குறை; தந்தை வீட்டில் குறை.",
  },
  {
    house: 4, lagna: "Virgo", planetSign: "Sagittarius", planet: "Mercury", page: 131,
    en: "Lives happily, possesses his own house, lives in a beautifully decorated house, gets the happiness of parents, does good business with peace and happiness, gets respect and honour, is a very clever worker, gets honour and happiness from government and society, is a jolly fellow",
    ta: "மகிழ்ச்சியாக வாழ்வார்; சொந்த வீடு; அழகாக அலங்கரிக்கப்பட்ட வீட்டில் வாழ்வார்; பெற்றோரின் மகிழ்ச்சி; அமைதியுடன் நல்ல வணிகம்; மரியாதையும் கௌரவமும்; மிகத் திறமையான உழைப்பாளி; அரசு, சமூகத்தில் மரியாதையும் மகிழ்ச்சியும்; இனிய மனிதர்.",
  },
  {
    house: 4, lagna: "Virgo", planetSign: "Sagittarius", planet: "Jupiter", page: 133,
    en: "Gets the happiness from the house of mother and wife, gets property, gets the happiness from the occupation, spends much, does the occupation with happiness, happiness from the house of father, enjoys the pleasures of the family",
    ta: "தாய், மனைவி வீட்டில் மகிழ்ச்சி; சொத்து கிடைக்கும்; தொழிலில் மகிழ்ச்சி; அதிகம் செலவழிப்பார்; மகிழ்ச்சியுடன் தொழில் செய்வார்; தந்தை வீட்டில் மகிழ்ச்சி; குடும்ப இன்பங்களை அனுபவிப்பார்.",
  },
  {
    house: 4, lagna: "Virgo", planetSign: "Sagittarius", planet: "Venus", page: 136,
    en: "Hoards wealth, is very fortunate and industrious, has land and buildings, gets the gain of parents",
    ta: "செல்வம் சேர்ப்பார்; அதிர்ஷ்டசாலி, உழைப்பாளி; நிலமும் கட்டிடமும்; பெற்றோரின் ஆதாயம்.",
  },
  {
    house: 4, lagna: "Virgo", planetSign: "Sagittarius", planet: "Saturn", page: 138,
    en: "Has huge influence due to his buildings, gets honour, spends deficiency and distress in the happiness of parents, gets the help of some other lady also in the house of mother, deficiency in connection with peace and happiness",
    ta: "கட்டிடங்களால் பெரும் செல்வாக்கு; மரியாதை; பெற்றோரின் மகிழ்ச்சியில் குறையும் துன்பமும்; தாய் வீட்டில் வேறு ஒரு பெண்ணின் உதவியும் கிடைக்கும்; அமைதி, மகிழ்ச்சியில் குறை.",
  },
  {
    house: 4, lagna: "Virgo", planetSign: "Sagittarius", planet: "Rahu", page: 140,
    en: "Gets great restlessness in the house of happiness, some loss in the house of mother, feels some sufferings of land, building and the residential place, enjoys the occult power",
    ta: "மகிழ்ச்சி வீட்டில் பெரும் அமைதியின்மை; தாய் வீட்டில் சில இழப்பு; நிலம், கட்டிடம், வசிப்பிடத்தில் சில துன்பம்; மறை ஆற்றலை அனுபவிப்பார்.",
  },
  {
    house: 4, lagna: "Virgo", planetSign: "Sagittarius", planet: "Ketu", page: 142,
    en: "Has buildings and property, gets some pleasures, gets some weakness in real peace, full of patience",
    ta: "கட்டிடங்களும் சொத்தும்; சில இன்பங்கள்; உண்மையான அமைதியில் சில பலவீனம்; பொறுமை நிறைந்தவர்.",
  },
  {
    house: 4, lagna: "Libra", planetSign: "Capricorn", planet: "Sun", page: 146,
    en: "Feels some deficiency and uneasiness in the schemes of gains, gets the advantage of father and also of mother but with some deficiency, happiness of mother and buildings",
    ta: "ஆதாயத் திட்டங்களில் சில குறையும் கவலையும்; தந்தையின் ஆதாயமும் தாயின் ஆதாயமும் உண்டு, ஆனால் சில குறையுடன்; தாயின் மகிழ்ச்சியும் கட்டிடங்களும்.",
  },
  {
    house: 4, lagna: "Libra", planetSign: "Capricorn", planet: "Moon", page: 148,
    en: "Has his own buildings, gets honour and respect, happiness from parents, pleasure of a big business, has very noble and mental ideas, respect and honour from government and society",
    ta: "சொந்த கட்டிடங்கள்; மரியாதையும் மதிப்பும்; பெற்றோரின் மகிழ்ச்சி; பெரிய வணிகத்தின் இன்பம்; உயர்ந்த, மன எண்ணங்கள்; அரசு, சமூகத்தில் மரியாதை.",
  },
  {
    house: 4, lagna: "Libra", planetSign: "Capricorn", planet: "Mars", page: 150,
    en: "Gets happiness and huge wealth due to daily occupation, gets land and property, gets happiness of wife, increase ofwealth after marriage, gets supremacy of wife in his house, gets the happiness of the mother, some weakness in the house of government, rise in position is somewhat weak, acquires sexual pleasures and is happy in the family",
    ta: "தினசரி வேலையால் மகிழ்ச்சியும் பெரும் செல்வமும்; நிலமும் சொத்தும்; மனைவியின் மகிழ்ச்சி; திருமணத்துக்குப் பின் செல்வ வளர்ச்சி; வீட்டில் மனைவியின் மேலாதிக்கம்; தாயின் மகிழ்ச்சி; அரசு வீட்டில் சில பலவீனம்; பதவி உயர்வில் சிறு பலவீனம்; பாலியல் இன்பம்; குடும்பத்தில் மகிழ்ச்சி.",
  },
  {
    house: 4, lagna: "Libra", planetSign: "Capricorn", planet: "Mercury", page: 152,
    en: "Enjoys pleasures, spends comfortably, some deficiency in the house of mother, gets the pleasure of mother and land, rears Dharma practically",
    ta: "இன்பங்களை அனுபவிப்பார்; வசதியாகச் செலவழிப்பார்; தாய் வீட்டில் சில குறை; தாயின் மகிழ்ச்சியும் நிலமும்; தர்மத்தை நடைமுறையில் கடைப்பிடிப்பார்.",
  },
  {
    house: 4, lagna: "Libra", planetSign: "Capricorn", planet: "Jupiter", page: 154,
    en: "Gets loss in the house of mother, does not get peace even at home, gets restlessness in the side of brother, spends much, defeats the opposition",
    ta: "தாய் வீட்டில் இழப்பு; வீட்டில் கூட அமைதி இல்லை; சகோதரர் வகையில் அமைதியின்மை; அதிகம் செலவழிப்பார்; எதிர்ப்பை வெல்வார்.",
  },
  {
    house: 4, lagna: "Libra", planetSign: "Capricorn", planet: "Venus", page: 156,
    en: "Spends his life comfortably and happily at his own place, gets long life, some deficiency in the house of parents, performs the governmental, social and domestic tasks very cleverly, is solemn",
    ta: "தன் வீட்டில் வசதியாகவும் மகிழ்ச்சியாகவும் வாழ்வார்; நீண்ட ஆயுள்; பெற்றோர் வீட்டில் சில குறை; அரசு, சமூக, குடும்பப் பணிகளை சாமர்த்தியமாகச் செய்வார்; கம்பீரமானவர்.",
  },
  {
    house: 4, lagna: "Libra", planetSign: "Capricorn", planet: "Saturn", page: 158,
    en: "Is very happy, pays more attention to get the happiness, keeps full influence in the house of enemies, gets the power of motherland and property, completeness in the side of children, is carefree",
    ta: "மிகுந்த மகிழ்ச்சி; மகிழ்ச்சியை அடைய அதிக கவனம்; எதிரி வீட்டில் முழு செல்வாக்கு; தாய்நாடு, சொத்தின் வலிமை; குழந்தைகள் வகையில் நிறைவு; கவலையற்றவர்.",
  },
  {
    house: 4, lagna: "Libra", planetSign: "Capricorn", planet: "Rahu", page: 160,
    en: "Some deficiency in the means of happiness, some weakness in the house of mother, restlessness in the residential place, hindrance in buildings and the house of land",
    ta: "மகிழ்ச்சிக்கான வசதியில் சில குறை; தாய் வீட்டில் சில பலவீனம்; வசிப்பிடத்தில் அமைதியின்மை; கட்டிடம், நிலம் ஆகியவற்றில் தடை.",
  },
  {
    house: 4, lagna: "Libra", planetSign: "Capricorn", planet: "Ketu", page: 162,
    en: "Loss in the house of mother and happiness, somewhat restless and is clever",
    ta: "தாய் வீட்டிலும் மகிழ்ச்சியிலும் இழப்பு; சிறிது அமைதியின்மை; சாமர்த்தியமானவர்.",
  },
  {
    house: 4, lagna: "Scorpio", planetSign: "Aquarius", planet: "Sun", page: 167,
    en: "Conducts the occupation with some happiness, but bears some hindrances, gets the ordinary gains of lands, bears some hindrances in the happiness and grandeur, is respectable and loyal",
    ta: "சில மகிழ்ச்சியுடன் தொழில் நடத்துவார்; ஆனால் சில தடைகளைச் சந்திப்பார்; நிலத்தில் சாதாரண ஆதாயம்; மகிழ்ச்சியிலும் பெருமையிலும் சில தடைகள்; மரியாதைக்குரியவர், விசுவாசமானவர்.",
  },
  {
    house: 4, lagna: "Scorpio", planetSign: "Aquarius", planet: "Moon", page: 170,
    en: "Is very fortunate, enjoys much happiness, rears religious duties, enjoys the happiness of mother and the house of land, does a big business, believes in God and is diligent",
    ta: "மிக அதிர்ஷ்டசாலி; பெரும் மகிழ்ச்சி; மத கடமைகளைக் கடைப்பிடிப்பார்; தாயின் மகிழ்ச்சியும் நிலமும்; பெரிய வியாபாரம்; இறைநம்பிக்கை; கடின உழைப்பாளி.",
  },
  {
    house: 4, lagna: "Scorpio", planetSign: "Aquarius", planet: "Mars", page: 172,
    en: "Some loss in the side of mother, some loss in happiness, lives in his own place, does daily occupation, faces some opposition in the house of wife, acquires heavy gains and some honour in government and society and possesses some land",
    ta: "தாயால் சில இழப்பு; மகிழ்ச்சியில் சில இழப்பு; தன் ஊரில் வாழ்வார்; தினசரி தொழில்; மனைவி வீட்டில் சில எதிர்ப்பு; அரசு, சமூகத்தில் பெரும் ஆதாயமும் சில மரியாதையும்; சில நிலம் உண்டு.",
  },
  {
    house: 4, lagna: "Scorpio", planetSign: "Aquarius", planet: "Mercury", page: 174,
    en: "Acquires the income happily mixed with some hindrances, has a long life, gets happiness from mysterious devices",
    ta: "சில தடைகளுடன் மகிழ்ச்சியாக வருமானம் பெறுவார்; நீண்ட ஆயுள்; மர்மமான வழிகளால் மகிழ்ச்சி.",
  },
  {
    house: 4, lagna: "Scorpio", planetSign: "Aquarius", planet: "Jupiter", page: 176,
    en: "Is rich, intelligent and respectable, gets children, gets a long life, spends much, feels weakness in happiness, gets cooperation from mother, receives advantage from father, spends the daily routine of life in an aristocratic manner, experiences some difficulties in maintaining and accumulating wealth",
    ta: "பணக்காரர், அறிவாளி, மரியாதைக்குரியவர்; குழந்தைகள்; நீண்ட ஆயுள்; அதிகம் செலவழிப்பார்; மகிழ்ச்சியில் பலவீனம்; தாயின் ஒத்துழைப்பு; தந்தை வழியில் ஆதாயம்; கம்பீரமாக நாள் வாழ்க்கையைக் கழிப்பார்; செல்வத்தைப் பராமரிப்பதிலும் சேர்ப்பதிலும் சில சிரமம்.",
  },
  {
    house: 4, lagna: "Scorpio", planetSign: "Aquarius", planet: "Venus", page: 178,
    en: "Bears some loss and deficiency in occupation, gets some loss in the house of mother, gets happiness from the house of wife, enjoys expenditure and pleasures, enmity in the house of father, gets some ownership of land, is a jolly fellow",
    ta: "தொழிலில் சில இழப்பும் குறையும்; தாய் வீட்டில் சில இழப்பு; மனைவி வீட்டில் மகிழ்ச்சி; செலவும் இன்பமும் அனுபவிப்பார்; தந்தை வீட்டில் பகை; நிலத்தில் சில உரிமை; மகிழ்ச்சியான மனிதர்.",
  },
  {
    house: 4, lagna: "Scorpio", planetSign: "Aquarius", planet: "Saturn", page: 180,
    en: "Possesses large property and gets the happiness of land, property and buildings, happiness and strength from mother, gets happiness from brothers and sisters, feels restlessness in the side of enemies, some deficiency in his body, deficiency in the house of father",
    ta: "பெரும் சொத்துடையவர்; நிலம், சொத்து, கட்டிடங்களின் மகிழ்ச்சி; தாயால் மகிழ்ச்சியும் வலிமையும்; உடன்பிறப்புகள் வகையில் மகிழ்ச்சி; எதிரிகள் பக்கம் அமைதியின்மை; உடலில் சில குறை; தந்தை வீட்டில் குறை.",
  },
  {
    house: 4, lagna: "Scorpio", planetSign: "Aquarius", planet: "Rahu", page: 182,
    en: "Gets some weakness in the house of mother, gets some deficiency in the house ofhappiness, gets some hindrance in the land, is somewhat restless on account of quarrelsome family atmosphere",
    ta: "தாய் வீட்டில் சில பலவீனம்; மகிழ்ச்சியில் சில குறை; நிலத்தில் சில தடை; குடும்பச் சூழலில் சண்டையால் சிறிது அமைதியின்மை.",
  },
  {
    house: 4, lagna: "Scorpio", planetSign: "Aquarius", planet: "Ketu", page: 184,
    en: "Gets some deficiency in the house of mother, gets deficiency in buildings and property also, deficiency in happiness also, separation from birthplace",
    ta: "தாய் வீட்டில் குறை; கட்டிடம், சொத்திலும் குறை; மகிழ்ச்சியிலும் குறை; பிறந்த ஊரிலிருந்து பிரிவு.",
  },
  {
    house: 4, lagna: "Sagittarius", planetSign: "Pisces", planet: "Sun", page: 189,
    en: "Is very fortunate and possesses land and property, gets happiness from other, gets the advantage of father, advantage from the government, gains in the business, does nice deeds",
    ta: "மிக அதிர்ஷ்டசாலி; நிலமும் சொத்தும்; பிறரால் மகிழ்ச்சி; தந்தையின் ஆதாயம்; அரசு வகையில் ஆதாயம்; வணிகத்தில் ஆதாயம்; நல்ல செயல்கள்.",
  },
  {
    house: 4, lagna: "Sagittarius", planetSign: "Pisces", planet: "Moon", page: 191,
    en: "Some loss in the house of mother, good longevity, some loss in domestic happiness, troubles in progress, honour, business etc, is free from stomach troubles, spends the time carelessly",
    ta: "தாய் வீட்டில் சில இழப்பு; நல்ல ஆயுள்; குடும்ப மகிழ்ச்சியில் சில இழப்பு; முன்னேற்றம், மரியாதை, தொழில் ஆகியவற்றில் தொல்லை; வயிற்றுக் கோளாறு இல்லை; அசட்டையாக நேரம் கழிப்பார்.",
  },
  {
    house: 4, lagna: "Sagittarius", planetSign: "Pisces", planet: "Mars", page: 193,
    en: "Experiences loss of mother, faces the loss of buildings and property, loss in the house of wife, has some deficiency in education, manages the expenditure with care, lives in foreign places",
    ta: "தாயை இழப்பார்; கட்டிடங்களும் சொத்தும் இழப்பு; மனைவி வீட்டில் இழப்பு; கல்வியில் சில குறை; செலவை கவனமாக நிர்வகிப்பார்; வெளிநாடுகளில் வாழ்வார்.",
  },
  {
    house: 4, lagna: "Sagittarius", planetSign: "Pisces", planet: "Mercury", page: 195,
    en: "Bears loss and weakness in the house of honour, faces restlessness in family affairs, gets deficiency in the land and property, some deficiency in occupation, acquires some progress in big business, gets weaknesses from the wife's side, and is wise but not apparently",
    ta: "மரியாதையில் இழப்பும் பலவீனமும்; குடும்ப விவகாரங்களில் அமைதியின்மை; நிலமும் சொத்தும் குறையும்; தொழிலில் சில குறை; பெரிய வணிகத்தில் சில முன்னேற்றம்; மனைவி வீட்டில் பலவீனம்; ஞானமுள்ளவர், ஆனால் வெளிப்படையாகத் தெரியாது.",
  },
  {
    house: 4, lagna: "Sagittarius", planetSign: "Pisces", planet: "Jupiter", page: 197,
    en: "Gets happiness of mother, possesses lands and buildings, gets dignity and pleasures in the daily routine of life, gets a long life, lives in his own place, and is energetic",
    ta: "தாயின் மகிழ்ச்சி; நிலமும் கட்டிடங்களும்; தினசரி வாழ்வில் கௌரவமும் இன்பமும்; நீண்ட ஆயுள்; தன் ஊரில் வாழ்வார்; ஆற்றல் மிக்கவர்.",
  },
  {
    house: 4, lagna: "Sagittarius", planetSign: "Pisces", planet: "Venus", page: 199,
    en: "Heavy income, gets land and buildings, gains advantage from mother, wants delicious food, has deficiency in the house of father",
    ta: "பெரும் வருமானம்; நிலமும் கட்டிடங்களும்; தாயால் ஆதாயம்; சுவையான உணவை விரும்புவார்; தந்தை வீட்டில் குறை.",
  },
  {
    house: 4, lagna: "Sagittarius", planetSign: "Pisces", planet: "Saturn", page: 201,
    en: "Achieves both happiness and unhappiness with regard to wealth, conjunction of stepmother, sweet influence in the house of enemies, gets his work done with regard to diseases, is somewhat physically restless",
    ta: "செல்வத்தில் மகிழ்ச்சியும் துன்பமும் இரண்டும்; மாற்றாந்தாயின் தொடர்பு; எதிரி வீட்டில் இனிய செல்வாக்கு; நோய்களைப் பற்றிய வேலையை முடிப்பார்; உடலில் சிறு அமைதியின்மை.",
  },
  {
    house: 4, lagna: "Sagittarius", planetSign: "Pisces", planet: "Rahu", page: 203,
    en: "Gets loss in mother's house, faces many obstacles in happiness, has some deficiency in connection with land and buildings, faces separation from mother and motherland",
    ta: "தாய் வீட்டில் இழப்பு; மகிழ்ச்சியில் பல தடைகள்; நிலம், கட்டிடங்களில் சில குறை; தாயையும் தாய்நாட்டையும் பிரிவார்.",
  },
  {
    house: 4, lagna: "Sagittarius", planetSign: "Pisces", planet: "Ketu", page: 205,
    en: "Gets troubles in the house of mother and faces separation from her. is restless in connection with happiness, gets deficiency of land and buildings, takes risk in getting happiness and in the end gets some happiness, is obstinate about achieving happiness, and is patient",
    ta: "தாய் வகையில் தொல்லைகளும் அவரிடமிருந்து பிரிவும்; மகிழ்ச்சி பற்றி அமைதியின்மை; நிலம், கட்டிடங்களில் குறை; மகிழ்ச்சி பெற ஆபத்து எடுப்பார்; இறுதியில் சில மகிழ்ச்சி; மகிழ்ச்சியை அடைவதில் பிடிவாதம்; பொறுமையானவர்.",
  },
  {
    house: 4, lagna: "Capricorn", planetSign: "Aries", planet: "Sun", page: 210,
    en: "Gets the hidden wealth, bears some loss in the mother's house, gets a long age, faces distress in father's house, gets weakness in government and society, spends the daily life with pleasure, is somewhat inactive, and is hasty",
    ta: "மறைந்த செல்வம் கிடைக்கும்; தாய் வீட்டில் சில இழப்பு; நீண்ட வயது; தந்தை வீட்டில் கவலை; அரசு, சமூகத்தில் பலவீனம்; தினசரி வாழ்வை மகிழ்ச்சியுடன் கழிப்பார்; சிறிது சோம்பல், அவசரம்.",
  },
  {
    house: 4, lagna: "Capricorn", planetSign: "Aries", planet: "Moon", page: 212,
    en: "Gets good happiness in family, gets a beautiful wife, gets property, gets sexual pleasures, gets happiness in occupation, gets honour in government and society, is a happy and jolly fellow",
    ta: "குடும்பத்தில் நல்ல மகிழ்ச்சி; அழகான மனைவி; சொத்து; பாலியல் இன்பம்; தொழிலில் மகிழ்ச்சி; அரசு, சமூகத்தில் மரியாதை; மகிழ்ச்சியான, கலகலப்பானவர்.",
  },
  {
    house: 4, lagna: "Capricorn", planetSign: "Aries", planet: "Mars", page: 214,
    en: "Gets income from land and property, idleness in connection with occupation, deficiency from wife, gets deficiency in sexual pleasure, gets happiness from government and society",
    ta: "நிலம், சொத்தில் வருமானம்; தொழிலில் சோம்பல்; மனைவி வகையில் குறை; பாலியல் இன்பத்தில் குறை; அரசு, சமூகத்தில் மகிழ்ச்சி.",
  },
  {
    house: 4, lagna: "Capricorn", planetSign: "Aries", planet: "Mercury", page: 216,
    en: "Gets the happiness through the power of destiny, gets the happiness of some land and buildings, gets the victory in enemies house",
    ta: "விதியின் வலிமையால் மகிழ்ச்சி; சில நிலமும் கட்டிடமும் மகிழ்ச்சி; பகைவர் வீட்டில் வெற்றி.",
  },
  {
    house: 4, lagna: "Capricorn", planetSign: "Aries", planet: "Jupiter", page: 218,
    en: "Spends majestically, manages the expenditure comfortably and bears some loss and weakness in land and property, faces obstacles in acquiring peace and happiness, unable to control the excess of expenditure, is somewhat restless",
    ta: "கம்பீரமாகச் செலவழிப்பார்; செலவை சௌகரியமாக நிர்வகிப்பார், ஆனால் நிலம், சொத்தில் சில இழப்பும் பலவீனமும்; அமைதியும் மகிழ்ச்சியும் பெறுவதில் தடைகள்; அதிகச் செலவைக் கட்டுப்படுத்த முடியாது; சிறிது அமைதியின்மை.",
  },
  {
    house: 4, lagna: "Capricorn", planetSign: "Aries", planet: "Venus", page: 220,
    en: "Gets numerous advantages, manages a big business, gains happiness from parents and children, gets education, owns building and property, gets the advantage from the government and society, wants beauty and art, is respectable",
    ta: "பல ஆதாயங்கள்; பெரிய வியாபாரம்; பெற்றோர், குழந்தைகளால் மகிழ்ச்சி; கல்வி; கட்டிடமும் சொத்தும்; அரசு, சமூகத்தில் ஆதாயம்; அழகையும் கலையையும் விரும்புவார்; மரியாதைக்குரியவர்.",
  },
  {
    house: 4, lagna: "Capricorn", planetSign: "Aries", planet: "Saturn", page: 222,
    en: "Restlessness and deficiency in the house of happiness, gets influence in the house of enemies, does a big business, deficiency in the land and property",
    ta: "மகிழ்ச்சியில் அமைதியின்மையும் குறையும்; பகைவர் வீட்டில் செல்வாக்கு; பெரிய வியாபாரம்; நிலம், சொத்தில் குறை.",
  },
  {
    house: 4, lagna: "Capricorn", planetSign: "Aries", planet: "Rahu", page: 224,
    en: "Causes affliction to mother, has some deficiency in the residential place, lacks pleasures and happiness, gets the support of hidden powers",
    ta: "தாய்க்குத் துன்பம்; வசிப்பிடத்தில் சில குறை; இன்பமும் மகிழ்ச்சியும் குறைவு; மறைந்த சக்திகளின் ஆதரவு.",
  },
  {
    house: 4, lagna: "Capricorn", planetSign: "Aries", planet: "Ketu", page: 226,
    en: "Deficiency of happiness from mother, bears separation from motherland and birthplace, feces obstacles in buildings and residential places, gains courage through secret policies",
    ta: "தாயிடமிருந்து மகிழ்ச்சி குறைவு; தாய்நாடு, பிறந்த ஊரிலிருந்து பிரிவு; வீடுகளிலும் வசிப்பிடங்களிலும் தடைகள்; மறைமுக கொள்கைகளால் தைரியம் பெறுவார்.",
  },
  {
    house: 4, lagna: "Aquarius", planetSign: "Taurus", planet: "Sun", page: 231,
    en: "Enjoys some happiness from the house of wife, also fram the house of occupation, pays attention to work regularly for progress",
    ta: "மனைவி வீட்டில் சில மகிழ்ச்சி; தொழில் வீட்டிலிருந்தும் சில மகிழ்ச்சி; முன்னேற்றத்துக்காக வேலையை ஒழுங்காகக் கவனிப்பார்.",
  },
  {
    house: 4, lagna: "Aquarius", planetSign: "Taurus", planet: "Moon", page: 234,
    en: "Does not care for the enemies side, gets hindrance in peace and happiness, distress in the house of mother, some influence in the house of land, some weakness in business relations with government, is very careless",
    ta: "எதிரிகளைப் பொருட்படுத்தார்; மகிழ்ச்சியிலும் அமைதியிலும் தடை; தாய் வகையில் துன்பம்; நிலம் வீட்டில் சில செல்வாக்கு; அரசுடன் தொழில் உறவில் சிறு பலவீனம்; மிகவும் அசட்டையானவர்.",
  },
  {
    house: 4, lagna: "Aquarius", planetSign: "Taurus", planet: "Mars", page: 236,
    en: "Gets supporting power from father, acquires the usual happiness of mother and brother with some deficiency, gets great honour from the government and society, owns building and property, keeps influence in the side of wife, secures a good income through his deeds, and is very influential",
    ta: "தந்தையின் ஆதரவு; தாயும் சகோதரரும் வழக்கமான மகிழ்ச்சியுடன், சிறு குறையுடன்; அரசு, சமூகத்தில் பெரும் மரியாதை; கட்டிடமும் சொத்தும்; மனைவி பக்கம் செல்வாக்கு; தன் செயல்களால் நல்ல வருமானம்; மிகுந்த செல்வாக்குள்ளவர்.",
  },
  {
    house: 4, lagna: "Aquarius", planetSign: "Taurus", planet: "Mercury", page: 238,
    en: "Gets increased longevity, spends the period of life intelligently and comfortably, faces uneasiness in the house of mother, has some deficiency in children, gets some loss in the buildings and lands",
    ta: "நீண்ட ஆயுள்; வாழ்நாளை அறிவாகவும் வசதியாகவும் கழிப்பார்; தாய் வகையில் அமைதியின்மை; பிள்ளைகளில் சில குறை; கட்டிடங்கள், நிலங்களில் சில இழப்பு.",
  },
  {
    house: 4, lagna: "Aquarius", planetSign: "Taurus", planet: "Jupiter", page: 240,
    en: "Accumulates wealth, enjoys the daily routine of life, tries to curtail expenditure very much, acquires gains and respect from government and society, gets happiness on account of wealth, gains buildings and property",
    ta: "செல்வம் சேர்ப்பார்; தினசரி வாழ்வை அனுபவிப்பார்; செலவைப் பெரிதும் குறைக்க முயல்வார்; அரசு, சமூகத்தில் ஆதாயமும் மரியாதையும்; செல்வ வகையில் மகிழ்ச்சி; கட்டிடமும் சொத்தும் கிடைக்கும்.",
  },
  {
    house: 4, lagna: "Aquarius", planetSign: "Taurus", planet: "Venus", page: 242,
    en: "Rears religious formalities, gets land and buildings, gets power from mother, gets happiness through destiny, pursues business, gains advantage from father, gets honour and prestige, gets happiness in government and society",
    ta: "இறைச் சடங்குகளைப் பின்பற்றுவார்; நிலமும் கட்டிடமும்; தாயின் வலிமை; விதியால் மகிழ்ச்சி; தொழில் நடத்துவார்; தந்தையின் ஆதாயம்; கௌரவமும் மதிப்பும்; அரசு, சமூகத்தில் மகிழ்ச்சி.",
  },
  {
    house: 4, lagna: "Aquarius", planetSign: "Taurus", planet: "Saturn", page: 244,
    en: "Is very influential, possesses the spiritual knowledge and a handsome physique, enjoys physical luxury, bears loss in mother's side but gets support from other ladies, has weakness in happiness, has deficiency in the land and buildings, maintains great influence over the enemies, safeguards self-pride, worries on account of excessive expenditure",
    ta: "மிகுந்த செல்வாக்குள்ளவர்; ஆன்மிக அறிவும் அழகான உடலும்; உடல் இன்பம் அனுபவிப்பார்; தாய் வகையில் இழப்பு, ஆனால் பிற பெண்களின் ஆதரவு; மகிழ்ச்சியில் பலவீனம்; நிலமும் கட்டிடங்களும் குறை; எதிரிகள் மீது பெரும் செல்வாக்கு; தன்மானத்தைக் காப்பார்; அதிகச் செலவால் கவலை.",
  },
  {
    house: 4, lagna: "Aquarius", planetSign: "Taurus", planet: "Rahu", page: 246,
    en: "Bears some loss and separation in mother's house, has deficiency in happiness, uses secret tactics to get permanent happiness, has some weakness in the management of land and buildings",
    ta: "தாயின் வீட்டில் சில இழப்பும் பிரிவும்; மகிழ்ச்சியில் குறை; நிரந்தர மகிழ்ச்சிக்காக ரகசிய வழிகள்; நிலம், கட்டிட நிர்வாகத்தில் சில பலவீனம்.",
  },
  {
    house: 4, lagna: "Aquarius", planetSign: "Taurus", planet: "Ketu", page: 248,
    en: "Bears some loss in mother's house, gets weakness in lands and buildings, feels complexity in acquiring happiness, works patiently in the troubles",
    ta: "தாய் வீட்டில் சில இழப்பு; நிலம், கட்டிடங்களில் பலவீனம்; மகிழ்ச்சியைப் பெறுவதில் சிக்கல்; தொல்லைகளில் பொறுமையாக வேலை செய்வார்.",
  },
  {
    house: 4, lagna: "Pisces", planetSign: "Gemini", planet: "Sun", page: 253,
    en: "Faces some distress in the house of parents, faces loss in lands, buildings and residential places, faces some deficiency in happiness, gets inspect and honour in society, does violent deeds, and is influential",
    ta: "தந்தை வீட்டில் சில துன்பம்; நிலம், கட்டிடம், வசிப்பிடங்களில் இழப்பு; மகிழ்ச்சியில் சில குறை; சமூகத்தில் மரியாதையும் கௌரவமும்; வன்முறைச் செயல்கள்; செல்வாக்குள்ளவர்.",
  },
  {
    house: 4, lagna: "Pisces", planetSign: "Gemini", planet: "Moon", page: 255,
    en: "Gets the happiness of children, gets good education, gets the happiness from mother, gets the pleasure of land, buildings and property, maintains a decent contact with father, experiences a rise of honour in government and society, gets progress in business",
    ta: "குழந்தைகளின் மகிழ்ச்சி; நல்ல கல்வி; தாயால் மகிழ்ச்சி; நிலம், கட்டிடம், சொத்தின் இன்பம்; தந்தையுடன் நல்ல உறவு; அரசு, சமூகத்தில் மரியாதை உயர்வு; தொழிலில் முன்னேற்றம்.",
  },
  {
    house: 4, lagna: "Pisces", planetSign: "Gemini", planet: "Mars", page: 257,
    en: "Owns buildings and property, accumulates wealth, gets heavy income, fulfils religious formalities, gets cooperation from mother, gets good luck from wife's house, gets success in business occupation, and is very fortunate",
    ta: "கட்டிடமும் சொத்தும்; செல்வ சேர்க்கை; அதிக வருமானம்; மத கடமைகளை நிறைவேற்றுவார்; தாயின் ஒத்துழைப்பு; மனைவி வீட்டில் நல்ல அதிர்ஷ்டம்; தொழிலில் வெற்றி; மிக அதிர்ஷ்டசாலி.",
  },
  {
    house: 4, lagna: "Pisces", planetSign: "Gemini", planet: "Mercury", page: 259,
    en: "Gains strength from lands and buildings, gets unprecedented happiness of the family, achieves great happiness from mother, gains strength in occupation, gets advantage from government and society",
    ta: "நிலம், கட்டிடங்களின் வலிமை; குடும்பத்தில் அளவற்ற மகிழ்ச்சி; தாயால் பெரும் மகிழ்ச்சி; தொழிலில் வலிமை; அரசு, சமூகத்தில் ஆதாயம்.",
  },
  {
    house: 4, lagna: "Pisces", planetSign: "Gemini", planet: "Jupiter", page: 261,
    en: "Lives comfortably, possesses the strength of land and buildings, holds great influence in family, gets happiness of parents, pursues the occupation happily through his will-power, lives enjoying authority and sovereignty, gets a long age, gets some enmity in the house of expenditure",
    ta: "வசதியாக வாழ்வார்; நிலம், கட்டிடங்களின் வலிமை; குடும்பத்தில் பெரும் செல்வாக்கு; பெற்றோரின் மகிழ்ச்சி; தன் மனவலிமையால் தொழிலில் மகிழ்ச்சி; அதிகாரமும் இறையாண்மையும் அனுபவிப்பார்; நீண்ட வயது; செலவு வீட்டில் சில பகை.",
  },
  {
    house: 4, lagna: "Pisces", planetSign: "Gemini", planet: "Venus", page: 264,
    en: "Bears some loss in the house of mother, gets some happiness from brothers and sisters, gets a long life, gets the pleasure of daily routine oflife, faces difficulties in finding happiness, remains unhappy with father, gets some happiness in foreign countries also, is very clever and honourable",
    ta: "தாய் வகையில் சில இழப்பு; சகோதர சகோதரியால் சில மகிழ்ச்சி; நல்ல ஆயுள்; தினசரி வாழ்வில் இன்பம்; மகிழ்ச்சி கண்டறிவதில் சிரமம்; தந்தை வகையில் அதிருப்தி; வெளிநாட்டிலும் சில மகிழ்ச்சி; மிகுந்த அறிவும் மரியாதையும்.",
  },
  {
    house: 4, lagna: "Pisces", planetSign: "Gemini", planet: "Saturn", page: 266,
    en: "Gets both losses and gains, balances the expenditure, has some weakness in residence, holds influence in the enemies' house, bears loss of land, and is courageous",
    ta: "இழப்பும் ஆதாயமும் இரண்டும்; செலவைச் சமநிலைப்படுத்துவார்; வசிப்பிடத்தில் சில பலவீனம்; பகைவர் வீட்டில் செல்வாக்கு; நிலத்தில் இழப்பு; தைரியசாலி.",
  },
  {
    house: 4, lagna: "Pisces", planetSign: "Gemini", planet: "Rahu", page: 268,
    en: "Faces calamities to get happiness, owns buildings, experiences vanity in the house of mother, gets hindrance in the real place",
    ta: "மகிழ்ச்சிக்காக துன்பங்களைச் சந்திப்பார்; கட்டிடங்களுக்கு உரிமையாளர்; தாய் வீட்டில் அகங்காரம்; உண்மையான வீட்டில் தடை.",
  },
  {
    house: 4, lagna: "Pisces", planetSign: "Gemini", planet: "Ketu", page: 270,
    en: "Bears the loss of mother and separation from her, has severe deficiency in the place of happiness and home, lives in a small house, feels troubled by the neighbours and colleagues, gets the contact of low-class people, bears loss of buildings and property, uses secret powers to get happiness",
    ta: "தாயை இழந்து பிரிவார்; மகிழ்ச்சியிலும் வீட்டிலும் பெரும் குறை; சிறு வீட்டில் வாழ்வார்; அண்டை வீட்டாராலும் சகாக்களாலும் தொல்லை; கீழ்நிலை மனிதர்களின் தொடர்பு; கட்டிடங்கள், சொத்தின் இழப்பு; மறைந்த சக்திகளால் மகிழ்ச்சி பெற முயல்வார்.",
  },
];

module.exports = { PLANET_IN_HOUSE };
