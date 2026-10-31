/**
 * The open chart, without React: where it is kept and how a page finds it (see chartParty.ts for the hooks that use this).
 *
 * A chart chosen once (File > New, File > Open, a saved chart in a list, Ctrl+K) stays the open chart on every page, so no page asks
 * for the name, place, date and time again. It is kept in one place, the stash (`kotravel_current_chart`) that File > Save, Print,
 * Notes and Events already read: the birth details of a chart entered by hand or opened from the browser's library, or the saved
 * profile's id (a profile is read with the settings it was saved with). The stash is the browser's `localStorage`, looked up when
 * a function runs, so a test can give it a fake.
 */

const STASH_KEY = 'kotravel_current_chart';
/** The browser event sent whenever the open chart changes, so a part of the screen showing it (the toolbar) can follow. */
const CHANGE_EVENT = 'kotravel:open-chart';

function notify() {
  try {
    if (typeof globalThis.dispatchEvent === 'function' && typeof globalThis.CustomEvent === 'function') globalThis.dispatchEvent(new globalThis.CustomEvent(CHANGE_EVENT));
  } catch { /* nothing is listening */ }
}

/**
 * @typedef {{name: string, gender?: string, dateOfBirth: string, timeOfBirth: string, place: string, latitude: number, longitude: number, utcOffset: number}} StashBirth
 * @typedef {{name: string, gender: string, year: number, month: number, day: number, hour: number, minute: number, placeName: string, latitude: number, longitude: number, utcOffsetMinutes: number, ianaTimeZone: string}} BirthInput
 * @typedef {{profileId: string, revision: number, name: string, birthDate: string | null, placeName: string | null}} OpenProfile
 * @typedef {{kind: 'profile', profileId: string, revision: number, label: string, name: string, birthDate: string | null, placeName: string | null}} ProfileParty
 * @typedef {{kind: 'form', input: BirthInput, label: string}} FormParty
 */

/**
 * A chart saved in the browser (File > Save, Open) as the form input the calculations take.
 * @param {StashBirth} bd
 * @param {string} [gender]
 * @returns {BirthInput}
 */
function inputFromSaved(bd, gender) {
  const [year, month, day] = bd.dateOfBirth.split('-').map(Number);
  const [hour, minute] = bd.timeOfBirth.split(':').map(Number);
  return {
    name: bd.name, gender: gender ?? bd.gender ?? 'male', year, month, day, hour, minute: minute ?? 0, placeName: bd.place,
    latitude: Number(bd.latitude), longitude: Number(bd.longitude), utcOffsetMinutes: Number(bd.utcOffset), ianaTimeZone: 'Asia/Kolkata',
  };
}

/** @returns {Record<string, any> | null} */
function readStash() {
  try {
    const raw = globalThis.localStorage.getItem(STASH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function birthDataOf(b) {
  const pad = (n) => String(n).padStart(2, '0');
  return {
    name: b.name, gender: b.gender, dateOfBirth: `${b.year}-${pad(b.month)}-${pad(b.day)}`, timeOfBirth: `${pad(b.hour)}:${pad(b.minute)}`,
    place: b.placeName, latitude: b.latitude, longitude: b.longitude, utcOffset: b.utcOffsetMinutes,
  };
}

/**
 * Makes this person the open chart (and the chart the menus Save, Print, Notes and Events act on), keeping that chart's notes and
 * events when it is the same person as before. `profile` is the saved profile it was read from, if it was.
 * @param {{name: string, gender?: string, year: number, month: number, day: number, hour: number, minute: number, placeName: string, latitude: number, longitude: number, utcOffsetMinutes: number}} b
 * @param {OpenProfile | null} [profile]
 */
function writeStash(b, profile = null) {
  const birthData = birthDataOf(b);
  try {
    const prior = readStash();
    const same = prior?.birthData && prior.birthData.name === birthData.name && prior.birthData.dateOfBirth === birthData.dateOfBirth
      && prior.birthData.timeOfBirth === birthData.timeOfBirth;
    const { profile: _old, ...kept } = same ? prior : {};
    globalThis.localStorage.setItem(STASH_KEY, JSON.stringify({ ...kept, birthData, ...(profile ? { profile } : {}), selectedChartId: 'D1-rasi' }));
    notify();
  } catch { /* the menus then ask for a chart, as before */ }
}

/**
 * A saved profile became the open chart before its birth details are known here; the page that computes it adds them (writeStash).
 * Another person's details are dropped, the same profile's are kept.
 * @param {OpenProfile} profile
 */
function writeStashProfile(profile) {
  try {
    const prior = readStash();
    const same = prior?.profile?.profileId === profile.profileId;
    globalThis.localStorage.setItem(STASH_KEY, JSON.stringify({ ...(same ? prior : {}), profile, selectedChartId: 'D1-rasi' }));
    notify();
  } catch { /* nothing to remember */ }
}

/**
 * A saved profile as the person a page can use.
 * @param {OpenProfile} p
 * @returns {ProfileParty}
 */
function profileParty(p) {
  return { kind: 'profile', profileId: p.profileId, revision: p.revision, label: p.name, name: p.name, birthDate: p.birthDate, placeName: p.placeName };
}

/**
 * The open chart as a person a page can use: the stash first (it is written whenever a chart is chosen), then the workspace's
 * active profile. Null when nothing is open.
 * @param {OpenProfile | null} activeProfile
 * @returns {ProfileParty | FormParty | null}
 */
function resolveOpenParty(activeProfile) {
  const stash = readStash();
  if (stash?.profile) return profileParty(stash.profile);
  if (stash?.birthData) return { kind: 'form', input: inputFromSaved(stash.birthData), label: stash.birthData.name };
  return activeProfile ? profileParty(activeProfile) : null;
}

/** Forgets the open chart (File > Close). */
function clearStash() {
  try { globalThis.localStorage.removeItem(STASH_KEY); } catch { /* storage unavailable */ }
  notify();
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * The open chart in the words of the line under the toolbar, as PL9 writes it ("Aniruddha 5 Oct 1990 04:30:00 Chennai"): the name
 * and the birth date, time and place as far as they are known. Null when nothing is open.
 * @param {OpenProfile | null} activeProfile
 * @returns {{name: string, line: string} | null}
 */
function describeOpenChart(activeProfile) {
  const stash = readStash();
  const bd = stash?.birthData;
  const prof = stash?.profile ?? (bd ? null : activeProfile);
  if (!bd && !prof) return null;
  const name = bd?.name ?? prof.name;
  let line = '';
  if (bd) {
    const [y, m, d] = bd.dateOfBirth.split('-').map(Number);
    const time = bd.timeOfBirth.length === 5 ? `${bd.timeOfBirth}:00` : bd.timeOfBirth;
    line = `${d} ${MONTHS[m - 1]} ${y} ${time}${bd.place ? ` ${bd.place}` : ''}`;
  } else if (prof.birthDate) {
    const [y, m, d] = prof.birthDate.split('-').map(Number);
    line = `${d} ${MONTHS[m - 1]} ${y}${prof.placeName ? ` ${prof.placeName}` : ''}`;
  }
  return { name, line };
}

module.exports = { STASH_KEY, CHANGE_EVENT, inputFromSaved, readStash, writeStash, writeStashProfile, profileParty, resolveOpenParty, clearStash, describeOpenChart };
