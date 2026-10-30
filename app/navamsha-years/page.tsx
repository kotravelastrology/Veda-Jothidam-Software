import type { Metadata } from 'next';
import NavamshaYearsView from './NavamshaYearsView';

export const metadata: Metadata = {
  title: 'நவாம்ச எண்ணிக்கை (நவாம்ச வயது) — Kotravel Vedic Astrology',
  description: 'The count of navamshas between the ascendant and each planet, read as a year of life, with what each book says.',
};

export default function NavamshaYearsPage() {
  return <NavamshaYearsView />;
}
