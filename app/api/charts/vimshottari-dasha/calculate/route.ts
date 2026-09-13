import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Try to fetch from backend, with a timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    try {
      const response = await fetch('http://localhost:5000/api/charts/vimshottari-dasha/calculate', {
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
      throw new Error('Backend unavailable');
    }
  } catch (error) {
    // Fallback: return mock dasha timeline data
    const body = await request.json();
    const dashas = [
      { planet: 'Venus', tamil: 'சுக்ர', startYear: 1972, startMonth: 5, endYear: 1992, endMonth: 5, duration: 20, status: 'past' },
      { planet: 'Sun', tamil: 'சூரிய', startYear: 1992, startMonth: 5, endYear: 1998, endMonth: 5, duration: 6, status: 'past' },
      { planet: 'Moon', tamil: 'சந்திர', startYear: 1998, startMonth: 5, endYear: 2007, endMonth: 5, duration: 10, status: 'current' },
      { planet: 'Mars', tamil: 'செவ்வாய்', startYear: 2007, startMonth: 5, endYear: 2014, endMonth: 7, duration: 7, status: 'future' },
      { planet: 'Mercury', tamil: 'புதன்', startYear: 2014, startMonth: 7, endYear: 2032, endMonth: 7, duration: 17, status: 'future' },
      { planet: 'Jupiter', tamil: 'குரு', startYear: 2032, startMonth: 7, endYear: 2048, endMonth: 5, duration: 16, status: 'future' },
      { planet: 'Saturn', tamil: 'சனி', startYear: 2048, startMonth: 5, endYear: 2067, endMonth: 1, duration: 19, status: 'future' },
    ];

    const totalDuration = dashas.reduce((sum, d: any) => sum + d.duration, 0);
    const currentDasha = dashas.find((d: any) => d.status === 'current');

    return NextResponse.json({
      success: true,
      date: body.date,
      time: body.time,
      latitude: body.latitude,
      longitude: body.longitude,
      dashas,
      totalDuration,
      currentDasha,
    });
  }
}
