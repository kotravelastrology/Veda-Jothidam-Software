import type { Metadata } from 'next';
import GocharaVedhaView from './GocharaVedhaView';

export const metadata: Metadata = {
  title: 'கோசார வேதை (Gochara Vedha) — Kotravel Vedic Astrology',
  description: 'Gochara vedha and vipareetha vedha for all nine planets from the natal Moon, as dated '
    + 'windows, with five books compared cell by cell and the most-explained book as the default.',
};

export default function GocharaVedhaPage() {
  return <GocharaVedhaView />;
}
