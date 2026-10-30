import type { Metadata } from 'next';
import KpLuckyTimeView from './KpLuckyTimeView';

export const metadata: Metadata = {
  title: 'KP நல்ல நேரம் — Kotravel Vedic Astrology',
  description: 'Krishnamurti Paddhati lucky timings (Reader V): the periods, the Moon star-sub windows and the ascendant moments governed by the planets that signify the houses of a matter.',
};

export default function KpLuckyTimePage() {
  return <KpLuckyTimeView />;
}
