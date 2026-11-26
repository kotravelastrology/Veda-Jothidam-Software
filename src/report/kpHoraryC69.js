/**
 * Two horary questions the KP-Ezine compilation (C69, Series 1, edited by Kanak Bosmia) states under the Seventh and Eighth Bhavas. The lines are in the article
 * "Matters Controlled by BHAVAS" by Kuppu Ganapathi, printed pp.8-9; each entry is cited to the compilation, by that article's author and printed page (the registry's rule
 * for C69). The book states the houses only; where it gives a condition, the `rule` is the one the text states (see kpHoraryMore.js for the shape). Nothing here is an answer:
 * the page gives no verdict.
 */
const { citeTa } = require('../sources/citeTa');
const { R } = require('./kpHoraryMore');

const C69_SOURCE = {
  title: 'Compilation of Articles Published in KP-Ezine, Series 1',
  author: 'Kuppu Ganapathi',
};
const citation = (page) => citeTa({ ...C69_SOURCE, pageLocus: `printed p.${page}` });

/** Same shape as the entries of kpHoraryTopics.js, plus `citation`. */
const C69_TOPICS = [
  {
    id: 'LOST_PROPERTY_C69',
    titleTa: 'திருடு போன பொருள்: திருடனும் பொருள் இருக்கும் இடமும்',
    houses: [1, 4, 7, 8],
    page: 8,
    reasonTa: 'லக்னம் பொருளின் உரிமையாளர்; 4 பொருள் இருக்கும் இடம்; 7 திருடன்; 8 திருடப்பட்ட பொருளின் விவரங்கள். நூல் இதற்கு நிபந்தனை எதுவும் கூறவில்லை.',
    rules: [],
    citation: citation(8),
  },
  {
    id: 'PARTICULAR_PARTNER_C69',
    titleTa: 'ஒரு குறிப்பிட்ட பெண் அல்லது ஆணை அனுபவிப்பாரா',
    houses: [5, 8, 11],
    page: 9,
    reasonTa: 'எட்டாம் வீட்டின் கஸ்ப் உப அதிபதி 5, 11 இரண்டையும் குறிக்க வேண்டும்; அப்போது ஒரு குறிப்பிட்ட பெண் அல்லது ஆணை அனுபவிப்பார்.',
    rules: [
      R(8, 'SUB', { all: [5, 11] }, '8-ஆம் கஸ்ப் உப அதிபதி 5, 11 இரண்டையும் குறிக்கிறார்: நூல் — ஒரு குறிப்பிட்ட பெண்/ஆணை அனுபவிப்பார் (ப.9)'),
    ],
    citation: citation(9),
  },
];

module.exports = { C69_TOPICS, C69_SOURCE };
