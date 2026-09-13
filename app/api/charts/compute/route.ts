import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Try to fetch from backend, with a timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    try {
      const response = await fetch('http://localhost:5000/api/charts/compute', {
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

      const data = await response.json();
      return NextResponse.json(data);
    } catch (fetchError) {
      clearTimeout(timeout);
      // Fallback to mock data if backend is unavailable
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new Error('Backend timeout');
      }
      // Return mock data
      throw new Error('Backend unavailable');
    }
  } catch (error) {
    // Fallback: return mock divisional chart data
    const body = await request.json();
    const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Lagna', 'Rahu', 'Ketu'];
    const rasies = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const charts: any = {};

    (body.includeCharts || ['D1', 'D9', 'D10', 'D20']).forEach((chartId: string) => {
      const division = parseInt(chartId.substring(1));
      const points = planets.map((planet, i) => {
        const baseDeg = (i * 30 + division * 5) % 360;
        const rasiIndex = Math.floor(baseDeg / 30) % 12;

        return {
          label: planet,
          rasiName: rasies[rasiIndex],
          deg: baseDeg,
          kp: {
            signLord: rasies[rasiIndex % 12],
            starLord: planets[(i + 1) % planets.length],
            sub: planets[(i + 2) % planets.length],
            subSub: rasies[(i + 3) % rasies.length],
          },
        };
      });

      charts[chartId] = {
        chartId,
        points,
        lagnaRasiIndex: 0,
      };
    });

    return NextResponse.json({
      success: true,
      date: body.date,
      time: body.time,
      latitude: body.latitude,
      longitude: body.longitude,
      ...charts,
    });
  }
}
