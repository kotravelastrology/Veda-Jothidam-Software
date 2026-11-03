/**
 * The whole of PL9's horoscope book (the 88-page sample aniruddha_HC4) as a catalogue the book page lists: every page, in its
 * family, with a Tamil title and PL9's own English one, and whether this software builds it yet (an id in bookSections.js).
 * A page or run of pages that is not built shows in the list as "coming" and cannot be picked; it is never filled in with
 * something else. `pages` are the sample's page numbers, so the catalogue can be checked against the PDF.
 */
const { BOOK_SECTIONS } = require('./bookSections');

/** [id or null, first page, last page, Tamil title, PL9's English title] */
const FAMILIES = [
  { key: 'birth', ta: 'பிறப்பு விவரங்கள்', icon: '📜', tone: 'saffron', items: [
    ['p1', 1, 1, 'பிறப்பு விவரங்கள் · இந்து & தமிழ் நாள்காட்டி · அவகடா', 'Birth Particulars'],
  ] },
  { key: 'charts', ta: 'ஜாதகக் கட்டங்கள்', icon: '🔷', tone: 'indigo', items: [
    ['p2', 2, 2, 'பிறப்பு ஜாதகம் & கிரக அட்டவணை', 'Birth Chart'],
    ['p3', 3, 3, 'சந்திர, நவாம்ச, பாவ ஜாதகங்கள்', 'Chandra, Navamsha and Bhava'],
    [null, 4, 4, 'சுதர்சன சக்கரம்', 'Sudarshan Chakra'],
    ['p5', 5, 5, 'வர்க்க ஜாதகங்கள் — 1', 'Divisional Charts #1'],
    ['p6', 6, 6, 'வர்க்க ஜாதகங்கள் — 2', 'Divisional Charts #2'],
    [null, 7, 7, 'உப கிரகங்கள்', 'Sub-Planets'],
    ['p8', 8, 8, 'பலவித ஜாதகங்கள்', 'Birth Charts'],
  ] },
  { key: 'strength', ta: 'கிரக நிலை · பலம்', icon: '⚖️', tone: 'teal', items: [
    ['p9', 9, 9, 'கிரக நட்பு', 'Planetary Friendship'],
    ['p10', 10, 10, 'சோடசவர்க்கச் சுருக்கம்', 'Shodashvarga Summary'],
    ['p11', 11, 11, 'சட்பலம் & பாவ பலம்', 'Shad Bala and Bhava Bala'],
    ['p12', 12, 12, 'கிரக, பாவப் பார்வைகள்', 'Aspects on Planets and Bhavas'],
    ['p13', 13, 13, 'கிரக அவஸ்தைகள்', 'Planetary Avasthas'],
  ] },
  { key: 'ashtakavarga', ta: 'அஷ்டகவர்க்கம்', icon: '🔢', tone: 'rose', items: [
    ['p14', 14, 14, 'பின்னாஷ்டகவர்க்கம் — 1', 'Ashtakavarga - Bhinnashtaka #1'],
    ['p15', 15, 15, 'பின்னாஷ்டகவர்க்கம் — 2', 'Ashtakavarga - Bhinnashtaka #2'],
    ['p16', 16, 16, 'சர்வாஷ்டகவர்க்கம் & சஞ்சார சக்கரம்', 'Sarvashtaka & Chancha Chakra'],
    ['p17', 17, 17, 'அஷ்டகவர்க்கச் சுருக்கல்கள்', 'Ashtakavarga - Reductions'],
    ['p18', 18, 18, 'வர்க்க அஷ்டகவர்க்கம்', 'Divisional Charts - Ashtakavarga'],
  ] },
  { key: 'health', ta: 'உடல் நலம்', icon: '🩺', tone: 'teal', items: [
    ['p19', 19, 19, 'கிரகங்களும் உடல் உறுப்புகளும்', 'Health'],
  ] },
  { key: 'vimshottari', ta: 'விம்சோத்தரி தசை', icon: '⏳', tone: 'saffron', items: [
    ['p20', 20, 20, 'தசை — புக்தி', 'Vimshottari MD and AD'],
    [null, 21, 29, 'புக்தி — அந்தரம் (விரிவு)', 'Vimshottari Detailed AD and PD'],
    [null, 30, 32, 'அந்தரம் — சூட்சமம்', 'Vimshottari Dasha – PD and Sookshma'],
  ] },
  { key: 'nakshatra-dashas', ta: 'நட்சத்திர தசைகள்', icon: '🌙', tone: 'indigo', items: [
    [null, 33, 37, 'அஷ்டோத்தரி', 'Ashtottari'],
    [null, 38, 40, 'யோகினி', 'Yogini Dasha'],
    [null, 41, 46, 'காலசக்கர தசை', 'Kala Chakra Dasha'],
  ] },
  { key: 'rashi-dashas', ta: 'ராசி தசைகள் (ஜைமினி முறை)', icon: '♈', tone: 'rose', items: [
    [null, 47, 49, 'ஜைமினி — சர தசை', 'Jaimini System, Chara Dasha'],
    [null, 50, 50, 'ஸ்திர தசை', 'Sthira Dasha'],
    [null, 51, 52, 'நிர்யாண சூல தசை', 'Niryaana Shoola Dasha'],
    [null, 53, 54, 'திரிக் தசை', 'Drig Dasha'],
    [null, 55, 56, 'நவாம்ச தசை', 'Navamsha Dasha'],
    [null, 57, 58, 'நாராயண தசை', 'Narayana Dasha'],
    [null, 59, 60, 'லக்ன கேந்திராதி ராசி தசை', 'Lagna Kendradi Rashi Dasha'],
    [null, 61, 61, 'சூல தசை', 'Shoola Dasha'],
  ] },
  { key: 'other-dashas', ta: 'பிற தசை முறைகள்', icon: '🗓️', tone: 'teal', items: [
    [null, 62, 66, 'திரிபாகி தசை', 'Tribhagi, Tribhagi 40'],
    [null, 67, 78, 'சோடசோத்தரி · துவாதசோத்தரி · துவிசப்ததிசம · சஷ்டிஹாயனி · சத்ரிம்சத்சம · பஞ்சோத்தரி · சதாப்திகா · சதுரசீதிசம', 'Shodashottari … Chaturshitisama'],
  ] },
  { key: 'saturn', ta: 'சனி கோசாரம்', icon: '🪐', tone: 'indigo', items: [
    [null, 79, 80, 'ஏழரைச் சனி · லகு கல்யாணி · கண்டகச் சனி', 'Sadhesati · Laghu Kalyani Dhayya and Kantaka'],
  ] },
  { key: 'kp', ta: 'கிருஷ்ணமூர்த்தி பத்ததி', icon: '📐', tone: 'rose', items: [
    [null, 81, 82, 'KP ஜாதகம் & குறிகாட்டிகள்', 'Krishnamurti Paddhati'],
  ] },
  { key: 'varsha', ta: 'வருட பலன்', icon: '🎂', tone: 'saffron', items: [
    [null, 83, 88, 'வர்ஷபல ஜாதகங்கள் (1 முதல் 72 வயது வரை)', 'Varshaphala Charts'],
  ] },
  // pages 89 on are not in the 88-page sample: the HP1 prediction print's extra pages (extraPages.js)
  { key: 'hp1', ta: 'கூடுதல் பக்கங்கள் (கணிப்பு நூல்)', icon: '✨', tone: 'rose', items: [
    [null, 89, 89, 'செவ்வாய் (மங்கள) தோஷம்', 'Mangala Dosha'],
    [null, 90, 90, 'ஏழரைச் சனி & பரிகாரங்கள்', 'Sadhesati and Remedies'],
    [null, 91, 91, 'ரத்தினங்கள்', 'Gemstones'],
    [null, 92, 92, 'தசைப் பலன்கள் (பிருஹத் பராசரம்)', 'Dasha Results'],
  ] },
  // PL9's shorter print (meera_HC2): the same dates in its compact layouts
  { key: 'short', ta: 'சுருக்கமான தசை அமைப்பு', icon: '🗒️', tone: 'teal', items: [
    [null, 93, 97, 'விம்சோத்தரி — புக்தி, அந்தரம் (சுருக்கம்)', 'Vimshottari (Short) AD and PD'],
    [null, 98, 99, 'யோகினி — தசை, புக்தி (சுருக்கம்)', 'Yogini (Short) MD and AD'],
  ] },
  // the HP1 print's per-antardasha results, from BPHS ch.52-60 (extraPages.js)
  { key: 'antardasha', ta: 'புக்தி, பிரத்யந்தரப் பலன்கள் (பிருஹத் பராசரம்)', icon: '📖', tone: 'saffron', items: [
    [null, 100, 108, 'புக்திப் பலன்கள் — ஒவ்வொரு மகாதசைக்கும் ஒரு பக்கம் (பிருஹத் பராசரம், அத். 52–60)', 'Antardasha Results'],
    [null, 109, 117, 'பிரத்யந்தரப் பலன்கள் — ஒவ்வொரு மகாதசைக்கும் ஒரு பக்கம் (பிருஹத் பராசரம், அத். 61)', 'Pratyantardasha Results'],
  ] },
];

/**
 * The catalogue, each item with the registry sections that build its pages (section ids are "p" and the sample's page number).
 * An item is `built` when at least one of its pages is, and `complete` when all are; a run of pages is picked as one item.
 */
function bookCatalogue() {
  const builtIds = new Set(BOOK_SECTIONS.map((s) => s.id));
  return FAMILIES.map((f) => ({
    key: f.key, ta: f.ta, icon: f.icon, tone: f.tone,
    items: f.items.map(([, from, to, ta, en]) => {
      const sections = [];
      for (let n = from; n <= to; n += 1) if (builtIds.has(`p${n}`)) sections.push(`p${n}`);
      return {
        id: from === to ? `p${from}` : `pages-${from}-${to}`,
        from, to, pages: to - from + 1, ta, en,
        sections,
        built: sections.length > 0,
        complete: sections.length === to - from + 1,
      };
    }),
  }));
}

module.exports = { bookCatalogue };
