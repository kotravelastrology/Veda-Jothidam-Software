'use strict';

/**
 * The words of the notifications (src/notify/scheduler.js sends them). Facts the program already computes, nothing judged: the day's
 * panchangam as the home page shows it (app/todayActions.ts), and the start of a dasha period as the dasha page shows it
 * (src/dasha/dashaDrill.js). Each message is { title, body, url, tag }: the service worker (public/sw.js) shows the title and body,
 * opens `url` on a tap, and lets a later message with the same `tag` replace an earlier one.
 */
const { dateTa } = require('../ui/panchangamShare');
const { PLANET_TA, DASHA_LEVEL_TA } = require('../sources/tamilNames');

/** The morning message: the five limbs with the time each ends, and Rahu kalam and Yamagandam. */
function dailyMessage(today) {
  const until = (x) => (x.until ? ` (${x.until} வரை)` : '');
  return {
    title: `🗓️ இன்றைய பஞ்சாங்கம் — ${today.weekdayTa}, ${dateTa(today.date)}`,
    body: [
      `📍 ${today.placeName} · 🌅 உதயம் ${today.sunrise}`,
      `திதி: ${today.tithi.paksha} ${today.tithi.name}${until(today.tithi)}`,
      `நட்சத்திரம்: ${today.nakshatra.name}${until(today.nakshatra)} · யோகம்: ${today.yoga.name}`,
      `ராகு காலம்: ${today.rahuKalam} · எமகண்டம்: ${today.yamagandam}`,
    ].join('\n'),
    url: '/',
    tag: `panchangam-${today.date}`,
  };
}

/** "HH:MM" and "YYYY-MM-DD" of an instant in an IANA zone. */
function localParts(ms, timeZone) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date(ms))
      .map((p) => [p.type, p.value]),
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, hm: `${parts.hour}:${parts.minute}` };
}

/**
 * The notice of a dasha change, sent on the morning of the day it falls on (see noticeTime).
 * @param {{ name: string, change: { atMs: number, level: number, chain: { lord: string }[] }, timeZone: string }} p
 */
function dashaMessage({ name, change, timeZone }) {
  const { date, hm } = localParts(change.atMs, timeZone);
  const levelTa = DASHA_LEVEL_TA[change.level - 1];
  const chainTa = change.chain.map((p, i) => `${PLANET_TA[p.lord]} ${DASHA_LEVEL_TA[i]}`).join(' – ');
  return {
    title: `⏳ ${name}: ${PLANET_TA[change.chain[change.level - 1].lord]} ${levelTa} தொடக்கம்`,
    body: `${dateTa(date)} ${hm} முதல் (உங்கள் நேரப்படி): ${chainTa}.\nவிம்சோத்தரி தசை · விவரம் தசைப் பக்கத்தில்.`,
    url: '/dasha-timeline',
    tag: `dasha-${change.atMs}`,
  };
}

/**
 * When a change is announced: at the reader's morning time ("HH:MM") on the local day of the change, so a change at 3 a.m. is not a
 * notification at 3 a.m.; a change before that time on its day is told at that time with its own hour in the text.
 * @returns {number} epoch ms
 */
function noticeTime(atMs, timeZone, morning = '06:00') {
  const { date } = localParts(atMs, timeZone);
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = morning.split(':').map(Number);
  // The zone's offset on that day, read from the zone: guess as UTC, then correct by the difference the zone shows
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const seen = localParts(guess, timeZone);
  const [sy, sm, sd] = seen.date.split('-').map(Number);
  const [sh, smin] = seen.hm.split(':').map(Number);
  const shownAsUtc = Date.UTC(sy, sm - 1, sd, sh, smin);
  return guess - (shownAsUtc - guess);
}

const TEST_MESSAGE = Object.freeze({
  title: '🔔 Kotravel சோதனை அறிவிப்பு',
  body: 'அறிவிப்புகள் இந்தச் சாதனத்துக்கு வருகின்றன.',
  url: '/settings',
  tag: 'kotravel-test',
});

module.exports = { dailyMessage, dashaMessage, noticeTime, localParts, TEST_MESSAGE };
