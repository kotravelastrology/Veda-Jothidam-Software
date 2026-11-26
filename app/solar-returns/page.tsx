import type { Metadata } from 'next';
import SolarReturnsView from './SolarReturnsView';

export const metadata: Metadata = {
  title: 'வருஷ · மாத · தின பிரவேசம் (Solar Returns) — Kotravel Vedic Astrology',
  description: 'Annual, monthly and daily solar returns, cast at the birthplace and at '
    + 'where the native lives now. The step convention for monthly and daily is stated '
    + 'on screen and is not yet source-verified.',
};

export default function SolarReturnsPage() {
  return <SolarReturnsView />;
}
