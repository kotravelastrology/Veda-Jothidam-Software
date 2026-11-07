/**
 * K.S. Krishnamurti, Reader VI "Horary Astrology" (corpus C34), printed pp.107-121 (PDF page = printed + 19): the classification of the signs, the sign-keyed paragraphs
 * "how to judge" (appearance, character, health and disease, finance and fortune, romance) and the twelve houses' significations. Read on the page images 2026-10-26.
 * Each paragraph is as printed (`en`, the record; OCR slips mended where the word is plain) with a Tamil rendering (`ta`) written from it. Edit in place and keep the page.
 */
const SIGNS = [
 "Aries",
 "Taurus",
 "Gemini",
 "Cancer",
 "Leo",
 "Virgo",
 "Libra",
 "Scorpio",
 "Sagittarius",
 "Capricorn",
 "Aquarius",
 "Pisces"
];
const CATEGORIES = {
 "APPEARANCE": {
  "cusp": 1,
  "introEn": "If the lord of the constellation in which the sub-lord of the ascendant is posited in [the sign]",
  "titleTa": "தோற்றம் — லக்ன உப அதிபதி நிற்கும் நட்சத்திரத்தின் அதிபதி நிற்கும் ராசி",
  "rows": [
   {
    "page": 109,
    "en": "Middle stature; lean, muscular; neither stout nor thick; ruddy complexion; long neck and face; broad head, bushy eyebrows; wiry hair.",
    "ta": "நடுத்தர உயரம்; ஒல்லி, தசைப்பற்று; பருமனும் தடிப்பும் அல்ல; சிவந்த நிறம்; நீண்ட கழுத்தும் முகமும்; அகன்ற தலை, அடர்ந்த புருவம்; கம்பி போன்ற முடி."
   },
   {
    "page": 109,
    "en": "Middle stature; plumpy body; broad forehead; thick neck; bright eyes; dark hair; good complexion; well built, big shoulders, well-developed muscles.",
    "ta": "நடுத்தர உயரம்; பூசிய உடல்; அகன்ற நெற்றி; தடித்த கழுத்து; ஒளிரும் கண்கள்; கருமையான முடி; நல்ல நிறம்; நன்கு கட்டிய உடல், பெரிய தோள்கள், வளர்ந்த தசைகள்."
   },
   {
    "page": 109,
    "en": "Tall, upright, straight body; long hands; thin legs; moderate complexion; sharp eyes; long nose.",
    "ta": "உயரம், நிமிர்ந்த நேரான உடல்; நீண்ட கைகள்; மெல்லிய கால்கள்; நடுத்தர நிறம்; கூர்மையான கண்கள்; நீண்ட மூக்கு."
   },
   {
    "page": 109,
    "en": "Clumsy body; upper body large; in age big abdomen; wide nose; large mouth; brown hair; pale complexion.",
    "ta": "பொருத்தமற்ற உடல்; மேல் உடல் பெரிது; வயதானபோது பெரிய வயிறு; அகன்ற மூக்கு; பெரிய வாய்; பழுப்பு முடி; வெளிர் நிறம்."
   },
   {
    "page": 109,
    "en": "Well-developed appearance; broad shoulders; broad forehead; tall, well-built, muscular; full stature; majestic appearance.",
    "ta": "நன்கு வளர்ந்த தோற்றம்; அகன்ற தோள்கள், நெற்றி; உயரம், நன்கு கட்டிய, தசைப்பற்று; முழு உயரம்; கம்பீரத் தோற்றம்."
   },
   {
    "page": 109,
    "en": "Slender body; tall, dark hair and eyes; curved eyebrows; profuse growth of hair; thin voice; quick walk; pot-belly; long nose.",
    "ta": "மெலிந்த உடல்; உயரம், கருமையான முடியும் கண்களும்; வளைந்த புருவம்; அடர்ந்த முடி; மெல்லிய குரல்; விரைந்த நடை; தொப்பை; நீண்ட மூக்கு."
   },
   {
    "page": 109,
    "en": "Tall, well-proportioned body; slender limbs, strong, graceful appearance; sweet smile; attractive countenance; beautiful eyebrows; parrot-like nose.",
    "ta": "உயரம், சமமான உடல்; மெல்லிய உறுப்புகள், வலிமை, அழகிய தோற்றம்; இனிய புன்னகை; கவர்ச்சியான முகம்; அழகிய புருவம்; கிளி மூக்கு."
   },
   {
    "page": 110,
    "en": "Well-proportioned body; long nose; average stature; broad face; commanding appearance; short and curly hair, muscular body; good personality.",
    "ta": "சமமான உடல்; நீண்ட மூக்கு; சராசரி உயரம்; அகன்ற முகம்; அதிகாரத் தோற்றம்; குட்டையான சுருள் முடி, தசைப்பற்றான உடல்; நல்ல ஆளுமை."
   },
   {
    "page": 110,
    "en": "Well-proportioned, well-developed body; eyebrows high and bushy; long nose; broad eyes, charming appearance; graceful look; fair complexion; beautiful.",
    "ta": "சமமான, நன்கு வளர்ந்த உடல்; உயர்ந்த அடர்ந்த புருவம்; நீண்ட மூக்கு; அகன்ற கண்கள், கவர்ச்சி; அழகிய பார்வை; வெள்ளை நிறம்; அழகு."
   },
   {
    "page": 110,
    "en": "Emaciated, weak; slow growth; slender, lean, wiry; long nose; deep set eyes; coarse hair. In old age, hunch backed.",
    "ta": "மெலிந்த, பலவீனம்; மெதுவான வளர்ச்சி; ஒல்லி, நரம்பு போன்ற உடல்; நீண்ட மூக்கு; உள்ளடங்கிய கண்கள்; கரடுமுரடான முடி. முதுமையில் கூன்."
   },
   {
    "page": 110,
    "en": "Tall, full stature; oval face; fair complexion; handsome appearance; defective teeth; brown shady hair.",
    "ta": "உயரம், முழு உயரம்; நீள்வட்ட முகம்; வெள்ளை நிறம்; அழகிய தோற்றம்; குறையுள்ள பற்கள்; பழுப்பு நிற முடி."
   },
   {
    "page": 110,
    "en": "Short; plumpy, stout, muscular, spherical big eyes protruding, soft hair, silky.",
    "ta": "குட்டை; பூசிய, பருமன், தசைப்பற்று; உருண்டை பெரிய துருத்திய கண்கள்; மென்மையான பட்டு போன்ற முடி."
   }
  ]
 },
 "CHARACTER": {
  "cusp": 1,
  "introEn": "If the lord of the constellation in which the sub-lord of the ascendant is posited in [the sign]",
  "titleTa": "குணம் — லக்ன உப அதிபதி நிற்கும் நட்சத்திரத்தின் அதிபதி நிற்கும் ராசி",
  "rows": [
   {
    "page": 110,
    "en": "Active, ambitious, bold, impulsive, rash, aggressive; argumentative; confidence, courage; high aim; ever enterprising; dislikes subordination; quick action; unbounded confidence; executive ability; uncompromising spirit, mind pregnant with ideas; no self-sacrifice; fretful and boisterous; over optimistic; over-trade; fanatic; bold, foolhardiness; demonstrative; passionate; proud; hasty, quarrelsome.",
    "ta": "சுறுசுறுப்பு, இலட்சியம், துணிவு, உணர்ச்சிவசம், அவசரம், ஆக்ரோஷம்; வாதம்; தன்னம்பிக்கை, தைரியம்; உயர்ந்த குறிக்கோள்; எப்போதும் முயற்சி; கீழ்ப்படிவு பிடிக்காது; விரைந்த செயல்; அளவற்ற நம்பிக்கை; நிர்வாகத் திறன்; சமரசமற்ற மனம், கருத்துகள் நிறைந்த மனம்; தியாகம் இல்லை; எரிச்சல், ஆரவாரம்; அதீத நம்பிக்கை; அதீத வணிகம்; வெறி; துணிவு, முரட்டுத் துணிச்சல்; வெளிப்படுத்துதல்; ஆர்வம்; செருக்கு; அவசரம், சண்டை."
   },
   {
    "page": 110,
    "en": "Endurance; patience; never forget, nor forgive; unrelenting; slow, steady; perseverance; patience, persistence; conservative; lazy; self-confidence; deep-set intuition; not verbose; stubborn; loyal.",
    "ta": "தாங்கும் திறன்; பொறுமை; மறக்கவும் மன்னிக்கவும் மாட்டார்; இளகாதவர்; மெதுவாக, நிலையாக; விடாமுயற்சி; பொறுமை, நிலைப்பு; பழமைவாதம்; சோம்பல்; தன்னம்பிக்கை; ஆழ்ந்த உள்ளுணர்வு; அதிகம் பேசமாட்டார்; பிடிவாதம்; விசுவாசம்."
   },
   {
    "page": 110,
    "en": "Carefree; joyous; reluctant; versatile; restless; changeful; adaptability; fond of travel; indecisive; ever contemplating; awkwardness, fickleness; generous, or niggardly; quick grasp; much retentive power; good reasoning ability.",
    "ta": "கவலையற்றவர்; மகிழ்ச்சி; தயக்கம்; பல திறமை; அமைதியின்மை; மாறும் குணம்; இணங்கும் தன்மை; பயணத்தில் விருப்பம்; முடிவெடுக்காமை; எப்போதும் சிந்தனை; பொருந்தாமை, நிலையின்மை; தாராளம் அல்லது கஞ்சத்தனம்; விரைந்த புரிதல்; நல்ல நினைவாற்றல்; நல்ல பகுத்தறிவு."
   },
   {
    "page": 110,
    "en": "Changeability, timid; fertile imagination, emotional, sympathetic; oversensitive; talkative; nervous irritability; brave in mental attitude; short temper; tenacious memory; diplomatic, discreet, conventional; loyal; impatient; very selfish.",
    "ta": "மாறும் தன்மை, கூச்சம்; வளமான கற்பனை, உணர்ச்சி, அனுதாபம்; அதிக உணர்திறன்; அதிகம் பேசுதல்; நரம்பு எரிச்சல்; மன உறுதி; குறுகிய கோபம்; வலுவான நினைவு; இராஜதந்திரம், எச்சரிக்கை, மரபு; விசுவாசம்; பொறுமையின்மை; மிகுந்த சுயநலம்."
   },
   {
    "page": 111,
    "en": "Noble, large hearted, magnanimous, generous, furious, humanitarian, no evil thought, dignity, faith, less of talk, observes silence, likes flattery, enthusiastic, sports, speculation.",
    "ta": "உயர்குணம், பெரிய மனம், பெருந்தன்மை, தாராளம், கோபம், மனிதநேயம், தீய எண்ணமில்லை, கௌரவம், நம்பிக்கை, குறைவாகப் பேசுவார், மௌனம், புகழ்ச்சி பிடிக்கும், உற்சாகம், விளையாட்டு, ஊக வணிகம்."
   },
   {
    "page": 111,
    "en": "Ever changeful, commercial instinct, very brisk, very quick, thorough, methodical, sensible, rational, practical, discriminative, critical, self-pity, saves money, prudent, over-careful, proper, orderly, fond of horticulture, gardening, medicine, food, hygiene.",
    "ta": "எப்போதும் மாறுபவர், வணிக உணர்வு, மிகச் சுறுசுறுப்பு, விரைவு, முழுமை, ஒழுங்கு, விவேகம், பகுத்தறிவு, நடைமுறை, பாகுபாடு, குறை காணுதல், சுய இரக்கம், பணம் சேமிப்பார், விவேகம், அதீத கவனம், முறை, ஒழுங்கு; தோட்டக்கலை, மருத்துவம், உணவு, சுகாதாரத்தில் விருப்பம்."
   },
   {
    "page": 111,
    "en": "Level headed, mental equilibrium, dispassionate, compares and contrasts, constructive critic, foregoes personal comforts, painstaking, helps others, popular, politicians, fertile imagination, correct intuition, brilliant intellect, admirable refinement, pleasant nature, gentle and affectionate, easy-going, shrewd, persuasive, fond of opposite sex.",
    "ta": "நிதானம், மன சமநிலை, நடுநிலை, ஒப்பிட்டுப் பார்ப்பார், ஆக்கபூர்வ விமர்சகர், தன் சுகத்தை விடுவார், கடின உழைப்பு, பிறருக்கு உதவுவார், புகழ், அரசியல்வாதிகள், வளமான கற்பனை, சரியான உள்ளுணர்வு, அறிவு ஒளி, போற்றத்தக்க நாகரிகம், இனிய குணம், மென்மை, அன்பு, எளிதில் பழகுவார், சாமர்த்தியம், இணங்கச் செய்வார், எதிர்பாலினத்தில் விருப்பம்."
   },
   {
    "page": 111,
    "en": "Very clever, hard working, over-critical, determined, never idle, never mindful of obstacles, good imagination, sharp intelligence, intense feeling, emotion, good critic, resourceful, proper intuition, prompt action, successful bargains, self-assertion, impulsive action, independence, excitement, likes and dislikes, gossip, non-interfering, frank, plain, blunt, revengeful.",
    "ta": "மிகக் கெட்டிக்காரர், கடின உழைப்பு, அதீத விமர்சனம், உறுதி, எப்போதும் சோம்பலற்றவர், தடைகளைப் பொருட்படுத்தமாட்டார், நல்ல கற்பனை, கூர்மையான அறிவு, ஆழ்ந்த உணர்வு, நல்ல விமர்சகர், சமயோசிதம், சரியான உள்ளுணர்வு, விரைந்த செயல், வெற்றிகரமான பேரம், தன் கருத்தை நிலைநாட்டுவார், உணர்ச்சிவசச் செயல், சுதந்திரம், பரபரப்பு, விருப்பு-வெறுப்பு, வம்பு, தலையிடமாட்டார், வெளிப்படை, எளிமை, முரட்டுத்தனம், பழிவாங்கும் குணம்."
   },
   {
    "page": 111,
    "en": "Bold, courageous; pushful, ambitious, greedy, aspiring, optimistic, never timid, dauntless, self-confidence, energy, enthusiasm, vigour, vitality, true, honest, sincere, God-fearing.",
    "ta": "துணிவு, தைரியம்; முன்னேறுபவர், இலட்சியம், பேராசை, உயர ஆசை, நம்பிக்கை, கூச்சமில்லை, அஞ்சாமை, தன்னம்பிக்கை, ஆற்றல், உற்சாகம், வலிமை, உயிர்ப்பு, உண்மை, நேர்மை, உளப்பூர்வம், தெய்வபக்தி."
   },
   {
    "page": 111,
    "en": "Economical, prudent, reasonable; thoughtful, practical minded, methodical, plodding, persevering, patiently working, quick execution, careful decision, confidence, tolerance, steady; fear of ridicule, chooses friends, honest, sincere; or dishonest, selfish, greedy, miserly, criminal, shady dealings.",
    "ta": "சிக்கனம், விவேகம், நியாயம்; சிந்தனை, நடைமுறை மனம், ஒழுங்கு, விடாமுயற்சி, பொறுமையாக உழைப்பு, விரைந்த செயல், கவனமான முடிவு, நம்பிக்கை, சகிப்பு, நிலைத்தன்மை; கேலிக்கு அச்சம், நண்பர்களைத் தேர்ந்தெடுப்பார், நேர்மை, உளப்பூர்வம்; அல்லது நேர்மையின்மை, சுயநலம், பேராசை, கஞ்சம், குற்றவாளி, சந்தேகமான வியாபாரம்."
   },
   {
    "page": 111,
    "en": "Intelligent, careful and cautious, watchful and thoughtful, slow in grasp, strong memory, broad out-look, human understanding, outspoken, unselfish, humane, impersonal, social/silent worker, new thoughts, fresh ideas, research mind, steady and stubborn, inclination to science.",
    "ta": "அறிவு, கவனமும் எச்சரிக்கையும், விழிப்பும் சிந்தனையும், மெதுவான புரிதல், வலுவான நினைவு, அகன்ற பார்வை, மனித புரிதல், வெளிப்படையான பேச்சு, சுயநலமின்மை, மனிதநேயம், தனிப்பட்ட பற்றின்மை, சமூக/அமைதியான உழைப்பாளி, புதிய எண்ணங்கள், ஆராய்ச்சி மனம், நிலையானவர், பிடிவாதம், அறிவியலில் நாட்டம்."
   },
   {
    "page": 112,
    "en": "Philosophical results, dreamy, contemplating, imagining, honest, outspoken, helpful, humane, forego, forgive and forget, unassuming, over-liberal, unbounded generosity, contradiction in nature, sweet temper, socially inclined.",
    "ta": "தத்துவ மனம், கனவு காண்பவர், சிந்தனை, கற்பனை, நேர்மை, வெளிப்படையான பேச்சு, உதவும் குணம், மனிதநேயம், விட்டுக்கொடுத்து மன்னித்து மறப்பார், அடக்கம், அதீத தாராளம், அளவற்ற கொடை, முரண்பட்ட இயல்பு, இனிய குணம், சமூகத்தில் நாட்டம்."
   }
  ]
 },
 "HEALTH": {
  "cusp": 6,
  "introEn": "If the sub-lord of the 6th cusp is deposited in the constellation of the planet deposited in [the sign]",
  "titleTa": "உடல்நலமும் நோயும் — 6-ஆம் கஸ்ப் உப அதிபதி நிற்கும் நட்சத்திரத்தின் அதிபதி நிற்கும் ராசி",
  "rows": [
   {
    "page": 112,
    "en": "Good health, enough immunity, fond of sports, energetic. Headaches, burns, inflammatory diseases, affection of the brain, neuralgia, coma, high fever, colic pains, paralysis, apoplexy, pimples, insomnia, ringworms, migraine, smallpox, malaria, thrombosis.",
    "ta": "நல்ல ஆரோக்கியம், போதிய நோய் எதிர்ப்பு, விளையாட்டில் விருப்பம், ஆற்றல். தலைவலி, தீக்காயம், அழற்சி நோய்கள், மூளைப் பாதிப்பு, நரம்புவலி, மயக்கம், கடும் காய்ச்சல், வயிற்றுவலி, பக்கவாதம், பருக்கள், தூக்கமின்மை, படர்தாமரை, ஒற்றைத் தலைவலி, அம்மை, மலேரியா, இரத்த உறைவு."
   },
   {
    "page": 112,
    "en": "Robust health, never deficiency, slow recovery; tonsils, diphtheria, pyorrhoea, throat, palate, neck, cold, apoplexy, constipation, plethora, pimples and eyesore.",
    "ta": "உறுதியான ஆரோக்கியம், குறைபாடு இல்லை, மெதுவான குணம்; டான்சில், தொண்டை அழற்சி, பல்லீறு நோய், தொண்டை, அண்ணம், கழுத்து, சளி, பக்கவாதம், மலச்சிக்கல், இரத்த மிகை, பருக்கள், கண் நோய்."
   },
   {
    "page": 112,
    "en": "Delicate health, strain, overtaxing, thereby ill-health; lungs, cold, running of the nose, influenza, eosinophilia, pleurisy, bronchitis, T.B., shoulders and arms affected.",
    "ta": "மென்மையான ஆரோக்கியம், சோர்வு, அதிக உழைப்பால் நோய்; நுரையீரல், சளி, மூக்கு ஒழுகல், காய்ச்சல், ஈசினோபிலியா, நுரையீரல் உறை அழற்சி, மூச்சுக்குழாய் அழற்சி, காசம், தோள்கள், கைகள் பாதிப்பு."
   },
   {
    "page": 112,
    "en": "Fragile lungs, flu, cough, asthma, bronchitis, pleurisy, T.B., stomach upset, dyspepsia, flatulence, dropsy, beri-beri, nervous debility, fear complex, hysteria, jaundice, obstruction of the bile, gall stone, boils on the chest.",
    "ta": "பலவீன நுரையீரல், காய்ச்சல், இருமல், ஆஸ்துமா, மூச்சுக்குழாய் அழற்சி, நுரையீரல் உறை அழற்சி, காசம், வயிற்றுக் கோளாறு, அஜீரணம், வாயு, நீர்க்கட்டு, பெரிபெரி, நரம்புத் தளர்ச்சி, பய உணர்வு, வெறி, மஞ்சள் காமாலை, பித்தத் தடை, பித்தக்கல், மார்பில் கட்டிகள்."
   },
   {
    "page": 112,
    "en": "Good constitution, quick recovery. Heart disease, palpitation, spinal meningitis, syncope, locomotor ataxia, inflammations, sunstroke, giddiness, pestilence, epilepsy, rheumatic fever.",
    "ta": "நல்ல உடல்வாகு, விரைவில் குணம். இதய நோய், படபடப்பு, முதுகுத்தண்டு மூளைக்காய்ச்சல், மயக்கம், நடை தடுமாற்றம், அழற்சி, வெயில் தாக்கம், தலைச்சுற்றல், கொள்ளை நோய், வலிப்பு, வாதக் காய்ச்சல்."
   },
   {
    "page": 112,
    "en": "Good health, very active, careful about diet, abdomen. Hypochondria, chylification, typhoid, bowels, malnutrition, tapeworm, intestinal disease.",
    "ta": "நல்ல ஆரோக்கியம், மிகச் சுறுசுறுப்பு, உணவில் கவனம், வயிறு. நோய் பயம், செரிமானக் கோளாறு, டைபாய்டு, குடல், ஊட்டக்குறை, நாடாப்புழு, குடல் நோய்."
   },
   {
    "page": 113,
    "en": "Normal health, susceptible for infectious disease, prophylactic measures needed. Kidneys, loins, spines affected, uterus removal, appendicitis, lumbago, polyuria, hernia.",
    "ta": "சாதாரண ஆரோக்கியம், தொற்று நோய்க்கு எளிதில் ஆளாவார், தடுப்பு நடவடிக்கை தேவை. சிறுநீரகம், இடுப்பு, முதுகெலும்பு பாதிப்பு, கருப்பை அகற்றம், குடல்வால் அழற்சி, இடுப்புவலி, மிகை சிறுநீர், குடலிறக்கம்."
   },
   {
    "page": 113,
    "en": "Good health, quick recovery; generative organs, the bladder, womb, ovaries, prostate gland, venereal distemper, renal stone, gravel, adenoids, polypi, piles.",
    "ta": "நல்ல ஆரோக்கியம், விரைவில் குணம்; இனப்பெருக்க உறுப்புகள், சிறுநீர்ப்பை, கருப்பை, சூற்பை, புரோஸ்டேட், பால்வினை நோய், சிறுநீரகக் கல், மணல், அடினாய்டு, மூக்குப் பிடிப்பு, மூலம்."
   },
   {
    "page": 113,
    "en": "Good health, quick recovery; sciatica, rheumatic pain, fracture in the hip, lumbago, gout, eosinophilia, lung trouble, fracture of the bones, diabetes, affection of lungs, hiccough, asthma.",
    "ta": "நல்ல ஆரோக்கியம், விரைவில் குணம்; இடுப்பு நரம்புவலி, வாத வலி, இடுப்பு முறிவு, இடுப்புவலி, கீல்வாதம், ஈசினோபிலியா, நுரையீரல் தொல்லை, எலும்பு முறிவு, நீரிழிவு, நுரையீரல் பாதிப்பு, விக்கல், ஆஸ்துமா."
   },
   {
    "page": 113,
    "en": "Leprosy, erysipelas, rheumatism, gout, indigestion, cold, melancholia, neuralgia, knees and patella bones fracture, urticaria, skin disease, eczema, dislocation.",
    "ta": "குஷ்டம், தோல் அழற்சி, வாதம், கீல்வாதம், அஜீரணம், சளி, மனச்சோர்வு, நரம்புவலி, முழங்கால்-முழங்கால் சில்லு எலும்பு முறிவு, படை, தோல் நோய், தடிப்பு, மூட்டு விலகல்."
   },
   {
    "page": 113,
    "en": "Below normal health, tooth trouble, tonsils, heart trouble, rheumatic pains, skin disease, elephantiasis, eczema, eye-trouble, blood-pressure, insomnia, ulcerated gum.",
    "ta": "சாதாரணத்துக்குக் குறைந்த ஆரோக்கியம், பல் தொல்லை, டான்சில், இதயத் தொல்லை, வாத வலி, தோல் நோய், யானைக்கால், தடிப்பு, கண் தொல்லை, இரத்த அழுத்தம், தூக்கமின்மை, புண்ணான ஈறு."
   },
   {
    "page": 113,
    "en": "Moderate health, addicted to drinks, affection of the ankle, feet, dropsy, varicose veins, intestinal trouble, perspiration of the feet, typhoid, over-dose of medicine, corns, piles, deformities, T.B., deficiency of enzymes, hernia, deafness.",
    "ta": "மிதமான ஆரோக்கியம், குடிப்பழக்கம், கணுக்கால், பாதங்கள் பாதிப்பு, நீர்க்கட்டு, நரம்புச் சுருள், குடல் தொல்லை, பாத வியர்வை, டைபாய்டு, மருந்து மிகை, கட்டிகள் (காலில்), மூலம், உறுப்புக் குறை, காசம், நொதி குறைவு, குடலிறக்கம், செவிடு."
   }
  ]
 },
 "FINANCE": {
  "cusp": 2,
  "introEn": "If the sub-lord of the second cusp is deposited in the constellation of the planet situated in [the sign]",
  "titleTa": "பணமும் அதிர்ஷ்டமும் — 2-ஆம் கஸ்ப் உப அதிபதி நிற்கும் நட்சத்திரத்தின் அதிபதி நிற்கும் ராசி",
  "rows": [
   {
    "page": 113,
    "en": "Can earn much, spend much, impulsive purchases, rash investments, think of today, never of tomorrow, start in a flash, end in a crash, act first, speak next, think last.",
    "ta": "அதிகம் சம்பாதிக்கலாம், அதிகம் செலவு, உணர்ச்சிவசக் கொள்முதல், அவசர முதலீடு, இன்றைய சிந்தனை, நாளை பற்றி இல்லை, மின்னலாகத் தொடங்கி சரிவில் முடியும், முதலில் செயல், பிறகு பேச்சு, கடைசியில் சிந்தனை."
   },
   {
    "page": 113,
    "en": "Hoards money, accumulates wealth, cautious spending, always keeps reserve, never risks in money matters, never squander, care for material status, invest on estates, agricultural lands, practically builds fortune steadily.",
    "ta": "பணத்தைச் சேமிப்பார், செல்வம் சேர்ப்பார், கவனமான செலவு, எப்போதும் இருப்பு வைப்பார், பணத்தில் துணிவில்லை, வீண் செய்யமாட்டார், பொருளாதார நிலையில் அக்கறை, நிலம்-விவசாய நிலத்தில் முதலீடு, நடைமுறையாக நிலையாகச் செல்வம் கட்டுவார்."
   },
   {
    "page": 113,
    "en": "Either fortune or misfortune, family disputes, self-destruction and of changes, secret love affairs, detrimental.",
    "ta": "அதிர்ஷ்டம் அல்லது துரதிர்ஷ்டம், குடும்பத் தகராறு, சுய அழிவு, மாற்றங்கள், இரகசிய காதல், தீங்கு."
   },
   {
    "page": 114,
    "en": "Commercial career, trade, caterer, shops, stalls, nurses, careful expenses, prudent, saves by hard labour, accumulates wealth.",
    "ta": "வணிகத் தொழில், வர்த்தகம், உணவுத் தொழில், கடைகள், நிலையங்கள், செவிலியர், கவனமான செலவு, விவேகம், கடின உழைப்பால் சேமிப்பு, செல்வம் சேர்த்தல்."
   },
   {
    "page": 114,
    "en": "High position, deals big issues, spend-thrift, faces hard times, in youth lucky, gambles, speculates, over-liberal.",
    "ta": "உயர் பதவி, பெரிய விஷயங்களைக் கையாள்வார், ஊதாரி, கடினக் காலங்களை எதிர்கொள்வார், இளமையில் அதிர்ஷ்டம், சூதாட்டம், ஊகம், அதீத தாராளம்."
   },
   {
    "page": 114,
    "en": "Commercial instinct, careful about money, knows value of money, self-made, works hard, money accumulates, investment not profitable.",
    "ta": "வணிக உணர்வு, பணத்தில் கவனம், பணத்தின் மதிப்பு தெரியும், சுயமாக உயர்ந்தவர், கடின உழைப்பு, பணம் சேரும், முதலீடு லாபமில்லை."
   },
   {
    "page": 114,
    "en": "Business with partners, advisers, critics, story writers, able salesman, spend-thrift.",
    "ta": "கூட்டாளிகளுடன் தொழில், ஆலோசகர்கள், விமர்சகர்கள், கதை எழுத்தாளர், திறமையான விற்பனையாளர், ஊதாரி."
   },
   {
    "page": 114,
    "en": "Impulsive purchases, extravagant expenses, makes large money, and spends much of it, no mind to save maximum, but fortune favours.",
    "ta": "உணர்ச்சிவசக் கொள்முதல், ஆடம்பரச் செலவு, அதிகம் சம்பாதித்து அதிகம் செலவிடுவார், அதிகம் சேமிக்கும் எண்ணமில்லை, ஆனால் அதிர்ஷ்டம் துணை."
   },
   {
    "page": 114,
    "en": "Earns by fair means, no black money, satisfactory earnings, speculation not useful, false prestige, spends much.",
    "ta": "நேர்மையான வழியில் சம்பாதிப்பார், கறுப்புப் பணம் இல்லை, திருப்தியான வருமானம், ஊகம் பயனில்லை, போலிப் பெருமை, அதிகம் செலவு."
   },
   {
    "page": 114,
    "en": "Conservative, gains, fame and money, resourceful, concentration, no speculation, invest on permanent position, industrious, saves money, no waste, no rest.",
    "ta": "பழமைவாதம், ஆதாயம், புகழும் பணமும், சமயோசிதம், கவனம், ஊகம் இல்லை, நிலையான இடத்தில் முதலீடு, உழைப்பாளி, பணம் சேமிப்பு, வீணில்லை, ஓய்வில்லை."
   },
   {
    "page": 114,
    "en": "Makes money, inventions, discoveries, patiently saving, neither economical, nor extravagant.",
    "ta": "பணம் ஈட்டுவார், கண்டுபிடிப்புகள், கண்டுபிடிப்பு, பொறுமையாகச் சேமிப்பு, சிக்கனமும் அல்ல ஆடம்பரமும் அல்ல."
   },
   {
    "page": 114,
    "en": "Very happy, helpful to others, interested in music, films, spends thereby, good business ability, keeps money safe, permanent service, successful politician.",
    "ta": "மிக மகிழ்ச்சி, பிறருக்கு உதவுவார், இசை, திரைப்படத்தில் ஆர்வம், அதற்குச் செலவு, நல்ல வணிகத் திறன், பணத்தைப் பாதுகாப்பார், நிலையான பணி, வெற்றிகரமான அரசியல்வாதி."
   }
  ]
 },
 "ROMANCE": {
  "cusp": 5,
  "introEn": "If the sub-lord of the fifth cusp is deposited in the constellation of the planet, signifying the fifth house matter, situated in [the sign] (for the partner: the sub-lord of the 7th cusp in a constellation whose lord is tenanted in the sign)",
  "titleTa": "காதல் — 5-ஆம் கஸ்ப் உப அதிபதி நிற்கும் நட்சத்திரத்தின் அதிபதி (5-ஆம் வீட்டைக் குறிப்பவர்) நிற்கும் ராசி; துணைக்கு 7-ஆம் கஸ்ப்",
  "rows": [
   {
    "page": 114,
    "en": "Frank; enthusiastic; charming; practical; freedom, adventure in love, everlasting affection, but dominant nature, independent, or proud.",
    "ta": "வெளிப்படை; உற்சாகம்; கவர்ச்சி; நடைமுறை; காதலில் சுதந்திரம், சாகசம், நீடித்த பாசம், ஆனால் ஆதிக்க குணம், சுதந்திரம் அல்லது செருக்கு."
   },
   {
    "page": 115,
    "en": "Loyal, true, faces an opposition, self-control needed, lucky, steady.",
    "ta": "விசுவாசம், உண்மை, எதிர்ப்பை எதிர்கொள்வார், சுய கட்டுப்பாடு தேவை, அதிர்ஷ்டம், நிலைத்தன்மை."
   },
   {
    "page": 115,
    "en": "Quick friendship, critics finding fault with, no satisfaction, prefers variety, baffles others, controls, mixes with intellectuals, more romance more happy, difficulty to understand.",
    "ta": "விரைந்த நட்பு, குறை காண்போர், திருப்தியின்மை, மாற்றத்தை விரும்புவார், பிறரைக் குழப்புவார், கட்டுப்படுத்துவார், அறிவாளிகளுடன் பழகுவார், அதிக காதல் அதிக மகிழ்ச்சி, புரிந்துகொள்ள கடினம்."
   },
   {
    "page": 115,
    "en": "No romance means no life to them, will sacrifice comforts, loyal and affectionate, sincere and true, yet fickle minded.",
    "ta": "காதல் இல்லையெனில் வாழ்க்கையே இல்லை, சுகத்தைத் தியாகம் செய்வார், விசுவாசமும் அன்பும், நேர்மையும் உண்மையும், ஆனால் மாறும் மனம்."
   },
   {
    "page": 115,
    "en": "Romantic, deep love, keeps partner cheerful, ideal lover, very passionate, attracts others, proud of family.",
    "ta": "காதல் மனம், ஆழ்ந்த காதல், துணையை மகிழ்ச்சியாக வைப்பார், சிறந்த காதலர், மிகுந்த ஆர்வம், பிறரைக் கவர்வார், குடும்பப் பெருமை."
   },
   {
    "page": 115,
    "en": "Own ideals, so difficult, long delay to choose one, cares work, perfection, values the intellectuals, shy, touchy, finds fault with others.",
    "ta": "சொந்த இலட்சியங்கள், அதனால் கடினம், தேர்வு செய்யத் தாமதம், பணியில் அக்கறை, முழுமை, அறிவாளிகளை மதிப்பார், கூச்சம், உணர்திறன், பிறரைக் குறை காண்பார்."
   },
   {
    "page": 115,
    "en": "Most lovable, experts in love affairs, sincere, pleasant conversationalists, enjoys in full, satisfies.",
    "ta": "மிகுந்த அன்புக்குரியவர், காதல் விவகாரங்களில் வல்லவர், உளப்பூர்வம், இனிய உரையாடல், முழுமையாக அனுபவிப்பார், திருப்தி தருவார்."
   },
   {
    "page": 115,
    "en": "Complex mood, energetic, dynamic, lacking sympathy, unsteady, expects appreciation from partner, gives comforts, and keeps in good cheer.",
    "ta": "சிக்கலான மனநிலை, ஆற்றல், இயக்கம், அனுதாபக் குறைவு, நிலையின்மை, துணையின் பாராட்டை எதிர்பார்ப்பார், சுகம் தருவார், மகிழ்ச்சியாக வைப்பார்."
   },
   {
    "page": 115,
    "en": "Temper flares up, interest in games, society, family life not so important, person of integrity, and morals, allows freedom to wife.",
    "ta": "கோபம் பொங்கும், விளையாட்டு, சமூகத்தில் ஆர்வம், குடும்ப வாழ்க்கை அவ்வளவு முக்கியமல்ல, நேர்மையும் ஒழுக்கமும், மனைவிக்குச் சுதந்திரம் தருவார்."
   },
   {
    "page": 115,
    "en": "Affectionate, but never gives expression, emotional, slow and cautious in selection, never bold and rash, wait for the consent of the other, true and faithful.",
    "ta": "பாசம், ஆனால் வெளிப்படுத்தமாட்டார், உணர்ச்சி, தேர்வில் மெதுவும் எச்சரிக்கையும், துணிவு-அவசரம் இல்லை, மற்றவரின் சம்மதத்துக்குக் காத்திருப்பார், உண்மையும் விசுவாசமும்."
   },
   {
    "page": 115,
    "en": "Intelligent, prefers educated partner, strong attachment, permanent one, unassuming, free, and social, sympathetic, and accommodative.",
    "ta": "அறிவு, படித்த துணையை விரும்புவார், வலுவான பற்று, நிலையானது, அடக்கம், சுதந்திரம், சமூகம், அனுதாபம், இணங்கும் தன்மை."
   },
   {
    "page": 115,
    "en": "Prefers beautiful partner, also intellectual, fond of fine arts, suspicious nature, dreams much, gets delayed, slow development.",
    "ta": "அழகான துணையை விரும்புவார், அறிவுடையவரையும், நுண்கலையில் விருப்பம், சந்தேக குணம், அதிகம் கனவு காண்பார், தாமதம், மெதுவான வளர்ச்சி."
   }
  ]
 }
};
const CLASSES = [
 {
  "name": "Positive (masculine)",
  "members": "Aries, Gemini, Leo, Libra, Sagittarius, Aquarius",
  "en": "Assertive, bold, expressive, active, offensive, determined, more self-expressive.",
  "ta": "ஒற்றை ராசிகள்: மேஷம், மிதுனம், சிம்மம், துலாம், தனுசு, கும்பம் — உறுதிப்படுத்துவார், துணிவு, வெளிப்படுத்துதல், சுறுசுறுப்பு, தாக்குதல், உறுதி.",
  "page": 107
 },
 {
  "name": "Negative (feminine)",
  "members": "Taurus, Cancer, Virgo, Scorpio, Capricorn, Pisces",
  "en": "Passive, receptive, defensive, more self-repressive.",
  "ta": "இரட்டை ராசிகள்: ரிஷபம், கடகம், கன்னி, விருச்சிகம், மகரம், மீனம் — செயலற்ற, ஏற்கும், தற்காப்பு, தன்னை அடக்குதல்.",
  "page": 107
 },
 {
  "name": "Northern",
  "members": "Aries to Virgo",
  "en": "",
  "ta": "வடக்கு ராசிகள்: மேஷம் முதல் கன்னி வரை.",
  "page": 107
 },
 {
  "name": "Southern",
  "members": "Libra to Pisces",
  "en": "",
  "ta": "தெற்கு ராசிகள்: துலாம் முதல் மீனம் வரை.",
  "page": 107
 },
 {
  "name": "Equinoctial",
  "members": "Aries and Libra",
  "en": "",
  "ta": "சமபகல்-இரவு ராசிகள்: மேஷம், துலாம்.",
  "page": 107
 },
 {
  "name": "Tropical",
  "members": "Cancer and Capricorn",
  "en": "",
  "ta": "அயன ராசிகள்: கடகம், மகரம்.",
  "page": 107
 },
 {
  "name": "Fiery",
  "members": "Aries, Leo, Sagittarius",
  "en": "Assertive, independent, courageous and enthusiastic. Activity and ambition, vigour and vitality, energy and push.",
  "ta": "தீ: மேஷம், சிம்மம், தனுசு — உறுதி, சுதந்திரம், துணிவு, உற்சாகம்; செயல், இலட்சியம், வலிமை, உயிர்ப்பு, ஆற்றல், முன்னேற்றம்.",
  "page": 107
 },
 {
  "name": "Earthy",
  "members": "Taurus, Virgo, Capricorn",
  "en": "Stability, material welfare, wealth, power, position, health, cautious, premeditative, prudent and practical; secretive and auspicious; stubborn and self-protective; slow and steady; reserved and restrained; methodical and economical; plodding and persevering.",
  "ta": "நிலம்: ரிஷபம், கன்னி, மகரம் — நிலைத்தன்மை, பொருள் நலம், செல்வம், அதிகாரம், பதவி, ஆரோக்கியம், எச்சரிக்கை, முன்யோசனை, விவேகம், நடைமுறை; இரகசியம், மங்களம்; பிடிவாதம், தற்காப்பு; மெதுவாக நிலையாக; ஒதுக்கம், கட்டுப்பாடு; ஒழுங்கு, சிக்கனம்; விடாமுயற்சி.",
  "page": 107
 },
 {
  "name": "Airy",
  "members": "Gemini, Libra, Aquarius",
  "en": "Cheerful, gentle, amiable, courteous, sympathetic, refined, humane. Good intellect, fertile imagination; idealistic and artistic, well-informed, fertile. Musical, level-headed and tactful.",
  "ta": "காற்று: மிதுனம், துலாம், கும்பம் — மகிழ்ச்சி, மென்மை, நட்பு, மரியாதை, அனுதாபம், நாகரிகம், மனிதநேயம்; நல்ல அறிவு, வளமான கற்பனை; இலட்சியவாதம், கலை, நல்ல தகவல்; இசை, நிதானம், சாமர்த்தியம்.",
  "page": 108
 },
 {
  "name": "Watery",
  "members": "Cancer, Scorpio, Pisces",
  "en": "Fertile imagination; constitution weak; timid, inert and unwilling to act. Receptive, contemplative, sensitive, sentimental and psychic.",
  "ta": "நீர்: கடகம், விருச்சிகம், மீனம் — வளமான கற்பனை; பலவீன உடல்வாகு; கூச்சம், மந்தம், செயல்பட விருப்பமின்மை; ஏற்கும், சிந்தனை, உணர்திறன், உணர்ச்சி, உள்ளுணர்வு.",
  "page": 108
 },
 {
  "name": "Movable",
  "members": "Aries, Cancer, Libra, Capricorn",
  "en": "Enterprise, enthusiasm, love of ambition, forcefulness, and go-ahead spirit; fame, recognition and popularity; loves changes and reform.",
  "ta": "சரம்: மேஷம், கடகம், துலாம், மகரம் — முயற்சி, உற்சாகம், இலட்சிய ஆர்வம், வலிமை, முன்னேறும் மனம்; புகழ், அங்கீகாரம், பிரபலம்; மாற்றத்தையும் சீர்திருத்தத்தையும் விரும்புவார்.",
  "page": 108
 },
 {
  "name": "Fixed",
  "members": "Taurus, Leo, Scorpio, Aquarius",
  "en": "Stamina and persistence in action. Very strong and determined will. Keep on working, patience and persistence; practical; firm.",
  "ta": "ஸ்திரம்: ரிஷபம், சிம்மம், விருச்சிகம், கும்பம் — தாங்கும் திறன், செயலில் விடாப்பிடி; மிக வலுவான உறுதியான மனம்; தொடர்ந்து உழைப்பு, பொறுமை; நடைமுறை; உறுதி.",
  "page": 108
 },
 {
  "name": "Common (dual, mutable)",
  "members": "Gemini, Virgo, Sagittarius, Pisces",
  "en": "Dual, fluctuating, flexibility, plasticity, intellectual, sympathetic, sensitive, subtle, versatile, changeful, inconstant, indecisive, vacillating and restless.",
  "ta": "உபய: மிதுனம், கன்னி, தனுசு, மீனம் — இரட்டை, ஏற்ற இறக்கம், நெகிழ்வு, அறிவு, அனுதாபம், உணர்திறன், நுண்மை, பல திறமை, மாற்றம், நிலையின்மை, தயக்கம், அமைதியின்மை.",
  "page": 108
 },
 {
  "name": "Fruitful",
  "members": "Cancer, Scorpio, Pisces (fruitful); Taurus, Libra, Capricorn, Sagittarius (semi-fruitful)",
  "en": "Fruitful signs show success: realisation of ambition.",
  "ta": "பலன் தரும்: கடகம், விருச்சிகம், மீனம்; பாதி: ரிஷபம், துலாம், மகரம், தனுசு — வெற்றி, இலட்சிய நிறைவு.",
  "page": 108
 },
 {
  "name": "Barren",
  "members": "Aries, Gemini, Leo, Virgo",
  "en": "Attempts not successful; no desired results.",
  "ta": "மலட்டு: மேஷம், மிதுனம், சிம்மம், கன்னி — முயற்சி வெற்றி இல்லை; விரும்பிய பலன் இல்லை.",
  "page": 108
 },
 {
  "name": "Mute",
  "members": "Cancer, Scorpio, Pisces",
  "en": "",
  "ta": "ஊமை: கடகம், விருச்சிகம், மீனம்.",
  "page": 108
 },
 {
  "name": "Violent",
  "members": "Aries, Scorpio",
  "en": "No fears. They undertake all enterprises with courage and confidence.",
  "ta": "கொடூரம்: மேஷம், விருச்சிகம் — அச்சமில்லை; துணிவுடனும் நம்பிக்கையுடனும் எல்லா முயற்சிகளையும் மேற்கொள்வார்.",
  "page": 108
 },
 {
  "name": "Human",
  "members": "Gemini, Virgo, Aquarius and the 1st half of Sagittarius; Libra (humane)",
  "en": "Western authors: Virgo, Sagittarius and Taurus also.",
  "ta": "மனித: மிதுனம், கன்னி, கும்பம், தனுசின் முதல் பாதி; துலாம் (மனிதநேயம்).",
  "page": 108
 },
 {
  "name": "Voice",
  "members": "Gemini, Libra, Aquarius",
  "en": "",
  "ta": "குரல்: மிதுனம், துலாம், கும்பம்.",
  "page": 108
 },
 {
  "name": "Bestial (four-legged)",
  "members": "Aries, Taurus, Leo, Capricorn, 2nd half of Sagittarius",
  "en": "",
  "ta": "நாற்கால்: மேஷம், ரிஷபம், சிம்மம், மகரம், தனுசின் இரண்டாம் பாதி.",
  "page": 109
 },
 {
  "name": "Dual",
  "members": "Gemini, Sagittarius, Pisces",
  "en": "",
  "ta": "இரட்டை: மிதுனம், தனுசு, மீனம்.",
  "page": 109
 },
 {
  "name": "Bicorporeal (double-bodied)",
  "members": "Gemini, 1st half of Sagittarius, Pisces",
  "en": "",
  "ta": "இரு உடல்: மிதுனம், தனுசின் முதல் பாதி, மீனம்.",
  "page": 109
 },
 {
  "name": "Short ascension",
  "members": "Capricorn to Gemini both inclusive (90 degrees on both sides of the vernal equinox)",
  "en": "",
  "ta": "குறுகிய உதயம்: மகரம் முதல் மிதுனம் வரை (வசந்த சமபகலின் இருபுறமும் 90°).",
  "page": 109
 },
 {
  "name": "Long ascension",
  "members": "Cancer to Sagittarius both inclusive (90 degrees on both sides of the autumnal equinox)",
  "en": "",
  "ta": "நீண்ட உதயம்: கடகம் முதல் தனுசு வரை (இலையுதிர் சமபகலின் இருபுறமும் 90°).",
  "page": 109
 }
];
const HOUSES = [
 {
  "house": 1,
  "page": 116,
  "en": "Physical stature, colour, form and shape, constitution, health, vitality and vigour, habit of thinking, natural disposition and tendencies, personality and struggle for life, success or failure in attempts. General candour, honour, dignity, prosperity, general well-being. Head and upper part of the face. People in the country, person asking the question. Virtues, longevity, age, suffering. Appropriating other's money, gambling on others' money, skin. Gains and profit to younger brother. Name, fame, reputation and the patrimony of mother. Higher studies, long journey, life in a foreign place or connection with strangers to native's children; hostel, danger to maternal uncle, demise of partner, speculation of father, neighbours to elder brother and his short journeys.",
  "ta": "உடல் அமைப்பு, நிறம், ஆரோக்கியம், உயிர்ப்பு, குணம், ஆளுமை, முயற்சியில் வெற்றி-தோல்வி, கௌரவம், நலம்; தலை, முகத்தின் மேல் பகுதி; கேட்பவர்."
 },
 {
  "house": 2,
  "page": 116,
  "en": "Money matters, fortune, profit, gain or loss, one's power and resources, worldly attainments, possessions of extrinsic value, jewellery, precious stones and metals, documents, bonds, securities, stocks and shares, promissory notes, mortgages, bank balance or negotiable or exchangeable assets. Ability to express his thoughts. Second marriage, vision or the power of observation, right eye, memory, imagination, nail, tongue, nose, teeth, cheeks and chin. Protects others, family members, law suits, extravagant or economical, loans, money lent, money borrowed, death of individual, national wealth, banking activities, revenue. Money of the querist, truth or falsehood, tongue, eyes, nails, garment, copper, diamond, gem, pearl, trade, softness of speech, perfume to support others, effort in acquisition of wealth, miserliness or liberality, oratorical ability, gold, good silver, corn, cereals, close dependent, pearls, ruby, minerals, clothes. Loss to younger brother and his changes, mother's gains, profession and success of children, rank, position, long journey, to maternal uncle, danger to partner, share of profits to partner, common disease of the native's father, purchase of a house, or and or vehicle by elder brother.",
  "ta": "பணம், அதிர்ஷ்டம், இலாப நஷ்டம், வளங்கள், நகைகள், ரத்தினம், ஆவணங்கள், பத்திரங்கள், பங்குகள், வங்கி இருப்பு; பேச்சுத் திறன்; இரண்டாம் திருமணம்; வலது கண், நினைவு, நாக்கு, பல்; குடும்பம், வழக்கு, கடன்."
 },
 {
  "house": 3,
  "page": 117,
  "en": "Mental inclination, ability, memory, intellect, inclination to study. Courage, firmness, valour, prowess and heroism. Younger brother or sister, cousins, kindred, casual acquaintance, neighbour, short travel, cycle, bus, tram, or railway. Correspondence, letter, papers, writings, accounting, mathematics, communication, post offices, letter boxes, telephone, telegraph, teleprint, television, tele-communication, radio-reports, signal, airmail, mediator, messenger, publicity officer, reporter, editor, information officer, journalist. Change of residence, restlessness, library, book-store, bargain, signature, signing contracts or agreements, rumours, carrying tales. Hands, throat, shoulder blade, collar bone, arms and nervous system. Neighbouring countries, treaties, roadside place, confusion of the mind, eating unspoiled or pure food, partition of property, female servant, edible roots and fruits.",
  "ta": "மனப்போக்கு, திறன், நினைவு, அறிவு, படிப்பு; துணிவு, வீரம்; தம்பி-தங்கை, உறவினர், அண்டை வீட்டார், குறுகிய பயணம்; கடிதம், எழுத்து, கணக்கு, தொடர்பு, தொலைபேசி, தூதர், செய்தியாளர்; இடம் மாற்றம், ஒப்பந்தக் கையெழுத்து, வதந்தி; கைகள், தொண்டை, தோள், நரம்பு மண்டலம்."
 },
 {
  "house": 4,
  "page": 117,
  "en": "Mother, one's home, residence, domestic environments, grave, private affairs, curious, secrets and secret life. Vehicles, fields, pastures, corn-fields, farms, orchards, mines, real estate, gardens, buildings, ancient dwellings, monuments and antiquities. Hereditary properties and treasures. School and collegiate. Mines, gardens, public buildings, crops, agriculture, learning, boats, oil bath, small well, water, milk, trust, false allegation, tent, pavilion, pond, mansion, art, entrance into a house, celestial food, where stolen property is kept, vedic and secret texts. Herbs and caves.",
  "ta": "தாய், வீடு, குடியிருப்பு, குடும்பச் சூழல், தனிப்பட்ட விஷயங்கள், இரகசியம்; வாகனம், வயல், தோட்டம், சுரங்கம், நிலம்-கட்டிடம், பழைய வீடுகள், பாரம்பரிய சொத்து; பள்ளி-கல்லூரி, கல்வி, படகு, நீர், பால், கிணறு; திருடுபோன பொருள் வைக்கப்படும் இடம்."
 },
 {
  "house": 5,
  "page": 117,
  "en": "Progeny, inclinations, pleasure; society, with tastes and fancies, artistic talents and gains, to wife or business partner's luck, recreation, entertainment, amusement, sports, romance and similar interests, games, cinema, opera, drama, music, dance, banquets, merriment and amusements. Cards, crossword puzzles, dice, horse, shares. Lottery, gambling or betting and stock exchange. Love affairs, courtship and licentiousness, kidnap, rape. Envoys, ambassadors, banquet. Good morals, mechanical art, discretion, discrimination between virtue and sin, chanting of vedic hymns, religious mindedness, profound learning and wisdom, enormous riches, festive occasion, intense satisfaction, liaisons with courtesans. Chanting of mantras and spiritual practice.",
  "ta": "குழந்தைகள், விருப்பங்கள், இன்பம்; சமூகம், கலைத் திறன், மனைவி/கூட்டாளியின் அதிர்ஷ்டம், பொழுதுபோக்கு, விளையாட்டு, காதல்; சீட்டு, குதிரை, பங்கு, லாட்டரி, சூதாட்டம்; காதல் விவகாரம்; ஒழுக்கம், பாகுபாடு, மந்திரம், ஆன்மிகப் பயிற்சி, ஆழ்ந்த கல்வி."
 },
 {
  "house": 6,
  "page": 118,
  "en": "'House of sickness'. Disease, nursing, food, dietary habits, service exhaustion, employees, subordinates or servants, debt or borrowing, pet animals, small cattle, tenants, enmity, dress, and hygiene, sanitation, herbs, food and clothing. Favourable result in competition. Obstacle in any undertaking, maternal uncle, insanity, enmity, miserliness, intense anguish, incessant eye trouble, untimely meals, theft, calamity, prison house. Industries, sanitation and public health. Purchase or sale of conveyance, by younger brother or sister, short journeys of the mother, the bank position and profession of the first issue, and his family, loss to the partner, investment or purchases made by the partner, the secret enemies of the partner, separation from the partner. Occupation or business of the father. Danger to one's elder brother.",
  "ta": "நோய் வீடு: நோய், பணிவிடை, உணவு, உழைப்புச் சோர்வு, ஊழியர்கள், வேலையாட்கள், கடன், வளர்ப்பு விலங்குகள், குத்தகைதாரர்கள், பகை, சுகாதாரம்; போட்டியில் வெற்றி; முயற்சியில் தடை, மாமா, மனநோய், கஞ்சத்தனம், கண் தொல்லை, திருட்டு, சிறை; தொழில்கள்."
 },
 {
  "house": 7,
  "page": 118,
  "en": "'House of union or earthy ties', legal bondage, partner in trade, those with whom the native transacts, litigation, duels. Mix up freely in society. Fines, divorces, legal bondage, contracts, break of journey. Influence in foreign countries, honour and reputation achieved there, danger to longevity. Recovery of lost property, describes the thief, international relationships, arbitrations, war and foreign affairs, international trade, public meetings, open warfare. Self-acquisition of the native's servant, mother's immovable property, vehicle, adopted child. Secret enemy's danger, difficulties, death, associates and friends of father, partnership with his father's friend.",
  "ta": "இணைப்பு வீடு: சட்டப்படி பிணைப்பு, வணிகக் கூட்டாளி, யாருடன் ஒருவர் பரிமாற்றம் செய்கிறாரோ அவர், வழக்கு, சண்டை; சமூகத்தில் கலத்தல்; அபராதம், விவாகரத்து, ஒப்பந்தம், பயண இடைவெளி; வெளிநாட்டு செல்வாக்கு; இழந்த பொருள் மீட்பு, திருடனின் விளக்கம், மத்தியஸ்தம், போர், பொதுக்கூட்டம்; ஆயுளுக்கு ஆபத்து."
 },
 {
  "house": 8,
  "page": 118,
  "en": "Longevity or span of life, 'House of death', inheritance, legacies, wills, insurance, gratuity, disincarnation, death, natural or unnatural, drowning, fire, accident or suicide. Mystery and misery, misfortune, sorrow and strife, worries and privations, delay and dejection, disappointment and defeat, loss and obstruction, blame and ill-repute, accident, danger from enemies. Wrong actions, crossing river, theft, robbery, siege of a fort, fighting, dowry, unearned wealth, share of profit. Surgeons, medical officers, health inspectors, slaughter houses, butchers, corners and so on. Public mortality, the death rate, suicide, serious accidents, infection, flood, fire, famines, disease, earthquake, national calamity or grief, financial relation with foreign countries, the nation's exports and imports, debts due to foreign countries, surrender or loss, territory of another country, public loans, debts and interest rates, deficit budget, estate duties and public sales. Insurance, money of the deceased. Difficulties in journey, sufferings caused by enemies, corruption, mother may gain by way of lottery, prize bond or in speculation.",
  "ta": "ஆயுள், மரண வீடு, உயில், மரபுச் சொத்து, காப்பீடு, இயற்கை-இயற்கையற்ற மரணம், மூழ்குதல், தீ, விபத்து, தற்கொலை; மர்மம், துன்பம், துரதிர்ஷ்டம், தாமதம், தோல்வி, இழப்பு, அவப்பெயர்; தவறான செயல், திருட்டு, சண்டை, வரதட்சணை, உழைக்காத செல்வம்; அறுவை மருத்துவர்கள்."
 },
 {
  "house": 9,
  "page": 119,
  "en": "Faith, wisdom and divine worship, fortune, philosophy, religious and philosophical beliefs, devoted, orthodox, methodical meditation, intuition and forethought, temples, churches, mosques, spiritual welfare, pilgrimage to holy places, circular reservoirs, sacrifices and charity, research, invention, discovery, exploration, the father, spiritual preceptor or guru of the children. Law, legal arbitration, teaching, dharma, dreams and visions, communications with spirits, long journeys, sea voyage, air travel. Publishing books of intrinsic value, international affairs, reverence and devotion to God, communication, sea voyage, shipping, air and land travel, legal departments, matters relating to religion, temples, churches, science. Universities, emigration and immigration, import and export of the nation, national trade, shortwave radio, long-distance communications, cables and wireless. Charity, visits to holy places, vedic sacrifice, purity of mind, penance, good conduct, mythology, horses, elephants, buffaloes, coronation hall, circulation of money. Wells, lakes, tanks, water-sheds, temples, monetary vows, pilgrimage. Short travels of the wife, servant's vehicle and landed property, child's speculative benefits and pleasures. Mother's illness, younger brother's wife, friends to the elder brother.",
  "ta": "நம்பிக்கை, ஞானம், தெய்வ வழிபாடு, அதிர்ஷ்டம், தத்துவம், கோயில், புனிதப் பயணம், தானம், ஆராய்ச்சி, கண்டுபிடிப்பு; தந்தை, குரு; சட்டம், கற்பித்தல், தர்மம், கனவு; நீண்ட பயணம், கடல்-வான் பயணம்; பல்கலைக்கழகம், குடியேற்றம், இறக்குமதி-ஏற்றுமதி."
 },
 {
  "house": 10,
  "page": 120,
  "en": "Lordship, honour, dignity and public esteem, name and fame, power and prestige, credit and conduct, success and status, rank and renown, respect and reputation, ambition and authority. Worldly activities, responsibilities. Permanency, promotion, advancement, appointment. Profession, occupation or business. 'Karmasthana'. Last rites, to one's parents, religious functions, employer, superior, master, judge and the Government. Pilgrimage to holy places. Honour from Government, honourable living, permanence, pre-eminence, seal of authority, horse riding, athletics, service, sacrifice and the like, agriculture, doctor, name, fame, depositing treasure, talisman, morality, medicine, thigh, prosperity, adopted son, teaching, intellectual command, mantras. Rain, retirement from the world, one's valour, prowess, learning and fame, substances taken away by the thieves, judges, stewards, president in the race clubs, aristocracy of the owners of the horses and the trainers. Head of the State, national leaders, national trade, father's self-acquisition, maraka house to both father and mother, permanent possessions or conveyance of the business, or married partner, pleasurable pursuits of servants, ill-health to children, debts incurred by them, litigation, election, danger to younger brother, mother's opponents, loss and secret inimical activities to one's elder brother.",
  "ta": "அதிகாரம், கௌரவம், பொது மதிப்பு, புகழ், பதவி, இலட்சியம்; நிலைத்தன்மை, பதவி உயர்வு, நியமனம்; தொழில் (கர்மஸ்தானம்); பெற்றோருக்கு இறுதிச் சடங்கு; முதலாளி, மேலதிகாரி, நீதிபதி, அரசு; அரசு மரியாதை; விவசாயம், மருத்துவர்; நாட்டுத் தலைவர்கள்."
 },
 {
  "house": 11,
  "page": 120,
  "en": "House of friends, society, community, favourites, flatterers, admirers, associates, advisers, adherents, supporters, well-wishers, close acquaintances, hopes, wishes and aspirations and their realisation. Success in all undertakings, foreign collaboration, election, litigation, speculation, writings, health. Profit, incoming wealth. Principal and interest, pleasure, prosperity, profit, progress in attempts, peace after achievement of aspirations, partnership and permanent tie of friendship, reformative, unconventional activities. Elder brother, cure of the disease, 'Trusts'. Left ear, the right foot, the left hand and the two shanks, prosperity and wealth. One's influence, eldest brother, paternal uncle, devotion to God, luck, easy gains, brother-in-law, mother's longevity, the knee, happy news, ministership, dawn of fortune. Badhakasthana for persons born in movable sign. Knowledge, income, horses, elephants, vehicle, chariots, furniture, ornaments, swinging cradles, decoration, sovereign, money, son-in-law, daughter-in-law. Jewels, parliament or equivalent legislative branches, Lok Sabha, Lower House of State Assemblies, Corporations, Municipal Bodies, District Boards, Panchayats. Government policies and planning, international friendships and exchange of amenities, companies, stores, associations, societies, in horse racing the committee under the control of the stewards. Number of the winner is shown by this house. Government loans, electric companies, gas, museum, agriculture, estate, irrigation, silk. Hopes and desires, father's short journeys, gains through correspondence, birth of children, partner's pleasurable pursuits, speculation. Recovery from ill-health and victory over enemies. Children's competitors, danger, younger brother, long journeys. Freedom from misery and pain, discharge from hospital.",
  "ta": "நண்பர்கள், சமூகம், ஆதரவாளர்கள், ஆலோசகர்கள், ஆசைகள், நம்பிக்கைகள், அவற்றின் நிறைவு; எல்லா முயற்சிகளிலும் வெற்றி, தேர்தல், ஊகம்; லாபம், வரும் செல்வம்; மூத்த சகோதரர்; நோய் நீங்குதல்; நிலையான நட்பு; இடம்பெயர்ந்தோருக்கு பாதகஸ்தானம் (சர ராசி); நாடாளுமன்றம், நிறுவனங்கள், சங்கங்கள்; மருத்துவமனையிலிருந்து விடுதலை."
 },
 {
  "house": 12,
  "page": 121,
  "en": "Loss and impediments, restraint and limitation, waste and extravagance, expenses, drudgery and deception. Purchases, investments, donations, charity and association with philanthropic institution. Separation from family and going to a place far away, sorrow and sin, sedition and segregation, obstacles and impediments, misery and misfortune, poverty and persecution, intrigue and imprisonment, secret toil of mind. Fear, inferiority complex, solitude, secret, silent suffering and self-undoing. Greatest self-sacrifice, unselfish deeds.",
  "ta": "இழப்பு, தடை, கட்டுப்பாடு, வீண் செலவு, உழைப்புச் சுமை, ஏமாற்றம்; கொள்முதல், முதலீடு, நன்கொடை, தர்மம்; குடும்பப் பிரிவு, தொலைதூரம் செல்லுதல், துக்கம், பாவம்; தடைகள், வறுமை, சிறைவாசம், மனத்தின் இரகசிய உழைப்பு; அச்சம், தாழ்வு மனப்பான்மை, தனிமை, பெரிய தியாகம், சுயநலமற்ற செயல்கள்."
 }
];

module.exports = { SIGNS, CATEGORIES, CLASSES, HOUSES };
