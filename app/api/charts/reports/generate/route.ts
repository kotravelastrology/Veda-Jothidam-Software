import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:5000';
const TIMEOUT_MS = 20000;

export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'INVALID_REQUEST', message: 'Body must be JSON' }, { status: 400 });
  }

  const clientName = body?.reportConfig?.clientName;
  if (!clientName) {
    return NextResponse.json(
      { error: 'INVALID_REQUEST', message: 'reportConfig.clientName is required' },
      { status: 400 },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${BACKEND_URL}/api/charts/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: 'BACKEND_ERROR',
          message: `Report service returned ${response.status} ${response.statusText}`,
          status: response.status,
        },
        { status: 502 },
      );
    }

    const pdfBuffer = await response.arrayBuffer();
    const safeName = clientName.replace(/[^\w\-. ]/g, '_');
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="astrology_report_${safeName}.pdf"`,
      },
    });
  } catch (error) {
    const aborted = error instanceof Error && error.name === 'AbortError';
    return NextResponse.json(
      {
        error: aborted ? 'BACKEND_TIMEOUT' : 'BACKEND_UNAVAILABLE',
        message: aborted
          ? `Report service did not respond within ${TIMEOUT_MS / 1000}s`
          : 'Report service is unreachable. No report was generated.',
      },
      { status: 503 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
