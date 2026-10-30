/**
 * The classical reading behind the KP chart (kpSystem.js): K.S. Krishnamurti, Reader III "Predictive Stellar Astrology",
 * read in the scan on 2026-10-23. The engine was ported from earlier software; test-kp-source.js now checks it against the book.
 */
const SOURCE = {
  title: 'Krishnamurti Padhdhati, Reader III: Predictive Stellar Astrology',
  author: 'K.S. Krishnamurti',
  tradition: 'Krishnamurti Paddhati (KP)',
  file: 'C22-kp-reader-3-predictive-stellar-astrology-krishnamurti.pdf',
  pageLocus: 'Chapter "Krishnamurti Padhdhati", printed pp.11-13: each star is cut into nine subs in the Vimshottari proportion (Sun 40 minutes, Moon 1d6\'40", Mars and Ketu 46\'40", Rahu 2d, Jupiter 1d46\'40", Saturn 2d6\'40", Mercury 1d53\'40", Venus 2d13\'20"), the first sub the star lord\'s and the rest in Vimshottari order; 249 sign-star-sub combinations, not 243; printed p.393: the 206th sub begins at Capricorn 26d6\'40", Krishnamurti ayanamsa 23d20\' for 1969, cusps from Raphael\'s Table of Houses less the ayanamsa; printed p.481: the 1922 chart with ayanamsa 22d40\'',
};

module.exports = { SOURCE };
