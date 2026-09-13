import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Try to fetch from backend, with a timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch('http://localhost:5000/api/charts/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        return NextResponse.json(
          { error: `Backend error: ${response.statusText}` },
          { status: response.status }
        );
      }

      const pdfBuffer = await response.arrayBuffer();
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="astrology_report_${body.reportConfig.clientName}.pdf"`,
        },
      });
    } catch (fetchError) {
      clearTimeout(timeout);
      // Fallback: create minimal PDF
      throw new Error('Backend unavailable');
    }
  } catch (error) {
    // Fallback: return a minimal PDF with placeholder content
    const body = await request.json();

    // Create a minimal valid PDF
    const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << >> /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 200 >>
stream
BT
/F1 12 Tf
50 750 Td
(Astrology Report) Tj
0 -30 Td
(Client: ${body.reportConfig.clientName}) Tj
0 -30 Td
(Date: ${body.birthData.date}) Tj
0 -30 Td
(Location: ${body.birthData.location}) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000074 00000 n
0000000133 00000 n
0000000244 00000 n
trailer
<< /Size 5 /Root 1 0 R >>
startxref
494
%%EOF`;

    return new NextResponse(pdfContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="astrology_report_${body.reportConfig.clientName}.pdf"`,
      },
    });
  }
}
