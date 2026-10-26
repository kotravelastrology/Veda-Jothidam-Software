'use server';

import type { BirthFormInput } from '../report/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createChartContext } = require('../../src/contracts/chartContext');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { eventChart } = require('../../src/report/eventChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { describeMatchParty } = require('../../src/report/matchParties');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { openLibrary } = require('../../src/library/chartRepository');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveLibraryPath } = require('../../src/library/libraryPath');

export interface EventInput {
  name: string;
  year: number; month: number; day: number; hour: number; minute: number; second?: number;
  latitude: number; longitude: number; utcOffsetMinutes: number; placeName?: string;
}
export interface EventsRequest {
  profile?: { profileId: string; revision?: number };
  form?: BirthFormInput;
  events: EventInput[];
}

/** Each event set against the birth chart (PL9 worksheets 116-123). At most twenty events. */
export async function computeEvents(req: EventsRequest) {
  let input: BirthFormInput;
  let profile: any = null;
  if (req.profile) {
    const library = openLibrary(resolveLibraryPath());
    try {
      const p = library.getProfile(req.profile.profileId, req.profile.revision);
      if (!p) throw new Error(`சுயவிவரம் கிடைக்கவில்லை: ${req.profile.profileId}`);
      input = { ...p.input, ...p.settings };
      profile = p;
    } finally { library.close(); }
  } else if (req.form) {
    input = req.form;
  } else {
    throw new Error('ஒரு சுயவிவரம் அல்லது பிறப்பு விவரம் தேவை.');
  }
  const ctx = createChartContext({ ...input, calendarMode: 'tirukanita' });
  const chart = calculateParashariChart(ctx);
  const events = req.events.slice(0, 20).map((e) => {
    const bad = [e.year, e.month, e.day, e.hour, e.minute, e.latitude, e.longitude, e.utcOffsetMinutes].some((x) => !Number.isFinite(x));
    if (bad) throw new Error(`நிகழ்வு "${e.name}": தேதி, நேரம், இடம் முழுமையாக இல்லை.`);
    const r = eventChart({ natal: { ctx, chart }, event: e });
    const { eventCtx, eventChart: ec, ...out } = r;
    return { ...out, name: e.name, placeName: e.placeName ?? '', raw: { chart: { lagna: { rasiIndex: ec.lagna.rasiIndex }, grahas: Object.fromEntries(Object.entries(ec.grahas).map(([k, g]: [string, any]) => [k, { rasiIndex: g.rasiIndex, degreeInSign: g.degreeInSign, house: g.house }])) } } };
  });
  return JSON.parse(JSON.stringify({ events, native: describeMatchParty(input, ctx, profile), natalLagnaSign: chart.lagna.rasiIndex, natalMoonSign: chart.grahas.Moon.rasiIndex }));
}
