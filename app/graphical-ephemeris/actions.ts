'use server';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { julianDay } = require('@swisseph/node');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const G = require('../../src/chart/graphicalEphemeris');

const PLANET_TA: Record<string, string> = { Sun: 'சூரியன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' };
const SIGN_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];

export interface EphemerisRequest {
  year: number;
  month: number;
  years: number;
  planets: string[];
  ayanamsha: string;
  nodeType: 'mean' | 'true';
  utcOffsetMinutes: number;
}

/** Longitudes over a span, ready to draw, plus the ingress and station list. */
export async function computeGraphicalEphemeris(req: EphemerisRequest) {
  const years = Math.min(Math.max(Math.round(req.years), 1), 10);
  const startJd = julianDay(req.year, req.month, 1, 0);
  const endJd = julianDay(req.year + years, req.month, 1, 0);
  const days = Math.round(endJd - startJd);
  const planets = req.planets.filter((p) => G.PLANETS.includes(p));
  const { series, events } = G.graphicalEphemeris({ startJd, days, planets, ayanamsha: req.ayanamsha, nodeType: req.nodeType });
  const stride = years > 3 ? 2 : 1;
  const out: Record<string, number[][]> = {};
  for (const [p, pts] of Object.entries(series) as [string, number[][]][]) {
    out[p] = pts.filter((_, i) => i % stride === 0).map(([jd, lon]) => [Math.round((jd - startJd) * 100) / 100, Math.round(lon * 1000) / 1000]);
  }
  return JSON.parse(JSON.stringify({
    startJd, days, startLabel: G.jdToLocal(startJd, 0).slice(0, 10),
    series: out,
    events: events.map((e: any) => ({
      planet: e.planet, planetTa: PLANET_TA[e.planet], kind: e.kind, backward: !!e.backward,
      day: Math.round((e.jd - startJd) * 100) / 100,
      when: G.jdToLocal(e.jd, req.utcOffsetMinutes),
      signTa: SIGN_TA[e.sign],
      degree: Math.round((e.longitude % 30) * 100) / 100,
    })),
  }));
}
