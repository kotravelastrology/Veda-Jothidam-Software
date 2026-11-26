import type { MetadataRoute } from 'next';

/**
 * The web app manifest (served at /manifest.webmanifest): what a phone or a computer needs to install the program as an app with its
 * own icon and window, and the shortcuts a long press on that icon offers. The icons are drawn from public/icons/icon.svg.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Kotravel வேத ஜோதிடம்',
    short_name: 'Kotravel',
    description: 'ஒவ்வொரு கணக்கும் நூல் ஆதாரத்துடன் — பஞ்சாங்கம், ஜாதகம், தசை, முகூர்த்தம்',
    lang: 'ta',
    dir: 'ltr',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#fff8ed',
    theme_color: '#2b1b12',
    categories: ['lifestyle', 'utilities', 'education'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'இன்றைய பஞ்சாங்கம்', short_name: 'பஞ்சாங்கம்', url: '/', icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }] },
      { name: 'ஜாதக மேசை', short_name: 'ஜாதகம்', url: '/worksheet', icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }] },
      { name: 'புதிய ஜாதகம்', short_name: 'புதியது', url: '/worksheet?new=1', icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }] },
      { name: 'நல்ல நேரம்', short_name: 'நேரம்', url: '/nallaneram', icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }] },
      { name: 'முகூர்த்தம்', short_name: 'முகூர்த்தம்', url: '/muhurta', icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }] },
    ],
  };
}
