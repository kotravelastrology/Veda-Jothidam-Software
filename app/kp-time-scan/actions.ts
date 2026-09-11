'use server';

/* eslint-disable @typescript-eslint/no-var-requires */
const { loadEvents } = require('../../src/report/kpEvents');
const { searchCandidateWindows } = require('../../src/report/kpTimeScan');

export async function listKpEvents() {
  return JSON.parse(JSON.stringify(
    loadEvents().filter((e: any) => e.rules.length).map((e: any) => ({ key: e.key, name: e.name, nameTa: e.nameTa })),
  ));
}

export interface KpTimeScanQuery {
  eventKey: string;
  startISO: string;   // 'YYYY-MM-DDTHH:MM'
  endISO: string;
  latitude: number;
  longitude: number;
  utcOffsetMinutes: number;
  stepMinutes?: number;
  monetaryGain?: boolean;
}

export async function computeKpTimeScan(q: KpTimeScanQuery) {
  const event = loadEvents().find((e: any) => e.key === q.eventKey);
  if (!event) return { available: false, error: 'நிகழ்வு கிடைக்கவில்லை' };
  const res = searchCandidateWindows(event, q);
  return JSON.parse(JSON.stringify({ ...res, eventName: event.name, eventNameTa: event.nameTa }));
}
