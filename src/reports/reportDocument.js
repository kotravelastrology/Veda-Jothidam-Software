const { UnsupportedInputError } = require('../contracts/chartContext');
const { assertChartSnapshot } = require('../contracts/chartSnapshot');

const REPORT_DOCUMENT_VERSION = 'VJ019-DOC-001';

/**
 * VJ-019 — ReportDocument.
 *
 * A report is a rendering of a VJ-006 ChartSnapshot (ADR-07), not a live
 * recompute. The document therefore carries the `snapshotId` it was built
 * from, so a PDF handed to a client can be traced back to exactly the chart
 * that produced it even after the birth time is later rectified.
 *
 * Nothing here reads the clock. `generatedAtMs` is a parameter, because a
 * document built twice from the same snapshot must be byte-identical — that
 * is what makes "this PDF matches that reading" a checkable claim.
 */

const SECTION_KINDS = ['table', 'keyValue', 'evidence', 'text'];

function buildReportDocument({ snapshot, subject, generatedAtMs = null, title = null }) {
  assertChartSnapshot(snapshot, 'snapshot');
  if (!subject || !subject.name) {
    throw new UnsupportedInputError('subject.name is required', 'subject');
  }

  const v = snapshot.values;
  const sections = [];

  sections.push({
    id: 'birth',
    kind: 'keyValue',
    heading: 'பிறப்பு விவரம்',
    rows: [
      ['பெயர்', subject.name],
      ['தேதி', `${snapshot.input.year}-${String(snapshot.input.month).padStart(2, '0')}-${String(snapshot.input.day).padStart(2, '0')}`],
      ['நேரம்', `${String(snapshot.input.hour).padStart(2, '0')}:${String(snapshot.input.minute ?? 0).padStart(2, '0')}`],
      ['இடம்', snapshot.input.placeName ?? '—'],
      ['அட்சரேகை / தீர்க்கரேகை', `${snapshot.input.latitude}° / ${snapshot.input.longitude}°`],
      ['அயனாம்சம்', snapshot.settings.ayanamsha],
      ['பாவ முறை', snapshot.settings.houseSystem],
    ],
  });

  if (Array.isArray(v.natal)) {
    sections.push({
      id: 'natal',
      kind: 'table',
      heading: 'ஜனன நிலை',
      columns: ['கிரகம்', 'ராசி', 'பாகை', 'பாவம்'],
      rows: v.natal.map((g) => [
        g.id, g.rasi, formatDegree(g.degreeInSign), String(g.house),
      ]),
    });
  }

  if (v.vargaKeys && v.vargas) {
    sections.push({
      id: 'vargas',
      kind: 'table',
      heading: 'வர்கங்கள்',
      // A wide table is the classic clipping hazard, so the renderer is told
      // this one is wide and must be allowed to scale rather than overflow.
      wide: true,
      columns: ['கிரகம்', ...v.vargaKeys],
      rows: v.natal.map((g) => [g.id, ...v.vargaKeys.map((k) => v.vargas[g.id][k].sign)]),
    });
  }

  if (v.ashtakavarga) {
    sections.push({
      id: 'ashtakavarga',
      kind: 'table',
      heading: 'அஷ்டகவர்க்கம்',
      columns: ['ராசி', 'பிந்து'],
      rows: v.ashtakavarga.sarva.map((n, i) => [String(i + 1), String(n)])
        .concat([['மொத்தம்', String(v.ashtakavarga.total)]]),
    });
  }

  if (Array.isArray(snapshot.evidence) && snapshot.evidence.length) {
    sections.push({
      id: 'evidence',
      kind: 'evidence',
      heading: 'ஆதாரம்',
      entries: snapshot.evidence.map((e) => ({
        name: e.name,
        status: e.status,
        locator: e.status === 'SOURCE_REQUIRED'
          ? (e.reason || 'ஆதாரம் தேவை')
          : `${e.source.title} — ${e.source.pageLocus}`,
      })),
    });
  }

  for (const section of sections) {
    if (!SECTION_KINDS.includes(section.kind)) {
      throw new UnsupportedInputError(`unknown section kind: ${section.kind}`, 'kind');
    }
  }

  return Object.freeze({
    documentVersion: REPORT_DOCUMENT_VERSION,
    snapshotId: snapshot.snapshotId,
    engineVersion: snapshot.engineVersion,
    settings: snapshot.settings,
    title: title ?? `${subject.name} — ஜாதக அறிக்கை`,
    subject: Object.freeze({ ...subject }),
    generatedAtMs,
    sections: Object.freeze(sections),
  });
}

function formatDegree(d) {
  const deg = Math.floor(d);
  const min = Math.floor((d - deg) * 60);
  const sec = Math.round((((d - deg) * 60) - min) * 60);
  return `${deg}°${String(min).padStart(2, '0')}'${String(sec).padStart(2, '0')}"`;
}

module.exports = { buildReportDocument, REPORT_DOCUMENT_VERSION, SECTION_KINDS, formatDegree };
