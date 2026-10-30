import type { Metadata } from 'next';
import GraphicalEphemerisView from './GraphicalEphemerisView';

export const metadata: Metadata = {
  title: 'வரைபட எபிமெரிஸ் — Kotravel Vedic Astrology',
  description: 'Sidereal longitudes of the planets over months or years as a chart, with sign ingresses and retrograde and direct stations.',
};

export default function GraphicalEphemerisPage() {
  return <GraphicalEphemerisView />;
}
