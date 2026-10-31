/**
 * The home page's map of the program: every page, once, under the astrologer's task it serves (the birth chart, the dashas, the
 * transits, the annual chart, matching, muhurta, KP, prashna and remedies, the books, and the office). The menus (pl9Menus.js) and the
 * toolbar (toolbarPanels.js) follow PL9's order; this list follows the order of work, so a page is found by what it is for.
 * test-home-sections.js checks that every route is a page of the program and that no page is listed twice.
 */

/** @typedef {{ route: string, icon: string, ta: string, en: string }} HomeLink */
/** @typedef {{ key: string, icon: string, ta: string, en: string, tone: 'saffron'|'indigo'|'teal'|'rose', links: HomeLink[] }} HomeSection */

const link = (route, icon, ta, en) => ({ route, icon, ta, en });

/** @type {HomeSection[]} */
const HOME_SECTIONS = [
  {
    key: 'birth', icon: '📜', ta: 'பிறப்பு ஜாதகம்', en: 'Birth chart', tone: 'saffron',
    links: [
      link('/worksheet', '🪔', 'ஜாதக மேசை', 'Worksheet'),
      link('/report', '📖', 'முழு ஜாதக அறிக்கை', 'Horoscope report'),
      link('/divisional-charts', '🔷', 'வர்க்கச் சக்கரங்கள்', 'Divisional charts'),
      link('/lordships', '👑', 'பாவாதிபதிகள்', 'Lordships'),
      link('/interpreting-grahas', '🪐', 'கிரக விளக்கம்', 'Interpreting grahas'),
      link('/house-analysis', '🏠', 'பாவ பலம்', 'House analysis'),
      link('/yoga-detection', '✨', 'யோகங்கள்', 'Yogas'),
      link('/vimshopaka', '⚖️', 'விம்சோபக பலம்', 'Vimshopaka'),
      link('/special-lagnas', '🎯', 'சிறப்பு லக்னங்கள்', 'Special lagnas'),
      link('/sripati-bhava', '📐', 'ஸ்ரீபதி பாவம்', 'Sripati bhava'),
      link('/declination', '↕️', 'கிராந்தி', 'Declination'),
      link('/astronomy', '🔭', 'வானியல் விவரம்', 'Astronomy'),
      link('/navamsha-years', '🔢', 'நவாம்ச வயது', 'Navamsha ages'),
      link('/nature-temperament', '🧭', 'இயல்பும் குணமும்', 'Nature & temperament'),
      link('/planet-house', '📚', 'கிரகம் பாவத்தில்', 'Planets in houses'),
      link('/health', '🩺', 'ஆரோக்கியம்', 'Health (BPHS)'),
      link('/rectification', '⏱️', 'ஜனன கால திருத்தம்', 'Rectification'),
    ],
  },
  {
    key: 'dasha', icon: '⏳', ta: 'தசைகள்', en: 'Dashas', tone: 'indigo',
    links: [
      link('/dasha-timeline', '📊', 'தசை வரிசை', 'Dasha timeline'),
      link('/dasha-calendar', '📅', 'தசா நாட்காட்டி', 'Dasha calendar'),
      link('/dasha-effects', '🔍', 'தசா பலன் உலாவி', 'Dasha effects browser'),
      link('/bphs-dashas', '📜', 'நட்சத்திரத் தசைகள் (BPHS)', 'Nakshatra dashas'),
      link('/bphs-rashi-dashas', '♈', 'ராசித் தசைகள் (BPHS)', 'Rashi dashas'),
      link('/dasha-methods', '✅', 'தசை முறைகள் — சரிபார்ப்பு', 'Dasha methods status'),
      link('/events', '📌', 'நிகழ்வு ஜாதகங்கள்', 'Events'),
    ],
  },
  {
    key: 'transit', icon: '🪐', ta: 'கோசாரம்', en: 'Transits', tone: 'teal',
    links: [
      link('/animated-transits', '🎞️', 'அனிமேஷன் கோசாரம்', 'Animated transits'),
      link('/saturn-transit', '🪐', 'ஏழரை / அஷ்டமச் சனி', 'Saturn transit'),
      link('/gochara-vedha', '🚧', 'கோசார வேதை', 'Gochara vedha'),
      link('/nakshatra-gochara', '⭐', 'நட்சத்திரக் கோசாரம்', 'Nakshatra gochara'),
      link('/kakshya-transit', '🎯', 'கோசாரக் காக்ஷ்யா', 'Kakshya transit'),
      link('/yearly-transit', '🗓️', 'ஆண்டு கோசாரம்', 'Yearly transit'),
      link('/graphical-ephemeris', '📈', 'வரைபட எபிமெரிஸ்', 'Graphical ephemeris'),
      link('/latta', '🦶', 'லத்தை', 'Latta'),
      link('/moorthi-nirnaya', '🥇', 'மூர்த்தி நிர்ணயம்', 'Moorthi nirnaya'),
      link('/pada-88', '8️⃣', '88-வது பாதம்', '88th pada'),
      link('/band-of-years', '🎗️', 'ஆண்டுப் பட்டை', 'Band of years'),
      link('/kota-chakra', '🏯', 'கோட்டா சக்கரம்', 'Kota chakra'),
    ],
  },
  {
    key: 'annual', icon: '🎂', ta: 'வருஷபலன்', en: 'Annual chart', tone: 'saffron',
    links: [
      link('/varshaphala', '🎂', 'வருஷபலன்', 'Varshaphala'),
      link('/solar-returns', '☀️', 'வருஷ · மாத · தின பிரவேசம்', 'Solar returns'),
    ],
  },
  {
    key: 'match', icon: '💞', ta: 'திருமணப் பொருத்தம்', en: 'Matching', tone: 'rose',
    links: [
      link('/porutham', '💞', 'திருமணப் பொருத்தம்', 'Marriage matching'),
      link('/mangala-dosha', '🔴', 'செவ்வாய் தோஷம்', 'Mangala dosha'),
    ],
  },
  {
    key: 'muhurta', icon: '🕉️', ta: 'முகூர்த்தம் · நல்ல நேரம்', en: 'Muhurta', tone: 'indigo',
    links: [
      link('/muhurta', '🔎', 'முகூர்த்தம் தேடுதல்', 'Muhurta search'),
      link('/muhurta-stars', '🌟', 'முகூர்த்த நட்சத்திரம்', 'Muhurta stars'),
      link('/classical-muhurta', '🐦', 'பாரம்பரிய முகூர்த்தம்', 'Classical muhurta'),
      link('/nallaneram', '🕰️', 'நல்ல நேரம் · ஹோரை', 'Good times'),
      link('/nakshatra-deeds', '📋', 'நட்சத்திரமும் காரியமும்', 'Deeds by nakshatra'),
      link('/roga-arambha', '🤒', 'நோய்த் தொடக்கம்', 'Onset of illness'),
      link('/tamil-calendar', '📆', 'தமிழ் நாட்காட்டி', 'Tamil calendar'),
    ],
  },
  {
    key: 'kp', icon: 'KP', ta: 'கிருஷ்ணமூர்த்தி பத்ததி', en: 'KP system', tone: 'teal',
    links: [
      link('/kp-horary', '🔢', 'KP பிரச்னம் (1-249)', 'KP horary'),
      link('/kp-ruling', '👑', 'ஆளும் கிரகங்கள்', 'Ruling planets'),
      link('/kp-transit', '🪐', 'KP கோசாரம்', 'KP transit'),
      link('/kp-lucky-time', '🍀', 'KP நல்ல நேரம்', 'KP lucky time'),
      link('/kp-time-scan', '⏲️', 'KP நேரம் தேடல்', 'KP time scan'),
    ],
  },
  {
    key: 'prashna', icon: '❓', ta: 'பிரசன்னம் · பரிகாரம்', en: 'Prashna & remedies', tone: 'rose',
    links: [
      link('/kelvi', '❓', 'கேள்வி–விடை', 'Prashna'),
      link('/jamakkol', '🧿', 'ஜாமக்கோள் பிரசன்னம்', 'Jamakkol'),
      link('/gemstones', '💎', 'ரத்தினங்கள்', 'Gemstones'),
      link('/baby-names', '👶', 'குழந்தை பெயர்', 'Baby names'),
    ],
  },
  {
    key: 'books', icon: '📚', ta: 'நூல்கள் · கற்றல்', en: 'Books & learning', tone: 'indigo',
    links: [
      link('/references', '📚', 'சாஸ்திர நூல்கள்', 'Classical references'),
      link('/learning-resources', '🎓', 'சொல் · விதி · ஆதாரம்', 'Glossary'),
      link('/evidence', '🧾', 'ஆதாரப் பலகைகள்', 'Evidence panels'),
      link('/research', '🔬', 'ஆராய்ச்சி', 'Research'),
    ],
  },
  {
    key: 'office', icon: '🗂️', ta: 'அலுவலகம்', en: 'Practice', tone: 'teal',
    links: [
      link('/client-management', '👥', 'வாடிக்கையாளர்கள்', 'Clients'),
      link('/consultation-tools', '🗒️', 'ஆலோசனைக் கருவிகள்', 'Consultation tools'),
      link('/consultation', '✉️', 'ஆலோசனைக் கோரிக்கை', 'Consultation request'),
      link('/pdf-reports', '📄', 'அறிக்கை உருவாக்கம்', 'PDF reports'),
      link('/print', '🖨️', 'அச்சு மையம்', 'Print center'),
      link('/sync', '🔄', 'சாதனங்கள் · ஒத்திசைவு', 'Sync'),
      link('/settings', '⚙️', 'அமைப்புகள்', 'Settings'),
    ],
  },
];

/** Every link, flat, with the section it is in. */
function allHomeLinks(sections = HOME_SECTIONS) {
  return sections.flatMap((s) => s.links.map((l) => ({ ...l, section: s.key })));
}

module.exports = { HOME_SECTIONS, allHomeLinks };
