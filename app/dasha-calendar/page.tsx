import type { Metadata } from 'next';
import DashaCalendarView from './DashaCalendarView';

export const metadata: Metadata = {
  title: 'தசா நாட்காட்டி (Calendar) — Kotravel Vedic Astrology',
  description: 'The Vimshottari mahadasha and antardasha combination written on each day it begins, for one month at a time.',
};

export default function DashaCalendarPage() {
  return <DashaCalendarView />;
}
