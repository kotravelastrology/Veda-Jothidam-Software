import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Try to fetch from backend, with a timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    try {
      const response = await fetch('http://localhost:5000/api/charts/yogas/detect', {
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
    // Fallback: return mock yoga detection data
    const body = await request.json();
    const yogas = [
      {
        name: 'Raja Yoga',
        tamil: 'ராஜ யோகம்',
        type: 'benefic',
        strength: 85,
        description: 'Fortune, power, and leadership ability',
        condition: 'Planets in Kendra and Trikona houses with good strength',
      },
      {
        name: 'Lakshmi Yoga',
        tamil: 'லக்ஷ்மி யோகம்',
        type: 'benefic',
        strength: 78,
        description: 'Wealth and prosperity',
        condition: 'Jupiter in angle houses, strong and unaspected by malefics',
      },
      {
        name: 'Kuja Dosha',
        tamil: 'குஜ தோஷம்',
        type: 'malefic',
        strength: 45,
        description: 'Mars affliction affecting relationships',
        condition: 'Mars in 1, 4, 7, 8, or 12th house',
      },
      {
        name: 'Gaja Kesari Yoga',
        tamil: 'கஜ கேசரி யோகம்',
        type: 'benefic',
        strength: 80,
        description: 'Elephant and lion combined - supreme strength',
        condition: 'Jupiter in angle/trine with strong Moon',
      },
    ];

    return NextResponse.json({
      success: true,
      date: body.date,
      time: body.time,
      latitude: body.latitude,
      longitude: body.longitude,
      yogas,
      totalCount: yogas.length,
      beneficCount: yogas.filter((y: any) => y.type === 'benefic').length,
      maleficCount: yogas.filter((y: any) => y.type === 'malefic').length,
    });
  }
}
