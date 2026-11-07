import type { Metadata } from 'next';
import { Suspense } from 'react';
import AnimatedTransitsView from './AnimatedTransitsView';

export const metadata: Metadata = {
  title: 'அனிமேஷன் கோசாரம் — Kotravel Vedic Astrology',
  description: 'The sky of any moment against the birth chart, stepped by years, months, days, hours, ascendant or navamsha, or animated.',
};

export default function AnimatedTransitsPage() {
  return (
    <Suspense fallback={null}>
      <AnimatedTransitsView />
    </Suspense>
  );
}
