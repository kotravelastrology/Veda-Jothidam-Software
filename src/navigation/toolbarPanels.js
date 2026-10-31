/**
 * The worksheet toolbar: the row of icons under the menu that Parashara's Light 9 shows once a chart is open (screen recording of PL9
 * 9.0, 2026-10-31; user guide ch.3 "Navigating Screens with the Top Toolbar"). Each icon opens a panel that lists the worksheets,
 * calculations and reports of one kind, so the astrologer reaches everything for the open chart from the one screen.
 *
 * The panels below list every entry the recording shows, under PL9's own names. An entry has a `route` when a page of ours does that
 * job (status 'have') or the nearest thing we have ('partial'), and a `pending` reason when nothing does ('pending'). Where several
 * PL9 worksheets are layouts of one page of ours (Vargas I to V, the nine "planet in house" reports) they share its route.
 *
 * Seen in the recording: the wrench (tools), the Birth chart panel (five columns), the Compatibility panel, the Krishnamurti panel, the
 * Favorites list and the Varshaphala panel. NOT seen: the panels of the Transits icon and the Reports icon; the two panels here are
 * our own grouping of the pages we have (marked `ours: true`), not PL9's lists.
 */

const have = (key, label, route) => ({ key, label, status: 'have', target: { route } });
const part = (key, label, route) => ({ key, label, status: 'partial', target: { route } });
const soon = (key, label, reason) => ({ key, label, status: 'pending', target: { pending: reason || 'Not built yet.' } });

const NO_SCREEN = 'Not built: this PL9 worksheet is not in the program yet.';

const BIRTH = {
  key: 'birth',
  icon: '📜',
  label: 'Birth chart',
  ta: 'பிறப்பு ஜாதகம்',
  columns: [
    {
      title: 'Charts', ta: 'கட்டங்கள்',
      items: [
        have('b-chart1', 'Birth chart I', '/worksheet'),
        soon('b-chart2', 'Birth chart II', NO_SCREEN),
        have('b-vargas1', 'Vargas I', '/divisional-charts'),
        part('b-vargas2', 'Vargas II', '/divisional-charts'),
        part('b-vargas3', 'Vargas III', '/divisional-charts'),
        part('b-vargas4', 'Vargas IV', '/divisional-charts'),
        part('b-vargas5', 'Vargas V', '/divisional-charts'),
        soon('b-sunrise', 'Sunrise chart', NO_SCREEN),
        have('b-speciallagnas', 'Special Lagnas', '/special-lagnas'),
        have('b-navamshaages', 'Navamsha ages', '/navamsha-years'),
        have('b-sudarshan', 'Sudarshan Chakra', '/report?chart=sudarshan-chakra'),
        soon('b-alternatelagnas', 'Alternate Lagnas', NO_SCREEN),
      ],
    },
    {
      title: 'Basic Calculations', ta: 'அடிப்படைக் கணக்குகள்',
      items: [
        have('b-lordships', 'Lordships', '/lordships'),
        soon('b-compound', 'Compound relations', NO_SCREEN),
        part('b-signsvargas', 'Signs in all vargas', '/divisional-charts'),
        have('b-vimshopaka', 'Vargavimshopaka', '/vimshopaka'),
        part('b-shadbala', 'Shadbala', '/report?section=grahaBala'),
        part('b-bhavabala', 'Bhava Bala', '/report?section=bhavaBala'),
        have('b-interpgrahas', 'Interpreting Grahas', '/interpreting-grahas'),
        have('b-aspectson', 'Aspects on planets', '/report?chart=aspect-matrix'),
        part('b-aspectsfrom', 'Aspects from planets', '/report?chart=aspect-matrix'),
        soon('b-aspectshouses1', 'Aspects on Houses 1-3', NO_SCREEN),
        soon('b-aspectshouses2', 'Aspects on Houses 4-6', NO_SCREEN),
        soon('b-aspectshouses3', 'Aspects on Houses 7-9', NO_SCREEN),
        soon('b-aspectshouses4', 'Aspects on Houses 10-12', NO_SCREEN),
        part('b-jaiminikarakas', 'Jaimini karakas and aspects', '/report?section=jaimini'),
        part('b-jaiminipadas', 'Jaimini padas and lagnas', '/report?section=jaimini'),
      ],
    },
    {
      title: 'Advanced Calculations', ta: 'மேம்பட்ட கணக்குகள்',
      items: [
        have('b-dashanak', 'Dashas - Nakshatra based', '/dasha-timeline'),
        have('b-dasharashi', 'Dashas - Rashi based', '/bphs-rashi-dashas'),
        soon('b-auspgraph', 'Auspiciousness graph', NO_SCREEN),
        have('b-declination', 'Declination', '/declination'),
        soon('b-nakmatrix', 'Nakshatra spatial matrix', NO_SCREEN),
        soon('b-deities', 'Planetary deities', 'Not built: the user guide does not describe this worksheet, and the library has no cited source for the planets\' deities yet.'),
        part('b-panchpakshi', 'Panch Pakshi', '/classical-muhurta'),
        have('b-yogas', 'Yogas', '/yoga-detection'),
      ],
    },
    {
      title: 'General reports', ta: 'பொது அறிக்கைகள்',
      items: [
        have('b-nature', 'Nature and Temperament', '/nature-temperament'),
        soon('b-physical', 'Physical Characteristics', NO_SCREEN),
        soon('b-lucky', 'Lucky Points', NO_SCREEN),
        ...['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].map((p) => have(`b-${p.toLowerCase()}house`, `${p} in house`, '/planet-house')),
        ...['1st and 2nd', '3rd and 4th', '5th and 6th', '7th and 8th', '9th and 10th', '11th and 12th'].map((h, i) => part(`b-lords${i}`, `${h} House lords`, '/planet-house')),
      ],
    },
    {
      title: 'Tools', ta: 'கருவிகள்',
      items: [
        have('b-rectification', 'Rectification', '/rectification'),
        part('b-tutor', 'Chart tutor', '/learning-resources'),
        have('b-dashabrowser', 'Dasha Effects Browser', '/dasha-effects'),
      ],
    },
  ],
};

const VARSHA = {
  key: 'varsha',
  icon: '☀️',
  label: 'Varshaphala',
  ta: 'வருஷபலன்',
  columns: [
    {
      title: 'Charts', ta: 'கட்டங்கள்',
      items: [
        have('v-1', 'Varshaphala I', '/varshaphala'),
        part('v-2', 'Varshaphala II', '/varshaphala'),
        part('v-3', 'Varshaphala III', '/varshaphala'),
        part('v-1l', 'Varshaphala I (L)', '/solar-returns'),
        part('v-2l', 'Varshaphala II (L)', '/solar-returns'),
        part('v-3l', 'Varshaphala III (L)', '/solar-returns'),
        soon('v-8y', 'Varshaphala 8 years overview', NO_SCREEN),
        soon('v-8yl', 'Varshaphala (local) 8 years overview', NO_SCREEN),
        soon('v-tithi', 'Tithi Pravesh', 'Not built: the user guide names Tithi Pravesh as a chart base but does not define it; it needs a cited definition.'),
        soon('v-tithil', 'Tithi Pravesh (L)', 'Not built: the user guide names Tithi Pravesh as a chart base but does not define it; it needs a cited definition.'),
        part('v-sahams', 'Sahams', '/varshaphala'),
      ],
    },
    {
      title: 'Basic Calculations', ta: 'அடிப்படைக் கணக்குகள்',
      items: [
        ...['I', 'II', 'III'].map((n) => part(`v-msr${n}`, `Monthly Solar Ret. ${n}`, '/solar-returns')),
        ...['I', 'II', 'III'].map((n) => part(`v-msrl${n}`, `Monthly Solar Ret. ${n} (L)`, '/solar-returns')),
        ...['I', 'II', 'III'].map((n) => part(`v-dsr${n}`, `Daily Solar Return ${n}`, '/solar-returns')),
        ...['I', 'II', 'III'].map((n) => part(`v-dsrl${n}`, `Daily Solar Return ${n} (L)`, '/solar-returns')),
        soon('v-msr3m', 'Monthly Solar Return 3 month overview', NO_SCREEN),
        soon('v-dsr3d', 'Daily Solar Return 3 day overview', NO_SCREEN),
        part('v-dashas', 'Varshaphala Dashas', '/varshaphala'),
      ],
    },
    {
      title: 'General reports', ta: 'பொது அறிக்கைகள்',
      items: [
        part('v-tajika', 'Tajika Yogas Summary', '/varshaphala'),
        soon('v-tripataki', 'Tripataki Chakra', NO_SCREEN),
        part('v-interp', 'Chart Interpretations', '/varshaphala'),
      ],
    },
  ],
};

const COMPAT = {
  key: 'compat',
  icon: '💞',
  label: 'Compatibility',
  ta: 'பொருத்தம்',
  columns: [
    {
      title: 'Basic Calculations', ta: 'அடிப்படைக் கணக்குகள்',
      items: [
        have('c-composite', 'Compatibility - Composite', '/report?chart=compatibility'),
        have('c-kutas', 'Compatibility - Kutas', '/porutham'),
        have('c-animated', 'Animated Transits - Partner', '/animated-transits?partner=1'),
        have('c-mangalacons', 'Mangal Dosha Consideration', '/mangala-dosha'),
        have('c-mangalacanc', 'Mangal Dosha Cancellation', '/mangala-dosha'),
        have('c-dashakoota', 'Dash-Koota Compatibility', '/porutham'),
      ],
    },
  ],
};

const KP = {
  key: 'kp',
  icon: 'KP',
  iconText: true,
  label: 'Krishnamurti',
  ta: 'கிருஷ்ணமூர்த்தி (KP)',
  columns: [
    {
      title: 'Charts', ta: 'கட்டங்கள்',
      items: [
        have('k-1', 'Krishnamurti', '/report?section=kp'),
        part('k-2', 'Krishnamurti II', '/kp-ruling'),
        have('k-prashna', 'Krishnamurti Prashna', '/kp-horary'),
      ],
    },
  ],
};

// Not seen in the recording: our own grouping of the pages that read the sky of a moment against the chart
const TRANSITS = {
  key: 'transits',
  icon: '🔄',
  label: 'Transits and events',
  ta: 'கோசாரம், நிகழ்வுகள்',
  ours: true,
  columns: [
    {
      title: 'Transits', ta: 'கோசாரம்',
      items: [
        have('t-animated', 'Animated transits I', '/animated-transits'),
        have('t-animatedpartner', 'Animated Transits - Partner', '/animated-transits?partner=1'),
        have('t-graphical', 'Graphical Ephemeris', '/graphical-ephemeris'),
        part('t-graphical3m', 'Graphical ephemeris - 3 month overview', '/graphical-ephemeris'),
        have('t-yearly', 'Yearly transit overview (South Indian)', '/yearly-transit'),
        have('t-saturn', 'Sade Sati and Kantaka Saturn', '/saturn-transit'),
        have('t-kakshya', 'Kakshya transit', '/kakshya-transit'),
        have('t-vedha', 'Gochara Vedha', '/gochara-vedha'),
        have('t-nakshatra', 'Nakshatra Gochara', '/nakshatra-gochara'),
        have('t-kp', 'KP transit', '/kp-transit'),
      ],
    },
    {
      title: 'Events and dashas', ta: 'நிகழ்வுகள், தசைகள்',
      items: [
        part('t-events1', 'Events 1-10', '/events?range=1-10'),
        part('t-events2', 'Events 11-20', '/events?range=11-20'),
        have('t-dashatimeline', 'Dasha and Transit timelines', '/dasha-timeline'),
        have('t-calendar', 'Calendar', '/dasha-calendar'),
        have('t-dashabrowser', 'Dasha Effects Browser', '/dasha-effects'),
      ],
    },
  ],
};

// Not seen in the recording: our own grouping of the reports and lists
const REPORTS = {
  key: 'reports',
  icon: '📝',
  label: 'Reports',
  ta: 'அறிக்கைகள்',
  ours: true,
  columns: [
    {
      title: 'Reports', ta: 'அறிக்கைகள்',
      items: [
        have('r-horoscope', 'Horoscope report', '/report'),
        have('r-book', 'Horoscope book', '/print?kind=book'),
        have('r-print', 'Print Center', '/print'),
        have('r-dashas', 'Dasha reports', '/bphs-dashas'),
        have('r-health', 'Health (BPHS)', '/health'),
        have('r-gems', 'Gemstones', '/gemstones'),
        have('r-mangala', 'Mangala dosha', '/mangala-dosha'),
        have('r-prashna', 'Prashna', '/kelvi'),
      ],
    },
    {
      title: 'References', ta: 'நூல்கள்',
      items: [
        have('r-references', 'Classical references', '/references'),
        have('r-planethouse', 'Planets in houses', '/planet-house'),
        have('r-muhurta', 'Muhurta', '/muhurta'),
        have('r-panchang', 'Tamil calendar and festivals', '/tamil-calendar'),
      ],
    },
  ],
};

/** The panels, in the order of the icons: after the wrench, Birth chart, Varshaphala, Compatibility, Transits, Krishnamurti, Reports. */
const PANELS = [BIRTH, VARSHA, COMPAT, TRANSITS, KP, REPORTS];

/**
 * The wrench's tiles (PL9's "Tools" panel): each opens a settings dialog. `opens` says what ours does: a dialog of its own
 * ('worksheet', 'screen', 'chartstyle', 'colors', 'time', 'place'), or the Settings panel at a section ('settings:display',
 * 'settings:calculations').
 */
const TOOL_TILES = [
  { key: 'worksheet', icon: '🗂️', label: 'Worksheet', ta: 'பணித்தாள்', opens: 'worksheet' },
  { key: 'screen', icon: '🖥️', label: 'Screen', ta: 'திரை', opens: 'screen' },
  { key: 'language', icon: '🗣️', label: 'Language', ta: 'மொழி', opens: 'settings:display' },
  { key: 'locale', icon: '🌍', label: 'Locale', ta: 'வட்டாரம்', opens: 'settings:display' },
  { key: 'fonts', icon: '🔤', label: 'Fonts', ta: 'எழுத்துருக்கள்', opens: 'settings:display' },
  { key: 'chartstyle', icon: '▦', label: 'Chart style', ta: 'கட்ட வடிவம்', opens: 'chartstyle' },
  { key: 'colors', icon: '🎨', label: 'Colors', ta: 'நிறங்கள்', opens: 'colors' },
  { key: 'calculations', icon: '🧮', label: 'Calculations', ta: 'கணக்கீடுகள்', opens: 'settings:calculations' },
  { key: 'dashas', icon: '⏳', label: 'Dashas', ta: 'தசைகள்', opens: 'settings:calculations' },
  { key: 'time', icon: '🕰️', label: 'Time Tool', ta: 'நேரக் கருவி', opens: 'time' },
  { key: 'place', icon: '🌐', label: 'Place Tool', ta: 'இடக் கருவி', opens: 'place' },
];

/** Every panel entry, flat, with the panel it is in. */
function allEntries(panels = PANELS) {
  return panels.flatMap((p) => p.columns.flatMap((c) => c.items.map((item) => ({ ...item, panel: p.key, column: c.title }))));
}

/** The name of a page by its route (the worksheet title the info line shows), from the first entry that points there. */
function titleOfRoute(route) {
  const hit = allEntries().find((e) => e.target.route === route);
  return hit ? hit.label : null;
}

module.exports = { PANELS, TOOL_TILES, BIRTH, VARSHA, COMPAT, KP, TRANSITS, REPORTS, allEntries, titleOfRoute };
