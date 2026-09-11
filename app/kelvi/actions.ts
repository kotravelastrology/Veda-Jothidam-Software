'use server';

import { buildReportData } from '../../src/report/reportData';
import type { BirthFormInput } from '../report/actions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { answerQuestion, classifyQuestion, TOPICS } = require('../../src/report/answerEngine');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { computeTransitPositions } = require('../../src/report/transitPositions');

const norm360 = (d: number) => ((d % 360) + 360) % 360;

/** Suggested questions for the UI — one per topic, in Tamil. */
export async function listTopics() {
  return (TOPICS as { id: string; ta: string; en: string }[]).map((t) => ({ id: t.id, ta: t.ta, en: t.en }));
}

/**
 * Build the native's report, then adjudicate `question` against it at `whenISO`
 * (default: now), including the gochara stage from real Swiss-Ephemeris transits.
 * Returns the reading plus the D1 chart (for the question view's chart box) —
 * not the whole report.
 */
export async function computeAnswer(input: BirthFormInput, question: string, whenISO?: string) {
  if (!question || !question.trim()) {
    return { matched: false, question: '', topics: [], note: 'கேள்வியை உள்ளிடவும்.' };
  }
  const routed = classifyQuestion(question);
  if (!routed.length) {
    return {
      matched: false,
      question,
      topics: [],
      note: 'இந்தக் கேள்வியை அறியப்பட்ட தலைப்புகளுடன் பொருத்த முடியவில்லை. கீழே உள்ள தலைப்புகளில் ஒன்றைத் தேர்ந்தெடுக்கவும்.',
    };
  }

  const report = buildReportData(input);
  const when = whenISO ? new Date(whenISO) : new Date();
  const nowMs = when.getTime();

  const tp = computeTransitPositions(when, {
    latitude: input.latitude,
    longitude: input.longitude,
    ayanamsha: input.ayanamsha || 'Lahiri',
    nodeType: input.nodeType || 'mean',
  });
  const transitRasis: Record<string, number> = {};
  for (const p of tp.planets) transitRasis[p.planet] = Math.floor(norm360(p.longitude) / 30);

  const result = answerQuestion(report, question, { nowMs, transitRasis });
  return JSON.parse(JSON.stringify({ ...result, whenISO: when.toISOString(), chart: report.chart }));
}
