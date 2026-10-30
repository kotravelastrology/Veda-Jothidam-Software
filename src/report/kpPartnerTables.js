/**
 * The physical features and characteristic of the partner by the planet and sign of the 7th cusp sub-lord, from K.S. Krishnamurti, Reader IV
 * "Marriage and Married Life" (corpus C32), printed pp.86-97 (PDF page = printed + 3): "TO FIND OUT THE PHYSICAL FEATURE AND CHARACTERISTIC OF THE PARTNER".
 * Read on the page images 2026-10-26. Seven planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) x twelve signs, each entry as printed (`en`, the record)
 * with a Tamil rendering (`ta`) written from it. The data block is long; edit an entry in place and keep its page number.
 *
 * Printed as it stands in the book, including: Jupiter in Aquarius is "Below average, tall" (both heights are printed); the Sun in Cancer carries the author's
 * warning against asking about the partner's looks while the Sun transits Cancer (15 July to 17 August); the Mars in Gemini and Mars in Pisces entries carry the
 * author's anecdotes, which the Tamil renderings only mention.
 */
const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

/** TABLE[planet][signIndex] = { page, en, ta } */
const TABLE = {
 "Sun": [
  {
   "page": 86,
   "en": "Middle statue, strong and well-made, complexion good, full eyes; bold, noble, will assert his right, comes out victorious, proud, social success.",
   "ta": "நடுத்தர உயரம் (நூலில் \"statue\"), வலிமையான நன்கு அமைந்த உடல், நல்ல நிறம், நிறைந்த கண்கள்; துணிவு, உயர்குணம், தன் உரிமையை நிலைநாட்டுவார், வெற்றி பெறுவார், பெருமிதம், சமூக வெற்றி."
  },
  {
   "page": 87,
   "en": "Short and well set. Not very fair, broad mouth, broad face, strong sportsman or athletic, over-confident, not proud, good debater, argues well and wins.",
   "ta": "குட்டை, நன்கு அமைந்த உடல். மிகவும் வெள்ளையல்ல, அகன்ற வாய், அகன்ற முகம், வலிமையான விளையாட்டு வீரர்/தடகளர், அதீத தன்னம்பிக்கை, செருக்கு இல்லை, நல்ல விவாதி, நன்கு வாதாடி வெல்வார்."
  },
  {
   "page": 87,
   "en": "Above average in height, well proportioned body, moderate complexion, long nose, piercing eye, most courteous, tactful, accommodative, can be influenced by others, pleasing manners.",
   "ta": "சராசரிக்கு மேல் உயரம், சமமான உடல், நடுத்தர நிறம், நீண்ட மூக்கு, ஊடுருவும் கண், மிகுந்த மரியாதை, சாமர்த்தியம், இணக்கம், பிறரால் செல்வாக்குக்கு உட்படுவார், இனிய பழக்கம்."
  },
  {
   "page": 87,
   "en": "Short stature, repulsive face, not beautiful. Therefore do not approach any astrologer to know about the features of your would-be wife or husband when Sun is transitting in Cancer. If by chance it happens to be the sub-lord of the 7th cusp, he had to predict the distasteful ones. So avoid between 15th July and 17th August. Temperament good, harmless, cheerful, fond of other sex (within himself), admires music, dance, sports, lazy, does not like to work.",
   "ta": "குட்டை உயரம், அருவருக்கத்தக்க முகம், அழகில்லை. (ஆசிரியர் எச்சரிக்கை: சூரியன் கடகத்தில் சஞ்சரிக்கும்போது — 15 ஜூலை முதல் 17 ஆகஸ்ட் வரை — வருங்கால மனைவி/கணவரின் தோற்றத்தைப் பற்றி ஜோதிடரிடம் கேட்க வேண்டாம்; 7-ஆம் கஸ்ப் உப அதிபதி சூரியனாக இருந்தால் ஜோதிடர் விரும்பத்தகாததைச் சொல்ல வேண்டியிருக்கும்.) குணம் நல்லது, தீங்கற்றவர், மகிழ்ச்சியானவர், எதிர்பாலினத்தில் விருப்பம் (தனக்குள்), இசை-நடனம்-விளையாட்டை மெச்சுவார், சோம்பல், வேலை பிடிக்காது."
  },
  {
   "page": 87,
   "en": "Strong well-built, moderate complexion, big eyes, round and big face, most faithful and reliable, very punctual always, fair and just in his actions, ambitious and successful.",
   "ta": "வலிமையான நன்கு கட்டிய உடல், நடுத்தர நிறம், பெரிய கண்கள், உருண்டை பெரிய முகம், மிகுந்த நம்பிக்கைக்குரியவர், நேரம் தவறாதவர், செயலில் நியாயமும் நேர்மையும், இலட்சியம், வெற்றி."
  },
  {
   "page": 87,
   "en": "Tall person with slender stature and good complexion, very dark hair, fond of music and ever singing, always smiling and never provoking, cheerful, pleasant, spends much time on recreations.",
   "ta": "உயரமான, மெலிந்த உடல், நல்ல நிறம், மிகக் கருமையான முடி, இசையில் விருப்பம், எப்போதும் பாடுவார், எப்போதும் புன்னகை, வம்பு செய்யாதவர், மகிழ்ச்சி, இனிமை, பொழுதுபோக்கில் அதிக நேரம் செலவிடுவார்."
  },
  {
   "page": 87,
   "en": "Tall, straight upright body. Big eyes, thin hair, beautiful, never bold but ever talking about war, riot, etc., not much reliable, weak in his attachments and will find difficult to speak truth (For whom does the beauty appeal. Reject such a partner).",
   "ta": "உயரம், நேராக நிமிர்ந்த உடல். பெரிய கண்கள், மெல்லிய முடி, அழகு, துணிவில்லை ஆனால் எப்போதும் போர்-கலவரம் பற்றிப் பேசுவார், நம்பகம் குறைவு, பற்றுகளில் பலவீனம், உண்மை பேசக் கடினப்படுவார். (ஆசிரியர்: அழகு யாரைக் கவரும்? அத்தகைய துணையை நிராகரிக்கவும்.)"
  },
  {
   "page": 87,
   "en": "Square built, fleshy, full growth, broad face, moderate complexion, ingenious, very clever, discoverer, very brisk, ambitious, never accepts defeat or consider anybody as his or her equal. Fortunate.",
   "ta": "சதுரமான உடல், சதைப்பற்று, முழு வளர்ச்சி, அகன்ற முகம், நடுத்தர நிறம், புத்திசாலி, மிகக் கெட்டிக்காரர், கண்டுபிடிப்பாளர், மிகச் சுறுசுறுப்பு, இலட்சியம், தோல்வியை ஏற்க மாட்டார், யாரையும் தனக்குச் சமமாகக் கருத மாட்டார். அதிர்ஷ்டம்."
  },
  {
   "page": 87,
   "en": "Tall, beautiful, body well proportioned, face oval, ever-estimate one's ability, austere, severe, plans for big thing.",
   "ta": "உயரம், அழகு, சமமான உடல், நீள்வட்ட முகம், தன் திறனை எப்போதும் மதிப்பிடுவார், கட்டுப்பாடு, கடுமை, பெரிய காரியங்களுக்குத் திட்டமிடுவார்."
  },
  {
   "page": 88,
   "en": "Thin built, lean, wiry, tall, long nose, soft hair, sickly appearance, pleasing manners, nasty occasionally, makes many friends, commands others goodwill.",
   "ta": "மெலிந்த உடல், ஒல்லி, நரம்பு போன்ற உடல், உயரம், நீண்ட மூக்கு, மென்மையான முடி, நோயாளித் தோற்றம், இனிய பழக்கம், சில நேரம் அருவருப்பாக நடப்பார், பல நண்பர்கள், பிறரின் நல்லெண்ணத்தைப் பெறுவார்."
  },
  {
   "page": 88,
   "en": "Tall, well made, round face, good complexion, tolerably good disposition, never deceitful, proud, ostentatious.",
   "ta": "உயரம், நன்கு அமைந்த உடல், உருண்டை முகம், நல்ல நிறம், பொறுக்கத்தக்க நல்ல குணம், ஏமாற்ற மாட்டார், பெருமிதம், ஆடம்பரம்."
  },
  {
   "page": 88,
   "en": "Short, stout, protruded eyes, plumpy body, round face, unjust, partial, fond of pleasures, extravagant, hence spoils himself, unfit to be a referee in the sports and games.",
   "ta": "குட்டை, பருமன், துருத்திய கண்கள், பூசிய உடல், உருண்டை முகம், நீதியற்றவர், பாரபட்சம், இன்பத்தில் விருப்பம், ஊதாரி, அதனால் தன்னைக் கெடுத்துக்கொள்வார்; விளையாட்டில் நடுவராக இருக்கத் தகுதியில்லை."
  }
 ],
 "Moon": [
  {
   "page": 88,
   "en": "Fleshy and plumpy, round face, fair complexion, adamant, aggressive, argumentative, avaricious, atrocious, aspiring, ambitious, authoritative etc.",
   "ta": "சதைப்பற்று, பூசிய உடல், உருண்டை முகம், வெள்ளை நிறம், பிடிவாதம், ஆக்ரோஷம், வாதிடுதல், பேராசை, கொடுமை, உயர ஆசை, இலட்சியம், அதிகார குணம் முதலியன."
  },
  {
   "page": 88,
   "en": "Strong well-built body, just below average in height, good looking, fair complexion, polite, modest, moderate fair, honest, helpful, pleasing.",
   "ta": "வலிமையான நன்கு கட்டிய உடல், சராசரிக்குச் சற்றுக் குறைந்த உயரம், அழகான தோற்றம், வெள்ளை நிறம், பணிவு, அடக்கம், நடுத்தர நியாயம், நேர்மை, உதவும் குணம், இனிமை."
  },
  {
   "page": 88,
   "en": "Tall, well built, upright, good complexion, ingenious, unsteady, lacks decision, not fortunate in profession.",
   "ta": "உயரம், நன்கு கட்டிய, நிமிர்ந்த உடல், நல்ல நிறம், புத்திசாலி, நிலையற்றவர், முடிவெடுக்கும் திறன் குறைவு, தொழிலில் அதிர்ஷ்டம் இல்லை."
  },
  {
   "page": 88,
   "en": "Average height, well built, little fleshy person, rounded face, moderate complexion, can be easily influenced, changeable, pleasant manners, harmless, cares more for peace, fond of company, fortunate, fond of traveling.",
   "ta": "சராசரி உயரம், நன்கு கட்டிய, சற்றுச் சதைப்பற்றுள்ள உடல், உருண்ட முகம், நடுத்தர நிறம், எளிதில் செல்வாக்குக்கு உட்படுவார், மாறும் குணம், இனிய பழக்கம், தீங்கற்றவர், அமைதியை விரும்புவார், கூட்டத்தில் விருப்பம், அதிர்ஷ்டம், பயணத்தில் விருப்பம்."
  },
  {
   "page": 88,
   "en": "Well built, average height, moderate complexion, big eyes, proud, ambitious, never desires to be submissive and serve as a subordinate, independent and unfortunate.",
   "ta": "நன்கு கட்டிய உடல், சராசரி உயரம், நடுத்தர நிறம், பெரிய கண்கள், பெருமிதம், இலட்சியம், அடங்கிப் பணியாளராக இருக்க விரும்ப மாட்டார், சுதந்திரம், அதிர்ஷ்டமில்லை."
  },
  {
   "page": 88,
   "en": "Tall, face oval, good complexion, very clever, reserved, gloomy, unlucky, depressed, dejection.",
   "ta": "உயரம், நீள்வட்ட முகம், நல்ல நிறம், மிகக் கெட்டிக்காரர், ஒதுங்கியவர், இருண்ட மனநிலை, துரதிர்ஷ்டம், மனச்சோர்வு, சோகம்."
  },
  {
   "page": 88,
   "en": "Tall good personality, beautiful, good complexion, humorous, witty pleasant, ever-smiling, fond of amusements, cares more for the appreciation from the other sex and be happy over it, not always fortunate.",
   "ta": "உயரம், நல்ல ஆளுமை, அழகு, நல்ல நிறம், நகைச்சுவை, சாமர்த்தியப் பேச்சு, இனிமை, எப்போதும் புன்னகை, பொழுதுபோக்கில் விருப்பம், எதிர்பாலினத்தின் பாராட்டை விரும்பி மகிழ்வார், எப்போதும் அதிர்ஷ்டம் அல்ல."
  },
  {
   "page": 88,
   "en": "Below average in height, stout, complexion not good, most impulsive and irregular, not a desirable partner always and these will be found in the partner.",
   "ta": "சராசரிக்குக் குறைந்த உயரம், பருமன், நிறம் நன்றில்லை, மிகுந்த உணர்ச்சிவசம், ஒழுங்கின்மை, எப்போதும் விரும்பத்தக்க துணை அல்ல; இவை துணையிடம் காணப்படும்."
  },
  {
   "page": 89,
   "en": "Beautiful, honest, true, person with well-built body and oval face, generous hasty and passionate, lucky.",
   "ta": "அழகு, நேர்மை, உண்மை, நன்கு கட்டிய உடல், நீள்வட்ட முகம், தாராளம், அவசரம், ஆர்வம், அதிர்ஷ்டசாலி."
  },
  {
   "page": 89,
   "en": "Thin weak body, complexion not good, health poor, tall-busy hair growth, most dull, inactive, pessimistic, selfish, idiot, even friends and youngsters ignore him.",
   "ta": "மெலிந்த பலவீன உடல், நிறம் நன்றில்லை, ஆரோக்கியம் குறைவு, உயரம், அடர்ந்த முடி, மிக மந்தம், செயலற்றவர், நம்பிக்கையின்மை, சுயநலம், முட்டாள்; நண்பர்களும் இளையவர்களும் கூட புறக்கணிப்பார்கள்."
  },
  {
   "page": 89,
   "en": "Moderate in height, well made, good complexion, very intelligent, fit to carry on research, most courteous and never offensive, studious, never guilty of any crime.",
   "ta": "நடுத்தர உயரம், நன்கு அமைந்த உடல், நல்ல நிறம், மிகுந்த அறிவு, ஆராய்ச்சிக்குத் தகுதி, மிகுந்த மரியாதை, புண்படுத்த மாட்டார், படிப்பாளி, குற்றம் செய்யாதவர்."
  },
  {
   "page": 89,
   "en": "Below average, plumpy, fleshy, fat bloated face, like a pumpkin potbellied, mostly eyes closed by the flesh and appearing like sleeping person, most inactive, active only for pleasure. Unsteady, inconstant and unfortunate.",
   "ta": "சராசரிக்குக் குறைவு, பூசிய சதைப்பற்றான உடல், வீங்கிய பருத்த முகம், பூசணிக்காய் போன்ற தொப்பை, சதையால் கண்கள் மூடியதுபோல் தூங்குபவர் போலத் தோன்றும், மிகச் செயலற்றவர், இன்பத்துக்கு மட்டுமே சுறுசுறுப்பு. நிலையற்றவர், மாறுபவர், துரதிர்ஷ்டம்."
  }
 ],
 "Mars": [
  {
   "page": 89,
   "en": "Moderate height, well built, large bones, curling hair, dark complexion, very bold, rash, undaunted, over-confident, very proud, quarrelsome, ever gains.",
   "ta": "நடுத்தர உயரம், நன்கு கட்டிய, பெரிய எலும்புகள், சுருள் முடி, கருமை நிறம், மிகுந்த துணிவு, அவசரம், அஞ்சாமை, அதீத தன்னம்பிக்கை, மிகுந்த செருக்கு, சண்டை, எப்போதும் ஆதாயம்."
  },
  {
   "page": 89,
   "en": "Moderate height, strong and well-built rough and coarse hair, moderate complexion, broad mouth and face, self-indulgence, arrogant, speculative, unfortunate.",
   "ta": "நடுத்தர உயரம், வலிமையான நன்கு கட்டிய உடல், கரடுமுரடான முடி, நடுத்தர நிறம், அகன்ற வாய்-முகம், தன்னிச்சை இன்பம், ஆணவம், ஊக வணிகம், துரதிர்ஷ்டம்."
  },
  {
   "page": 89,
   "en": "Very tall, complexion not good, well-proportioned body, always active, mischievous, restless, clever, cunning, changes residence often, never repays loan (and the author's story of the grandchild's rupee note: Mars in Gemini brings out such a partner; further a swindler).",
   "ta": "மிக உயரம், நிறம் நன்றில்லை, சமமான உடல், எப்போதும் சுறுசுறுப்பு, குறும்பு, அமைதியின்மை, கெட்டிக்காரர், தந்திரம், அடிக்கடி வீடு மாறுவார், கடனைத் திருப்ப மாட்டார் (ஆசிரியர் பேரக்குழந்தையின் ரூபாய் நோட்டுக் கதையைச் சொல்கிறார்); மேலும் மோசடிக்காரர்."
  },
  {
   "page": 89,
   "en": "Short, dusky complexion, less of hair, crooked body, unreliable, unfortunate, unhealthy practices, henchman, menial, incapable of doing honourable work.",
   "ta": "குட்டை, கருமை கலந்த நிறம், முடி குறைவு, வளைந்த உடல், நம்பகமற்றவர், துரதிர்ஷ்டம், ஆரோக்கியமற்ற பழக்கங்கள், அடியாள், கீழ்நிலைப் பணியாளர், கௌரவமான வேலை செய்யத் தகுதியற்றவர்."
  },
  {
   "page": 90,
   "en": "Tall, well-built, oval face, dark complexion, stout hands and legs, yet very brisk and active, fond of firing, shooting sports, riding, quarrelsome, likes to be in Police or military, dresses nicely.",
   "ta": "உயரம், நன்கு கட்டிய, நீள்வட்ட முகம், கருமை நிறம், பருத்த கை-கால்கள், ஆனால் மிகச் சுறுசுறுப்பு, துப்பாக்கி-சுடுதல் விளையாட்டு, குதிரை சவாரியில் விருப்பம், சண்டை, காவல்-ராணுவத்தில் இருக்க விரும்புவார், நன்றாக உடையணிவார்."
  },
  {
   "page": 90,
   "en": "Moderate height, well-built body, thick nose, dark complexion, hasty, impulsive, proud, passionate, vindictive retaliates, ruthless, malevolent.",
   "ta": "நடுத்தர உயரம், நன்கு கட்டிய உடல், தடித்த மூக்கு, கருமை நிறம், அவசரம், உணர்ச்சிவசம், செருக்கு, ஆர்வம், பழிவாங்கும் குணம், இரக்கமற்றவர், தீய எண்ணம்."
  },
  {
   "page": 90,
   "en": "Tall, beautiful, oval face, red complexion, active, alert, hopeful and cheerful, self-boasting, lofty, haughty, vain, glorious, dresses well, attached to other sex.",
   "ta": "உயரம், அழகு, நீள்வட்ட முகம், சிவப்பு நிறம், சுறுசுறுப்பு, விழிப்பு, நம்பிக்கை, மகிழ்ச்சி, தற்பெருமை, உயர்வு மனப்பான்மை, செருக்கு, வீண்பெருமை, புகழ், நன்றாக உடையணிவார், எதிர்பாலினத்தில் பற்று."
  },
  {
   "page": 90,
   "en": "Stout, bulky, dark complexion, curling hair, broad face, rash, not sociable, vindictive, revengeful, fond of disputes and quarrel, proud, haughty, very intelligent.",
   "ta": "பருமன், பெரிய உடல், கருமை நிறம், சுருள் முடி, அகன்ற முகம், அவசரம், பழகுவதில்லை, பழிவாங்கும் குணம், தகராறு-சண்டையில் விருப்பம், செருக்கு, அகங்காரம், மிகுந்த அறிவு."
  },
  {
   "page": 90,
   "en": "Tall, well-proportioned body, red complexion, oval face, piercing eyes, hopeful, jovial, jubilant, cheerful, quick, speedy, bold talkative.",
   "ta": "உயரம், சமமான உடல், சிவப்பு நிறம், நீள்வட்ட முகம், ஊடுருவும் கண்கள், நம்பிக்கை, கலகலப்பு, உற்சாகம், மகிழ்ச்சி, விரைவு, துணிவான பேச்சு."
  },
  {
   "page": 90,
   "en": "Short, lean, thin face, dark complexion, witty, humourous, intelligent, lucky, pushy and successful.",
   "ta": "குட்டை, ஒல்லி, மெலிந்த முகம், கருமை நிறம், சாமர்த்தியம், நகைச்சுவை, அறிவு, அதிர்ஷ்டம், முன்னேற்றம் தேடுபவர், வெற்றி."
  },
  {
   "page": 90,
   "en": "Well built body, good complexion, fair and buoyant, a good debater, argues, fortune average only.",
   "ta": "நன்கு கட்டிய உடல், நல்ல நிறம், நேர்மை, உற்சாகம், நல்ல விவாதி, வாதிடுவார், அதிர்ஷ்டம் சராசரி மட்டுமே."
  },
  {
   "page": 90,
   "en": "Below average height, dark complexion, not beautiful, dirty look, dull, idiot, self-indulgent, idle, careless, unfortunate. (The author's story: such an idiot will be the partner if the sub-lord of the 7th cusp at the time of judgment is Mars and it was occupying Pisces.)",
   "ta": "சராசரிக்குக் குறைந்த உயரம், கருமை நிறம், அழகில்லை, அழுக்கான தோற்றம், மந்தம், முட்டாள், தன்னிச்சை இன்பம், சோம்பல், கவனக்குறைவு, துரதிர்ஷ்டம். (ஆசிரியர் ஒரு கதையுடன் சொல்கிறார்: தீர்ப்பு நேரத்தில் 7-ஆம் கஸ்ப் உப அதிபதி மீனத்தில் நிற்கும் செவ்வாயாக இருந்தால் இத்தகைய துணை வரும்.)"
  }
 ],
 "Mercury": [
  {
   "page": 91,
   "en": "Moderate in height and stature, thin body, face not round but oval, hair not black but brown, complexion not fair but dull, very quick in thinking and also while speaking, expressive, liberal, inventive, impulsive, clever, studious, writer, not methodical, nor orderly.",
   "ta": "நடுத்தர உயரம், மெலிந்த உடல், உருண்டையல்ல நீள்வட்ட முகம், கருப்பல்ல பழுப்பு முடி, வெள்ளையல்ல மங்கிய நிறம், சிந்தனையிலும் பேச்சிலும் மிக விரைவு, வெளிப்படையானவர், தாராளம், கண்டுபிடிப்பு, உணர்ச்சிவசம், கெட்டிக்காரர், படிப்பாளி, எழுத்தாளர், முறையோ ஒழுங்கோ இல்லாதவர்."
  },
  {
   "page": 91,
   "en": "Stout body, strong, good health, black complexion. Short and thick hair, a little lazy, happy disposition, fond of opposite sex, recreation, artist, determined, perseverance, diplomatic, likes and dislikes, efforts to accumulate wealth.",
   "ta": "பருமனான வலிமையான உடல், நல்ல ஆரோக்கியம், கருமை நிறம். குட்டையான அடர்ந்த முடி, சற்றுச் சோம்பல், மகிழ்ச்சியான குணம், எதிர்பாலினம்-பொழுதுபோக்கில் விருப்பம், கலைஞர், உறுதி, விடாமுயற்சி, இராஜதந்திரம், விருப்பு-வெறுப்பு, செல்வம் சேர்க்க முயற்சி."
  },
  {
   "page": 91,
   "en": "Tall, well built, brown hair, complexion good, intelligent, orator, clever, lawyer or agent, inventive, resourceful, generous, good humored, changeful, speculative, studious, versatile.",
   "ta": "உயரம், நன்கு கட்டிய உடல், பழுப்பு முடி, நல்ல நிறம், அறிவு, பேச்சாளர், கெட்டிக்காரர், வழக்கறிஞர் அல்லது முகவர், கண்டுபிடிப்பாளர், சமயோசிதம், தாராளம், நகைச்சுவை, மாறும் குணம், ஊக வணிகம், படிப்பாளி, பல துறை வல்லுநர்."
  },
  {
   "page": 91,
   "en": "Short, stout, complexion not good, eyes small, nose sharp, hair dark, ever variable, never steady, little lazy, tactful, faithful much of retentive power, reasonable, opinion, sociable, disposition, cares for pleasure, parties picnics.",
   "ta": "குட்டை, பருமன், நிறம் நன்றில்லை, சிறிய கண்கள், கூர்மையான மூக்கு, கருமையான முடி, எப்போதும் மாறுபவர், நிலையற்றவர், சற்றுச் சோம்பல், சாமர்த்தியம், விசுவாசம், நல்ல நினைவாற்றல், நியாயம், கருத்து, பழகும் குணம், இன்பத்தில் அக்கறை, விருந்து-உல்லாசப் பயணம்."
  },
  {
   "page": 91,
   "en": "Robust health, weak body, good stature, dark complexion, brown hair, round face, broad eyes, persistent quick tempered, kind hearted, ambitious, intuition, organising capacity, music, drama, arts, do not take such drugs which would affect the heart.",
   "ta": "உறுதியான ஆரோக்கியம் ஆனால் பலவீன உடல், நல்ல உயரம், கருமை நிறம், பழுப்பு முடி, உருண்டை முகம், அகன்ற கண்கள், விடாப்பிடி, விரைவில் கோபம், இரக்க மனம், இலட்சியம், உள்ளுணர்வு, ஒழுங்கமைக்கும் திறன், இசை-நாடகம்-கலை; இதயத்தைப் பாதிக்கும் மருந்துகளை எடுக்கக் கூடாது."
  },
  {
   "page": 91,
   "en": "Tall, lean, brown hair, complexion not attractive, very intelligent, cautious, practical, prudent, intuitive, scholar, good writer, well informed and wide awake worker, investigation in occult.",
   "ta": "உயரம், ஒல்லி, பழுப்பு முடி, கவர்ச்சியற்ற நிறம், மிகுந்த அறிவு, எச்சரிக்கை, நடைமுறை அறிவு, விவேகம், உள்ளுணர்வு, பண்டிதர், நல்ல எழுத்தாளர், நன்கு அறிந்தவர், விழிப்பான உழைப்பாளி, மறைபொருள் ஆராய்ச்சி."
  },
  {
   "page": 92,
   "en": "Tall, strong but thin brown hair, moderate complexion, broad outlook, dispassionate. For any matter computes and contrasts, good judge, artist, invention, good in mathematics, social life.",
   "ta": "உயரம், வலிமை, மெல்லிய பழுப்பு முடி, நடுத்தர நிறம், அகன்ற பார்வை, உணர்ச்சியற்ற நடுநிலை. எதையும் கணக்கிட்டு ஒப்பிடுவார், நல்ல நீதிபதி, கலைஞர், கண்டுபிடிப்பு, கணிதத்தில் நன்று, சமூக வாழ்க்கை."
  },
  {
   "page": 92,
   "en": "Short, not good to look at, broad shoulder, dark complexion, brown hair, stubborn, obstinate, positive, reckless, friends are troublesome, so also relatives, fond of opposite sex, ever for pleasure, disappointments, critical, suspicious, develops mesmerism.",
   "ta": "குட்டை, பார்க்க அழகில்லை, அகன்ற தோள், கருமை நிறம், பழுப்பு முடி, பிடிவாதம், உறுதியான கருத்து, கவனமின்மை, நண்பர்களும் உறவினர்களும் தொல்லை, எதிர்பாலினத்தில் விருப்பம், எப்போதும் இன்பம் நாடுவார், ஏமாற்றங்கள், குறை காண்பவர், சந்தேகம், மனவசியம் வளர்ப்பார்."
  },
  {
   "page": 92,
   "en": "Tall, well built, large thick bones, face oval, dark complexion, long nose, sincere, just, independent, rebellious, prophetic mind, active mentally, changeable, enjoying nature, authoritative.",
   "ta": "உயரம், நன்கு கட்டிய, பெரிய தடித்த எலும்புகள், நீள்வட்ட முகம், கருமை நிறம், நீண்ட மூக்கு, நேர்மை, நியாயம், சுதந்திரம், எதிர்ப்பு மனப்பான்மை, தீர்க்கதரிசன மனம், மனத்தால் சுறுசுறுப்பு, மாறும் குணம், இயற்கையை ரசிப்பார், அதிகார குணம்."
  },
  {
   "page": 92,
   "en": "Thin, not well built, face also thin, dark complexion, hair brown and thin, irritable, dissatisfied, disappointed, discontented, unfortunate, suspicious nature, painstaking, studious, perseverance, science, occult, contemplative.",
   "ta": "ஒல்லி, நன்கு கட்டவில்லை, மெலிந்த முகம், கருமை நிறம், மெல்லிய பழுப்பு முடி, எரிச்சல், திருப்தியின்மை, ஏமாற்றம், அதிருப்தி, துரதிர்ஷ்டம், சந்தேக குணம், கடின உழைப்பு, படிப்பு, விடாமுயற்சி, அறிவியல், மறைபொருள், தியானம்."
  },
  {
   "page": 92,
   "en": "Moderate stature, good health, attractive appearance, dark hair, fair, original thoughts, penetrative, comprehensive, humanitarian, can concentrate, fond of occult subjects and research, capable for discovery, ever reading, expounders of theories.",
   "ta": "நடுத்தர உயரம், நல்ல ஆரோக்கியம், கவர்ச்சியான தோற்றம், கருமை முடி, நேர்மை, சொந்தச் சிந்தனை, ஊடுருவும் அறிவு, விரிவான பார்வை, மனிதநேயம், கவனம் செலுத்தும் திறன், மறைபொருள்-ஆராய்ச்சியில் விருப்பம், கண்டுபிடிப்புத் திறன், எப்போதும் படிப்பவர், கோட்பாடுகளை விளக்குபவர்."
  },
  {
   "page": 92,
   "en": "Short, stout, pale, hair brownish, hair throughout the body, intuitive, understands matters quickly, versatile, good memory, psychic qualities, recreation, boating, analytical mind, dexterous, finds pleasure in nursing.",
   "ta": "குட்டை, பருமன், வெளிர், பழுப்பு முடி, உடல் முழுவதும் முடி, உள்ளுணர்வு, விஷயங்களை விரைவில் புரிந்துகொள்வார், பல திறமை, நல்ல நினைவு, உள்ளுணர்வு ஆற்றல், பொழுதுபோக்கு, படகு சவாரி, பகுப்பாய்வு மனம், திறமை, செவிலியப் பணியில் மகிழ்ச்சி."
  }
 ],
 "Jupiter": [
  {
   "page": 92,
   "en": "Not plumpy but stature is middle, expressive eyes, high nose, pimples in the face, progressive, generous, ardent philosophical, good relationship, social, noble, polite, studious, fond of traveling, sports, races and fortunate.",
   "ta": "பூசிய உடல் அல்ல, நடுத்தர உயரம், உணர்ச்சியுள்ள கண்கள், உயர்ந்த மூக்கு, முகத்தில் பருக்கள், முன்னேற்றம், தாராளம், ஆர்வமிக்க தத்துவம், நல்ல உறவு, சமூகம், உயர்குணம், பணிவு, படிப்பு, பயணம்-விளையாட்டு-பந்தயத்தில் விருப்பம், அதிர்ஷ்டம்."
  },
  {
   "page": 93,
   "en": "Moderate height, stout, good health, affectionate reserved, steady, cannot be influenced, rarely travels, religious, gains through opposite sex, receives gift, legacy, gains by investment, speculation, early marriage, dutiful partner.",
   "ta": "நடுத்தர உயரம், பருமன், நல்ல ஆரோக்கியம், அன்பு, ஒதுக்கம், நிலைத்த குணம், செல்வாக்குக்கு உட்படாதவர், அரிதாகப் பயணம், ஆன்மிகம், எதிர்பாலினம் மூலம் ஆதாயம், பரிசு-மரபுச் சொத்து, முதலீடு-ஊகத்தில் ஆதாயம், சீக்கிரத் திருமணம், கடமை தவறாத துணை."
  },
  {
   "page": 93,
   "en": "Well-built, little stout, good complexion, dark hair, penetrating eyes, sympathetic benevolent, friendly, trustworthy, travels, broad-outlook, restless, studious, some difficulty in wedding, can discover, follow novel methods.",
   "ta": "நன்கு கட்டிய, சற்றுப் பருமன், நல்ல நிறம், கருமை முடி, ஊடுருவும் கண்கள், அனுதாபம், பரோபகாரம், நட்பு, நம்பகம், பயணம், அகன்ற பார்வை, அமைதியின்மை, படிப்பு, திருமணத்தில் சிறிது சிரமம், கண்டுபிடிக்கும் திறன், புதிய முறைகளைப் பின்பற்றுவார்."
  },
  {
   "page": 93,
   "en": "Stout, short, pale and anaemic, complexion not good, face not round, hair not black, plumpy, disproportionate, charitable, enterprising, sympathetic, popular, intuitive, imaginative, artist, patriot, interest in the occult sciences, loves home and also travels.",
   "ta": "பருமன், குட்டை, வெளிர், இரத்தசோகை, நிறம் நன்றில்லை, உருண்டையல்ல முகம், கருப்பல்ல முடி, பூசிய உடல், சமமற்ற உடல், தர்மம், முயற்சி, அனுதாபம், புகழ், உள்ளுணர்வு, கற்பனை, கலைஞர், தேசபக்தர், மறைபொருள் அறிவியலில் ஆர்வம், வீட்டை நேசிப்பார், பயணமும் செய்வார்."
  },
  {
   "page": 93,
   "en": "Strong, well-built, tall, round face, curling dark hair, big eyes, beautiful, broad-outlook, noble, prudent, loyal, generous, prestige, intuitive, diplomatic, permanency, fixed deposit, sports.",
   "ta": "வலிமை, நன்கு கட்டிய, உயரம், உருண்டை முகம், சுருள் கருமை முடி, பெரிய கண்கள், அழகு, அகன்ற பார்வை, உயர்குணம், விவேகம், விசுவாசம், தாராளம், கௌரவம், உள்ளுணர்வு, இராஜதந்திரம், நிலைத்தன்மை, நிலையான சேமிப்பு, விளையாட்டு."
  },
  {
   "page": 93,
   "en": "Good height, well-built, beautiful, black hair, above average in height, fair complexion, intelligent, cautious, prudent, philosophy, scientific, analytical, wise, honest, chooses friends, popular, deals in speculation.",
   "ta": "நல்ல உயரம், நன்கு கட்டிய, அழகு, கருமை முடி, சராசரிக்கு மேல் உயரம், வெள்ளை நிறம், அறிவு, எச்சரிக்கை, விவேகம், தத்துவம், அறிவியல், பகுப்பாய்வு, ஞானம், நேர்மை, நண்பர்களைத் தேர்ந்தெடுப்பார், புகழ், ஊக வணிகம்."
  },
  {
   "page": 93,
   "en": "Good growth, robust health, handsome, tall, good complexion, oval face, dark hair, pimples or rash in the face, moderate, earnest, obliging, imaginative, peaceful, charitable, fond of travel, artist, gains through the opposite sex, happy marriage, good children.",
   "ta": "நல்ல வளர்ச்சி, உறுதியான ஆரோக்கியம், அழகான தோற்றம், உயரம், நல்ல நிறம், நீள்வட்ட முகம், கருமை முடி, முகத்தில் பருக்கள் அல்லது தடிப்பு, மிதமான குணம், ஆர்வம், உதவும் குணம், கற்பனை, அமைதி, தர்மம், பயணத்தில் விருப்பம், கலைஞர், எதிர்பாலினம் மூலம் ஆதாயம், மகிழ்ச்சியான திருமணம், நல்ல குழந்தைகள்."
  },
  {
   "page": 93,
   "en": "Good health, well-built, beautiful, strong will, deep emotions, ambitious, perseverance, self confidence, analytical, psychic, research minded, permanency, professional secret, litigation, arbitration.",
   "ta": "நல்ல ஆரோக்கியம், நன்கு கட்டிய, அழகு, உறுதியான மனம், ஆழ்ந்த உணர்ச்சிகள், இலட்சியம், விடாமுயற்சி, தன்னம்பிக்கை, பகுப்பாய்வு, உள்ளுணர்வு ஆற்றல், ஆராய்ச்சி மனம், நிலைத்தன்மை, தொழில் இரகசியம், வழக்கு, மத்தியஸ்தம்."
  },
  {
   "page": 93,
   "en": "Tall and upright, stout, good stature, oval face brown hair, grows beard, becomes bald, courteous, generous, tolerant, loyal, merciful, humanitarian, successful, sports, horse-race, gains.",
   "ta": "உயரம், நிமிர்ந்த, பருமன், நல்ல உயரம், நீள்வட்ட முகம், பழுப்பு முடி, தாடி வளர்ப்பார், வழுக்கை விழும், மரியாதை, தாராளம், பொறுமை, விசுவாசம், இரக்கம், மனிதநேயம், வெற்றி, விளையாட்டு, குதிரைப் பந்தயம், ஆதாயம்."
  },
  {
   "page": 93,
   "en": "Thin, below average, head also little small, little beard, dark brown thin hair, constructive, capable, creative, ambitious, powerful, economical, frugal, successful, public life, deals in foreign affairs, long journeys, orthodox.",
   "ta": "ஒல்லி, சராசரிக்குக் குறைவு, தலையும் சற்றுச் சிறியது, சிறிது தாடி, கரும்பழுப்பு மெல்லிய முடி, ஆக்கபூர்வம், திறமை, படைப்பாற்றல், இலட்சியம், வலிமை, சிக்கனம், வெற்றி, பொது வாழ்க்கை, வெளிநாட்டு விவகாரம், நீண்ட பயணம், மரபுவாதம்."
  },
  {
   "page": 94,
   "en": "Below average, tall, good health, brown hair, deep set eyes, good humored, sympathetic, hates quarrels, prophetic, good for astrology, spiritual life, independent views, gains through profession, psychic experiences, friends in foreign.",
   "ta": "சராசரிக்குக் குறைவு (நூலில் \"tall\" என்றும் உள்ளது), நல்ல ஆரோக்கியம், பழுப்பு முடி, ஆழமான கண்கள், நகைச்சுவை, அனுதாபம், சண்டையை வெறுப்பார், தீர்க்கதரிசனம், ஜோதிடத்துக்குத் தகுதி, ஆன்மிக வாழ்க்கை, சுதந்திரக் கருத்து, தொழில் மூலம் ஆதாயம், உள்ளுணர்வு அனுபவங்கள், வெளிநாட்டில் நண்பர்கள்."
  },
  {
   "page": 94,
   "en": "Below average height, plumpy, stout, brown hair, pleasure in good company, strong will, emotional, imaginative, intuitive, dreams and vision, studious simple, unassuming, fond of nature, animals, aquatics, takes interest in sanatorium, asylum etc.",
   "ta": "சராசரிக்குக் குறைந்த உயரம், பூசிய, பருமன், பழுப்பு முடி, நல்ல நட்பில் மகிழ்ச்சி, உறுதியான மனம், உணர்ச்சிவசம், கற்பனை, உள்ளுணர்வு, கனவுகள்-தரிசனங்கள், படிப்பாளி, எளிமை, அடக்கம், இயற்கை-விலங்குகள்-நீர் விளையாட்டில் விருப்பம், சுகாதார நிலையம்-மனநல இல்லம் போன்றவற்றில் ஆர்வம்."
  }
 ],
 "Venus": [
  {
   "page": 94,
   "en": "Average height, thin body, thin hair, good appearance, scar in face, may be poxed face, artist, fond of music, sculpture, internal recreation, travels, affectionate, fond of love, attracted to opposite sex, popular.",
   "ta": "சராசரி உயரம், மெலிந்த உடல், மெல்லிய முடி, நல்ல தோற்றம், முகத்தில் தழும்பு (அம்மைத் தழும்பாகவும் இருக்கலாம்), கலைஞர், இசை-சிற்பத்தில் விருப்பம், உள்ளரங்குப் பொழுதுபோக்கு, பயணம், அன்பு, காதலில் விருப்பம், எதிர்பாலினம் கவரும், புகழ்."
  },
  {
   "page": 94,
   "en": "Very good health, attractive face, proportionate body, little stout, emotional, affectionate, faithful, careful, precise determined, saves money, enjoys life.",
   "ta": "மிக நல்ல ஆரோக்கியம், கவர்ச்சியான முகம், சமமான உடல், சற்றுப் பருமன், உணர்ச்சி, அன்பு, விசுவாசம், கவனம், துல்லியம், உறுதி, பணம் சேமிப்பார், வாழ்க்கையை அனுபவிப்பார்."
  },
  {
   "page": 94,
   "en": "Middle stature, good in appearance, fair complexion, dark hair, good humored, traverse, plurality of interests, several occupations, good writer, speaker, musician, intuitive, original inventive, sociable, more than one love affair, unsteady.",
   "ta": "நடுத்தர உயரம், நல்ல தோற்றம், வெள்ளை நிறம், கருமை முடி, நகைச்சுவை, பயணி, பல ஆர்வங்கள், பல தொழில்கள், நல்ல எழுத்தாளர்-பேச்சாளர்-இசைக்கலைஞர், உள்ளுணர்வு, தனித்தன்மையான கண்டுபிடிப்பு, பழகும் குணம், ஒன்றுக்கு மேற்பட்ட காதல் உறவு, நிலையற்றவர்."
  },
  {
   "page": 94,
   "en": "Short person, stout, round face at the same time sickly, thin hair, little idle, loves home attracted by family, fond of mother, kind heart, imaginative, several love affairs, secret activities marriage not very fortunate, psychic powers, can mesmerise, gains by permanent positions.",
   "ta": "குட்டை, பருமன், உருண்டை முகம் ஆனால் நோயாளித் தோற்றம், மெல்லிய முடி, சற்றுச் சோம்பல், வீட்டை நேசிப்பார், குடும்பத்தால் கவரப்படுவார், தாயிடம் பற்று, இரக்க மனம், கற்பனை, பல காதல் உறவுகள், இரகசிய செயல்கள், திருமணம் அவ்வளவு அதிர்ஷ்டமில்லை, உள்ளுணர்வு ஆற்றல், மனவசியம், நிலையான பதவிகளால் ஆதாயம்."
  },
  {
   "page": 94,
   "en": "Tall, well built, clear eyes, round face, fair skin, sympathetic, kind hearted, charitable, sincere, attractive, social good, in music or acting or any art, gains by speculation, shares stock exchange, etc.",
   "ta": "உயரம், நன்கு கட்டிய, தெளிவான கண்கள், உருண்டை முகம், வெள்ளைத் தோல், அனுதாபம், இரக்க மனம், தர்மம், நேர்மை, கவர்ச்சி, சமூகத்தில் நல்லவர், இசை-நடிப்பு-ஏதேனும் கலையில் ஈடுபாடு, ஊகத்தில் ஆதாயம், பங்குச் சந்தை முதலியன."
  },
  {
   "page": 95,
   "en": "Tall, well built, oval face, dark hair, intelligent, sympathetic, not fully satisfied in love affairs, secret attachment even with employees or employers, gains through medicine, gardening, nursery and speculation.",
   "ta": "உயரம், நன்கு கட்டிய, நீள்வட்ட முகம், கருமை முடி, அறிவு, அனுதாபம், காதல் உறவுகளில் முழு நிறைவில்லை, ஊழியர்/முதலாளியுடனும் இரகசியப் பற்று, மருத்துவம்-தோட்டக்கலை-நாற்றுப் பண்ணை-ஊகத்தில் ஆதாயம்."
  },
  {
   "page": 95,
   "en": "Erect, straight, tall, beautiful person, well built, oval face, pleasing manners, ever smiling, brown hair, very long hair, kind sympathetic, affectionate, good companion inseparable temperament, pleasant partner, artist, social broad outlook.",
   "ta": "நிமிர்ந்த, நேரான, உயரமான, அழகான, நன்கு கட்டிய உடல், நீள்வட்ட முகம், இனிய பழக்கம், எப்போதும் புன்னகை, பழுப்பு முடி, மிக நீண்ட முடி, இரக்கம், அனுதாபம், அன்பு, நல்ல தோழர், பிரியாத குணம், இனிய துணை, கலைஞர், சமூகத்தில் அகன்ற பார்வை."
  },
  {
   "page": 95,
   "en": "Short, stout, robust, broad face, black complexion, black hair, extravagant, lavish, impulsive, gains by gift or partnership or dowry, very passionate, emotional, troubles through opposite sex, disappointment, survives partner.",
   "ta": "குட்டை, பருமன், உறுதியான உடல், அகன்ற முகம், கருமை நிறம், கருமை முடி, ஊதாரி, ஆடம்பரம், உணர்ச்சிவசம், பரிசு-கூட்டுறவு-வரதட்சணையால் ஆதாயம், மிகுந்த ஆர்வம், உணர்ச்சி, எதிர்பாலினம் மூலம் தொல்லை, ஏமாற்றம், துணையை விட நீண்ட காலம் வாழ்வார்."
  },
  {
   "page": 95,
   "en": "Tall, well built, good complexion, fair long face, brown hair, refined nature, light hearted, impressionable, imaginative, intuitive, fond of journey, beauty, nature's romance, outdoor games, gains through many source, horse-racing, shipping, boating, takes friends of opposite sex etc.",
   "ta": "உயரம், நன்கு கட்டிய, நல்ல நிறம், வெள்ளை நீண்ட முகம், பழுப்பு முடி, நாகரிக குணம், இலகுவான மனம், எளிதில் தாக்கத்துக்கு உட்படுவார், கற்பனை, உள்ளுணர்வு, பயணம்-அழகு-இயற்கையின் காதலில் விருப்பம், வெளிப்புற விளையாட்டு, பல வழிகளில் ஆதாயம், குதிரைப் பந்தயம்-கப்பல்-படகு, எதிர்பாலின நண்பர்கள் முதலியன."
  },
  {
   "page": 95,
   "en": "Not well built, moderate height, pale figure, thin, looks sickly, dark hair, trust worthy, responsible, authoritative, business-like, banking, invests, deals in speculative shares, social life, ambitious, delayed marriage, loss due to treachery in business.",
   "ta": "நன்கு கட்டவில்லை, நடுத்தர உயரம், வெளிர் உடல், ஒல்லி, நோயாளித் தோற்றம், கருமை முடி, நம்பகம், பொறுப்பு, அதிகார குணம், வணிக மனம், வங்கித் தொழில், முதலீடு, ஊகப் பங்குகள், சமூக வாழ்க்கை, இலட்சியம், தாமதத் திருமணம், வணிகத்தில் துரோகத்தால் இழப்பு."
  },
  {
   "page": 95,
   "en": "Beautiful, robust health, well built fair complexion, big body, sympathetic, humanitarian, social, always fond of romance, sudden expenses in love, gains through friends, most of the hopes fulfilled.",
   "ta": "அழகு, உறுதியான ஆரோக்கியம், நன்கு கட்டிய, வெள்ளை நிறம், பெரிய உடல், அனுதாபம், மனிதநேயம், சமூகம், எப்போதும் காதலில் விருப்பம், காதலில் திடீர்ச் செலவுகள், நண்பர்கள் மூலம் ஆதாயம், பெரும்பாலான நம்பிக்கைகள் நிறைவேறும்."
  },
  {
   "page": 95,
   "en": "Moderate height, stout, muscular, round face, very fair, charitable, can be influenced, sympathetic, compassionate, emotional, inspirational, fond of painting, music, society.",
   "ta": "நடுத்தர உயரம், பருமன், தசைப்பற்று, உருண்டை முகம், மிக வெள்ளை நிறம், தர்மம், செல்வாக்குக்கு உட்படுவார், அனுதாபம், கருணை, உணர்ச்சி, உத்வேகம், ஓவியம்-இசை-சமூகத்தில் விருப்பம்."
  }
 ],
 "Saturn": [
  {
   "page": 95,
   "en": "Black complexion, bony person, thin build, dull face, less of hair, self boasting, determined very ambitious, good analytical brain, obstacles and troubles.",
   "ta": "கருமை நிறம், எலும்பு தெரியும் உடல், மெலிந்த அமைப்பு, மந்த முகம், முடி குறைவு, தற்பெருமை, உறுதி, மிகுந்த இலட்சியம், நல்ல பகுப்பாய்வு மூளை, தடைகளும் தொல்லைகளும்."
  },
  {
   "page": 96,
   "en": "Ugly appearance, stout, dark hair, profuse growth, fat, steady in mind, loses temper quickly, resentful, cannot be satisfied, very economical, reserved, fond of horticulture, poultry, enjoys nature, loss through close relative, domestic life not very fortunate.",
   "ta": "அழகற்ற தோற்றம், பருமன், கருமை முடி, அடர்ந்த வளர்ச்சி, கொழுப்பு, மனத்தில் நிலைப்பு, விரைவில் கோபம், மனக்கசப்பு, திருப்தி அடைய மாட்டார், மிகுந்த சிக்கனம், ஒதுக்கம், தோட்டக்கலை-கோழிப் பண்ணையில் விருப்பம், இயற்கையை ரசிப்பார், நெருங்கிய உறவினரால் இழப்பு, குடும்ப வாழ்க்கை அவ்வளவு அதிர்ஷ்டமில்லை."
  },
  {
   "page": 96,
   "en": "Tall, black, face not round, hair also black, intelligent, concentrates, can meditate, fond of science, mathematics, Statistics. Literature, trouble through cousins, litigations, false complaints, being black-mailed, danger for reputation.",
   "ta": "உயரம், கருப்பு, உருண்டையல்ல முகம், கருமை முடி, அறிவு, கவனம் செலுத்துவார், தியானம் செய்வார், அறிவியல்-கணிதம்-புள்ளியியல்-இலக்கியத்தில் விருப்பம், உடன்பிறந்த உறவினரால் தொல்லை, வழக்குகள், பொய்ப் புகார்கள், மிரட்டிப் பணம் பறிக்கப்படுதல், நற்பெயருக்கு ஆபத்து."
  },
  {
   "page": 96,
   "en": "Thin, not tall, weak health, sickly appearance, hair dark, deep set eyes, dissatisfaction, ever changes house, always changeable, depressed, no contentment at all, psychic powers, economical at home, most industrious.",
   "ta": "ஒல்லி, உயரமில்லை, பலவீன ஆரோக்கியம், நோயாளித் தோற்றம், கருமை முடி, ஆழமான கண்கள், அதிருப்தி, அடிக்கடி வீடு மாறுவார், எப்போதும் மாறுபவர், மனச்சோர்வு, திருப்தியே இல்லை, உள்ளுணர்வு ஆற்றல், வீட்டில் சிக்கனம், மிகுந்த உழைப்பாளி."
  },
  {
   "page": 96,
   "en": "Tall, good health, broad face, big shoulders, dark hair, sunken eyes, generous, short beard, stubborn, God-fearing, spiritual uplift, trouble through servants, meets with accidents, pains-taking, over-works, feels exhausted in love affairs, not happy.",
   "ta": "உயரம், நல்ல ஆரோக்கியம், அகன்ற முகம், பெரிய தோள்கள், கருமை முடி, உள்ளடங்கிய கண்கள், தாராளம், குறுந்தாடி, பிடிவாதம், தெய்வபக்தி, ஆன்மிக முன்னேற்றம், வேலையாட்களால் தொல்லை, விபத்துகள், கடின உழைப்பு, அதிக வேலை, காதல் உறவுகளில் களைப்பு, மகிழ்ச்சியில்லை."
  },
  {
   "page": 96,
   "en": "Tall, thin-build, black hair, long forehead, cautious, frugal intuitive, reserved, much worried, not faithful, depressed good for spiritual life, unfortunate in domestic affairs, disharmony obstacles, labour problems.",
   "ta": "உயரம், மெலிந்த அமைப்பு, கருமை முடி, நீண்ட நெற்றி, எச்சரிக்கை, சிக்கனம், உள்ளுணர்வு, ஒதுக்கம், மிகுந்த கவலை, விசுவாசம் குறைவு, மனச்சோர்வு, ஆன்மிக வாழ்க்கைக்கு நன்று, குடும்ப விவகாரங்களில் துரதிர்ஷ்டம், ஒற்றுமையின்மை, தடைகள், தொழிலாளர் பிரச்சினைகள்."
  },
  {
   "page": 96,
   "en": "Tall, long face, dark hair, long nose, broad forehead, commands respect, scientific minded, inimical with opposite sex, disappointment in love affairs, separation, heavy hearted, disgrace, delayed marriage, dejected.",
   "ta": "உயரம், நீண்ட முகம், கருமை முடி, நீண்ட மூக்கு, அகன்ற நெற்றி, மரியாதையைப் பெறுவார், அறிவியல் மனம், எதிர்பாலினத்துடன் பகை, காதல் உறவில் ஏமாற்றம், பிரிவு, கனத்த மனம், அவமானம், தாமதத் திருமணம், சோகம்."
  },
  {
   "page": 96,
   "en": "Moderate height, stout, big shoulder, dark hair, violent type, very passionate, self determined, jealous, disappointment in love affairs or secret activities, not happy with domestic life, drunkard, bad habits.",
   "ta": "நடுத்தர உயரம், பருமன், பெரிய தோள், கருமை முடி, வன்முறைக் குணம், மிகுந்த ஆர்வம், சுய உறுதி, பொறாமை, காதல் உறவு அல்லது இரகசிய செயல்களில் ஏமாற்றம், குடும்ப வாழ்க்கையில் மகிழ்ச்சியில்லை, குடிகாரர், தீய பழக்கங்கள்."
  },
  {
   "page": 96,
   "en": "Huge body, moderate complexion, obliging, helpful, fearless, humanitarian, occult science, philosophy, intuitive, detached nature, many obstacles, more than one occupation, should take care of nervous weakness, do not mix with frauds and cheats.",
   "ta": "மிகப் பெரிய உடல், நடுத்தர நிறம், உதவும் குணம், அஞ்சாமை, மனிதநேயம், மறைபொருள் அறிவியல், தத்துவம், உள்ளுணர்வு, பற்றற்ற குணம், பல தடைகள், ஒன்றுக்கு மேற்பட்ட தொழில்கள், நரம்புத் தளர்ச்சியில் கவனம் தேவை, மோசடிக்காரர்களுடன் சேரக் கூடாது."
  },
  {
   "page": 97,
   "en": "Lean, bony, black hair, average height, sunken cheek and eyes, hunch-back, always thinking, serious, cautious, reasonable reserved, peevish, attachment with inferior friends, not reliable, unhappy marriage, dissatisfied, needs recreation.",
   "ta": "ஒல்லி, எலும்பு தெரியும், கருமை முடி, சராசரி உயரம், உள்ளடங்கிய கன்னம்-கண்கள், கூன், எப்போதும் சிந்தனை, கடுமை, எச்சரிக்கை, நியாயம், ஒதுக்கம், எரிச்சல், தாழ்ந்த நண்பர்களுடன் பற்று, நம்பகமில்லை, மகிழ்ச்சியற்ற திருமணம், அதிருப்தி, பொழுதுபோக்கு தேவை."
  },
  {
   "page": 97,
   "en": "Tall, big head and sunken eyes, brown, hair thoughtful, reserved, serious, intellectual, deep thinker, sociable, gains determined, faithful romantic life.",
   "ta": "உயரம், பெரிய தலை, உள்ளடங்கிய கண்கள், பழுப்பு (முடி), சிந்தனை, ஒதுக்கம், கடுமை, அறிவுத்திறன், ஆழ்ந்த சிந்தனையாளர், பழகும் குணம், உறுதியுடன் ஆதாயம், விசுவாசமான காதல் வாழ்க்கை."
  },
  {
   "page": 97,
   "en": "Moderate height, average complexion neither fair nor dirty, big head, protruding eyes, teeth not well arranged, unfaithful, friends, loss, deception, being black mailed, danger to reputation, many disappointments, secret activities, unfortunate, calamities, worry due to romance, feels tired, exhausted easily, cannot concentrate, psychic conditions affect the native, persistent effort, deep intuition.",
   "ta": "நடுத்தர உயரம், வெள்ளையுமல்ல அழுக்குமல்ல சராசரி நிறம், பெரிய தலை, துருத்திய கண்கள், ஒழுங்கற்ற பற்கள், விசுவாசமின்மை, நண்பர்கள், இழப்பு, ஏமாற்றம், மிரட்டிப் பணம் பறிக்கப்படுதல், நற்பெயருக்கு ஆபத்து, பல ஏமாற்றங்கள், இரகசிய செயல்கள், துரதிர்ஷ்டம், பேரிடர்கள், காதலால் கவலை, எளிதில் களைப்பு, கவனம் செலுத்த முடியாது, உள்ளுணர்வு நிலைகள் பாதிக்கும், விடாமுயற்சி, ஆழ்ந்த உள்ளுணர்வு."
  }
 ]
};

module.exports = { SIGNS, PLANETS, TABLE };
