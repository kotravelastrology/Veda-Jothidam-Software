/**
 * VJ-019 — produces a real PDF from a ReportDocument, headlessly, and checks
 * the bytes.
 *
 * Runs in Electron so Chromium does the text shaping. Tamil vowel signs
 * reorder and consonants form ligatures; a JavaScript PDF library that places
 * glyphs without shaping would emit disconnected marks that look like text
 * but are not. Chromium goes through HarfBuzz, and `printToPDF` embeds the
 * fonts it used.
 */
const { app, BrowserWindow } = require('electron');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const repoRoot = path.join(__dirname, '..', '..');
const { createCalculationRequest } = require(path.join(repoRoot, 'src/contracts/calculationRequest'));
const { createChartSnapshot } = require(path.join(repoRoot, 'src/contracts/chartSnapshot'));
const { createRuleEvidence, withheldEvidence } = require(path.join(repoRoot, 'src/contracts/ruleEvidence'));
const { calculateParashariChart } = require(path.join(repoRoot, 'src/chart/parashariChart'));
const { calculateVargas } = require(path.join(repoRoot, 'src/chart/vargaChart'));
const { calculateAshtakavarga } = require(path.join(repoRoot, 'src/chart/ashtakavarga'));
const { buildReportDocument } = require(path.join(repoRoot, 'src/reports/reportDocument'));
const { renderReportHtml } = require(path.join(repoRoot, 'src/reports/renderReportHtml'));
const { inspectPdf } = require(path.join(repoRoot, 'src/reports/pdfBytes'));

const CLASSICAL = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const ALL = [...CLASSICAL, 'Rahu', 'Ketu'];

// A deliberately long Tamil name: the acceptance names long names as a hazard.
const LONG_NAME = 'திருமதி இராஜேஸ்வரி சுப்பிரமணியன் வேங்கடாசலபதி அருணாசலம் பிள்ளை';

function buildDocument() {
  const input = {
    year: 1990, month: 5, day: 15, hour: 10, minute: 30,
    ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
    latitude: 13.0827, longitude: 80.2707, placeName: 'சென்னை',
    ayanamsha: 'Lahiri', houseSystem: 'Porphyrius', nodeType: 'mean',
  };
  const request = createCalculationRequest({
    input,
    settings: { ayanamsha: 'Lahiri', houseSystem: 'Porphyrius', nodeType: 'mean' },
    outputs: ['parashariChart', 'vargas', 'ashtakavarga'],
  });
  const chart = calculateParashariChart(request.chartContext);

  const natal = ALL.map((id) => {
    const g = chart.grahas[id];
    return { id, longitude: g.longitude, rasi: g.rasi, rasiIndex: g.rasiIndex, degreeInSign: g.degreeInSign, house: g.house };
  });
  const vargas = Object.fromEntries(ALL.map((id) => {
    const g = chart.grahas[id];
    return [id, calculateVargas(g.rasiIndex, g.degreeInSign)];
  }));
  const lagnaVargas = calculateVargas(chart.lagna.rasiIndex, chart.lagna.degreeInSign);
  const vargaKeys = Object.keys(lagnaVargas).filter((k) => k !== 'source' && k !== 'D2');
  const ashtakavarga = calculateAshtakavarga({
    ...Object.fromEntries(CLASSICAL.map((p) => [p, chart.grahas[p].rasiIndex])),
    Lagna: chart.lagna.rasiIndex,
  });

  const snapshot = createChartSnapshot({
    request,
    values: {
      lagna: { longitude: chart.lagna.longitude, rasi: chart.lagna.rasi, rasiIndex: chart.lagna.rasiIndex, degreeInSign: chart.lagna.degreeInSign },
      natal, vargaKeys, vargas, lagnaVargas,
      ashtakavarga: {
        sarva: ashtakavarga.sarva, bhinna: ashtakavarga.bhinna,
        total: ashtakavarga.sarva.reduce((a, b) => a + b, 0),
      },
    },
    evidence: [
      createRuleEvidence({
        ruleId: 'VARGAS', name: 'வர்கங்கள்',
        outcome: { divisions: vargaKeys }, source: lagnaVargas.source,
      }),
      withheldEvidence({ ruleId: 'SHADBALA_TOTAL', name: 'ஷட்பல மொத்தம்', reason: 'BPHS Ayana Bala முரண்பாடு' }),
    ],
  });

  return buildReportDocument({
    snapshot,
    subject: { name: LONG_NAME },
    generatedAtMs: Date.UTC(2026, 8, 27, 12, 0, 0),
  });
}

app.disableHardwareAcceleration();

app.whenReady().then(async () => {
  const out = { electron: process.versions.electron };
  try {
    const doc = buildDocument();
    const html = renderReportHtml(doc);

    // Rendering twice from the same document must give the same bytes.
    out.htmlDeterministic = renderReportHtml(doc) === html;
    out.htmlBytes = Buffer.byteLength(html, 'utf8');
    out.snapshotId = doc.snapshotId.slice(0, 16);

    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vj019-'));
    const htmlPath = path.join(dir, 'report.html');
    fs.writeFileSync(htmlPath, html, 'utf8');

    const win = new BrowserWindow({ show: false, width: 1240, height: 1754 });
    await win.loadFile(htmlPath);

    // Measure the widest table against the printable area: a table wider than
    // the page is the clipping failure this must rule out.
    out.layout = await win.webContents.executeJavaScript(`(() => {
      const body = document.body;
      const widest = Math.max(...[...document.querySelectorAll('table')]
        .map(t => t.scrollWidth));
      return {
        bodyScrollWidth: body.scrollWidth,
        bodyClientWidth: body.clientWidth,
        widestTableScrollWidth: widest,
        h1ScrollWidth: document.querySelector('h1').scrollWidth,
        h1ClientWidth: document.querySelector('h1').clientWidth,
        tamilRendered: /[\\u0B80-\\u0BFF]/.test(document.body.innerText),
      };
    })()`);

    const pdf = await win.webContents.printToPDF({
      pageSize: 'A4', printBackground: true,
      margins: { marginType: 'custom', top: 0.55, bottom: 0.55, left: 0.47, right: 0.47 },
    });
    const pdfPath = path.join(dir, 'report.pdf');
    fs.writeFileSync(pdfPath, pdf);

    out.pdf = inspectPdf(pdf);
    out.pdfPath = pdfPath;

    // Byte-for-byte reproducibility of the PDF itself.
    const pdf2 = await win.webContents.printToPDF({
      pageSize: 'A4', printBackground: true,
      margins: { marginType: 'custom', top: 0.55, bottom: 0.55, left: 0.47, right: 0.47 },
    });
    out.pdfReproducible = Buffer.compare(pdf, pdf2) === 0;

    win.destroy();
    out.ok = true;
  } catch (error) {
    out.ok = false;
    out.error = error.message;
  }
  console.log('VJ019_RESULT=' + JSON.stringify(out, null, 2));
  app.exit(out.ok ? 0 : 1);
});
