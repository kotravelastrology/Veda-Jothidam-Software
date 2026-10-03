/**
 * VJ-018 — who the two sides of a match are, and a guard that they are two.
 *
 * A porutham screen showing only "7/10 · மத்திமம்" is unreadable a week later:
 * whose match, computed from which birth details, under which ayanamsha. The
 * acceptance criterion "location/date/method visible" is about exactly that,
 * and the description travels with the result rather than being assembled by
 * whichever page happens to render it.
 */

const { UnsupportedInputError } = require('../contracts/chartContext');

const pad = (n) => String(n).padStart(2, '0');

/** Minutes east of UTC as "+05:30", which is how a birth record is read aloud. */
function formatOffset(minutes) {
  if (minutes === null || minutes === undefined) return null;
  const sign = minutes < 0 ? '-' : '+';
  const abs = Math.abs(minutes);
  return `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}

/** Signed degrees as "13.0827°N", so a transposed sign is visible on screen. */
function formatLatitude(value) {
  return `${Math.abs(value).toFixed(4)}°${value < 0 ? 'S' : 'N'}`;
}

function formatLongitude(value) {
  return `${Math.abs(value).toFixed(4)}°${value < 0 ? 'W' : 'E'}`;
}

/**
 * @param input    the birth input the match was computed from
 * @param context  the ChartContext, so the *effective* method is reported —
 *                 not the page's intent, which may have been defaulted
 * @param profile  the library profile, when the party came from the library
 */
function describeMatchParty(input, context, profile = null) {
  if (!input) throw new UnsupportedInputError('a birth input is required', 'input');

  return {
    name: profile?.name ?? input.name ?? null,
    profileId: profile?.profileId ?? null,
    revision: profile?.revision ?? null,
    source: profile ? 'library' : 'form',
    date: `${input.year}-${pad(input.month)}-${pad(input.day)}`,
    time: `${pad(input.hour)}:${pad(input.minute ?? 0)}`,
    utcOffset: formatOffset(input.utcOffsetMinutes),
    ianaTimeZone: input.ianaTimeZone ?? null,
    placeName: profile?.placeName ?? input.placeName ?? null,
    latitude: formatLatitude(input.latitude),
    longitude: formatLongitude(input.longitude),
    // From the context, so what is displayed is what was actually used.
    method: {
      ayanamsha: context.ayanamsha,
      houseSystem: context.houseSystem,
      nodeType: context.nodeType,
      calendarMode: context.calendarMode,
    },
  };
}

/** The birth moment and place, to the minute — a party's identity for matching. */
const momentKey = (i) => [
  i.year, i.month, i.day, i.hour, i.minute ?? 0,
  i.utcOffsetMinutes ?? 0,
  Number(i.latitude).toFixed(4), Number(i.longitude).toFixed(4),
].join('|');

/**
 * Refuses a match of someone against themselves.
 *
 * Two ways that happens, and both are caught: the same profile picked on both
 * sides, and the same birth details entered twice (or saved twice under
 * different names). A self-match is not a low score — several poruthams pass
 * trivially when both stars are identical, so it reads as a *good* match. That
 * is worse than an error.
 */
function assertDistinctParties(girl, boy, refs = {}) {
  if (refs.girlProfileId && refs.girlProfileId === refs.boyProfileId) {
    throw new UnsupportedInputError(
      `ஒரே சுயவிவரம் இருபக்கமும் தேர்ந்தெடுக்கப்பட்டுள்ளது (${refs.girlName ?? refs.girlProfileId}). `
      + 'பொருத்தத்திற்கு வெவ்வேறு இரு நபர்கள் தேவை.',
      'profileId',
    );
  }
  if (girl && boy && momentKey(girl) === momentKey(boy)) {
    throw new UnsupportedInputError(
      'இரு பக்கத்திலும் ஒரே பிறப்பு விவரம் (நாள், நேரம், இடம்) அளிக்கப்பட்டுள்ளது. '
      + 'பொருத்தத்திற்கு வெவ்வேறு இரு நபர்கள் தேவை.',
      'birthInput',
    );
  }
}

module.exports = {
  describeMatchParty,
  assertDistinctParties,
  formatOffset,
  formatLatitude,
  formatLongitude,
};
