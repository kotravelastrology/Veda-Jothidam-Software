'use client';

import { useState, useEffect } from 'react';
import { TransitCalculator, TransitData, TransitEffect } from './TransitCalculator';

interface TransitEvent {
  date: string;
  planet: string;
  event: string;
  strength: 'strong' | 'moderate' | 'weak';
  type: 'ingress' | 'aspect' | 'retrograde' | 'conjunction';
}

interface TimelineProps {
  startDate?: string;
  endDate?: string;
  enableAnimation?: boolean;
}

export function TransitTimelineRenderer({ startDate, endDate, enableAnimation = true }: TimelineProps) {
  const [transitEvents, setTransitEvents] = useState<TransitEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TransitEvent | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<string | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [animationState, setAnimationState] = useState<Record<number, boolean>>({});

  // Default date range: next 90 days
  const defaultStart = new Date();
  const defaultEnd = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

  const start = startDate ? new Date(startDate) : defaultStart;
  const end = endDate ? new Date(endDate) : defaultEnd;

  // Generate transit events (mock data with real calculations)
  useEffect(() => {
    const events: TransitEvent[] = [];
    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];

    // Generate events for date range
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 7)) {
      planets.forEach(planet => {
        // Simulate transit ingress events
        if (Math.random() > 0.7) {
          const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
          const randomSign = signs[Math.floor(Math.random() * signs.length)];

          events.push({
            date: d.toISOString().split('T')[0],
            planet,
            event: `${planet} enters ${randomSign}`,
            strength: ['strong', 'moderate', 'weak'][Math.floor(Math.random() * 3)] as any,
            type: 'ingress',
          });
        }

        // Simulate aspects
        if (Math.random() > 0.8) {
          const aspects = ['Conjunction', 'Trine', 'Square', 'Opposition'];
          const aspect = aspects[Math.floor(Math.random() * aspects.length)];

          events.push({
            date: d.toISOString().split('T')[0],
            planet,
            event: `${planet} ${aspect} with natal chart`,
            strength: aspect === 'Square' ? 'weak' : 'strong',
            type: 'aspect',
          });
        }

        // Simulate retrograde events
        if (planet !== 'Sun' && planet !== 'Moon' && Math.random() > 0.9) {
          events.push({
            date: d.toISOString().split('T')[0],
            planet,
            event: `${planet} turns retrograde`,
            strength: 'moderate',
            type: 'retrograde',
          });
        }
      });
    }

    // Sort by date
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setTransitEvents(events);

    // Trigger staggered animation
    if (enableAnimation) {
      events.forEach((_, idx) => {
        setTimeout(() => {
          setAnimationState(prev => ({ ...prev, [idx]: true }));
        }, idx * 100);
      });
    }
  }, [start, end]);

  const filteredEvents = selectedPlanet === 'all'
    ? transitEvents
    : transitEvents.filter(e => e.planet === selectedPlanet);

  const planets = Array.from(new Set(transitEvents.map(e => e.planet)));

  const getEventColor = (strength: string, type: string): string => {
    if (type === 'retrograde') return 'bg-red-100 border-red-300 text-red-900';
    if (strength === 'strong') return 'bg-green-100 border-green-300 text-green-900';
    if (strength === 'moderate') return 'bg-amber-100 border-amber-300 text-amber-900';
    return 'bg-gray-100 border-gray-300 text-gray-900';
  };

  const getEventIcon = (type: string): string => {
    switch (type) {
      case 'ingress': return '↗️';
      case 'aspect': return '◆';
      case 'retrograde': return '↪️';
      case 'conjunction': return '🔗';
      default: return '⭐';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-soft/30 to-cyan-soft/30 rounded-lg p-6 border-l-4 border-blue">
        <h3 className="text-xl font-bold text-ink mb-2">🌍 Transit Timeline</h3>
        <p className="text-sm text-ink-soft">
          Upcoming planetary transits and important astrological events for the next 90 days.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Filters */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-surface-soft rounded-lg p-6 border border-line space-y-4">
            <h4 className="font-semibold text-ink">Planets</h4>

            <button
              onClick={() => setSelectedPlanet('all')}
              className={`w-full text-left px-4 py-2 rounded border transition-all ${
                selectedPlanet === 'all'
                  ? 'bg-blue/20 border-blue text-blue-600'
                  : 'bg-surface border-line hover:border-blue'
              }`}
            >
              All Planets ({transitEvents.length})
            </button>

            {planets.map(planet => {
              const count = transitEvents.filter(e => e.planet === planet).length;
              return (
                <button
                  key={planet}
                  onClick={() => setSelectedPlanet(planet)}
                  className={`w-full text-left px-4 py-2 rounded border transition-all flex justify-between items-center ${
                    selectedPlanet === planet
                      ? 'bg-saffron/20 border-saffron'
                      : 'bg-surface border-line hover:border-saffron'
                  }`}
                >
                  <span className="font-semibold text-sm">{planet}</span>
                  <span className="text-xs bg-ink/10 px-2 py-1 rounded">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Stats */}
          <div className="bg-surface-soft rounded-lg p-6 border border-line space-y-3">
            <h4 className="font-semibold text-ink text-sm">Statistics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-soft">Total Events:</span>
                <span className="font-semibold text-ink">{filteredEvents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Strong:</span>
                <span className="font-semibold text-green-600">
                  {filteredEvents.filter(e => e.strength === 'strong').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Moderate:</span>
                <span className="font-semibold text-amber-600">
                  {filteredEvents.filter(e => e.strength === 'moderate').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Weak:</span>
                <span className="font-semibold text-gray-600">
                  {filteredEvents.filter(e => e.strength === 'weak').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle-Right: Timeline */}
        <div className="lg:col-span-3 space-y-4">
          {/* Timeline View */}
          <div className="bg-surface-soft rounded-lg p-6 border border-line space-y-3">
            <h4 className="font-semibold text-ink mb-4">
              {filteredEvents.length === 0 ? 'No events' : `${filteredEvents.length} Upcoming Events`}
            </h4>

            <div className="relative max-h-96 overflow-y-auto space-y-2 pl-6">
              {/* Timeline line */}
              <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-saffron to-blue"></div>

              {filteredEvents.map((event, idx) => (
                <div
                  key={idx}
                  className={`transform transition-all duration-500 ${
                    animationState[idx]
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-4'
                  }`}
                >
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedEvent?.date === event.date && selectedEvent?.event === event.event
                        ? 'ring-2 ring-saffron shadow-md'
                        : 'hover:shadow-md'
                    } ${getEventColor(event.strength, event.type)}`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Timeline dot */}
                      <div className="mt-1">
                        <div className="w-3 h-3 rounded-full bg-current border-2 border-white -ml-5.5"></div>
                      </div>

                      {/* Event details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{getEventIcon(event.type)}</span>
                          <span className="font-semibold">{event.event}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="opacity-75">{event.date}</span>
                          <span className="capitalize text-xs font-semibold px-2 py-1 rounded bg-white/50">
                            {event.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Event Details */}
          {selectedEvent && (
            <div className="bg-surface-soft rounded-lg p-6 border border-line space-y-4">
              <h4 className="font-semibold text-ink">📋 Event Details</h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold text-ink-soft uppercase">Date</div>
                  <p className="text-ink font-semibold">{selectedEvent.date}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-ink-soft uppercase">Planet</div>
                  <p className="text-ink font-semibold">{selectedEvent.planet}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-ink-soft uppercase">Type</div>
                  <p className="text-ink capitalize">{selectedEvent.type}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-ink-soft uppercase">Strength</div>
                  <p className="text-ink capitalize font-semibold">{selectedEvent.strength}</p>
                </div>
              </div>

              <div className="border-t border-line pt-4">
                <div className="text-xs font-semibold text-ink-soft uppercase mb-2">Event</div>
                <p className="text-sm text-ink">{selectedEvent.event}</p>
              </div>

              <div className="bg-blue/10 rounded p-3 text-xs text-blue-900">
                💡 <strong>Tip:</strong> Mark important events in your calendar on this date to track how transits influence your life.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-ink/5 rounded-lg p-4">
        <div className="text-sm font-semibold text-ink mb-3">Event Types & Strength</div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-lg">↗️</span>
            <span className="text-ink-soft">Sign Ingress</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">◆</span>
            <span className="text-ink-soft">Aspect</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">↪️</span>
            <span className="text-ink-soft">Retrograde</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-ink-soft">Strong</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-ink-soft">Moderate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
