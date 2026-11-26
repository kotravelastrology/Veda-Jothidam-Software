'use strict';

/**
 * The last computed result of a card, kept on this device so that with no connection the card can show it, marked with the time it was
 * computed (the home page's "இன்று உங்களுக்கு"). One copy per storage key, for one subject (`subject`: which chart and which settings),
 * so a copy is never shown for another chart. Storage that fails (private window, full, blocked) is ignored: the card then just says it
 * could not compute.
 */

/** The subject of a chart's result: the birth moment and place and the settings it was computed with. */
function chartSubject(input, extra = {}) {
  const pick = (o, keys) => Object.fromEntries(keys.filter((k) => o && o[k] !== undefined).map((k) => [k, o[k]]));
  return JSON.stringify({
    ...pick(input, ['year', 'month', 'day', 'hour', 'minute', 'second', 'latitude', 'longitude', 'utcOffsetMinutes', 'ayanamsha', 'nodeType', 'houseSystem']),
    ...extra,
  });
}

/**
 * @param {Storage|undefined|null} storage
 * @param {string} storageKey
 * @param {string} subject
 * @param {unknown} data
 * @param {number} [now]
 */
function saveCopy(storage, storageKey, subject, data, now = Date.now()) {
  try {
    storage?.setItem(storageKey, JSON.stringify({ subject, savedAt: now, data }));
    return true;
  } catch {
    return false;
  }
}

/** The kept copy for this subject, or null (none, another subject's, or unreadable). */
function readCopy(storage, storageKey, subject) {
  try {
    const v = JSON.parse(storage?.getItem(storageKey) ?? 'null');
    if (!v || v.subject !== subject || !Number.isFinite(v.savedAt) || v.data == null) return null;
    return { savedAt: v.savedAt, data: v.data };
  } catch {
    return null;
  }
}

module.exports = { chartSubject, saveCopy, readCopy };
