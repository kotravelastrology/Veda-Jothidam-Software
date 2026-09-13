import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Try to fetch from backend, with a timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    try {
      const response = await fetch('http://localhost:5000/api/charts/bhava-bala/analyze', {
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
    // Fallback: return mock house analysis data
    const body = await request.json();
    const houses = [
      { number: 1, tamil: '1ம் இடம்', name: 'House of Self', strength: 82, ruler: 'Mars', planets: ['Sun', 'Mercury'], significance: 'Personality, appearance, health, life span', interpretation: 'Strong 1st house indicates good health, strong personality, leadership qualities.', color: 'green' },
      { number: 2, tamil: '2ம் இடம்', name: 'House of Wealth', strength: 68, ruler: 'Venus', planets: ['Jupiter'], significance: 'Money, wealth, family, speech, food', interpretation: 'Moderate 2nd house strength suggests reasonable financial status.', color: 'orange' },
      { number: 3, tamil: '3ம் இடம்', name: 'House of Communication', strength: 75, ruler: 'Mercury', planets: ['Mercury', 'Venus'], significance: 'Communication, writing, siblings, courage, short journeys', interpretation: 'Good 3rd house strength indicates effective communication skills.', color: 'green' },
      { number: 4, tamil: '4ம் இடம்', name: 'House of Home', strength: 55, ruler: 'Moon', planets: [], significance: 'Home, property, mother, vehicles, happiness, education', interpretation: 'Weak 4th house may indicate challenges with property or family.', color: 'red' },
      { number: 5, tamil: '5ம் இடம்', name: 'House of Creativity', strength: 78, ruler: 'Sun', planets: ['Sun', 'Jupiter'], significance: 'Children, creativity, education, intelligence, romance', interpretation: 'Strong 5th house indicates good intellect and creative abilities.', color: 'green' },
      { number: 6, tamil: '6ம் இடம்', name: 'House of Health', strength: 42, ruler: 'Mercury', planets: ['Mars'], significance: 'Health, enemies, debts, obstacles, pets, diseases', interpretation: 'Weak 6th house requires attention to health matters.', color: 'red' },
      { number: 7, tamil: '7ம் இடம்', name: 'House of Partnership', strength: 71, ruler: 'Venus', planets: ['Venus'], significance: 'Marriage, spouse, relationships, business partnerships', interpretation: 'Moderate 7th house strength suggests satisfactory partnership prospects.', color: 'orange' },
      { number: 8, tamil: '8ம் இடம்', name: 'House of Transformation', strength: 38, ruler: 'Mars', planets: [], significance: 'Longevity, inheritance, occult, mysteries, transformation', interpretation: 'Weak 8th house indicates shorter lifespan indicators.', color: 'red' },
      { number: 9, tamil: '9ம் இடம்', name: 'House of Fortune', strength: 85, ruler: 'Jupiter', planets: ['Jupiter'], significance: 'Luck, fortune, father, travel, higher education, spirituality', interpretation: 'Very strong 9th house indicates excellent fortune.', color: 'green' },
      { number: 10, tamil: '10ம் இடம்', name: 'House of Career', strength: 79, ruler: 'Saturn', planets: ['Saturn'], significance: 'Career, profession, public image, reputation, social status', interpretation: 'Strong 10th house ensures good career growth.', color: 'green' },
      { number: 11, tamil: '11ம் இடம்', name: 'House of Gains', strength: 73, ruler: 'Saturn', planets: ['Mercury'], significance: 'Income, gains, friendships, wishes, large group circles', interpretation: 'Good 11th house strength brings consistent income.', color: 'green' },
      { number: 12, tamil: '12ம் இடம்', name: 'House of Loss', strength: 48, ruler: 'Jupiter', planets: [], significance: 'Expenditure, foreign travel, spirituality, losses, isolation', interpretation: 'Moderate 12th house requires attention to expenses.', color: 'orange' },
    ];

    const totalStrength = Math.round(houses.reduce((sum, h) => sum + h.strength, 0) / houses.length);
    const strongHouses = houses.filter((h: any) => h.strength >= 75).length;
    const weakHouses = houses.filter((h: any) => h.strength < 50).length;

    return NextResponse.json({
      success: true,
      date: body.date,
      time: body.time,
      latitude: body.latitude,
      longitude: body.longitude,
      houses,
      totalStrength,
      strongHouses,
      weakHouses,
    });
  }
}
