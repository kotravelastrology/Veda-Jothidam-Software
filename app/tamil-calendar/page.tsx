import type { Metadata } from 'next';
import TamilCalendarView from './TamilCalendarView';

export const metadata: Metadata = {
  title: 'தமிழ் நாட்காட்டி (Tamil calendar) — Kotravel Vedic Astrology',
};

export default function TamilCalendarPage() {
  return <TamilCalendarView />;
}
