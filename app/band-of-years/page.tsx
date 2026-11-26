import type { Metadata } from 'next';
import BandOfYearsView from './BandOfYearsView';

export const metadata: Metadata = {
  title: 'ஆண்டுப் பட்டை (Band of Years) — Kotravel Vedic Astrology',
  description: 'The 35-year cycle of planets: which planet rules each year of a life (Raj Kumar, Gosvami, Mahajan), '
    + 'the ruler\'s progression round the zodiac and its transit now.',
};

export default function BandOfYearsPage() {
  return <BandOfYearsView />;
}
