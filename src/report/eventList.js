const { ABBR } = require('../worksheet/dashaList');
const { RASI_TA_SHORT: SIGN_SHORT } = require('../sources/tamilNames');

/**
 * The event list of PL9's "Events 1-10" and "Events 11-20" worksheets (user guide ch.8, "Displaying Dashas for Specific Events"):
 * every event in one row, with the dashas of each system, to five levels, running at that event. The guide's systems are Vimshottari,
 * Yogini, Chara, Ashtottari, Sthira, Shatabdika and Kalachakra; the rows are read from computeEvents' output (eventChart.js
 * `dashas`), nothing is calculated here. No dependency on the engines, so the browser can use it.
 *
 * The events are the person's list in the order it is kept (sortable by date, as in PL9): slots 1-10 are the first ten, 11-20 the next.
 */

const MAX_EVENTS = 20;

/**
 * The slice of the list a worksheet shows: '1-10' is the first ten, '11-20' the next ten, anything else (or none) the whole list.
 * @returns {{from: number, to: number}} from inclusive, to exclusive, both within the list
 */
function slotRange(range, total) {
  if (range === '1-10') return { from: 0, to: Math.min(10, total) };
  if (range === '11-20') return { from: Math.min(10, total), to: Math.min(20, total) };
  return { from: 0, to: Math.min(MAX_EVENTS, total) };
}

const planets = (chain) => (chain ?? []).map((d) => ABBR[d.lord]);
const signs = (chain) => (chain ?? []).map((d) => SIGN_SHORT[d.sign]);

/**
 * One event's row: for each system the lords (planets) or signs in order from the main period inwards.
 * `shatabdikaApplies` is whether the ascendant is vargottama, the book's condition for this dasha; the others have none here.
 * @param {{dashas: object}} ev one entry of computeEvents' `events`
 */
function eventListRow(ev) {
  const d = ev.dashas;
  const kc = d.kalachakra;
  return {
    vimshottari: planets(d.vimshottari),
    yogini: planets(d.yogini5),
    ashtottari: planets(d.ashtottari5),
    chara: d.chara ? [SIGN_SHORT[d.chara.sign]] : [],
    sthira: d.sthira ? [SIGN_SHORT[d.sthira.sign]] : [],
    shatabdika: planets(d.shatabdika5?.chain),
    shatabdikaApplies: Boolean(d.shatabdika5?.applies?.applies),
    kalachakra: kc ? [SIGN_SHORT[kc.maha.rasiIndex], ...(kc.bhukti ? [SIGN_SHORT[kc.bhukti.rasiIndex]] : [])] : [],
    narayana: signs(d.narayana5),
    jaiminiSthira: signs(d.jaiminiSthira5),
  };
}

module.exports = { MAX_EVENTS, SIGN_SHORT, slotRange, eventListRow };
